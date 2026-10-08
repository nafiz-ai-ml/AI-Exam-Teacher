import React from 'react';
import { Upload, Cpu, FileCheck2, UserCheck, ArrowRight } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: '১',
      title: 'প্রশ্ন ও খাতার ছবি দিন',
      desc: 'সৃজনশীল প্রশ্ন, উদ্দীপক এবং শিক্ষার্থীর হাতের লেখা উত্তরপত্রের একাধিক পৃষ্ঠার ছবি আপলোড করুন অথবা সরাসরি লিখে দিন।',
      icon: Upload,
      badge: 'ইনপুট',
    },
    {
      step: '২',
      title: 'AI উত্তর বুঝে বিশ্লেষণ করবে',
      desc: 'AI শিক্ষার্থীর হস্তলিপি পড়ে প্রতিটি বাক্যের ধারণাগত অর্থ, উদ্দীপকের সাথে সম্পৃক্ততা ও প্রাসঙ্গিকতা পুঙ্খানুপুঙ্খভাবে অনুধাবন করে।',
      icon: Cpu,
      badge: 'ভিষণ ও ভাষা প্রসেসিং',
    },
    {
      step: '৩',
      title: 'প্রশ্নের চাহিদা অনুযায়ী মূল্যায়ন দেখুন',
      desc: 'ক, খ, গ, ঘ প্রতিটি অংশের জন্য জ্ঞান, অনুধাবন, প্রয়োগ ও দক্ষতার ভিত্তিতে প্রস্তাবিত নম্বর ও দুর্বলতা-সবলতার স্পষ্ট প্রমাণ দেখুন।',
      icon: FileCheck2,
      badge: 'কাঠামোগত রিপোর্ট',
    },
    {
      step: '৪',
      title: 'শিক্ষক চূড়ান্ত নম্বর নির্ধারণ করবেন',
      desc: 'AI-এর প্রস্তাবনার ভিত্তিতে শিক্ষক প্রয়োজনমতো নম্বর পরিবর্তন (override) বা মন্তব্য যোগ করে চূড়ান্ত মূল্যায়ন সংরক্ষণ করবেন।',
      icon: UserCheck,
      badge: 'চূড়ান্ত অনুমোদন',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            সহজ ৪ ধাপের কার্যপদ্ধতি
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            কীভাবে কাজ করে প্ল্যাটফর্মটি?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            কোনো জটিল সেটআপ ছাড়াই মাত্র কয়েক ক্লিকে আপনার খাতা মূল্যায়নের কাজ সম্পন্ন করুন।
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
                      {st.step}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {st.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-400 group-hover:text-emerald-700 transition-colors">
                  <span>ধাপ {st.step} নির্দেশিকা</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
