"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed, full-width progress bar that tracks vertical scroll position.
 * Spring-smoothed so it feels weighty without lagging the scroll.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-gradient-to-r from-violet-400 via-sky-400 to-pink-400"
    />
  );
}
