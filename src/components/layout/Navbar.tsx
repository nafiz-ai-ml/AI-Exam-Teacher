'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  GraduationCap,
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  HelpCircle,
  FileCheck2,
  Cpu,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route changes or resize
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  const navLinks = [
    { label: 'কীভাবে কাজ করে', href: '#how-it-works', icon: Cpu },
    { label: 'মূল বৈশিষ্ট্য', href: '#features', icon: Layers },
    { label: 'নমুনা মূল্যায়ন', href: '#preview', icon: FileCheck2 },
    { label: 'শিক্ষক দর্শন', href: '#philosophy', icon: HeartHandshake },
    { label: 'সাধারণ জিজ্ঞাসা', href: '#faq', icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo & Name */}
            <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-900 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-950 transition-colors">
                <GraduationCap className="w-5 h-5 text-teal-400" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  শিক্ষক সহায়ক
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 inline text-teal-600" /> AI
                </span>
              </div>
            </Link>

            {/* Middle: Desktop Navigation Anchors */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-xs lg:text-sm font-medium text-slate-600">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-indigo-900 transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right: Desktop Auth / Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-900 text-white hover:bg-indigo-950 transition-all shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-300" />
                    <span>ড্যাশবোর্ড</span>
                  </Link>
                  <div
                    title={user.email || ''}
                    className="w-8 h-8 rounded-full bg-indigo-900 text-white font-bold flex items-center justify-center text-xs select-none shadow-xs"
                  >
                    {userInitial}
                  </div>
                  <button
                    onClick={signOut}
                    title="সাইন আউট"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/sign-in"
                    className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    সাইন ইন
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-900 text-white hover:bg-indigo-950 transition-all shadow-xs"
                  >
                    <span>শুরু করুন</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-xs cursor-pointer"
                aria-label="মেনু খুলুন"
              >
                <Menu className="w-5 h-5 text-slate-800" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Right side slide-in with animation) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] sm:w-[320px] bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div>
          <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-900 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-4.5 h-4.5 text-teal-300" />
              </div>
              <span className="font-bold text-slate-900 text-sm">শিক্ষক সহায়ক</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="মেনু বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Menu Items */}
          <nav className="p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              ন্যাভিগেশন
            </span>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-900 hover:bg-indigo-50/70 transition-colors"
                >
                  <Icon className="w-4 h-4 text-indigo-900" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom Auth Section */}

        <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
          {isLoading ? (
            <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5 px-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-900 truncate block">
                    {user.email}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium block">
                    লগইন অবস্থায় আছেন
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/60 bg-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>সাইন আউট</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                সাইন ইন করুন
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <span>অ্যাকাউন্ট তৈরি করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
