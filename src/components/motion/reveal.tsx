"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = ComponentPropsWithoutRef<typeof motion.div> & {
  delay?: number;
  y?: number;
  /** Fraction of the element that must be visible before it animates */
  amount?: number;
};

/** Fade + rise on first entry into the viewport (Framer Motion). */
export function Reveal({ delay = 0, y = 28, amount = 0.2, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

/** Parent that staggers any <RevealItem> children. */
export function RevealGroup({
  children,
  amount = 0.15,
  ...rest
}: ComponentPropsWithoutRef<typeof motion.div> & { amount?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={groupVariants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...rest }: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}
