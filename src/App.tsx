import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import MyCourses from './pages/MyCourses';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
 const location = useLocation();
 
 return (
 <AnimatePresence mode="wait">
 <Routes location={location} key={location.pathname}>
 <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
 <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
 <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
     <Route path="/courses" element={<ProtectedRoute><PageTransition><MyCourses /></PageTransition></ProtectedRoute>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
 <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
 </Routes>
 </AnimatePresence>
 );
}

export default function App() {
 return (
 <ThemeProvider>
 <LoadingProvider>
 <AuthProvider>
 <Router>
 <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-brand-yellow selection:text-black transition-colors duration-200">
 <Navigation />
 <main className="flex-1">
 <AnimatedRoutes />
 </main>
 </div>
 </Router>
 </AuthProvider>
 </LoadingProvider>
 </ThemeProvider>
 );
}
