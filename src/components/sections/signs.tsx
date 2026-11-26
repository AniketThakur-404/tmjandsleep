"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { signs, symptomList } from "@/content/tmj";
import { cn } from "@/lib/utils";

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
      <div className="container-site grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-20">
        <SectionHeading tone="light" eyebrow="Understanding your symptoms" title="TMJ and jaw pain symptoms:" accent="what they may be telling you" />
        <Reveal className="copy">
          <p>
            <Rich text="Where pain is felt does not always reveal where it starts. A chewing muscle can refer pain towards the temple; discomfort near the ear can come from the jaw, a tooth or the ear itself. [1,2,8]" />
          </p>
          <p>
            Before your appointment, note where it hurts, when it started and what changes it. Chewing, yawning, waking and concentrating can all provide
            useful clues. <strong className="font-bold text-ink">Record whether your headache starts before or after the jaw pain.</strong>
          </p>
          <p className="text-ink">
            <Rich text="Common TMJ and jaw pain symptoms include: [1,2]" />
          </p>
          <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
            {symptomList.map((s) => (
              <li key={s} className="flex gap-3.5 py-2.5 text-[15.5px] leading-[1.55] text-ink">
                <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-gold-deep" />
                {s}
              </li>
            ))}
          </ul>
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
                <div className={cn("relative h-[clamp(130px,22vh,220px)] shrink-0 overflow-hidden", s.fit === "contain" && "bg-white")}>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="340px"
                    className={cn(
                      "transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.05]",
                      s.fit === "contain" ? "object-contain p-3" : "object-cover",
                    )}
                  />
                </div>
                <div className="flex-1 px-5 pt-4 pb-5 md:px-6 md:pt-5 md:pb-6">
                  <p className="eyebrow text-gold-deep">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-[20px] leading-[1.15] text-ink uppercase md:text-[22px]">{s.title}</h3>
                  <div className="mt-3 space-y-2 text-[14.5px] leading-[1.6] text-ink-soft md:space-y-2.5 md:text-[15px]">
                    {s.body.map((p) => (
                      <p key={p}>
                        <Rich text={p} />
                      </p>
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
