import React from 'react';
import {
  FileText,
  Target,
  Brain,
  Layers,
  Sparkles,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

export function CoreCapabilitiesSection() {
  const capabilities = [
    {
      icon: FileText,
      title: 'বাংলা হস্তলিপি অনুধাবন',
      description:
        'শিক্ষার্থীদের হাতে লেখা খাতার ছবি সরাসরি প্রসেস করে। সাধারণ হস্তলিপির ওঠানামা ও বহু-পৃষ্ঠার উত্তরপত্র সাবলীলভাবে পড়ে অর্থ উদ্ধার করতে সক্ষম।',
    },
    {
      icon: Target,
      title: 'প্রশ্নের চাহিদা বিশ্লেষণ (Question Demand)',
      description:
        'প্রশ্নে আসলে কী জানতে চাওয়া হয়েছে—কোন চরিত্র, কোন ঐতিহাসিক প্রেক্ষাপট বা কোন বৈজ্ঞানিক সূত্র—তা নির্ভুলভাবে ম্যাপিং করে।',
    },
    {
      icon: Brain,
      title: 'ধারণাগত মূল্যায়ন (Conceptual Evaluation)',
      description:
        'গাইড বইয়ের মুখস্থ শব্দ মিলানোর প্রয়োজন নেই। শিক্ষার্থী নিজের ভাষায় মূল তত্ত্ব ও বৈজ্ঞানিক বা ঐতিহাসিক সত্য উপস্থাপন করেছে কি না তা মূল্যায়ন করে।',
    },
    {
      icon: Layers,
      title: 'উদ্দীপক বিশ্লেষণ (Stimulus Alignment)',
      description:
        'উদ্দীপকের ঘটনা, চরিত্র ও পরিস্থিতি কীভাবে উত্তরের মূল বিষয়ের সাথে সম্পর্কিত হয়েছে এবং শিক্ষার্থী তা কতটা সুচারুভাবে ব্যবহার করেছে তা চিহ্নিত করে।',
    },
    {
      icon: Sparkles,
      title: 'গ ও ঘ অংশের গভীর পর্যালোচনা',
      description:
        'উচ্চতর দক্ষতা ও প্রয়োগমূলক প্রশ্নের ক্ষেত্রে যুক্তির ধারাবাহিকতা, সিদ্ধান্ত ও তুলনামূলক আলোচনার স্তরভিত্তিক নম্বর বণ্টন করে।',
    },
    {
      icon: Sliders,
      title: 'শিক্ষক ওভাররাইড ও মন্তব্য',
      description:
        'AI শুধুমাত্র প্রস্তাব দেবে; শিক্ষক যেকোনো সময় প্রাপ্ত নম্বর কমাতে বা বাড়াতে পারবেন এবং নিজস্ব দিকনির্দেশনা ও মন্তব্য যুক্ত করতে পারবেন।',
    },
    {
      icon: ShieldAlert,
      title: 'কনফিডেন্স ইন্ডিকেটর (Confidence Level)',
      description:
        'প্রতিটি মূল্যায়নের সঙ্গে মডেলের আস্থার মাত্রা (উচ্চ / মাঝারি / সতর্কবার্তা) নির্দেশ করা থাকে, যা শিক্ষককে সতর্ক দৃষ্টি রাখার পরামর্শ দেয়।',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-b border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            মূল সক্ষমতাসমূহ
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            সৃজনশীল খাতার জন্য তৈরি আধুনিক প্রযুক্তি
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            সাধারণ টেক্সট চ্যাটবট নয়, বরং বাংলাদেশের সৃজনশীল পাঠ্যক্রমের কাঠামোগত মূল্যায়নের জন্য বিশেষভাবে পরিকল্পিত।
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all hover:bg-white hover:shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-indigo-900 flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
