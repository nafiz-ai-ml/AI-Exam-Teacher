'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  DEFAULT_CQ_PARTS,
} from '@/lib/constants';
import { ClassLevel, Subject } from '@/types/evaluation';
import { ImageUploader, UploadedImageFile } from './ImageUploader';
import { Alert } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { toBengaliNumber } from '@/lib/utils';

export default function NewEvaluationForm() {
  const router = useRouter();

  // Basic info
  const [classLevel, setClassLevel] = useState<ClassLevel>('৬ষ্ঠ');
  const [subject, setSubject] = useState<Subject>('বাংলা ১ম পত্র');
  const [chapter, setChapter] = useState('');
  const [totalMarks, setTotalMarks] = useState(10);

  // CQ Parts config
  const [partsConfig, setPartsConfig] = useState(DEFAULT_CQ_PARTS);

  // Question & Stimulus & Reference
  const [questionText, setQuestionText] = useState('');
  const [questionImages, setQuestionImages] = useState<UploadedImageFile[]>([]);

  const [stimulusText, setStimulusText] = useState('');
  const [stimulusImages, setStimulusImages] = useState<UploadedImageFile[]>([]);

  const [sourceText, setSourceText] = useState('');
  const [sourceImages, setSourceImages] = useState<UploadedImageFile[]>([]);

  // Student Handwritten Answer Pages
  const [answerImages, setAnswerImages] = useState<UploadedImageFile[]>([]);

  // State & Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddPart = () => {
    const existingParts = partsConfig.map((p) => p.part);
    const nextLetters = ['ঙ', 'চ', 'ছ', 'জ'];
    const nextLetter = nextLetters.find((l) => !existingParts.includes(l)) || `অংশ ${partsConfig.length + 1}`;
    setPartsConfig([...partsConfig, { part: nextLetter, max_score: 1, label: `${nextLetter} অংশ`, placeholder: '' }]);
  };

  const handleRemovePart = (index: number) => {
    if (partsConfig.length <= 1) return;
    const updated = partsConfig.filter((_, idx) => idx !== index);
    setPartsConfig(updated);
  };

  const handlePartScoreChange = (index: number, score: number) => {
    const updated = [...partsConfig];
    updated[index].max_score = score;
    setPartsConfig(updated);
    // recalculate total
    const sum = updated.reduce((acc, curr) => acc + curr.max_score, 0);
    setTotalMarks(sum);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (questionImages.length === 0 && !questionText.trim()) {
      setErrorMessage('অনুগ্রহ করে প্রশ্নপত্রের ছবি আপলোড করুন অথবা প্রশ্নটি লিখে দিন।');
      return;
    }

    if (answerImages.length === 0) {
      setErrorMessage('শিক্ষার্থীর হস্তলিখিত উত্তরের অন্তত একটি পাতার ছবি আপলোড করা আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    setLoadingStep('১. প্রশ্ন ও উদ্দীপকের চাহিদা বোঝা হচ্ছে...');

    const stepTimers: NodeJS.Timeout[] = [];
    stepTimers.push(setTimeout(() => setLoadingStep('২. শিক্ষার্থীর হস্তলিখিত উত্তর পড়া হচ্ছে...'), 1500));
    stepTimers.push(setTimeout(() => setLoadingStep('৩. উত্তরের ধারণাগত সঠিকতা যাচাই করা হচ্ছে...'), 3200));
    stepTimers.push(setTimeout(() => setLoadingStep('৪. উদ্দীপকের সঙ্গে সম্পর্ক ও বিশ্লেষণ পরীক্ষা করা হচ্ছে...'), 5200));
    stepTimers.push(setTimeout(() => setLoadingStep('৫. নম্বর ও শিক্ষকের পর্যবেক্ষণ প্রস্তুত হচ্ছে...'), 7500));

    try {
      const payload = {
        class_level: classLevel,
        subject: subject,
        chapter: chapter.trim() || undefined,
        total_marks: Number(totalMarks),
        question_text: questionText.trim() || undefined,
        stimulus_text: stimulusText.trim() || undefined,
        source_text: sourceText.trim() || undefined,
        parts_config: partsConfig.map((p) => ({ part: p.part, max_score: p.max_score })),
        question_files: questionImages.map((img) => ({
          file_name: img.file_name,
          file_url: img.file_url,
        })),
        stimulus_files: stimulusImages.map((img) => ({
          file_name: img.file_name,
          file_url: img.file_url,
        })),
        source_files: sourceImages.map((img) => ({
          file_name: img.file_name,
          file_url: img.file_url,
        })),
        answer_files: answerImages.map((img) => ({
          file_name: img.file_name,
          file_url: img.file_url,
          page_order: img.page_order,
        })),
      };

      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      stepTimers.forEach(clearTimeout);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'মূল্যায়ন প্রক্রিয়া সম্পন্ন করতে সমস্যা হয়েছে');
      }

      const data = await res.json();
      router.push(`/evaluations/${data.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'মূল্যায়ন চলাকালীন কোনো অপ্রত্যাশিত ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> শিক্ষক মূল্যায়ন সহকারী
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">নতুন খাতা যাচাই</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              শিক্ষার্থীর নিজস্ব ভাষায় লেখা উত্তর ধারণাগতভাবে বিচার করুন। শব্দ বা বাক্যের মুখস্থ মিল নয়, প্রশ্নের মূল চাহিদা পূরণই এখানে প্রাধান্য পাবে।
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert type="error" title="ত্রুটি দেখা দিয়েছে">
          {errorMessage}
        </Alert>
      )}

      {/* 1. Basic Exam Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            পরীক্ষার তথ্য ও বিষয় নির্বাচন
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Class */}
          <div>
            <Select
              label="শ্রেণি"
              required
              value={classLevel}
              onChange={(val) => setClassLevel(val as ClassLevel)}
              options={INITIAL_CLASSES}
            />
          </div>

          {/* Subject */}
          <div className="sm:col-span-2 md:col-span-2">
            <Select
              label="বিষয়"
              required
              value={subject}
              onChange={(val) => setSubject(val as Subject)}
              options={INITIAL_SUBJECTS}
            />
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              মোট নম্বর
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Chapter (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            অধ্যায় বা বিষয়বস্তু <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
          </label>
          <input
            type="text"
            placeholder="যেমন: মিনু, সালোকসংশ্লেষণ, প্রাচীন বাংলার ইতিহাস..."
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* CQ Mark Distribution */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-semibold text-slate-700">
              সৃজনশীল প্রশ্নের অংশ ও নম্বর বণ্টন
            </label>
            <button
              type="button"
              onClick={handleAddPart}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 inline-flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> অংশ যোগ করুন
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {partsConfig.map((partItem, idx) => (
              <div
                key={partItem.part}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-800">
                    {partItem.part} অংশ
                  </span>
                  {partsConfig.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePart(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-slate-500">নম্বর:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={partItem.max_score}
                    onChange={(e) => handlePartScoreChange(idx, Number(e.target.value))}
                    className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Question & Stimulus */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            প্রশ্ন ও উদ্দীপক আপলোড
          </h2>
        </div>

        <ImageUploader
          label="প্রশ্নপত্রের ছবি"
          description="প্রশ্নপত্র বা প্রশ্নের অংশের স্পষ্ট ছবি আপলোড করুন।"
          images={questionImages}
          onChange={setQuestionImages}
          multiple={false}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            প্রশ্নপত্র টাইপ করুন <span className="text-slate-400 font-normal">(ছবি না থাকলে বা অতিরিক্ত হিসেবে)</span>
          </label>
          <textarea
            rows={3}
            placeholder="ক. ...&#10;খ. ...&#10;গ. ...&#10;ঘ. ..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Stimulus / Uddipak (Optional) */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-slate-800">
              উদ্দীপক / প্রশ্নের প্রাসঙ্গিক অংশ
            </span>
            <span className="text-xs text-slate-400">(ঐচ্ছিক)</span>
          </div>

          <ImageUploader
            label="উদ্দীপকের ছবি (যদি আলাদা থাকে)"
            images={stimulusImages}
            onChange={setStimulusImages}
            multiple={false}
          />

          <textarea
            rows={2}
            placeholder="উদ্দীপকের টেক্সট এখানে লিখে দিতে পারেন (ঐচ্ছিক)..."
            value={stimulusText}
            onChange={(e) => setStimulusText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Textbook / Source Context (Optional) */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-slate-800">
              পাঠ্যবই / Reference উপাদান
            </span>
            <span className="text-xs text-slate-400">(ঐচ্ছিক)</span>
          </div>
          <p className="text-xs text-slate-700">
            গল্প, কবিতা বা পাঠ্যবইয়ের কোনো নির্দিষ্ট অনুচ্ছেদ থাকলে শিক্ষক তা এখানে দিতে পারেন।
          </p>

          <ImageUploader
            label="পাঠ্যবইয়ের পাতার ছবি"
            images={sourceImages}
            onChange={setSourceImages}
            multiple={false}
          />

          <textarea
            rows={2}
            placeholder="পাঠ্যবইয়ের প্রাসঙ্গিক নোট বা অনুচ্ছেদ..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 3. Student Handwritten Answer Pages */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <FileText className="w-5 h-5 text-emerald-700" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              শিক্ষার্থীর উত্তরের হস্তলিখিত খাতা <span className="text-rose-500">*</span>
            </h2>
            <p className="text-xs text-slate-700 mt-0.5">
              একাধিক পাতার ছবি আপলোড করতে পারবেন। পাতাগুলো ক্রমানুসারে সাজানো নিশ্চিত করুন।
            </p>
          </div>
        </div>

        <ImageUploader
          label="হস্তলিখিত উত্তরের পাতাসমূহ"
          description="শিক্ষার্থী নিজের ভাষায় যা লিখেছে তার পরিষ্কার ছবি দিন।"
          images={answerImages}
          onChange={setAnswerImages}
          multiple={true}
          maxFiles={12}
          required={true}
        />
      </div>

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-700 text-center sm:text-left">
          <span className="font-semibold text-slate-700">বিজ্ঞপ্তি:</span> AI কোনো স্বয়ংক্রিয় নম্বর প্রদানকারী চূড়ান্ত বিচারক নয়, এটি শিক্ষকের সময় বাঁচাতে খসড়া মূল্যায়ন প্রস্তুত করবে।
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 shadow-md shadow-emerald-700/20 hover:shadow-lg disabled:opacity-60 transition-all text-sm sm:text-base cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{loadingStep || 'যাচাই করা হচ্ছে...'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>যাচাই শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </form>
  );
}
