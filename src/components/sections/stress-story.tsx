"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/section";

const slides = [
  {
    image: "stress-and-jaw-pain",
    position: "80% center",
    eyebrow: "Stress, Clenching & Persistent Pain",
    title: <>Is stress related <br /><span className="text-gold">to TMJ pain?</span></>,
  },
  {
    image: "jaw-clenching",
    position: "24% center",
    eyebrow: "Stress & Jaw Clenching",
    title: "It can be.",
  },
  {
    image: "pain-is-real",
    position: "77% center",
    eyebrow: "Your Experience Matters",
    title: "Stress does not mean that pain is “all in your head.”",
  },
  {
    image: "interacting-factors",
    position: "65% center",
    eyebrow: "Sleep, Stress & Pain",
    title: "Pain is complex.",
    body: <p>Pain is a real biological experience influenced by many interacting factors.</p>,
  },
  {
    image: "personalized-care",
    position: "76% center",
    title: "A personalized approach",
    body: (
      <>
        <p>
          In some people, stress may increase awake clenching, muscle tension and pain sensitivity. Poor sleep, anxiety, persistent pain and
          emotional distress can also influence one another.
        </p>
        <p>
          For this reason, stress-management strategies or psychological therapies may sometimes form part of a multidisciplinary approach to
          persistent TMD pain.
        </p>
        <p className="text-gold">They are not required for every patient and are recommended according to individual circumstances.</p>
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
          <div className="mt-4 max-w-[680px] space-y-3 text-[15px] leading-relaxed text-cream/90 md:text-[18px]">
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
