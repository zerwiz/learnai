import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type SearchResult = {
  name: string
  url: string
  snippet: string
  host_name: string
  date?: string
  favicon?: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const query = typeof body?.query === 'string' ? body.query.trim() : ''

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    const zai = await ZAI.create()
    const raw = await zai.functions.invoke('web_search', {
      query,
      num: 8,
    })

    const results: SearchResult[] = Array.isArray(raw)
      ? raw.map((r: any) => ({
          name: r.name ?? '',
          url: r.url ?? '',
          snippet: r.snippet ?? '',
          host_name: r.host_name ?? '',
          date: r.date,
          favicon: r.favicon,
        }))
      : []

    return NextResponse.json({ query, results })
  } catch (err: any) {
    console.error('[playground/search] error:', err?.message ?? err)
    return NextResponse.json(
      { error: err?.message || 'search failed' },
      { status: 500 },
    )
  }
}
