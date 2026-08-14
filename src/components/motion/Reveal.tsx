"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

/** Calm editorial ease — no bounce. */
export const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const viewportOnce = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -56px 0px",
} as const;

type FadeUp = {
  hidden: { opacity: number; y: number };
  visible: { opacity: number; y: number; transition: { duration: number; ease: typeof easePremium } };
};

function fadeUp(reduce: boolean | null, fadeOnly = false): FadeUp {
  if (reduce || fadeOnly) {
    return {
      hidden: { opacity: 0, y: 0 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0.2 : 0.5, ease: easePremium },
      },
    };
  }
  return {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easePremium } },
  };
}

const staggerVisible = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const staggerFastVisible = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

type Tag = "div" | "section" | "ul" | "li" | "article" | "aside" | "p" | "header" | "footer";

const motionTags = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  article: motion.article,
  aside: motion.aside,
  p: motion.p,
  header: motion.header,
  footer: motion.footer,
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  fade = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
  /** Opacity only — use around scroll/snap tracks so transform never fights layout. */
  fade?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motionTags[as];
  const variants = fadeUp(reduce, fade);

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

export function RevealGroup({
  children,
  className,
  as = "div",
  fast = false,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  fast?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motionTags[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduce ? { hidden: {}, visible: {} } : fast ? staggerFastVisible : staggerVisible}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  const Tag = motionTags[as];

  return (
    <Tag className={className} variants={fadeUp(reduce)}>
      {children}
    </Tag>
  );
}

/** First-screen sequence — plays on mount, not on scroll. */
export function RevealMount({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  const Tag = motionTags[as];
  const variants = fadeUp(reduce);

  return (
    <Tag className={className} initial="hidden" animate="visible" variants={variants} transition={{ delay }}>
      {children}
    </Tag>
  );
}

export function RevealMountGroup({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  const Tag = motionTags[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      variants={reduce ? { hidden: {}, visible: {} } : staggerVisible}
    >
      {children}
    </Tag>
  );
}
