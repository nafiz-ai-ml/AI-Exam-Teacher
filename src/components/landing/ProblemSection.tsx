import React from 'react';
import { Clock, BookOpen, SearchX, Split } from 'lucide-react';

export function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: 'খাতা দেখা অত্যন্ত সময়সাপেক্ষ',
      description:
        'প্রতিটি সৃজনশীল খাতা ৪টি অংশে (ক, খ, গ, ঘ) বিভক্ত থাকে। শত শত শিক্ষার্থীর দীর্ঘ বিশ্লেষণমূলক উত্তর পুঙ্খানুপুঙ্খ পড়ে মূল্যায়ন করা একাকী শিক্ষকের জন্য বিরাট মানসিক ও সময়ের চাপ তৈরি করে।',
      tag: 'সময়ের সংকট',
    },
    {
      icon: BookOpen,
      title: 'শিক্ষার্থীরা নিজের ভাষায় লেখে',
      description:
        'মেধাবী শিক্ষার্থীরা গাইড বা বইয়ের বাঁধাধরা লাইন মুখস্থ না করে নিজের ভাষায় ভাব প্রকাশ করে। প্রচলিত যান্ত্রিক পদ্ধতি বা সাধারণ কীওয়ার্ড সার্চ সেই ভাবার্থের গভীরতা ধরতে পারে না।',
      tag: 'ভাষাগত বৈচিত্র্য',
    },
    {
      icon: SearchX,
      title: 'শুধু Keyword দেখে মূল্যায়ন যথেষ্ট নয়',
      description:
        'উত্তরপত্রে নির্দিষ্ট শব্দ থাকলেই উত্তরটি সঠিক হয়েছে এমন নয়। শব্দের সঠিক ব্যবহার, প্রসঙ্গ এবং ধারণাগত সত্যতা যাচাই না করলে শিক্ষার্থী বঞ্চিত হতে পারে।',
      tag: 'যান্ত্রিক সীমাবদ্ধতা',
    },
    {
      icon: Split,
      title: 'গ ও ঘ অংশের বিশ্লেষণমূলক বিচার জটিল',
      description:
        'প্রয়োগ (গ) এবং উচ্চতর দক্ষতা (ঘ) প্রশ্নে উদ্দীপকের বাস্তব ঘটনার সঙ্গে পাঠ্যবইয়ের তত্ত্ব মেলাতে হয়। যুক্তির ধারাবাহিকতা এবং উদ্দীপক ব্যবহারের মাত্রা পরিমাপ করা সবচেয়ে কঠিন।',
      tag: 'বিশ্লেষণমূলক জটিলতা',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            শিক্ষকের বাস্তব চ্যালেঞ্জ
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            সৃজনশীল খাতা দেখার প্রচলিত চ্যালেঞ্জসমূহ
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            সৃজনশীল পরীক্ষা শুধু সঠিক উত্তর খোঁজা নয়—শিক্ষার্থীর চিন্তাশক্তি ও প্রয়োগক্ষমতা পরিমাপ করা। কিন্তু গতানুগতিক পদ্ধতিতে এটি করা কতটা কঠিন?
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-indigo-900 flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {prob.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {prob.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {prob.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
