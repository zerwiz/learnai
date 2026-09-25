import type { MetadataRoute } from "next";

const DESCRIPTION =
  "Hands-on courses for AI geeks and freaks. Git, Python, LLMs, APIs, and deployment — no fluff, just code.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LearnAI — Courses for AI Geeks & Freaks",
    short_name: "LearnAI",
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#060907",
    theme_color: "#060907",
    categories: ["education", "developer"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
