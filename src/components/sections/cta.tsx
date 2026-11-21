import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ArrowButton } from "@/components/ui-brand/arrow-button";
import { site } from "@/lib/site";

export function Cta() {
  return (
    <Section tone="dark" id="contact">
      <div className="container-site">
        <SectionHeading align="center" eyebrow="Take the First Step" title="Understand what may be" accent="contributing to your symptoms" />

        <Reveal className="copy mx-auto mt-8 max-w-[760px] text-center">
          <p>
            If jaw pain, headaches, facial pain or difficulty using your jaw are affecting you, an assessment can help determine whether a
            temporomandibular disorder may be contributing.
          </p>
          <p>
            Your consultation is designed to establish the likely diagnosis, identify relevant contributing factors and determine whether further dental,
            medical, sleep, imaging or allied-health assessment is appropriate.
          </p>
          <p>From there, we can discuss management options suited to your individual circumstances.</p>
          <p className="text-[19px]! text-cream">Book a consultation with {site.practitioner} for an individual assessment of your jaw symptoms.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ArrowButton href={site.phoneHref} icon={<Phone className="size-4" />}>
            Call {site.phoneDisplay}
          </ArrowButton>
          <ArrowButton href={`mailto:${site.email}`} tone="dark" icon={<Mail className="size-4" />}>
            Send an Enquiry
          </ArrowButton>
        </Reveal>
        <p className="mt-6 flex items-center justify-center gap-2 text-[15px] text-cream/75">
          <MapPin className="size-4 text-gold" />
          {site.address.join(" ")}
        </p>

        <Reveal className="mx-auto mt-16 max-w-[860px] rounded-2xl bg-panel p-8 text-center ring-1 ring-cream/10 md:p-10">
          <h2 className="display text-[28px] text-cream md:text-[34px]">Important information</h2>
          <div className="copy mt-4">
            <p>
              The information on this website is general in nature and is not intended to replace individual medical or dental advice, diagnosis or
              treatment.
            </p>
            <p>
              Recommendations vary according to each person’s history, examination findings, diagnosis and individual circumstances. Where appropriate,
              referral to another healthcare professional may be recommended.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
