import Image from "next/image";
import { CarFront, Clock3, CreditCard, MapPin, Phone, TrainFront } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ArrowButton } from "@/components/ui-brand/arrow-button";
import { visit } from "@/content/tmj";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The areas the consultation covers, matching the section's opening line. */
const AREAS = [
  { label: "Teeth", src: "/images/tooth-wear.png", alt: "Worn teeth from grinding", fit: "cover" },
  { label: "Muscles & joints", src: "/images/tmj-anatomy.png", alt: "Jaw joint and chewing muscle anatomy", fit: "contain" },
  { label: "Headaches", src: "/images/headaches.png", alt: "Woman holding her temples with a headache", fit: "cover" },
  { label: "Sleep", src: "/images/sleep-study.jpg", alt: "Patient wearing a home sleep study device", fit: "cover" },
] as const;

/** "A doctor and dentist assessing your condition" + "Visiting Our Clinic" */
export function Monitoring() {
  return (
    <Section tone="light" id="clinic">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading tone="light" eyebrow="Dentistry & Medicine" title="A doctor and dentist" accent="assessing your condition" />
          {/* "Teeth, muscles, joints, headaches and sleep can all matter." */}
          <RevealGroup className="mt-10 grid grid-cols-2 gap-3 md:gap-4">
            {AREAS.map((a) => (
              <RevealItem key={a.label} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ring-1 ring-ink/[0.06]">
                <Image
                  src={a.src}
                  alt={a.alt}
                  fill
                  sizes="(min-width: 1024px) 260px, 50vw"
                  className={cn(
                    "transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.05]",
                    a.fit === "contain" ? "object-contain p-2" : "object-cover",
                  )}
                />
                <span className="eyebrow absolute bottom-2.5 left-2.5 rounded-full bg-ink/85 px-3 py-1.5 text-[10px] text-cream backdrop-blur-sm md:text-[10.5px]">
                  {a.label}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <div className="lg:pt-9">
          <Reveal className="copy">
            <p className="text-[18px]! text-ink">Jaw pain crosses the boundary between dentistry and medicine. Teeth, muscles, joints, headaches and sleep can all matter.</p>
            <p>
              {site.practitioner} is registered as both a dentist and a medical practitioner and holds{" "}
              <strong className="font-bold text-ink">BDS (Hons), MBBS and MMed (Sleep Medicine)</strong> qualifications. He has over 20 years of experience
              treating jaw pain, headaches and sleep disorders.
            </p>
            <p>
              Your consultation brings these perspectives together. We explain the findings, discuss suitable options and costs, and arrange a referral
              when another clinician is better placed to help.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 rounded-2xl bg-paper p-8 ring-1 ring-ink/[0.06] md:p-10">
            <h3 className="eyebrow text-gold-deep">Visiting our clinic</h3>
            <p className="mt-4 font-display text-[24px] leading-[1.2] text-ink">Sydney Centre for TMJ and Sleep Therapy</p>
            <ul className="mt-5 space-y-3 text-[15.5px] leading-[1.6] text-ink-soft">
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-gold-deep" />
                {site.address.join(", ")}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 size-4 shrink-0 text-gold-deep" />
                <span>
                  <a href={site.phoneHref} className="font-bold text-ink hover:text-gold-deep">
                    {site.phoneDisplay}
                  </a>{" "}
                  | {visit.website}
                </span>
              </li>
              <li className="flex gap-3">
                <Clock3 className="mt-1 size-4 shrink-0 text-gold-deep" />
                {visit.hours}
              </li>
              <li className="flex gap-3">
                <TrainFront className="mt-1 size-4 shrink-0 text-gold-deep" />
                {visit.transport}
              </li>
              <li className="flex gap-3">
                <CarFront className="mt-1 size-4 shrink-0 text-gold-deep" />
                {visit.parking}
              </li>
              <li className="flex gap-3">
                <CreditCard className="mt-1 size-4 shrink-0 text-gold-deep" />
                <span>
                  {visit.payment}
                </span>
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ArrowButton href={site.phoneHref} tone="ink">
                Call {site.phoneDisplay}
              </ArrowButton>
              <p className="text-[14.5px] font-bold text-ink">No referral needed.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
