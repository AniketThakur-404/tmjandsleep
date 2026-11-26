import Image from "next/image";
import { Clock3, Siren, TriangleAlert } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { reliefTips, urgentCare } from "@/content/tmj";
import { cn } from "@/lib/utils";

const ICONS = [Siren, Clock3];

/** "When jaw pain needs urgent care" + "How to relieve jaw pain at home" */
export function Contributing() {
  return (
    <Section tone="dark" id="urgent-care">
      <div className="container-site">
        {/* Intro: heading | divider | copy */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
          <SectionHeading eyebrow="Warning signs" title="When jaw pain needs" accent="urgent care" className="lg:pr-16" />
          <Reveal className="copy lg:border-l lg:border-cream/15 lg:pt-9 lg:pl-16">
            <p className="font-display text-[22px]! leading-[1.3]! text-cream md:text-[24px]!">Most jaw pain is not an emergency.</p>
            <p>
              A sudden change, severe headache or unusual combination of symptoms needs prompt attention—even if you already have a jaw problem.
            </p>
          </Reveal>
        </div>

        {/* Emergency | same-day */}
        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20">
          {urgentCare.map((t, i) => {
            const Icon = ICONS[i] ?? Siren;
            return (
              <RevealItem
                key={t.title}
                className="group flex flex-col overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#252527_0%,#1c1c1e_55%)] ring-1 ring-cream/10 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(220,192,114,0.25)] hover:ring-gold/35"
              >
                <div className={cn("relative aspect-[2/1] overflow-hidden", t.image.bg)}>
                  <Image
                    src={t.image.src}
                    alt={t.image.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className={cn(
                      "transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]",
                      t.image.fit === "contain" ? "object-contain p-4" : "object-cover object-[50%_30%]",
                    )}
                  />
                  {t.image.fit === "cover" && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#252527]/80 to-transparent" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="eyebrow text-gold">{t.label}</p>
                      <h3 className="display mt-4 text-[24px] text-cream md:text-[28px]">{t.title}</h3>
                    </div>
                    <Icon className="size-12 shrink-0 text-gold transition-transform duration-700 group-hover:-rotate-6 md:size-14" strokeWidth={1} />
                  </div>

                  <div className="mt-7 h-px bg-gradient-to-r from-gold/60 via-gold/25 to-transparent" />

                  <ul className="mt-6 space-y-3.5">
                    {t.items.map((item) => (
                      <li key={item} className="flex gap-3.5 text-[16px] leading-[1.65] text-cream/80">
                        <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-gold" />
                        <span>
                          <Rich text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <p className="flex gap-3 border-t border-cream/10 pt-5 text-[15px] leading-[1.65] text-cream">
                      <TriangleAlert className="mt-1 size-4 shrink-0 text-gold" strokeWidth={1.75} />
                      <span>
                        <Rich text={t.note} />
                      </span>
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* What can help relieve jaw pain? */}
        <Reveal className="mt-5 rounded-2xl bg-[linear-gradient(160deg,#232325_0%,#1c1c1e_60%)] p-8 ring-1 ring-cream/10 md:p-10">
          <p className="eyebrow text-gold">Self care while you arrange care</p>
          <h2 className="display mt-3 text-[26px] text-cream md:text-[32px]">How to relieve jaw pain at home</h2>
          <p className="mt-4 max-w-[760px] text-[16px] leading-[1.75] text-cream/75">
            <Rich text="For mild discomfort without warning signs, reduce the strain on your jaw while you monitor symptoms or arrange care. [1,2]" />
          </p>
          <ol className="mt-6 divide-y divide-cream/10">
            {reliefTips.map((q, i) => (
              <li key={q} className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 py-5 md:gap-x-7">
                <span className="flex items-center gap-3 font-display text-[22px] leading-none text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                  <span aria-hidden className="h-px w-5 translate-y-[-0.3em] bg-gold/70" />
                </span>
                <span className="text-[16px] leading-snug text-cream md:text-[17px]">{q}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-lg border-l-2 border-gold bg-[linear-gradient(90deg,rgba(220,192,114,0.13),rgba(220,192,114,0.03))] px-6 py-5 text-[15.5px] leading-[1.7] text-cream/85">
            <Rich text="Ask a pharmacist, dentist or doctor whether short-term pain relief is suitable for you. If pain keeps returning, disrupts eating or sleep, or needs repeated medication, have it assessed. [2,7]" />
          </p>
          <p className="mt-4 text-[15px] leading-[1.7] text-cream/70">
            Softer food is a temporary adjustment. Ask how to return to your usual diet and comfortable jaw movement as symptoms allow.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
