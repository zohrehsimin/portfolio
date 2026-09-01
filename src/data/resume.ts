/**
 * Single typed source of truth for the portfolio. Imports `resume-data.json`
 * (resolveJsonModule is enabled in tsconfig.json) and re-exports it as a
 * strongly-typed module, plus derived helpers used by the sections.
 */

import raw from "../../resume-data.json";

/* -------------------------------------------------------------------------- */
/*  Primitive types                                                            */
/* -------------------------------------------------------------------------- */

export type Contact = {
  email: string;
  phone: string;
  location: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  description: string;
  /** Tailwind gradient classes for the tile backdrop. */
  gradient: string;
  /** Decorative border + glow colour classes. */
  accent: string;
  items: string[];
  /** Bento tile sizing. */
  span: "sm" | "md" | "lg";
};

export type Project = {
  name: string;
  desc: string;
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  /** Free-form period string, e.g. "Aug 2021 – Present". */
  period: string;
  description: string;
  projects: Project[];
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
};

export type Language = string;

/** Shape of a single project once it has been lifted out of its company. */
export type FlatProject = Project & {
  /** Company key used by the filter tabs ("all" | "hamrahe-aval" | "shooka"). */
  companyKey: "hamrahe-aval" | "shooka";
  company: string;
  role: string;
  period: string;
};

/* -------------------------------------------------------------------------- */
/*  Raw JSON shape (kept explicit so the typechecker can verify the import)    */
/* -------------------------------------------------------------------------- */

type RawResume = {
  name: string;
  title: string;
  contact: Contact;
  summary: string;
  skills: {
    core: string[];
    stateAndData: string[];
    uiLibraries: string[];
    toolsAndDevOps: string[];
    concepts: string[];
  };
  experiences: Experience[];
  education: Education[];
  languages: Language[];
};

const data = raw as RawResume;

/* -------------------------------------------------------------------------- */
/*  Public data                                                                */
/* -------------------------------------------------------------------------- */

export const resume = {
  name: data.name,
  title: data.title,
  contact: data.contact,
  summary: data.summary,
  experiences: data.experiences,
  education: data.education,
  languages: data.languages,
} as const;

/* -------------------------------------------------------------------------- */
/*  Skills — mapped onto the Bento shape the Skills section already consumes   */
/* -------------------------------------------------------------------------- */

export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    title: "Core Stack",
    description:
      "The languages and frameworks I reach for daily to ship production UI.",
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    accent: "group-hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.55)]",
    items: data.skills.core,
    span: "lg",
  },
  {
    id: "state-data",
    title: "State & Data",
    description: "Predictable state, server cache, and a clear data flow.",
    gradient: "from-cyan-400/20 via-sky-500/10 to-transparent",
    accent: "group-hover:shadow-[0_0_60px_-10px_rgba(56,189,248,0.55)]",
    items: data.skills.stateAndData,
    span: "md",
  },
  {
    id: "ui",
    title: "UI Libraries",
    description: "Battle-tested component kits and motion primitives.",
    gradient: "from-amber-400/20 via-orange-500/10 to-transparent",
    accent: "group-hover:shadow-[0_0_60px_-10px_rgba(251,191,36,0.5)]",
    items: data.skills.uiLibraries,
    span: "sm",
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    description: "Build, ship, and verify without surprises.",
    gradient: "from-emerald-400/20 via-teal-500/10 to-transparent",
    accent: "group-hover:shadow-[0_0_60px_-10px_rgba(52,211,153,0.5)]",
    items: data.skills.toolsAndDevOps,
    span: "sm",
  },
  {
    id: "concepts",
    title: "Concepts",
    description: "The mental models that keep a frontend codebase healthy.",
    gradient: "from-rose-400/20 via-pink-500/10 to-transparent",
    accent: "group-hover:shadow-[0_0_60px_-10px_rgba(244,114,182,0.5)]",
    items: data.skills.concepts,
    span: "md",
  },
];

/* -------------------------------------------------------------------------- */
/*  Companies — used as the filter axis for the Projects section              */
/* -------------------------------------------------------------------------- */

export type CompanyKey = "hamrahe-aval" | "shooka";

export const companies: { key: CompanyKey; label: string }[] = [
  { key: "hamrahe-aval", label: "Hamrahe Aval" },
  { key: "shooka", label: "Shooka" },
];

/** Slug helper — turns "Hamrahe Aval (MCI)" into "hamrahe-aval". */
function slugifyCompany(name: string): CompanyKey {
  const norm = name.toLowerCase();
  if (norm.includes("hamrahe")) return "hamrahe-aval";
  if (norm.includes("shooka")) return "shooka";
  // Fallback — should not trigger with the current dataset.
  return "hamrahe-aval";
}

/**
 * Projects lifted out of their parent experience so the Projects section
 * can filter and re-order them without traversing the experience tree.
 */
export const projectsFlat: FlatProject[] = data.experiences.flatMap((exp) =>
  exp.projects.map<FlatProject>((p) => ({
    ...p,
    companyKey: slugifyCompany(exp.company),
    company: exp.company,
    role: exp.role,
    period: exp.period,
  })),
);
