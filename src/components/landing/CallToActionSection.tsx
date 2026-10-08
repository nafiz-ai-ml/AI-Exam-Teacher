'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

export function CallToActionSection() {
  const { user } = useAuth();

  return (
    <section className="py-20 sm:py-28 bg-radial from-emerald-50/70 via-slate-50 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-semibold shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>আপনার পাঠদান ও মূল্যায়নের অভিজ্ঞতা আরও গতিশীল করুন</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          আজই আপনার প্রথম সৃজনশীল খাতা মূল্যায়ন শুরু করুন
        </h2>

        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          কোনো সাবস্ক্রিপশন জটিলতা নেই। শিক্ষকের ব্যক্তিগত সুবিধার্থে নির্মিত প্ল্যাটফর্মে সাইন আপ করে শিক্ষার্থীদের নিজস্ব ভাষায় লেখা উত্তর যাচাই করুন।
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href={user ? '/dashboard' : '/sign-up'}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-sm sm:text-base bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all group"
          >
            <span>{user ? 'ড্যাশবোর্ডে যান' : 'মূল্যায়ন শুরু করুন'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {!user && (
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
