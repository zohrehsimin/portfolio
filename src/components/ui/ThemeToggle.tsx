"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DURATION = 0.65;

/**
 * A high-end animated theme toggle. The motion pattern is a hand-tuned
 * adaptation of the 21st.dev "Animated Theme Toggle" (axai-kaizoku,
 * 21st.dev/@axai-kaizoku/components/animated-theme-toggle) — sun/moon
 * paths share a single SVG and use `pathLength` + `scale` keyframes for
 * a continuous, organic morph rather than a binary swap.
 *
 * Differences from the original:
 *  - Wired to `next-themes` (real persistence, system preference) instead
 *    of local `useState`.
 *  - Own button chrome (glass / focus ring / hover scale) instead of the
 *    shadcn Button, so it matches the existing nav.
 *  - `mounted` guard avoids hydration mismatches under SSG.
 *  - Respects `prefers-reduced-motion` via the global override already in
 *    `globals.css`.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes returns `undefined` on the first render under SSR/SSG to
  // avoid hydration mismatches. We wait for mount to render the real icon
  // and surface the correct aria-label.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      title={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-full",
        "glass text-muted",
        "transition-all duration-300 ease-out",
        "hover:text-foreground hover:scale-[1.06]",
        "hover:shadow-[0_0_24px_-6px_rgba(167,139,250,0.55)]",
        "active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-violet-400 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        className,
      )}
    >
      <SolarSwitch isDark={isDark} mounted={mounted} />
    </button>
  );
}

/**
 * Renders both the sun and moon paths inside a single 22x22 SVG. The
 * scale and pathLength are driven by `motion` so the icon always
 * animates between states — no hard swap.
 *
 * `mounted` controls an `opacity-0` fallback so SSR/SSG output is a
 * stable dot instead of a flash of unstyled icon.
 */
function SolarSwitch({
  isDark,
  mounted,
}: {
  isDark: boolean;
  mounted: boolean;
}) {
  // Sun paths: scale 0 when dark, 1 when light. Pathlength draws in
  // once scale is past 0.6 to avoid a hairline flash.
  const scaleSun = useMotionValue(isDark ? 0 : 1);
  const scaleMoon = useMotionValue(isDark ? 1 : 0);
  const pathLengthSun = useTransform(scaleSun, [0.6, 1], [0, 1]);
  const pathLengthMoon = useTransform(scaleMoon, [0.6, 1], [0, 1]);

  // Sync the motion values when isDark flips after the first paint.
  // (Initial values are correct from the first client render.)
  useEffect(() => {
    scaleSun.set(isDark ? 0 : 1);
    scaleMoon.set(isDark ? 1 : 0);
  }, [isDark, scaleSun, scaleMoon]);

  return (
    <motion.span
      animate={isDark ? "dark" : "light"}
      className={cn(
        "inline-flex items-center justify-center",
        // Until mount, fade the icons out so SSR sees an empty button —
        // the real icon fades in after hydration. This is the standard
        // next-themes pattern for SSG.
        !mounted && "opacity-0",
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* ---- Sun (core + 8 rays) — visible when theme is light. ---- */}
        <motion.g
          animate={isDark ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: DURATION, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "12.4058px 12.7625px" }}
        >
          <motion.circle
            cx="12.4058"
            cy="12.7625"
            r="5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            variants={{}}
            style={{
              pathLength: pathLengthSun,
              scale: scaleSun,
            }}
          />
        </motion.g>

        {/* Sun rays (each scales with the sun) */}
        {[
          "M12.4058 1.76251V3.76251",
          "M12.4058 21.7625V23.7625",
          "M4.62598 4.98248L6.04598 6.40248",
          "M18.7656 19.1225L20.1856 20.5425",
          "M1.40576 12.7625H3.40576",
          "M21.4058 12.7625H23.4058",
          "M4.62598 20.5425L6.04598 19.1225",
          "M18.7656 6.40248L20.1856 4.98248",
        ].map((d) => (
          <motion.path
            key={d}
            d={d}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transition={{ duration: DURATION, ease: [0.16, 1, 0.3, 1] }}
            animate={isDark ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            style={{
              pathLength: pathLengthSun,
              transformOrigin: "12.4058px 12.7625px",
            }}
          />
        ))}

        {/* ---- Moon (crescent) — visible when theme is dark. ---- */}
        <motion.path
          d="M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          transition={{ duration: DURATION, ease: [0.16, 1, 0.3, 1] }}
          style={{
            pathLength: pathLengthMoon,
            scale: scaleMoon,
            transformOrigin: "12.4058px 12.7625px",
          }}
        />
      </svg>
    </motion.span>
  );
}
