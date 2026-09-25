import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "LearnAI — Courses for AI Geeks & Freaks";
const DESCRIPTION =
  "Hands-on courses for AI geeks and freaks. Git, Python, LLMs, APIs, and deployment — learn by building real things, breaking them, and fixing them. No fluff, just code.";
const OG_ALT = "learnai — Courses for AI Geeks & Freaks";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · LearnAI",
  },
  description: DESCRIPTION,
  applicationName: "LearnAI",
  authors: [{ name: "zerwiz", url: "https://github.com/zerwiz" }],
  creator: "AI Geeks & Freaks",
  publisher: "AI Geeks & Freaks",
  category: "education",
  keywords: [
    "LearnAI",
    "AI course",
    "learn to code",
    "Python",
    "LLM",
    "Git",
    "API",
    "AI for beginners",
    "AI engineering",
    "agents",
    "machine learning",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LearnAI",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: OG_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
  },
};

export const viewport: Viewport = {
  themeColor: "#060907",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LearnAI",
  alternateName: "LearnAI — Courses for AI Geeks & Freaks",
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "AI Geeks & Freaks",
    url: "https://aigeeksnfreaks.zerwiz.org",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
