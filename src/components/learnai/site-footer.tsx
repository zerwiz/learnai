'use client'

import { Coffee, Github, Heart, Terminal } from 'lucide-react'
import {
  DISCUSSIONS_URL,
  ISSUES_URL,
  REPO_URL,
  SUPPORT_URL,
} from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Terminal className="size-4.5" />
              </span>
              <span className="font-mono text-base font-bold">
                learn<span className="text-primary">ai</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A hands-on course for AI geeks and freaks. Build real things, break them,
              fix them, and learn by doing. No fluff, no corporate jargon.
            </p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              hosted at{' '}
              <span className="text-primary">learn.zerwiz.org</span> · via cloudflare
            </p>
          </div>

          {/* tracks */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              tracks
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-muted-foreground hover:text-foreground">01 · git &amp; github</li>
              <li className="text-muted-foreground hover:text-foreground">02 · python for ai</li>
              <li className="text-muted-foreground hover:text-foreground">03 · talking to models</li>
              <li className="text-muted-foreground hover:text-foreground">04 · building with ai</li>
              <li className="text-muted-foreground hover:text-foreground">05 · going deeper</li>
            </ul>
          </div>

          {/* links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              connect
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="size-3.5" /> github repo
                </a>
              </li>
              <li>
                <a
                  href={DISCUSSIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  discussions
                </a>
              </li>
              <li>
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  contribute a track
                </a>
              </li>
              <li>
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  report a bug
                </a>
              </li>
              <li>
                <a
                  href={SUPPORT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Coffee className="size-3.5" /> buy us a coffee
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} learnai · no certificates, no gatekeeping
          </p>
          <p className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            made with <Heart className="size-3.5 fill-primary text-primary" /> &amp; curiosity at 2&nbsp;am
          </p>        </div>
      </div>
    </footer>
  )
}
