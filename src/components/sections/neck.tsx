import Image from "next/image";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";

const figures: { src: string; w: number; h: number; alt: string; caption?: string }[] = [
  { src: "/images/forward-head-carriage.jpg", w: 1022, h: 718, alt: "Forward head posture increasing load on the neck" },
  { src: "/images/domino-effect.png", w: 1492, h: 1054, alt: "Dangers of forward head posture — the domino effect", caption: "The domino effect of forward head posture" },
];

/** "Jaw-related headaches" + "Neck pain, posture and jaw pain" */
export function Neck() {
  return (
    <Section tone="dark">
      <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Headaches, Neck & Jaw" title="Jaw-related headaches" accent="and neck pain" />

          <Reveal className="mt-10">
            <h3 className="eyebrow text-gold">Jaw-related headaches</h3>
            <div className="copy mt-4">
              <p className="text-[18px]! text-cream">
                <Rich text="A temple headache that worsens with chewing or clenching may have a jaw contribution. The diagnosis needs a clear relationship between the headache and the jaw disorder, supported by the history and examination. [10]" />
              </p>
              <p>
                <Rich text="Migraine can occur alongside TMD. If jaw pain improves but headaches continue, the headache diagnosis needs review. [10,14]" />
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-10 border-t border-cream/10 pt-8">
            <h3 className="eyebrow text-gold">Neck pain, posture and jaw pain</h3>
            <div className="copy mt-4">
              <p>
                <Rich text="Neck discomfort may also need assessment, particularly if neck movement changes the headache or symptoms began after an injury. Physiotherapy may form part of your care when the findings support it. [7]" />
              </p>
              <p>
                <Rich text="The jaw, head and neck muscles work together, so jaw and neck symptoms can occur at the same time. Posture, muscle tension, pain sensitivity, sleep quality and work habits may all play a part. [7]" />
              </p>
            </div>
          </Reveal>
        </div>

        <div className="space-y-5">
          {figures.map((f, i) => (
            <Reveal key={f.src} delay={i * 0.08}>
              <figure className="rounded-2xl bg-panel p-4 ring-1 ring-cream/10">
                <Image src={f.src} alt={f.alt} width={f.w} height={f.h} sizes="(min-width: 1024px) 540px, 100vw" className="w-full rounded-xl" />
                {f.caption && <figcaption className="eyebrow mt-4 mb-1 text-cream/65">{f.caption}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
