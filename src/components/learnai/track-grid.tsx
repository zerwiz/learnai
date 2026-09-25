'use client'

import { ArrowRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tracks, type Track } from '@/lib/course-data'
import { TrackIcon } from './track-icon'
import { accentClasses } from './track-icons'

type TrackGridProps = {
  onSelect: (track: Track) => void
  activeTrackId?: string
}

export function TrackGrid({ onSelect, activeTrackId }: TrackGridProps) {
  return (
    <section id="tracks" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {'// the curriculum'}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Five tracks. Zero fluff.
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Follow them in order, or jump around — your call. Every lesson has code you
            can run, break, and improve. Start with Track 01 if you&rsquo;ve never written
            a line of code.
          </p>
        </div>
        <div className="hidden font-mono text-xs text-muted-foreground sm:block">
          <span className="text-primary">●</span> ready · <span className="text-muted-foreground/60">○</span> open
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => {
          const a = accentClasses[track.accent]
          const isActive = activeTrackId === track.id
          return (
            <Card
              key={track.id}
              className={`group relative cursor-pointer gap-0 overflow-hidden p-0 py-0 transition-all hover:shadow-lg ${a.border} hover:ring-2 ${a.ring} ${
                isActive ? 'ring-2 ring-primary/50' : ''
              }`}
              onClick={() => onSelect(track)}
            >
              {/* top accent strip */}
              <div className={`h-1 w-full ${a.bg}`} />

              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-lg ${a.bg} ${a.text}`}>
                    <TrackIcon name={track.icon} className="size-5.5" />
                  </div>
                  <span className="font-mono text-4xl font-bold text-muted-foreground/20">
                    {String(track.number).padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`size-1.5 rounded-full ${a.dot}`} />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Track {track.number} · {track.tagline}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-bold tracking-tight">{track.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {track.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {track.lessons.length} lessons
                    </Badge>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {track.lessons.reduce((n, l) => n + (parseInt(l.duration) || 0), 0)}m
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 font-mono text-xs ${a.text} transition-transform group-hover:translate-x-0.5`}>
                    explore <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </Card>
          )
        })}

        {/* "build your own" tile */}
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed bg-card/30 p-5 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            track 06 · coming soon
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground">Your project.</span> Fork this course, add a
            track, open a PR. Geeks respect contributions.
          </p>
          <a
            href="https://github.com/zerwiz/learnai"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-primary hover:underline"
          >
            contribute on github →
          </a>
        </Card>
      </div>
    </section>
  )
}
