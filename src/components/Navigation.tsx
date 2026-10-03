import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Calculator, CalendarDays, Menu, LogOut, LogIn, X, Home, Table, MessageSquareHeart, LayoutDashboard, Gamepad2, GraduationCap, Bot, ExternalLink, Globe, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import ThemeSelector from './ThemeSelector';

export default function Navigation() {
 const location = useLocation();
 const navigate = useNavigate();
 const { user, logout, loading } = useAuth();
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 const links = [
    { name: 'Home', path: '/', icon: <Home size={17} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={17} /> },
    { name: 'My Courses', path: '/courses', icon: <BookOpen size={17} /> },
    { name: 'Lecturers', path: '/lecturers', icon: <GraduationCap size={17} /> },
    { name: 'Help Desk', path: '/help-desk', icon: <Bot size={17} /> },
    { name: 'New ERP', path: 'https://klhunderground.ai.studio/', icon: <ExternalLink size={17} />, external: true },
    { name: 'Website', path: 'https://klh.edu.in/bachupally/', icon: <Globe size={17} />, external: true },
    { name: 'Contact', path: '/contact', icon: <MessageSquareHeart size={17} /> },
  ];

 const handleLogout = async () => {
 await logout();
 setMobileMenuOpen(false);
 navigate('/login');
 };

 return (
 <header className="sticky top-0 z-50 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] transition-colors duration-200">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
 
 {/* Logo */}
 <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
 <div className="w-8 h-8 bg-brand-yellow text-black border-2 border-black sticker-shadow-sm flex items-center justify-center font-display font-bold text-lg transform group-hover:-rotate-6 transition-transform">
 KLU
 </div>
 <span className="font-display font-extrabold text-xl tracking-tight text-[var(--text-primary)] hidden sm:inline-block">Underground</span>
 </Link>

 {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {links.map((link) => (
            link.external ? (
              <a 
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-xs xl:text-sm flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ) : (
              <Link 
                key={link.path}
                to={link.path}
                className={cn(
                  "font-bold text-xs xl:text-sm flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors relative",
                  location.pathname === link.path 
                    ? "text-brand-pink font-extrabold" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-[17px] left-2 right-2 h-1 bg-brand-pink rounded-full"
                  />
                )}
              </Link>
            )
          ))}
        </nav>

 {/* Right Actions - Desktop */}
 <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
 <ThemeSelector />
 
 {!loading && user ? (
 <div className="flex items-center gap-3">
 <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-black dark:border-white/20 sticker-shadow-sm bg-brand-blue text-white cursor-help shadow-inner" title={user.name}>
 <span className="font-bold text-xs uppercase">{user.name.substring(0, 2)}</span>
 </div>
 <button 
 onClick={handleLogout}
 className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)] hover:text-brand-red transition-colors whitespace-nowrap"
 >
 <LogOut size={16} />
 Logout
 </button>
 </div>
 ) : !loading ? (
 <Link to="/login" className="px-3.5 py-1.5 bg-brand-pink text-white border-2 border-black rounded-xl font-bold text-sm flex items-center gap-2 sticker-shadow-sm hover:sticker-shadow-hover transition-all whitespace-nowrap">
 <LogIn size={16} />
 Login
 </Link>
 ) : null}
 </div>

 {/* Mobile Menu Toggle */}
 <div className="flex items-center gap-2 lg:hidden">
 <ThemeSelector />
 <button 
 className="p-2 rounded-lg border-2 border-transparent text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 aria-label="Toggle navigation menu"
 >
 {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
 </button>
 </div>
 </div>

 {/* Mobile Menu Drawer */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden"
 >
 <div className="p-4 flex flex-col gap-4">
 <ThemeSelector variant="expanded" />
 
              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  link.external ? (
                    <a 
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-bold text-base flex items-center gap-3 p-3 rounded-xl transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-2 border-transparent"
                    >
                      {link.icon}
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "font-bold text-base flex items-center gap-3 p-3 rounded-xl transition-colors",
                        location.pathname === link.path 
                          ? "bg-brand-pink/15 text-brand-pink border-2 border-brand-pink/30" 
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border-2 border-transparent"
                      )}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  )
                ))}
              </nav>

 <div className="border-t border-[var(--border-subtle)] pt-4 mt-2">
 {!loading && user ? (
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black dark:border-white/20 sticker-shadow-sm bg-brand-blue text-white">
 <span className="font-bold text-sm uppercase">{user.name.substring(0, 2)}</span>
 </div>
 <span className="font-bold text-[var(--text-primary)]">{user.name}</span>
 </div>
 <button 
 onClick={handleLogout}
 className="p-2 text-[var(--text-secondary)] hover:text-brand-red transition-colors"
 >
 <LogOut size={20} />
 </button>
 </div>
 ) : !loading ? (
 <Link 
 to="/login" 
 onClick={() => setMobileMenuOpen(false)}
 className="w-full py-3 bg-brand-pink text-white border-2 border-black rounded-xl font-bold flex items-center justify-center gap-2 sticker-shadow-sm active:translate-y-1 transition-all"
 >
 <LogIn size={20} />
 Login
 </Link>
 ) : null}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </header>
 );
}
