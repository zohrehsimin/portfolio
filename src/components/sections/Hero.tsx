"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Sparkles } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { resume } from "@/data/resume";
import { cn } from "@/lib/utils";

const ROLES = [
  "Senior Frontend Engineer",
  "React / Next.js Specialist",
  "TypeScript Advocate",
  "Design Systems Builder",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 pt-28 pb-20 sm:pt-32"
    >
      {/* Decorative grid + glow blobs sit behind the content. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.55]" />
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[140px]" />
        <div className="absolute right-[8%] top-[20%] h-[260px] w-[260px] rounded-full bg-sky-500/15 blur-[120px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        {/* Status pill */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>Available for senior frontend roles · {resume.contact.location}</span>
          </span>
        </motion.div>

        {/* Animated role tag — cycles through roles. */}
        <motion.div variants={item} className="mt-8">
          <AnimatedRoleTag />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={item}
          className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-foreground">{resume.name}.</span>{" "}
          <span className="text-gradient">Scalable, motion-rich</span>{" "}
          <span className="text-foreground">frontend systems.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          {resume.summary}
        </motion.p>

        {/* Quick contact line */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted"
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {resume.contact.location}
          </span>
          <span aria-hidden className="h-3 w-px bg-white/15" />
          <a
            href={`mailto:${resume.contact.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            {resume.contact.email}
          </a>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <Magnetic strength={0.4}>
            <a
              href="#projects"
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full",
                "bg-foreground px-6 py-3 text-sm font-medium text-background",
                "transition-transform duration-300 hover:scale-[1.02]",
                "ring-glow"
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              View Projects
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </Magnetic>

          <Magnetic strength={0.4}>
            <a
              href="#contact"
              className={cn(
                "group inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3",
                "text-sm font-medium text-foreground",
                "transition-colors duration-300 hover:bg-white/[0.08]"
              )}
            >
              <Mail className="h-4 w-4" aria-hidden />
              Get in touch
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-subtle sm:flex"
      >
        <span>Scroll</span>
        <span className="relative h-8 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 block h-3 bg-gradient-to-b from-transparent to-foreground"
            animate={{ y: [0, 32, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/**
 * Tiny typewriter that cycles through the role strings. Lightweight, no deps.
 */
function AnimatedRoleTag() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium tracking-wider uppercase text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
      <span className="relative inline-block h-4 min-w-[200px] text-left">
        {ROLES.map((role, idx) => (
          <motion.span
            key={role}
            className="absolute inset-0 flex items-center text-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [8, 0, 0, -8],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.15, 0.8, 1],
              repeat: Infinity,
              repeatDelay: ROLES.length * 0.05,
              delay: idx * 2.4,
              ease: "easeInOut",
            }}
            aria-hidden={idx !== 0}
          >
            {role}
          </motion.span>
        ))}
        <span className="sr-only">{ROLES[0]}</span>
      </span>
    </span>
  );
}
