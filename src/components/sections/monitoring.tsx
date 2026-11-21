import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";

export function Monitoring() {
  return (
    <Section tone="light">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-20">
        <SectionHeading tone="light" eyebrow="Monitoring Your Progress" title="Treatment should" accent="evolve with you" />
        <Reveal className="copy lg:pt-9">
          <p>Your progress is reviewed according to your diagnosis and the treatment being provided.</p>
          <p>We assess changes in symptoms, jaw function and other relevant clinical findings and adjust the management plan where appropriate.</p>
          <p>Some TMD conditions improve relatively quickly, while others fluctuate or require longer-term management.</p>
          <p>No treatment can guarantee a particular outcome, and response varies between individuals.</p>
          <p>
            Our aim is to use the <strong className="font-bold text-ink">least invasive appropriate management</strong> and involve other healthcare
            professionals when the clinical situation requires it.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
