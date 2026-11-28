"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/section";
import { Rich } from "@/components/rich";

const slides = [
  {
    image: "stress-and-jaw-pain",
    position: "80% center",
    eyebrow: "Daytime Clenching",
    title: <>Can stress contribute <br /><span className="text-gold">to jaw pain?</span></>,
  },
  {
    image: "jaw-clenching",
    position: "24% center",
    eyebrow: "Stress & Jaw Clenching",
    title: "Yes.",
    body: (
      <p>
        <Rich text="Stress may contribute to daytime clenching and jaw bracing. Persistent pain can also disrupt sleep and mood. [19,20]" />
      </p>
    ),
  },
  {
    image: "pain-is-real",
    position: "77% center",
    eyebrow: "Without you noticing",
    title: "Concentrating, driving, or working under pressure",
    body: (
      <p>
        <Rich text="These can trigger clenching or jaw bracing without you noticing. Stress and anxiety may contribute. [20]" />
      </p>
    ),
  },
  {
    image: "interacting-factors",
    position: "65% center",
    eyebrow: "A simple habit",
    title: "Check your jaw a few times a day.",
    body: <p>At rest, let the muscles soften and keep your teeth slightly apart.</p>,
  },
  {
    image: "personalized-care",
    position: "76% center",
    title: "Support alongside treatment",
    body: (
      <>
        <p>
          If stress is part of the pattern, support for it can sit alongside jaw treatment{" "}
          <span className="text-gold">
            <Rich text="and a proper assessment of your pain. [19]" />
          </span>
        </p>
      </>
    ),
  },
] satisfies {
  image: string;
  position: string;
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
}[];

const segment = 1 / slides.length;

export function StressStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 96px", "end end"] });

  return (
    <Section tone="dark" flush aria-labelledby="stress-story-title">
      <div ref={ref} className="relative h-[420vh] motion-reduce:h-auto [@media(max-height:520px)]:h-auto">
        <div className="sticky top-24 isolate h-[calc(100svh-108px)] overflow-hidden rounded-[24px] motion-reduce:static motion-reduce:h-auto [@media(max-height:520px)]:static [@media(max-height:520px)]:h-auto">
          {slides.map((slide, index) => (
            <Slide key={slide.image} slide={slide} index={index} progress={scrollYProgress} />
          ))}

          <div aria-hidden="true" className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 motion-reduce:hidden [@media(max-height:520px)]:hidden">
            {slides.map(({ image }, index) => (
              <Dot key={image} progress={scrollYProgress} range={[segment * index, segment * (index + 1)]} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Slide({
  slide,
  index,
  progress,
}: {
  slide: (typeof slides)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const first = index === 0;
  const last = index === slides.length - 1;
  const start = index * segment;
  const end = (index + 1) * segment;
  const fade = segment * 0.14;
  const backgroundOpacity = useTransform(progress, [start - fade, start + fade], [first ? 1 : 0, 1]);
  const textOpacity = useTransform(progress, [start, start + fade, end - fade, end], [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, [start, start + fade, end - fade, end], [first ? 0 : 18, 0, 0, last ? 0 : -18]);
  const Heading = first ? "h2" : "h3";

  return (
    <div className="absolute inset-0 motion-reduce:relative [@media(max-height:520px)]:relative">
      <motion.div aria-hidden="true" style={{ opacity: backgroundOpacity }} className="absolute inset-0 bg-surface motion-reduce:opacity-100! [@media(max-height:520px)]:opacity-100!">
        <Image
          src={`/images/stress-story/${slide.image}.webp`}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: slide.position }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,17,16,0.70)_0%,rgba(18,17,16,0.48)_62%,rgba(18,17,16,0.72)_100%)]" />
      </motion.div>
      <motion.div
        style={{ opacity: textOpacity, y }}
        className="relative z-10 mx-auto flex h-full w-full max-w-[960px] flex-col items-center justify-center px-5 py-12 text-center motion-reduce:min-h-[55svh] motion-reduce:transform-none! motion-reduce:opacity-100! [@media(max-height:520px)]:transform-none! [@media(max-height:520px)]:opacity-100!"
      >
        {slide.eyebrow && <p className="eyebrow mb-5 text-gold">{slide.eyebrow}</p>}
        <Heading
          id={first ? "stress-story-title" : undefined}
          className={first ? "display text-[clamp(2.25rem,7vw,5rem)] text-cream" : "font-display text-[clamp(1.875rem,5vw,3.75rem)] leading-tight text-cream"}
        >
          {slide.title}
        </Heading>
        {slide.body && (
          <div className="type-lead mt-4 max-w-[680px] space-y-3 text-cream/90">
            {slide.body}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Dot({ progress, range }: { progress: MotionValue<number>; range: [number, number] }) {
  const scaleX = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative block h-[3px] w-10 overflow-hidden rounded-full bg-cream/25">
      <motion.span style={{ scaleX }} className="absolute inset-0 origin-left bg-gold" />
    </span>
  );
}
