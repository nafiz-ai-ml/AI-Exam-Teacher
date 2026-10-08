'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onToggleSidebar?: () => void;
  showNewAction?: boolean;
}

export function AppHeader({
  title = 'ড্যাশবোর্ড',
  subtitle,
  breadcrumbs,
  onToggleSidebar,
  showNewAction = true,
}: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'টি';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Titles */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-0.5">
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-slate-400">/</span>}
                  {b.href ? (
                    <Link
                      href={b.href}
                      className="hover:text-slate-800 transition-colors truncate"
                    >
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-slate-700 font-medium truncate">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <span className="text-xs text-slate-500 hidden sm:inline-block border-l border-slate-200 pl-2">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center space-x-3 shrink-0">
        {showNewAction && (
          <Link
            href="/evaluations/new"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-sm transition-all shadow-emerald-700/20 hover:shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">নতুন মূল্যায়ন</span>
          </Link>
        )}

        {/* User Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div
            title={user?.email || 'শিক্ষক'}
            className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs select-none"
          >
            {userInitial}
          </div>
          <button
            onClick={signOut}
            title="সাইন আউট করুন"
            className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            aria-label="সাইন আউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
