import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { contributingTypes, usefulQuestions } from "@/content/tmj";

export function Contributing() {
  return (
    <Section tone="dark" id="causes">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Understanding your symptoms" title="What may be contributing" accent="to my TMJ pain?" />
          <Reveal className="copy lg:pt-9">
            <p className="text-[18px]! text-cream">There is rarely one single cause of TMD.</p>
            <p>
              Jaw pain can arise from the joint itself, the surrounding muscles and ligaments, dental structures or, less commonly, other neurological or
              medical conditions.
            </p>
            <p>
              A range of factors may contribute, including previous injury, repetitive jaw loading, clenching or grinding, joint inflammation or
              degeneration, changes within the TMJ, pain sensitisation, sleep disturbance, and behavioural or psychosocial factors.
            </p>
            <p>For some people, symptoms develop after a clear injury. For others, they develop gradually over time.</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2">
          {contributingTypes.map((t) => (
            <RevealItem key={t.title} className="rounded-2xl bg-panel p-8 ring-1 ring-cream/10 transition-colors duration-500 hover:ring-gold/40 md:p-10">
              <p className="eyebrow text-gold">{t.label}</p>
              <h3 className="mt-4 text-[28px] leading-[1.15] text-cream uppercase">{t.title}</h3>
              <div className="copy mt-5">
                {t.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-5 rounded-2xl bg-panel p-8 ring-1 ring-cream/10 md:p-10">
          <p className="eyebrow text-gold">Some useful questions to consider</p>
          <ul className="mt-6 divide-y divide-cream/10">
            {usefulQuestions.map((q) => (
              <li key={q} className="flex gap-4 py-4 text-[17px] leading-snug text-cream">
                <span className="mt-[0.6em] h-px w-5 shrink-0 bg-gold" />
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[16px] leading-[1.75] text-cream/75">
            If you are unsure, a clinical assessment can identify findings that may help determine whether jaw-muscle activity or other factors could be
            contributing to your symptoms.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
