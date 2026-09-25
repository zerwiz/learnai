'use client'

import * as React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  TriangleAlert,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Track, Lesson, LessonBlock } from '@/lib/course-data'
import { TrackIcon } from './track-icon'
import { accentClasses } from './track-icons'
import { CodeBlock } from './code-block'

type LessonViewProps = {
  track: Track
  lesson: Lesson
  lessonIndex: number
  completedLessons: Set<string>
  onBack: () => void
  onComplete: (key: string) => void
  onNext: (lessonId: string) => void
  onPrev: (lessonId: string) => void
}

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'p':
      return <p className="my-3 text-[15px] leading-relaxed text-foreground/90">{block.text}</p>
    case 'h':
      return (
        <h3 className="mt-7 mb-2 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider text-primary">
          <span className="text-muted-foreground/50">#</span>
          {block.text}
        </h3>
      )
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} />
    case 'tip':
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-primary/30 bg-primary/[0.06] p-4">
          <Lightbulb className="size-5 shrink-0 text-primary" />
          <div className="text-sm text-foreground/90">
            <span className="font-mono font-semibold text-primary">tip · </span>
            {block.text}
          </div>
        </div>
      )
    case 'warn':
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-accent-foreground/30 bg-accent/30 p-4">
          <TriangleAlert className="size-5 shrink-0 text-accent-foreground" />
          <div className="text-sm text-foreground/90">
            <span className="font-mono font-semibold text-accent-foreground">watch out · </span>
            {block.text}
          </div>
        </div>
      )
    case 'try':
      return (
        <div className="my-4 flex gap-3 rounded-xl border border-border bg-card p-4">
          <Wand2 className="size-5 shrink-0 text-primary" />
          <div className="text-sm">
            <span className="font-mono font-semibold text-foreground">try it · </span>
            <span className="text-muted-foreground">{block.text}</span>
          </div>
        </div>
      )
    default:
      return null
  }
}

export function LessonView({
  track,
  lesson,
  lessonIndex,
  completedLessons,
  onBack,
  onComplete,
  onNext,
  onPrev,
}: LessonViewProps) {
  const a = accentClasses[track.accent]
  const key = `${track.id}-${lesson.id}`
  const isDone = completedLessons.has(key)
  const hasNext = lessonIndex < track.lessons.length - 1
  const hasPrev = lessonIndex > 0

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          tracks
        </button>
        <span className="text-muted-foreground/40">/</span>
        <span className={a.text}>{track.title}</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground">lesson {lessonIndex + 1}</span>
      </nav>

      {/* header */}
      <header className="mt-5 border-b border-border pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className={`inline-flex size-5 items-center justify-center rounded ${a.bg} ${a.text}`}>
            <TrackIcon name={track.icon} className="size-3.5" />
          </span>
          track {track.number} · {track.tagline.toLowerCase()}
          <span className="mx-1 text-muted-foreground/40">·</span>
          <Clock className="size-3.5" />
          {lesson.duration}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{lesson.blurb}</p>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="outline" className="font-mono capitalize">
            {lesson.difficulty}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            lesson {lessonIndex + 1} of {track.lessons.length}
          </span>
        </div>
      </header>

      {/* content */}
      <div className="py-6">
        {lesson.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      {/* footer nav */}
      <footer className="mt-8 border-t border-border pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={() => (isDone ? onComplete(key) : onComplete(key))}
            className={cn('justify-start', isDone && 'border-primary/40 bg-primary/[0.06]')}
          >
            {isDone ? (
              <>
                <CheckCircle2 className="size-4 text-primary" />
                completed
              </>
            ) : (
              <>
                <Circle className="size-4" />
                mark complete
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={!hasPrev}
              onClick={() => hasPrev && onPrev(track.lessons[lessonIndex - 1].id)}
            >
              <ArrowLeft className="size-4" />
              prev
            </Button>
            <Button
              disabled={!hasNext}
              onClick={() => hasNext && onNext(track.lessons[lessonIndex + 1].id)}
            >
              next lesson
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </footer>
    </article>
  )
}
