import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Lock } from "lucide-react";
import { getTrack, orderedTracks } from "@/lib/course-data";
import { StaticHeader } from "./static-header"
import { SiteFooter } from "@/components/learnai/site-footer"

/**
 * A real, linkable track page.
 *
 * The Academy on aigeeksandfreaks and the courses page BOTH link to
 * /tracks/<slug> - and until this route existed those links went nowhere. A
 * "Read free" button that 404s is the same fault as a dead door, and the smoke
 * test is what found it.
 *
 * THE FREE TIER IS NOT A WALL. Track 01 is free in full. Every other track
 * shows its first lesson free and says plainly that the rest is the community's
 * - the content is never half-rendered and blurred.
 */
export function generateStaticParams() {
  return orderedTracks.map((t) => ({ slug: t.slug }));
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const freeLessons = track.lessons.filter((l) => l.access === "free");
  const minutes = track.lessons.reduce((n, l) => n + (parseInt(l.duration) || 0), 0);
  const gated = track.lessons.length - freeLessons.length;

  return (
    <>
      <StaticHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" /> all tracks
        </Link>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          track {String(track.number).padStart(2, "0")} · {track.tagline}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{track.title}</h1>
        <p className="mt-3 text-muted-foreground">{track.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> {track.lessons.length} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {minutes} min
          </span>
          {track.access === "free" ? (
            <span className="text-primary">free in full</span>
          ) : (
            <span>{freeLessons.length} free to read</span>
          )}
        </div>

        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {track.lessons.map((l, i) => {
            const open = l.access === "free";
            return (
              <li key={l.id} className="flex items-center justify-between gap-4 bg-background px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">{l.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {l.difficulty} · {l.duration}
                  </span>
                  {open ? (
                    <Link
                      href={`/tracks/${track.slug}/${l.id}`}
                      className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline"
                    >
                      read
                    </Link>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70"
                      title="Part of the community"
                    >
                      <Lock className="size-3" /> community
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {gated > 0 ? (
          <div className="mt-8 rounded-lg border border-border bg-muted/20 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              // the rest of this track
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {gated} of {track.lessons.length} lessons are in the community — the
              live cohort, the room, and the self-paced path beside it.{" "}
              <span className="text-foreground">$49 per person, per month</span>, and
              the first track of this course stays free in full.
            </p>
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
