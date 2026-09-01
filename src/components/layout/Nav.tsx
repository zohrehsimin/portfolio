"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/**
 * Sticky floating pill nav. Two visual states:
 *  - "docked": sits flat at the top, fully visible from the start.
 *  - "floating": collapses to a centred pill once the user scrolls past
 *    the hero, with a backdrop-blur and shadow.
 *
 * Active section is tracked with IntersectionObserver; the active label
 * gets a gradient highlight. Smooth-scroll is native via `scroll-behavior`.
 */
export function Nav() {
  const [activeId, setActiveId] = useState<string>("home");
  const [floating, setFloating] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const { scrollY } = useScroll();
  const springY = useSpring(scrollY, { stiffness: 220, damping: 28, mass: 0.4 });

  useMotionValueEvent(springY, "change", (latest) => {
    setFloating(latest > 320);
  });

  // Track which section is currently in view. We pick the entry whose
  // top is closest to the viewport top (with a comfortable offset for
  // the floating nav height).
  useEffect(() => {
    const sectionEls = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => el !== null);

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Sort by distance from the top of the viewport, pick the topmost
        // visible one. Fall back to entries that are intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when a section is in the upper ~60% of the viewport.
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.1, 0.3, 0.6],
      },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    setMobileOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex justify-center pointer-events-none",
        "transition-[padding] duration-300",
        floating ? "px-4 pt-4" : "px-6 pt-6",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto flex items-center gap-1 rounded-full",
          "transition-all duration-300",
          floating
            ? "glass-strong px-2 py-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]"
            : "px-1 py-1",
        )}
      >
        {/* Brand mark */}
        <a
          href="#home"
          onClick={(e) => handleClick(e, "home")}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full px-3",
            "text-sm font-semibold tracking-tight",
            "transition-colors hover:text-foreground",
            activeId === "home" ? "text-foreground" : "text-muted",
          )}
          aria-label="Zohreh Simin — home"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-violet-400 via-sky-400 to-pink-400 text-[10px] font-bold text-background">
            Z
          </span>
          <span className="hidden sm:inline">Zohreh</span>
        </a>

        <span aria-hidden className="mx-1 h-5 w-px bg-white/10 sm:mx-2" />

        {/* Desktop items */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.slice(1).map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative inline-flex h-8 items-center rounded-full px-3",
                    "text-sm transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Theme toggle — sits to the right of the desktop nav items and to
            the left of the mobile hamburger. Always visible at every size. */}
        <span
          aria-hidden
          className="mx-1 h-5 w-px bg-white/10 sm:mx-2"
        />
        <ThemeToggle />

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full text-muted md:hidden",
            "hover:text-foreground",
          )}
        >
          <span className="sr-only">Menu</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "pointer-events-auto absolute top-[calc(100%+0.5rem)] w-[calc(100%-2rem)] max-w-sm",
            "glass-strong rounded-2xl p-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] md:hidden",
          )}
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={cn(
                      "flex h-10 items-center rounded-xl px-3 text-sm",
                      isActive
                        ? "bg-white/[0.06] text-foreground"
                        : "text-muted hover:bg-white/[0.04] hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
