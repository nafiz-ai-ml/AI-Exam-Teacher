export type ClassLevel = '৬ষ্ঠ' | '৭ম';

export type Subject =
  | 'বাংলা ১ম পত্র'
  | 'বাংলা ২য় পত্র'
  | 'সমাজ'
  | 'বিজ্ঞান'
  | 'ইসলাম শিক্ষা';

export type EvaluationStatus =
  | 'draft'          // খসড়া
  | 'processing'     // যাচাই চলছে
  | 'completed'      // সম্পন্ন
  | 'reviewed'       // শিক্ষক যাচাই করেছেন
  | 'failed';        // ব্যর্থ

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface QuestionPartCriteria {
  part: string; // 'ক', 'খ', 'গ', 'ঘ' ইত্যাদি
  maxMarks: number;
  questionText?: string;
  expectedConcept?: string;
}

export interface QuestionAlignment {
  level: ConfidenceLevel; // 'high' (উচ্চ) | 'medium' (মাঝারি) | 'low' (কম)
  percentage: number;     // প্রশ্নের চাহিদার সাথে সঙ্গতি (০-১০০%)
  explanation: string;   // ব্যাখ্যা: প্রশ্নের মূল চাহিদা পূরণ হয়েছে কিনা
}

export interface StimulusUsage {
  used: boolean;
  quality?: 'effective' | 'partial' | 'superficial' | 'not_used';
  explanation: string;
}

export interface QuestionPartEvaluation {
  part: string;              // 'ক', 'খ', 'গ', 'ঘ'
  score: number;             // AI-এর দেওয়া নম্বর
  max_score: number;         // সর্বোচ্চ নম্বর
  teacher_score?: number;    // শিক্ষকের সংশোধিত নম্বর (ঐচ্ছিক)
  question_demand?: string;  // প্রশ্নের প্রকৃত চাহিদা
  student_answer_summary?: string; // শিক্ষার্থীর উত্তরের সারসংক্ষেপ
  stimulus_usage?: StimulusUsage;  // উদ্দীপকের ব্যবহার সংক্রান্ত মূল্যায়ন
  question_alignment: QuestionAlignment;
  correct_points: string[];  // যা সঠিক হয়েছে
  wrong_points: string[];    // যা ভুল হয়েছে
  missing_points: string[];  // যা অনুপস্থিত/বাদ পড়েছে
  importance_reason?: string;// কেন গুরুত্বপূর্ণ
  improvement_points: string[]; // কীভাবে উন্নত করা যায়
  feedback: string;          // AI-এর বিস্তারিত মূল্যায়ন মন্তব্য
  confidence: ConfidenceLevel; // আত্মবিশ্বাসের মাত্রা
  handwriting_clarity?: 'clear' | 'partially_clear' | 'unclear'; // হস্তলিপি স্পষ্টতার মাত্রা
  criteria_evaluated?: string[]; // গ ও ঘ এর জন্য মূল্যায়িত বিশেষ সূচক (যেমন: উদ্দীপকের ব্যবহার, বিশ্লেষণ ইত্যাদি)
}

export interface EvaluationFile {
  id: string;
  evaluation_id: string;
  file_type: 'question' | 'source' | 'stimulus' | 'answer';
  file_url: string; // Base64 data URL অথবা Supabase স্টোরেজ URL
  file_name: string;
  page_order: number;
  created_at: string;
}

export interface Evaluation {
  id: string;
  user_id?: string; // Authenticated teacher ownership
  class_level: ClassLevel;
  subject: Subject;
  chapter?: string;
  total_marks: number;
  ai_score: number;
  teacher_score?: number;
  teacher_feedback?: string;
  teacher_part_scores?: Record<string, number>;
  ai_confidence: ConfidenceLevel;
  status: EvaluationStatus;
  overall_feedback: string;
  parts: QuestionPartEvaluation[];
  files: EvaluationFile[];
  question_text?: string;
  stimulus_text?: string;
  source_text?: string;
  evaluation_source?: 'real_ai' | 'mock';
  created_at: string;
  updated_at: string;
}

export interface CreateEvaluationInput {
  class_level: ClassLevel;
  subject: Subject;
  chapter?: string;
  total_marks: number;
  question_text?: string;
  stimulus_text?: string;
  source_text?: string;
  parts_config: { part: string; max_score: number }[];
  question_files: { file_name: string; file_url: string }[];
  stimulus_files?: { file_name: string; file_url: string }[];
  source_files?: { file_name: string; file_url: string }[];
  answer_files: { file_name: string; file_url: string; page_order: number }[];
}
