-- AI Answer Checker (Day 01 & 01.5) - Supabase Database & Storage Schema
-- Run this script in the Supabase Dashboard -> SQL Editor to initialize all tables and storage.

-- 1. Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_level VARCHAR(20) NOT NULL, -- '৬ষ্ঠ', '৭ম'
  subject VARCHAR(100) NOT NULL,    -- 'বাংলা ১ম পত্র', 'বিজ্ঞান', ইত্যাদি
  chapter VARCHAR(255),
  total_marks NUMERIC(5,2) NOT NULL DEFAULT 10.0,
  ai_score NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  teacher_score NUMERIC(5,2),
  teacher_feedback TEXT,
  ai_confidence VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  status VARCHAR(30) NOT NULL DEFAULT 'draft',         -- 'draft', 'processing', 'completed', 'reviewed', 'failed'
  evaluation_source VARCHAR(20) NOT NULL DEFAULT 'real_ai', -- 'real_ai', 'mock'
  overall_feedback TEXT,
  question_text TEXT,
  stimulus_text TEXT,
  source_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Evaluation Files Table
CREATE TABLE IF NOT EXISTS public.evaluation_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
  file_type VARCHAR(30) NOT NULL, -- 'question', 'stimulus', 'source', 'answer'
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  page_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Evaluation Results (Per Question Part) Table
CREATE TABLE IF NOT EXISTS public.evaluation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
  question_part VARCHAR(20) NOT NULL, -- 'ক', 'খ', 'গ', 'ঘ'
  max_marks NUMERIC(5,2) NOT NULL,
  ai_score NUMERIC(5,2) NOT NULL,
  teacher_score NUMERIC(5,2),
  question_alignment JSONB NOT NULL DEFAULT '{}'::jsonb, -- { level, percentage, explanation }
  correct_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  wrong_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  importance_reason TEXT,
  improvement_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  feedback TEXT NOT NULL,
  confidence VARCHAR(20) NOT NULL DEFAULT 'medium',
  handwriting_clarity VARCHAR(30) DEFAULT 'clear',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high performance lookup
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON public.evaluations(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON public.evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluation_files_eval_id ON public.evaluation_files(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_results_eval_id ON public.evaluation_results(evaluation_id);

-- 4. Enable Row Level Security (RLS) and grant permissions
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_results ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own evaluations (and legacy records where user_id is null)
CREATE POLICY "Teacher can view own evaluations" ON public.evaluations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Teacher can insert own evaluations" ON public.evaluations FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Teacher can update own evaluations" ON public.evaluations FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Teacher can delete own evaluations" ON public.evaluations FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Teacher can view own evaluation files" ON public.evaluation_files FOR SELECT USING (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_files.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));
CREATE POLICY "Teacher can insert own evaluation files" ON public.evaluation_files FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_files.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));
CREATE POLICY "Teacher can update own evaluation files" ON public.evaluation_files FOR UPDATE USING (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_files.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));
CREATE POLICY "Teacher can delete own evaluation files" ON public.evaluation_files FOR DELETE USING (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_files.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));

CREATE POLICY "Teacher can view own evaluation results" ON public.evaluation_results FOR SELECT USING (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_results.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));
CREATE POLICY "Teacher can insert own evaluation results" ON public.evaluation_results FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_results.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));
CREATE POLICY "Teacher can update own evaluation results" ON public.evaluation_results FOR UPDATE USING (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_results.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));
CREATE POLICY "Teacher can delete own evaluation results" ON public.evaluation_results FOR DELETE USING (EXISTS (SELECT 1 FROM public.evaluations WHERE id = evaluation_results.evaluation_id AND (user_id = auth.uid() OR user_id IS NULL)));

-- 5. Supabase Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('evaluation_files', 'evaluation_files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for evaluation_files bucket
CREATE POLICY "Allow public read for evaluation_files bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'evaluation_files');

CREATE POLICY "Allow public upload for evaluation_files bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evaluation_files');

CREATE POLICY "Allow public update for evaluation_files bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'evaluation_files');