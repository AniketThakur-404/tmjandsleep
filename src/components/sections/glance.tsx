import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { glance } from "@/content/tmj";

export function Glance() {
  return (
    <Section tone="light">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading tone="light" eyebrow="The short version" title="Jaw pain" accent="at a glance" />
          <Reveal delay={0.1} className="mt-10">
            <figure className="group overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/[0.06]">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src="/images/morning-soreness.png"
                  alt="Woman waking in bed holding her sore jaw"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-(--ease-soft) group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="eyebrow px-6 py-4 text-[11px] text-ink-soft">Waking with jaw pain or headaches</figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="lg:pt-9">
          <Reveal>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {glance.map((g) => (
                <li key={g} className="flex gap-4 py-4 text-[17px] leading-[1.55] text-ink">
                  <span aria-hidden className="mt-[0.75em] h-px w-5 shrink-0 bg-gold-deep" />
                  <span>
                    <Rich text={g} />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-8 flex gap-4 rounded-2xl bg-paper p-6 ring-1 ring-gold-deep/35">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.75} />
            <p className="text-[16px] leading-[1.7] text-ink">
              Sudden or severe symptoms need a different response.{" "}
              <a href="#urgent-care" className="font-bold underline decoration-gold-deep/50 underline-offset-4 hover:decoration-gold-deep">
                Read the warning signs below
              </a>{" "}
              before booking a routine appointment.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
