"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Images from /public, cycled in order as the cursor moves. */
  images: string[];
  className?: string;
};

/** Minimum cursor travel (px) between two cards. */
const SPACING = 90;
/** Minimum time (ms) between two cards. */
const INTERVAL = 80;
/** Cards alive at once. */
const MAX_CARDS = 7;
/** Lifetime of one card (ms). */
const LIFE = 1500;

/** Small, optimised copy via the Next image optimiser (the originals are ~2 MB PNGs). */
const optimised = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;

/**
 * Cursor image trail: as the mouse moves over the parent element, clinical
 * images pop in under the cursor, drift in the direction of travel and fade.
 *
 * - Place inside a `position: relative` parent; content that should stay on
 *   top needs a higher z-index (e.g. `relative z-10`).
 * - Mouse only (no touch), and off for reduced-motion users.
 * - Images are preloaded the first time the cursor enters, not on page load.
 * - Paused over links / buttons / anything marked `data-trail-off`.
 */
export function ImageTrail({ images, className }: Props) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    const host = el?.parentElement;
    if (!el || !host || images.length === 0) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    const urls = images.map(optimised);
    let preloaded = false;
    const preload = () => {
      if (preloaded) return;
      preloaded = true;
      urls.forEach((u) => {
        const img = new Image();
        img.decoding = "async";
        img.src = u;
      });
    };

    let index = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let primed = false;
    let z = 1;

    const spawn = (x: number, y: number, dx: number, dy: number) => {
      const card = document.createElement("div");
      card.className =
        "pointer-events-none absolute left-0 top-0 aspect-[16/10] w-[220px] overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)] ring-1 ring-white/20 sm:w-[260px] lg:w-[300px]";
      card.style.zIndex = String(z++);

      const img = document.createElement("img");
      img.src = urls[index];
      img.alt = "";
      img.draggable = false;
      img.decoding = "async";
      img.className = "h-full w-full select-none object-cover";
      card.appendChild(img);
      index = (index + 1) % urls.length;

      el.appendChild(card);
      while (el.childElementCount > MAX_CARDS) el.firstElementChild?.remove();

      // Drift along the direction of travel; tilt follows horizontal motion
      const len = Math.hypot(dx, dy) || 1;
      const driftX = (dx / len) * 60;
      const driftY = (dy / len) * 60;
      const rot = Math.max(-10, Math.min(10, (dx / len) * 8 + (Math.random() - 0.5) * 6));
      const at = (ox: number, oy: number, r: number, s: number) =>
        `translate(${x + ox}px, ${y + oy}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})`;

      const anim = card.animate(
        [
          { transform: at(0, 0, rot * 1.6, 0.6), opacity: 0, filter: "blur(6px)" },
          { transform: at(driftX * 0.25, driftY * 0.25, rot, 1.02), opacity: 1, filter: "blur(0px)", offset: 0.15 },
          { transform: at(driftX * 0.7, driftY * 0.7, rot * 0.6, 1), opacity: 1, filter: "blur(0px)", offset: 0.6 },
          { transform: at(driftX, driftY + 30, rot * 0.3, 0.86), opacity: 0, filter: "blur(4px)" },
        ],
        { duration: LIFE, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
      anim.onfinish = () => card.remove();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if ((e.target as Element | null)?.closest("a, button, input, textarea, select, [data-trail-off]")) {
        primed = false; // start fresh after leaving the control
        return;
      }

      const box = host.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;

      if (!primed) {
        primed = true;
        lastX = x;
        lastY = y;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      if (dx * dx + dy * dy < SPACING * SPACING) return;
      if (e.timeStamp - lastTime < INTERVAL) return;

      lastX = x;
      lastY = y;
      lastTime = e.timeStamp;
      spawn(x, y, dx, dy);
    };

    const onEnter = () => {
      preload();
      primed = false;
    };
    const onLeave = () => {
      primed = false;
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      el.replaceChildren();
    };
  }, [images]);

  return <div ref={layer} aria-hidden className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)} />;
}
