"use client";

import { AnimatePresence, motion, useInView, LayoutGroup } from "framer-motion";
import { Building2, Filter, Layers } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  companies,
  projectsFlat,
  type CompanyKey,
  type FlatProject,
} from "@/data/resume";
import { cn } from "@/lib/utils";

type FilterValue = "all" | CompanyKey;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All work" },
  ...companies.map((c) => ({ value: c.key, label: c.label })),
];

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export function Projects() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const visible = useMemo<FlatProject[]>(() => {
    if (filter === "all") return projectsFlat;
    return projectsFlat.filter((p) => p.companyKey === filter);
  }, [filter]);

  return (
    <section
      id="projects"
      className="relative w-full px-6 py-24 sm:py-32"
    >
      {/* Subtle glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[5%] top-[20%] -z-10 h-[320px] w-[320px] rounded-full bg-sky-500/10 blur-[140px]"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <SectionHeading
          eyebrow="Selected projects"
          title="An interactive look at the work I shipped."
          description="Filter by company to see the surface area I owned — from search consoles and CMS tooling to live video at scale."
        />

        <FilterTabs value={filter} onChange={setFilter} count={visible.length} />

        <motion.div
          ref={ref}
          variants={gridContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </AnimatePresence>
          </LayoutGroup>
        </motion.div>
      </div>
    </section>
  );
}

function FilterTabs({
  value,
  onChange,
  count,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <LayoutGroup id="projects-filter">
        <div
          role="tablist"
          aria-label="Filter projects by company"
          className="glass inline-flex w-fit items-center gap-1 rounded-full p-1"
        >
          {FILTERS.map((f) => {
            const isActive = f.value === value;
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(f.value)}
                className={cn(
                  "relative inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm",
                  "transition-colors duration-200",
                  isActive ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="projects-filter-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.1]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{f.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <p className="inline-flex items-center gap-2 text-xs text-muted">
        <Layers className="h-3.5 w-3.5" aria-hidden />
        {count} {count === 1 ? "project" : "projects"}
      </p>
    </div>
  );
}

function ProjectCard({ project }: { project: FlatProject }) {
  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "group animated-border relative flex h-full flex-col overflow-hidden rounded-2xl glass p-6",
        "transition-shadow duration-500",
        "hover:shadow-[0_0_60px_-15px_rgba(56,189,248,0.45)]",
      )}
    >
      {/* Per-company gradient wash */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-60",
          "transition-opacity duration-500 group-hover:opacity-100",
          project.companyKey === "hamrahe-aval"
            ? "from-violet-500/15 via-fuchsia-500/5 to-transparent"
            : "from-cyan-400/15 via-sky-500/5 to-transparent",
        )}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full",
              "glass px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted",
            )}
          >
            <Building2 className="h-3 w-3" aria-hidden />
            {project.company}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-subtle">
            {project.period}
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{project.desc}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-muted">
            {project.role}
          </span>
          <FilterIndicator companyKey={project.companyKey} />
        </div>
      </div>
    </motion.article>
  );
}

function FilterIndicator({
  companyKey,
}: {
  companyKey: CompanyKey;
}) {
  const isHamrahe = companyKey === "hamrahe-aval";
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full",
        "border border-white/10 bg-white/[0.03]",
        "transition-colors duration-300 group-hover:border-white/20",
        isHamrahe
          ? "text-violet-300 group-hover:text-violet-200"
          : "text-sky-300 group-hover:text-sky-200",
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  );
}
