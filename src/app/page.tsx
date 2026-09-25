'use client'

import * as React from 'react'
import { SiteHeader } from '@/components/learnai/site-header'
import { Hero } from '@/components/learnai/hero'
import { TrackGrid } from '@/components/learnai/track-grid'
import { TrackDetail } from '@/components/learnai/track-detail'
import { LessonView } from '@/components/learnai/lesson-view'
import { Playground } from '@/components/learnai/playground'
import { Community } from '@/components/learnai/community'
import { SiteFooter } from '@/components/learnai/site-footer'
import { getLesson, type Track } from '@/lib/course-data'

type View = 'home' | 'track' | 'lesson' | 'playground' | 'community'

export default function Home() {
  const [view, setView] = React.useState<View>('home')
  const [activeTrack, setActiveTrack] = React.useState<Track | null>(null)
  const [activeLessonId, setActiveLessonId] = React.useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = React.useState<Set<string>>(new Set())

  // scroll to top on view change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view, activeTrack?.id, activeLessonId])

  function navigate(v: View) {
    setView(v)
  }

  function openTrack(track: Track) {
    setActiveTrack(track)
    setActiveLessonId(null)
    setView('track')
  }

  function openLesson(lessonId: string) {
    if (!activeTrack) return
    setActiveLessonId(lessonId)
    setView('lesson')
  }

  function toggleComplete(key: string) {
    setCompletedLessons((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const lessonData = activeTrack && activeLessonId
    ? getLesson(activeTrack.id, activeLessonId)
    : undefined
  const lessonIndex = activeTrack && activeLessonId
    ? activeTrack.lessons.findIndex((l) => l.id === activeLessonId)
    : -1

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader view={view} onNavigate={navigate} />

      <main className="flex-1">
        {view === 'home' && (
          <>
            <Hero
              onExplore={() => {
                const el = document.getElementById('tracks')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              onPlayground={() => setView('playground')}
            />
            <TrackGrid onSelect={openTrack} />
            <Community />
          </>
        )}

        {view === 'track' && activeTrack && (
          <TrackDetail
            track={activeTrack}
            completedLessons={completedLessons}
            onBack={() => {
              setActiveTrack(null)
              setView('home')
            }}
            onSelectLesson={openLesson}
          />
        )}

        {view === 'lesson' && activeTrack && lessonData && lessonIndex >= 0 && (
          <LessonView
            track={lessonData.track}
            lesson={lessonData.lesson}
            lessonIndex={lessonIndex}
            completedLessons={completedLessons}
            onBack={() => setView('track')}
            onComplete={(key) => toggleComplete(key)}
            onNext={(id) => openLesson(id)}
            onPrev={(id) => openLesson(id)}
          />
        )}

        {view === 'playground' && <Playground />}

        {view === 'community' && <Community />}
      </main>

      <SiteFooter />
    </div>
  )
}
