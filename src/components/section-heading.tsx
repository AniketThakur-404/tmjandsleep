"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Tone } from "@/components/section";

type Props = {
  eyebrow: string;
  title: string;
  /** Emphasised tail — shown in the accent colour */
  accent?: string;
  as?: "h1" | "h2";
  tone?: Tone;
  align?: "left" | "center";
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fade: Variants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const rise: Variants = { hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1, ease: EASE } } };

/** Standard section header: small eyebrow + uppercase display heading. */
export function SectionHeading({ eyebrow, title, accent, as: Tag = "h2", tone = "dark", align = "left", className }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={group}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={cn(align === "center" && "text-center", className)}
    >
      <motion.p variants={fade} className={cn("eyebrow", tone === "dark" ? "text-gold" : "text-gold-deep")}>
        {eyebrow}
      </motion.p>
      <Tag className={cn("display mt-4 text-[29px] break-words sm:text-[36px] md:text-[48px]", tone === "dark" ? "text-cream" : "text-ink")}>
        <span className="block overflow-hidden pb-[0.06em]">
          <motion.span variants={rise} className="block">
            {title}
          </motion.span>
        </span>
        {accent && (
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={rise} className={cn("block", tone === "dark" ? "text-gold" : "text-gold-deep")}>
              {accent}
            </motion.span>
          </span>
        )}
      </Tag>
    </motion.div>
  );
}
