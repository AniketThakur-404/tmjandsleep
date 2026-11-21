import Image from "next/image";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";

const figures = [
  { src: "/images/forward-head-carriage.jpg", w: 1022, h: 718, alt: "Forward head carriage", caption: "Each inch of forward head adds load to the spine" },
  { src: "/images/domino-effect.png", w: 1492, h: 1054, alt: "Dangers of forward head posture — the domino effect", caption: "The domino effect of forward head posture" },
];

export function Neck() {
  return (
    <Section tone="dark">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="The Neck, Shoulders & Jaw" title="Why do I have" accent="neck & shoulder pain?" />
          <Reveal className="copy mt-8">
            <p className="text-[18px]! text-cream">The jaw, head, and neck do not function independently.</p>
            <p>
              The muscles and joints involved in jaw movement interact with the muscles that control the head, neck, and shoulders. As a result, jaw
              symptoms and neck symptoms can sometimes occur together.
            </p>
            <p>Posture, muscle tension, pain sensitivity, sleep quality, work habits, and other musculoskeletal factors may all contribute.</p>
            <p>Breathing patterns may also be relevant in selected patients.</p>
            <p>
              For example, persistent nasal obstruction and mouth breathing can coexist with altered head and neck posture. However, the relationship
              between breathing, posture, and pain is complex and does not mean that nasal obstruction is necessarily the cause of neck or jaw pain.
            </p>
            <p>Where symptoms suggest impaired nasal breathing or another airway problem, further assessment may be appropriate.</p>
          </Reveal>
        </div>

        <div className="space-y-5">
          {figures.map((f, i) => (
            <Reveal key={f.src} delay={i * 0.08}>
              <figure className="rounded-2xl bg-panel p-4 ring-1 ring-cream/10">
                <Image src={f.src} alt={f.alt} width={f.w} height={f.h} sizes="(min-width: 1024px) 540px, 100vw" className="w-full rounded-xl" />
                <figcaption className="eyebrow mt-4 mb-1 text-cream/65">{f.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
