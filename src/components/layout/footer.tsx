"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { footerNav, LIVE, newTab, site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="mx-2 mt-3 mb-3 overflow-hidden rounded-[24px] bg-beige text-ink md:mx-3">
      {/* Brand + link columns on one row */}
      <div className="container-site grid gap-10 pt-12 md:pt-14 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
        <div>
          <Link href={`${LIVE}/`} {...newTab(LIVE)} aria-label={site.name} className="inline-block">
            <Image src="/images/logo.png" alt="TMJ & Sleep Therapy logo" width={170} height={65} className="h-[60px] w-auto" />
          </Link>
          <p className="mt-4 max-w-[380px] text-[14.5px] leading-[1.65] text-ink-soft">
            Assessment and management of jaw pain, temporomandibular disorders, bruxism, snoring and sleep-related breathing concerns.
          </p>
          <ul className="mt-5 space-y-2 text-[14px] text-ink-soft">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 font-bold text-ink transition-colors hover:text-gold-deep">
                <Phone className="size-4 text-gold-deep" />
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-gold-deep" />
              {site.address.join(", ")}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-gold-deep" />
              {site.hours}
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
          {Object.entries(footerNav).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-[15.5px] font-bold text-ink">{heading}</p>
              <ul className="mt-3 space-y-1.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      {...newTab(l.href)}
                      className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-[14px] text-ink-soft transition-[background-size,color] duration-500 hover:bg-[length:100%_1px] hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Shiny wordmark — compact */}
      <div className="px-4 pb-4">
        <motion.p
          aria-hidden
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="shiny-text mt-8 text-center font-display text-[11vw] leading-[1.1] select-none md:text-[6.2vw] md:whitespace-nowrap"
        >
          {site.shortName}
        </motion.p>
      </div>

      {/* Disclaimer + bottom bar */}
      <div className="border-t border-ink/10">
        <div className="container-site py-6">
          <p className="text-[12px] leading-[1.65] text-ink-soft/80">
            The information on this website is general in nature and is not intended to replace individual medical or dental advice, diagnosis or
            treatment. Treatment suitability, benefits, risks and outcomes vary between individuals. A consultation and appropriate clinical assessment are
            required before treatment recommendations can be made. If you have symptoms that may require urgent medical attention, seek appropriate
            medical care or emergency assistance.
          </p>
          <div className="mt-4 flex flex-col gap-1.5 text-[13px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} <span className="font-bold text-ink">{site.name}</span>. All rights reserved.
            </p>
            <p>
              Affiliated with <span className="font-bold text-ink">{site.affiliate}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
