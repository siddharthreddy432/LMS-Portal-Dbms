import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Skull } from 'lucide-react';

export default function NotFound() {
 return (
 <div className="min-h-[80vh] flex items-center justify-center p-4 relative z-10">
 <div className="text-center max-w-md w-full">
 <motion.div 
 initial={{ scale: 0, rotate: -20 }}
 animate={{ scale: 1, rotate: 0 }}
 transition={{ type: "spring", stiffness: 200, damping: 15 }}
 className="w-24 h-24 bg-brand-red text-white rounded-3xl mx-auto flex items-center justify-center mb-8 border-4 border-black sticker-shadow shadow-lg transform -rotate-6"
 >
 <Skull size={48} />
 </motion.div>
 
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="space-y-4"
 >
 <h1 className="text-7xl font-black text-[var(--text-primary)] tracking-tighter">
 404
 </h1>
 <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-wide">
 Page Not Found
 </h2>
 <p className="text-[var(--text-secondary)] font-medium mb-8">
 The page you are looking for has bunked the class or doesn't exist anymore.
 </p>
 
 <Link 
 to="/"
 className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl border-2 border-black sticker-shadow-sm hover:sticker-shadow-hover transition-all active:translate-y-1"
 >
 <ArrowLeft size={18} />
 Back to Home
 </Link>
 </motion.div>
 </div>
 </div>
 );
}
