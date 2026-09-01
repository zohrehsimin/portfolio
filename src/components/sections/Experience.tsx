"use client";

import { motion, useInView } from "framer-motion";
import { Briefcase, MapPin, CalendarDays } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resume, type Experience as ExperienceEntry } from "@/data/resume";
import { cn } from "@/lib/utils";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="experience"
      className="relative w-full px-6 py-24 sm:py-32"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <SectionHeading
          eyebrow="Experience"
          title="Eight years across telecom, healthcare, and real-time comms."
          description="Senior IC work at scale — pairing deep React expertise with systems thinking that holds up under load."
        />

        <div className="relative">
          {/* The spine: a vertical line down the middle on desktop, left on mobile. */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 bottom-0 w-px",
              "bg-gradient-to-b from-transparent via-white/15 to-transparent",
              "left-4 md:left-1/2 md:-translate-x-1/2",
            )}
          />

          <motion.ol
            ref={ref}
            variants={list}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex flex-col gap-12 md:gap-16"
          >
            {resume.experiences.map((entry, idx) => (
              <TimelineRow
                key={entry.company}
                entry={entry}
                side={idx % 2 === 0 ? "left" : "right"}
              />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({
  entry,
  side,
}: {
  entry: ExperienceEntry;
  side: "left" | "right";
}) {
  return (
    <motion.li
      variants={item}
      className={cn(
        "relative grid grid-cols-[2rem_1fr] md:grid-cols-2 md:gap-12",
      )}
    >
      {/* Dot on the spine */}
      <span
        aria-hidden
        className={cn(
          "absolute left-4 top-6 z-10 -translate-x-1/2",
          "md:left-1/2",
        )}
      >
        <span className="block h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_0_4px_rgba(167,139,250,0.18),0_0_20px_rgba(167,139,250,0.7)]" />
      </span>

      {/* The card. On desktop it alternates left/right; on mobile it always sits right of the spine. */}
      <div
        className={cn(
          "pl-10 md:pl-0",
          side === "left"
            ? "md:col-start-1 md:pr-10 md:text-right"
            : "md:col-start-2 md:pl-10",
        )}
      >
        <article
          className={cn(
            "group relative overflow-hidden rounded-2xl glass p-6",
            "transition-shadow duration-500 hover:shadow-[0_0_60px_-20px_rgba(167,139,250,0.5)]",
          )}
        >
          {/* Hover gradient wash */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 opacity-0",
              "bg-gradient-to-br from-violet-500/15 via-fuchsia-500/5 to-transparent",
              "transition-opacity duration-500 group-hover:opacity-100",
            )}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <div className="flex flex-col gap-5">
            <header
              className={cn(
                "flex flex-col gap-2",
                side === "left" ? "md:items-end" : "md:items-start",
              )}
            >
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-full",
                  "glass px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted",
                )}
              >
                <Briefcase className="h-3 w-3" aria-hidden />
                {entry.role}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {entry.company}
              </h3>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3 w-3" aria-hidden />
                  {entry.period}
                </span>
                <span aria-hidden className="h-3 w-px bg-white/15" />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {entry.location}
                </span>
              </div>
            </header>

            <p
              className={cn(
                "text-sm leading-relaxed text-muted",
                side === "left" ? "md:text-right" : "md:text-left",
              )}
            >
              {entry.description}
            </p>

            <div
              className={cn(
                "flex flex-col gap-2",
                side === "left" ? "md:items-end" : "md:items-start",
              )}
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">
                Highlighted work
              </p>
              <ul
                className={cn(
                  "flex flex-col gap-2",
                  side === "left" ? "md:items-end" : "md:items-start",
                )}
              >
                {entry.projects.map((p) => (
                  <li
                    key={p.name}
                    className={cn(
                      "flex flex-col gap-0.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2",
                      "transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.04]",
                      side === "left" ? "md:text-right" : "md:text-left",
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="text-xs leading-relaxed text-muted">
                      {p.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>

      {/* On desktop, the other half of the row stays empty for the alternating layout. */}
      <div
        aria-hidden
        className={cn(
          "hidden md:block",
          side === "left" ? "md:col-start-2" : "md:col-start-1 md:row-start-1",
        )}
      />
    </motion.li>
  );
}
