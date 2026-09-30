import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2 } from 'lucide-react';

export default function MyCourses() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1B1F26] rounded-3xl p-8 border-2 border-black dark:border-white/10 sticker-shadow-sm text-center"
      >
        <div className="w-16 h-16 bg-brand-yellow text-black border-2 border-black rounded-2xl flex items-center justify-center sticker-shadow-sm mx-auto mb-6 transform -rotate-3">
          <Gamepad2 size={32} />
        </div>
        <h1 className="text-3xl font-black font-display mb-4 text-[var(--text-primary)]">My Courses</h1>
        <p className="text-[var(--text-secondary)] font-medium max-w-lg mx-auto">
          This section is currently under development. Soon you'll be able to view all your enrolled courses and materials here.
        </p>
      </motion.div>
    </div>
  );
}
