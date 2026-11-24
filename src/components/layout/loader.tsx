"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Shortest time the intro is shown, even on a fast connection (ms). */
const MIN_INTRO = 2300;
/** Never block the page longer than this waiting for assets (ms). */
const MAX_WAIT = 6000;

/** Thin decorative curves that draw in around the edges (echo the logo swoosh). */
const CURVES = [
  "M -40 190 C 180 120, 330 280, 560 175 S 880 30, 1010 -30",
  "M 1180 -30 C 1195 120, 1310 175, 1490 150",
  "M -40 650 C 120 610, 170 770, 330 830 S 520 905, 570 960",
  "M 600 960 C 760 780, 1000 880, 1190 740 S 1400 630, 1500 670",
];

/**
 * Intro loader:
 * 1. curves draw in, the logo builds piece by piece (swoosh → line → rule → wordmark)
 * 2. progress line follows real readiness (fonts + first hero frame)
 * 3. exit: a hairline cuts across the centre and the screen splits open
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Freeze scrolling while the loader is up
  useEffect(() => {
    if (done) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis, done]);

  useGSAP(
    () => {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      document.documentElement.classList.add("is-loading");

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = { p: 0 };

      // Put the split exactly on the logo's rule line (not the screen centre).
      // The artwork in each half is anchored to the full viewport height, so
      // the rule's position never depends on where the split is.
      const measure = () => {
        const el = root.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        el.style.setProperty("--full", `${box.height}px`);
        const rule = el.querySelector<HTMLElement>("[data-panel='top'] [data-rule]");
        if (!rule) return;
        const r = rule.getBoundingClientRect();
        if (r.height > 0) el.style.setProperty("--split", `${r.top + r.height / 2 - box.top}px`);
      };
      measure();
      window.addEventListener("resize", measure);
      const setBar = () => gsap.set("[data-progress]", { scaleX: progress.p });

      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        window.__appRevealed = true;
        window.dispatchEvent(new Event("app:reveal"));
        setDone(true);
        // Re-measure pins once scrolling (and the scrollbar) is back
        requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
      };

      // ---- Intro ---------------------------------------------------------
      if (reduce) {
        gsap.set("[data-curve]", { strokeDashoffset: 0 });
        gsap.set("[data-swoosh]", { clipPath: "inset(0 0% 0 0)" });
        gsap.set("[data-line1]", { y: 0, yPercent: 0 });
        gsap.set("[data-rule]", { scaleX: 1 });
        gsap.set("[data-line2]", { "--reveal": "120%" });
      } else {
        gsap
          .timeline()
          .to("[data-curve]", { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.12 }, 0)
          .to("[data-swoosh]", { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut" }, 0.2)
          .to("[data-line1]", { y: 0, yPercent: 0, duration: 0.9, ease: "expo.out" }, 0.75)
          .to("[data-rule]", { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0.85)
          .to("[data-line2]", { "--reveal": "120%", duration: 1, ease: "power2.inOut" }, 0.95);
      }

      // Progress creeps toward 85% while we wait…
      const creep = gsap.to(progress, { p: 0.85, duration: MIN_INTRO / 1000 + 1, ease: "power1.out", onUpdate: setBar });

      // ---- Exit ----------------------------------------------------------
      const exit = gsap.timeline({ paused: true, onComplete: finish });
      if (reduce) {
        exit.to(root.current, { autoAlpha: 0, duration: 0.4 });
      } else {
        exit
          .to("[data-cut]", { scaleX: 1, duration: 0.6, ease: "expo.inOut" })
          .addLabel("split", "+=0.05")
          .add(() => {
            // let the hero start its entrance as the page is revealed
            window.__appRevealed = true;
            window.dispatchEvent(new Event("app:reveal"));
          }, "split")
          .to("[data-cut]", { autoAlpha: 0, duration: 0.25 }, "split")
          .to(
            "[data-panel='top']",
            { yPercent: -100, borderBottomLeftRadius: 56, borderBottomRightRadius: 56, duration: 1.15, ease: "expo.inOut" },
            "split",
          )
          .to(
            "[data-panel='bottom']",
            { yPercent: 100, borderTopLeftRadius: 56, borderTopRightRadius: 56, duration: 1.15, ease: "expo.inOut" },
            "split",
          );
      }

      // ---- Readiness -----------------------------------------------------
      const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
      const heroReady = new Promise<void>((resolve) => {
        if (window.__heroReady) return resolve();
        window.addEventListener("hero:ready", () => resolve(), { once: true });
      });
      let cancelled = false;

      Promise.race([
        Promise.all([document.fonts?.ready ?? Promise.resolve(), heroReady, wait(reduce ? 500 : MIN_INTRO)]),
        wait(MAX_WAIT),
      ]).then(() => {
        if (cancelled) return;
        creep.kill();
        gsap.to(progress, {
          p: 1,
          duration: 0.45,
          ease: "power2.out",
          onUpdate: setBar,
          onComplete: () => {
            measure();
            exit.play();
          },
        });
      });

      return () => {
        cancelled = true;
        window.removeEventListener("resize", measure);
        document.documentElement.classList.remove("is-loading");
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100]"
      role="status"
      aria-live="polite"
      style={{ "--split": "50%", "--full": "100dvh" } as React.CSSProperties}
    >
      <span className="sr-only">Loading</span>

      {/* The two halves carry identical artwork, so the logo splits with them.
          The split point (--split) is measured to sit on the logo's rule line. */}
      <div data-panel="top" className="absolute inset-x-0 top-0 overflow-hidden bg-paper" style={{ height: "var(--split)" }}>
        <div className="absolute inset-x-0 top-0" style={{ height: "var(--full)" }}>
          <LoaderArt />
        </div>
      </div>
      <div
        data-panel="bottom"
        className="absolute inset-x-0 bottom-0 overflow-hidden bg-paper"
        style={{ height: "calc(100% - var(--split))" }}
        aria-hidden
      >
        <div className="absolute inset-x-0 bottom-0" style={{ height: "var(--full)" }}>
          <LoaderArt />
        </div>
      </div>

      {/* Hairline that cuts across before the split */}
      <div
        data-cut
        className="absolute inset-x-0 h-[1.5px] -translate-y-1/2 scale-x-0 bg-ink"
        style={{ top: "var(--split)" }}
      />
    </div>
  );
}

function LoaderArt() {
  return (
    <>
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
        {CURVES.map((d) => (
          <path
            key={d}
            data-curve
            d={d}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            stroke="#8a6a17"
            strokeOpacity={0.35}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <div className="w-[min(74vw,400px)]">
          {/* Logo rebuilt from its four layers (public/images/logo-parts) */}
          <div data-swoosh style={{ clipPath: "inset(0 100% 0 0)" }}>
            <Image src="/images/logo-parts/swoosh.png" alt="" width={610} height={112} priority className="h-auto w-full" />
          </div>
          <div className="overflow-hidden">
            <div data-line1 style={{ transform: "translateY(110%)" }}>
              <Image src="/images/logo-parts/line1.png" alt="" width={610} height={42} priority className="h-auto w-full" />
            </div>
          </div>
          <div data-rule className="origin-left" style={{ transform: "scaleX(0)" }}>
            <Image src="/images/logo-parts/rule.png" alt="" width={610} height={7} priority className="h-auto w-full" />
          </div>
          <div
            data-line2
            style={
              {
                "--reveal": "0%",
                WebkitMaskImage: "linear-gradient(90deg, #000 calc(var(--reveal) - 14%), transparent var(--reveal))",
                maskImage: "linear-gradient(90deg, #000 calc(var(--reveal) - 14%), transparent var(--reveal))",
              } as React.CSSProperties
            }
          >
            <Image src="/images/logo-parts/line2.png" alt="Sydney Centre for TMJ & Sleep Therapy" width={610} height={73} priority className="h-auto w-full" />
          </div>

          {/* Real loading progress */}
          <div className="mx-auto mt-10 h-px w-2/3 bg-ink/10">
            <div data-progress className="h-full origin-left scale-x-0 bg-gold-deep" />
          </div>
        </div>
      </div>
    </>
  );
}
