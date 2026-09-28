"use client";

import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/learnai/site-header";

/**
 * The header is a client component that owns navigation as a view state. On a
 * real, linkable page we want the header to be a real link back to the tracks,
 * so this wrapper gives the header the one thing it needs: somewhere to go.
 */
export function StaticHeader() {
  const router = useRouter();
  return (
    <SiteHeader
      view="home"
      onNavigate={() => router.push("/")}
    />
  );
}
