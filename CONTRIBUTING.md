# Contributing to learnai

Thanks for wanting to help. This course exists so people can learn by building —
which means the best contributions are the ones a beginner can actually use.

There are no gatekeepers here, but there is one rule worth stating up front:

> **No mocks. No placeholders. No pretending.** If something isn't wired up, it
> should say so out loud rather than return a fake result. The playground follows
> this, and so should your PR.

---

## Ways to contribute

| Kind | Where |
|------|-------|
| 🐛 Bug | [Open a bug report](https://github.com/zerwiz/learnai/issues/new/choose) |
| ✏️ Typo / unclear sentence | A one-line PR is perfect |
| 📚 New lesson or track | [Propose a lesson idea](https://github.com/zerwiz/learnai/issues/new/choose) first |
| ⚙️ Feature or fix | Open an issue, then a PR |
| 🔌 New playground backend | Same as a feature — see below |

If you're not sure something is wanted, open an issue. A two-minute question
beats an abandoned branch.

---

## Dev setup

You need [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`).

```bash
git clone https://github.com/zerwiz/learnai.git
cd learnai

bun install
cp .env.example .env       # optional — the playground is env-driven
bun run db:generate
bun run dev                # http://localhost:3000
```

The site and all lessons run without any API keys. The three playground tabs
report "not configured" until you point them at a provider — that's correct
behaviour, not a bug.

### The loop

```bash
git checkout -b feature/short-description
# ... work ...
bun run lint
bun run build
git add .
git commit -m "add lesson: streaming responses"
git push -u origin feature/short-description
gh pr create --fill
```

- **Never push to `main`.** Open a PR.
- **One thing per branch.** Small, focused PRs get read; sprawling ones stall.
- **Write the commit message for a human** — "add lesson: streaming responses",
  not "update file".
- Merging is done by the maintainer after review.

---

## Code style

- **TypeScript**, strict-ish. Match the file you're editing.
- Components live in `src/components/learnai/` (site) or `src/components/ui/`
  (shadcn/ui primitives — prefer not to hand-edit these).
- Styling is Tailwind 4 with tokens from `globals.css` (`primary`, `muted`,
  `border`, …). Use the tokens — no hardcoded hex in components.
- The default theme is dark; check your change in **both** themes.
- Use `lucide-react` for icons.
- Outbound links come from `src/lib/site.ts`. Don't scatter URLs.
- Prefer plain, lowercase interface copy — the house voice. Comments only where
  the *why* isn't obvious.

Run before you push:

```bash
bun run lint
bun run build
```

---

## Adding a lesson

All content lives in one file: [`src/lib/course-data.ts`](./src/lib/course-data.ts).
No database, no CMS, no MDX build step.

A lesson looks like this:

```ts
{
  id: 'l5',
  title: 'Streaming & Error Handling',
  blurb: 'Show tokens as they arrive, and fail gracefully.',
  duration: '20 min',
  difficulty: 'intermediate', // 'beginner' | 'intermediate' | 'advanced'
  blocks: [
    { type: 'p',    text: 'Plain paragraph.' },
    { type: 'h',    text: 'A section heading' },
    { type: 'code', lang: 'bash', caption: 'optional caption', code: `echo "hi"` },
    { type: 'tip',  text: 'A green aside.' },
    { type: 'warn', text: 'A warning.' },
    { type: 'try',  text: 'Something the reader does right now.' },
  ],
}
```

Guidelines for content:

- **Every lesson ends with a `try` block** — something runnable. If the reader
  can't do anything with it, it's a lecture.
- **Code must actually run.** Paste it into a terminal and check. Escape
  backticks inside `code` template literals.
- **Introduce, don't assume.** If you use a word for the first time, define it.
- **Be honest about difficulty.** "This part is fiddly" is a kindness.
- Add the lesson to the right track's `lessons` array; ids are `l1`, `l2`, …
  and unique inside their track.

To add a whole **track**, add a `Track` object to the `tracks` array with a
unique `id` (`t6`), `number`, `slug`, `accent`, and a `lucide-react` `icon` name.

---

## Adding a playground backend

Each tab is one route in `src/app/api/playground/`:

- `chat/route.ts` — OpenAI-compatible `/chat/completions`, streams SSE
- `image/route.ts` — OpenAI-compatible `/images/generations`
- `search/route.ts` — `searxng` | `brave` | `tavily` | `custom`

Rules for these:

1. **Configuration resolves from env**, with one documented default. Add new
   vars to `.env.example`.
2. **No key ever reaches the browser.** The route calls the provider.
3. **When unconfigured, return a clear `503`** naming the missing variable —
   never a fake result.
4. **Shape the error for a beginner**, not a stack trace.

---

## Reporting a bug

Include: what you did, what you expected, what happened, and your browser/OS if
it's visual. A screenshot of the browser console is worth ten sentences.

---

## Support

The course is free and stays free. If it helped, buy us a coffee:
**<https://ko-fi.com/zerwiz>**

## License

By contributing you agree your work is licensed under the [MIT License](./LICENSE).
