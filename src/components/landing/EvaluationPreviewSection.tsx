import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, UserCheck, HelpCircle } from 'lucide-react';

export function EvaluationPreviewSection() {
  return (
    <section id="preview" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            বাস্তব উদাহরণ
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            একটি নমুনা মূল্যায়নের দৃশ্যপট
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            কীভাবে AI প্রশ্নের চাহিদা ও শিক্ষার্থীর উত্তরের তুলনামূলক বিশ্লেষণ রিপোর্ট তৈরি করে দেখুন।
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {/* Header info */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 block mb-1">
                  নমুনা সৃজনশীল প্রশ্ন • বাংলা ১ম পত্র (৭ম শ্রেণি)
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  অধ্যায়: সততার পুরস্কার — প্রশ্ন (গ) এর মূল্যায়ন বিবরণী
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full">
                  কনফিডেন্স: উচ্চ (High)
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Question Demand */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>প্রশ্নের মূল চাহিদা</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  উদ্দীপকের তথ্যের সঙ্গে পাঠ্যবইয়ের মূল ধারণার সম্পর্ক ব্যাখ্যা করা এবং চরিত্রের সাদৃশ্য নিরূপণ।
                </p>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    AI প্রস্তাবিত নম্বর
                  </span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">
                    ৩ / ৩
                  </div>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    পূর্ণ নম্বর সুপারিশ
                  </span>
                </div>

                <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block">
                    প্রশ্নের সাথে মিল
                  </span>
                  <div className="text-2xl font-black text-blue-950 mt-1">
                    ১০০%
                  </div>
                  <span className="text-[10px] text-blue-700 block mt-0.5">
                    ধারণাগত দিক থেকে সম্পূর্ণ সংগতিপূর্ণ
                  </span>
                </div>

                <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl">
                  <span className="text-[11px] font-bold text-purple-800 uppercase block">
                    শিক্ষকের চূড়ান্ত রিভিউ
                  </span>
                  <div className="text-2xl font-black text-purple-950 mt-1 flex items-center">
                    ৩ / ৩
                    <UserCheck className="w-5 h-5 ml-2 text-purple-600" />
                  </div>
                  <span className="text-[10px] text-purple-700 block mt-0.5">
                    শিক্ষক দ্বারা অনুমোদিত
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Correct Points */}
                <div className="bg-emerald-50/40 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>সঠিক হয়েছে</span>
                  </div>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>শিক্ষার্থী সততা ও কৃতজ্ঞতাবোধের মূল ধারণাকে চিহ্নিত করতে পেরেছে।</li>
                    <li>উদ্দীপকের চরিত্রের সাথে তৃতীয় অন্ধ ব্যক্তির নৈতিক মিল সঠিকভাবে ব্যাখ্যা করেছে।</li>
                    <li>ভাষাগত প্রকাশ প্রাঞ্জল এবং নিজস্ব শব্দে লিখিত।</li>
                  </ul>
                </div>

                {/* Missing / Improvement Points */}
                <div className="bg-amber-50/40 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>আরও প্রয়োজন ছিল (উন্নতির সুযোগ)</span>
                  </div>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>ফেরেশতার দেওয়া পরীক্ষার প্রেক্ষাপটটি এক লাইনে উল্লেখ থাকলে উত্তরটি সমৃদ্ধ হতো।</li>
                    <li>প্রথম দুই ব্যক্তির আচরণকে বৈসাদৃশ্য হিসেবে সংক্ষেপে তুলনামূলক উপস্থাপন করা যেত।</li>
                  </ul>
                </div>
              </div>

              {/* Teacher Comment Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700">
                  <strong className="text-slate-900 font-semibold block mb-0.5">
                    শিক্ষকের পর্যবেক্ষণ ও মন্তব্য:
                  </strong>
                  &ldquo;শিক্ষার্থীর নিজস্ব ভাষায় উপস্থাপন প্রশংসনীয়। উদ্দীপকের প্রয়োগ যথাযথ হওয়ায় পূর্ণ নম্বর মঞ্জুর করা হলো।&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
