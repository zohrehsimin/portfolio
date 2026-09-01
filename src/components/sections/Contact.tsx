"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, Copy, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Magnetic } from "@/components/ui/Magnetic";
import { resume } from "@/data/resume";
import { cn } from "@/lib/utils";

const card = {
  hidden: { opacity: 0, y: 18 },
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="contact"
      className="relative w-full px-6 py-24 sm:py-32"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[160px]"
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="Get in touch"
          title="Let's build something that ships and feels right."
          description="Open to senior frontend roles, design-engineering collaborations, and conversations about motion-rich product UI."
        />

        <motion.div
          ref={ref}
          variants={list}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className={cn(
            "relative overflow-hidden rounded-3xl glass-strong p-2",
            "ring-glow",
          )}
        >
          <div className="rounded-[1.4rem] border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <ContactRow
                icon={<Mail className="h-4 w-4" aria-hidden />}
                label="Email"
                value={resume.contact.email}
                copyValue={resume.contact.email}
                href={`mailto:${resume.contact.email}`}
              />
              <RowDivider />
              <ContactRow
                icon={<Phone className="h-4 w-4" aria-hidden />}
                label="Phone"
                value={resume.contact.phone}
                href={`tel:${resume.contact.phone.replace(/\s+/g, "")}`}
                copyValue={resume.contact.phone}
              />
              <RowDivider />
              <ContactRow
                icon={<MapPin className="h-4 w-4" aria-hidden />}
                label="Location"
                value={resume.contact.location}
                readOnly
              />

              <div className="mt-4 flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
                <Magnetic strength={0.35}>
                  <a
                    href={`mailto:${resume.contact.email}?subject=${encodeURIComponent(
                      "Hello from your portfolio",
                    )}`}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full",
                      "bg-foreground px-6 py-3 text-sm font-medium text-background",
                      "transition-transform duration-300 hover:scale-[1.02]",
                      "ring-glow",
                    )}
                  >
                    <Send className="h-4 w-4" aria-hidden />
                    Say hello
                  </a>
                </Magnetic>
                <span className="text-xs text-subtle">
                  Replies usually within a day
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RowDivider() {
  return (
    <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  copyValue,
  readOnly,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
  readOnly?: boolean;
}) {
  return (
    <motion.div
      variants={card}
      className="flex items-center gap-4"
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-full",
          "glass text-muted",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="block truncate text-base font-medium text-foreground transition-colors hover:text-accent-2 sm:text-lg"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-base font-medium text-foreground sm:text-lg">
            {value}
          </p>
        )}
      </div>

      {copyValue && !readOnly ? <CopyButton value={copyValue} /> : null}
    </motion.div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-secure contexts (file:// static export).
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail; the value is also rendered as a mailto/tel link so the
      // user can still reach out.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `Copy ${value}`}
      className={cn(
        "relative grid h-9 w-9 shrink-0 place-items-center rounded-full",
        "glass text-muted",
        "transition-colors duration-300",
        "hover:text-foreground hover:bg-white/[0.08]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
            transition={{ duration: 0.18 }}
            className="text-emerald-400"
          >
            <Check className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            <Copy className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
