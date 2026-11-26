import Image from "next/image";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";

const cards = [
  {
    label: "At night",
    title: "Grinding during sleep",
    body: [
      "A partner may hear grinding, or a dentist may notice signs that warrant investigation. Waking with tired jaw muscles or sore teeth can be another clue, although tooth wear or morning soreness alone cannot confirm current sleep bruxism. [17,20,21]",
      "Sleep bruxism has been linked with sleep-disordered breathing such as sleep apnoea, as well as stress, anxiety, some medicines, alcohol, caffeine and smoking. [20,21]",
    ],
  },
  {
    label: "Protecting teeth",
    title: "Night guards",
    body: [
      "A night guard can protect teeth from grinding damage, but its effect on jaw pain varies and it does not reliably stop grinding. Before agreeing to one, ask what it is intended to achieve and how the result will be reviewed. [17,19]",
      "If sleep apnoea has been diagnosed, a mandibular advancement splint may be recommended for your breathing. A small controlled study suggests it may also reduce grinding in some people. [25]",
    ],
  },
];

/** "Teeth grinding and jaw clenching" */
export function Headaches() {
  return (
    <Section tone="light" id="grinding">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading tone="light" eyebrow="Bruxism" title="Teeth grinding and" accent="jaw clenching (bruxism)" />
            <Reveal className="copy mt-8">
              <p>
                <Rich text="Bruxism means grinding, clenching or related jaw muscle activity. It can happen while awake or asleep and does not always cause harm. When symptoms develop, they may include sore jaw muscles, worn or sensitive teeth and temple headaches. [17,20,21]" />
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <figure className="rounded-2xl bg-paper p-8 md:p-12">
              <Image
                src="/images/night-guard.jpg"
                alt="Clear night guard on a dental model"
                width={400}
                height={400}
                className="mx-auto h-auto w-[240px] rounded-full mix-blend-multiply md:w-[280px]"
              />
              <figcaption className="eyebrow mt-6 text-center text-ink-soft">A night guard may protect teeth. Pain relief is a separate treatment goal.</figcaption>
            </figure>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <RevealItem key={c.title} className="rounded-2xl bg-ink p-8 text-cream md:p-10">
              <p className="eyebrow text-gold">{c.label}</p>
              <h3 className="mt-4 font-display text-[34px] leading-[1.05] text-gold md:text-[40px]">{c.title}</h3>
              <div className="mt-5 space-y-3 text-[16px] leading-[1.65] text-cream/80">
                {c.body.map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
