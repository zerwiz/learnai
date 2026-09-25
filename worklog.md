---
Task ID: 1
Agent: main (Z.ai Code)
Task: Build LearnAI — a hands-on AI course platform (single-page Next.js app at /) with 5 course tracks, lesson content, and a live interactive playground (chat, image, search) backed by real models.

Work Log:
- Explored existing Next.js 16 + shadcn/ui scaffold, read layout/globals/db/UI component patterns
- Loaded LLM, image-generation, and web-search skills to understand z-ai-web-dev-sdk APIs
- Built a custom dark hacker theme (globals.css) — emerald primary + amber accent, no blue/indigo; grid/glow backdrops, custom scrollbar, blinking cursor
- Added next-themes ThemeProvider; set dark as default
- Wrote comprehensive course content (src/lib/course-data.ts): 5 tracks, 25 lessons, each with runnable code blocks, tips, warnings, and "try it" exercises
- Built reusable components: CodeBlock (copy button), TrackIcon (stable component), SiteHeader (nav + theme toggle), Hero (animated terminal + stats), TrackGrid, TrackDetail (progress bar + lesson list), LessonView (content blocks + prev/next + mark-complete), Community (principles + cheatsheet), SiteFooter (sticky via flex layout), Playground (3 tabs)
- Composed page.tsx as a single-page app with view state (home/track/lesson/playground/community) and completed-lessons state
- Built backend API routes: /api/tracks (static course data), /api/playground/chat (LLM via z-ai-web-dev-sdk), /api/playground/image (image generation, returns data URL), /api/playground/search (web_search function)
- Fixed lint errors: replaced render-time icon lookup with a stable TrackIcon component; escaped "// ..." JSX text via {'// ...'}
- Verified end-to-end with Agent Browser:
  - Home renders (hero, 5 tracks, community, footer)
  - Track → lesson navigation works; prev/next + mark-complete work
  - Playground CHAT: real LLM answered "explain git rebase in 2 sentences" ✓
  - Playground IMAGE: real 1024x1024 PNG generated ✓
  - Playground SEARCH: real web results returned ✓
  - Theme toggle dark↔light works
  - Mobile (390px) responsive layout works; mobile nav bar appears
  - Footer sticky on short pages, pushed down on long pages
  - Zero console/runtime/dev-log errors

Stage Summary:
- Single source of truth: src/lib/course-data.ts (5 tracks, 25 lessons)
- Live AI playground wired to real z-ai-web-dev-sdk backends (chat/image/search)
- Production-ready, responsive, dark-default hacker aesthetic
- All core flows browser-verified; lint clean

---
Task ID: 2
Agent: Brokk (pi)
Task: Host LearnAI on zerwizserver behind Cloudflare on an uncommon port.

Work Log:
- Committed the previously-untracked full app (104 files) and pushed origin/main
- Cloned to zerwizserver, installed deps via bun, generated Prisma client, built standalone
- Chose port 3742 (loopback only; uncommon, clear of existing 3800/3900/3910/4823/8038/8111/8112)
- Seated learnai.service (systemd, enabled at boot), DATABASE_URL -> ~/learnai/db/custom.db
- Added learn.zerwiz.org ingress to the existing aigeeksandfreaks tunnel config.yml
- Routed DNS: cloudflared tunnel route dns aigeeksandfreaks learn.zerwiz.org
- Restarted cloudflared-aigeeksandfreaks.service

Stage Summary:
- Live at https://learn.zerwiz.org (200), all 5 tracks render, /api/tracks 200
- learnai.service active+enabled; cloudflared-aigeeksandfreaks.service active
- Deployment recorded in DEPLOY.md

---
Task ID: 3
Agent: Brokk (pi)
Task: Brand metadata, OG plate, favicon; wire the live playground to the local model rail.

Work Log:
- Forged a new mark (brand/icon.svg): terminal prompt `>_` — emerald chevron + amber cursor on a dark rounded square; replaced the inherited generic "Z" logo
- Added brand/og.svg (1200x630) and brand/icon-square.svg (full-bleed, for apple-touch)
- Added scripts/generate-brand-assets.sh -> public/{favicon.ico,icon.svg,icon-192.png,icon-512.png,apple-icon.png,og.png} via rsvg-convert + imagemagick
- Rewrote src/app/layout.tsx metadata: metadataBase, canonical, OG (url/site/locale/image 1200x630), twitter card, icons matrix, robots/googleBot, viewport themeColor #060907, JSON-LD WebSite
- Added src/app/{manifest.ts,sitemap.ts,robots.ts}; removed public/robots.txt
- Rewired /api/playground/chat from the dead z-ai SDK to the llama-swap rail (OpenAI-compatible), with SSE streaming pass-through; model from env (default qwen3.6-35b-a3b@q4_k_xl-mtp)
- ChatPanel now consumes SSE deltas and shows the real model name from GET /api/playground/chat
- Rewrote /api/playground/image (OpenAI-compatible images) and /api/playground/search (searxng|brave|tavily|custom) as env-configured with honest 503s; UI surfaces the message
- Untracked db/custom.db (sqlite binary) and added .env.example

Stage Summary:
- Live at https://learn.zerwiz.org; og.png/favicon/icons/manifest/robots/sitemap all 200
- Chat streams end-to-end: public URL -> tunnel -> tailnet rail -> qwen3.6-35b-a3b@q4_k_xl-mtp
- Image + search await a provider decision (vault OpenAI key rejected; no local SearXNG)

---
Task ID: 4
Agent: Brokk (pi)
Task: Point the support CTAs at the tip jar (https://ko-fi.com/zerwiz) and make the dead footer links live.

Work Log:
- Added src/lib/site.ts as the one source of outbound links (SITE_URL, REPO_URL, DISCUSSIONS_URL, ISSUES_URL, SUPPORT_URL from NEXT_PUBLIC_SUPPORT_URL with the ko-fi default)
- community.tsx: "buy us a coffee" was a dead Button — wrapped in asChild <a> to SUPPORT_URL; discussions link now from site.ts
- site-footer.tsx: connect column now links github repo, discussions, contribute a track (issues/new), report a bug (issues/new), and buy us a coffee (ko-fi) — previously the last two were inert text
- site-header.tsx: repo link from site.ts
- layout.tsx / robots.ts / sitemap.ts: took SITE_URL from site.ts (removed three duplicated consts)
- Documented NEXT_PUBLIC_SUPPORT_URL in .env.example

Stage Summary:
- Two ko-fi links live on https://learn.zerwiz.org (community button + footer); issues/discussions links live
- ko-fi.com/zerwiz verified ("Support zerwiz"); bare curl 403s on Cloudflare bot protection, browsers load it fine
- lint + build clean; deployed to zerwizserver, learnai.service restarted

---
Task ID: 5
Agent: Brokk (pi)
Task: A real README, MIT license, and a contribution surface on GitHub.

Work Log:
- Rewrote README.md against the actual code: 5 tracks / 24 lessons (the old one claimed a 6-track list with a Track 0 that is not in course-data.ts), the live playground and its env vars, stack, quick start, project layout, brand-asset regen, deploy pointer, support, license
- Added LICENSE (MIT, Copyright (c) 2026 zerwiz) — GitHub reports spdx_id MIT
- Added CONTRIBUTING.md: dev setup, the fork→branch→PR loop, code style, a worked "add a lesson" section with the real LessonBlock shape, playground-backend rules, the no-mock law
- Added .github/ISSUE_TEMPLATE/{config.yml,bug_report.md,lesson_idea.md,feature_request.md} — the footer links to /issues/new/choose, which showed a blank page without a chooser
- Added .github/pull_request_template.md with the checklist that mirrors the house rules
- Added .github/workflows/ci.yml (bun install --frozen-lockfile, prisma generate, lint, build); first run on main: success in 29s
- package.json: name learnai, description, license, author, homepage, repository, bugs, keywords
- GitHub repo: homepage https://learn.zerwiz.org, 8 topics

Stage Summary:
- MIT detected by GitHub; LICENSE/CONTRIBUTING/templates/workflow all served from raw.githubusercontent
- CI green on main
- Not added: CODE_OF_CONDUCT (community health 71%) — offered, not requested

---
Task ID: 6
Agent: Brokk (pi)
Task: Add a Code of Conduct.

Work Log:
- Added CODE_OF_CONDUCT.md — Contributor Covenant v2.1, with attribution to the upstream (CC BY-SA 4.0)
- Adapted two lines for this project: being new is not a flaw, and "read the docs" is not an answer — a link is
- Enforcement contact is real, not fabricated: the maintainer's GitHub profile (@zerwiz) with GitHub's report-abuse form as the fallback; explicitly asks people NOT to open a public issue for conduct reports
- Linked it from README (Contributing section) and CONTRIBUTING.md (top + Support section)

Verification:
- raw.githubusercontent CODE_OF_CONDUCT.md -> 200; YAML front matter of all three issue templates parses with the required name/about keys
- GitHub community profile health 71% -> 85%, and it now returns code_of_conduct {key:"other", html_url: .../CODE_OF_CONDUCT.md}
- GitHub sees .github/ISSUE_TEMPLATE identically to microsoft/vscode (bug_report.md, config.yml, feature_request.md)
- The profile's issue_template field is null for us AND for vercel/next.js, shadcn-ui/ui and microsoft/vscode (which have working choosers) — it does not reflect the modern directory form, so it is not evidence of a gap
- Profile updated_at is null: GitHub has not recomputed the cache yet; the last 15% is that slot

Stage Summary:
- CI green on main after the change (31s)
- CoC detected and linked; no secret or private data added
