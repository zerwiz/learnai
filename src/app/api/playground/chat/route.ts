import { NextResponse } from 'next/server'
import { getLesson, getTrack, tracks } from '@/lib/course-data'
import {
  LESSON_EXCERPT_LIMIT,
  type ChatContext,
  type GroundingLevel,
} from '@/lib/chat-context'

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

// Kill-switch: off | track | lesson. Dialled back without a redeploy.
const GROUNDING: GroundingLevel = (
  ['off', 'track', 'lesson'].includes(process.env.CHAT_GROUNDING || '')
    ? process.env.CHAT_GROUNDING
    : 'track'
) as GroundingLevel

/**
 * Ground the persona in the reader's actual place in the course.
 *
 * The client sends facts only. Everything below is resolved against
 * course-data.ts, so a forged trackId/lessonId resolves to nothing and is
 * simply ignored — no client text ever reaches the system prompt.
 */
function buildSystemPrompt(ctx?: ChatContext): { prompt: string; grounded: boolean } {
  if (GROUNDING === 'off' || !ctx) {
    return { prompt: SYSTEM_PERSONA, grounded: false }
  }

  const parts = [SYSTEM_PERSONA]

  // Never trust the client's titles — resolve our own.
  const track = ctx.trackId ? getTrack(ctx.trackId) : undefined
  const found = track && ctx.lessonId ? getLesson(track.id, ctx.lessonId) : undefined
  const lesson = found?.lesson
  const trackTitle = track?.title

  if (trackTitle) {
    const n = track!.lessons.length
    parts.push(
      `The reader is working through this course and is currently in track ${track!.number} — "${trackTitle}" (${n} lessons).`,
    )
  }

  if (lesson) {
    parts.push(
      `They are reading the lesson "${lesson.title}" (${lesson.difficulty}, ~${lesson.duration}). Ground your answer in this lesson where it helps, but answer their actual question — do not lecture them about the lesson, and do not invent quotes from it.`,
    )

    if (GROUNDING === 'lesson') {
      const excerpt = excerptFromLesson(lesson.blocks)
      if (excerpt) {
        parts.push(`Excerpt from the lesson the reader is on:\n"""\n${excerpt}\n"""`)
      }
    }
  }

  // Only count completions the course actually knows about.
  const known = new Set(tracks.flatMap((t) => t.lessons.map((l) => `${t.id}.${l.id}`)))
  const done = (ctx.completedLessonIds ?? []).filter((id) => known.has(id))
  if (done.length > 0) {
    parts.push(
      `They have already completed ${done.length} earlier lesson${done.length === 1 ? '' : 's'} in this course. Do not re-explain material they have already met — build on it.`,
    )
  }

  return { prompt: parts.join('\n\n'), grounded: trackTitle !== undefined }
}

/** Flatten the reader's own lesson into a bounded, text-only excerpt. */
function excerptFromLesson(blocks: { type: string; text?: string; code?: string; caption?: string }[]): string {
  const lines: string[] = []
  for (const b of blocks) {
    if (lines.join('\n').length >= LESSON_EXCERPT_LIMIT) break
    if (b.type === 'p' || b.type === 'tip' || b.type === 'warn' || b.type === 'try') {
      lines.push(b.text ?? '')
    } else if (b.type === 'h') {
      lines.push(`## ${b.text ?? ''}`)
    } else if (b.type === 'code' && b.caption) {
      lines.push(`(code example: ${b.caption})`)
    }
  }
  return lines.join('\n').trim().slice(0, LESSON_EXCERPT_LIMIT)
}

export async function GET() {
  return NextResponse.json({
    model: LLM_MODEL,
    endpoint: LLM_BASE_URL,
    streaming: true,
    grounding: GROUNDING,
  })
}

export async function POST(req: Request) {
  let incoming: Msg[] = []
  let stream = true
  let context: ChatContext | undefined

  try {
    const body = await req.json().catch(() => ({}))
    incoming = Array.isArray(body?.messages) ? body.messages : []
    if (typeof body?.stream === 'boolean') stream = body.stream
    if (body?.context && typeof body.context === 'object') {
      context = body.context as ChatContext
    }

    if (incoming.length === 0) {
      return NextResponse.json({ error: 'messages[] is required' }, { status: 400 })
    }

    const { prompt: systemPrompt, grounded } = buildSystemPrompt(context)

    const messages = [
      { role: 'system', content: systemPrompt },
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
      return NextResponse.json({ reply, model: LLM_MODEL, grounded })
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
        'X-Grounded': grounded ? '1' : '0',
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
