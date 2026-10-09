'use client';

import React, { useState } from 'react';
import { Evaluation } from '@/types/evaluation';
import { EvaluationHeader } from './EvaluationHeader';
import { QuestionPartCard } from './QuestionPartCard';
import { TeacherReviewSection } from './TeacherReviewSection';
import { AnswerSheetViewer } from './AnswerSheetViewer';
import { FilePreviewModal } from './FilePreviewModal';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  HelpCircle,
  FileText,
  Printer,
  Sparkles,
  ChevronDown,
  ChevronUp,
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
  const [isMobileAnswerSheetOpen, setIsMobileAnswerSheetOpen] = useState(false);

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

  const answerFiles = (evaluation.files || []).filter((f) => f.file_type === 'answer');

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-900 transition-colors"
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
              <Layers className="w-4 h-4 mr-1.5 text-indigo-900" />
              <span>সকল ফাইল ({toBengaliNumber(evaluation.files.length)})</span>
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

      {/* Mobile Answer Sheet Toggle Accordion */}
      {answerFiles.length > 0 && (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileAnswerSheetOpen(!isMobileAnswerSheetOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 shadow-xs cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-900" />
              <span>শিক্ষার্থীর হস্তলিখিত উত্তরপত্র ({toBengaliNumber(answerFiles.length)}টি পাতা)</span>
            </div>
            {isMobileAnswerSheetOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {isMobileAnswerSheetOpen && (
            <div className="mt-3">
              <AnswerSheetViewer files={evaluation.files || []} />
            </div>
          )}
        </div>
      )}

      {/* Main Split Layout: Desktop 2-Column / Mobile Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Desktop Sticky Answer Sheet Viewer) */}
        {answerFiles.length > 0 && (
          <div className="hidden lg:block lg:col-span-5 sticky top-20 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-indigo-900" /> উত্তরপত্রের হস্তলিপি
              </span>
              <span className="text-xs font-semibold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md">
                {toBengaliNumber(answerFiles.length)}টি পাতা
              </span>
            </div>
            <AnswerSheetViewer files={evaluation.files || []} />
          </div>
        )}

        {/* Right Column: CQ Evaluation Details & Teacher Review */}
        <div className={`space-y-6 ${answerFiles.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {/* Question / Stimulus Reference Box */}
          {(evaluation.question_text || evaluation.stimulus_text) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <HelpCircle className="w-4 h-4 text-indigo-900" />
                <h2 className="text-sm font-bold text-slate-900">
                  প্রশ্নের সারসংক্ষেপ ও উদ্দীপক
                </h2>
              </div>

              {evaluation.stimulus_text && (
                <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-amber-950 block">উদ্দীপক:</span>
                  <p className="whitespace-pre-line leading-relaxed">{evaluation.stimulus_text}</p>
                </div>
              )}

              {evaluation.question_text && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 block">প্রশ্নসমূহ:</span>
                  <p className="whitespace-pre-line leading-relaxed">{evaluation.question_text}</p>
                </div>
              )}
            </div>
          )}

          {/* CQ Parts Filter Tabs */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-900" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  সৃজনশীল প্রশ্নভিত্তিক পুঙ্খানুপুঙ্খ মূল্যায়ন
                </h2>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  সব অংশ ({toBengaliNumber(evaluation.parts.length)})
                </button>

                {evaluation.parts.map((p) => (
                  <button
                    key={p.part}
                    onClick={() => setActiveTab(p.part)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === p.part
                        ? 'bg-indigo-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    অংশ '{p.part}'
                  </button>
                ))}
              </div>
            </div>

            {/* Question Parts Cards */}
            <div className="space-y-5">
              {displayedParts.map((part) => (
                <QuestionPartCard key={part.part} partData={part} />
              ))}
            </div>
          </div>

          {/* Teacher Review & Final Score Section */}
          <TeacherReviewSection
            evaluation={evaluation}
            onSaveReview={handleSaveReview}
          />
        </div>
      </div>

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
