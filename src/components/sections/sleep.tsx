import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { StackCards, type StackItem } from "@/components/stack-cards";

const cards: StackItem[] = [
  {
    label: "Sleep apnoea",
    title: "When sleep apnoea may be involved",
    image: { src: "/images/sleep-apnoea-airway.jpg", alt: "Normal breathing, snoring and obstructive sleep apnoea airway diagrams", fit: "contain" },
    body: [
      "Obstructive sleep apnoea causes repeated narrowing or closure of the airway during sleep. Signs include loud snoring, witnessed breathing pauses, waking unrefreshed and daytime sleepiness. [23,24]",
      "Sleep apnoea headache occurs on waking and often affects both sides with a pressing sensation. It may settle within four hours. These features alone do not establish the diagnosis: sleep apnoea must be confirmed and a causal link assessed. [22]",
      "Grinding does not automatically mean sleep apnoea, and sleep apnoea does not automatically mean grinding. Because the two can be related, report both sets of symptoms so neither is overlooked.",
    ],
  },
  {
    label: "Sleep study",
    title: "Assessing your sleep",
    image: { src: "/images/sleep-study.jpg", alt: "Patient wearing a home sleep study device in bed", fit: "cover" },
    body: [
      "If your history suggests a sleep disorder, a sleep study may be recommended at home or in a sleep clinic. The recordings depend on the type of study and may include breathing, oxygen levels and sleep measurements. [24]",
      "Dr Shah holds a Master of Medicine in Sleep Medicine. Sleep findings can be discussed alongside your jaw assessment, with GP or sleep physician involvement when needed.",
      "Sleep apnoea treatment may include lifestyle measures, CPAP or a mandibular advancement appliance, depending on the diagnosis and individual circumstances. An appliance that advances the jaw to help keep the airway open serves a different purpose from a grinding guard, although it may also reduce grinding in some people. [23,24,25]",
    ],
  },
];

/** "Waking with jaw pain or headaches" — stacking cards */
export function Sleep() {
  return (
    <Section tone="light" id="sleep">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading tone="light" eyebrow="Sleep, Jaw Pain & Headaches" title="Waking with jaw pain" accent="or headaches?" />
          <Reveal className="copy lg:pt-9">
            <p className="text-[18px]! text-ink">If mornings start with a sore jaw or headache, mention your sleep.</p>
            <p>
              <Rich text="Grinding, migraine, sleep apnoea and other conditions can produce morning symptoms. The pattern needs assessment, not guesswork. [20,22]" />
            </p>
          </Reveal>
        </div>

        <StackCards items={cards} tone="light" className="mt-16" />
      </div>
    </Section>
  );
}
