'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Track } from '@/lib/course-data'
import { TrackIcon } from './track-icon'
import { accentClasses } from './track-icons'

type TrackDetailProps = {
  track: Track
  completedLessons: Set<string>
  onBack: () => void
  onSelectLesson: (lessonId: string) => void
}

const diffColor: Record<string, string> = {
  beginner: 'bg-primary/15 text-primary',
  intermediate: 'bg-accent text-accent-foreground',
  advanced: 'bg-[oklch(0.7_0.22_20)]/15 text-[oklch(0.75_0.19_20)]',
}

export function TrackDetail({ track, completedLessons, onBack, onSelectLesson }: TrackDetailProps) {
  const a = accentClasses[track.accent]
  const total = track.lessons.length
  const done = track.lessons.filter((l) => completedLessons.has(`${track.id}-${l.id}`)).length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        all tracks
      </button>

      {/* track header */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`h-1.5 w-full ${a.bg}`} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${a.bg} ${a.text}`}>
                <TrackIcon name={track.icon} className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-4xl font-bold text-muted-foreground/25">
                    {String(track.number).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    track
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{track.title}</h1>
                <p className="mt-1 font-mono text-sm text-primary">— {track.tagline}</p>
                <p className="mt-3 max-w-2xl text-muted-foreground">{track.description}</p>
              </div>
            </div>
          </div>

          {/* progress */}
          <div className="mt-6 flex items-center gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {done}/{total} done
            </span>
          </div>
        </div>
      </div>

      {/* lessons */}
      <div className="mt-8">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {'// lessons'}
        </h2>
        <div className="flex flex-col gap-2.5">
          {track.lessons.map((lesson, i) => {
            const key = `${track.id}-${lesson.id}`
            const isDone = completedLessons.has(key)
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className={cn(
                  'group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-md sm:p-5',
                  isDone && 'border-primary/30 bg-primary/[0.04]',
                )}
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors',
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary',
                  )}
                >
                  {isDone ? <Check className="size-4.5" /> : i + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{lesson.title}</h3>
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                        diffColor[lesson.difficulty],
                      )}
                    >
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{lesson.blurb}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden items-center gap-1 font-mono text-xs text-muted-foreground sm:inline-flex">
                    <Clock className="size-3.5" />
                    {lesson.duration}
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                    {isDone ? <ChevronRight className="size-4" /> : <Play className="size-3.5" />}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-dashed border-border bg-card/40 p-4">
          <span className="font-mono text-xs text-muted-foreground">
            finished the track? ship something with it.
          </span>
          <Button size="sm" variant="outline">
            mark track complete
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
