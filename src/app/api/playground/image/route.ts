import { NextResponse } from 'next/server'

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

// Any OpenAI-compatible images endpoint works (OpenAI, a gateway, a local
// server). Configuration resolves from env with one documented default.
const IMAGE_BASE_URL = (process.env.IMAGE_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
const IMAGE_API_KEY = process.env.IMAGE_API_KEY || ''
const IMAGE_MODEL = process.env.IMAGE_MODEL || 'gpt-image-1'

export async function GET() {
  return NextResponse.json({
    configured: Boolean(IMAGE_API_KEY),
    model: IMAGE_MODEL,
    endpoint: IMAGE_BASE_URL,
    sizes: [...SUPPORTED_SIZES],
  })
}

export async function POST(req: Request) {
  try {
    if (!IMAGE_API_KEY) {
      return NextResponse.json(
        {
          error:
            'image generation is not configured on this deployment (set IMAGE_API_KEY)',
          configured: false,
        },
        { status: 503 },
      )
    }

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

    const upstream = await fetch(`${IMAGE_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${IMAGE_API_KEY}`,
      },
      body: JSON.stringify({ model: IMAGE_MODEL, prompt, size, n: 1 }),
      signal: req.signal,
    })

    const data = await upstream.json().catch(() => null)

    if (!upstream.ok) {
      const detail = data?.error?.message || ''
      console.error('[playground/image] upstream', upstream.status, JSON.stringify(data).slice(0, 400))
      return NextResponse.json(
        {
          error:
            upstream.status === 401
              ? 'the image provider rejected the key (IMAGE_API_KEY)'
              : `image provider error ${upstream.status}`,
          detail: detail.slice(0, 400),
        },
        { status: 502 },
      )
    }

    const item = data?.data?.[0]
    const base64 = item?.b64_json
    const url = item?.url

    if (!base64 && !url) {
      return NextResponse.json(
        { error: 'image generation returned no data' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      image: base64 ? `data:image/png;base64,${base64}` : url,
      prompt,
      size,
      model: IMAGE_MODEL,
    })
  } catch (err: any) {
    console.error('[playground/image] error:', err?.message ?? err)
    return NextResponse.json(
      { error: err?.message || 'image generation failed' },
      { status: 500 },
    )
  }
}
