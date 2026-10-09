import React from 'react';
import { HeartHandshake, ShieldCheck, UserCheck, Scale } from 'lucide-react';

export function TeacherPhilosophySection() {
  const pillars = [
    {
      icon: HeartHandshake,
      title: 'AI সহকারী, শিক্ষকই চূড়ান্ত কর্তৃত্ব',
      description:
        'কোনো অ্যালগরিদম একজন শিক্ষক ও তার মানবিক প্রজ্ঞার বিকল্প হতে পারে না। AI প্রাথমিক সময় বাঁচায় ও কাঠামোগত খসড়া দেয়, কিন্তু প্রতিটি খাতার চূড়ান্ত রায় শিক্ষকের হাতেই সংরক্ষিত।',
    },
    {
      icon: Scale,
      title: 'ধারণাগত সুবিচার',
      description:
        'বইয়ের মুখস্থ শব্দ না লিখে শিক্ষার্থী যদি নিজস্ব ভাষায় সঠিক যুক্তি ও তথ্য লেখে, তবে তাকে বঞ্চিত না করে তার মেধার সঠিক সম্মান নিশ্চিত করাই আমাদের মূল দর্শন।',
    },
    {
      icon: ShieldCheck,
      title: 'শিক্ষক-নিয়ন্ত্রিত নম্বর সংশোধন',
      description:
        'AI কোনো অপরিবর্তনীয় নম্বর নির্ধারণ করে না। শিক্ষক যেকোনো অংশের নম্বর বাড়ানো বা কমানোর সম্পূর্ণ স্বাধীনতা রাখেন।',
    },
  ];

  return (
    <section id="philosophy" className="py-16 sm:py-24 bg-white border-b border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold backdrop-blur-xs">
              <UserCheck className="w-3.5 h-3.5" />
              <span>শিক্ষক-কেন্দ্রিক দর্শন</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              AI আপনার সহকারী, চূড়ান্ত মূল্যায়নকারী শিক্ষক নিজেই।
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              আমরা কখনই দাবি করি না যে AI শিক্ষকের বিকল্প হতে পারে। আমাদের উদ্দেশ্য হলো শিক্ষককে ক্লান্তিহীন একটি সহযোগী শক্তি প্রদান করা, যা খাতার প্রাথমিক খুঁটিনাটি যাচাই করে শিক্ষকের মূল্যবান সময় বাঁচায় এবং শিক্ষার্থীদের প্রতি সুবিচার নিশ্চিত করে।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              {pillars.map((pil, idx) => {
                const Icon = pil.icon;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-sm sm:text-base">
                      {pil.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {pil.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
