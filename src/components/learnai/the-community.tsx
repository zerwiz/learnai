import { ArrowRight, Users, CalendarDays, Hand } from "lucide-react";
import { COMMUNITY_URL, AIGF_URL, AIGF_MEMBERSHIP_URL, YMIR_URL, YMIR_REPO_URL } from "@/lib/site";

/**
 * The bridge.
 *
 * This site is free and stays free — that is the law, and it is also the whole
 * marketing engine. What we sell is not access to these lessons; it is the room
 * around them. So the only thing this page does is tell the truth about where
 * the free path ends and name the door beside it.
 *
 * THE LAW, restated so it cannot be quietly broken: nothing on this site is
 * paywalled, and this section must never gate a lesson. It is a signpost, not
 * a wall.
 */
export function TheCommunity() {
  return (
    <section id="community-bridge" className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {"// where this goes next"}
        </p>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          The lessons are free.
          <span className="text-primary"> The room is the thing.</span>
        </h2>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Everything on this site stays free, with no account and no paywall —
          track 01 in full, plus the first lesson of every track. What we charge
          for is somewhere else, and we would rather tell you plainly than put a
          lock on a lesson:{" "}
          <strong className="text-foreground">AI Geeks &amp; Freaks</strong> is
          $49 per person, per month, and it is a group. A live cohort with real
          dates, the room where the work gets reviewed, and the self-paced path
          beside it.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Tile
            icon={<Users className="size-5" />}
            title="A live cohort"
            body="Real dates, a real room, and a human who notices when you have not shipped. That is what the membership is really for."
          />
          <Tile
            icon={<CalendarDays className="size-5" />}
            title="The self-paced path"
            body="Every track, open to you the moment it is published. Miss a week, or join between cohorts, and you are never lost."
          />
          <Tile
            icon={<Hand className="size-5" />}
            title="Help on your project"
            body="The courses are group courses. Hands-on help on your own specific project is quoted separately, per named project — and the teaching still comes with it."
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={AIGF_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            See the community — $49 per person, per month
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={COMMUNITY_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/60 hover:text-primary"
          >
            Or just come hang in the Discord
          </a>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {"// what runs the work behind all this"}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            These lessons are written from machines that run{" "}
            <a
              href={YMIR_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Ymir
            </a>
            , a single-operator agent OS: a fleet of named agents in sealed
            sandboxes, a memory well, parallel git worktrees, and an
            anti-hallucination gate. It is a hobby project, open and free —{" "}
            <a
              href={YMIR_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              read it, fork it, use it
            </a>
            .
          </p>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {AIGF_MEMBERSHIP_URL} — course catalogue, and the door when it is open
        </p>
      </div>
    </section>
  );
}

function Tile({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <div className="mb-3 inline-flex size-9 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
