# Plan — Ground the playground chat in course context

**Status:** draft · **Author:** Brokk · **Date:** 2026-09-28
**Repo:** `zerwiz/learnai` · **Live:** https://learn.zerwiz.org (zerwizserver, `:3742`)

---

## The problem

The chat route injects exactly one thing: a 5-line persona.

```
You are LearnAI Bot, a concise, friendly mentor for absolute beginners
learning to code with AI. Answer in plain language. When you show code,
keep it short and runnable. Prefer honesty over hand-holding — if
something is hard, say so. Stay on topic: git, Python, LLM APIs,
prompting, deployment, agents. Keep replies under ~150 words unless
the user asks for depth.
```

Nothing else. The model has no idea:

- which **track** the reader is on
- which **lesson** they are reading
- which lessons they have **completed**
- that the material it should be grounding answers in **exists in this very
  codebase** (`src/lib/course-data.ts` — 5 tracks, 24 lessons)

The site is a course *with* a live model on the same page, and the two never
meet. A reader in "Streaming & Error Handling" asking "why does my stream stop?"
gets generic advice instead of a pointer to the lesson that already answers it.

## Why it matters

1. **The playground is the product.** The course teaches an OpenAI-compatible
   streaming client; the playground should *be* the better version of it.
2. **The site already has `z-ai-web-dev-sdk` in the tree** — the original chat
   demo. Bringing the model back in line with the model rail (already done) is
   half the job; grounding it in the course is the rest.
3. **Track 03 teaches this exact thing.** A course that streams from a bare
   persona while a lesson explains how to build a grounded assistant is
   self-undermining.

## Non-goals

- No persistence of chat history server-side (still in-memory, per session)
- No accounts, no auth on the chat
- No vector search / embeddings over lessons (deliberate — see "Rejected")
- No changing the rail, the model, or the deployment

---

## Design

### The context object

The client already knows all of this. `page.tsx` holds `view`, `activeTrack`,
`activeLessonId`, and `completedLessons` — and `Playground` currently takes **no
props**, so none of it reaches the chat panel.

Introduce one small, serialisable shape:

```ts
// src/lib/chat-context.ts
export type ChatContext = {
  view: 'home' | 'track' | 'lesson' | 'playground' | 'community'
  trackId?: string
  trackTitle?: string
  lessonId?: string
  lessonTitle?: string
  completedLessonIds?: string[]   // e.g. ['t1.l1','t1.l2']
}
```

Track-qualified lesson ids (`t1.l3`) because lesson ids are only unique **within**
a track — `l1` exists in all five.

### Composition — server side, not client side

**The client must not be trusted to author the system prompt.** If the browser
can send the system text, it can send anything, and prompt injection is trivial.

So: client sends **facts only** (`ChatContext`). The server resolves them against
`course-data.ts` — the single source of truth — and builds the prompt:

```ts
// src/app/api/playground/chat/route.ts
import { getTrack, getLesson } from '@/lib/course-data'

function buildSystemPrompt(ctx?: ChatContext): string {
  const parts = [BASE_PERSONA]        // the existing 5 lines, unchanged

  if (ctx?.trackTitle) parts.push(`The reader is in the track "${ctx.trackTitle}".`)

  if (ctx?.lessonTitle) {
    parts.push(`They are reading the lesson "${ctx.lessonTitle}". Ground answers in it.`)
    // optionally: a short excerpt of the current lesson's blocks
  }

  if (ctx?.completedLessonIds?.length) {
    parts.push(`They have completed ${n} earlier lessons. Don't re-explain those.`)
  }

  return parts.join('\n\n')
}
```

### Three phases — ship them separately

**Phase 1 — Context plumbing (small, ships first)**

- [ ] Add `src/lib/chat-context.ts` with the `ChatContext` type
- [ ] `Playground` accepts an optional `context?: ChatContext` prop
- [ ] `page.tsx` passes it from `view` / `activeTrack` / `activeLessonId` / `completedLessons`
- [ ] `ChatPanel` includes `context` in the POST body
- [ ] Route accepts `body.context`, passes to `buildSystemPrompt`
- [ ] **Verification:** the rail log shows the composed system prompt; a reader in
      Track 03 gets a track-aware reply

**Phase 2 — Grounding in the lesson body (the real win)**

- [ ] `buildSystemPrompt` appends a bounded excerpt of the current lesson's
      `blocks` — headings, code captions, tips. Cap at ~1200 chars; do **not**
      send the whole course.
- [ ] Prefer the reader's own words for the code, not a paraphrase
- [ ] Add a `GET /api/playground/chat` field: `grounded: boolean` so the UI can
      show *grounded* vs *general* mode
- [ ] **Verification:** ask a question whose answer is verbatim in the lesson and
      confirm the reply quotes or paraphrases it; check a nonsense question does
      **not** hallucinate a lesson quote

**Phase 3 — Suggested questions (small, high delight)**

- [ ] Derive 3 "try asking" chips from the current lesson's `blocks` — the
      existing chips are hardcoded in `playground.tsx`
- [ ] Fall back to the existing defaults when there is no lesson context
- [ ] **Verification:** chips on a lesson differ from chips on home

---

## Hard constraints

- **No mocks.** If context is absent, the bot is general-purpose and says nothing
  false. Never fake a citation.
- **The key stays server-side.** Unchanged — the browser talks only to our route.
- **Injection guard stays.** Incoming `role: "system"` is still rewritten to
  `assistant`. Do not regress this while threading the context through.
- **Context must not bloat.** `max_tokens` stays 1024; the system prompt must
  stay under ~2000 tokens. Measure, don't guess.
- **Privacy.** `completedLessonIds` is coarse (which lessons, not what was said).
  Do **not** send free-text history to any third party. The rail is self-hosted,
  which is the whole reason it's acceptable.
- **Config from env** (RULES/07) — new behaviour must not hardcode a model or URL.

## Rollout

Behind `CHAT_GROUNDING=off|track|lesson` so it can be dialled back without a
redeploy, defaulting to `track` for a soft launch. Kill-switch matters: the rail
is `--models-max 1`, so a prompt-size regression shows up as latency, and we want
to turn it off fast.

## Risks

| Risk | Mitigation |
|---|---|
| Prompt too long → slow first token | Cap the excerpt; measure; `CHAT_GROUNDING=off` |
| Model over-cites the lesson | "Ground answers in it" **not** "quote it"; allow general answers |
| Client sends a forged `trackId` | Server resolves against `course-data.ts`; unknown id → ignore |
| Latency regression on the self-hosted rail | Phase 1 is ~5 lines; Phase 2 is the only real cost |

## Rejected (and why)

- **Embeddings / RAG over all 24 lessons** — needs a vector store and an
  embedding model; the rail is text-LLM only, and the corpus is small enough to
  select deterministically. Boring and correct.
- **Per-lesson hand-written system prompts** — 24 prompts to maintain and
  drift. Generate from data instead.
- **Sending the whole syllabus** — wastes the rail's single resident slot on
  tokens the reader will never use.

## Definition of done

- [ ] Phase 1, 2, 3 merged behind `CHAT_GROUNDING`
- [ ] `bun run lint` and `bun run build` green; CI green on `main`
- [ ] Reader in a lesson: reply reflects that lesson
- [ ] Reader on home: unchanged from today's behaviour
- [ ] `DEPLOY.md` documents `CHAT_GROUNDING`; `worklog.md` records the change
- [ ] **Merged only by the Allfather's word** — never a local merge

---

## Notes

`Playground` takes no props today, so Phase 1 is genuinely small. The
already-done work it builds on: the chat route now targets the llama-swap rail
(`qwen3.6-35b-a3b@q4_k_xl-mtp`) and streams SSE, the SDK is gone, and
`GET /api/playground/chat` reports the live model for the UI label.

---

## Who this is for

**This plan is for the users of the site — the learners. It is not for the
Allfather.**

Read that as a design constraint, not a courtesy note.

Every decision below is filtered through one question: **does this help someone
who came here to learn?** If a change serves the operator, the site operator, or
the project's mechanics rather than the person on lesson 12, it does not belong
in this plan.

Concretely, that means:

- **No feature that exists because it is impressive to build.** Grounding the
  chat in the lesson matters because a beginner reading "Streaming & Error
  Handling" gets an answer that fits *their* lesson — not because a grounded
  assistant is a clever thing to attach to a course site.
- **No instrumentation on the reader.** The context is lesson ids and progress,
  nothing more. The reader's `completedLessons` is a fact about their learning
  path, not a tracking surface. It stays in the request to our own route and
  goes nowhere else.
- **No dark patterns, no nagging, no growth loops.** No "you're behind — 3
  lessons left!", no streak pressure, no modal asking for an account mid-lesson.
  A beginner who is stuck on rebase is the only thing this is for.
- **Cost falls on us, not on the reader.** Free, no signup, no paywall. The tip
  jar stays a tip jar — never a gate on a lesson.
- **Errors tell the truth.** Already the law on this site, and it matters most
  here: if the chat is not grounded or the rail is down, the reader is told. Not
  a fake answer, not a fake citation, not a cheerful nothing-burger.
- **The rail is self-hosted, which is what makes sending context acceptable at
  all.** The reader's context goes to a machine we run, not a third party. Keep
  it that way — routing the reader's lesson context to a hosted API would undo
  the reason this plan is safe.

If a phase cannot be justified as a learner's experience, cut it. The operator
can always ask for more; the learner only ever gets what we choose to give them.
