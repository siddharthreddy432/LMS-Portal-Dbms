import React from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, MessageSquareHeart } from 'lucide-react';

export default function Contact() {
 return (
 <div className="py-12 md:py-20 relative z-10 px-4">
 <div className="max-w-2xl mx-auto">
 {/* Header */}
 <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12">
 <motion.div 
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 300, damping: 20 }}
 className="w-16 h-16 bg-brand-yellow text-black rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 sticker-shadow"
 >
 <MessageSquareHeart size={32} />
 </motion.div>
 <div className="space-y-2 relative">
 <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)]">
 Contact <span className="marker-underline z-10 relative">Me</span>
 </h1>
 <p className="text-[var(--text-secondary)] max-w-md mx-auto font-medium">
 Running into any issues or have a suggestion? Feel free to reach out to me!
 </p>
 </div>
 </div>

 {/* Card */}
 <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 p-8 rounded-3xl paper-edge sticker-shadow relative text-[var(--text-primary)]">
 {/* Decorative Tape */}
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-brand-pink/80 backdrop-blur-sm shadow-sm -rotate-2 z-20"></div>
 
 <div className="flex flex-col gap-6 pt-4">
 <a 
 href="mailto:siddharthreddy432@gmail.com" 
 className="flex items-center gap-4 p-4 rounded-2xl border-2 border-black dark:border-white/10 bg-[#F8F9FA] dark:bg-[#18181b] hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue dark:hover:text-white transition-colors group sticker-shadow-sm hover:sticker-shadow-hover"
 >
 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 text-brand-blue group-hover:bg-white/20 group-hover:text-white rounded-xl border-2 border-black dark:border-white/10 group-hover:border-white/20 flex items-center justify-center">
 <Mail size={24} />
 </div>
 <div>
 <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-white/80">Email</p>
 <p className="font-black text-lg text-[var(--text-primary)] group-hover:text-white">siddharthreddy432@gmail.com</p>
 </div>
 </a>

 <a 
 href="https://linkedin.com/in/venkat-siddharth-reddy-moku-7227983a9/" 
 target="_blank" rel="noreferrer"
 className="flex items-center gap-4 p-4 rounded-2xl border-2 border-black dark:border-white/10 bg-[#F8F9FA] dark:bg-[#18181b] hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] dark:hover:text-white transition-colors group sticker-shadow-sm hover:sticker-shadow-hover"
 >
 <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/40 text-[#0077b5] dark:text-[#38bdf8] group-hover:bg-white/20 group-hover:text-white rounded-xl border-2 border-black dark:border-white/10 group-hover:border-white/20 flex items-center justify-center">
 <Linkedin size={24} />
 </div>
 <div>
 <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-white/80">LinkedIn</p>
 <p className="font-black text-lg line-clamp-1 text-[var(--text-primary)] group-hover:text-white">venkat-siddharth-reddy-moku</p>
 </div>
 </a>

 <a 
 href="https://github.com/siddharthreddy432" 
 target="_blank" rel="noreferrer"
 className="flex items-center gap-4 p-4 rounded-2xl border-2 border-black dark:border-white/10 bg-[#F8F9FA] dark:bg-[#18181b] hover:bg-black dark:hover:bg-zinc-800 hover:text-white transition-colors group sticker-shadow-sm hover:sticker-shadow-hover"
 >
 <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 group-hover:bg-white/20 group-hover:text-white rounded-xl border-2 border-black dark:border-white/10 group-hover:border-white/20 flex items-center justify-center">
 <Github size={24} />
 </div>
 <div>
 <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-white/80">GitHub</p>
 <p className="font-black text-lg text-[var(--text-primary)] group-hover:text-white">siddharthreddy432</p>
 </div>
 </a>
 </div>
 </div>
 </div>
 </div>
 );
}
