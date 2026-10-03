import { safeStorage } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle, RefreshCw, Wand2 } from 'lucide-react';

export default function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [solvingCaptcha, setSolvingCaptcha] = useState(false);

  const { login } = useAuth();
  const { showLoader, hideLoader } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const fetchCaptcha = async () => {
    try {
      setCaptchaImage('');
      setCaptchaValue('');
      const res = await fetch('/api/auth/captcha', { credentials: 'same-origin' });
      const data = await res.json();

      if (data.image) {
        setCaptchaImage(data.image);
      } else {
        setError(data.error || 'Failed to load captcha. Please try again.');
      }

      if (data.sessionId) {
        safeStorage.setItem('kl_session_id', data.sessionId);
      }
    } catch (err) {
      console.error("Failed to fetch captcha", err);
      setError("Failed to connect to the server. Please check your network.");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!captchaValue) {
      setError('Please enter the captcha.');
      return;
    }

    setLoading(true);
    showLoader("Authenticating", "Connecting securely to KL ERP...");
    setError('');
    const t0 = performance.now();

    try {
      const currentSessionId = safeStorage.getItem('kl_session_id') || '';
      const response = await fetch('/api/auth/login', {
        credentials: 'same-origin',
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': currentSessionId,
          'x-device-id': safeStorage.getItem('kl_device_id') || deviceId
        },
        body: JSON.stringify({ 
          username: studentId.trim(), 
          password, 
          captcha: captchaValue, 
          sessionId: currentSessionId,
          deviceId: safeStorage.getItem('kl_device_id') || deviceId
        }),
      });

      const data = await response.json();

      if (data.needsCaptchaRetry) {
        setError(data.message);
        setDeviceId(data.deviceId || '');
        await fetchCaptcha();
      } else if (data.success) {
        if (data.sessionId) safeStorage.setItem('kl_session_id', data.sessionId);
        if (data.csrfToken) safeStorage.setItem('kl_csrf_token', data.csrfToken);
        if (data.deviceId) safeStorage.setItem('kl_device_id', data.deviceId);
        if (data.initialDashboard) {
          safeStorage.setItem('klu_initial_dashboard', JSON.stringify(data.initialDashboard));
        }

        login(data.user, rememberMe);
        navigate('/dashboard', { state: { initialDashboard: data.initialDashboard } });
      } else {
        setError(data.error || data.message || 'Login failed');
        await fetchCaptcha();
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute top-20 -left-20 w-64 h-64 bg-brand-pink/10 rounded-full filter blur-3xl opacity-60 animate-blob pointer-events-none"></div>
      <div className="absolute -bottom-32 right-20 w-64 h-64 bg-brand-yellow/10 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[425px] bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl px-6 py-8 sm:px-9 sm:py-10 sticker-shadow paper-edge relative z-10 shadow-xl transition-colors duration-200"
      >
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-brand-blue border-2 border-black rounded-2xl flex items-center justify-center sticker-shadow-sm mx-auto mb-3.5 transform -rotate-3 shadow-md">
            <Lock size={26} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1.5 text-[var(--text-primary)] tracking-tight">
            Welcome Back.
          </h1>
          <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] px-3 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 border border-black/10 dark:border-white/10 inline-block">
            KL Portal Access
          </span>
        </div>

        <AnimatePresence>
          {(error || message) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="p-3.5 bg-brand-red text-white border-2 border-black rounded-xl font-bold flex items-center gap-2 sticker-shadow-sm animate-shake text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error || message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
              Student ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-brand-pink transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-black dark:border-white/15 bg-white dark:bg-[#171A20] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-3 focus:ring-brand-blue/30 focus:border-brand-blue transition-all outline-none font-bold text-sm"
                placeholder="e.g. 21BCE0001"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] block mb-1.5">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-brand-pink transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-black dark:border-white/15 bg-white dark:bg-[#171A20] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-3 focus:ring-brand-blue/30 focus:border-brand-blue transition-all outline-none font-bold text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                Captcha Security Code
              </label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={fetchCaptcha}
                  className="text-[11px] font-black text-brand-blue hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1 bg-brand-blue/15 px-2 py-0.5 rounded transition-colors"
                >
                  <RefreshCw size={12} />
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="flex gap-2.5">
              <div className="w-1/2 h-12 bg-white rounded-xl border-2 border-black dark:border-white/15 overflow-hidden flex items-center justify-center relative p-1 shadow-inner">
                {captchaImage ? (
                  <img src={captchaImage} alt="captcha" className="w-full h-full object-contain" />
                ) : (
                  <Loader2 className="animate-spin text-gray-600" size={18} />
                )}
              </div>
              <input
                type="text"
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
                className="w-1/2 px-3 py-2.5 rounded-xl border-2 border-black dark:border-white/15 bg-white dark:bg-[#171A20] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-3 focus:ring-brand-blue/30 focus:border-brand-blue transition-all outline-none font-black text-base text-center tracking-widest uppercase"
                placeholder="-------"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer appearance-none w-4 h-4 border-2 border-black dark:border-white/20 rounded bg-white dark:bg-[#171A20] checked:bg-brand-blue dark:checked:bg-brand-blue transition-colors cursor-pointer" 
                />
                <div className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white">
                  <svg width="10" height="8" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 5.5L5 9L12.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="font-bold text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                Remember Me
              </span>
            </label>
            
            <a href="#" className="font-bold text-xs text-brand-blue hover:underline">
              Need Help?
            </a>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border-2 border-black sticker-shadow-sm hover:sticker-shadow-hover active:translate-x-0.5 active:translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </div>
          
          <div className="pt-3 border-t border-black/10 dark:border-white/10 text-center">
            <p className="text-[11px] font-semibold text-[var(--text-secondary)] leading-relaxed">
              University ERP System • Secure Authentication
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
