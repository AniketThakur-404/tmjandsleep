"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";

/**
 * Matches, in copy text:
 *  - inline links written as "[label](/path)" (internal) or "[label](https://…)" (external)
 *  - citation markers like "[1]", "[1,2,10]" (and the space before them)
 */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\s?\[(\d+(?:\s*,\s*\d+)*)\]/g;

const LINK_CLS = "font-bold underline decoration-current/35 underline-offset-4 transition-[text-decoration-color] hover:decoration-current";

/**
 * Renders copy text, turning citation markers such as "[1,2]" into small
 * superscript links to the reference list (#ref-1, #ref-2 …) and
 * "[label](href)" into links.
 */
export function Rich({ text }: { text: string }) {
  const lenis = useLenis();
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));

    if (m[1] !== undefined) {
      const [, label, href] = m;
      out.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={at} href={href} className={LINK_CLS}>
            {label}
          </Link>
        ) : (
          <a key={at} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>
            {label}
          </a>
        ),
      );
    } else {
      const nums = m[3].split(",").map((n) => n.trim());
      out.push(
        <sup key={at} className="ml-[0.2em] text-[0.68em] leading-none font-bold whitespace-nowrap text-gold-deep">
          [
          {nums.map((n, i) => (
            <Fragment key={n}>
              {i > 0 && ","}
              <a
                href={`#ref-${n}`}
                onClick={(e) => {
                  const el = document.getElementById(`ref-${n}`);
                  if (el && lenis) {
                    e.preventDefault();
                    window.location.hash = `ref-${n}`;
                    lenis.scrollTo(el, { offset: -128, duration: 1.1 });
                  }
                }}
                className="underline decoration-gold-deep/45 underline-offset-2 transition-colors hover:text-ink hover:decoration-current"
                aria-label={`Reference ${n}`}
              >
                {n}
              </a>
            </Fragment>
          ))}
          ]
        </sup>,
      );
    }
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
