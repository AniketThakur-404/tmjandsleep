"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Rich } from "@/components/rich";
import type { Tone } from "@/components/section";
import { cn } from "@/lib/utils";

export type StackItem = {
  title: string;
  /** Small label above the title (the card number is always shown) */
  label?: string;
  body: string[];
  /** Optional — without it the card is a single text column */
  image?: { src: string; alt: string; fit: "cover" | "contain" };
};

export function CardCarousel({ items, tone, className }: { items: readonly StackItem[]; tone: Tone; className?: string }) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = items.length;
  const dark = tone === "dark";
  const controlClass = cn(
    "grid size-11 cursor-pointer place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    dark ? "border-gold/40 text-gold hover:bg-gold hover:text-ink" : "border-gold-deep/40 text-gold-deep hover:bg-gold-deep hover:text-paper",
  );

  function move(step: number) {
    setActive((index) => (index + step + total) % total);
  }

  if (!total) return null;

  return (
    <div className={className} role="region" aria-roledescription="carousel" aria-label="Why choose us">
      <div
        className="grid [touch-action:pan-y_pinch-zoom]"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || total < 2) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.title}
            inert={index !== active}
            className={cn(
              "col-start-1 row-start-1 grid motion-safe:transition-opacity motion-safe:duration-300",
              index !== active && "invisible opacity-0",
            )}
          >
            <Card item={item} index={index} total={total} tone={tone} />
          </div>
        ))}
      </div>
      {total > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" className={controlClass} aria-label="Previous card" onClick={() => move(-1)}>
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <div className="flex items-center">
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={cn("grid size-9 cursor-pointer place-items-center rounded-full focus-visible:outline-2", dark ? "text-gold" : "text-gold-deep")}
                aria-label={`Show card ${index + 1}: ${item.title}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
              >
                <span className={cn("size-2.5 rounded-full border border-current", index === active && "bg-current")} />
              </button>
            ))}
          </div>
          <button type="button" className={controlClass} aria-label="Next card" onClick={() => move(1)}>
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
      <p className="sr-only" role="status">Card {active + 1} of {total}. {items[active]?.title}</p>
    </div>
  );
}

/** Where the first card sticks (just below the 88px fixed header) and how far each later card sits below it. */
const STICK_TOP = 104;
const STEP = 20;

/**
 * Stacking cards: each card sticks near the top and the next slides up over it;
 * cards underneath scale down slightly so the pile reads as a stack.
 * A card taller than the screen sticks by its bottom edge instead (negative top),
 * so it is always scrolled through in full before the next card covers it.
 * Plain list only for users who prefer reduced motion.
 */
export function StackCards({ items, tone, className }: { items: readonly StackItem[]; tone: Tone; className?: string }) {
  const list = useRef<HTMLDivElement>(null);
  const tops = useStickyTops(list, items.length);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start start", "end end"] });

  return (
    <div ref={list} className={cn("space-y-5 lg:space-y-8", className)}>
      {items.map((item, i) => (
        <StackCard key={item.title} item={item} index={i} total={items.length} progress={scrollYProgress} top={tops?.[i]} tone={tone} />
      ))}
    </div>
  );
}

function StackCard({
  item: c,
  index: i,
  total,
  progress,
  top,
  tone,
}: {
  item: StackItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  /** Sticky offset in px; undefined = no stacking */
  top?: number;
  tone: Tone;
}) {
  const stack = top !== undefined;
  // Each card shrinks a little more the further down the pile it ends up
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - 1 - i) * 0.04]);

  return (
    <div className={cn(stack && "sticky")} style={stack ? { top } : undefined}>
      <motion.div data-stack-card style={stack ? { scale, transformOrigin: "top center" } : undefined}>
        <Card item={c} index={i} total={total} tone={tone} />
      </motion.div>
    </div>
  );
}

function Card({ item: c, index: i, total, tone }: { item: StackItem; index: number; total: number; tone: Tone }) {
  const dark = tone === "dark";

  return (
    <article
      className={cn(
        "group grid overflow-hidden rounded-2xl ring-1 transition-[box-shadow] duration-500",
        c.image && "lg:min-h-[440px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
        dark
          ? "bg-panel shadow-[0_-20px_50px_-24px_rgba(0,0,0,0.7)] ring-cream/10 hover:ring-gold/40"
          : "bg-paper shadow-[0_-20px_50px_-28px_rgba(0,0,0,0.3)] ring-ink/[0.06] hover:ring-gold-deep/40",
      )}
    >
      {c.image && <StackImage img={c.image} dark={dark} />}
      <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
        <p className={cn("eyebrow", dark ? "text-gold" : "text-gold-deep")}>
          {String(i + 1).padStart(2, "0")} <span className={dark ? "text-cream/40" : "text-ink/35"}>/ {String(total).padStart(2, "0")}</span>
          {c.label && <span className="ml-3">{c.label}</span>}
        </p>
        <h3
          className={cn(
            dark ? "mt-4 text-[26px] leading-[1.15] text-cream uppercase md:text-[30px]" : "mt-4 font-display text-[26px] leading-[1.15] text-ink md:text-[30px]",
          )}
        >
          {c.title}
        </h3>
        <div className={cn("mt-5 h-px bg-gradient-to-r to-transparent", dark ? "from-gold/60 via-gold/25" : "from-gold-deep/50 via-gold-deep/20")} />
        <div className="copy mt-5">
          {c.body.map((p) => (
            <p key={p}>
              <Rich text={p} />
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

function StackImage({ img, dark }: { img: NonNullable<StackItem["image"]>; dark: boolean }) {
  return (
    <div className={cn("relative aspect-[16/9] overflow-hidden lg:aspect-auto", img.fit === "contain" ? "bg-white" : dark ? "bg-panel" : "bg-paper")}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(min-width: 1024px) 520px, 100vw"
        className={cn(
          "transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.04]",
          img.fit === "contain" ? "object-contain p-4" : "object-cover object-[50%_30%]",
        )}
      />
    </div>
  );
}

/**
 * Sticky offset for each card: STICK_TOP + i × STEP, but never so low that the
 * card's bottom would sit below the screen — tall cards stick by their bottom
 * edge instead. null when the user prefers reduced motion (plain list).
 */
function useStickyTops(list: RefObject<HTMLDivElement | null>, count: number) {
  const [tops, setTops] = useState<number[] | null>(null);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (mq.matches) return setTops(null);
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-stack-card]"));
      const next = cards.map((c, i) => Math.round(Math.min(STICK_TOP + i * STEP, window.innerHeight - c.offsetHeight - 16)));
      setTops((prev) => (prev && prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [list, count]);
  return tops;
}
