"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export function PageTransition({ 
  children, 
  transitionKey 
}: { 
  children: ReactNode; 
  transitionKey: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
