import { safeStorage } from '../utils/storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SemesterOption {
 value: string;
 label: string;
}

export interface User {
 id: string;
 name: string;
 academicYears?: SemesterOption[];
 semesters?: SemesterOption[];
}

interface AuthContextType {
 user: User | null;
 loading: boolean;
 login: (user: User, rememberMe?: boolean) => void;
 logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const storedUser = safeStorage.getItem('klu_user');
 const lastActivity = safeStorage.getItem('klu_last_activity');

 if (storedUser) {
 const isRememberMe = safeStorage.getItem('klu_remember_me') === 'true';
 const timeoutLimit = isRememberMe ? 2592000000 : 1800000; // 30 days or 30 minutes
 if (lastActivity && Date.now() - parseInt(lastActivity, 10) > timeoutLimit) {
 // Silently logged out due to AFK before refresh
 safeStorage.removeItem('klu_user');
 safeStorage.removeItem('klu_last_activity');
 // Backend session is likely already expired or we don't care, we just don't set user
 } else {
 setUser(JSON.parse(storedUser));
 safeStorage.setItem('klu_last_activity', Date.now().toString());
 }
 }
 setLoading(false);
 }, []);

 const login = (userData: User, rememberMe: boolean = false) => {
 setUser(userData);
 safeStorage.setItem('klu_user', JSON.stringify(userData));
 safeStorage.setItem('klu_last_activity', Date.now().toString());
 if (rememberMe) {
 safeStorage.setItem('klu_remember_me', 'true');
 } else {
 safeStorage.removeItem('klu_remember_me');
 }
 };

 const logout = async () => {
 setUser(null);
 safeStorage.clearUserCaches();
 await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
 };

 const silentLogout = async () => {
 safeStorage.clearUserCaches();
 await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
 };

 useEffect(() => {
 if (!user) return;

 const updateActivity = () => {
 // Only update if we haven't silently logged out
 if (safeStorage.getItem('klu_user')) {
 safeStorage.setItem('klu_last_activity', Date.now().toString());
 }
 };

 const checkAfk = () => {
 const lastActivity = safeStorage.getItem('klu_last_activity');
 const isRememberMe = safeStorage.getItem('klu_remember_me') === 'true';
 const timeoutLimit = isRememberMe ? 2592000000 : 1800000;
 if (lastActivity && Date.now() - parseInt(lastActivity, 10) > timeoutLimit) {
 // Exceeded AFK limit. Silently logout in the background.
 silentLogout();
 }
 };

 let throttleTimeout: NodeJS.Timeout | null = null;
 const throttledUpdate = () => {
 if (!throttleTimeout) {
 updateActivity();
 throttleTimeout = setTimeout(() => {
 throttleTimeout = null;
 }, 1000);
 }
 };

 window.addEventListener('mousemove', throttledUpdate);
 window.addEventListener('keydown', throttledUpdate);
 window.addEventListener('scroll', throttledUpdate);
 window.addEventListener('click', throttledUpdate);

 const intervalId = setInterval(checkAfk, 5000);

 return () => {
 window.removeEventListener('mousemove', throttledUpdate);
 window.removeEventListener('keydown', throttledUpdate);
 window.removeEventListener('scroll', throttledUpdate);
 window.removeEventListener('click', throttledUpdate);
 clearInterval(intervalId);
 if (throttleTimeout) clearTimeout(throttleTimeout);
 };
 }, [user]);

 return (
 <AuthContext.Provider value={{ user, loading, login, logout } as any}>
 {children}
 </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (context === undefined) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
}
