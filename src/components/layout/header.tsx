"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Menu, Phone } from "lucide-react";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** Fixed header height in px (other sections offset their pins by this). */
export const HEADER_HEIGHT = 88;

/** In-page navigation — one link per main section of this page. */
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "causes", label: "Causes" },
  { id: "symptoms", label: "Symptoms" },
  { id: "diagnosis", label: "Assessment" },
  { id: "treatment", label: "Treatment" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Transparent while the hero ([data-hero]) is under it; gains a solid
 * light background once the hero has scrolled past. The centre pill links
 * to this page's sections and highlights the one being read.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        setSolid(heroBottom <= HEADER_HEIGHT);

        // Current section = the last one whose top has passed 40% of the viewport
        const line = window.innerHeight * 0.4;
        let found: string | null = null;
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= line) found = s.id;
        }
        setCurrent(heroBottom > line ? null : found);
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
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        solid ? "bg-[#f8f6f2]/95 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[88px] max-w-[1720px] items-center justify-between gap-6 px-5 md:px-10">
        {/* Logo — white over the video, original colours on the light bar */}
        <Link href="/" aria-label={site.name} className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="TMJ & Sleep Therapy logo"
            width={183}
            height={70}
            priority
            className={cn("h-[52px] w-auto transition-[filter] duration-500 md:h-[62px]", !solid && "brightness-0 invert")}
          />
        </Link>

        {/* Centre pill — this page's sections */}
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="flex h-12 items-center gap-0.5 rounded-full bg-[#2b2b2b]/95 px-1.5 text-[14px] text-white/75 shadow-[0_14px_32px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md">
            {SECTIONS.map((s) => {
              const on = current === s.id;
              return (
                <li key={s.id} className="relative">
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-gold"
                    />
                  )}
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? "location" : undefined}
                    className={cn("relative block rounded-full px-4 py-2 transition-colors xl:px-5", on ? "font-bold text-ink" : "hover:text-white")}
                  >
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <RoundButton href={site.phoneHref} label={`Call ${site.phoneDisplay}`} solid={solid}>
            <Phone className="size-4" />
          </RoundButton>
          <RoundButton href={`mailto:${site.email}`} label="Send an enquiry" solid={solid} className="hidden sm:grid">
            <Mail className="size-4" />
          </RoundButton>
          <SiteMenu solid={solid} current={current} />
        </div>
      </div>
    </header>
  );
}

function RoundButton({
  href,
  label,
  solid,
  className,
  children,
}: {
  href: string;
  label: string;
  solid: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-11 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-500",
        solid
          ? "bg-[#e9e6e1] text-ink shadow-[0_6px_16px_-8px_rgba(0,0,0,0.3)] hover:bg-[#dedad3]"
          : "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md hover:bg-white/20",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Slide-out menu: this page's sections + the full site navigation. */
function SiteMenu({ solid, current }: { solid: boolean; current: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className={cn(
            "grid size-11 place-items-center rounded-full transition-colors duration-500",
            solid ? "bg-[#2b2b2b] text-white hover:bg-black" : "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md hover:bg-white/20",
          )}
        >
          <Menu className="size-[18px]" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm border-l border-cream/10 bg-surface p-0 text-cream">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-16 pb-8" data-lenis-prevent>
          <AnimatePresence>
            {open && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } }}
              >
                {/* On this page */}
                <motion.p variants={item} className="eyebrow text-gold">
                  On this page
                </motion.p>
                <ul className="mt-2">
                  {SECTIONS.map((s) => (
                    <motion.li key={s.id} variants={item} className="border-b border-cream/10">
                      <a
                        href={`#${s.id}`}
                        onClick={() => setOpen(false)}
                        className={cn("block py-3.5 text-[17px]", current === s.id ? "text-gold" : "text-cream")}
                      >
                        {s.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Site */}
                <motion.p variants={item} className="eyebrow mt-10 text-gold">
                  Sydney Centre for TMJ &amp; Sleep Therapy
                </motion.p>
                <ul className="mt-2">
                  {mainNav.map((n) => (
                    <motion.li key={n.label} variants={item} className="border-b border-cream/10">
                      {n.children ? (
                        <Accordion type="single" collapsible>
                          <AccordionItem value="blogs" className="border-0">
                            <AccordionTrigger className="py-3.5 text-[16px] font-normal text-cream/85 hover:no-underline">{n.label}</AccordionTrigger>
                            <AccordionContent>
                              {n.children.map((sub) => (
                                <div key={sub.label} className="mb-4">
                                  <p className="eyebrow mb-2 text-gold/80">{sub.label}</p>
                                  {sub.children?.map((leaf) => (
                                    <Link key={leaf.label} href={leaf.href} onClick={() => setOpen(false)} className="block py-1.5 text-[14.5px] text-cream/70 hover:text-cream">
                                      {leaf.label}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <Link
                          href={n.href}
                          onClick={() => setOpen(false)}
                          className={cn("block py-3.5 text-[16px]", n.active ? "text-gold" : "text-cream/85 hover:text-cream")}
                        >
                          {n.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <a href={site.phoneHref} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[15px] font-bold text-ink">
            <Phone className="size-4" />
            {site.phoneDisplay}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const item = { hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } };
