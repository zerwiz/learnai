import { NextResponse } from 'next/server'

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

// A web-search backend is configured by env (RULES/07). Supported providers:
//   searxng  SEARCH_API_URL (e.g. http://127.0.0.1:8888)
//   brave    SEARCH_API_KEY
//   tavily   SEARCH_API_KEY
//   custom   SEARCH_API_URL + optional SEARCH_API_KEY (POST {query,num} -> {results})
const SEARCH_PROVIDER = (process.env.SEARCH_PROVIDER || '').toLowerCase()
const SEARCH_API_URL = (process.env.SEARCH_API_URL || '').replace(/\/$/, '')
const SEARCH_API_KEY = process.env.SEARCH_API_KEY || ''

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function normalize(rows: any[]): SearchResult[] {
  return rows
    .map((r: any) => {
      const url = String(r.url ?? r.link ?? r.href ?? '')
      return {
        name: String(r.name ?? r.title ?? ''),
        url,
        snippet: String(r.snippet ?? r.content ?? r.description ?? r.body ?? ''),
        host_name: String(r.host_name ?? r.hostname ?? hostOf(url)),
        date: r.date ?? r.published ?? r.age,
        favicon: r.favicon,
      }
    })
    .filter((r) => r.url && r.name)
}

async function search(query: string, num: number): Promise<SearchResult[]> {
  if (SEARCH_PROVIDER === 'searxng') {
    if (!SEARCH_API_URL) throw new Error('SEARCH_API_URL is required for searxng')
    const u = new URL(`${SEARCH_API_URL}/search`)
    u.searchParams.set('q', query)
    u.searchParams.set('format', 'json')
    u.searchParams.set('safesearch', '1')
    const res = await fetch(u, {
      headers: SEARCH_API_KEY ? { Authorization: `Bearer ${SEARCH_API_KEY}` } : {},
    })
    if (!res.ok) throw new Error(`searxng responded ${res.status}`)
    const data = await res.json()
    return normalize(data?.results ?? []).slice(0, num)
  }

  if (SEARCH_PROVIDER === 'brave') {
    if (!SEARCH_API_KEY) throw new Error('SEARCH_API_KEY is required for brave')
    const u = new URL('https://api.search.brave.com/res/v1/web/search')
    u.searchParams.set('q', query)
    u.searchParams.set('count', String(Math.min(num, 20)))
    const res = await fetch(u, {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': SEARCH_API_KEY,
      },
    })
    if (!res.ok) throw new Error(`brave responded ${res.status}`)
    const data = await res.json()
    return normalize(data?.web?.results ?? []).slice(0, num)
  }

  if (SEARCH_PROVIDER === 'tavily') {
    if (!SEARCH_API_KEY) throw new Error('SEARCH_API_KEY is required for tavily')
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: SEARCH_API_KEY,
        query,
        max_results: Math.min(num, 20),
        search_depth: 'basic',
      }),
    })
    if (!res.ok) throw new Error(`tavily responded ${res.status}`)
    const data = await res.json()
    return normalize(data?.results ?? []).slice(0, num)
  }

  if (SEARCH_PROVIDER === 'custom') {
    if (!SEARCH_API_URL) throw new Error('SEARCH_API_URL is required for custom')
    const res = await fetch(SEARCH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SEARCH_API_KEY ? { Authorization: `Bearer ${SEARCH_API_KEY}` } : {}),
      },
      body: JSON.stringify({ query, num }),
    })
    if (!res.ok) throw new Error(`search backend responded ${res.status}`)
    const data = await res.json()
    const rows = Array.isArray(data) ? data : (data?.results ?? data?.data ?? [])
    return normalize(rows).slice(0, num)
  }

  throw new Error('NO_PROVIDER')
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(SEARCH_PROVIDER),
    provider: SEARCH_PROVIDER || null,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const query = typeof body?.query === 'string' ? body.query.trim() : ''

    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    const results = await search(query, 8)
    return NextResponse.json({ query, results })
  } catch (err: any) {
    const msg = err?.message || 'search failed'
    if (msg === 'NO_PROVIDER') {
      return NextResponse.json(
        {
          error:
            'web search is not configured on this deployment (set SEARCH_PROVIDER)',
          configured: false,
        },
        { status: 503 },
      )
    }
    console.error('[playground/search] error:', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
