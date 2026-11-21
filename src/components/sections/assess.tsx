"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { assessSteps } from "@/content/tmj";

export function Assess() {
  return (
    <Section tone="light" id="diagnosis">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading tone="light" eyebrow="Our process" title="How we" accent="assess TMJ pain" />
          <Reveal className="copy mt-8">
            <p>Effective management begins with establishing the most likely diagnosis and identifying the factors that may be contributing to your symptoms.</p>
            <p className="text-ink">Not every patient requires the same investigations.</p>
            <p>Your assessment is tailored to your history, symptoms and clinical findings.</p>
          </Reveal>
        </div>

        <AccordionPrimitive.Root type="single" collapsible defaultValue="step-0">
          <RevealGroup className="space-y-3">
            {assessSteps.map((s, i) => (
              <RevealItem key={s.title}>
                <AccordionPrimitive.Item value={`step-${i}`} className="group overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/[0.06] data-[state=open]:ring-gold-deep/40">
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="flex w-full items-center gap-5 px-6 py-6 text-left md:px-8">
                      <span className="font-display text-[22px] text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-display text-[21px] leading-tight text-ink md:text-[23px]">{s.title}</span>
                      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-cream transition-colors duration-300 group-data-[state=open]:bg-gold group-data-[state=open]:text-ink">
                        <Plus className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="copy px-6 pb-8 md:pr-20 md:pl-[76px]">
                      {s.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </RevealItem>
            ))}
          </RevealGroup>
        </AccordionPrimitive.Root>
      </div>
    </Section>
  );
}
