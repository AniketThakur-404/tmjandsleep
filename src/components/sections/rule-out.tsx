import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { StackCards } from "@/components/stack-cards";
import { otherCauses } from "@/content/tmj";

/** "Other causes of jaw and facial pain" — stacking cards */
export function RuleOut() {
  return (
    <Section tone="dark" id="causes">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Rule out other causes" title="Other causes of" accent="jaw and facial pain" />

          <Reveal className="copy lg:pt-9">
            <p className="text-[18px]! text-cream">A painful jaw can have more than one explanation.</p>
            <p>
              <Rich text="A tooth problem and migraine, for example, may need separate treatment. Tell your clinician what previous care helped, what changed and what stayed the same. [1,7]" />
            </p>
          </Reveal>
        </div>

        <StackCards items={otherCauses} tone="dark" className="mt-14" />
      </div>
    </Section>
  );
}
