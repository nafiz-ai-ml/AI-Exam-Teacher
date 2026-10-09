'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  FileCheck2,
  PlusCircle,
  Files,
  Users,
  LogOut,
  GraduationCap,
  Sparkles,
  X,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const { user, signOut } = useAuth();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'টি';

  const navItems = [
    {
      group: 'প্রধান কর্মক্ষেত্র',
      items: [
        {
          label: 'ড্যাশবোর্ড',
          href: '/dashboard',
          icon: LayoutDashboard,
          isActive: pathname === '/dashboard' && !mode,
        },
        {
          label: 'একক মূল্যায়ন',
          href: '/evaluations/new',
          icon: PlusCircle,
          isActive: pathname === '/evaluations/new' && mode !== 'batch',
          isHighlight: true,
        },
        {
          label: 'ব্যাচ মূল্যায়ন (বহু শিক্ষার্থী)',
          href: '/evaluations/new?mode=batch',
          icon: Users,
          isActive: pathname === '/evaluations/new' && mode === 'batch',
        },
      ],
    },
    {
      group: 'রেকর্ড ও ইতিহাস',
      items: [
        {
          label: 'সকল খাতার তালিকা',
          href: '/dashboard#history',
          icon: Files,
          isActive: false,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Close Button */}
        <div>
          <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-900 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-950 transition-colors">
                <GraduationCap className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 tracking-tight block leading-tight">
                  শিক্ষক সহায়ক
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 inline text-teal-600" /> সৃজনশীল AI
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              aria-label="মেনু বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6">
            {navItems.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                  {sec.group}
                </span>

                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.isActive;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => onClose()}
                        className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-50 text-indigo-950 font-semibold border border-indigo-100 shadow-xs'
                            : item.isHighlight
                            ? 'text-indigo-900 hover:bg-indigo-50/60 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 mr-2.5 shrink-0 ${
                            active ? 'text-indigo-900' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex items-center space-x-3 px-1">
            <div className="w-9 h-9 rounded-full bg-indigo-900 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 truncate block">
                {user?.email || 'শিক্ষক একাউন্ট'}
              </span>
              <span className="text-[11px] text-teal-700 font-medium block">
                যাচাইকৃত শিক্ষক
              </span>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 bg-white transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>সাইন আউট করুন</span>
          </button>
        </div>
      </aside>
    </>
  );
}
