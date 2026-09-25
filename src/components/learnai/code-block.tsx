'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  lang?: string
  caption?: string
  className?: string
}

export function CodeBlock({ code, lang = 'bash', caption, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <figure className={cn('group relative my-4', className)}>
      <div className="rounded-xl border border-border bg-[oklch(0.12_0.008_160)] overflow-hidden shadow-sm">
        {/* title bar */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-[oklch(0.16_0.01_160)] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[oklch(0.7_0.2_25)]/70" />
            <span className="size-2.5 rounded-full bg-[oklch(0.78_0.17_85)]/70" />
            <span className="size-2.5 rounded-full bg-[oklch(0.78_0.19_152)]/70" />
            <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {lang}
            </span>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-primary" />
                copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                copy
              </>
            )}
          </button>
        </div>
        {/* code body */}
        <pre className="scroll-geek overflow-x-auto p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-foreground/90">{code}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-1.5 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
