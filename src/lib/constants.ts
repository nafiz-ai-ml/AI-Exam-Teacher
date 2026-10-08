import { ClassLevel, Subject, EvaluationStatus, ConfidenceLevel } from '@/types/evaluation';

export const INITIAL_CLASSES: { value: ClassLevel; label: string }[] = [
  { value: '৬ষ্ঠ', label: '৬ষ্ঠ শ্রেণি' },
  { value: '৭ম', label: '৭ম শ্রেণি' },
];

export const INITIAL_SUBJECTS: { value: Subject; label: string; icon: string }[] = [
  { value: 'বাংলা ১ম পত্র', label: 'বাংলা ১ম পত্র', icon: 'BookOpen' },
  { value: 'বাংলা ২য় পত্র', label: 'বাংলা ২য় পত্র', icon: 'FileText' },
  { value: 'সমাজ', label: 'বাংলাদেশ ও বিশ্বপরিচয় (সমাজ)', icon: 'Globe' },
  { value: 'বিজ্ঞান', label: 'বিজ্ঞান', icon: 'Atom' },
  { value: 'ইসলাম শিক্ষা', label: 'ইসলাম ও নৈতিক শিক্ষা', icon: 'Compass' },
];

export const DEFAULT_CQ_PARTS = [
  { part: 'ক', max_score: 1, label: 'ক (জ্ঞানমূলক)', placeholder: '১ নম্বরের জ্ঞানমূলক অংশ' },
  { part: 'খ', max_score: 2, label: 'খ (অনুধাবনমূলক)', placeholder: '২ নম্বরের অনুধাবনমূলক অংশ' },
  { part: 'গ', max_score: 3, label: 'গ (প্রয়োগমূলক)', placeholder: '৩ নম্বরের উদ্দীপক ও প্রয়োগভিত্তিক অংশ' },
  { part: 'ঘ', max_score: 4, label: 'ঘ (উচ্চতর দক্ষতামূলক)', placeholder: '৪ নম্বরের বিশ্লেষণ ও মূল্যায়নমূলক অংশ' },
];

export const STATUS_LABELS: Record<EvaluationStatus, { label: string; bg: string; text: string; border: string }> = {
  draft: {
    label: 'খসড়া',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
  processing: {
    label: 'যাচাই চলছে',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
  },
  completed: {
    label: 'সম্পন্ন',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
  },
  reviewed: {
    label: 'শিক্ষক যাচাই করেছেন',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  failed: {
    label: 'ব্যর্থ',
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-300',
  },
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, { label: string; color: string; badge: string }> = {
  high: {
    label: 'উচ্চ (High)',
    color: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  medium: {
    label: 'মাঝারি (Medium)',
    color: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  low: {
    label: 'কম (Low)',
    color: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const HANDWRITING_LABELS: Record<string, { label: string; badge: string }> = {
  clear: {
    label: 'হস্তলিপি স্পষ্ট',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  partially_clear: {
    label: 'আংশিক স্পষ্ট',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  unclear: {
    label: 'হস্তলিপি অস্পষ্ট',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};
