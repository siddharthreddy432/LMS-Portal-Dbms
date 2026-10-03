import React from 'react';
import { motion } from 'motion/react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ 
        duration: 0.16,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="w-full h-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}
