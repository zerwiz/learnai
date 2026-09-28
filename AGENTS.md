# AGENTS.md — LearnAI

**This repo is the FREE, MINIMAL ground of AI Geeks & Freaks.** It is not the
paid product, and it must never become a wall in front of the free tier.

## What this repo is

- `learn.zerwiz.org` — the free entry point. Public, no account, no paywall.
- **Free and should stay minimal.** The Allfather's word, 2026-09-28. Anything
  added here is readable by anyone, forever, without paying.
- The paid offering lives on **aigeeksandfreaks.zerwiz.org**: the full group
  courses (live cohort + self-paced), $49 per person per month, and per-project
  personal assistance quoted separately. **This repo is not the funnel for it —
  it is the floor under it.**

## The law

- **Nothing here is paywalled. Ever.** Not a lesson, not a track, not a locked
  "pro" lesson. A locked thing on this site is a bug.
- **Every course on this site is a course that exists.** No course cards for
  courses nobody has written.
- **A number shown here is a count we can query** — lessons, tracks, hours —
  and never a claim about a paid thing.

## Content

- `src/lib/course-data.ts` is the **single source of truth** for courses,
  consumed by both the UI and `src/app/api/tracks`.
- `/api/tracks` carries `contractVersion` and `generatedAt` so consumers can
  refuse a shape they do not know. **Any change to the payload bumps
  `contractVersion`.**
- The authored source of every course lives in the hoard at
  `~/Documents/ymirhome/svartalfaheim/whynotproductions/workspace/aigf/courses/`
  — markdown, append-only, one file per course. **The hoard is the truth; this
  file is a port of it. Never edit a course here that does not cite its source.**
- **Never invent content.** If a lesson has no runnable code, it gets no code
  block. Inventing a lesson is worse than shipping four.

## Track ids and teaching order (sealed 2026-09-28)

| # | id | title |
|---|---|---|
| 1 | `t0` | Your Machine |
| 2 | `t6` | Your Voice |
| 3 | `t8` | Your Coding Desk |
| 4 | `t10` | Working With Coding Agents |
| 5 | `t9` | GitHub and Getting Code Shipped |
| 6 | `t7` | Your First Real Project |
| 7 | `t11` | Managing the Work in the Codebase |
| 8–12 | `t1`–`t5` | the existing five: Git & GitHub, Python for AI, Talking to Models, Building with AI, Going Deeper |

`trackStats.minutes` is minutes; **`trackStatsHours` is the only honest public
figure** and it is what the hero shows. Do not publish `trackStats.minutes`
labelled as hours. (This was a real bug, fixed 2026-09-28.)

## Deploy

Same server as AG&F, same law: **this repo is on the Allfather's server, not
Netlify.** Never add a Netlify deploy step. The deploy is
`git pull → bun install → bun run build → systemctl restart <unit>`, as
`zerwizserver`, and **never** touch another unit on that machine.

## Gaps known on 2026-09-28

- The ported courses are currently served **whole and ungated** from
  `/api/tracks`. The Allfather's word is that LearnAI stays **minimal**; the
  exact free-vs-paid split of the seven ported tracks is **not yet decided**.
  Until it is, treat "which tracks are free here" as an open question and do
  not invent a gate.
- `trackStats` in the API is `{...trackStats, hours: trackStatsHours}` —
  `minutes` remains in the payload for consumers that want the exact sum.

---

## 2026-09-28 — where this stands, and what the site promises

**Deployed and verified.** `https://learn.zerwiz.org/api/tracks` answers
`contractVersion: 3`, 12 tracks · 78 lessons · 32h · 17 free, in teaching order
1 → 12.

### The promises this site makes, and the laws behind them

1. **Free, and it stays free.** Track 01 in full, plus one free lesson from every
   other track. Nothing here is ever paywalled. *A locked thing on this site is a
   bug, not a business decision.*
2. **Every course is a course that exists.** 12 real tracks, ported from
   `svartalfaheim/whynotproductions/workspace/aigf/courses/`, lesson by lesson,
   with nothing invented. Where a lesson had no runnable code, it got no code
   block.
3. **The teaching order is the number.** `orderedTracks` is the single ordered
   list — the grid, `/api/tracks` and the footer all read it. The raw array is
   append-order, which is right for git and wrong for a reader.
4. **A number shown here is a count we can query.** `trackStats.minutes` is the
   exact sum; **`trackStatsHours` is the only honest public figure** and it is
   what the hero shows. Never publish `minutes` labelled as hours — that was a
   real bug, fixed 2026-09-28.
5. **Any change to the payload bumps `contractVersion`.** Consumers refuse a
   shape they do not understand, and they are right to.

### The two bridges out of here

- **The community** — `$49 per person, per month`, a live cohort, the room, the
  self-paced path. `aigeeksnfreaks.zerwiz.org`. The free path stays free; what
  costs money is the room.
- **Ymir** — the agent OS these lessons were written and verified on. Free, open,
  and the reason the course material can honestly claim to come from a real
  machine.

### Housekeeping that bit us

- `.yggdrasil/` is untracked. An embedded worktree was swept in by `git add -A`,
  which is the exact wound `CRS-200` teaches. **Stage named files, never `-A`.**
- ESLint ignores the worktree pool. It was linting a nested copy of the repo and
  reporting failures that were not ours.

### Deploying

```
bin/deploy.sh            # plan only
bin/deploy.sh --yes      # ship
```

Never builds over the tree a running process serves from — that is what cost
this site its CSS on 2026-09-28. Releases are timestamped directories reached
through a symlink; the restart is the only privileged step and it is last.
