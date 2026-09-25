'use client'

import * as React from 'react'
import { ArrowRight, Cpu, GitBranch, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackStats } from '@/lib/course-data'

type HeroProps = {
  onExplore: () => void
  onPlayground: () => void
}

const terminalLines = [
  { prompt: '$', text: 'git clone learnai', color: 'text-foreground' },
  { prompt: '>', text: 'track 1 / git & github      ready', color: 'text-primary' },
  { prompt: '>', text: 'track 2 / python for ai   ready', color: 'text-primary' },
  { prompt: '>', text: 'track 3 / talking to models ready', color: 'text-primary' },
  { prompt: '>', text: 'track 4 / building with ai  ready', color: 'text-primary' },
  { prompt: '>', text: 'track 5 / going deeper      ready', color: 'text-primary' },
  { prompt: '$', text: 'python -m venv .venv', color: 'text-foreground' },
  { prompt: '$', text: 'pip install curiosity', color: 'text-foreground' },
  { prompt: '>', text: 'booting geek mode...', color: 'text-accent-foreground' },
]

export function Hero({ onExplore, onPlayground }: HeroProps) {
  const [visibleLines, setVisibleLines] = React.useState(0)

  React.useEffect(() => {
    if (visibleLines >= terminalLines.length) return
    const t = setTimeout(() => setVisibleLines((n) => n + 1), 280)
    return () => clearTimeout(t)
  }, [visibleLines])

  const stats = [
    { label: 'tracks', value: String(trackStats.tracks).padStart(2, '0') },
    { label: 'lessons', value: String(trackStats.lessons).padStart(2, '0') },
    { label: 'hands-on hrs', value: `${trackStats.hours}+` },
  ]

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* backdrops */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-glow" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              learn.zerwiz.org · now in session
            </div>

            <h1 className="mt-5 font-mono text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Courses for{' '}
              <span className="text-primary">AI geeks</span>
              <br />
              &amp; <span className="text-accent-foreground">freaks</span>
              <span className="cursor-blink" />
            </h1>

            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              A hands-on course for new people getting into coding with AI. We build real
              things, break them, fix them, and learn by doing. No fluff, no corporate
              jargon. Just code, models, and curiosity.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={onExplore} className="group">
                Start Track 01
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline" onClick={onPlayground}>
                <Sparkles className="size-4 text-primary" />
                Try the playground
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="size-3.5 text-primary" /> git first
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="size-3.5 text-primary" /> python next
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="size-3.5 text-accent-foreground" /> ship for real
              </span>
            </div>
          </div>

          {/* right: terminal */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-xl border border-border bg-[oklch(0.11_0.008_160)] shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-[oklch(0.15_0.01_160)] px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-[oklch(0.7_0.2_25)]/80" />
                <span className="size-2.5 rounded-full bg-[oklch(0.78_0.17_85)]/80" />
                <span className="size-2.5 rounded-full bg-[oklch(0.78_0.19_152)]/80" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                  ~/learnai — zsh
                </span>
              </div>
              <div className="min-h-[280px] p-4 font-mono text-[13px] leading-relaxed">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="select-none text-accent-foreground">{line.prompt}</span>
                    <span className={line.color}>{line.text}</span>
                  </div>
                ))}
                {visibleLines >= terminalLines.length && (
                  <div className="mt-1 flex gap-2">
                    <span className="select-none text-accent-foreground">$</span>
                    <span className="cursor-blink" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-center sm:text-left"
            >
              <div className="font-mono text-2xl font-bold text-primary sm:text-3xl">
                {s.value}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
