"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { faqs } from "@/content/tmj";

/** "Frequently asked questions" — same accordion style as the assessment steps. */
export function Faq() {
  return (
    <Section tone="light" id="faq">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading tone="light" eyebrow="Your questions" title="Jaw pain and TMJ:" accent="frequently asked questions" />
        </div>

        <AccordionPrimitive.Root type="single" collapsible defaultValue="faq-0">
          <RevealGroup className="space-y-3">
            {faqs.map((f, i) => (
              <RevealItem key={f.q}>
                <AccordionPrimitive.Item value={`faq-${i}`} className="group overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/[0.06] data-[state=open]:ring-gold-deep/40">
                  <AccordionPrimitive.Header asChild>
                    <h3>
                      <AccordionPrimitive.Trigger className="flex w-full items-center gap-5 px-6 py-5 text-left md:px-8">
                        <span className="font-display text-[20px] text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                        <span className="type-h4 flex-1 font-display leading-tight text-ink">{f.q}</span>
                        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-cream transition-colors duration-300 group-data-[state=open]:bg-gold group-data-[state=open]:text-ink">
                          <Plus className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-45" />
                        </span>
                      </AccordionPrimitive.Trigger>
                    </h3>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="copy px-6 pb-7 md:pr-20 md:pl-[76px]">
                      <p>
                        <Rich text={f.a} />
                      </p>
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
