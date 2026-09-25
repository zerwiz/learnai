'use client'

import * as React from 'react'
import {
  Bot,
  ImageIcon,
  Loader2,
  Search,
  Send,
  Sparkles,
  Terminal,
  User,
  Zap,
  RotateCcw,
  ExternalLink,
  Code2,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/* ----------------------------- shared bits ----------------------------- */

function PanelLabel({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5 text-primary" />
      {children}
    </div>
  )
}

function CurlHint({ label, code }: { label: string; code: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="mt-3 rounded-lg border border-border/60 bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <Code2 className="size-3.5" />
          {open ? 'hide' : 'show'} the api call ({label})
        </span>
        <span className="text-primary">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <pre className="scroll-geek overflow-x-auto border-t border-border/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {code}
        </pre>
      )}
    </div>
  )
}

/* ------------------------------- CHAT ------------------------------- */

type ChatMsg = { role: 'user' | 'assistant'; content: string }

function ChatPanel() {
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    {
      role: 'assistant',
      content:
        "hey geek. i'm a real model running behind a real API. ask me anything about git, python, or AI — or ask me to write some code.",
    },
  ])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [model, setModel] = React.useState<string>('the rail')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    let alive = true
    fetch('/api/playground/chat')
      .then((r) => r.json())
      .then((d) => alive && d?.model && setModel(d.model))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(e?: React.FormEvent) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setError(null)
    const next: ChatMsg[] = [...messages, { role: 'user', content: text }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/playground/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || `HTTP ${res.status}`)
      }
      if (!res.body) throw new Error('the model gave no response stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let acc = ''

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
          if (!payload || payload === '[DONE]') continue

          let evt: { delta?: string; error?: string } | null = null
          try {
            evt = JSON.parse(payload)
          } catch {
            continue
          }
          if (!evt) continue
          if (evt.error) throw new Error(evt.error)
          if (evt.delta) {
            acc += evt.delta
            setMessages((m) => {
              const copy = [...m]
              copy[copy.length - 1] = { role: 'assistant', content: acc }
              return copy
            })
          }
        }
      }

      if (!acc.trim()) throw new Error('the model returned an empty response')
    } catch (err: any) {
      setError(err?.message || 'the model call failed. try again.')
      setMessages((m) =>
        m.length && m[m.length - 1].role === 'assistant' && !m[m.length - 1].content
          ? m.slice(0, -1)
          : m,
      )
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessages([
      {
        role: 'assistant',
        content: 'cleared. what do you want to build?',
      },
    ])
    setError(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      {/* chat column */}
      <div className="flex h-[460px] flex-col rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
          <PanelLabel icon={Bot}>live chat · {model}</PanelLabel>
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 gap-1.5 font-mono text-xs">
            <RotateCcw className="size-3.5" />
            reset
          </Button>
        </div>

        <div ref={scrollRef} className="scroll-geek flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3',
                m.role === 'user' ? 'flex-row-reverse text-right' : 'flex-row',
              )}
            >
              <div
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-lg',
                  m.role === 'user'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-primary/15 text-primary',
                )}
              >
                {m.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div
                className={cn(
                  'max-w-[78%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && !messages[messages.length - 1]?.content && (
            <div className="flex gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3.5 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={send} className="border-t border-border/60 p-3">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ask the model anything…"
              disabled={loading}
              className="font-mono text-sm"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          {error && <p className="mt-2 font-mono text-xs text-destructive">! {error}</p>}
        </form>
      </div>

      {/* educational sidebar */}
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <PanelLabel icon={Zap}>how this works</PanelLabel>
          <p className="mt-2 text-sm text-muted-foreground">
            Your message goes to a Next.js API route, which calls the model server-side
            and streams the reply back. The API key never touches your browser.
          </p>
          <CurlHint
            label="curl"
            code={`POST /api/playground/chat
{
  "messages": [
    {"role":"user","content":"${input || 'hi'}"}
  ]
}`}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <PanelLabel icon={Terminal}>try asking</PanelLabel>
          <ul className="mt-2 space-y-1.5 text-sm">
            {[
              'explain git rebase in 2 sentences',
              'write a python fibonacci function',
              'what is an OpenAI-compatible API?',
              'what does MCP stand for in AI?',
            ].map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setInput(s)}
                  className="w-full rounded-md border border-border/60 px-2.5 py-1.5 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  › {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ IMAGE ------------------------------ */

const SIZES = [
  { value: '1024x1024', label: 'square 1024' },
  { value: '1344x768', label: 'landscape' },
  { value: '768x1344', label: 'portrait' },
  { value: '1440x720', label: 'wide 1440' },
]

const PROMPT_IDEAS = [
  'a neon circuit board shaped like a brain, dark background, glowing green',
  'a friendly robot reading a book about AI, flat illustration',
  'terminal window glitch art, matrix style, emerald and amber',
  'a hacker cat with sunglasses typing on a keyboard, pixel art',
]

function ImagePanel() {
  const [prompt, setPrompt] = React.useState(PROMPT_IDEAS[0])
  const [size, setSize] = React.useState('1024x1024')
  const [image, setImage] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function generate() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError(null)
    setImage(null)
    try {
      const res = await fetch('/api/playground/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setImage(data.image)
    } catch (err: any) {
      setError(err?.message || 'image generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border/60 px-4 py-2.5">
          <PanelLabel icon={ImageIcon}>image generation</PanelLabel>
        </div>
        <div className="p-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="describe the image you want…"
            rows={3}
            className="resize-none font-mono text-sm"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="h-9 w-[160px] font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="font-mono text-xs">
                    {s.label} · {s.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={generate} disabled={loading || !prompt.trim()} className="ml-auto">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? 'generating…' : 'generate'}
            </Button>
          </div>

          {/* canvas */}
          <div className="mt-4 flex aspect-square min-h-[280px] items-center justify-center overflow-hidden rounded-lg border border-border bg-[oklch(0.12_0.008_160)] sm:aspect-[4/3]">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-primary" />
                <span className="font-mono text-xs">painting pixels…</span>
              </div>
            ) : image ? (
              <img
                src={image}
                alt={prompt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="size-10 opacity-30" />
                <span className="font-mono text-xs">your image appears here</span>
              </div>
            )}
          </div>
          {error && <p className="mt-2 font-mono text-xs text-destructive">! {error}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <PanelLabel icon={Zap}>how this works</PanelLabel>
          <p className="mt-2 text-sm text-muted-foreground">
            The server calls an image model with your prompt and size. It returns base64
            PNG data, which renders directly as an image — no file on disk needed.
          </p>
          <CurlHint
            label="curl"
            code={`POST /api/playground/image
{
  "prompt": "${prompt.slice(0, 40)}…",
  "size": "${size}"
}`}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <PanelLabel icon={Terminal}>prompt ideas</PanelLabel>
          <ul className="mt-2 space-y-1.5">
            {PROMPT_IDEAS.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="w-full rounded-md border border-border/60 px-2.5 py-1.5 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  › {p.slice(0, 46)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ SEARCH ------------------------------ */

type SearchResult = {
  name: string
  url: string
  snippet: string
  host_name: string
  date?: string
}

function SearchPanel() {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [ranQuery, setRanQuery] = React.useState('')

  async function run(e?: React.FormEvent) {
    e?.preventDefault()
    const q = query.trim()
    if (!q || loading) return
    setLoading(true)
    setError(null)
    setResults(null)
    setRanQuery(q)
    try {
      const res = await fetch('/api/playground/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setResults(data.results)
    } catch (err: any) {
      setError(err?.message || 'search failed.')
    } finally {
      setLoading(false)
    }
  }

  const quickQueries = [
    'latest python release notes',
    'what is MCP model context protocol',
    'llama.cpp vs ollama',
    'cloudflare pages free tier limits',
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border/60 px-4 py-2.5">
          <PanelLabel icon={Search}>web search · live</PanelLabel>
        </div>
        <div className="p-4">
          <form onSubmit={run} className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search the web…"
              className="font-mono text-sm"
            />
            <Button type="submit" size="icon" disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            </Button>
          </form>

          <div className="mt-4 min-h-[300px]">
            {loading && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-muted/70" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted/50" />
                  </div>
                ))}
              </div>
            )}

            {error && <p className="font-mono text-xs text-destructive">! {error}</p>}

            {!loading && results && results.length === 0 && (
              <p className="font-mono text-sm text-muted-foreground">no results. try different words.</p>
            )}

            {!loading && results && results.length > 0 && (
              <ol className="space-y-4">
                {results.map((r, i) => (
                  <li key={r.url} className="group">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <span className="text-primary">{String(i + 1).padStart(2, '0')}</span>
                      <span className="truncate">{r.host_name}</span>
                      {r.date && r.date !== 'N/A' && (
                        <span className="text-muted-foreground/60">· {r.date}</span>
                      )}
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 font-semibold transition-colors hover:text-primary"
                    >
                      {r.name}
                      <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.snippet}</p>
                  </li>
                ))}
              </ol>
            )}

            {!loading && !results && !error && (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 text-muted-foreground">
                <Search className="size-10 opacity-30" />
                <span className="font-mono text-xs">search the live web — results appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <PanelLabel icon={Zap}>how this works</PanelLabel>
          <p className="mt-2 text-sm text-muted-foreground">
            The server runs a real web search function and returns ranked results —
            title, URL, snippet, host, and date. Exactly what an agent would use.
          </p>
          <CurlHint
            label="curl"
            code={`POST /api/playground/search
{
  "query": "${query || 'your query'}"
}`}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <PanelLabel icon={Terminal}>try searching</PanelLabel>
          <ul className="mt-2 space-y-1.5">
            {quickQueries.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => setQuery(q)}
                  className="w-full rounded-md border border-border/60 px-2.5 py-1.5 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  › {q}
                </button>
              </li>
            ))}
          </ul>
          {ranQuery && (
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              last query: <span className="text-primary">{ranQuery}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- PLAYGROUND ----------------------------- */

export function Playground() {
  return (
    <section id="playground" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <Badge variant="outline" className="mb-3 font-mono">
          <span className="mr-1 size-1.5 animate-pulse rounded-full bg-primary" />
          live · real models
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Try it now — no signup.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Three real AI capabilities, running on real models behind real APIs. This is
          what Track 03 teaches you to build. Poke it. Break it. Learn from it.
        </p>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="h-auto w-full justify-start gap-1 bg-card p-1.5">
            <TabsTrigger value="chat" className="gap-1.5 font-mono text-xs">
              <Bot className="size-3.5" />
              chat
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1.5 font-mono text-xs">
              <ImageIcon className="size-3.5" />
              image
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-1.5 font-mono text-xs">
              <Search className="size-3.5" />
              search
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-4">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="image" className="mt-4">
            <ImagePanel />
          </TabsContent>
          <TabsContent value="search" className="mt-4">
            <SearchPanel />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
