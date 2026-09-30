import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export type Theme = 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
 theme: Theme;
 resolvedTheme: ResolvedTheme;
 setTheme: (theme: Theme) => void;
 toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'klh-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
 const [theme, setThemeState] = useState<Theme>(() => {
 try {
 const stored = localStorage.getItem(THEME_STORAGE_KEY);
 if (stored === 'light' || stored === 'dark') {
 return stored;
 }
 if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
 return 'dark';
 }
 } catch {
 // fallback
 }
 return 'dark';
 });

 const [isTransitioning, setIsTransitioning] = useState(false);
 const resolvedTheme: ResolvedTheme = theme;

 // Apply theme to document
 useEffect(() => {
 const root = document.documentElement;

 if (theme === 'dark') {
 root.classList.add('dark');
 root.classList.remove('light');
 root.setAttribute('data-theme', 'dark');
 } else {
 root.classList.add('light');
 root.classList.remove('dark');
 root.setAttribute('data-theme', 'light');
 }

 try {
 localStorage.setItem(THEME_STORAGE_KEY, theme);
 } catch (e) {
 console.warn('Could not save theme to localStorage:', e);
 }
 }, [theme]);

 const changeThemeWithLoader = (newTheme: Theme) => {
 if (theme === newTheme) return;
 
 // Start transition
 setIsTransitioning(true);
 
 // Wait for the overlay to fully fade in (300ms)
 setTimeout(() => {
 setThemeState(newTheme);
 
 // Keep the overlay for a very brief moment to ensure DOM has updated
 setTimeout(() => {
 setIsTransitioning(false);
 }, 150); 
 }, 300);
 };

 const toggleTheme = () => {
 changeThemeWithLoader(theme === 'dark' ? 'light' : 'dark');
 };

 return (
 <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: changeThemeWithLoader, toggleTheme }}>
 {children}

 {/* Butter-smooth Fullscreen Loading Transition Overlay */}
 <AnimatePresence>
 {isTransitioning && (
 <motion.div
 initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
 animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
 exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
 transition={{ duration: 0.3, ease: 'easeInOut' }}
 className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 text-black dark:text-white"
 >
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.8, opacity: 0 }}
 transition={{ delay: 0.1, duration: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
 className="flex flex-col items-center gap-4"
 >
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
 className="relative flex items-center justify-center w-16 h-16"
 >
 {/* Custom neo-brutalist loading spinner */}
 <div className="absolute inset-0 border-4 border-dashed border-black dark:border-white rounded-full opacity-20"></div>
 <div className="absolute inset-0 border-4 border-solid border-transparent border-t-brand-purple dark:border-t-brand-yellow rounded-full"></div>
 <Sparkles className="absolute text-brand-purple dark:text-brand-yellow" size={24} />
 </motion.div>

 <h2 className="text-xl font-black tracking-tight font-display">
 Switching Reality...
 </h2>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </ThemeContext.Provider>
 );
}

export function useTheme() {
 const context = useContext(ThemeContext);
 if (!context) {
 throw new Error('useTheme must be used within a ThemeProvider');
 }
 return context;
}
