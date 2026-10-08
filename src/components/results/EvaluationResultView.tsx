'use client';

import React, { useState } from 'react';
import { Evaluation } from '@/types/evaluation';
import { EvaluationHeader } from './EvaluationHeader';
import { QuestionPartCard } from './QuestionPartCard';
import { TeacherReviewSection } from './TeacherReviewSection';
import { FilePreviewModal } from './FilePreviewModal';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  HelpCircle,
  FileText,
  Printer,
  Sparkles,
  Share2,
} from 'lucide-react';
import { toBengaliNumber } from '@/lib/utils';

interface EvaluationResultViewProps {
  initialEvaluation: Evaluation;
}

export default function EvaluationResultView({
  initialEvaluation,
}: EvaluationResultViewProps) {
  const [evaluation, setEvaluation] = useState<Evaluation>(initialEvaluation);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');

  const handleSaveReview = async (params: {
    teacherScore: number;
    teacherFeedback?: string;
    partScores: Record<string, number>;
  }) => {
    const res = await fetch(`/api/evaluations/${evaluation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'মূল্যায়ন সংরক্ষণ করতে সমস্যা হয়েছে');
    }

    const updated = await res.json();
    setEvaluation(updated);
  };

  const displayedParts =
    activeTab === 'all'
      ? evaluation.parts
      : evaluation.parts.filter((p) => p.part === activeTab);

  return (
    <div className="space-y-8">
      {/* Top Nav & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </Link>

        <div className="flex items-center space-x-2">
          {evaluation.files && evaluation.files.length > 0 && (
            <button
              onClick={() => setIsFileModalOpen(true)}
              className="inline-flex items-center text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 mr-1.5 text-emerald-700" />
              <span>সংযুক্ত খাতার পাতা ({toBengaliNumber(evaluation.files.length)})</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center text-xs sm:text-sm font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer shadow-xs"
            title="প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Evaluation Header (Summary & Overall Score) */}
      <EvaluationHeader
        evaluation={evaluation}
        onViewFilesClick={() => setIsFileModalOpen(true)}
      />

      {/* 2. Question / Stimulus reference preview card if texts are available */}
      {(evaluation.question_text || evaluation.stimulus_text) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              প্রশ্নের সারসংক্ষেপ ও উদ্দীপক
            </h2>
          </div>

          {evaluation.stimulus_text && (
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 text-xs sm:text-sm text-slate-800 space-y-1">
              <span className="font-bold text-amber-900 block">উদ্দীপক:</span>
              <p className="whitespace-pre-line leading-relaxed">{evaluation.stimulus_text}</p>
            </div>
          )}

          {evaluation.question_text && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1">
              <span className="font-bold text-slate-900 block">প্রশ্নসমূহ:</span>
              <p className="whitespace-pre-line leading-relaxed">{evaluation.question_text}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. Question Parts Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              সৃজনশীল প্রশ্নভিত্তিক পুঙ্খানুপুঙ্খ মূল্যায়ন
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              সব অংশ ({toBengaliNumber(evaluation.parts.length)})
            </button>

            {evaluation.parts.map((p) => (
              <button
                key={p.part}
                onClick={() => setActiveTab(p.part)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === p.part
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                অংশ '{p.part}'
              </button>
            ))}
          </div>
        </div>

        {/* Question Parts Cards */}
        <div className="space-y-6">
          {displayedParts.map((part) => (
            <QuestionPartCard key={part.part} partData={part} />
          ))}
        </div>
      </div>

      {/* 4. Teacher Review & Final Score Section */}
      <TeacherReviewSection
        evaluation={evaluation}
        onSaveReview={handleSaveReview}
      />

      {/* File Preview Modal */}
      {evaluation.files && (
        <FilePreviewModal
          isOpen={isFileModalOpen}
          onClose={() => setIsFileModalOpen(false)}
          files={evaluation.files}
        />
      )}
    </div>
  );
}
