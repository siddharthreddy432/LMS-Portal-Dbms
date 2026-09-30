import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
 if (!loading && !user) {
 navigate('/login', { state: { from: location }, replace: true });
 }
 }, [user, loading, navigate, location]);

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
 </div>
 );
 }

 if (!user) {
 return null; // Will redirect in useEffect
 }

 return <>{children}</>;
}
