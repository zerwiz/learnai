import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnAI — Courses for AI Geeks & Freaks",
  description:
    "A hands-on course for AI geeks and freaks. Build real things, break them, fix them, and learn by doing. Git, Python, LLMs, APIs, deployment — no fluff, just code.",
  keywords: [
    "LearnAI",
    "AI course",
    "learn to code",
    "Python",
    "LLM",
    "Git",
    "API",
    "AI for beginners",
  ],
  authors: [{ name: "zerwiz" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "LearnAI — Courses for AI Geeks & Freaks",
    description:
      "Build real things, break them, fix them. Git, Python, LLMs, APIs, deployment — no fluff.",
    siteName: "LearnAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnAI — Courses for AI Geeks & Freaks",
    description:
      "Build real things, break them, fix them. Git, Python, LLMs, APIs, deployment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
