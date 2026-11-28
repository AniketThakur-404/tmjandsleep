import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { byline, references } from "@/content/tmj";
import { site } from "@/lib/site";

/** "About the author" + reference list (targets of the [n] citation links). */
export function Author() {
  return (
    <Section tone="light" id="author">
      <div className="container-site">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <figure className="overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/[0.06]">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/dr-manish-shah.jpg"
                  alt="Dr Manish Shah, dentist and medical practitioner in Sydney"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="px-6 py-5">
                <p className="type-h4 font-display text-ink">Dr Manish Shah</p>
                <p className="eyebrow mt-1 text-[11px] text-gold-deep">BDS (Hons), MBBS, MMed (Sleep Medicine)</p>
              </figcaption>
            </figure>
          </Reveal>

          <div>
            <SectionHeading tone="light" eyebrow="Clinically reviewed" title="About the" accent="author" />
            <Reveal className="copy mt-8">
              <p className="type-lead text-ink">
                Dr Manish Shah holds BDS (Hons), MBBS and MMed (Sleep Medicine) qualifications. He graduated in dentistry with honours from the University of
                Sydney in 1998 and completed his medical degree in 2005.
              </p>
              <p>His clinical interests include jaw and craniofacial pain, snoring, obstructive sleep apnoea and dental sleep medicine.</p>
              <p>
                <strong className="font-bold text-ink">AHPRA registration:</strong>{" "}
                <Rich text={`[${byline.ahpra}](${site.ahpraRegisterHref})`} /> — see the AHPRA public register.
              </p>
            </Reveal>

            <Reveal className="mt-8 rounded-lg border-l-2 border-gold-deep bg-paper type-note px-6 py-5 text-ink-soft">
              Clinically reviewed by {byline.reviewer}, at {byline.where}. AHPRA registration: {byline.ahpra}.{" "}
              <strong className="font-bold text-ink">Last reviewed: {byline.lastReviewed}.</strong>
            </Reveal>
          </div>
        </div>

        {/* References */}
        <Reveal className="mt-20 border-t border-ink/10 pt-12">
          <h2 className="eyebrow text-gold-deep">References</h2>
          <ol className="mt-6 grid gap-x-12 gap-y-3 type-fine text-ink-soft md:grid-cols-2">
            {references.map((r, i) => (
              <li key={r.text} id={`ref-${i + 1}`} className="flex scroll-mt-32 gap-3 rounded-md target:bg-gold/20">
                <span className="w-6 shrink-0 text-right font-bold text-ink tabular-nums">{i + 1}.</span>
                <span>
                  {r.text}{" "}
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold whitespace-nowrap text-gold-deep underline-offset-2 hover:underline"
                    >
                      Source
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
