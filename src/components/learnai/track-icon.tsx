import {
  GitBranch,
  Terminal,
  MessageSquare,
  Rocket,
  FlaskConical,
  type LucideProps,
} from 'lucide-react'

const map: Record<string, React.ComponentType<LucideProps>> = {
  GitBranch,
  Terminal,
  MessageSquare,
  Rocket,
  FlaskConical,
}

// A stable component (declared at module level) so React doesn't complain
// about components being created during render.
export function TrackIcon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = map[name] ?? Terminal
  return <Cmp {...props} />
}
