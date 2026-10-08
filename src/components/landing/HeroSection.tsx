'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  FileText,
  Brain,
  ShieldCheck,
  UserCheck,
  PenTool,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-radial from-emerald-50/50 via-slate-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Badge */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 text-xs sm:text-sm font-medium mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>শিক্ষকের ব্যক্তিগত AI মূল্যায়ন সহায়ক</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.2] sm:leading-[1.18]">
            খাতার উত্তর যাচাই করুন আরও দ্রুত,{' '}
            <span className="text-emerald-700 underline decoration-emerald-300 underline-offset-8">
              আরও নির্ভরযোগ্যভাবে
            </span>
          </h1>

          {/* Subtitle / Core value proposition */}
          <p className="mt-6 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            AI শিক্ষার্থীর নিজের ভাষায় লেখা উত্তর বুঝে প্রশ্নের চাহিদা, ধারণাগত সঠিকতা,
            উদ্দীপকের ব্যবহার এবং প্রয়োজনীয় ব্যাখ্যা বিশ্লেষণ করে সম্ভাব্য নম্বর প্রস্তাব করে।
          </p>

          {/* Philosophy reminder */}
          <div className="mt-4 inline-flex items-center space-x-2 text-xs sm:text-sm text-emerald-800 font-semibold bg-emerald-50 px-4 py-1.5 rounded-lg border border-emerald-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>AI মূল্যায়ন করে, চূড়ান্ত সিদ্ধান্ত শিক্ষক নেন।</span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href={user ? '/dashboard' : '/sign-up'}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all group"
            >
              <span>{user ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'মূল্যায়ন শুরু করুন'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs transition-all"
            >
              <span>কীভাবে কাজ করে দেখুন</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Visual Product Showcase (Section 9) */}
        <div className="mt-14 sm:mt-18 max-w-5xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Visual Header / Mock Browser Chrome */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="ml-2 font-mono text-[11px] text-slate-600 hidden sm:inline">
                  সৃজনশীল খাতা মূল্যায়ন ইঞ্জিন • ডেমো প্রিভিউ
                </span>
              </div>
              <div className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>রিয়েল-টাইম CQ এনালাইসিস</span>
              </div>
            </div>

            {/* Product Pipeline Diagram & Cards */}
            <div className="p-5 sm:p-8 space-y-6 bg-slate-50/50">
              {/* Pipeline Step Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ধাপ ১</span>
                    <strong className="text-slate-800 font-semibold text-xs">প্রশ্ন ও উদ্দীপক</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ধাপ ২</span>
                    <strong className="text-slate-800 font-semibold text-xs">হাতের লেখা উত্তর</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ধাপ ৩</span>
                    <strong className="text-slate-800 font-semibold text-xs">ধারণাগত বিশ্লেষণ</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 block font-semibold">ধাপ ৪</span>
                    <strong className="text-emerald-950 font-bold text-xs">শিক্ষকের চূড়ান্ত নম্বর</strong>
                  </div>
                </div>
              </div>

              {/* Realistic Evaluation Card Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Question & Student Handwritten Snippet */}
                <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                  <div>
                    <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mb-1.5">
                      প্রশ্ন (গ — প্রয়োগমূলক)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      উদ্দীপকের রফিকের আচরণের সাথে &apos;সততার পুরস্কার&apos; গল্পের কোন চরিত্রের মিল পাওয়া যায়? ব্যাখ্যা কর। [মান: ৩]
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="inline-block text-[11px] font-bold text-slate-700 mb-1.5">
                      শিক্ষার্থীর নিজের ভাষায় উত্তর (হাতে লেখা):
                    </span>
                    <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 font-serif text-xs text-slate-800 italic leading-relaxed">
                      &ldquo;উদ্দীপকের রফিক গরিব হওয়া সত্ত্বেও কুড়িয়ে পাওয়া টাকা ফেরত দিয়ে সততা দেখিয়েছে। গল্পের তৃতীয় অন্ধ ব্যক্তিটির মধ্যেও এই সততা ছিল, কারণ সে ফেরেশতার অনুগ্রহ স্বীকার করেছিল এবং কৃতজ্ঞ ছিল।&rdquo;
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      ✓ কোনো গাইড বইয়ের মুখস্থ হুবহু শব্দ নয়, নিজস্ব ভাষায় সারসংক্ষেপ।
                    </span>
                  </div>
                </div>

                {/* Right: AI Evaluation & Teacher Final Score */}
                <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                  {/* Analysis Breakdown */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                      <span className="text-xs font-bold text-slate-800">
                        AI ধারণাগত মূল্যায়ন ও প্রশ্নের চাহিদা পূরণ
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                        মিল: ১০০% (সঠিক জ্ঞান ও প্রয়োগ)
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-start space-x-1.5 text-emerald-800 bg-emerald-50/60 p-2 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>সঠিক ভাবার্থ:</strong> তৃতীয় অন্ধ ব্যক্তির সততা ও কৃতজ্ঞতাবোধকে উদ্দীপকের সাথে নির্ভুলভাবে যুক্ত করেছে।
                        </span>
                      </div>
                      <div className="flex items-start space-x-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>উন্নতির জায়গা:</strong> প্রথম দুই ব্যক্তির অকৃতজ্ঞতার বিপরীত তুলনাটি আরেকটু উল্লেখ করলে আরও চমৎকার হতো।
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dual Score Representation: AI vs Teacher */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        AI প্রস্তাবিত নম্বর
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-800">
                        ৩ / ৩ <span className="text-[11px] font-normal text-slate-500">(পূর্ণমান)</span>
                      </span>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-300 flex-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                        শিক্ষকের চূড়ান্ত সিদ্ধান্ত
                      </span>
                      <span className="text-base sm:text-lg font-black text-emerald-900">
                        ৩ / ৩ <span className="text-[11px] font-normal text-emerald-700">(অনুমোদিত)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
