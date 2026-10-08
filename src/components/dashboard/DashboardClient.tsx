'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Evaluation, ClassLevel, Subject, EvaluationStatus } from '@/types/evaluation';
import {
  STATUS_LABELS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  CONFIDENCE_LABELS,
} from '@/lib/constants';
import {
  toBengaliNumber,
  toBengaliScore,
  toBengaliDate,
  formatTimeAgo,
} from '@/lib/utils';
import {
  FileCheck2,
  PlusCircle,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  BookOpen,
  UserCheck,
  Clock,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Server,
} from 'lucide-react';
import { StorageStatus } from '@/lib/db/store';
import { Select } from '@/components/ui/Select';

interface DashboardClientProps {
  initialEvaluations: Evaluation[];
  storageStatus?: StorageStatus;
  aiInfo?: { isConfigured: boolean; model: string };
}

export default function DashboardClient({
  initialEvaluations,
  storageStatus,
  aiInfo,
}: DashboardClientProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filtered = evaluations.filter((ev) => {
    if (selectedClass !== 'all' && ev.class_level !== selectedClass) return false;
    if (selectedSubject !== 'all' && ev.subject !== selectedSubject) return false;
    if (selectedStatus !== 'all' && ev.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchChapter = ev.chapter?.toLowerCase().includes(q);
      const matchSubject = ev.subject.toLowerCase().includes(q);
      const matchQuestion = ev.question_text?.toLowerCase().includes(q);
      if (!matchChapter && !matchSubject && !matchQuestion) return false;
    }
    return true;
  });

  // Analytics Metrics
  const totalCount = evaluations.length;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCount = evaluations.filter((e) => new Date(e.created_at) >= oneWeekAgo).length;
  const aiCompletedCount = evaluations.filter((e) => e.status === 'completed' || e.status === 'reviewed').length;
  const reviewedCount = evaluations.filter((e) => e.status === 'reviewed').length;

  return (
    <div className="space-y-8">
      {/* 1. Hero / Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>স্বাগতম</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              আজকের মূল্যায়ন কাজ এক নজরে দেখুন
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              শিক্ষার্থী মুখস্থ না লিখে নিজের ভাষায় সঠিক উত্তর দিলে তা মূল্যায়ন করুন। AI ধারণাগত সামঞ্জস্য ও উদ্দীপকের সংযোগ পর্যালোচনা করে খসড়া নম্বর উপস্থাপন করবে—চূড়ান্ত রায় আপনার হাতে।
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/evaluations/new"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold bg-white text-emerald-900 hover:bg-emerald-50 active:bg-emerald-100 shadow-md transition-all text-sm group"
            >
              <PlusCircle className="w-5 h-5 mr-2 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>+ নতুন মূল্যায়ন</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* System Connection Diagnostic Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-800">AI সংযোগ:</span>
            {aiInfo?.isConfigured ? (
              <span className="inline-flex items-center text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                সক্রিয় (InMetech • {aiInfo.model})
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                অফলাইন
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-800">ডেটাবেস:</span>
            {storageStatus?.isConnected ? (
              <span className="inline-flex items-center text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                <Database className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Supabase সংযুক্ত
              </span>
            ) : (
              <span
                className="inline-flex items-center text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                title={storageStatus?.message}
              >
                <Server className="w-3.5 h-3.5 mr-1 text-slate-500" />
                লোকাল মেমরি (Supabase টেবিল পেন্ডিং)
              </span>
            )}
          </div>
        </div>

        <span className="text-[11px] text-slate-700">
          Personal Teacher Tool • Day 03
        </span>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Checked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700">মোট মূল্যায়ন</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {toBengaliNumber(totalCount)}
            </div>
            <span className="text-[11px] text-slate-700 mt-0.5 block">সর্বমোট সংরক্ষিত খাতা</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700">এই সপ্তাহে</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-900 mt-1">
              {toBengaliNumber(thisWeekCount)}
            </div>
            <span className="text-[11px] text-slate-700 mt-0.5 block">গত ৭ দিনে মূল্যায়িত</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* AI Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700">AI মূল্যায়ন সম্পন্ন</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1">
              {toBengaliNumber(aiCompletedCount)}
            </div>
            <span className="text-[11px] text-slate-700 mt-0.5 block">মডেল বিশ্লেষণ প্রস্তুত</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Reviewed by Teacher */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700">শিক্ষক পর্যালোচনা</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1">
              {toBengaliNumber(reviewedCount)}
            </div>
            <span className="text-[11px] text-slate-700 mt-0.5 block">শিক্ষক দ্বারা চূড়ান্তকৃত</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Core Philosophy Box */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5">
        <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-800 space-y-1">
          <h3 className="font-bold text-emerald-950">
            শিক্ষক স্মরণিকা: ধারণাগত উত্তরকে অগ্রাধিকার দিন
          </h3>
          <p className="leading-relaxed">
            শিক্ষার্থী পাঠ্যবই বা গাইড বইয়ের মতো হুবহু শব্দ ব্যবহার না করলেও, নিজের ভাষায় সঠিক ভাব ও তথ্য উপস্থাপন করলে তাকে উৎসাহিত করুন। সামান্য বানান বা বাক্যগঠনের পার্থক্যের কারণে নম্বর কাটা উচিত নয়।
          </p>
        </div>
      </div>

      {/* 4. Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-slate-800 text-sm sm:text-base">
              খাতা ফিল্টার ও অনুসন্ধান
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="অধ্যায় বা বিষয় দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Class Filter */}
          <div>
            <Select
              label="শ্রেণি"
              value={selectedClass}
              onChange={setSelectedClass}
              options={[{ value: 'all', label: 'সকল শ্রেণি' }, ...INITIAL_CLASSES]}
            />
          </div>

          {/* Subject Filter */}
          <div>
            <Select
              label="বিষয়"
              value={selectedSubject}
              onChange={setSelectedSubject}
              options={[{ value: 'all', label: 'সকল বিষয়' }, ...INITIAL_SUBJECTS]}
            />
          </div>

          {/* Status Filter */}
          <div>
            <Select
              label="যাচাইয়ের অবস্থা"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'all', label: 'সকল অবস্থা' },
                { value: 'completed', label: 'সম্পন্ন (AI মূল্যায়িত)' },
                { value: 'reviewed', label: 'শিক্ষক যাচাই করেছেন' },
                { value: 'processing', label: 'যাচাই চলছে' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 5. Recent Evaluations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            সাম্প্রতিক খাতা যাচাইয়ের তালিকা ({toBengaliNumber(filtered.length)})
          </h2>
          {filtered.length > 0 && (
            <span className="text-xs text-slate-700">
              সর্বশেষ তথ্যানুযায়ী সাজানো
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-lg">
                আপনার প্রথম খাতা মূল্যায়ন করুন
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-sm mx-auto leading-relaxed">
                প্রশ্ন ও শিক্ষার্থীর উত্তর আপলোড করে AI-এর প্রস্তাবিত মূল্যায়ন দেখুন।
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/evaluations/new"
                className="inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                নতুন মূল্যায়ন তৈরি করুন
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => {
              const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.completed;
              const confidenceInfo = CONFIDENCE_LABELS[item.ai_confidence] || CONFIDENCE_LABELS.medium;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                >
                  {/* Left Column: Metadata */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {item.class_level} শ্রেণি
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.subject}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-slate-700">
                        • {toBengaliDate(item.created_at)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-800 transition-colors">
                        {item.chapter ? item.chapter : `${item.subject} — সৃজনশীল খাতা`}
                      </h3>
                      {item.overall_feedback && (
                        <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 mt-1 leading-relaxed">
                          {item.overall_feedback}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Scores */}
                  <div className="flex items-center space-x-6 shrink-0 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-700 block">
                        AI প্রস্তাবিত নম্বর
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-slate-900">
                        {toBengaliScore(item.ai_score, item.total_marks)}
                      </div>
                    </div>

                    <div className="border-l border-slate-200 pl-4">
                      <span className="text-[11px] font-semibold text-slate-700 block">
                        শিক্ষকের চূড়ান্ত
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-blue-900">
                        {item.teacher_score !== undefined
                          ? toBengaliScore(item.teacher_score, item.total_marks)
                          : 'অপেক্ষমাণ'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Action Button */}
                  <div className="shrink-0 flex items-center justify-end">
                    <Link
                      href={`/evaluations/${item.id}`}
                      className="inline-flex items-center px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 text-white group-hover:bg-emerald-700 hover:bg-emerald-800 transition-all shadow-xs"
                    >
                      <span>বিস্তারিত ও পর্যালোচনা</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
