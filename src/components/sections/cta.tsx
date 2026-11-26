import { MapPin, Phone } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ArrowButton } from "@/components/ui-brand/arrow-button";
import { ImageTrail } from "@/components/motion/image-trail";
import { site } from "@/lib/site";

/** Clinical images that trail the cursor across this section. */
const TRAIL_IMAGES = [
  "/images/tmj-anatomy.png",
  "/images/closed-mouth-anatomy.png",
  "/images/tooth-wear.png",
  "/images/tongue-scalloping.png",
  "/images/cracked-teeth.png",
  "/images/facial-pain.png",
  "/images/headaches.png",
  "/images/limited-opening.png",
  "/images/jaw-noises.png",
  "/images/morning-soreness.png",
  "/images/forward-head-carriage.jpg",
  "/images/bruxism-muscles.png",
  "/images/tori.png",
  "/images/domino-effect.png",
];

export function Cta() {
  return (
    <Section tone="dark" id="contact">
      <ImageTrail images={TRAIL_IMAGES} />
      <div className="relative z-10 container-site">
        <SectionHeading align="center" eyebrow="Take the First Step" title="Book a jaw pain" accent="assessment in Sydney" />

        <Reveal className="copy mx-auto mt-8 max-w-[760px] text-center">
          <p>
            If jaw pain keeps returning or changes how you eat, sleep or work, book an assessment. We will listen to the pattern, examine the relevant
            structures and explain the next step.
          </p>
          <p>You can come with questions. You do not need to choose a treatment before we understand the problem.</p>
          <p className="text-[19px]! text-cream">Book online or call {site.phoneDisplay} to book or discuss the appointment. No referral needed.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ArrowButton href={site.bookingHref}>Book a Jaw Pain Assessment</ArrowButton>
          <ArrowButton href={site.phoneHref} tone="dark" icon={<Phone className="size-4" />}>
            Call {site.phoneDisplay}
          </ArrowButton>
        </Reveal>
        <p className="mx-auto mt-6 flex max-w-[640px] items-start justify-center gap-2 text-center text-[15px] leading-[1.6] text-cream/75">
          <MapPin className="mt-1 size-4 shrink-0 text-gold" />
          <span>
            Sydney Centre for TMJ and Sleep Therapy, {site.address.join(", ")}. Monday to Friday, 9 am to 5 pm.
          </span>
        </p>

        <Reveal data-trail-off className="mx-auto mt-16 max-w-[860px] rounded-2xl bg-panel p-8 text-center ring-1 ring-cream/10 md:p-10">
          <h3 className="display text-[28px] text-cream md:text-[34px]">Important information</h3>
          <div className="copy mt-4">
            <p>
              This page provides general information and does not replace an individual assessment. Treatment suitability, benefits, risks and costs
              vary.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
