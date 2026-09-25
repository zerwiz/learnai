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
