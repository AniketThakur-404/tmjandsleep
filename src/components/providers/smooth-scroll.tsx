"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger
 * and Lenis stay perfectly in sync.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
        anchors: { offset: -100 },
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

/**
 * ReactLenis creates its instance in its own effect, after the provider's
 * effect has run, so subscribe through the context hook instead of the ref.
 */
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}
