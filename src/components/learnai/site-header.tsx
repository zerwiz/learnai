'use client'

import * as React from 'react'
import { Github, Moon, Sun, Terminal } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { REPO_URL } from '@/lib/site'

type View = 'home' | 'track' | 'lesson' | 'playground' | 'community'

type SiteHeaderProps = {
  view: View
  onNavigate: (view: View) => void
}

const navItems: { label: string; view: View }[] = [
  { label: 'Tracks', view: 'home' },
  { label: 'Playground', view: 'playground' },
  { label: 'Community', view: 'community' },
]

export function SiteHeader({ view, onNavigate }: SiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2.5"
          aria-label="LearnAI home"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
            <Terminal className="size-4.5" />
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-mono text-base font-bold tracking-tight">
              learn<span className="text-primary">ai</span>
            </span>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
              _
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              className={cn(
                'rounded-md px-3 py-1.5 font-mono text-sm transition-colors',
                view === item.view || (item.view === 'home' && (view === 'track' || view === 'lesson'))
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:inline-flex"
          >
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repo"
            >
              <Github className="size-4.5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => onNavigate('playground')}
          >
            Try it now
          </Button>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/40 px-3 py-2 md:hidden scroll-geek">
        {navItems.map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => onNavigate(item.view)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 font-mono text-xs transition-colors',
              view === item.view || (item.view === 'home' && (view === 'track' || view === 'lesson'))
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/60',
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
