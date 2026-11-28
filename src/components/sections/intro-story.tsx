"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowButton } from "@/components/ui-brand/arrow-button";
import { Rich } from "@/components/rich";
import { intro } from "@/content/tmj";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Fixed header height (px). */
const HEADER = 88;
/**
 * Timeline units = screen heights of scroll.
 * ENTER: the section rises from 75% of the viewport to the top (not pinned).
 * PIN: how long it then stays pinned (hold → swap → hold).
 */
const ENTER = 0.75;
const PIN = 3.5;
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
 * Below 1024px: slides stack in normal flow; each image wipes open as it enters.
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
      const build = (pinUnits: number, scrub: number | true = SMOOTH) => {
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
            scrub,
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

      // ---------------- Mobile / tablet: stacked, not pinned ----------------
      // Each slide is image-then-copy in normal flow, so the diagrams always get
      // a full-width, readable size. Each plays its wipe once as it scrolls in.
      mm.add("(max-width: 1023px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        root.current!.querySelectorAll<HTMLElement>("[data-slide]").forEach((slide) => {
          const n = slide.dataset.slide;
          gsap
            .timeline({ scrollTrigger: { trigger: slide, start: "top 80%", once: true } })
            .fromTo(`[data-img='${n}']`, { clipPath: n === "1" ? HIDDEN_RIGHT : HIDDEN_LEFT }, { clipPath: SHOWN, duration: 1.1, ease: "power2.inOut" }, 0)
            .fromTo(`[data-img-inner='${n}']`, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0)
            .fromTo(`[data-copy='${n}'] > *`, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.7, ease: "power2.out" }, 0.35);
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="overview" data-tone="light" className="relative z-10">
      <div ref={stage} className="relative overflow-hidden bg-[#f8f6f2] text-ink lg:h-[100svh] lg:min-h-[620px]">
        <Slide
          n="1"
          imageSide="left"
          image={{
            images: [
              { src: "/images/tmj-anatomy.png", alt: "TMJ anatomy showing the temporal bone, disc, condyle and masseter muscle", w: 1231, h: 1278 },
              { src: "/images/closed-mouth-anatomy.png", alt: "Closed mouth TMJ anatomy", w: 1536, h: 1024 },
            ],
            caption: "Temporomandibular Joint Anatomy",
          }}
        >
          {/* Short laptop screens (≤760px tall) step the pinned slide's type down one notch so it fits */}
          <p className="type-h3 font-display leading-[1.3] text-ink [@media(max-height:760px)]:lg:text-[27px]">{intro.lead}</p>
          <p className="type-body mt-5 text-ink-soft lg:mt-6 [@media(max-height:760px)]:lg:mt-4 [@media(max-height:760px)]:lg:text-[15px]">
            <Rich text={intro.leadMore} />
          </p>
          <p className="type-body mt-3 text-ink-soft [@media(max-height:760px)]:lg:text-[15px]">
            <Rich text={intro.body} />
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5 lg:mt-9 lg:gap-3 [@media(max-height:760px)]:lg:mt-6">
            <ArrowButton href={site.bookingHref} tone="ink">Book a Jaw Pain Assessment</ArrowButton>
            <ArrowButton href="#urgent-care" tone="gold">Urgent Warning Signs</ArrowButton>
          </div>
        </Slide>

        <Slide
          n="2"
          imageSide="right"
          image={{
            images: [{ src: "/images/dr-manish-shah.jpg", alt: "Dr Manish Shah, dentist and medical practitioner in Sydney", w: 2460, h: 3520 }],
            caption: "Dr Manish Shah",
            // The photo's studio grey (sampled from its top edge) behind the header
            portrait: { bg: "linear-gradient(to bottom, #dcdcdc, #e3e3e3)" },
          }}
        >
          <p className="eyebrow text-gold-deep">Dentist &amp; medical practitioner</p>
          <p className="display type-h2 mt-3 text-ink lg:mt-4 [@media(max-height:760px)]:lg:text-[36px]">
            Book your <span className="text-gold-deep">jaw pain assessment</span>
          </p>
          <p className="type-lead mt-5 text-ink lg:mt-6 [@media(max-height:760px)]:lg:mt-4 [@media(max-height:760px)]:lg:text-[16px]">{intro.doctor}</p>
          <p className="type-body mt-3 text-ink-soft lg:mt-4 [@media(max-height:760px)]:lg:text-[15px]">
            Book online or call {site.phoneDisplay}. <strong className="font-bold text-ink">No referral needed.</strong>
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5 lg:mt-8 [@media(max-height:760px)]:lg:mt-5">
            <ArrowButton href={site.bookingHref} tone="ink">
              Book Online
            </ArrowButton>
            <ArrowButton href={site.phoneHref} tone="gold">
              Call {site.phoneDisplay}
            </ArrowButton>
          </div>
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
  image: {
    /** w/h are the files' pixel sizes — used to give stacked diagrams equal widths */
    images: { src: string; alt: string; w: number; h: number }[];
    caption: string;
    /**
     * Portrait mode (single photo): on desktop the image column takes the photo's own
     * width-to-height shape instead of half the screen; `bg` fills the strip behind the header.
     */
    portrait?: { bg: string };
  };
  children: React.ReactNode;
}) {
  const img0 = image.images[0];
  return (
    <div
      data-slide={n}
      className={cn(
        "relative lg:absolute lg:inset-0 lg:grid",
        image.portrait ? (imageSide === "right" ? "lg:grid-cols-[minmax(0,1fr)_auto]" : "lg:grid-cols-[auto_minmax(0,1fr)]") : "lg:grid-cols-2",
        n === "2" && "lg:invisible",
      )}
    >
      {/* Image: full width above the copy below 1024px; on desktop one half, or a photo-shaped column for portraits */}
      <figure
        className={cn("relative lg:h-full", imageSide === "right" && "lg:order-2", image.portrait && "lg:w-(--pw)")}
        style={
          image.portrait
            ? // column width = (stage height − header) × photo aspect, so the photo fits it exactly (never cropped)
              ({ "--pw": `calc((max(100svh, 620px) - ${HEADER}px) * ${img0.w / img0.h})` } as React.CSSProperties)
            : undefined
        }
      >
        <div data-img={n} className="relative overflow-hidden bg-white will-change-[clip-path] lg:absolute lg:inset-0">
          <div
            data-img-fit={n}
            // Below 1024px a portrait keeps its own shape (capped, cropped from the bottom); diagrams size themselves
            className={cn("relative lg:absolute lg:inset-0", image.portrait && "aspect-(--ar) max-h-[62svh] w-full lg:aspect-auto lg:max-h-none")}
            style={{ "--ar": img0.w / img0.h } as React.CSSProperties}
          >
            {image.portrait ? (
              // Portrait photo. On desktop this column is exactly the photo's shape (see the
              // grid below), so the photo fills it edge to edge with nothing cropped or faded.
              // The strip behind the fixed header uses the photo's own studio grey.
              <>
                <div aria-hidden className="absolute inset-0" style={{ background: image.portrait.bg }} />
                <div
                  data-img-inner={n}
                  className="absolute inset-0 origin-top will-change-transform lg:top-(--hdr)"
                  style={{ "--hdr": `${HEADER}px` } as React.CSSProperties}
                >
                  <Image
                    src={image.images[0].src}
                    alt={image.images[0].alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    // The frame matches the photo (phones: capped height, so the bottom is trimmed), so it fills it from the top.
                    className="object-cover object-top"
                  />
                </div>
              </>
            ) : (
              <div
                data-img-inner={n}
                className="relative flex flex-col items-center justify-center gap-4 px-4 pt-6 pb-12 will-change-transform sm:flex-row sm:gap-5 sm:px-8 sm:pt-8 sm:pb-14 lg:absolute lg:inset-0 lg:flex-col lg:gap-6 lg:px-10 lg:pt-[calc(var(--hdr)+16px)] lg:pb-16"
                style={{ "--hdr": `${HEADER}px` } as React.CSSProperties}
              >
                {/*
                  Diagrams. Phones: stacked, full width, each at its own shape.
                  Tablets / desktop: each box's share of the space is proportional to its
                  image's shape, so the images render at the same height side by side
                  (tablets) or the same width stacked (desktop).
                */}
                {image.images.map((img) => (
                  <div
                    key={img.src}
                    className="relative aspect-(--ar) max-h-[48svh] w-full min-w-0 sm:max-h-none sm:basis-0 sm:grow-(--row) lg:aspect-auto lg:h-full lg:min-h-0 lg:grow-(--col)"
                    style={{ "--ar": img.w / img.h, "--row": img.w / img.h, "--col": img.h / img.w } as React.CSSProperties}
                  >
                    <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
                  </div>
                ))}
              </div>
            )}
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

      {/* Copy: below the image under 1024px, one half on desktop */}
      <div
        data-panel={n}
        className={cn(
          "relative z-10 bg-[#f8f6f2] px-5 pt-8 pb-14 sm:px-8 md:px-12 md:pt-10 md:pb-16",
          "lg:flex lg:items-center lg:bg-transparent lg:px-[clamp(40px,5vw,96px)] lg:pt-[calc(88px+24px)] lg:pb-16",
          imageSide === "right" && "lg:order-1",
          // Beside a portrait the text column can be very wide: keep the copy block next to the
          // photo (as on a 1024px screen) instead of floating in the middle of empty space
          image.portrait && (imageSide === "right" ? "lg:justify-end lg:pr-[clamp(40px,5vw,96px)]" : "lg:justify-start"),
        )}
      >
        <div data-copy={n} className="max-w-[580px]">
          {children}
        </div>
      </div>
    </div>
  );
}
