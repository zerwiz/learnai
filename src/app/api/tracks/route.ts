import { NextResponse } from 'next/server'
import { tracks, trackStats } from '@/lib/course-data'

export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({
    stats: trackStats,
    tracks: tracks.map((t) => ({
      id: t.id,
      number: t.number,
      slug: t.slug,
      title: t.title,
      tagline: t.tagline,
      description: t.description,
      accent: t.accent,
      icon: t.icon,
      lessonCount: t.lessons.length,
      lessons: t.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        blurb: l.blurb,
        duration: l.duration,
        difficulty: l.difficulty,
      })),
    })),
  })
}
