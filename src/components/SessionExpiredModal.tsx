import React from 'react';
import { motion } from 'motion/react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
 isOpen: boolean;
}

export default function SessionExpiredModal({ isOpen }: Props) {
 const navigate = useNavigate();
 const { logout } = useAuth();

 if (!isOpen) return null;

 const handleLogin = async () => {
 await logout();
 navigate('/login', { state: { message: 'Session expired. Please login again.' } });
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/15 rounded-2xl p-6 sm:p-8 max-w-md w-full sticker-shadow-sm text-center flex flex-col items-center gap-4 text-[var(--text-primary)]"
 >
 <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-2">
 <AlertCircle size={32} />
 </div>
 
 <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
 Session Expired
 </h2>
 
 <p className="text-[var(--text-secondary)] font-medium text-sm mb-4 leading-relaxed">
 For your security, your connection to the KLU ERP has timed out after a period of inactivity. Please log in again to continue.
 </p>

 <button
 onClick={handleLogin}
 className="w-full py-3.5 bg-brand-blue hover:bg-blue-600 text-white border-2 border-black rounded-xl font-bold flex items-center justify-center gap-2 sticker-shadow-sm transition-all"
 >
 <LogIn size={18} />
 Secure Login
 </button>
 </motion.div>
 </div>
 );
}
