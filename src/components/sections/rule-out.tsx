import { TriangleAlert } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";

export function RuleOut() {
  return (
    <Section tone="dark">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-20">
        <SectionHeading eyebrow="Rule out other causes" title="Could it be" accent="something else?" />

        <Reveal className="lg:pt-9">
          <div className="copy">
            <p className="font-display text-[40px]! leading-none! text-gold">Yes.</p>
            <p className="text-[18px]! text-cream">Pain around the jaw, temples, face, ears, teeth or head can have many different causes.</p>
            <p>
              These may include temporomandibular disorders, dental conditions, migraine, tension-type headache, sinus or ear conditions, neuralgic pain,
              musculoskeletal problems and other medical disorders.
            </p>
            <p>An important part of assessment is recognising when symptoms do not appear to originate from the jaw.</p>
            <p>Where appropriate, we may recommend evaluation by your general practitioner, medical specialist or another healthcare professional.</p>
          </div>
          <div className="mt-8 flex gap-4 rounded-2xl bg-panel p-6 ring-1 ring-gold/35">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.75} />
            <p className="text-[16px] leading-[1.7] text-cream/90">
              New or severe headache, neurological symptoms, significant facial swelling, fever, recent major trauma or other concerning symptoms may
              require prompt medical assessment.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
