'use client'

import { Github, MessagesSquare, Heart, Coffee, Terminal, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CodeBlock } from './code-block'
import { DISCUSSIONS_URL, SUPPORT_URL } from '@/lib/site'

const principles = [
  {
    icon: Terminal,
    title: 'honest over hand-holding',
    body: "We write for beginners but we don't talk down. Geeks respect honesty — if something is hard, we say so.",
  },
  {
    icon: Zap,
    title: 'code over theory',
    body: 'Every lesson has runnable code. No theory without practice. If you can\'t run it, it isn\'t a lesson.',
  },
  {
    icon: Heart,
    title: 'tinkerers welcome',
    body: 'The curious, the stubborn, the 2 AM crowd. If you break things to learn how they work, you belong here.',
  },
]

const discussions = [
  'What was the first thing you broke while learning to code?',
  'Local models vs cloud APIs — when does each win?',
  'Show your worst commit message. We won\'t judge (much).',
  'What AI project would you build if you had a free weekend?',
]

export function Community() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {'// the community'}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Built by geeks, for geeks.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          LearnAI is open, free, and a little bit stubborn. Fork it, contribute a track,
          or just lurk and learn. No certificates, no gatekeeping.
        </p>
      </div>

      {/* principles */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {principles.map((p) => (
          <Card key={p.title} className="gap-3 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <p.icon className="size-5" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-foreground">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.body}</p>
          </Card>
        ))}
      </div>

      {/* two columns: discussions + cheatsheet */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="gap-4 p-6">
          <div className="flex items-center gap-2">
            <MessagesSquare className="size-5 text-primary" />
            <h3 className="font-semibold">discussion prompts</h3>
          </div>
          <ul className="space-y-3">
            {discussions.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 select-none font-mono text-primary">›</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <a href={DISCUSSIONS_URL} target="_blank" rel="noreferrer">
                <Github className="size-4" />
                join discussions
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
                <Coffee className="size-4" />
                buy us a coffee
              </a>
            </Button>
          </div>
        </Card>

        <Card className="gap-3 p-6">
          <div className="flex items-center gap-2">
            <Terminal className="size-5 text-primary" />
            <h3 className="font-semibold">git workflow cheatsheet</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            The commands every geek keeps within arm&rsquo;s reach. Save this.
          </p>
          <CodeBlock
            lang="bash"
            caption="fork → branch → push → PR, the holy loop"
            code={`# 1. fork & clone
gh repo fork zerwiz/learnai --clone=true
cd learnai && git remote add upstream git@github.com:zerwiz/learnai.git

# 2. branch (never push to main)
git checkout -b feature/my-idea

# 3. work, commit (small, focused)
git add . && git commit -m "add learning module"

# 4. push & open PR
git push -u origin feature/my-idea
gh pr create --title "Add learning module" --body "one thing at a time"

# 5. sync your fork later
git fetch upstream && git rebase upstream/main && git push origin main`}
          />
        </Card>
      </div>
    </section>
  )
}
