import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface ThemeSelectorProps {
 className?: string;
 variant?: 'compact' | 'expanded';
}

export default function ThemeSelector({ className, variant = 'compact' }: ThemeSelectorProps) {
 const { theme, setTheme, toggleTheme } = useTheme();
 const isDark = theme === 'dark';

 if (variant === 'expanded') {
 return (
 <div className={cn("flex flex-col gap-2.5", className)}>
 <div className="flex items-center justify-between">
 <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
 <Sparkles size={13} className="text-brand-yellow" />
 Appearance
 </span>
 <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-pink/15 text-brand-pink border border-brand-pink/30">
 {isDark ? 'Dark Mode' : 'Light Mode'}
 </span>
 </div>
 <div className="grid grid-cols-2 gap-2.5 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-white/20 sticker-shadow-sm">
 {/* Light button */}
 <button
 type="button"
 onClick={() => setTheme('light')}
 className={cn(
 "relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-black text-xs transition-all duration-200 select-none",
 !isDark
 ? "bg-brand-yellow text-black border-2 border-black sticker-shadow-sm font-extrabold"
 : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 border-2 border-transparent"
 )}
 >
 <Sun size={17} className={cn("transition-transform duration-300", !isDark ? "rotate-45 scale-110" : "opacity-60")} />
 <span>Light</span>
 </button>
 {/* Dark button */}
 <button
 type="button"
 onClick={() => setTheme('dark')}
 className={cn(
 "relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-black text-xs transition-all duration-200 select-none",
 isDark
 ? "bg-brand-purple text-white border-2 border-black sticker-shadow-sm font-extrabold"
 : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 border-2 border-transparent"
 )}
 >
 <Moon size={16} className={cn("transition-transform duration-300", isDark ? "-rotate-12 scale-110 text-white" : "opacity-60")} />
 <span>Dark</span>
 </button>
 </div>
 </div>
 );
 }

 // Compact playful sliding switch with neo-brutalist pill geometry
 return (
 <button
 type="button"
 onClick={toggleTheme}
 title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
 aria-label={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
 className={cn(
 "relative w-[68px] h-9 p-1 rounded-full border-2 border-black dark:border-white/20",
 "bg-[#93C5FD] dark:bg-slate-800", // Tailwind blue-300 for a bright sky in light mode
 "sticker-shadow-sm hover:sticker-shadow-hover active:translate-y-0.5",
 "flex items-center cursor-pointer select-none overflow-hidden transition-colors duration-500 flex-shrink-0 group",
 className
 )}
 >
 {/* Background track static icons */}
 <div className="absolute inset-0 px-[7px] flex items-center justify-between pointer-events-none">
 <Sun 
 size={14} 
 className={cn(
 "transition-all duration-500 drop-shadow-sm",
 !isDark 
 ? "opacity-0 -translate-x-3 rotate-[-45deg] text-amber-500 scale-50" 
 : "opacity-100 translate-x-0 rotate-0 text-amber-400 scale-100"
 )} 
 />
 <Moon 
 size={13} 
 className={cn(
 "transition-all duration-500 drop-shadow-sm",
 isDark 
 ? "opacity-0 translate-x-3 rotate-45 text-sky-200 scale-50" 
 : "opacity-100 translate-x-0 rotate-0 text-slate-700 dark:text-slate-400 scale-100"
 )} 
 />
 </div>

 {/* Butter-smooth sliding circular badge */}
 <div
 style={{ transform: `translateX(${isDark ? 32 : 0}px)`, transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
 className={cn(
 "w-6 h-6 rounded-full border-2 border-black flex items-center justify-center relative z-10",
 isDark 
 ? "bg-slate-200 text-slate-800 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1)]" 
 : "bg-brand-yellow text-black shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1)]"
 )}
 >
 {isDark ? (
 <Moon size={11} className="fill-current text-slate-800" />
 ) : (
 <Sun size={12} className="font-extrabold fill-current text-black" />
 )}
 </div>
 </button>
 );
}
