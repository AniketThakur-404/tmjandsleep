import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Rich } from "@/components/rich";
import { costs, fees, insuranceNote } from "@/content/tmj";

const tables = [
  { title: "Assessment fees", rows: fees.assessment },
  { title: "Investigations and treatment", rows: fees.investigations },
];

const [knowCosts, rebates] = costs;

const NOTE = "rounded-lg border-l-2 border-gold bg-[linear-gradient(90deg,rgba(220,192,114,0.13),rgba(220,192,114,0.03))] px-6 py-5 text-[15.5px] leading-[1.7] text-cream/85";

/** "Treatment costs, Medicare and Health Insurance" */
export function Fees() {
  return (
    <Section tone="dark" id="fees">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
          <SectionHeading eyebrow="Fees" title="Treatment costs, Medicare" accent="and health insurance" className="lg:pr-16" />
          <Reveal className="copy lg:border-l lg:border-cream/15 lg:pt-9 lg:pl-16">
            <h3 className="mb-4 font-display text-[22px] leading-[1.3] text-cream md:text-[24px]">{knowCosts.title}</h3>
            {knowCosts.body.map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-2">
          {tables.map((t) => (
            <RevealItem key={t.title} className="rounded-2xl bg-[linear-gradient(160deg,#252527_0%,#1c1c1e_55%)] p-8 ring-1 ring-cream/10 md:p-10">
              <h3 className="display text-[24px] text-cream md:text-[28px]">{t.title}</h3>
              <div className="mt-6 h-px bg-gradient-to-r from-gold/60 via-gold/25 to-transparent" />
              <table className="mt-2 w-full text-left">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/10">
                  {t.rows.map(([item, details]) => (
                    <tr key={item} className="align-baseline">
                      <th scope="row" className="eyebrow w-[38%] py-5 pr-5 text-[11.5px] text-gold">
                        {item}
                      </th>
                      <td className="py-5 text-[16px] leading-[1.6] text-cream/85">{details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Rebates, payment options and referrals */}
        <Reveal className={`mt-5 ${NOTE}`}>
          <h3 className="font-sans text-[15.5px] font-bold text-cream">{rebates.title}</h3>
          <div className="mt-2 space-y-2">
            {rebates.body.map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
            <p>{insuranceNote}</p>
          </div>
        </Reveal>

        <Reveal className={`mt-3 ${NOTE}`}>
          <strong className="font-bold text-cream">Bring your medication list,</strong> relevant dental and medical reports, previous scans, Medicare card and
          any referral letter. A short record of jaw symptoms and headache days can also help.
        </Reveal>
      </div>
    </Section>
  );
}
