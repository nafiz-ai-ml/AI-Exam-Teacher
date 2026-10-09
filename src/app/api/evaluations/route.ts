import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Vercel serverless configuration: allow up to 60s execution for AI Vision analysis
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import {
  getAllEvaluations,
  saveEvaluation,
} from '@/lib/db/store';
import { getSupabase, isSupabaseConfigured } from '@/lib/db/supabase';
import { createServerSupabaseClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { evaluateCreativeAnswer } from '@/lib/ai/evaluator';
import {
  CreateEvaluationInput,
  Evaluation,
  EvaluationFile,
} from '@/types/evaluation';

async function uploadToStorageIfAvailable(
  fileUrl: string,
  fileName: string,
  folder: string
): Promise<string> {
  const serverSb = await createServerSupabaseClient();
  const supabase = serverSb || getSupabase();
  if (!supabase || !isSupabaseConfigured() || !fileUrl.startsWith('data:image/')) {
    return fileUrl;
  }

  try {
    const matches = fileUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return fileUrl;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = mimeType.split('/')[1]?.split('+')[0] || 'jpg';
    const filePath = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('evaluation_files')
      .upload(filePath, buffer, { contentType: mimeType, upsert: true });

    if (uploadError) {
      // Bucket might not be created or lacks permission; safely retain base64 URL
      return fileUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from('evaluation_files')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl || fileUrl;
  } catch (err) {
    return fileUrl;
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const list = await getAllEvaluations(user?.id);
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'মূল্যায়ন তালিকা লোড করতে ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateEvaluationInput = await req.json();

    // 1. Basic Validation
    if (!body.class_level || !body.subject || !body.parts_config) {
      return NextResponse.json(
        { error: 'প্রয়োজনীয় তথ্য (শ্রেণি, বিষয়, নম্বর বণ্টন) পূরণ করা হয়নি।' },
        { status: 400 }
      );
    }

    if (
      (!body.question_files || body.question_files.length === 0) &&
      (!body.question_text || body.question_text.trim() === '')
    ) {
      return NextResponse.json(
        { error: 'প্রশ্নপত্র আপলোড বা টাইপ করা আবশ্যক।' },
        { status: 400 }
      );
    }

    if (!body.answer_files || body.answer_files.length === 0) {
      return NextResponse.json(
        { error: 'শিক্ষার্থীর উত্তরের অন্তত একটি পাতার ছবি আপলোড করা আবশ্যক।' },
        { status: 400 }
      );
    }

    // Standard UUID for PostgreSQL compatibility
    const evaluationId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    // 2. Perform AI Conceptual Evaluation (Real InMetech AI or offline fallback)
    const aiResult = await evaluateCreativeAnswer({
      classLevel: body.class_level,
      subject: body.subject,
      chapter: body.chapter,
      totalMarks: body.total_marks,
      questionText: body.question_text,
      stimulusText: body.stimulus_text,
      sourceText: body.source_text,
      partsConfig: body.parts_config,
      questionImages: body.question_files?.map((f) => f.file_url) || [],
      stimulusImages: body.stimulus_files?.map((f) => f.file_url) || [],
      sourceImages: body.source_files?.map((f) => f.file_url) || [],
      answerImages: body.answer_files?.map((f) => f.file_url) || [],
    });

    // 3. Assemble Files with Supabase Storage processing
    const filesToSave: EvaluationFile[] = [];

    // Question files
    if (body.question_files) {
      for (let idx = 0; idx < body.question_files.length; idx++) {
        const f = body.question_files[idx];
        const finalUrl = await uploadToStorageIfAvailable(f.file_url, f.file_name, 'questions');
        filesToSave.push({
          id: crypto.randomUUID(),
          evaluation_id: evaluationId,
          file_type: 'question',
          file_url: finalUrl,
          file_name: f.file_name,
          page_order: idx + 1,
          created_at: nowIso,
        });
      }
    }

    // Stimulus files
    if (body.stimulus_files) {
      for (let idx = 0; idx < body.stimulus_files.length; idx++) {
        const f = body.stimulus_files[idx];
        const finalUrl = await uploadToStorageIfAvailable(f.file_url, f.file_name, 'stimulus');
        filesToSave.push({
          id: crypto.randomUUID(),
          evaluation_id: evaluationId,
          file_type: 'stimulus',
          file_url: finalUrl,
          file_name: f.file_name,
          page_order: idx + 1,
          created_at: nowIso,
        });
      }
    }

    // Source files
    if (body.source_files) {
      for (let idx = 0; idx < body.source_files.length; idx++) {
        const f = body.source_files[idx];
        const finalUrl = await uploadToStorageIfAvailable(f.file_url, f.file_name, 'sources');
        filesToSave.push({
          id: crypto.randomUUID(),
          evaluation_id: evaluationId,
          file_type: 'source',
          file_url: finalUrl,
          file_name: f.file_name,
          page_order: idx + 1,
          created_at: nowIso,
        });
      }
    }

    // Answer files
    if (body.answer_files) {
      for (let idx = 0; idx < body.answer_files.length; idx++) {
        const f = body.answer_files[idx];
        const finalUrl = await uploadToStorageIfAvailable(f.file_url, f.file_name, 'answers');
        filesToSave.push({
          id: crypto.randomUUID(),
          evaluation_id: evaluationId,
          file_type: 'answer',
          file_url: finalUrl,
          file_name: f.file_name,
          page_order: f.page_order || idx + 1,
          created_at: nowIso,
        });
      }
    }

    // 4. Assemble Full Evaluation Record
    const user = await getAuthenticatedUser();
    const newEvaluation: Evaluation = {
      id: evaluationId,
      user_id: user?.id,
      class_level: body.class_level,
      subject: body.subject,
      chapter: body.chapter,
      total_marks: body.total_marks,
      ai_score: aiResult.total_score,
      teacher_score: undefined,
      teacher_feedback: undefined,
      ai_confidence: aiResult.confidence,
      status: 'completed',
      evaluation_source: aiResult.evaluation_source,
      overall_feedback: aiResult.overall_feedback,
      parts: aiResult.parts,
      files: filesToSave,
      question_text: body.question_text,
      stimulus_text: body.stimulus_text,
      source_text: body.source_text,
      created_at: nowIso,
      updated_at: nowIso,
    };

    // 5. Persist
    const saved = await saveEvaluation(newEvaluation);

    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    console.error('Error creating evaluation:', err);
    return NextResponse.json(
      { error: err.bengaliMessage || err.message || 'মূল্যায়ন প্রক্রিয়া চলাকালীন অভ্যন্তরীণ ত্রুটি ঘটেছে।' },
      { status: err.statusCode || 500 }
    );
  }
}
