import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { resume } from "@/data/resume";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Senior Frontend Engineer with 8+ years building scalable, motion-rich React and Next.js applications across telecom, healthcare, and real-time communication platforms.";

export const metadata: Metadata = {
  title: `${resume.name} — ${resume.title}`,
  description,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: `${resume.name} — ${resume.title}`,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${resume.name} — ${resume.title}`,
    description,
  },
};

export const viewport: Viewport = {
  // `next-themes` owns the theme color now; we swap it on the client.
  // Leaving it unset avoids a stale `<meta name="theme-color">` after toggle.
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // `next-themes` writes the theme class to <html> on mount. Until
      // then, suppress the warning so React doesn't complain about the
      // attribute mismatch.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-violet-500/40">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-1.5 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <ScrollProgress />
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
