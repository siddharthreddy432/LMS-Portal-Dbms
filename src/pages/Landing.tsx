import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, PieChart, Calculator, Calendar, Bell, Github, Linkedin } from 'lucide-react';

export default function Landing() {
 return (
 <div className="relative overflow-hidden min-h-[85vh]">
 
 {/* Abstract Background Shapes */}
 <div className="absolute top-20 -left-20 w-64 h-64 bg-brand-pink/10 rounded-full filter blur-3xl opacity-60 animate-blob pointer-events-none"></div>
 <div className="absolute top-20 -right-20 w-64 h-64 bg-brand-yellow/10 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000 pointer-events-none"></div>
 <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-brand-blue/10 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-4000 pointer-events-none"></div>

 <div className="max-w-7xl mx-auto px-4 pt-16 md:pt-20 pb-12 relative z-10">
 
 {/* Hero Section */}
 <div className="text-center max-w-4xl mx-auto space-y-8">
 
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black dark:border-white/15 bg-white dark:bg-[#15181D] text-[var(--text-primary)] sticker-shadow-sm rotate-2 mb-4"
 >
 <Sparkles size={16} className="text-brand-orange" />
 <span className="font-bold text-sm">The Modern Student Portal</span>
 </motion.div>

 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-6xl md:text-8xl font-black leading-tight text-[var(--text-primary)]"
 >
 Don't build <br/>
 another <span className="marker-underline z-10 relative">boring</span> LMS.
 </motion.h1>

 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto"
 >
 Experience a student portal that feels like a premium creative product. Manage your attendance, subjects, and analytics in style.
 </motion.p>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
 >
 
 </motion.div>
 </div>

 {/* Features Section */}
 <div className="mt-32 md:mt-40">
 <div className="text-center mb-16">
 <h2 className="text-4xl md:text-5xl font-black mb-4 text-[var(--text-primary)]">Everything you need. <br/> <span className="text-brand-purple">Nothing you don't.</span></h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <FeatureCard 
 title="Attendance Dashboard" 
 desc="Visualize your attendance with beautiful rings, trends, and weekly summaries." 
 icon={<PieChart size={32} />} 
 color="bg-brand-pink text-white" 
 delay={0.1}
 link="/dashboard"
 />
 <FeatureCard 
 title="Smart Calculator" 
 desc="Calculate your LTPS percentages and know exactly how many classes you can bunk." 
 icon={<Calculator size={32} />} 
 color="bg-brand-yellow text-black" 
 delay={0.2}
 link="/calculators"
 />
 <FeatureCard 
 title="Timetable & Schedule" 
 desc="Your daily classes presented in a clean, modern layout with sticky notes." 
 icon={<Calendar size={32} />} 
 color="bg-brand-green text-black" 
 delay={0.3}
 link="/timetable"
 />
 <FeatureCard 
 title="Real-time Alerts" 
 desc="Get notified when you are falling behind your target percentage." 
 icon={<Bell size={32} />} 
 color="bg-brand-orange text-black" 
 delay={0.4}
 link="/dashboard"
 />
 </div>
 </div>

 {/* Footer */}
 <footer className="mt-20 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
 <div className="font-bold text-[var(--text-secondary)] text-center md:text-left text-sm">
 Built by Venkat Siddharth Reddy Moku
 </div>
 <div className="flex items-center justify-center gap-4">
 <a 
 href="https://github.com/siddharthreddy432" 
 target="_blank" 
 rel="noopener noreferrer"
 className="flex items-center justify-center w-12 h-12 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/15 rounded-full sticker-shadow-sm hover:sticker-shadow-hover hover:-translate-y-1 transition-all text-[var(--text-primary)] hover:text-brand-purple"
 aria-label="GitHub Profile"
 >
 <Github size={22} />
 </a>
 <a 
 href="https://www.linkedin.com/in/venkat-siddharth-reddy-moku-7227983a9/" 
 target="_blank" 
 rel="noopener noreferrer"
 className="flex items-center justify-center w-12 h-12 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/15 rounded-full sticker-shadow-sm hover:sticker-shadow-hover hover:-translate-y-1 transition-all text-[var(--text-primary)] hover:text-brand-blue"
 aria-label="LinkedIn Profile"
 >
 <Linkedin size={22} />
 </a>
 </div>
 </footer>
 </div>
 </div>
 );
}

function FeatureCard({ title, desc, icon, color, delay, link }: { title: string, desc: string, icon: React.ReactNode, color: string, delay: number, link: string }) {
 return (
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay }}
 className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl sticker-shadow-sm hover:sticker-shadow-hover transition-all group cursor-pointer paper-edge"
 >
 <Link to={link} className="block p-8 h-full">
 <div className={`w-16 h-16 rounded-2xl border-2 border-black ${color} flex items-center justify-center mb-6 sticker-shadow-sm group-hover:-rotate-6 transition-transform shadow-md`}>
 {icon}
 </div>
 <h3 className="text-2xl font-black mb-3 text-[var(--text-primary)]">{title}</h3>
 <p className="text-[var(--text-secondary)] font-medium text-lg mb-6">{desc}</p>
 
 <div className="inline-flex items-center gap-2 font-bold text-[var(--text-primary)] border-b-2 border-transparent group-hover:border-current transition-colors pb-1">
 Explore feature <ArrowRight size={16} />
 </div>
 </Link>
 </motion.div>
 );
}
