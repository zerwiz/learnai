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
