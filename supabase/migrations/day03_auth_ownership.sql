-- Day 03: Authentication & Multi-User Data Ownership Migration
-- Run this migration in Supabase SQL Editor

-- 1. Add user_id column to public.evaluations if not already present
ALTER TABLE public.evaluations
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON public.evaluations(user_id);

-- 3. Update Row Level Security Policies for evaluations
DROP POLICY IF EXISTS "Allow public read on evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow public insert on evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow public update on evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Allow public delete on evaluations" ON public.evaluations;

-- Teachers can view their own evaluations (and legacy records where user_id is null)
CREATE POLICY "Teacher can view own evaluations"
ON public.evaluations FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Authenticated teachers can insert their evaluations with their own user_id
CREATE POLICY "Teacher can insert own evaluations"
ON public.evaluations FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Teachers can update their own evaluations
CREATE POLICY "Teacher can update own evaluations"
ON public.evaluations FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Teachers can delete their own evaluations
CREATE POLICY "Teacher can delete own evaluations"
ON public.evaluations FOR DELETE
USING (auth.uid() = user_id OR user_id IS NULL);

-- 4. Update Row Level Security Policies for evaluation_files
DROP POLICY IF EXISTS "Allow public read on evaluation_files" ON public.evaluation_files;
DROP POLICY IF EXISTS "Allow public insert on evaluation_files" ON public.evaluation_files;
DROP POLICY IF EXISTS "Allow public update on evaluation_files" ON public.evaluation_files;
DROP POLICY IF EXISTS "Allow public delete on evaluation_files" ON public.evaluation_files;

CREATE POLICY "Teacher can view own evaluation files"
ON public.evaluation_files FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_files.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Teacher can insert own evaluation files"
ON public.evaluation_files FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_files.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Teacher can update own evaluation files"
ON public.evaluation_files FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_files.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Teacher can delete own evaluation files"
ON public.evaluation_files FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_files.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

-- 5. Update Row Level Security Policies for evaluation_results
DROP POLICY IF EXISTS "Allow public read on evaluation_results" ON public.evaluation_results;
DROP POLICY IF EXISTS "Allow public insert on evaluation_results" ON public.evaluation_results;
DROP POLICY IF EXISTS "Allow public update on evaluation_results" ON public.evaluation_results;
DROP POLICY IF EXISTS "Allow public delete on evaluation_results" ON public.evaluation_results;

CREATE POLICY "Teacher can view own evaluation results"
ON public.evaluation_results FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_results.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Teacher can insert own evaluation results"
ON public.evaluation_results FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_results.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Teacher can update own evaluation results"
ON public.evaluation_results FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_results.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Teacher can delete own evaluation results"
ON public.evaluation_results FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.evaluations
    WHERE id = evaluation_results.evaluation_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);
