"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <motion.div
        className="page-transition-curtain"
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
}
