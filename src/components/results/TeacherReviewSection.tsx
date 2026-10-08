'use client';

import React, { useState } from 'react';
import { Evaluation } from '@/types/evaluation';
import {
  toBengaliNumber,
  toBengaliScore,
} from '@/lib/utils';
import {
  UserCheck,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

interface TeacherReviewSectionProps {
  evaluation: Evaluation;
  onSaveReview: (params: {
    teacherScore: number;
    teacherFeedback?: string;
    partScores: Record<string, number>;
  }) => Promise<void>;
}

export function TeacherReviewSection({
  evaluation,
  onSaveReview,
}: TeacherReviewSectionProps) {
  // Initialize teacher scores
  const initialPartScores: Record<string, number> = {};
  evaluation.parts.forEach((p) => {
    initialPartScores[p.part] =
      p.teacher_score !== undefined ? p.teacher_score : p.score;
  });

  const [partScores, setPartScores] = useState<Record<string, number>>(initialPartScores);
  const [teacherFeedback, setTeacherFeedback] = useState<string>(
    evaluation.teacher_feedback || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute total teacher score from parts
  const currentTotalTeacherScore = Object.values(partScores).reduce(
    (acc, curr) => acc + (Number(curr) || 0),
    0
  );

  const handleScoreChange = (part: string, val: number, maxScore: number) => {
    const validVal = Math.min(Math.max(0, val), maxScore);
    setPartScores((prev) => ({
      ...prev,
      [part]: validVal,
    }));
  };

  const handleAcceptAiScore = () => {
    const aiScores: Record<string, number> = {};
    evaluation.parts.forEach((p) => {
      aiScores[p.part] = p.score;
    });
    setPartScores(aiScores);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      await onSaveReview({
        teacherScore: currentTotalTeacherScore,
        teacherFeedback: teacherFeedback.trim() || undefined,
        partScores: partScores,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-white/20 text-white">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              চূড়ান্ত সিদ্ধান্ত শিক্ষকের
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">শিক্ষকের পর্যালোচনা ও চূড়ান্ত নম্বর</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            AI শুধুমাত্র আপনার সহকারী হিসেবে খসড়া নম্বর ও বিশ্লেষণ প্রস্তাব করেছে। আপনি প্রতিটি অংশের নম্বর ও নিজের মন্তব্য চূড়ান্ত করতে পারেন।
          </p>
        </div>

        {/* Quick Accept AI Score Button */}
        <button
          type="button"
          onClick={handleAcceptAiScore}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 cursor-pointer shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>AI স্কোর গ্রহণ করুন</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {saveSuccess && (
          <Alert type="success" title="সফলভাবে সংরক্ষিত!">
            শিক্ষকের চূড়ান্ত নম্বর ও পর্যালোচনা সফলভাবে সংরক্ষণ করা হয়েছে।
          </Alert>
        )}

        {errorMsg && (
          <Alert type="error" title="সংরক্ষণ ব্যর্থ">
            {errorMsg}
          </Alert>
        )}

        {/* Part-by-part score adjustment */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            প্রতিটি অংশের নম্বর সমন্বয় (সরাসরি সম্পাদনাযোগ্য)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {evaluation.parts.map((p) => {
              const currentScore = partScores[p.part] !== undefined ? partScores[p.part] : p.score;
              return (
                <div
                  key={p.part}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      অংশ '{p.part}'
                    </span>
                    <span className="text-xs text-slate-700">
                      AI: {toBengaliScore(p.score, p.max_score)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      চূড়ান্ত নম্বর (সর্বোচ্চ {toBengaliNumber(p.max_score)})
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={p.max_score}
                      value={currentScore}
                      onChange={(e) =>
                        handleScoreChange(p.part, parseFloat(e.target.value) || 0, p.max_score)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base font-bold text-blue-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Score Summary Bar */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-800">
                শিক্ষকের দেওয়া মোট চূড়ান্ত নম্বর
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-950">
                {toBengaliScore(currentTotalTeacherScore, evaluation.total_marks)}
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-700">
            <div>AI প্রস্তাবিত নম্বর ছিল: <strong className="text-slate-800">{toBengaliScore(evaluation.ai_score, evaluation.total_marks)}</strong></div>
            <div className="text-slate-700 mt-0.5">(মূল AI স্কোর কখনো মুছে ফেলা হয় না)</div>
          </div>
        </div>

        {/* Teacher Feedback textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            শিক্ষকের নিজস্ব মন্তব্য বা পর্যবেক্ষণ (ঐচ্ছিক)
          </label>
          <textarea
            rows={3}
            placeholder="শিক্ষার্থীর হস্তলিপি, লেখার ধরন বা বিশেষ কোনো নির্দেশনা এখানে লিখতে পারেন..."
            value={teacherFeedback}
            onChange={(e) => setTeacherFeedback(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm shadow-md shadow-blue-700/20 hover:shadow-lg disabled:opacity-60 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>সংরক্ষণ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>চূড়ান্ত মূল্যায়ন সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
