// Grounding context for the playground chat.
//
// The client sends FACTS only (ids, titles, progress). It never authors the
// system prompt — that is composed server-side from the single source of truth
// in course-data.ts, so a forged id resolves to nothing and is ignored.

export type ChatView = 'home' | 'track' | 'lesson' | 'playground' | 'community'

export type ChatContext = {
  /** Where the reader is in the site. */
  view?: ChatView
  trackId?: string
  trackTitle?: string
  lessonId?: string
  lessonTitle?: string
  /** Track-qualified lesson ids, e.g. 't1.l1'. Lesson ids are only unique within a track. */
  completedLessonIds?: string[]
}

/** How much of the course to inject. `CHAT_GROUNDING` on the server. */
export type GroundingLevel = 'off' | 'track' | 'lesson'

/** Max characters of the reader's own lesson we are willing to send. */
export const LESSON_EXCERPT_LIMIT = 1200
