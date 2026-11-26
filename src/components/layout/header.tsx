"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Menu, Phone } from "lucide-react";
import { bookLink, contactLink, LIVE, mainNav, newTab, samePath, site, type NavItem, type NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/** Fixed header height in px (other sections offset their pins by this). */
export const HEADER_HEIGHT = 88;

const EASE = [0.22, 1, 0.36, 1] as const;

/** Is `href` the page being viewed? (In-page "#…" links never count.) */
const isHere = (href: string, path: string) => !href.includes("#") && samePath(href, path);

/** Does `item` (or anything under it) point at the current page? */
function isCurrent(item: NavItem, path: string) {
  if (item.kind === "link") return isHere(item.href, path);
  if (item.kind === "dropdown") return item.links.some((l) => isHere(l.href, path));
  return item.groups.some((g) => g.links.some((l) => isHere(l.href, path)));
}

/**
 * Site header.
 * - Transparent while the video hero ([data-hero]) is under it, solid once it
 *   has scrolled past (or whenever a menu panel is open). Pages without a hero
 *   get the solid bar straight away.
 * - Desktop: "TMJ and Sleep" opens a full-width megamenu (one column per
 *   menu group); "About Us" opens a small dropdown. Panels open on hover or
 *   click and close on Escape, outside click or navigation.
 * - Below lg: everything lives in the slide-out menu.
 */
export function Header() {
  const path = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  // Solid once the hero has gone
  useEffect(() => {
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        setPastHero(!hero || hero.getBoundingClientRect().bottom <= HEADER_HEIGHT);
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
  }, [path]);

  // Close panels on navigation, Escape and outside clicks
  useEffect(() => setOpen(null), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const show = useCallback((label: string | null) => {
    window.clearTimeout(closeTimer.current);
    setOpen(label);
  }, []);
  const hideSoon = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  }, []);

  const solid = pastHero || open !== null;
  const mega = mainNav.find((n) => n.kind === "mega");

  return (
    <header
      ref={headerRef}
      onMouseLeave={hideSoon}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500",
        solid ? "bg-[#f8f6f2]/95 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[88px] max-w-[1720px] items-center justify-between gap-4 px-5 md:px-10 lg:px-6 xl:gap-6 xl:px-10">
        {/* Logo — white over the video, original colours on the light bar */}
        <Link href={`${LIVE}/`} {...newTab(LIVE)} aria-label={`${site.name} home`} className="shrink-0" onMouseEnter={() => show(null)}>
          <Image
            src="/images/logo.png"
            alt="TMJ & Sleep Therapy logo"
            width={183}
            height={70}
            priority
            className={cn("h-[52px] w-auto transition-[filter] duration-500 md:h-[62px]", !solid && "brightness-0 invert")}
          />
        </Link>

        {/* Main navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((n) => {
              const current = isCurrent(n, path);
              const hasPanel = n.kind !== "link";
              const isOpen = open === n.label;
              const itemCls = cn(
                "relative flex items-center gap-1 rounded-full px-2.5 py-2.5 text-[14px] whitespace-nowrap transition-colors duration-300 xl:gap-1.5 xl:px-4 xl:text-[15px]",
                solid ? "text-ink hover:bg-ink/[0.06]" : "text-white/90 hover:bg-white/10 hover:text-white",
                isOpen && (solid ? "bg-ink/[0.06]" : "bg-white/10"),
                current && "font-bold",
              );
              return (
                <li key={n.label} className="relative" onMouseEnter={() => show(hasPanel ? n.label : null)}>
                  {hasPanel ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`menu-${n.label}`}
                      onClick={() => setOpen(isOpen ? null : n.label)}
                      className={itemCls}
                    >
                      {n.label}
                      <ChevronDown className={cn("size-3.5 transition-transform duration-300", isOpen && "rotate-180")} />
                      {current && <CurrentDot solid={solid} />}
                    </button>
                  ) : (
                    <Link href={n.href} {...newTab(n.href)} aria-current={current ? "page" : undefined} className={itemCls}>
                      {n.label}
                      {current && <CurrentDot solid={solid} />}
                    </Link>
                  )}

                  {/* Simple dropdown */}
                  {n.kind === "dropdown" && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`menu-${n.label}`}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="absolute top-full left-0 pt-3"
                        >
                          <ul className="w-[300px] rounded-2xl bg-[#f8f6f2] p-2 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-ink/[0.06]">
                            {n.links.map((l) => (
                              <li key={l.label}>
                                <PanelLink link={l} path={path} withBlurb />
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2" onMouseEnter={() => show(null)}>
          <Link
            href={contactLink.href}
            {...newTab(contactLink.href)}
            className={cn(
              "mr-2 hidden text-[15px] transition-colors duration-300 xl:block",
              solid ? "text-ink hover:text-gold-deep" : "text-white/90 hover:text-white",
            )}
          >
            {contactLink.label}
          </Link>
          <RoundButton href={site.phoneHref} label={`Call ${site.phoneDisplay}`} solid={solid}>
            <Phone className="size-4" />
          </RoundButton>
          <RoundButton href={contactLink.href} label={contactLink.label} solid={solid} className="hidden sm:grid xl:hidden">
            <Mail className="size-4" />
          </RoundButton>
          <Link
            href={bookLink.href}
            {...newTab(bookLink.href)}
            className="group hidden h-11 items-center gap-2 rounded-full bg-gold pr-2 pl-5 text-[14.5px] whitespace-nowrap font-bold text-ink transition-colors duration-300 hover:bg-[#e8cf85] sm:inline-flex"
          >
            {bookLink.label}
            <span className="grid size-7 place-items-center rounded-full bg-ink text-gold transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0.5">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
          <MobileMenu solid={solid} path={path} />
        </div>
      </div>

      {/* Megamenu panel — full width of the header, content contained */}
      {mega?.kind === "mega" && (
        <AnimatePresence>
          {open === mega.label && (
            <motion.div
              id={`menu-${mega.label}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              onMouseEnter={() => show(mega.label)}
              className="absolute inset-x-0 top-full hidden px-2 pt-0 lg:block md:px-3"
            >
              <div className="mx-auto max-w-[1720px] overflow-hidden rounded-b-[24px] border-t border-ink/[0.06] bg-[#f8f6f2] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
                <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(250px,1fr)] gap-x-8 px-10 pt-9 pb-10 xl:gap-x-12 xl:px-14">
                  {mega.groups.map((g, gi) => (
                    <motion.div
                      key={g.heading}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: EASE, delay: 0.04 * gi }}
                    >
                      <p className="eyebrow flex min-h-[46px] items-end border-b border-ink/10 pb-3 text-[11.5px] text-gold-deep">{g.heading}</p>
                      <ul className="mt-2">
                        {g.links.map((l) => (
                          <li key={l.label}>
                            <PanelLink link={l} path={path} />
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}

                  {/* Feature card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.18 }}
                    className="flex flex-col rounded-2xl bg-ink p-7 text-cream"
                  >
                    <p className="eyebrow text-[11px] text-gold">Not sure where to start?</p>
                    <p className="mt-3 font-display text-[26px] leading-[1.15]">
                      Book a <span className="text-gold">jaw pain assessment</span>
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.6] text-cream/70">
                      A dentist and medical practitioner looks at your jaw, headaches and sleep in one consultation. No referral needed.
                    </p>
                    <div className="mt-auto space-y-2 pt-6">
                      <Link
                        href={bookLink.href}
                        {...newTab(bookLink.href)}
                        className="flex items-center justify-between rounded-full bg-gold px-5 py-3 text-[14px] font-bold text-ink transition-colors hover:bg-[#e8cf85]"
                      >
                        {bookLink.label}
                        <ArrowRight className="size-4" />
                      </Link>
                      <a
                        href={site.phoneHref}
                        className="flex items-center justify-between gap-2 rounded-full px-5 py-3 text-[14px] whitespace-nowrap text-cream ring-1 ring-cream/20 transition-colors hover:bg-cream/10"
                      >
                        Call {site.phoneDisplay}
                        <Phone className="size-4 text-gold" />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}

function CurrentDot({ solid }: { solid: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full", solid ? "bg-gold-deep" : "bg-gold")}
    />
  );
}

/** A link inside a menu panel: label, optional blurb, arrow that slides in on hover. */
function PanelLink({ link, path, withBlurb }: { link: NavLink; path: string; withBlurb?: boolean }) {
  const current = isHere(link.href, path);
  return (
    <Link
      href={link.href}
      {...newTab(link.href)}
      aria-current={current ? "page" : undefined}
      className={cn(
        "group flex items-start justify-between gap-3 rounded-lg py-2 text-[14.5px] leading-snug transition-colors duration-300",
        withBlurb ? "px-3 py-3 hover:bg-ink/[0.05]" : "-mx-2 px-2 hover:bg-ink/[0.05]",
        current ? "font-bold text-gold-deep" : "text-ink",
      )}
    >
      <span>
        {link.short ?? link.label}
        {withBlurb && link.blurb && <span className="mt-0.5 block text-[13px] font-normal text-ink-soft">{link.blurb}</span>}
      </span>
      <ArrowUpRight
        className={cn(
          "mt-0.5 size-3.5 shrink-0 text-gold-deep transition-all duration-300",
          current ? "opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
        )}
      />
    </Link>
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
      {...newTab(href)}
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

/** Slide-out menu (below lg): the full site navigation as accordions. */
function MobileMenu({ solid, path }: { solid: boolean; path: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const close = () => setOpen(false);
  const openGroup = mainNav.find((n) => n.kind !== "link" && isCurrent(n, path))?.label;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className={cn(
            "grid size-11 place-items-center rounded-full transition-colors duration-500 lg:hidden",
            solid ? "bg-[#2b2b2b] text-white hover:bg-black" : "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md hover:bg-white/20",
          )}
        >
          <Menu className="size-[18px]" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] max-w-sm border-l border-cream/10 bg-surface p-0 text-cream">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-16 pb-8" data-lenis-prevent>
          <p className="eyebrow text-gold">Sydney Centre for TMJ &amp; Sleep Therapy</p>
          <Accordion type="single" collapsible defaultValue={openGroup} className="mt-2">
            {mainNav.map((n) =>
              n.kind === "link" ? (
                <MobileLink key={n.label} link={n} path={path} onClick={close} />
              ) : (
                <AccordionItem key={n.label} value={n.label} className="border-b border-cream/10">
                  <AccordionTrigger className="py-3.5 font-sans text-[16px] font-normal text-cream hover:no-underline [&>svg]:text-cream/60">
                    {n.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {n.kind === "dropdown"
                      ? n.links.map((l) => <SubLink key={l.label} link={l} path={path} onClick={close} />)
                      : n.groups.map((g) => (
                          <div key={g.heading} className="mb-4 last:mb-0">
                            <p className="eyebrow mb-1.5 text-[10.5px] text-gold/80">{g.heading}</p>
                            {g.links.map((l) => (
                              <SubLink key={l.label} link={l} path={path} onClick={close} />
                            ))}
                          </div>
                        ))}
                  </AccordionContent>
                </AccordionItem>
              ),
            )}
          </Accordion>
          <MobileLink link={contactLink} path={path} onClick={close} />

          <div className="mt-8 space-y-2.5">
            <Link
              href={bookLink.href}
              {...newTab(bookLink.href)}
              onClick={close}
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[15px] font-bold text-ink"
            >
              {bookLink.label}
              <ArrowRight className="size-4" />
            </Link>
            <a href={site.phoneHref} className="flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] text-cream ring-1 ring-cream/20">
              <Phone className="size-4 text-gold" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileLink({ link, path, onClick }: { link: NavLink; path: string; onClick: () => void }) {
  return (
    <Link
      href={link.href}
      {...newTab(link.href)}
      onClick={onClick}
      aria-current={isHere(link.href, path) ? "page" : undefined}
      className={cn("block border-b border-cream/10 py-3.5 text-[16px]", isHere(link.href, path) ? "text-gold" : "text-cream hover:text-gold")}
    >
      {link.label}
    </Link>
  );
}

function SubLink({ link, path, onClick }: { link: NavLink; path: string; onClick: () => void }) {
  return (
    <Link
      href={link.href}
      {...newTab(link.href)}
      onClick={onClick}
      aria-current={isHere(link.href, path) ? "page" : undefined}
      className={cn("block py-1.5 text-[14.5px]", isHere(link.href, path) ? "text-gold" : "text-cream/70 hover:text-cream")}
    >
      {link.short ?? link.label}
    </Link>
  );
}
