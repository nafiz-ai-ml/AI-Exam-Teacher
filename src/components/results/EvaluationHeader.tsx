import React from 'react';
import { Evaluation } from '@/types/evaluation';
import { Badge } from '@/components/ui/Badge';
import {
  STATUS_LABELS,
  CONFIDENCE_LABELS,
} from '@/lib/constants';
import {
  toBengaliNumber,
  toBengaliDate,
  toBengaliScore,
} from '@/lib/utils';
import {
  Award,
  Sparkles,
  UserCheck,
  Calendar,
  Layers,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';

interface EvaluationHeaderProps {
  evaluation: Evaluation;
  onViewFilesClick?: () => void;
}

export function EvaluationHeader({
  evaluation,
  onViewFilesClick,
}: EvaluationHeaderProps) {
  const statusInfo = STATUS_LABELS[evaluation.status] || STATUS_LABELS.completed;
  const confidenceInfo = CONFIDENCE_LABELS[evaluation.ai_confidence] || CONFIDENCE_LABELS.medium;

  const scorePercentage = Math.round((evaluation.ai_score / evaluation.total_marks) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-600/90 text-white">
                <GraduationCap className="w-3.5 h-3.5 mr-1" /> {evaluation.class_level} শ্রেণি
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-white/20 text-white">
                {evaluation.subject}
              </span>
              {evaluation.chapter && (
                <span className="text-xs text-slate-300 font-medium">
                  • {evaluation.chapter}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              সৃজনশীল খাতা মূল্যায়ন ফলাফল
            </h1>

            <div className="flex items-center space-x-3 text-xs text-slate-300 pt-1">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {toBengaliDate(evaluation.created_at)}
              </span>
            </div>
          </div>

          {/* Status & Files Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            {evaluation.evaluation_source === 'real_ai' ? (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <Sparkles className="w-3 h-3 mr-1 text-emerald-300" />
                রিয়েল AI মূল্যায়ন
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30">
                অফলাইন ডেমো
              </span>
            )}

            <span
              className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              {statusInfo.label}
            </span>

            {onViewFilesClick && evaluation.files && evaluation.files.length > 0 && (
              <button
                onClick={onViewFilesClick}
                className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                সংযুক্ত পাতা দেখুন ({toBengaliNumber(evaluation.files.length)})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Overview Grid */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. AI Suggested Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI-এর প্রস্তাবিত নম্বর</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {toBengaliScore(evaluation.ai_score, evaluation.total_marks)}
            </div>
            <div className="text-xs text-slate-700 mt-1">
              অর্জন: {toBengaliNumber(scorePercentage)}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-100">
            {toBengaliNumber(scorePercentage)}%
          </div>
        </div>

        {/* 2. Teacher Final Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-1">
              <UserCheck className="w-4 h-4 text-blue-700" />
              <span>শিক্ষকের চূড়ান্ত নম্বর</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
              {evaluation.teacher_score !== undefined
                ? toBengaliScore(evaluation.teacher_score, evaluation.total_marks)
                : 'অপেক্ষমাণ'}
            </div>
            <div className="text-xs text-slate-700 mt-1">
              {evaluation.teacher_score !== undefined
                ? 'শিক্ষক কর্তৃক পর্যালোচিত'
                : 'নিচে পর্যালোচনা সম্পন্ন করুন'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* 3. AI Confidence */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>AI-এর আত্মবিশ্বাসের মাত্রা</span>
            </div>
            <div className={`text-xl sm:text-2xl font-bold ${confidenceInfo.color}`}>
              {confidenceInfo.label}
            </div>
            <div className="text-xs text-slate-700 mt-1">
              হাতের লেখার পাঠযোগ্যতা ও তথ্যের ভিত্তিতে
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${confidenceInfo.badge}`}>
            {confidenceInfo.label.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Overall Feedback Section */}
      {evaluation.overall_feedback && (
        <div className="p-6 bg-white space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            সার্বিক মূল্যায়ন ও পর্যবেক্ষণ (Overall Feedback)
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {evaluation.overall_feedback}
          </p>
        </div>
      )}
    </div>
  );
}
