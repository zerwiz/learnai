import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

// The rail is an OpenAI-compatible llama.cpp router (llama-swap on :8080).
// Configuration resolves from env with one documented default (RULES/07).
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'http://127.0.0.1:8080/v1').replace(/\/$/, '')
const LLM_API_KEY = process.env.LLM_API_KEY || ''
const LLM_MODEL = process.env.LLM_MODEL || 'qwen3.6-35b-a3b@q4_k_xl-mtp'

const SYSTEM_PERSONA =
  'You are LearnAI Bot, a concise, friendly mentor for absolute beginners learning to code with AI. ' +
  'Answer in plain language. When you show code, keep it short and runnable. ' +
  'Prefer honesty over hand-holding — if something is hard, say so. ' +
  'Stay on topic: git, Python, LLM APIs, prompting, deployment, agents. ' +
  'Keep replies under ~150 words unless the user asks for depth.'

export async function GET() {
  return NextResponse.json({
    model: LLM_MODEL,
    endpoint: LLM_BASE_URL,
    streaming: true,
  })
}

export async function POST(req: Request) {
  let incoming: Msg[] = []
  let stream = true

  try {
    const body = await req.json().catch(() => ({}))
    incoming = Array.isArray(body?.messages) ? body.messages : []
    if (typeof body?.stream === 'boolean') stream = body.stream

    if (incoming.length === 0) {
      return NextResponse.json({ error: 'messages[] is required' }, { status: 400 })
    }

    const messages = [
      { role: 'system', content: SYSTEM_PERSONA },
      ...incoming
        .filter((m) => typeof m?.content === 'string' && m.content.trim().length > 0)
        .slice(-12)
        .map((m) => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
    ]

    const upstream = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(LLM_API_KEY ? { Authorization: `Bearer ${LLM_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1024,
        stream,
        // Qwen3 honours this; harmless where unsupported.
        chat_template_kwargs: { enable_thinking: false },
      }),
      signal: req.signal,
    })

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      console.error('[playground/chat] upstream', upstream.status, detail.slice(0, 400))
      return NextResponse.json(
        {
          error:
            upstream.status === 401
              ? 'the model rail rejected the key (LLM_API_KEY)'
              : upstream.status === 404
                ? `model "${LLM_MODEL}" not found on the rail`
                : `model rail error ${upstream.status}`,
          detail: detail.slice(0, 400),
        },
        { status: 502 },
      )
    }

    // Non-streaming: hand back the plain reply.
    if (!stream || !upstream.body) {
      const data = await upstream.json().catch(() => null)
      const reply = data?.choices?.[0]?.message?.content?.trim()
      if (!reply) {
        return NextResponse.json({ error: 'the model returned an empty response' }, { status: 502 })
      }
      return NextResponse.json({ reply, model: LLM_MODEL })
    }

    // Streaming: pass upstream SSE through, emitting our own `delta` events.
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const readable = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader()
        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const payload = trimmed.slice(5).trim()
              if (payload === '[DONE]') continue
              try {
                const chunk = JSON.parse(payload)
                const delta = chunk?.choices?.[0]?.delta?.content
                if (delta) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`),
                  )
                }
              } catch {
                /* ignore keep-alives and partial frames */
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err?.message || 'stream failed' })}\n\n`,
            ),
          )
        } finally {
          controller.close()
        }
      },
      cancel() {
        upstream.body?.cancel().catch(() => {})
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Model': LLM_MODEL,
      },
    })
  } catch (err: any) {
    console.error('[playground/chat] error:', err?.message ?? err)
    return NextResponse.json(
      { error: err?.message || 'chat failed' },
      { status: 500 },
    )
  }
}
