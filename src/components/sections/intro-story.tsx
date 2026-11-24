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
/**
 * Timeline units = screen heights of scroll.
 * ENTER: the section rises from 75% of the viewport to the top (not pinned).
 * PIN / PIN_MOBILE: how long it then stays pinned (hold → swap → hold).
 */
const ENTER = 0.75;
const PIN = 3.5;
const PIN_MOBILE = 3.8;
/**
 * Seconds the animation trails the scroll position. Kept short — Lenis
 * already smooths the scroll, and a long lag on top of it feels stuck.
 */
const SMOOTH = 0.5;

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
      const lazy = { immediateRender: false } as const;

      /**
       * One pin + ONE scrubbed timeline that runs from the moment the section
       * starts rising until the pin releases. (Two separate timelines driving
       * the same clip-path used to fight at the hand-off and stall mid-wipe.)
       */
      const build = (pinUnits: number) => {
        const stageEl = stage.current!;
        const pinST = ScrollTrigger.create({
          trigger: stageEl,
          start: "top top",
          end: () => `+=${stageEl.offsetHeight * pinUnits}`,
          pin: true,
          invalidateOnRefresh: true,
        });
        return gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stageEl,
            start: "top 75%",
            end: () => pinST.end,
            scrub: SMOOTH,
            invalidateOnRefresh: true,
          },
        });
      };

      mm.add("(min-width: 1024px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const zoom = reduce ? 1 : 1.15;

        gsap.set("[data-slide='2']", { autoAlpha: 1 });
        gsap.set("[data-img='2']", { clipPath: HIDDEN_LEFT });
        gsap.set(["[data-copy='1'] > *", "[data-copy='2'] > *"], { y: 50, autoAlpha: 0 });

        const P = ENTER; // pin starts here
        build(PIN)
          // Entrance (rising over the hero): slide 1 fully opens and its copy is in by the time it pins
          .fromTo("[data-img='1']", { clipPath: HIDDEN_RIGHT }, { clipPath: SHOWN, duration: P, ease: "power1.inOut" }, 0)
          .fromTo("[data-img-inner='1']", { scale: zoom }, { scale: 1, duration: P + 0.2 }, 0)
          .fromTo("[data-copy='1'] > *", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.3, ease: "power2.out", ...lazy }, P - 0.3)
          // Pinned: hold slide 1 (P → P+1), then swap
          .fromTo("[data-copy='1'] > *", { y: 0, autoAlpha: 1 }, { y: -40, autoAlpha: 0, stagger: 0.04, duration: 0.3, ease: "power1.in", ...lazy }, P + 1)
          .fromTo("[data-img='1']", { clipPath: SHOWN }, { clipPath: HIDDEN_UP, duration: 0.8, ease: "power2.inOut", ...lazy }, P + 1.1)
          .fromTo("[data-img-inner='1']", { yPercent: 0 }, { yPercent: reduce ? 0 : -8, duration: 0.8, ...lazy }, P + 1.1)
          .fromTo("[data-img='2']", { clipPath: HIDDEN_LEFT }, { clipPath: SHOWN, duration: 0.9, ease: "power2.inOut", ...lazy }, P + 1.2)
          .fromTo("[data-img-inner='2']", { scale: zoom }, { scale: 1, duration: 1.1, ...lazy }, P + 1.2)
          .fromTo("[data-copy='2'] > *", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.3, ease: "power2.out", ...lazy }, P + 1.75)
          // hold slide 2 until the pin releases
          .set({}, {}, P + PIN);
      });

      // ---------------- Mobile / tablet: same pinned sequence ----------------
      // Image wipes open full-screen, then the copy panel rises from the bottom
      // while the image shrinks into the space above it.
      mm.add("(max-width: 1023px)", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const zoom = reduce ? 1 : 1.15;
        const stageEl = stage.current!;
        // The image's frame shrinks to the band above the panel, so the picture refits into it
        const fit = (n: "1" | "2") => () => `${stageEl.querySelector<HTMLElement>(`[data-panel='${n}']`)!.offsetHeight}px`;

        gsap.set("[data-slide='2']", { autoAlpha: 1 });
        gsap.set("[data-img='2']", { clipPath: HIDDEN_LEFT });
        gsap.set("[data-panel]", { yPercent: 102 });
        gsap.set(["[data-copy='1'] > *", "[data-copy='2'] > *"], { y: 30, autoAlpha: 0 });

        const P = ENTER;
        build(PIN_MOBILE)
          // Entrance: image opens fully while the section rises
          .fromTo("[data-img='1']", { clipPath: HIDDEN_RIGHT }, { clipPath: SHOWN, duration: P, ease: "power1.inOut" }, 0)
          .fromTo("[data-img-inner='1']", { scale: zoom }, { scale: 1, duration: P + 0.2 }, 0)
          // Pinned: panel rises, image shrinks above it, copy in
          .fromTo("[data-panel='1']", { yPercent: 102 }, { yPercent: 0, duration: 0.5, ease: "power2.out", ...lazy }, P + 0.1)
          .fromTo("[data-img-fit='1']", { bottom: 0 }, { bottom: fit("1"), duration: 0.5, ease: "power2.out", ...lazy }, P + 0.1)
          .fromTo("[data-copy='1'] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.3, ease: "power2.out", ...lazy }, P + 0.3)
          // hold, then swap
          .fromTo("[data-panel='1']", { yPercent: 0 }, { yPercent: 102, duration: 0.4, ease: "power2.in", ...lazy }, P + 1.25)
          .fromTo("[data-img='1']", { clipPath: SHOWN }, { clipPath: HIDDEN_UP, duration: 0.7, ease: "power2.inOut", ...lazy }, P + 1.4)
          .fromTo("[data-img='2']", { clipPath: HIDDEN_LEFT }, { clipPath: SHOWN, duration: 0.8, ease: "power2.inOut", ...lazy }, P + 1.5)
          .fromTo("[data-img-inner='2']", { scale: zoom }, { scale: 1, duration: 1, ...lazy }, P + 1.5)
          .fromTo("[data-panel='2']", { yPercent: 102 }, { yPercent: 0, duration: 0.5, ease: "power2.out", ...lazy }, P + 2.2)
          .fromTo("[data-img-fit='2']", { bottom: 0 }, { bottom: fit("2"), duration: 0.5, ease: "power2.out", ...lazy }, P + 2.2)
          .fromTo("[data-copy='2'] > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.3, ease: "power2.out", ...lazy }, P + 2.4)
          // hold slide 2 until the pin releases
          .set({}, {}, P + PIN_MOBILE);
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
          {/* Hidden on phones: the copy panel would otherwise leave the image only a thin strip */}
          <p className="mt-2.5 text-[clamp(13.5px,1.8vh,15px)] leading-[1.6] text-ink-soft max-sm:hidden md:text-[16px] lg:mt-4 lg:leading-[1.75] [@media(max-height:760px)]:lg:mt-3 [@media(max-height:760px)]:lg:text-[14.5px]">
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
                className="object-contain px-3 pt-[calc(var(--hdr)+4px)] pb-9 sm:px-5 sm:pb-11 lg:px-10 lg:pt-[calc(var(--hdr)+16px)] lg:pb-16"
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
