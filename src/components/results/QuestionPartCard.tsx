import React from 'react';
import { QuestionPartEvaluation } from '@/types/evaluation';
import {
  toBengaliNumber,
  toBengaliScore,
  toBengaliPercentage,
} from '@/lib/utils';
import { CONFIDENCE_LABELS, HANDWRITING_LABELS } from '@/lib/constants';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Target,
  FileSearch,
  PenTool,
  Compass,
  BookOpen,
  Layers,
} from 'lucide-react';

interface QuestionPartCardProps {
  partData: QuestionPartEvaluation;
}

export function QuestionPartCard({ partData }: QuestionPartCardProps) {
  const confidenceInfo =
    CONFIDENCE_LABELS[partData.confidence] || CONFIDENCE_LABELS.medium;

  const handwritingInfo = partData.handwriting_clarity
    ? HANDWRITING_LABELS[partData.handwriting_clarity]
    : undefined;

  const alignment = partData.question_alignment;

  // Alignment badge style
  const alignmentBadgeStyle =
    alignment.level === 'high'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : alignment.level === 'medium'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  const alignmentLabel =
    alignment.level === 'high'
      ? 'উচ্চ'
      : alignment.level === 'medium'
      ? 'মাঝারি'
      : 'কম';

  const isHandwritingUnclear =
    partData.handwriting_clarity === 'unclear' ||
    (partData.confidence === 'low' && partData.handwriting_clarity === 'partially_clear');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:shadow-sm">
      {/* Top Header */}
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
            {partData.part}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              অংশ '{partData.part}' মূল্যায়ন
            </h3>
            <span className="text-xs text-slate-700">
              বরাদ্দকৃত নম্বর: {toBengaliNumber(partData.max_score)}
            </span>
          </div>
        </div>

        {/* Score & Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {handwritingInfo && (
            <span
              className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-medium ${handwritingInfo.badge}`}
            >
              <PenTool className="w-3 h-3 mr-1" />
              {handwritingInfo.label}
            </span>
          )}

          <span
            className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-medium ${confidenceInfo.badge}`}
          >
            আত্মবিশ্বাস: {confidenceInfo.label.split(' ')[0]}
          </span>

          <div className="px-3 py-1 rounded-lg bg-indigo-900 text-white font-bold text-sm shadow-xs">
            {toBengaliScore(partData.score, partData.max_score)}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6">
        {/* Unclear Handwriting Teacher Notice if applicable */}
        {isHandwritingUnclear && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1">
              <strong className="font-bold block text-amber-900">
                হস্তলিপি যাচাই নোটিশ:
              </strong>
              <p className="leading-relaxed">
                উত্তরের একটি অংশ স্পষ্টভাবে পড়া যায়নি। তাই এই অংশের মূল্যায়নে AI-এর আত্মবিশ্বাস কম। শিক্ষককে মূল খাতাটি দেখে চূড়ান্ত সিদ্ধান্ত নেওয়ার পরামর্শ দেওয়া হচ্ছে।
              </p>
            </div>
          </div>
        )}

        {/* 1. Question Demand & Student Core Message (Day 02 Feature) */}
        {partData.question_demand && (
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-200/70 space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs sm:text-sm">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>প্রশ্নের মূল চাহিদা (Question Demand):</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {partData.question_demand}
            </p>
          </div>
        )}

        {/* Student Answer Summary */}
        {partData.student_answer_summary && (
          <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start space-x-2">
            <BookOpen className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold text-slate-900">শিক্ষার্থীর লেখার মূল ভাব: </strong>
              <span>{partData.student_answer_summary}</span>
            </div>
          </div>
        )}

        {/* 2. Question Alignment Indicator */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-700" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                প্রশ্নের সাথে মিল ও চাহিদা পূরণ (Question Alignment):
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-bold ${alignmentBadgeStyle}`}
              >
                {alignmentLabel} ({toBengaliPercentage(alignment.percentage)})
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {alignment.explanation}
          </p>

          {/* Evaluated Criteria Tags (for গ and ঘ) */}
          {partData.criteria_evaluated && partData.criteria_evaluated.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-700">
                যাচাইকৃত বিশেষ সূচক:
              </span>
              {partData.criteria_evaluated.map((crit, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                >
                  ✓ {crit}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Stimulus Usage (if applicable) */}
        {partData.stimulus_usage && (partData.stimulus_usage.used || partData.stimulus_usage.explanation) && (
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/70 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs sm:text-sm">
                <Layers className="w-4 h-4 text-amber-700 shrink-0" />
                <span>উদ্দীপকের ব্যবহার ও সংযোগ (Stimulus Usage):</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  partData.stimulus_usage.quality === 'effective'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : partData.stimulus_usage.quality === 'partial'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : partData.stimulus_usage.quality === 'superficial'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {partData.stimulus_usage.quality === 'effective'
                  ? 'যথাযথ সংযোগ'
                  : partData.stimulus_usage.quality === 'partial'
                  ? 'আংশিক প্রয়োগ'
                  : partData.stimulus_usage.quality === 'superficial'
                  ? 'কেবল নাম উল্লেখ (সংযোগহীন)'
                  : 'প্রযোজ্য নয়'}
              </span>
            </div>
            {partData.stimulus_usage.explanation && (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {partData.stimulus_usage.explanation}
              </p>
            )}
          </div>
        )}

        {/* 4. Analysis Grid: Correct Points vs Missing & Wrong Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* যা সঠিক হয়েছে */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>যা সঠিক হয়েছে (সঠিক ধারণা ও বিষয়সমূহ)</span>
            </div>
            {partData.correct_points && partData.correct_points.length > 0 ? (
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {partData.correct_points.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-700 italic">
                কোনো উল্লেখযোগ্য সঠিক পয়েন্ট চিহ্নিত করা যায়নি।
              </p>
            )}
          </div>

          {/* যা অনুপস্থিত বা ভুল হয়েছে */}
          <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-sm">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>যা অনুপস্থিত বা বাদ পড়েছে (Missing Points)</span>
            </div>
            {partData.missing_points && partData.missing_points.length > 0 ? (
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {partData.missing_points.map((pt, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-700 italic">
                প্রশ্নের কোনো আবশ্যক পয়েন্ট বাদ পড়েনি।
              </p>
            )}

            {/* ভুল পয়েন্ট যদি থাকে */}
            {partData.wrong_points && partData.wrong_points.length > 0 && (
              <div className="pt-2 border-t border-rose-200/50 mt-2">
                <span className="text-xs font-semibold text-rose-800 block mb-1">
                  ভুল বিষয়সমূহ:
                </span>
                <ul className="space-y-1 text-xs text-rose-700">
                  {partData.wrong_points.map((pt, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="font-bold">✗</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 5. Why it matters & Improvement Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partData.importance_reason && (
            <div className="bg-blue-50/40 border border-blue-200/80 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-blue-900 font-semibold text-xs sm:text-sm">
                <FileSearch className="w-4 h-4 text-blue-600 shrink-0" />
                <span>কেন গুরুত্বপূর্ণ (Why it matters):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {partData.importance_reason}
              </p>
            </div>
          )}

          {partData.improvement_points && partData.improvement_points.length > 0 && (
            <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-amber-900 font-semibold text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>কীভাবে উন্নত করা যায় (Improvement Tips):</span>
              </div>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                {partData.improvement_points.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-amber-600 font-bold">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 6. AI Feedback Comment */}
        <div className="border-t border-slate-100 pt-4 flex items-start space-x-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              AI-এর বিশদ মন্তব্য
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mt-1">
              {partData.feedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
