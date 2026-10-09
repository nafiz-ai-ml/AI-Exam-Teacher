'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  DEFAULT_CQ_PARTS,
} from '@/lib/constants';
import { ClassLevel, Subject } from '@/types/evaluation';
import { ImageUploader, UploadedImageFile } from './ImageUploader';
import { Alert } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
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
  Users,
  User,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { toBengaliNumber } from '@/lib/utils';

interface BatchStudentItem {
  id: string;
  name: string;
  answerFiles: UploadedImageFile[];
  status: 'idle' | 'processing' | 'completed' | 'failed';
  evaluationId?: string;
  errorMessage?: string;
}

export default function NewEvaluationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'batch' ? 'batch' : 'single';

  // Mode: Single vs Batch
  const [gradingMode, setGradingMode] = useState<'single' | 'batch'>(initialMode);

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'batch') setGradingMode('batch');
    else if (urlMode === 'single') setGradingMode('single');
  }, [searchParams]);

  // Exam Info
  const [classLevel, setClassLevel] = useState<ClassLevel>('৬ষ্ঠ');
  const [subject, setSubject] = useState<Subject>('বাংলা ১ম পত্র');
  const [chapter, setChapter] = useState('');
  const [totalMarks, setTotalMarks] = useState(10);

  // CQ Parts Config
  const [partsConfig, setPartsConfig] = useState(DEFAULT_CQ_PARTS);

  // Question & Stimulus & Reference
  const [questionText, setQuestionText] = useState('');
  const [questionImages, setQuestionImages] = useState<UploadedImageFile[]>([]);

  const [stimulusText, setStimulusText] = useState('');
  const [stimulusImages, setStimulusImages] = useState<UploadedImageFile[]>([]);

  const [sourceText, setSourceText] = useState('');
  const [sourceImages, setSourceImages] = useState<UploadedImageFile[]>([]);

  // Single Student Answer Pages
  const [singleAnswerImages, setSingleAnswerImages] = useState<UploadedImageFile[]>([]);

  // Batch Students List
  const [batchStudents, setBatchStudents] = useState<BatchStudentItem[]>([
    { id: 'student-1', name: 'শিক্ষার্থী ১ (রোল ০১)', answerFiles: [], status: 'idle' },
    { id: 'student-2', name: 'শিক্ষার্থী ২ (রোল ০২)', answerFiles: [], status: 'idle' },
  ]);

  // Loading & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [batchProgressText, setBatchProgressText] = useState<string>('');
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
    const sum = updated.reduce((acc, curr) => acc + curr.max_score, 0);
    setTotalMarks(sum);
  };

  // Batch Student Management
  const handleAddBatchStudent = () => {
    const nextIndex = batchStudents.length + 1;
    setBatchStudents([
      ...batchStudents,
      {
        id: `student-${Date.now()}`,
        name: `শিক্ষার্থী ${toBengaliNumber(nextIndex)} (রোল ${toBengaliNumber(nextIndex.toString().padStart(2, '0'))})`,
        answerFiles: [],
        status: 'idle',
      },
    ]);
  };

  const handleRemoveBatchStudent = (index: number) => {
    if (batchStudents.length <= 1) return;
    setBatchStudents(batchStudents.filter((_, idx) => idx !== index));
  };

  const handleBatchStudentNameChange = (index: number, newName: string) => {
    const updated = [...batchStudents];
    updated[index].name = newName;
    setBatchStudents(updated);
  };

  const handleBatchStudentFilesChange = (index: number, files: UploadedImageFile[]) => {
    const updated = [...batchStudents];
    updated[index].answerFiles = files;
    setBatchStudents(updated);
  };

  // Single Evaluation Submit Handler
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (questionImages.length === 0 && !questionText.trim()) {
      setErrorMessage('অনুগ্রহ করে প্রশ্নপত্রের ছবি আপলোড করুন অথবা প্রশ্নটি লিখে দিন।');
      return;
    }

    if (singleAnswerImages.length === 0) {
      setErrorMessage('শিক্ষার্থীর হস্তলিখিত উত্তরের অন্তত একটি পাতার ছবি বা PDF আপলোড করা আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    setLoadingStep('১. প্রশ্ন ও উদ্দীপকের চাহিদা বোঝা হচ্ছে...');

    const stepTimers: NodeJS.Timeout[] = [];
    stepTimers.push(setTimeout(() => setLoadingStep('২. শিক্ষার্থীর হস্তলিখিত উত্তর পড়া হচ্ছে...'), 1800));
    stepTimers.push(setTimeout(() => setLoadingStep('৩. উত্তরের ধারণাগত সঠিকতা যাচাই করা হচ্ছে...'), 3600));
    stepTimers.push(setTimeout(() => setLoadingStep('৪. উদ্দীপকের সঙ্গে সম্পর্ক ও বিশ্লেষণ পরীক্ষা করা হচ্ছে...'), 5800));
    stepTimers.push(setTimeout(() => setLoadingStep('৫. নম্বর ও শিক্ষকের পর্যবেক্ষণ প্রস্তুত হচ্ছে...'), 8200));

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
        answer_files: singleAnswerImages.map((img) => ({
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
        let errorMsg = 'মূল্যায়ন প্রক্রিয়া সম্পন্ন করতে সমস্যা হয়েছে।';
        try {
          const errorData = await res.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch {
          if (res.status === 413) errorMsg = 'ফাইলের আকার অনেক বড় (৪.৫ MB-এর বেশি)।';
          else if (res.status === 504) errorMsg = 'AI মূল্যায়নে নির্ধারিত সময়সীমা (Timeout) অতিক্রম করেছে।';
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      router.push(`/evaluations/${data.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'মূল্যায়ন চলাকালীন কোনো অপ্রত্যাশিত ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  // Batch Evaluation Runner
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (questionImages.length === 0 && !questionText.trim()) {
      setErrorMessage('অনুগ্রহ করে প্রশ্নপত্রের ছবি আপলোড করুন অথবা প্রশ্নটি লিখে দিন।');
      return;
    }

    const studentsWithFiles = batchStudents.filter((s) => s.answerFiles.length > 0);
    if (studentsWithFiles.length === 0) {
      setErrorMessage('অন্তত একজন শিক্ষার্থীর উত্তরপত্রের ছবি বা PDF আপলোড করতে হবে।');
      return;
    }

    setIsSubmitting(true);

    const updatedList = [...batchStudents];

    for (let i = 0; i < updatedList.length; i++) {
      const student = updatedList[i];
      if (student.answerFiles.length === 0) continue;
      if (student.status === 'completed') continue; // Skip already completed in retries

      // Update student status to processing
      student.status = 'processing';
      student.errorMessage = undefined;
      setBatchStudents([...updatedList]);
      setBatchProgressText(`${student.name}-এর খাতা মূল্যায়ন চলছে (${toBengaliNumber(i + 1)}/${toBengaliNumber(updatedList.length)})...`);

      try {
        const payload = {
          class_level: classLevel,
          subject: subject,
          chapter: chapter.trim() ? `${chapter.trim()} (${student.name})` : student.name,
          total_marks: Number(totalMarks),
          question_text: questionText.trim() || undefined,
          stimulus_text: stimulusText.trim() || undefined,
          source_text: student.name,
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
          answer_files: student.answerFiles.map((img) => ({
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

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || 'মূল্যায়ন ব্যর্থ হয়েছে।');
        }

        const data = await res.json();
        student.status = 'completed';
        student.evaluationId = data.id;
      } catch (err: any) {
        student.status = 'failed';
        student.errorMessage = err.message || 'মূল্যায়ন চলাকালীন ত্রুটি হয়েছে।';
      }

      setBatchStudents([...updatedList]);
    }

    setIsSubmitting(false);
    setBatchProgressText('');
  };

  const completedCount = batchStudents.filter((s) => s.status === 'completed').length;
  const failedCount = batchStudents.filter((s) => s.status === 'failed').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header Banner */}
      <div className="bg-indigo-900 rounded-2xl p-6 sm:p-7 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-teal-300 backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> শিক্ষক মূল্যায়ন সহকারী
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">নতুন খাতা মূল্যায়ন</h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              সৃজনশীল প্রশ্নের চাহিদা অনুযায়ী ধারণাগত মূল্যায়ন। মুখস্থ শব্দের মিল নয়, উত্তরের প্রকৃত গুণগত মান যাচাই।
            </p>
          </div>

          {/* Mode Switcher: Single vs Batch */}
          <div className="shrink-0 bg-indigo-950/70 p-1.5 rounded-xl border border-indigo-800">
            <SegmentedControl
              size="sm"
              value={gradingMode}
              onChange={(val) => setGradingMode(val)}
              options={[
                { value: 'single', label: 'একক খাতা', icon: <User className="w-3.5 h-3.5" /> },
                {
                  value: 'batch',
                  label: 'ব্যাচ মূল্যায়ন',
                  icon: <Users className="w-3.5 h-3.5" />,
                  badge: toBengaliNumber(batchStudents.length),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert type="error" title="ত্রুটি দেখা দিয়েছে">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={gradingMode === 'single' ? handleSingleSubmit : handleBatchSubmit} className="space-y-8">
        {/* 1. Exam Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-900" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                পরীক্ষার তথ্য ও বিষয় নির্বাচন
              </h2>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Select
                  label="শ্রেণি"
                  required
                  value={classLevel}
                  onChange={(val) => setClassLevel(val as ClassLevel)}
                  options={INITIAL_CLASSES}
                />
              </div>

              <div className="sm:col-span-2">
                <Select
                  label="বিষয়"
                  required
                  value={subject}
                  onChange={(val) => setSubject(val as Subject)}
                  options={INITIAL_SUBJECTS}
                />
              </div>

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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                অধ্যায় বা বিষয়বস্তু <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: মিনু (ছোটগল্প), সালোকসংশ্লেষণ..."
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>

            {/* CQ Parts Configuration */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold text-slate-700">
                  সৃজনশীল প্রশ্নের অংশ ও নম্বর বণ্টন
                </label>
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="text-xs font-semibold text-indigo-900 hover:text-indigo-950 inline-flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-teal-600" /> অংশ যোগ করুন
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
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="অংশটি মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">সর্বোচ্চ নম্বর</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={partItem.max_score}
                        onChange={(e) => handlePartScoreChange(idx, Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Shared Question & Stimulus Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-indigo-900" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                সৃজনশীল প্রশ্ন ও উদ্দীপক
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              ছবি আপলোড করুন অথবা নিচে লিখে দিন
            </span>
          </CardHeader>

          <CardContent className="space-y-6">
            <ImageUploader
              label="প্রশ্নপত্রের ছবি বা PDF"
              description="মূল সৃজনশীল প্রশ্নপত্রের ছবি বা PDF আপলোড করুন।"
              images={questionImages}
              onChange={setQuestionImages}
              multiple
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                প্রশ্নপত্র টাইপ করুন <span className="text-slate-400 font-normal">(ছবি না থাকলে)</span>
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: ক. মিনুর সই কে ছিল?&#10;খ. মিনুকে কেন পরের বাড়ি থাকতে হতো? বুঝিয়ে লেখ।&#10;গ. উদ্দীপকের সুমির অবস্থার সাথে মিনুর জীবনের কোন দিকটি মিলে যায়?..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                উদ্দীপক <span className="text-slate-400 font-normal">(ঐচ্ছিক, যদি প্রশ্নপত্রে আলাদা উদ্দীপক থাকে)</span>
              </label>
              <textarea
                rows={2}
                placeholder="উদ্দীপকের সম্পূর্ণ অংশ এখানে পেস্ট করুন..."
                value={stimulusText}
                onChange={(e) => setStimulusText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Student Answer Sheets Card: Single vs Batch */}
        {gradingMode === 'single' ? (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-900" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  শিক্ষার্থীর হস্তলিখিত উত্তরপত্র
                </h2>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                একক শিক্ষার্থী
              </span>
            </CardHeader>

            <CardContent>
              <ImageUploader
                label="উত্তরপত্রের ছবি বা PDF"
                description="শিক্ষার্থীর হাতের লেখায় রচিত খাতার পাতাগুলো ছবি বা PDF আকারে যুক্ত করুন।"
                images={singleAnswerImages}
                onChange={setSingleAnswerImages}
                multiple
                required
              />
            </CardContent>
          </Card>
        ) : (
          /* BATCH GRADING WORKSPACE */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-indigo-900" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      শিক্ষার্থীদের উত্তরপত্র ব্যাচ তালিকা
                    </h2>
                    <p className="text-xs text-slate-500">
                      একই প্রশ্নের বিপরীতে একাধিক শিক্ষার্থীর খাতা আলাদাভাবে যুক্ত করুন।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddBatchStudent}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>শিক্ষার্থী যোগ করুন</span>
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Batch Overview summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-xs text-slate-500 block">মোট শিক্ষার্থী</span>
                  <span className="text-base font-bold text-slate-900">{toBengaliNumber(batchStudents.length)}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">উত্তরপত্র যুক্ত</span>
                  <span className="text-base font-bold text-indigo-900">
                    {toBengaliNumber(batchStudents.filter((s) => s.answerFiles.length > 0).length)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">মূল্যায়ন সম্পন্ন</span>
                  <span className="text-base font-bold text-emerald-700">{toBengaliNumber(completedCount)}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ব্যর্থ / অপেক্ষা</span>
                  <span className="text-base font-bold text-slate-700">{toBengaliNumber(failedCount)}</span>
                </div>
              </div>

              {/* Student Cards List */}
              <div className="space-y-4">
                {batchStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {toBengaliNumber(idx + 1)}
                        </span>
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => handleBatchStudentNameChange(idx, e.target.value)}
                          className="font-semibold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden bg-transparent px-1 py-0.5"
                          placeholder="শিক্ষার্থীর নাম বা রোল..."
                        />
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center space-x-2">
                        {student.status === 'processing' && (
                          <span className="inline-flex items-center text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                            <Loader2 className="w-3 h-3 animate-spin mr-1" /> মূল্যায়ন চলছে
                          </span>
                        )}
                        {student.status === 'completed' && (
                          <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                            <CheckCircle className="w-3 h-3 mr-1" /> সম্পন্ন
                          </span>
                        )}
                        {student.status === 'failed' && (
                          <span className="inline-flex items-center text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-medium border border-rose-200">
                            ব্যর্থ
                          </span>
                        )}
                        {student.evaluationId && (
                          <a
                            href={`/evaluations/${student.evaluationId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-indigo-900 hover:text-indigo-950 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <span>ফলাফল</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        {batchStudents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBatchStudent(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="শিক্ষার্থী বাদ দিন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {student.errorMessage && (
                      <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{student.errorMessage}</p>
                    )}

                    {/* Uploader for this student */}
                    <ImageUploader
                      label={`${student.name}-এর উত্তরপত্র (ছবি বা PDF)`}
                      images={student.answerFiles}
                      onChange={(files) => handleBatchStudentFilesChange(idx, files)}
                      multiple
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evaluation Submission Bar */}
        <div className="pt-2">
          {isSubmitting ? (
            <div className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-900 mx-auto" />
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                {gradingMode === 'single' ? loadingStep : batchProgressText}
              </p>
              <p className="text-xs text-slate-500">
                AI প্রতিটি অংশের ধারণাগত প্রাসঙ্গিকতা বিচার করছে। অনুগ্রহ করে কিছুটা সময় অপেক্ষা করুন।
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-600">
                {gradingMode === 'single' ? (
                  <span>
                    মোট উত্তরপত্রের পাতা: <strong className="text-slate-900 font-bold">{toBengaliNumber(singleAnswerImages.length)}টি</strong>
                  </span>
                ) : (
                  <span>
                    প্রস্তুত শিক্ষার্থী: <strong className="text-indigo-900 font-bold">{toBengaliNumber(batchStudents.filter((s) => s.answerFiles.length > 0).length)} জন</strong>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-900 text-white hover:bg-indigo-950 active:bg-slate-950 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <span>
                  {gradingMode === 'single' ? 'খাতা মূল্যায়ন শুরু করুন' : 'ব্যাচ মূল্যায়ন সম্পন্ন করুন'}
                </span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
