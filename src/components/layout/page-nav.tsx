"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export type PageSection = { id: string; label: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Floating "On this page" navigator for long article pages. Appears once the
 * hero has scrolled away, shows the section being read, and opens a list of
 * the page's sections (the old header pill, moved out so the header can carry
 * the site menu).
 */
export function PageNav({ sections }: { sections: readonly PageSection[] }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<number>(-1);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        const heroGone = !hero || hero.getBoundingClientRect().bottom <= window.innerHeight * 0.4;
        // Hide again over the footer
        const footer = document.querySelector("footer");
        const atFooter = !!footer && footer.getBoundingClientRect().top < window.innerHeight * 0.85;
        setVisible(heroGone && !atFooter);

        const line = window.innerHeight * 0.4;
        let found = -1;
        sections.forEach((s, i) => {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= line) found = i;
        });
        setCurrent(found);
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [sections]);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const label = current >= 0 ? sections[current].label : "Contents";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={root}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6"
        >
          <AnimatePresence>
            {open && (
              <motion.nav
                id="page-nav-list"
                aria-label="On this page"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="absolute right-0 bottom-full mb-2 w-[260px] origin-bottom-right rounded-2xl bg-[#2b2b2b]/95 p-2 text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md"
              >
                <p className="eyebrow px-3 pt-2 pb-1.5 text-[10.5px] text-gold">On this page</p>
                <ul>
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          go(s.id);
                        }}
                        aria-current={i === current ? "location" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-[14.5px] transition-colors",
                          i === current ? "bg-gold font-bold text-ink" : "text-white/80 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <span className={cn("w-5 text-[12px] tabular-nums", i === current ? "text-ink/60" : "text-white/40")}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="page-nav-list"
            onClick={() => setOpen((o) => !o)}
            className="flex h-12 items-center gap-3 rounded-full bg-[#2b2b2b]/95 pr-2 pl-5 text-[14px] text-white shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:bg-black"
          >
            <span className="hidden text-white/55 sm:inline">On this page</span>
            <span className="max-w-[140px] truncate font-bold">{label}</span>
            <span className="grid size-8 place-items-center rounded-full bg-gold text-ink">
              <ChevronUp className={cn("size-4 transition-transform duration-300", !open && "rotate-180")} />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
