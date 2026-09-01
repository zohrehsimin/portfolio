"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  /** Pull strength, 0–1. Higher = stronger magnet. */
  strength?: number;
  className?: string;
  /** Disable the effect on small viewports where pointer is unreliable. */
  disableBelow?: number; // px
};

/**
 * Wraps an element and makes it follow the cursor with a spring. Used for
 * the Hero CTAs and a few other interactive surfaces.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
  disableBelow = 640,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 22, mass: 0.5 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  // Slight 3D tilt derived from cursor position.
  const rotateX = useTransform(sy, [-40, 40], [6, -6]);
  const rotateY = useTransform(sx, [-40, 40], [-6, 6]);

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (typeof window !== "undefined" && window.innerWidth < disableBelow) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy, rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
