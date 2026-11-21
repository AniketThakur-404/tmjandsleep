"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------------------------------------------------------
   Scroll-scrubbed frame sequence (see public/hero frames/manifest.json)
---------------------------------------------------------------- */
const FRAME_COUNT = 120;
const FRAME_DIR = {
  desktop: "/hero%20frames/website_optimized_120_frames",
  mobile: "/hero%20frames/website_mobile_120_frames",
};
const frameUrl = (dir: string, i: number) => `${dir}/frame_${String(i + 1).padStart(4, "0")}.webp`;

/** How far the user scrolls while the video plays. */
const SCRUB_DISTANCE = "+=250%";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0);

  /** Draw frame `i` with object-fit: cover; falls back to the nearest loaded frame. */
  const render = useCallback((i: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    current.current = i;
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < FRAME_COUNT && !img; d++) img = frames.current[i - d] ?? frames.current[i + d] ?? null;
    if (!img) return;
    const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  }, []);

  // Keep the canvas sized to the stage (crisp on HiDPI, capped at 2x)
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      render(current.current);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();
    return () => ro.disconnect();
  }, [render]);

  // Progressive loading: frame 1 first, then every 8th frame, then the rest
  useEffect(() => {
    let cancelled = false;
    const dir = window.matchMedia("(max-width: 767px)").matches ? FRAME_DIR.mobile : FRAME_DIR.desktop;
    frames.current = new Array(FRAME_COUNT).fill(null);
    const order: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += 8) order.push(i);
    for (let i = 0; i < FRAME_COUNT; i++) if (i % 8) order.push(i);

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(dir, i);
        img.onload = () => {
          if (!cancelled) {
            frames.current[i] = img;
            if (Math.abs(i - current.current) <= 8) render(current.current);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      await load(0);
      // Tell the intro loader the hero has something to show
      window.__heroReady = true;
      window.dispatchEvent(new Event("hero:ready"));
      let next = 1;
      const worker = async () => {
        while (!cancelled && next < order.length) await load(order[next++]);
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    })();
    return () => {
      cancelled = true;
    };
  }, [render]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { motion } = ctx.conditions as { motion: boolean };

          if (motion) {
            // Entrance waits until the intro loader opens
            const intro = gsap
              .timeline({ paused: true, defaults: { ease: "expo.out", duration: 1.2 } })
              .from("[data-line]", { yPercent: 110, stagger: 0.12 }, 0.35);
            const play = () => intro.play();
            if (window.__appRevealed) play();
            else window.addEventListener("app:reveal", play, { once: true });
          }

          const state = { frame: 0 };

          // 1) Pin the stage for the whole wrapper. pinSpacing is off: the
          //    wrapper's own height provides the scroll room, so the next
          //    section slides up OVER the pinned hero at the end.
          ScrollTrigger.create({
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            pin: stage.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          // 2) Video scrub over the first SCRUB_DISTANCE
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: SCRUB_DISTANCE, scrub: true, invalidateOnRefresh: true },
          });
          tl.to(state, { frame: FRAME_COUNT - 1, duration: 1, onUpdate: () => render(Math.round(state.frame)) }, 0);
          if (motion) {
            tl.fromTo("[data-hero-canvas]", { scale: 1.1 }, { scale: 1, duration: 1 }, 0)
              // heading drifts up slowly (parallax against the video), then fades before the hand-off
              .to("[data-hero-title]", { yPercent: -35, duration: 1 }, 0);
          }
          tl.to("[data-hero-title]", { autoAlpha: 0, duration: 0.12 }, 0.86)
            .to("[data-scroll-cue]", { autoAlpha: 0, duration: 0.05 }, 0)
            .fromTo("[data-hero-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

          // 3) While the next section covers it: hero recedes and dims (parallax depth)
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: root.current, start: () => `top+=${window.innerHeight * 2.5} top`, end: "bottom top", scrub: true, invalidateOnRefresh: true },
            })
            .to("[data-hero-depth]", { scale: motion ? 0.9 : 1, yPercent: motion ? -6 : 0, duration: 1 }, 0)
            .to("[data-hero-dim]", { opacity: 0.75, duration: 1 }, 0);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} data-hero style={{ height: "calc(max(100svh, 560px) + 250vh)" }}>
      <div ref={stage} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#071417]">
        <div data-hero-depth className="absolute inset-0 origin-top will-change-transform">
        <canvas ref={canvas} data-hero-canvas aria-hidden className="absolute inset-0 h-full w-full will-change-transform" />

        {/* Soft shade for legibility: top (header) + bottom-left (copy) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,23,0.55)_0%,rgba(7,20,23,0)_22%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_100%,rgba(7,20,23,0.92)_0%,rgba(7,20,23,0.55)_45%,rgba(7,20,23,0)_75%)]" />

        {/* Heading only — the intro copy lives in the next section */}
        <div className="absolute inset-x-0 bottom-0 pb-[12vh] md:pb-[14vh]">
          <div data-hero-title className="container-site">
            <h1 className="display max-w-[760px] text-[34px] text-white sm:text-[46px] xl:text-[58px]">
              <span className="block overflow-hidden pb-[0.04em]">
                <span data-line className="block">TMJ Pain, TMD &amp;</span>
              </span>
              <span className="block overflow-hidden pb-[0.04em]">
                <span data-line className="block text-gold">Headaches in Sydney.</span>
              </span>
            </h1>
          </div>
        </div>

        </div>
        <div data-hero-dim className="pointer-events-none absolute inset-0 bg-black opacity-0" />

        {/* Scroll cue */}
        <div data-scroll-cue className="pointer-events-none absolute right-10 bottom-8 hidden flex-col items-center gap-2 md:flex">
          <span className="eyebrow text-[10px] text-white/70">Scroll</span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-gold" />
          </span>
        </div>

        {/* Playback progress */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
          <div data-hero-progress className="h-full origin-left scale-x-0 bg-gold" />
        </div>
      </div>
    </div>
  );
}
