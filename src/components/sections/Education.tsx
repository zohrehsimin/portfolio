import { GraduationCap, CalendarDays, School } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { resume, type Education as EducationEntry } from "@/data/resume";

export function Education() {
  return (
    <section
      id="education"
      className="relative w-full px-6 py-24 sm:py-32"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <SectionHeading
          eyebrow="Education"
          title="A foundation in computer science and applied AI."
          description="Academic background that informed a love for clean abstractions, performance, and product thinking."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {resume.education.map((entry, idx) => (
            <EducationCard key={entry.degree} entry={entry} index={idx} />
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Languages
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {resume.languages.map((lang) => (
                <li
                  key={lang}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-foreground"
                >
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function EducationCard({
  entry,
  index,
}: {
  entry: EducationEntry;
  index: number;
}) {
  return (
    <FadeIn delay={index * 0.08}>
      <article className="group relative h-full overflow-hidden rounded-2xl glass p-6 transition-shadow duration-500 hover:shadow-[0_0_60px_-20px_rgba(244,114,182,0.45)]">
        {/* Hover gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-rose-400/15 via-pink-500/5 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        <div className="flex h-full flex-col gap-4">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full glass px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted"
          >
            <GraduationCap className="h-3 w-3" aria-hidden />
            Degree
          </span>

          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
            {entry.degree}
          </h3>

          <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <School className="h-3.5 w-3.5" aria-hidden />
              {entry.institution}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {entry.period}
            </span>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
