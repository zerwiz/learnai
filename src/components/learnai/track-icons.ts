import {
  GitBranch,
  Terminal,
  MessageSquare,
  Rocket,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  GitBranch,
  Terminal,
  MessageSquare,
  Rocket,
  FlaskConical,
}

export function trackIcon(name: string): LucideIcon {
  return map[name] ?? Terminal
}

export const accentClasses: Record<
  string,
  { ring: string; text: string; bg: string; dot: string; border: string }
> = {
  emerald: {
    ring: 'hover:ring-primary/40',
    text: 'text-primary',
    bg: 'bg-primary/10',
    dot: 'bg-primary',
    border: 'hover:border-primary/40',
  },
  amber: {
    ring: 'hover:ring-accent-foreground/40',
    text: 'text-accent-foreground',
    bg: 'bg-accent',
    dot: 'bg-accent-foreground',
    border: 'hover:border-accent-foreground/40',
  },
  cyan: {
    ring: 'hover:ring-[oklch(0.74_0.16_195)]/40',
    text: 'text-[oklch(0.8_0.13_195)]',
    bg: 'bg-[oklch(0.74_0.16_195)]/10',
    dot: 'bg-[oklch(0.74_0.16_195)]',
    border: 'hover:border-[oklch(0.74_0.16_195)]/40',
  },
  violet: {
    ring: 'hover:ring-[oklch(0.72_0.16_300)]/40',
    text: 'text-[oklch(0.78_0.14_300)]',
    bg: 'bg-[oklch(0.72_0.16_300)]/10',
    dot: 'bg-[oklch(0.72_0.16_300)]',
    border: 'hover:border-[oklch(0.72_0.16_300)]/40',
  },
  rose: {
    ring: 'hover:ring-[oklch(0.7_0.22_20)]/40',
    text: 'text-[oklch(0.75_0.19_20)]',
    bg: 'bg-[oklch(0.7_0.22_20)]/10',
    dot: 'bg-[oklch(0.7_0.22_20)]',
    border: 'hover:border-[oklch(0.7_0.22_20)]/40',
  },
}
