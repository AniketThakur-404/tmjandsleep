"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { signs } from "@/content/tmj";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Height of the sticky header (px) — the pin is centred in the space below it. */
const HEADER = 88;

/**
 * Desktop: the heading scrolls away normally; only the card row pins, and
 * it pins once the whole row is in view (vertically centred below the
 * header). Vertical scroll then moves the cards sideways.
 * Mobile / reduced motion: a native swipeable row.
 */
export function Signs() {
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // All screen sizes: pin the card row and move it sideways while scrolling
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wrap = pinWrap.current!;
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
        // Centre the card row in the visible area under the header
        // (falls back to sitting just under the header if it is taller).
        const offset = () => {
          const free = window.innerHeight - HEADER - wrap.offsetHeight;
          return HEADER + Math.max(8, free / 2);
        };

        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: () => `top top+=${offset()}`,
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set("[data-progress]", { scaleX: self.progress }),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: pinWrap },
  );

  return (
    <Section tone="light" flush id="symptoms" className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
        <SectionHeading tone="light" eyebrow="Recognising possible bruxism" title="Signs that may be associated" accent="with clenching or grinding" />
        <Reveal className="copy">
          <p>Bruxism can sometimes be associated with changes to the teeth, jaw muscles, and surrounding tissues.</p>
          <p>
            However, <strong className="font-bold text-ink">none of the findings below confirms bruxism on its own</strong>, and many of these findings
            can occur for reasons unrelated to grinding or clenching.
          </p>
        </Reveal>
      </div>

      {/* Only this block pins */}
      <div ref={pinWrap} className="mt-12 py-2">
        <div className="container-site">
          <div
            ref={track}
            className="-mx-6 flex gap-4 px-6 pb-2 [scrollbar-width:none] motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto md:-mx-10 md:gap-5 md:px-10 lg:mx-0 lg:px-0"
          >
            {signs.map((s, i) => (
              <article
                key={s.title}
                className="group flex w-[80vw] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/[0.06] sm:w-[340px]"
              >
                {/* Image height scales with the viewport so a whole card always fits on screen while pinned */}
                <div className="relative h-[clamp(130px,22vh,220px)] shrink-0 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="340px"
                    className="object-cover transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex-1 px-5 pt-4 pb-5 md:px-6 md:pt-5 md:pb-6">
                  <p className="eyebrow text-gold-deep">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-[20px] leading-[1.15] text-ink uppercase md:text-[22px]">{s.title}</h3>
                  <div className="mt-3 space-y-2 text-[14.5px] leading-[1.6] text-ink-soft md:space-y-2.5 md:text-[15px]">
                    {s.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 h-[2px] w-full bg-ink/10 motion-reduce:hidden md:mt-6">
            <div data-progress className="h-full origin-left scale-x-0 bg-gold-deep" />
          </div>
        </div>
      </div>
    </Section>
  );
}
