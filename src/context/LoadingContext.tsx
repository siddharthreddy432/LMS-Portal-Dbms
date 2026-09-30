import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, CalendarDays, ClipboardCheck, LayoutDashboard, Calculator, FileText, Key, LucideIcon } from 'lucide-react';

interface LoadingState {
 isLoading: boolean;
 title: string;
 subtitle: string;
}

interface LoadingContextType {
 showLoader: (title: string, subtitle: string) => void;
 hideLoader: () => void;
 updateLoader: (title: string, subtitle: string) => void;
 isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Helper to determine loader configuration based on the title
const getLoaderConfig = (title: string): { icon: LucideIcon, textColor: string, bgColor: string, messages: string[] } => {
 const t = title.toLowerCase();
 
 if (t.includes('authentic')) {
 return {
 icon: Key,
 textColor: 'text-brand-pink',
 bgColor: 'bg-brand-pink',
 messages: [
 "Waking up the servers...",
 "Bypassing ERP mainframe...",
 "Connecting securely...",
 "Almost there..."
 ]
 };
 }

 if (t.includes('timetable')) {
 return {
 icon: CalendarDays,
 textColor: 'text-brand-purple',
 bgColor: 'bg-brand-purple',
 messages: [
 "Decrypting timetable...",
 "Finding free periods...",
 "Scanning for lunch breaks...",
 "Almost there..."
 ]
 };
 }

 if (t.includes('attendance') || t.includes('register')) {
 return {
 icon: ClipboardCheck,
 textColor: 'text-brand-orange',
 bgColor: 'bg-brand-orange',
 messages: [
 "Counting your bunks...",
 "Doing the math...",
 "Extracting attendance records...",
 "Almost there..."
 ]
 };
 }

 if (t.includes('dashboard')) {
 return {
 icon: LayoutDashboard,
 textColor: 'text-brand-blue',
 bgColor: 'bg-brand-blue',
 messages: [
 "Crunching the numbers...",
 "Preparing your overview...",
 "Fetching profile data...",
 "Almost there..."
 ]
 };
 }

 if (t.includes('calculat')) {
 return {
 icon: Calculator,
 textColor: 'text-brand-green',
 bgColor: 'bg-brand-green',
 messages: [
 "Reading image...",
 "Extracting table data...",
 "Crunching OCR data...",
 "Almost there..."
 ]
 };
 }

 if (t.includes('pdf')) {
 return {
 icon: FileText,
 textColor: 'text-brand-red',
 bgColor: 'bg-brand-red',
 messages: [
 "Generating document...",
 "Formatting pages...",
 "Preparing download...",
 "Almost there..."
 ]
 };
 }

 return {
 icon: GraduationCap,
 textColor: 'text-brand-pink',
 bgColor: 'bg-brand-pink',
 messages: [
 "Waking up the servers...",
 "Doing the math...",
 "Loading data...",
 "Almost there..."
 ]
 };
};

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 const [loadingState, setLoadingState] = useState<LoadingState>({
 isLoading: false,
 title: '',
 subtitle: '',
 });
 
 const [timer, setTimer] = useState<number>(0);
 const [progress, setProgress] = useState<number>(0);
 const showTimeRef = React.useRef<number>(0);
 const hideTimerRef = React.useRef<NodeJS.Timeout | null>(null);
 const finishTimerRef = React.useRef<NodeJS.Timeout | null>(null);

 useEffect(() => {
 let interval: NodeJS.Timeout;
 let progressInterval: NodeJS.Timeout;

 if (loadingState.isLoading) {
 interval = setInterval(() => {
 setTimer((prev) => prev + 1);
 }, 700);

 progressInterval = setInterval(() => {
 setProgress(p => {
 // Dynamic fast progress for reduced waiting time
 if (p < 50) return p + (Math.random() * 4 + 3); 
 if (p < 85) return p + (Math.random() * 2 + 1.5); 
 if (p < 96) return p + (Math.random() * 0.8 + 0.3); 
 if (p < 99) return p + 0.15;
 return p;
 });
 }, 30);
 } else {
 setTimer(0);
 setProgress(100);
 }

 return () => {
 clearInterval(interval);
 clearInterval(progressInterval);
 };
 }, [loadingState.isLoading]);

 const config = getLoaderConfig(loadingState.title);
 const currentMessageIndex = Math.min(timer, config.messages.length - 1);
 const currentSubtitle = config.messages[currentMessageIndex % config.messages.length];
 
 const ActiveIcon = config.icon;

 const showLoader = (title: string, subtitle: string) => {
 if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
 if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
 showTimeRef.current = Date.now();
 setLoadingState({ isLoading: true, title, subtitle });
 setTimer(0);
 setProgress(12);
 };

 const hideLoader = () => {
 if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
 if (finishTimerRef.current) clearTimeout(finishTimerRef.current);

 const elapsed = Date.now() - showTimeRef.current;
 const minDisplay = 400; // Snappy minimum display time to ensure smooth animation
 const wait = Math.max(0, minDisplay - elapsed);

 hideTimerRef.current = setTimeout(() => {
 setProgress(100);
 finishTimerRef.current = setTimeout(() => {
 setLoadingState(prev => ({ ...prev, isLoading: false }));
 setTimer(0);
 }, 160); // Crisp moment to view 100% completion before closing
 }, wait);
 };

 const updateLoader = (title: string, subtitle: string) => {
 setLoadingState(prev => ({ ...prev, title, subtitle }));
 };

 return (
 <LoadingContext.Provider value={{ showLoader, hideLoader, updateLoader, isLoading: loadingState.isLoading }}>
 {children}

 <AnimatePresence>
 {loadingState.isLoading && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 dark:bg-black/85 backdrop-blur-md"
 >
 <motion.div
 animate={{ 
 y: [0, -30, 0],
 rotate: [-5, 5, -5]
 }}
 transition={{ 
 duration: 1.5, 
 repeat: Infinity, 
 ease: "easeInOut" 
 }}
 className="w-24 h-24 bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/15 rounded-3xl flex items-center justify-center sticker-shadow mb-12 shadow-2xl"
 >
 <ActiveIcon size={48} className={config.textColor} />
 </motion.div>

 <motion.div 
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/15 p-6 rounded-3xl paper-edge sticker-shadow text-center max-w-sm w-full mx-4 relative shadow-2xl"
 >
 {/* Tape decoration */}
 <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-brand-blue/80 border-2 border-black rotate-2 z-10"></div>
 
 <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-3 font-display">
 {loadingState.title || "Loading..."}
 </h2>
 
 <div className="h-8 overflow-hidden relative">
 <AnimatePresence mode="wait">
 <motion.p
 key={currentSubtitle}
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: -20, opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="text-[var(--text-secondary)] font-bold text-lg absolute w-full text-center"
 >
 {currentSubtitle}
 </motion.p>
 </AnimatePresence>
 </div>
 </motion.div>

 {/* Progress Bar Floating Outside */}
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="mt-8 max-w-sm w-full px-4 flex flex-col items-center gap-3"
 >
 <div className="w-full h-4 bg-white dark:bg-[#15181D] rounded-full border-2 border-black dark:border-white/15 overflow-hidden relative sticker-shadow">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${Math.min(progress, 100)}%` }}
 transition={{ ease: "linear", duration: 0.05 }}
 className={`h-full border-r-2 border-black ${config.bgColor}`}
 />
 </div>
 <div className="font-bold text-[var(--text-primary)] text-sm bg-white dark:bg-[#1B1F26] px-4 py-1 rounded-full border-2 border-black dark:border-white/15 sticker-shadow-sm flex items-center justify-center min-w-[4rem]">
 {Math.min(Math.round(progress), 100)}%
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </LoadingContext.Provider>
 );
};

export const useLoading = () => {
 const context = useContext(LoadingContext);
 if (context === undefined) {
 throw new Error('useLoading must be used within a LoadingProvider');
 }
 return context;
};
