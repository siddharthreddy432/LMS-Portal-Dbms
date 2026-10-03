import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, GraduationCap, BookOpen, Layers } from 'lucide-react';

const ROUTE_LABELS: Record<string, { label: string; parent?: string }> = {
  '/dashboard': { label: 'Dashboard' },
  '/courses': { label: 'Courses & LMS' },
  '/help-desk': { label: 'Academic Help Desk' },
  '/ai-tutor': { label: 'Academic Help Desk' },
  '/lecturers': { label: 'Faculty Directory' },
  '/upload': { label: 'Upload Materials', parent: '/courses' },
  '/upload-material': { label: 'Upload Materials', parent: '/courses' },
  '/contact': { label: 'Support & Contact' },
  '/login': { label: 'Portal Login' },
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Don't show on root landing page
  if (pathname === '/') return null;

  const currentRoute = ROUTE_LABELS[pathname] || {
    label: pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-gray-200/80 dark:border-white/10 bg-white/70 dark:bg-[#15181E]/70 backdrop-blur-sm sticky top-16 z-30 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
        <ol className="flex items-center gap-1.5 flex-wrap">
          {/* Home */}
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1 font-medium"
            >
              <Home size={13} />
              <span>KLU Portal</span>
            </Link>
          </li>

          {/* Optional Parent Link */}
          {currentRoute.parent && (
            <>
              <li className="text-gray-400 dark:text-gray-600 select-none">
                <ChevronRight size={13} />
              </li>
              <li className="inline-flex items-center">
                <Link
                  to={currentRoute.parent}
                  className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
                >
                  {ROUTE_LABELS[currentRoute.parent]?.label || 'Parent'}
                </Link>
              </li>
            </>
          )}

          {/* Current Page */}
          <li className="text-gray-400 dark:text-gray-600 select-none">
            <ChevronRight size={13} />
          </li>
          <li className="inline-flex items-center font-semibold text-[var(--text-primary)]">
            <span aria-current="page">{currentRoute.label}</span>
          </li>
        </ol>

        {/* Academic context tag */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Semester II · Academic Year 2025-26</span>
        </div>
      </div>
    </nav>
  );
}
