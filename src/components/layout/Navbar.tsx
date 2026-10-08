'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, GraduationCap, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();

  // Hide on app dashboard, evaluation pages, and dedicated auth pages
  const isAppOrAuthRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/evaluations') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up');

  if (isAppOrAuthRoute) {
    return null;
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'টি';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                শিক্ষক সহায়ক
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" /> AI
              </span>
            </div>
          </Link>

          {/* Middle: Navigation Anchors for Landing Page */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a
              href="#how-it-works"
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              কীভাবে কাজ করে
            </a>
            <a
              href="#features"
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              মূল বৈশিষ্ট্য
            </a>
            <a
              href="#preview"
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              নমুনা মূল্যায়ন
            </a>
            <a
              href="#philosophy"
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              শিক্ষক দর্শন
            </a>
          </nav>

          {/* Right: Auth Links or Dashboard Link */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-700/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>ড্যাশবোর্ড</span>
                </Link>
                <div
                  title={user.email || ''}
                  className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs select-none shadow-xs"
                >
                  {userInitial}
                </div>
                <button
                  onClick={signOut}
                  title="সাইন আউট"
                  className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/sign-in"
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-700/20 hover:shadow-md"
                >
                  <span>শুরু করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
