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
              <li key={s} className="flex gap-3.5 py-2.5 text-[15.5px] leading-[1.55] text-ink">
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
  const stage = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  const select = useCallback((index: number) => {
    if (index === current.current) return;
    current.current = index;
    setActive(index);
  }, []);

  useEffect(() => {
    const panel = stage.current!;
    const phone = window.matchMedia("(width < 40rem)");
    // A tall slide scrolls with the document until its last paragraph is visible.
    const positionStage = () => {
      panel.style.top = `${Math.min(HEADER_HEIGHT, window.innerHeight - panel.offsetHeight)}px`;
    };
    positionStage();
    const observer = new ResizeObserver(positionStage);
    observer.observe(panel);
    window.addEventListener("resize", positionStage);
    const isDocked = () => Math.abs(panel.getBoundingClientRect().top - parseFloat(panel.style.top)) <= 1;
    const canStep = (direction: number) => current.current + direction >= 0 && current.current + direction < signs.length;

    function step(event: Event, direction: number) {
      if (phone.matches || !canStep(direction)) return false;
      const rect = panel.getBoundingClientRect();
      const dockTop = parseFloat(panel.style.top);
      if (!isDocked()) {
        // Catch the approach while the slide is in view, including fast wheel input.
        if (Math.abs(rect.top - dockTop) > (innerHeight - HEADER_HEIGHT) * 0.35) return false;
        if ((rect.top - dockTop) * direction < 0) return false;
      }
      if (event.cancelable) event.preventDefault();
      event.stopImmediatePropagation();
      const y = window.scrollY + rect.top - dockTop;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" });
      select(current.current + direction);
      return true;
    }

    let lastWheelTime = -Infinity;
    let lastStepTime = -Infinity;
    let lastDelta = 0;
    let consumedWheel = false;
    function onWheel(event: WheelEvent) {
      if (phone.matches || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const now = performance.now();
      const delta = event.deltaY;
      // Zoom and OS wheel settings can make individual notches small or fractional.
      const gap = now - lastWheelTime;
      const magnitude = Math.abs(delta);
      const repeatNotch = magnitude >= 1 && Math.abs(delta - lastDelta) < 0.01 && gap >= 45;
      const freshPush = now - lastStepTime >= TRANSITION_MS && magnitude >= 4 &&
        (magnitude > Math.abs(lastDelta) * 1.5 || (delta === lastDelta && magnitude >= 16));
      if (event.deltaMode !== 0 || repeatNotch || freshPush || gap > 140 ||
          Math.sign(delta) !== Math.sign(lastDelta) || !isDocked()) consumedWheel = false;
      lastWheelTime = now;
      lastDelta = delta;
      if (!canStep(Math.sign(delta))) {
        // Let a sustained wheel scroll leave the first or last slide.
        if (now - lastStepTime >= TRANSITION_MS) consumedWheel = false;
      }
      if (consumedWheel) {
        if (event.cancelable) event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      consumedWheel = step(event, Math.sign(delta));
      if (consumedWheel) lastStepTime = now;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], [role=dialog], nav"))) return;
      if (phone.matches && panel.contains(document.activeElement) && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        event.preventDefault();
        if (canStep(direction)) select(current.current + direction);
        return;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        step(event, event.key === "ArrowUp" ? -1 : 1);
      }
    }

    let touchStart: Touch | null = null;
    let touchConsumed = false;
    function onTouchStart(event: TouchEvent) {
      touchStart = event.touches.length === 1 && (phone.matches || isDocked()) ? event.touches[0] : null;
      touchConsumed = false;
    }
    function onTouchMove(event: TouchEvent) {
      if (phone.matches || !touchStart || event.touches.length !== 1) return;
      if (touchConsumed) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      const touch = event.touches[0];
      const delta = touchStart.clientY - touch.clientY;
      const direction = Math.sign(delta);
      if (Math.abs(delta) <= Math.abs(touchStart.clientX - touch.clientX)) return;
      if (!canStep(direction)) return;
      if (event.cancelable) event.preventDefault();
      if (Math.abs(delta) >= 40) touchConsumed = step(event, direction);
    }

    function onTouchEnd(event: TouchEvent) {
      if (!phone.matches || !touchStart || event.touches.length) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.clientX;
      const dy = touch.clientY - touchStart.clientY;
      touchStart = null;
      if (Math.abs(dx) < 48 || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
      const direction = dx < 0 ? 1 : -1;
      if (canStep(direction)) select(current.current + direction);
    }
    panel.addEventListener("touchend", onTouchEnd);
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("keydown", onKeyDown);
    panel.addEventListener("touchstart", onTouchStart, { passive: true });
    panel.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      panel.removeEventListener("touchend", onTouchEnd);
      observer.disconnect();
      window.removeEventListener("resize", positionStage);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKeyDown);
      panel.removeEventListener("touchstart", onTouchStart);
      panel.removeEventListener("touchmove", onTouchMove);
    };
  }, [lenis, select]);

  return (
    <div className="mt-12 [overflow-anchor:none] sm:after:block sm:after:h-[35svh] md:mt-16">
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
                    <h3 className="mt-2 text-[clamp(1.125rem,2.6vw,2.75rem)] leading-[1.12] text-ink uppercase max-sm:text-[24px]">{sign.title}</h3>
                    <div className="mt-3 space-y-2.5 text-base leading-[1.6] text-ink-soft md:text-[15px]">
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
                onClick={() => select(index)}
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
