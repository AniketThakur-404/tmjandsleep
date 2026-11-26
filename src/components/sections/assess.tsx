"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { ArrowButton } from "@/components/ui-brand/arrow-button";
import { assessSteps } from "@/content/tmj";
import { site } from "@/lib/site";

export function Assess() {
  return (
    <Section tone="light" id="diagnosis">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:top-28 lg:self-start [@media(min-height:880px)]:lg:sticky">
          <SectionHeading tone="light" eyebrow="Our process" title="What happens at your" accent="jaw pain assessment" />
          <Reveal className="copy mt-8">
            <p className="text-ink">We start with what is troubling you most.</p>
            <p>That might be pain with meals, a jaw that locks, headaches that interrupt work, or symptoms that disturb sleep.</p>
            <p>
              <Rich text="The assessment brings your history and examination together to identify the likely source and decide what to do next. [8,16]" />
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <figure className="group overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/[0.06]">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src="/images/limited-opening.png"
                  alt="Clinician measuring how far a patient can open their mouth"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="eyebrow px-6 py-4 text-[11px] text-ink-soft">Checking jaw movement during the examination</figcaption>
            </figure>
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
                        <p key={p}>
                          <Rich text={p} />
                        </p>
                      ))}
                      {s.list && (
                        <ul className="mt-3 space-y-2">
                          {s.list.map((li) => (
                            <li key={li} className="flex gap-3 text-[16px] leading-[1.6]">
                              <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-gold-deep" />
                              {li}
                            </li>
                          ))}
                        </ul>
                      )}
                      {s.after?.map((p) => (
                        <p key={p} className="mt-4">
                          {p}
                        </p>
                      ))}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-6 rounded-2xl bg-ink p-7 text-cream md:p-8">
            <p className="font-display text-[22px] leading-[1.25] md:text-[24px]">Ready to find out what is causing your jaw pain?</p>
            <p className="mt-2 text-[15.5px] leading-[1.6] text-cream/75">
              Book online or call {site.phoneDisplay}. <strong className="font-bold text-cream">No referral needed.</strong>
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <ArrowButton href={site.bookingHref}>Book Online</ArrowButton>
              <ArrowButton href={site.phoneHref} tone="dark">
                Call {site.phoneDisplay}
              </ArrowButton>
            </div>
          </Reveal>
        </AccordionPrimitive.Root>
      </div>
    </Section>
  );
}
