'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  tag?: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const faqs: FaqItem[] = [
    {
      question: 'AI কীভাবে শিক্ষার্থীর নিজস্ব ভাষায় লেখা সৃজনশীল (CQ) উত্তর মূল্যায়ন করে?',
      answer:
        'আমাদের সিস্টেম সাধারণ কিওয়ার্ড (keyword) ম্যাচিং বা গাইড বইয়ের মুখস্থ বাক্যের সাথে মেলানোর নীতি অনুসরণ করে না। এটি একটি গভীর ধারণাগত মূল্যায়ন ইঞ্জিন (Conceptual Evaluation Engine)—যা প্রশ্নের মূল চাহিদা, প্রয়োজনীয় জ্ঞান ও তথ্যের সত্যতা এবং উদ্দীপকের প্রাসঙ্গিকতা বিশ্লেষণ করে। শিক্ষার্থী যদি পাঠ্যবইয়ের হুবহু শব্দ না লিখে নিজের ভাষায় সঠিক ভাবার্থ প্রকাশ করে, তবুও সে উপযুক্ত নম্বর পাবে।',
      tag: 'ধারণাগত সঠিকতা',
    },
    {
      question: 'AI কি শিক্ষকের বিকল্প হিসেবে কাজ করে, নাকি সহায়ক হিসেবে?',
      answer:
        'একদমই সহায়ক হিসেবে! আমাদের প্ল্যাটফর্মের মূল দর্শনই হলো: "AI বিশ্লেষণ করে, কিন্তু চূড়ান্ত সিদ্ধান্ত শিক্ষক নেন।" AI প্রতিটি অংশের জন্য একটি খসড়া নম্বর ও উত্তরের দুর্বলতা-সবলতার সুনির্দিষ্ট রিপোর্ট উপস্থাপন করে। শিক্ষক যেকোনো সময় প্রাপ্ত নম্বর পরিবর্তন (Override) করতে পারেন এবং নিজস্ব মন্তব্য লিখতে পারেন।',
      tag: 'শিক্ষক কর্তৃত্ব',
    },
    {
      question: 'শিক্ষার্থীর হাতের লেখা কিছুটা অস্পষ্ট বা কম ভালো হলে AI কি পড়তে পারবে?',
      answer:
        'হ্যাঁ। আমাদের উন্নত মাল্টিমোডাল ভিশন মডেল সাধারণ হাতের লেখার বিভিন্ন ধরন ও শৈলী পড়তে পারদর্শী। তাছাড়া প্রতিটি মূল্যায়নে একটি "Confidence Level" বা আত্মবিশ্বাসের সূচক (উচ্চ / মাঝারি / সতর্কবার্তা) দেওয়া থাকে। হাতের লেখা খুব বেশি অস্পষ্ট হলে সিস্টেম শিক্ষককে সতর্ক করে দেয় যাতে শিক্ষক নিজ দায়িত্বে খাতাটি ভালোভাবে নিরীক্ষণ করেন।',
      tag: 'হস্তলিপি ও ভিশন',
    },
    {
      question: 'প্রয়োগ (গ) এবং উচ্চতর দক্ষতা (ঘ) অংশে উদ্দীপকের ব্যবহার কীভাবে মাপা হয়?',
      answer:
        'সৃজনশীল কাঠামোর নিয়ম অনুযায়ী, প্রয়োগ ও উচ্চতর দক্ষতায় পাঠ্যবইয়ের মূল ধারণার সাথে উদ্দীপকের ঘটনা বা চরিত্রের তুলনামূলক মেলবন্ধন থাকা বাধ্যতামূলক। AI শিক্ষার্থী উদ্দীপকের তথ্য কতটা গভীরভাবে যুক্ত করেছে তা আলাদাভাবে যাচাই করে এবং সেই অনুযায়ী নম্বরের যৌক্তিকতা নির্ধারণ করে।',
      tag: 'উদ্দীপক বিশ্লেষণ',
    },
    {
      question: 'শিক্ষার্থীর উত্তরপত্র এবং শিক্ষকের মূল্যায়ন ডেটা কি সম্পূর্ণ সুরক্ষিত?',
      answer:
        'হ্যাঁ, সম্পূর্ণ সুরক্ষিত। প্রতিটি শিক্ষকের অ্যাকাউন্ট আলাদা এবং ডেটাবেসে রো-লেভেল সিকিউরিটি (Row Level Security - RLS) পলিসি দ্বারা সংরক্ষিত। একজন শিক্ষক কেবল তার নিজের মূল্যায়িত খাতা দেখতে ও ম্যানেজ করতে পারেন; অন্য কোনো শিক্ষকের বা বাইরের কারও সেই তথ্যে প্রবেশের সুযোগ নেই।',
      tag: 'ডেটা সুরক্ষা',
    },
    {
      question: 'কোন কোন শ্রেণি ও বিষয়ের সৃজনশীল খাতা মূল্যায়ন করা যায়?',
      answer:
        'বর্তমানে এটি ৬ষ্ঠ ও ৭ম শ্রেণির বাংলা ১ম পত্র, বাংলা ২য় পত্র, বিজ্ঞান, বাংলাদেশ ও বিশ্বপরিচয়, এবং ইসলাম শিক্ষা সহ যেকোনো সৃজনশীল বিষয়ের জন্য সম্পূর্ণ উপযোগী। অন্যান্য শ্রেণির সিলেবাসও ক্রমান্বয়ে যুক্ত করা হচ্ছে।',
      tag: 'বিষয় ও শ্রেণি',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200 scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
            <span>সচরাচর জিজ্ঞাসা ও উত্তর</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            শিক্ষকদের সাধারণ প্রশ্ন ও উত্তর
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            AI খাতা মূল্যায়ন প্ল্যাটফর্ম সম্পর্কে আপনার যেকোনো প্রশ্নের স্বচ্ছ ও স্পষ্ট সমাধান এখানে পেয়ে যাবেন।
          </p>
        </div>

        {/* Accordion Container */}
        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Accordion Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4.5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-indigo-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {faq.tag && (
                      <span className="hidden md:inline-block text-[11px] font-semibold text-indigo-900 bg-indigo-100/70 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                        {faq.tag}
                      </span>
                    )}
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-indigo-100 text-indigo-900'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </button>

                {/* Animated Accordion Body */}
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100 pb-5 px-5 sm:px-6'
                      : 'grid-rows-[0fr] opacity-0 pb-0 px-5 sm:px-6'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2 border-t border-indigo-200/40 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helpful Note */}
        <div className="mt-10 p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-indigo-900 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <strong className="text-xs sm:text-sm text-slate-900 block font-bold">
                অন্য কোনো প্রশ্ন বা জিজ্ঞাসা আছে?
              </strong>
              <span className="text-xs text-slate-500">
                আমাদের প্ল্যাটফর্মটি সরাসরি ব্যবহার করে আপনার প্রথম খাতাটি যাচাই করে দেখতে পারেন।
              </span>
            </div>
          </div>

          <a
            href="#how-it-works"
            className="shrink-0 text-xs font-bold text-indigo-900 hover:text-indigo-950 hover:underline inline-flex items-center"
          >
            কীভাবে কাজ করে আবার দেখুন &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
