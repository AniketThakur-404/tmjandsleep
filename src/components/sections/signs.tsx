"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { HEADER_HEIGHT } from "@/components/layout/header";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { signs, symptomList } from "@/content/tmj";
import { cn } from "@/lib/utils";

const TRANSITION_MS = 450;
/** Scroll distance (in svh) that each slide occupies while the panel is docked. */
const SLIDE_SCROLL_SVH = 60;
/** Wheel silence that ends one gesture (mouse notch burst or trackpad momentum). */
const GESTURE_GAP_MS = 180;

export function Signs() {
  return (
    <Section tone="light" flush id="symptoms" className="pt-24 sm:pb-20 md:pt-32 md:pb-24">
      <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-20">
        <SectionHeading tone="light" eyebrow="Understanding your symptoms" title="TMJ and jaw pain symptoms:" accent="what they may be telling you" />
        <Reveal className="copy">
          <p>
            <Rich text="Where pain is felt does not always reveal where it starts. A chewing muscle can refer pain towards the temple; discomfort near the ear can come from the jaw, a tooth or the ear itself. [1,2,8]" />
          </p>
          <p>
            Before your appointment, note where it hurts, when it started and what changes it. Chewing, yawning, waking and concentrating can all provide
            useful clues. <strong className="font-bold text-ink">Record whether your headache starts before or after the jaw pain.</strong>
          </p>
          <p className="text-ink">
            <Rich text="Common TMJ and jaw pain symptoms include: [1,2]" />
          </p>
          <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
            {symptomList.map((s) => (
              <li key={s} className="type-body flex gap-3.5 py-2.5 text-ink">
                <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-gold-deep" />
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <ScrollAdventure />
    </Section>
  );
}

function ScrollAdventure() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const goTo = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  const select = useCallback((index: number) => {
    if (index === current.current) return;
    current.current = index;
    setActive(index);
  }, []);

  useEffect(() => {
    const rail = track.current!;
    const panel = stage.current!;
    const phone = window.matchMedia("(width < 40rem)");
    const last = signs.length - 1;

    /*
     * Tablet / desktop: the panel is sticky inside a taller track, and the
     * scroll position inside that track decides which slide is shown. Because
     * the panel does not move while docked, wheel input can jump between slide
     * positions instantly; touch, keyboard and the scrollbar simply scroll
     * through the same positions.
     */
    const geometry = () => {
      const dock = parseFloat(panel.style.top) || 0;
      const start = rail.getBoundingClientRect().top + window.scrollY - dock;
      const step = Math.max(1, (rail.offsetHeight - panel.offsetHeight) / last);
      return { start, step, end: start + step * last };
    };
    const indexAt = (y: number) => {
      const { start, step } = geometry();
      return Math.min(last, Math.max(0, Math.round((y - start) / step)));
    };
    // Where the page is heading: Lenis' target while it is gliding.
    const heading = () => lenis?.targetScroll ?? window.scrollY;
    const isDocked = (y: number) => {
      const { start, end } = geometry();
      return y >= start - 1 && y <= end + 1;
    };

    // While a button-triggered glide crosses the track, keep showing its target slide.
    let pinned: number | null = null;
    let pinTimer = 0;
    const sync = () => {
      if (!phone.matches && pinned === null) select(indexAt(window.scrollY));
    };

    // A tall slide scrolls with the document until its last paragraph is visible.
    const positionStage = () => {
      panel.style.top = `${Math.min(HEADER_HEIGHT, window.innerHeight - panel.offsetHeight)}px`;
      sync();
    };
    positionStage();
    const observer = new ResizeObserver(positionStage);
    observer.observe(panel);
    window.addEventListener("resize", positionStage);
    window.addEventListener("scroll", sync, { passive: true });

    const jump = (y: number) => {
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" });
    };
    const glide = (y: number, onComplete?: () => void) => {
      if (lenis) lenis.scrollTo(y, { onComplete });
      else {
        window.scrollTo({ top: y, behavior: "smooth" });
        onComplete?.();
      }
    };

    goTo.current = (index) => {
      if (phone.matches) return select(index);
      const { start, step } = geometry();
      const y = start + step * index;
      if (isDocked(window.scrollY)) return jump(y);
      // Approaching from outside: glide in, showing the chosen slide throughout.
      select(index);
      pinned = index;
      const release = () => {
        window.clearTimeout(pinTimer);
        pinned = null;
        sync();
      };
      pinTimer = window.setTimeout(release, 1500);
      glide(y, release);
    };

    const consume = (event: Event) => {
      if (event.cancelable) event.preventDefault();
      // Keep Lenis (listening on window, bubble phase) from also scrolling the page.
      event.stopImmediatePropagation();
    };

    /*
     * One wheel gesture moves exactly one slide. A mouse "gesture" is a burst
     * of notches; a trackpad gesture includes its momentum tail. A new gesture
     * starts after a pause, a direction change, or a fresh push that clearly
     * outgrows the decaying momentum.
     */
    let engaged = false;
    let lastWheel = -Infinity;
    let lastStep = -Infinity;
    let lastMagnitude = 0;
    let lastDirection = 0;
    function onWheel(event: WheelEvent) {
      if (phone.matches || event.ctrlKey || lenis?.isStopped) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const now = performance.now();
      const direction = Math.sign(event.deltaY);
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const magnitude = Math.abs(event.deltaY) * unit;
      if (now - lastWheel > GESTURE_GAP_MS || direction !== lastDirection ||
          (magnitude >= 10 && magnitude > lastMagnitude * 2)) engaged = false;
      lastWheel = now;
      lastMagnitude = magnitude;
      lastDirection = direction;

      if (engaged) return consume(event);

      const { start, step, end } = geometry();
      const from = heading();
      const to = from + direction * magnitude;

      // Entering the track: stop on its first (or last) slide instead of letting
      // smooth-scroll momentum carry the page through it.
      if ((direction > 0 && from < start - 1 && to >= start - 1) ||
          (direction < 0 && from > end + 1 && to <= end + 1)) {
        consume(event);
        engaged = true;
        lastStep = now;
        glide(direction > 0 ? start : end);
        return;
      }

      if (from < start - 1 || from > end + 1) return;
      const next = Math.min(last, Math.max(0, Math.round((from - start) / step))) + direction;
      // Past the first or last slide, a new gesture scrolls the page on.
      if (next < 0 || next > last) return;
      consume(event);
      // A push that lands mid-transition is absorbed whole, momentum tail included.
      engaged = true;
      if (now - lastStep < TRANSITION_MS) return;
      lastStep = now;
      jump(start + step * next);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], [role=dialog], nav"))) return;
      if (phone.matches) {
        if (panel.contains(document.activeElement) && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
          const next = current.current + (event.key === "ArrowLeft" ? -1 : 1);
          event.preventDefault();
          if (next >= 0 && next <= last) select(next);
        }
        return;
      }
      const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1
        : event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 0;
      if (!direction || !isDocked(heading())) return;
      const next = indexAt(heading()) + direction;
      if (next < 0 || next > last) return;
      event.preventDefault();
      const { start, step } = geometry();
      jump(start + step * next);
    }

    // Phone: the slides are a horizontal carousel instead.
    let touchStart: Touch | null = null;
    function onTouchStart(event: TouchEvent) {
      touchStart = phone.matches && event.touches.length === 1 ? event.touches[0] : null;
    }
    function onTouchEnd(event: TouchEvent) {
      if (!phone.matches || !touchStart || event.touches.length) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.clientX;
      const dy = touch.clientY - touchStart.clientY;
      touchStart = null;
      if (Math.abs(dx) < 48 || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
      const next = current.current + (dx < 0 ? 1 : -1);
      if (next >= 0 && next <= last) select(next);
    }

    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("keydown", onKeyDown);
    panel.addEventListener("touchstart", onTouchStart, { passive: true });
    panel.addEventListener("touchend", onTouchEnd);
    return () => {
      window.clearTimeout(pinTimer);
      observer.disconnect();
      window.removeEventListener("resize", positionStage);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKeyDown);
      panel.removeEventListener("touchstart", onTouchStart);
      panel.removeEventListener("touchend", onTouchEnd);
    };
  }, [lenis, select]);

  return (
    <div
      ref={track}
      className="mt-12 [overflow-anchor:none] sm:after:block sm:after:h-(--track) md:mt-16"
      style={{ "--track": `${(signs.length - 1) * SLIDE_SCROLL_SVH}svh` } as React.CSSProperties}
    >
      <div
        ref={stage}
        data-symptom-adventure
        role="region"
        aria-label="Symptom details"
        className="flex flex-col bg-paper max-sm:min-h-0! max-sm:touch-pan-y max-sm:touch-pinch-zoom sm:sticky"
        style={{ top: HEADER_HEIGHT, minHeight: `calc(100dvh - ${HEADER_HEIGHT}px)` }}
      >
        <div className="relative grid flex-1 overflow-clip">
          <div className="pointer-events-none absolute inset-x-2 top-[clamp(4rem,12svh,7rem)] z-20 flex -translate-y-1/2 justify-between sm:hidden">
            {[-1, 1].map((direction) => {
              const previous = direction < 0;
              const Icon = previous ? ChevronLeft : ChevronRight;
              const target = active + direction;
              return (
                <button
                  key={direction}
                  type="button"
                  aria-label={previous ? "Previous symptom" : "Next symptom"}
                  disabled={target < 0 || target >= signs.length}
                  onClick={() => select(target)}
                  className="pointer-events-auto grid size-11 place-items-center rounded-full bg-paper text-ink shadow-md ring-1 ring-ink/15 focus-visible:outline-2 disabled:opacity-35"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          {signs.map((sign, index) => {
            const even = index % 2 === 0;
            return (
              <article
                key={sign.title}
                data-symptom-slide
                inert={index !== active}
                className={cn("pointer-events-none col-start-1 row-start-1 grid sm:grid-cols-2", "max-sm:w-full max-sm:transition-transform max-sm:duration-300 motion-reduce:transition-none", index === active ? "z-10" : "max-sm:absolute max-sm:inset-x-0 max-sm:top-0", index < active && "max-sm:-translate-x-full", index > active && "max-sm:translate-x-full")}
              >
                <div
                  className={cn(
                    "pointer-events-auto relative overflow-hidden bg-white transition-transform max-sm:h-[clamp(8rem,24svh,14rem)] motion-reduce:transition-none",
                    !even && "sm:order-2",
                    index !== active && (even ? "sm:translate-y-full" : "sm:-translate-y-full"),
                  )}
                  style={{ transitionDuration: `${TRANSITION_MS}ms` }}
                >
                  <Image
                    src={sign.image}
                    alt={sign.title}
                    fill
                    sizes="(max-width: 639px) 100vw, 50vw"
                    className={sign.fit === "contain" ? "object-contain p-2 md:p-8" : "object-cover"}
                  />
                </div>
                <div
                  data-symptom-copy
                  className={cn(
                    "pointer-events-auto bg-paper transition-transform motion-reduce:transition-none",
                    index !== active && (even ? "sm:-translate-y-full" : "sm:translate-y-full"),
                  )}
                  style={{ transitionDuration: `${TRANSITION_MS}ms` }}
                >
                  <div className="mx-auto flex min-h-full max-w-[44rem] flex-col justify-center p-5 sm:p-5 lg:px-8 lg:py-5">
                    <p className="eyebrow text-gold-deep">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="type-h3 mt-2 leading-[1.12] text-ink uppercase">{sign.title}</h3>
                    <div className="type-body mt-3 space-y-2.5 text-ink-soft">
                      {sign.body.map((paragraph) => <p key={paragraph}><Rich text={paragraph} /></p>)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="order-first hidden flex-wrap sm:flex items-center justify-between gap-x-3 border-b border-ink/10 bg-beige px-3 py-1.5 sm:px-6">
          <p className="text-sm font-bold text-ink">
            Symptom {active + 1} of {signs.length}
            <span className="ml-3 hidden font-normal text-ink-soft sm:inline">Scroll up or down to change</span>
          </p>
          <div role="group" aria-label="Jump to a symptom" className="flex gap-1">
            {signs.map((sign, index) => (
              <button
                key={sign.title}
                type="button"
                aria-label={sign.title}
                aria-current={active === index ? "step" : undefined}
                onClick={() => goTo.current(index)}
                className="size-11 sm:size-9 cursor-pointer rounded-full text-xs font-bold text-ink/65 transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=step]:bg-gold aria-[current=step]:text-ink"
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" role="status">{active + 1} of {signs.length}. {signs[active].title}</p>
      </div>
    </div>
  );
}
