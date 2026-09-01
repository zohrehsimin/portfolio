"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Thin client-side wrapper around `next-themes`'s ThemeProvider.
 *
 * Configured for static export (output: "export") with `attribute="class"`
 * so the theme is driven by the `.dark` class on <html>, and
 * `enableSystem` so the user's OS preference is respected on first visit.
 *
 * `defaultTheme="dark"` matches the site's dark-first design brief — the
 * initial paint shows the dark theme we already designed, then the user
 * can opt into light mode via the toggle.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
