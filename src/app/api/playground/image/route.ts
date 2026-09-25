import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPPORTED_SIZES = new Set([
  '1024x1024',
  '768x1344',
  '864x1152',
  '1344x768',
  '1152x864',
  '1440x720',
  '720x1440',
])

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
    const size = SUPPORTED_SIZES.has(body?.size) ? body.size : '1024x1024'

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }
    if (prompt.length > 800) {
      return NextResponse.json(
        { error: 'prompt is too long (max 800 chars)' },
        { status: 400 },
      )
    }

    const zai = await ZAI.create()
    const response = await zai.images.generations.create({ prompt, size })

    const base64 = response.data?.[0]?.base64
    if (!base64) {
      return NextResponse.json(
        { error: 'image generation returned no data' },
        { status: 502 },
      )
    }

    // Return as a data URL so the frontend can render it directly,
    // no static file handling required.
    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      prompt,
      size,
    })
  } catch (err: any) {
    console.error('[playground/image] error:', err?.message ?? err)
    return NextResponse.json(
      { error: err?.message || 'image generation failed' },
      { status: 500 },
    )
  }
}
