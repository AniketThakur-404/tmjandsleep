"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Counts from 0 to `value` when scrolled into view (GSAP). */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!el.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const counter = { v: 0 };
    el.current.textContent = `0${suffix}`;
    gsap.to(counter, {
      v: value,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: { trigger: el.current, start: "top 85%", once: true },
      onUpdate: () => {
        if (el.current) el.current.textContent = `${Math.round(counter.v)}${suffix}`;
      },
    });
  });

  return (
    <span ref={el} className={className}>
      {value}
      {suffix}
    </span>
  );
}
