"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowButton } from "@/components/ui-brand/arrow-button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fixed header height (px). */
const HEADER = 88;
/** Scroll distance while pinned (slide 1 hold → swap → slide 2 hold). */
const PIN_DISTANCE = "+=450%";
/** Seconds the animation takes to catch up with the scroll position (smooths out wheel steps). */
const SMOOTH = 1.2;
/** Pinned scroll distance on phones / tablets. */
const PIN_DISTANCE_MOBILE = "+=420%";

/* Clip-path states (sharp edges, no rounding — cheaper to paint) */
const SHOWN = "inset(0% 0% 0% 0%)";
const HIDDEN_RIGHT = "inset(0% 100% 0% 0%)"; // collapsed to its left edge → reveals left → right
const HIDDEN_LEFT = "inset(0% 0% 0% 100%)"; // collapsed to its right edge → reveals right → left
const HIDDEN_UP = "inset(0% 0% 100% 0%)"; // collapsed to its top edge

/**
 * Full-bleed, two-slide reveal straight after the hero (desktop).
 * Each slide is split 50/50: one half is a full-height image, the other the copy.
 *  - Entrance: as the section rises over the hero, slide 1's image wipes
 *    open left → right across its whole half; the copy rises in.
 *  - Pinned: slide 1's image wipes away upward while slide 2's image wipes
 *    open right → left across the other half; its copy rises in.
 * Mobile: slides stack; each image wipes open as it enters.
 */
export function IntroStory() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const zoom = reduce ? 1 : 1.15;
        // Wipe stops part-way while the section is still rising, then finishes once pinned
        const PARTLY_OPEN = "inset(0% 60% 0% 0%)";
        const midZoom = reduce ? 1 : 1.1;
        const lazy = { immediateRender: false } as const;

        gsap.set("[data-slide='2']", { autoAlpha: 1 });
        gsap.set("[data-img='2']", { clipPath: HIDDEN_LEFT });
        gsap.set(["[data-copy='1'] > *", "[data-copy='2'] > *"], { y: 50, autoAlpha: 0 });

        // --- Entrance: section rises over the hero; image starts opening ---
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stage.current, start: "top 75%", end: "top top", scrub: SMOOTH },
          })
          .fromTo("[data-img='1']", { clipPath: HIDDEN_RIGHT }, { clipPath: PARTLY_OPEN, ease: "power1.in", duration: 1 }, 0)
          .fromTo("[data-img-inner='1']", { scale: zoom }, { scale: midZoom, duration: 1 }, 0);

        // --- Pinned: finish slide 1 → hold → swap → hold ---
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage.current,
              start: "top top",
              end: PIN_DISTANCE,
              pin: true,
              scrub: SMOOTH,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          // 0 → 0.2  slide 1 finishes opening, copy rises in
          .fromTo("[data-img='1']", { clipPath: PARTLY_OPEN }, { clipPath: SHOWN, duration: 0.2, ease: "power2.out", ...lazy }, 0)
          .fromTo("[data-img-inner='1']", { scale: midZoom }, { scale: 1, duration: 0.24, ...lazy }, 0)
          .fromTo(
            "[data-copy='1'] > *",
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.035, duration: 0.12, ease: "power2.out", ...lazy },
            0.04,
          )
          // 0.22 → 0.38  hold slide 1
          // 0.38 → 0.72  swap (slide 1 out, slide 2 in — overlapping so the screen is never empty)
          .fromTo("[data-copy='1'] > *", { y: 0, autoAlpha: 1 }, { y: -40, autoAlpha: 0, stagger: 0.025, duration: 0.12, ease: "power1.in", ...lazy }, 0.38)
          .fromTo("[data-img='1']", { clipPath: SHOWN }, { clipPath: HIDDEN_UP, duration: 0.24, ease: "power2.inOut", ...lazy }, 0.4)
          .fromTo("[data-img-inner='1']", { yPercent: 0 }, { yPercent: reduce ? 0 : -8, duration: 0.24, ...lazy }, 0.4)
          .fromTo("[data-img='2']", { clipPath: HIDDEN_LEFT }, { clipPath: SHOWN, duration: 0.26, ease: "power2.inOut", ...lazy }, 0.42)
          .fromTo("[data-img-inner='2']", { scale: zoom }, { scale: 1, duration: 0.32, ...lazy }, 0.42)
          .fromTo(
            "[data-copy='2'] > *",
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.12, ease: "power2.out", ...lazy },
            0.56,
          )
          // 0.75 → 1  hold slide 2
          .to({}, { duration: 0.25 }, 0.75);
      });

      // ---------------- Mobile / tablet: same pinned sequence ----------------
      // Image wipes open full-screen, then the copy panel rises from the bottom
      // while the image shrinks into the space above it.
      mm.add("(max-width: 1023px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const zoom = reduce ? 1 : 1.15;
        const PARTLY_OPEN = "inset(0% 55% 0% 0%)";
        const lazy = { immediateRender: false } as const;
        const stageEl = stage.current!;
        // The image's frame shrinks to the band above the panel, so the picture refits into it
        const fit = (n: "1" | "2") => () => `${stageEl.querySelector<HTMLElement>(`[data-panel='${n}']`)!.offsetHeight}px`;

        gsap.set("[data-slide='2']", { autoAlpha: 1 });
        gsap.set("[data-img='2']", { clipPath: HIDDEN_LEFT });
        gsap.set("[data-panel]", { yPercent: 102 });
        gsap.set(["[data-copy='1'] > *", "[data-copy='2'] > *"], { y: 30, autoAlpha: 0 });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stageEl, start: "top 75%", end: "top top", scrub: SMOOTH },
          })
          .fromTo("[data-img='1']", { clipPath: HIDDEN_RIGHT }, { clipPath: PARTLY_OPEN, ease: "power1.in", duration: 1 }, 0)
          .fromTo("[data-img-inner='1']", { scale: zoom }, { scale: reduce ? 1 : 1.08, duration: 1 }, 0);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stageEl,
              start: "top top",
              end: PIN_DISTANCE_MOBILE,
              pin: true,
              scrub: SMOOTH,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          // slide 1: finish opening, then the panel rises and the image shrinks above it
          .fromTo("[data-img='1']", { clipPath: PARTLY_OPEN }, { clipPath: SHOWN, duration: 0.16, ease: "power2.out", ...lazy }, 0)
          .fromTo("[data-img-inner='1']", { scale: reduce ? 1 : 1.08 }, { scale: 1, duration: 0.18, ...lazy }, 0)
          .fromTo("[data-panel='1']", { yPercent: 102 }, { yPercent: 0, duration: 0.14, ease: "power2.out", ...lazy }, 0.14)
          .fromTo("[data-img-fit='1']", { bottom: 0 }, { bottom: fit("1"), duration: 0.14, ease: "power2.out", ...lazy }, 0.14)
          .fromTo("[data-copy='1'] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.025, duration: 0.08, ease: "power2.out", ...lazy }, 0.2)
          // hold 0.3 -> 0.42, then swap
          .fromTo("[data-panel='1']", { yPercent: 0 }, { yPercent: 102, duration: 0.1, ease: "power2.in", ...lazy }, 0.42)
          .fromTo("[data-img='1']", { clipPath: SHOWN }, { clipPath: HIDDEN_UP, duration: 0.16, ease: "power2.inOut", ...lazy }, 0.46)
          .fromTo("[data-img='2']", { clipPath: HIDDEN_LEFT }, { clipPath: SHOWN, duration: 0.18, ease: "power2.inOut", ...lazy }, 0.48)
          .fromTo("[data-img-inner='2']", { scale: zoom }, { scale: 1, duration: 0.22, ...lazy }, 0.48)
          .fromTo("[data-panel='2']", { yPercent: 102 }, { yPercent: 0, duration: 0.14, ease: "power2.out", ...lazy }, 0.64)
          .fromTo("[data-img-fit='2']", { bottom: 0 }, { bottom: fit("2"), duration: 0.14, ease: "power2.out", ...lazy }, 0.64)
          .fromTo("[data-copy='2'] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.025, duration: 0.08, ease: "power2.out", ...lazy }, 0.7)
          // hold slide 2
          .to({}, { duration: 0.2 }, 0.8);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="overview" data-tone="light" className="relative z-10">
      <div ref={stage} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#f8f6f2] text-ink lg:min-h-[620px]">
        <Slide n="1" imageSide="left" image={{ src: "/images/tmj-anatomy.png", alt: "TMJ anatomy", caption: "Temporomandibular Joint Anatomy" }}>
          <p className="font-display text-[clamp(19px,2.9vh,24px)] leading-[1.3] text-ink md:text-[30px] lg:text-[34px] [@media(max-height:760px)]:lg:text-[27px]">
            Jaw pain, headaches and neck tension can occur together — but the cause is not always straightforward.
          </p>
          <p className="mt-3 text-[clamp(13.5px,1.8vh,15px)] leading-[1.6] text-ink-soft md:text-[16px] lg:mt-6 lg:leading-[1.75] [@media(max-height:760px)]:lg:mt-4 [@media(max-height:760px)]:lg:text-[14.5px]">
            Understanding what may be contributing to your symptoms is the first step towards developing an appropriate, individualised management plan.
          </p>
          <p className="mt-2.5 text-[clamp(13.5px,1.8vh,15px)] leading-[1.6] text-ink-soft md:text-[16px] lg:mt-4 lg:leading-[1.75] [@media(max-height:760px)]:lg:mt-3 [@media(max-height:760px)]:lg:text-[14.5px]">
            At the Sydney Centre for TMJ &amp; Sleep Therapy, we assess the jaw joints, jaw muscles, teeth, head and neck symptoms and, where clinically
            indicated, sleep and breathing factors, nutritional factors and emotional factors that may be relevant to your condition.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 lg:mt-9 lg:gap-3 [@media(max-height:760px)]:lg:mt-6">
            <ArrowButton href="#contact" tone="ink">How We Assess TMJ Pain</ArrowButton>
            <ArrowButton href="#diagnosis" tone="gold">How We Diagnose</ArrowButton>
          </div>
        </Slide>

        <Slide n="2" imageSide="right" image={{ src: "/images/closed-mouth-anatomy.png", alt: "Closed mouth TMJ anatomy", caption: "Closed-mouth TMJ anatomy" }}>
          <p className="eyebrow text-gold-deep">The basics</p>
          <h2 className="display mt-2 text-[clamp(24px,3.4vh,30px)] text-ink md:text-[38px] lg:mt-4 lg:text-[46px] [@media(max-height:760px)]:lg:text-[36px]">
            What is the <span className="text-gold-deep">temporomandibular joint (TMJ)?</span>
          </h2>
          <p className="mt-3 text-[clamp(14.5px,2vh,16px)] leading-[1.6] text-ink md:text-[18px] lg:mt-6 lg:leading-[1.65] [@media(max-height:760px)]:lg:mt-4 [@media(max-height:760px)]:lg:text-[16px]">
            The temporomandibular joint (TMJ) connects your lower jaw to the skull — specifically the temporal bone — just in front of each ear. It’s one of
            the most complex and frequently used joints in the body, working every time you speak, chew, yawn or swallow.
          </p>
          <p className="mt-2.5 text-[clamp(13.5px,1.8vh,15px)] leading-[1.6] text-ink-soft md:text-[16px] lg:mt-4 lg:leading-[1.75] [@media(max-height:760px)]:lg:text-[14.5px]">
            Because it’s made up of bone, muscle, ligaments, nerves, blood vessels and a protective disc, problems can arise from any one of these
            structures. That’s why an accurate diagnosis matters — pain in the same place can have very different causes.
          </p>
        </Slide>

      </div>
    </section>
  );
}

function Slide({
  n,
  imageSide,
  image,
  children,
}: {
  n: "1" | "2";
  imageSide: "left" | "right";
  image: { src: string; alt: string; caption: string };
  children: React.ReactNode;
}) {
  return (
    <div data-slide={n} className={cn("absolute inset-0 lg:grid lg:grid-cols-2", n === "2" && "invisible")}>
      {/* Image: full stage on phones (shrinks above the panel), one half on desktop */}
      <figure className={cn("absolute inset-0 lg:relative lg:h-full", imageSide === "right" && "lg:order-2")}>
        <div data-img={n} className="absolute inset-0 overflow-hidden bg-white will-change-[clip-path]">
          <div data-img-fit={n} className="absolute inset-0 lg:bottom-0!">
            <div data-img-inner={n} className="absolute inset-0 will-change-transform">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain px-5 pt-[calc(var(--hdr)+8px)] pb-11 lg:px-10 lg:pt-[calc(var(--hdr)+16px)] lg:pb-16"
                style={{ "--hdr": `${HEADER}px` } as React.CSSProperties}
              />
            </div>
            <figcaption
              className={cn(
                "absolute bottom-0 z-10 bg-ink px-3.5 py-2 text-[10.5px] font-bold tracking-[1.6px] text-cream uppercase lg:px-4 lg:py-2.5 lg:text-[11px]",
                imageSide === "left" ? "left-0" : "right-0",
              )}
            >
              {image.caption}
            </figcaption>
          </div>
        </div>
      </figure>

      {/* Copy: bottom sheet on phones, one half on desktop */}
      <div
        data-panel={n}
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 bg-[#f8f6f2] px-6 pt-6 pb-7 shadow-[0_-24px_50px_-28px_rgba(0,0,0,0.45)] md:px-12 md:pt-9 md:pb-10",
          "lg:relative lg:inset-auto lg:flex lg:items-center lg:bg-transparent lg:px-[clamp(40px,5vw,96px)] lg:pt-[calc(88px+24px)] lg:pb-16 lg:shadow-none lg:transform-none!",
          imageSide === "right" && "lg:order-1",
        )}
      >
        <div data-copy={n} className="max-w-[580px]">
          {children}
        </div>
      </div>
    </div>
  );
}
