import Image from "next/image";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

export function Headaches() {
  return (
    <Section tone="light">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading tone="light" eyebrow="Bruxism & Headaches" title="Can grinding" accent="cause headaches?" />
            <Reveal className="copy mt-8">
              <p>Bruxism, temporomandibular disorders, sleep disturbance and headache disorders can occur together.</p>
              <p>In some people, increased activity or tenderness of the jaw and temple muscles may contribute to head or facial pain.</p>
              <p className="text-ink">However, this relationship is not the same for everyone.</p>
              <p>A person can have bruxism without headaches, headaches without bruxism, or both conditions for unrelated reasons.</p>
              <p>Migraine, tension-type headache and other headache disorders are also common and may require medical assessment.</p>
              <p>
                The aim of assessment is therefore <strong className="font-bold text-ink">not simply to assume that a headache is coming from the jaw</strong>,
                but to determine whether the jaw and associated muscles appear to be contributing to the overall clinical picture.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <figure className="rounded-2xl bg-paper p-8 md:p-12">
              <Image
                src="/images/bruxism-muscles.png"
                alt="Muscles that become tender during bruxism"
                width={290}
                height={300}
                className="mx-auto h-auto w-[260px] mix-blend-multiply md:w-[300px]"
              />
              <figcaption className="eyebrow mt-6 text-center text-ink-soft">Muscles that become tender during bruxism</figcaption>
            </figure>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2">
          <RevealItem className="rounded-2xl bg-ink p-8 text-cream md:p-10">
            <CountUp value={65} suffix="%" className="block font-display text-[64px] leading-none text-gold" />
            <p className="mt-5 text-[16px] leading-[1.6] text-cream/80">of patients with night-time bruxism also experience headaches.</p>
          </RevealItem>
          <RevealItem className="rounded-2xl bg-ink p-8 text-cream md:p-10">
            <CountUp value={3} suffix="×" className="block font-display text-[64px] leading-none text-gold" />
            <p className="mt-5 text-[16px] leading-[1.6] text-cream/80">the biting force used by people who grind, compared with those who don’t.</p>
          </RevealItem>
        </RevealGroup>
      </div>
    </Section>
  );
}
