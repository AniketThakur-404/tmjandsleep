"use client";

/**
 * "How we manage TMJ pain" — scroll-driven archive layout, adapted from
 * property-franchise/src/components/ui/WebsiteDetailsSection.tsx.
 *
 * Desktop:
 *  1. Intro (plays once when the section arrives): the three area images rise as
 *     banner columns, then the light content panel sweeps in from the left and
 *     pushes them right.
 *  2. Scroll: the stage stays put. Each scroll step shows one treatment (full text,
 *     same type size); moving into a new area wipes its image up over the last.
 *     The side list shows every area + treatment and jumps to it on click.
 * Mobile: the same sequence, stacked: image band on top, one treatment at a time below.
 */

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { CardCarousel } from "@/components/stack-cards";
import { manageAreas, whyChoose } from "@/content/tmj";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fixed header height (px) — the stage docks right below it. */
const HEADER = 88;
/** Scroll distance per treatment, as a fraction of the stage height. */
const SCROLL_PER_STEP = 0.55;
/** Same, on phones / tablets. */
const SCROLL_PER_STEP_MOBILE = 0.5;
const EASE = [0.16, 1, 0.3, 1] as const;

/** One image per treatment area (from public/images). */
const AREA_IMAGES: Record<string, { src: string; alt: string }> = {
  "Splints & Night Guards": { src: "/images/morning-soreness.png", alt: "Person waking with jaw soreness in bed" },
  "Self Care & Guided Movement": { src: "/images/facial-pain.png", alt: "Person holding a painful jaw" },
  "Checking Whether Treatment Is Helping": { src: "/images/headaches.png", alt: "Person holding their temples with a headache" },
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function Manage() {
  // Flatten areas → one step per treatment
  const steps = useMemo(
    () => manageAreas.flatMap((a, areaIdx) => a.items.map((item) => ({ areaIdx, area: a, item }))),
    [],
  );
  // index of the first step of each area
  const areaStart = useMemo(() => manageAreas.map((_, k) => steps.findIndex((s) => s.areaIdx === k)), [steps]);

  return (
    <Section tone="dark" flush id="treatment" className="pt-24 md:pt-32">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Our Approach" title="TMJ and jaw pain" accent="treatment options" />
          <Reveal className="copy lg:pt-9">
            <p className="text-[18px]! text-cream">
              <Rich text="For painful TMD, care generally starts with conservative, reversible approaches. The aim is to improve comfort and function while avoiding unnecessary permanent changes to the teeth or bite. [1,16]" />
            </p>
            <p>
              A recent flare and pain lasting several months may need different plans. We discuss what each option may achieve, its limitations and when to
              review it.
            </p>
          </Reveal>
        </div>
      </div>

      <DesktopArchive steps={steps} areaStart={areaStart} />
      <MobileArchive steps={steps} areaStart={areaStart} />
      <WhyChoose />
    </Section>
  );
}

type Step = { areaIdx: number; area: (typeof manageAreas)[number]; item: (typeof manageAreas)[number]["items"][number] };

function DesktopArchive({ steps, areaStart }: { steps: Step[]; areaStart: number[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const total = steps.length;
  const current = steps[active];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const trackEl = track.current!;
        const stageEl = stage.current!;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stepPx = () => stageEl.offsetHeight * SCROLL_PER_STEP;

        // Track height = one stage + room for every step after the first
        const size = () => {
          trackEl.style.height = `${stageEl.offsetHeight + (total - 1) * stepPx()}px`;
        };
        size();

        // ---------- Intro ----------
        const cols = gsap.utils.toArray<HTMLElement>("[data-strip-col]");
        const lines = gsap.utils.toArray<HTMLElement>("[data-title-line]");
        const metas = gsap.utils.toArray<HTMLElement>("[data-meta]");
        const panel = stageEl.querySelector<HTMLElement>("[data-panel]")!;
        const strip = stageEl.querySelector<HTMLElement>("[data-strip]")!;
        const stack = stageEl.querySelector<HTMLElement>("[data-stack]")!;

        if (!reduce) {
          gsap.set(cols, { yPercent: 100 });
          gsap.set(lines, { yPercent: 110 });
          gsap.set(metas, { autoAlpha: 0, y: 14 });
          gsap.set(stack, { autoAlpha: 0 });
          gsap.set(strip, { autoAlpha: 1, x: 0 });
          gsap.set(panel, { width: 0 });

          const intro = gsap
            .timeline({ paused: true })
            .to(cols, { yPercent: 0, duration: 1.2, ease: "power3.out", stagger: 0.14 })
            .addLabel("push", "+=0.25")
            .to(panel, { width: () => panelWidth(stageEl), duration: 1.4, ease: "power3.inOut" }, "push")
            .to(strip, { x: () => panelWidth(stageEl), duration: 1.4, ease: "power3.inOut" }, "push")
            .set(stack, { autoAlpha: 1 }, "push+=1.4")
            .set(strip, { autoAlpha: 0 }, "push+=1.45")
            .set(panel, { clearProps: "width" }, "push+=1.45")
            .to(lines, { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, "push+=0.8")
            .to(metas, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.07 }, "push+=1.1");

          // Plays as the stage approaches; scrolling into the pin fast-forwards it
          ScrollTrigger.create({ trigger: trackEl, start: "top 75%", once: true, onEnter: () => intro.play() });
          ScrollTrigger.create({
            trigger: trackEl,
            start: `top top+=${HEADER - 1}`,
            once: true,
            onEnter: () => {
              if (intro.progress() < 1) intro.timeScale(3).play();
            },
          });
        }

        // ---------- Scroll: step through treatments ----------
        const items = gsap.utils.toArray<HTMLElement>("[data-stack-item]");
        const imgs = gsap.utils.toArray<HTMLElement>("[data-stack-img]");
        const progressBar = stageEl.querySelector<HTMLElement>("[data-progress]");
        let last = -1;

        const st = ScrollTrigger.create({
          trigger: trackEl,
          start: `top top+=${HEADER}`,
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onRefreshInit: size,
          onUpdate: (self) => {
            const f = self.progress * (total - 1);
            // image k wipes up while moving from the step before its area into its first step
            for (let k = 1; k < items.length; k++) {
              const t = smoothstep(clamp01(f - (areaStart[k] - 1)));
              items[k].style.clipPath = `inset(${((1 - t) * 100).toFixed(2)}% 0% 0% 0%)`;
              if (imgs[k] && !reduce) imgs[k].style.transform = `scale(${(1.15 - 0.15 * t).toFixed(4)})`;
            }
            if (progressBar) progressBar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
            const idx = Math.round(f);
            if (idx !== last) {
              last = idx;
              setActive(idx);
            }
          },
        });

        // Store for click-to-jump
        (trackEl as HTMLDivElement & { __jump?: (i: number) => number }).__jump = (i: number) => st.start + i * stepPx() + 2;
      });
      return () => mm.revert();
    },
    { scope: track },
  );

  const jumpTo = (i: number) => {
    const el = track.current as (HTMLDivElement & { __jump?: (i: number) => number }) | null;
    const y = el?.__jump?.(i);
    if (y == null) return;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div ref={track} className="relative mt-16 hidden lg:block" style={{ height: "500vh" }}>
      <div
        ref={stage}
        className="@container sticky w-full overflow-hidden bg-surface"
        style={{ top: HEADER, height: `calc(100svh - ${HEADER}px)` }}
      >
        {/* Banner strip (intro): one column per area, rises then gets pushed right */}
        <div data-strip className="invisible absolute inset-0 z-10 will-change-transform">
          {manageAreas.map((a, i) => (
            <div key={a.area} data-strip-col className="absolute top-0 h-full w-1/3 overflow-hidden" style={{ left: `${(i * 100) / 3}%` }}>
              <Image src={AREA_IMAGES[a.title].src} alt="" fill sizes="34vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="eyebrow text-gold">{a.area}</p>
                <p className="display mt-2 text-[26px] leading-[1.1] text-cream">{a.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Image stack (right): each area wipes up over the previous one */}
        <div data-stack className="absolute top-0 right-0 bottom-0 left-[64%] z-10 overflow-hidden xl:left-[72%]">
          {manageAreas.map((a, i) => (
            <div
              key={a.area}
              data-stack-item
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: i, clipPath: i === 0 ? undefined : "inset(100% 0% 0% 0%)" }}
            >
              <div data-stack-img className="absolute inset-0 will-change-transform">
                <Image src={AREA_IMAGES[a.title].src} alt={AREA_IMAGES[a.title].alt} fill sizes="(min-width: 1280px) 28vw, 36vw" className="object-cover" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent p-6">
                <p className="eyebrow text-gold">{a.area}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Light content panel (left) */}
        <div data-panel className="absolute top-0 left-0 z-20 h-full w-[64%] overflow-hidden bg-paper text-ink xl:w-[72%]">
          <div className="absolute inset-y-0 left-0 flex w-[64cqw] flex-col px-[clamp(28px,3.2vw,56px)] pt-[clamp(16px,3vh,40px)] pb-[clamp(12px,2.5vh,32px)] xl:w-[72cqw]">
            {/* hairline progress */}
            <div className="absolute inset-x-0 top-0 h-px bg-ink/10">
              <div data-progress className="h-full w-full origin-left scale-x-0 bg-gold-deep" />
            </div>

            {/* Row 1: area title (changes per area) */}
            <div data-meta className="eyebrow text-gold-deep">
              {current.area.area} · Our Integrated Approach
            </div>
            <h3 className="display mt-2 text-[clamp(28px,5.6vh,56px)] leading-[1] text-ink">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-title-line className="block">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={current.areaIdx}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="block"
                    >
                      {current.area.title}
                      <span className="text-gold-deep">.</span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h3>

            {/* Row 2: current treatment (left) + index (right) */}
            <div className="mt-[clamp(12px,3vh,36px)] grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-8 xl:gap-14">
              <div data-meta className="min-h-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="max-w-[680px] border-t border-ink/15 pt-4"
                  >
                    <h4 className="font-display text-[clamp(24px,3.6vh,32px)] leading-[1.2] text-ink">{current.item.title}</h4>
                    <div className="mt-3 space-y-3 text-[clamp(16px,2.2vh,19px)] leading-[1.65] text-ink">
                      {current.item.body.map((p) => (
                        <p key={p}>
                          <Rich text={p} />
                        </p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Index: every area is a row; the current area expands to list its treatments */}
              <nav data-meta aria-label="Treatments" className="w-[250px] self-start xl:w-[320px]">
                <ul className="border-t border-ink/12">
                  {manageAreas.map((a, k) => {
                    const open = current.areaIdx === k;
                    return (
                      <li key={a.area} className="border-b border-ink/12">
                        <button
                          onClick={() => jumpTo(areaStart[k])}
                          aria-expanded={open}
                          className="group flex w-full items-baseline gap-3 py-[clamp(8px,1.6vh,14px)] text-left"
                        >
                          <span className={cn("font-display text-[15px] transition-colors", open ? "text-gold-deep" : "text-ink/35")}>
                            {String(k + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "flex-1 text-[12.5px] leading-[1.35] font-bold tracking-[1.6px] uppercase transition-colors",
                              open ? "text-ink" : "text-ink/50 group-hover:text-ink",
                            )}
                          >
                            {a.title}
                          </span>
                          {!open && <span className="text-[13px] text-ink/40">{a.items.length}</span>}
                        </button>

                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              key="items"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.45, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <ul className="pb-[clamp(8px,1.6vh,14px)]">
                                {a.items.map((it, j) => {
                                  const i = areaStart[k] + j;
                                  const on = i === active;
                                  return (
                                    <li key={it.title}>
                                      <button
                                        onClick={() => jumpTo(i)}
                                        aria-current={on ? "step" : undefined}
                                        className={cn(
                                          "relative block w-full border-l-2 py-[clamp(4px,0.9vh,8px)] pl-4 text-left text-[15.5px] leading-[1.35] transition-colors duration-300",
                                          on ? "border-gold-deep font-bold text-ink" : "border-transparent text-ink/55 hover:border-ink/20 hover:text-ink",
                                        )}
                                      >
                                        {it.title}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Width the content panel ends at (matches its CSS: 64% / 72% at xl). */
function panelWidth(stageEl: HTMLElement) {
  const w = stageEl.offsetWidth;
  return Math.round(w * (window.innerWidth >= 1280 ? 0.72 : 0.64));
}

/** Phones / tablets: same scroll-driven archive, stacked vertically. */
function MobileArchive({ steps, areaStart }: { steps: Step[]; areaStart: number[] }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const total = steps.length;
  const current = steps[active];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(max-width: 1023px)", () => {
        const trackEl = track.current!;
        const stageEl = stage.current!;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stepPx = () => stageEl.offsetHeight * SCROLL_PER_STEP_MOBILE;
        const size = () => {
          trackEl.style.height = `${stageEl.offsetHeight + (total - 1) * stepPx()}px`;
        };
        size();

        // ---------- Intro: banner columns rise, then the content panel wipes up ----------
        const q = gsap.utils.selector(stageEl);
        if (!reduce) {
          gsap.set(q("[data-m-col]"), { yPercent: 100 });
          gsap.set(q("[data-m-strip]"), { autoAlpha: 1 });
          gsap.set(q("[data-m-panel]"), { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(q("[data-m-meta]"), { autoAlpha: 0, y: 14 });

          const intro = gsap
            .timeline({ paused: true })
            .to(q("[data-m-col]"), { yPercent: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 })
            .addLabel("push", "+=0.2")
            .to(q("[data-m-panel]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" }, "push")
            .to(q("[data-m-strip]"), { autoAlpha: 0, duration: 0.6, ease: "power1.out" }, "push+=0.9")
            .to(q("[data-m-meta]"), { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.07 }, "push+=0.7");

          ScrollTrigger.create({ trigger: trackEl, start: "top 75%", once: true, onEnter: () => intro.play() });
          ScrollTrigger.create({
            trigger: trackEl,
            start: `top top+=${HEADER - 1}`,
            once: true,
            onEnter: () => {
              if (intro.progress() < 1) intro.timeScale(3).play();
            },
          });
        }

        // ---------- Scroll: step through treatments ----------
        const items = q("[data-m-item]");
        const imgs = q("[data-m-img]");
        const bar = q("[data-m-progress]")[0];
        let last = -1;
        const st = ScrollTrigger.create({
          trigger: trackEl,
          start: `top top+=${HEADER}`,
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onRefreshInit: size,
          onUpdate: (self) => {
            const f = self.progress * (total - 1);
            for (let k = 1; k < items.length; k++) {
              const t = smoothstep(clamp01(f - (areaStart[k] - 1)));
              items[k].style.clipPath = `inset(${((1 - t) * 100).toFixed(2)}% 0% 0% 0%)`;
              if (imgs[k] && !reduce) imgs[k].style.transform = `scale(${(1.15 - 0.15 * t).toFixed(4)})`;
            }
            if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
            const idx = Math.round(f);
            if (idx !== last) {
              last = idx;
              setActive(idx);
            }
          },
        });
        (trackEl as HTMLDivElement & { __jump?: (i: number) => number }).__jump = (i: number) => st.start + i * stepPx() + 2;
      });
      return () => mm.revert();
    },
    { scope: track },
  );

  const jumpTo = (i: number) => {
    const el = track.current as (HTMLDivElement & { __jump?: (i: number) => number }) | null;
    const y = el?.__jump?.(i);
    if (y == null) return;
    if (lenis) lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const areaItems = current.area.items.length;
  const posInArea = active - areaStart[current.areaIdx] + 1;

  return (
    <div ref={track} className="relative mt-12 lg:hidden" style={{ height: "500vh" }}>
      <div ref={stage} className="sticky flex w-full flex-col overflow-hidden bg-surface" style={{ top: HEADER, height: `calc(100svh - ${HEADER}px)` }}>
        {/* Image band — fills whatever height the content panel leaves */}
        <div className="relative min-h-[96px] flex-1 overflow-hidden">
          {manageAreas.map((a, i) => (
            <div key={a.area} data-m-item className="absolute inset-0 overflow-hidden" style={{ zIndex: i, clipPath: i === 0 ? undefined : "inset(100% 0% 0% 0%)" }}>
              <div data-m-img className="absolute inset-0 will-change-transform">
                <Image src={AREA_IMAGES[a.title].src} alt={AREA_IMAGES[a.title].alt} fill sizes="100vw" className="object-cover object-[50%_30%]" />
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
          <div data-m-meta className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4">
            <p className="eyebrow text-[11px] text-gold">{current.area.area}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={current.areaIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="display mt-1 text-[clamp(20px,3vh,26px)] leading-[1.1] text-cream"
              >
                {current.area.title}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Content panel — sized to the longest treatment (all steps share one grid cell) */}
        <div data-m-panel className="relative z-20 flex-none bg-paper px-5 pt-4 pb-5 text-ink md:px-10 md:pt-6 md:pb-8">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-ink/10">
            <div data-m-progress className="h-full w-full origin-left scale-x-0 bg-gold-deep" />
          </div>

          {/* Area chips + counter */}
          <div data-m-meta className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {manageAreas.map((a, k) => (
                <button
                  key={a.area}
                  onClick={() => jumpTo(areaStart[k])}
                  aria-label={`${a.area}: ${a.title}`}
                  aria-current={current.areaIdx === k ? "true" : undefined}
                  className={cn(
                    "grid h-8 min-w-10 place-items-center rounded-full px-3 font-display text-[14px] transition-colors duration-300",
                    current.areaIdx === k ? "bg-ink text-cream" : "bg-ink/[0.07] text-ink/55",
                  )}
                >
                  {String(k + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-ink-soft tabular-nums">
              Treatment <span className="font-bold text-ink">{posInArea}</span> of {areaItems}
            </p>
          </div>

          {/* Steps */}
          <div data-m-meta className="mt-3.5 grid border-t border-ink/12 pt-3.5 md:mt-5 md:pt-5">
            {steps.map((s, i) => (
              <div
                key={s.item.title}
                aria-hidden={i !== active}
                className={cn(
                  "col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-500 ease-(--ease-soft)",
                  i === active ? "visible translate-y-0 opacity-100" : cn("invisible opacity-0", i < active ? "-translate-y-3" : "translate-y-3"),
                )}
              >
                <h4 className="font-display text-[clamp(17px,2.4vh,20px)] leading-[1.25] text-ink">{s.item.title}</h4>
                <div className="mt-2 space-y-[clamp(4px,0.9vh,8px)] text-[clamp(14px,1.9vh,16px)] leading-[1.6] text-ink md:text-[17px]">
                  {s.item.body.map((p) => (
                    <p key={p}>
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner strip (intro only) */}
        <div data-m-strip className="pointer-events-none invisible absolute inset-0 z-[15] flex">
          {manageAreas.map((a) => (
            <div key={a.area} data-m-col className="relative h-full flex-1 overflow-hidden">
              <Image src={AREA_IMAGES[a.title].src} alt="" fill sizes="34vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
              <p className="eyebrow absolute inset-x-0 bottom-0 p-3 text-[10px] text-gold">{a.area}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhyChoose() {
  return (
    <div className="container-site pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
        <Reveal>
          <p className="eyebrow text-gold">Why choose us</p>
          <h3 className="display mt-4 text-[26px] text-cream sm:text-[32px] md:text-[40px]">
            Why choose Sydney Centre for TMJ and Sleep Therapy <span className="text-gold">in Sydney CBD?</span>
          </h3>
        </Reveal>
      </div>

      <CardCarousel items={whyChoose} tone="dark" className="mt-12" />
    </div>
  );
}
