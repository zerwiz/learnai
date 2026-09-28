import { NextResponse } from 'next/server'
import { tracks, trackStats, trackStatsHours, isFreeLesson } from '@/lib/course-data'

export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({
    contractVersion: 3,
    generatedAt: new Date().toISOString(),
    stats: {
      ...trackStats,
      hours: trackStatsHours,
      freeLessons: tracks.reduce((n, t) => n + t.lessons.filter((l) => isFreeLesson(l)).length, 0),
    },
    tracks: tracks.map((t) => ({
      id: t.id,
      number: t.number,
      access: t.access,
      slug: t.slug,
      title: t.title,
      tagline: t.tagline,
      description: t.description,
      accent: t.accent,
      icon: t.icon,
      lessonCount: t.lessons.length,
      lessons: t.lessons.map((l) => ({
        id: l.id,
        access: l.access,
        title: l.title,
        blurb: l.blurb,
        duration: l.duration,
        difficulty: l.difficulty,
      })),
    })),
  })
}
