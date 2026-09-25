import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

const SYSTEM_PERSONA =
  'You are LearnAI Bot, a concise, friendly mentor for absolute beginners learning to code with AI. ' +
  'Answer in plain language. When you show code, keep it short and runnable. ' +
  'Prefer honesty over hand-holding — if something is hard, say so. ' +
  'Stay on topic: git, Python, LLM APIs, prompting, deployment, agents. ' +
  'Keep replies under ~150 words unless the user asks for depth.'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const incoming: Msg[] = Array.isArray(body?.messages) ? body.messages : []

    if (incoming.length === 0) {
      return NextResponse.json(
        { error: 'messages[] is required' },
        { status: 400 },
      )
    }

    // Build the conversation. The z-ai SDK accepts the assistant role for the
    // system prompt per its convention; we prepend our persona.
    const messages = [
      { role: 'assistant', content: SYSTEM_PERSONA },
      ...incoming
        .filter((m) => typeof m?.content === 'string' && m.content.trim().length > 0)
        .slice(-12) // keep last 12 turns to bound context
        .map((m) => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
    ]

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })

    const reply = completion.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return NextResponse.json(
        { error: 'the model returned an empty response' },
        { status: 502 },
      )
    }

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('[playground/chat] error:', err?.message ?? err)
    return NextResponse.json(
      { error: err?.message || 'chat failed' },
      { status: 500 },
    )
  }
}
