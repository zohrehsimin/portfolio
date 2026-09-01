"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups as skills, type SkillGroup } from "@/data/resume";
import { cn } from "@/lib/utils";

const SPAN_CLASSES: Record<SkillGroup["span"], string> = {
  sm: "md:col-span-2",
  md: "md:col-span-3",
  lg: "md:col-span-5",
};

const HEIGHT_CLASSES: Record<SkillGroup["span"], string> = {
  sm: "min-h-[200px]",
  md: "min-h-[220px]",
  lg: "min-h-[260px]",
};

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="skills"
      className="relative w-full px-6 py-24 sm:py-32"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <SectionHeading
          eyebrow="Tech & craft"
          title="A toolkit tuned for motion-rich, accessible product UI."
          description="Eight years of shipping have boiled down to a short list of tools I reach for daily — and a longer one I keep close."
        />

        <motion.div
          ref={ref}
          variants={gridContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-4 md:grid-cols-5"
        >
          {skills.map((group) => (
            <SkillCard key={group.id} group={group} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SkillCard({ group }: { group: SkillGroup }) {
  return (
    <motion.article
      variants={cardVariant}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group animated-border relative overflow-hidden rounded-2xl glass p-6",
        "transition-shadow duration-500",
        group.accent,
        SPAN_CLASSES[group.span],
        HEIGHT_CLASSES[group.span],
      )}
    >
      {/* Gradient wash */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-70",
          "transition-opacity duration-500 group-hover:opacity-100",
          group.gradient,
        )}
      />

      {/* Subtle inner sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <div className="flex h-full flex-col justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {group.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">
            {group.description}
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {group.items.map((item, idx) => (
            <li key={item}>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 * idx,
                  ease: "easeOut",
                }}
                className={cn(
                  "inline-flex items-center rounded-full border border-white/10",
                  "bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-muted",
                  "transition-colors duration-300 group-hover:border-white/20 group-hover:text-foreground",
                )}
              >
                {item}
              </motion.span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hover-only corner sparkle */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl"
      />
    </motion.article>
  );
}
