'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const isAppOrAuthRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/evaluations') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up');

  if (isAppOrAuthRoute) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">শিক্ষক সহায়ক</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              শিক্ষার্থীদের নিজস্ব ভাষায় লিখিত সৃজনশীল উত্তরের ধারণাগত মূল্যায়ন। মুখস্থ উত্তরের যান্ত্রিক মিল নয়, উত্তরের প্রকৃত গুণগত মান যাচাইয়ে শিক্ষকের ব্যক্তিগত সহায়ক।
            </p>
            <div className="flex items-center space-x-4 pt-1 text-xs text-emerald-400">
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                ধারণাগত মূল্যায়ন
              </span>
              <span className="flex items-center">
                <HeartHandshake className="w-3.5 h-3.5 mr-1" />
                চূড়ান্ত সিদ্ধান্ত শিক্ষকের
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              ন্যাভিগেশন
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  কীভাবে কাজ করে
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  মূল বৈশিষ্ট্য
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors">
                  নমুনা মূল্যায়ন
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-white transition-colors">
                  শিক্ষক দর্শন
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Teacher Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              শিক্ষক পোর্টাল
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sign-in" className="hover:text-white transition-colors">
                  লগইন করুন
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-white transition-colors">
                  নতুন অ্যাকাউন্ট খুলুন
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  ড্যাশবোর্ডে প্রবেশ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} শিক্ষক সহায়ক — শিক্ষকের জন্য নির্মিত ব্যক্তিগত টুল।</p>
          <p className="text-slate-400">
            AI শুধুমাত্র বিশ্লেষণমূলক সহায়তা প্রদান করে, মূল্যায়নের চূড়ান্ত কর্তৃত্ব সর্বদা শিক্ষকের।
          </p>
        </div>
      </div>
    </footer>
  );
}
