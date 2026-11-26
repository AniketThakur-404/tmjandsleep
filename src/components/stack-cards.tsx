"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
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
  const dark = tone === "dark";

  return (
    <div className={cn(stack && "sticky")} style={stack ? { top } : undefined}>
      <motion.article
        data-stack-card
        style={stack ? { scale, transformOrigin: "top center" } : undefined}
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
      </motion.article>
    </div>
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
