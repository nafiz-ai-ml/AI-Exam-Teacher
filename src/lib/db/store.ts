import { getSupabase, isSupabaseConfigured } from './supabase';
import {
  Evaluation,
  EvaluationFile,
  QuestionPartEvaluation,
  EvaluationStatus,
} from '@/types/evaluation';

export interface StorageStatus {
  mode: 'supabase' | 'local';
  isConnected: boolean;
  message: string;
  tableName?: string;
  hasTables: boolean;
  hasBucket: boolean;
}

// In-memory persistent cache for development and offline testing
let inMemoryEvaluations: Evaluation[] = [
  {
    id: 'demo-eval-1',
    class_level: '৬ষ্ঠ',
    subject: 'বাংলা ১ম পত্র',
    chapter: 'মিনু (ছোটগল্প)',
    total_marks: 10,
    ai_score: 8.5,
    teacher_score: undefined,
    teacher_feedback: undefined,
    ai_confidence: 'high',
    status: 'completed',
    evaluation_source: 'real_ai',
    overall_feedback:
      'শিক্ষার্থী গাইড বইয়ের মুখস্থ বুলি ব্যবহার না করে সহজ ও সাবলীল বাংলায় নিজের মনের ভাব প্রকাশ করেছে। প্রশ্নের মূল চাহিদা খুব ভালোভাবে পূরণ হয়েছে। বিশেষ করে উদ্দীপকের সাথে মিনুর নিঃসঙ্গতার সংযোগটি যুক্তি দিয়ে তুলে ধরা হয়েছে।',
    question_text:
      'উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:\nসুমি একটি পিতৃহীন কিশোরী। সে দূর সম্পর্কের এক খালার বাড়িতে আশ্রিত হয়ে গৃহস্থালির কাজকর্ম করে। প্রকৃতি, গাছপালা ও চড়ুই পাখির সাথে তার ভাব।\n\nক. মিনুর সই কে ছিল?\nখ. মিনুকে কেন পরের বাড়ি থাকতে হতো? বুঝিয়ে লেখ।\nগ. উদ্দীপকের সুমির অবস্থার সাথে মিনুর জীবনের কোন দিকটি মিলে যায়? ব্যাখ্যা কর।\nঘ. "প্রকৃতির সান্নিধ্যই ছিল তাদের একমাত্র আশ্রয়"—উক্তিটির যথার্থতা মূল্যায়ন কর।',
    stimulus_text:
      'সুমি একটি পিতৃহীন কিশোরী। সে দূর সম্পর্কের এক খালার বাড়িতে আশ্রিত হয়ে গৃহস্থালির কাজকর্ম করে। প্রকৃতি, গাছপালা ও চড়ুই পাখির সাথে তার ভাব। সুমি মুখে কিছু না বললেও নিজের অনুভূতির প্রকাশ ঘটায় প্রাকৃতিক উপাদানগুলোর মাধ্যমে।',
    parts: [
      {
        part: 'ক',
        score: 1,
        max_score: 1,
        question_alignment: {
          level: 'high',
          percentage: 100,
          explanation: 'শিক্ষার্থী সঠিক তথ্যটি সরাসরি লিখেছে: মিনুর সই ছিল কাঁচপোকা / সুতার খিল।',
        },
        correct_points: ['সঠিকভাবে সই-এর পরিচয় উল্লেখ করেছে'],
        wrong_points: [],
        missing_points: [],
        importance_reason: 'জ্ঞানমূলক প্রশ্নের জন্য সুনির্দিষ্ট তথ্য প্রয়োজন।',
        improvement_points: ['পূর্ণ বাক্যে লেখা ভালো: "মিনুর সই ছিল কাঁচপোকা।"'],
        feedback: 'একদম সঠিক উত্তর।',
        confidence: 'high',
        handwriting_clarity: 'clear',
      },
      {
        part: 'খ',
        score: 2,
        max_score: 2,
        question_alignment: {
          level: 'high',
          percentage: 95,
          explanation: 'মিনুর অনাথ অবস্থা ও দূর সম্পর্কের পিসিমশায়ের বাড়িতে আশ্রিত থাকার কারণটি নিজের ভাষায় বুঝিয়েছে।',
        },
        correct_points: [
          'মিনুর বাবা-মা কেউ নেই এবং সে বোবা ও অনাথ',
          'পেটভাতে আশ্রয় পাওয়ার বিষয়টি নিজস্ব ভাষায় পরিষ্কার করেছে',
        ],
        wrong_points: [],
        missing_points: [],
        importance_reason: 'অনুধাবনের জন্য প্রেক্ষাপট ও কারণ স্পষ্টভাবে তুলে ধরা প্রয়োজন।',
        improvement_points: ['উপসংহারে সংক্ষেপে আরেকটু গুছিয়ে লেখা যেত।'],
        feedback: 'চমৎকার অনুধাবন। মুখস্থ না লিখে নিজের ভাষায় সঠিক কারণ ব্যক্ত করেছে।',
        confidence: 'high',
        handwriting_clarity: 'clear',
      },
      {
        part: 'গ',
        score: 2.5,
        max_score: 3,
        question_alignment: {
          level: 'high',
          percentage: 80,
          explanation: 'উদ্দীপকের সুমির সাথে মিনুর আশ্রিত জীবনের সাদৃশ্য চিহ্নিত করতে পেরেছে। তবে উদ্দীপকের বিস্তারিত উদ্ধৃতি কিছুটা কম ছিল।',
        },
        correct_points: [
          'উভয়েরই পরের বাড়িতে আশ্রিত জীবনযাপন চিহ্নিত করেছে',
          'গৃহস্থালির কাজের চাপ ও নিঃসঙ্গতার সাদৃশ্য দেখিয়েছে',
        ],
        wrong_points: [],
        missing_points: ['উদ্দীপক ও গল্পের মূল চরিত্রের মধ্যকার সাদৃশ্যটি আরেকটু বিস্তারিত আলোচনা করা প্রয়োজন ছিল'],
        importance_reason: 'প্রয়োগমূলক অংশে উদ্দীপকের ঘটনা ও পাঠ্যবইয়ের গল্পের মেলবন্ধন আবশ্যক।',
        improvement_points: ['জ্ঞান, অনুধাবন ও প্রয়োগ—এই তিন ধাপে বাক্য সাজালে পূর্ণ ৩ নম্বর পাওয়া যাবে।'],
        feedback: 'প্রয়োগ অংশে ভালো দক্ষতা দেখিয়েছে। লেখার ভাব সম্পূর্ণ প্রাসঙ্গিক।',
        confidence: 'high',
        handwriting_clarity: 'clear',
        criteria_evaluated: ['উদ্দীপকের সঠিক ব্যবহার', 'পাঠ্যবইয়ের সাথে সংযোগ', 'প্রয়োগের স্পষ্টতা'],
      },
      {
        part: 'ঘ',
        score: 3,
        max_score: 4,
        question_alignment: {
          level: 'medium',
          percentage: 75,
          explanation: 'প্রকৃতির সাথে বন্ধুত্বের বিষয়টি আলোচনা করেছে, তবে উচ্চতর দক্ষতায় নিজস্ব যুক্তির দৃঢ় উপসংহার কিছুটা হালকা।',
        },
        correct_points: [
          'মিনু কীভাবে কয়লা, উনুন ও হলুদ পাখিকে আপন ভেবেছিল তা লিখেছে',
          'সুমির সাথে প্রকৃতির মিতালির দিকটি যৌক্তিকভাবে সমর্থন করেছে',
        ],
        wrong_points: [],
        missing_points: ['উক্তিটির সপক্ষে গভীর সিদ্ধান্তমূলক সমাপ্তি দেওয়া হয়নি'],
        importance_reason: 'উচ্চতর দক্ষতার প্রশ্নে স্পষ্ট অভিমত ও যুক্তির ধারাবাহিকতা থাকা আবশ্যক।',
        improvement_points: ['শেষে নিজস্ব যুক্তির ওপর ভিত্তি করে এক লাইনে সিদ্ধান্ত টানতে হবে।'],
        feedback: 'বিশ্লেষণ বেশ ভালো। নিজস্ব ভাষায় ভাব প্রকাশের ক্ষমতা প্রশংসনীয়।',
        confidence: 'high',
        handwriting_clarity: 'clear',
        criteria_evaluated: ['গভীর বিশ্লেষণ', 'যুক্তি উপস্থাপন', 'সিদ্ধান্ত গ্রহণ'],
      },
    ],
    files: [
      {
        id: 'file-1',
        evaluation_id: 'demo-eval-1',
        file_type: 'question',
        file_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        file_name: 'bengali_question_paper.jpg',
        page_order: 0,
        created_at: '2026-10-07T12:00:00.000Z',
      },
      {
        id: 'file-2',
        evaluation_id: 'demo-eval-1',
        file_type: 'answer',
        file_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
        file_name: 'student_handwritten_page1.jpg',
        page_order: 1,
        created_at: '2026-10-07T12:00:00.000Z',
      },
    ],
    created_at: '2026-10-07T11:00:00.000Z',
    updated_at: '2026-10-07T12:00:00.000Z',
  },
  {
    id: 'demo-eval-2',
    class_level: '৭ম',
    subject: 'বিজ্ঞান',
    chapter: 'উদ্ভিদের বাহ্যিক বৈশিষ্ট্য ও সালোকসংশ্লেষণ',
    total_marks: 10,
    ai_score: 7,
    teacher_score: 7.5,
    teacher_feedback: 'শিক্ষার্থী নিজ ভাষায় সালোকসংশ্লেষণের প্রয়োজনীয়তা খুব সুন্দর উপস্থাপন করেছে। হাতের লেখা পরিষ্কার। আমি ঘ অংশে বাড়তি ০.৫ নম্বর যোগ করেছি।',
    ai_confidence: 'medium',
    status: 'reviewed',
    evaluation_source: 'real_ai',
    overall_feedback:
      'শিক্ষার্থীর বৈজ্ঞানিক ধারণাগত বোঝাপড়া ভালো। গাইড বইয়ের মুখস্থ সমীকরণ ছাড়া নিজের ভাষায় বর্ণনা করায় বিষয়টি স্পষ্ট হয়েছে। তবে কিছু বৈজ্ঞানিক পারিভাষিক শব্দে আরেকটু সতর্কতা দরকার।',
    question_text:
      'ক. ক্লোরোফিল কী?\nখ. পাতাকে সালোকসংশ্লেষণের প্রধান স্থান বলা হয় কেন?\nগ. উদ্দীপকের চিত্র অনুযায়ী আলোর অনুপস্থিতিতে কী ঘটবে ব্যাখ্যা কর।\nঘ. পৃথিবীতে প্রাণীকূলের অস্তিত্ব রক্ষায় উক্ত প্রক্রিয়ার ভূমিকা মূল্যায়ন কর।',
    parts: [
      {
        part: 'ক',
        score: 1,
        max_score: 1,
        question_alignment: {
          level: 'high',
          percentage: 100,
          explanation: 'ক্লোরোফিলের সবুজ কণা হওয়ার তথ্যটি শিক্ষার্থী স্পষ্টভাবে উল্লেখ করেছে।',
        },
        correct_points: ['উদ্ভিদের পাতায় থাকা সবুজ রঞ্জক কণা হিসেবে সংজ্ঞায়িত করেছে'],
        wrong_points: [],
        missing_points: [],
        importance_reason: 'জ্ঞানমূলক নির্ভুল তথ্য।',
        improvement_points: [],
        feedback: 'সঠিক উত্তর।',
        confidence: 'high',
        handwriting_clarity: 'clear',
      },
      {
        part: 'খ',
        score: 1.5,
        max_score: 2,
        question_alignment: {
          level: 'high',
          percentage: 80,
          explanation: 'পাতার ক্ষেত্রফল বেশি এবং পত্ররন্ধ্রের উপস্থিতি নিজের ভাষায় লিখেছে।',
        },
        correct_points: ['পাতার চ্যাপ্টা গঠন ও সূর্যের আলো পাওয়ার সুবিধা উল্লেখ করেছে'],
        wrong_points: [],
        missing_points: ['পাতায় বেশি সংখ্যক পত্ররন্ধ্র এবং ক্লোরোপ্লাস্ট থাকার বিষয়টি সামান্য সংক্ষেপে লিখেছে'],
        importance_reason: 'অনুধাবনে পাতার বিশেষ অভিযোজন পরিষ্কার করা দরকার।',
        improvement_points: ['ক্লোরোপ্লাস্টের ঘনত্বের পয়েন্টটি আরেকটু স্পষ্ট করা যেত।'],
        feedback: 'ধারণা পরিষ্কার, উপস্থাপনা ভালো।',
        confidence: 'high',
        handwriting_clarity: 'clear',
      },
      {
        part: 'গ',
        score: 2,
        max_score: 3,
        question_alignment: {
          level: 'medium',
          percentage: 70,
          explanation: 'আলো ছাড়া শর্করা তৈরি বন্ধ হওয়ার কারণটি বুঝিয়েছে।',
        },
        correct_points: ['আলোর ভূমিকা যে শক্তি সরবরাহকারী তা লিখেছে'],
        wrong_points: [],
        missing_points: ['উদ্দীপকের ছকের সাথে সরাসরি বিক্রিয়ার যোগসূত্র আরও স্পষ্ট করা দরকার ছিল'],
        importance_reason: 'প্রয়োগ অংশে আলো না থাকার প্রভাব সরাসরি ব্যাখ্যা করা প্রয়োজন।',
        improvement_points: ['পরীক্ষার ফলাফলের সাথে সিদ্ধান্ত সংযুক্ত করুন।'],
        feedback: 'প্রয়োগ অংশের উত্তর গ্রহণযোগ্য।',
        confidence: 'medium',
        handwriting_clarity: 'partially_clear',
      },
      {
        part: 'ঘ',
        score: 2.5,
        max_score: 4,
        teacher_score: 3,
        question_alignment: {
          level: 'high',
          percentage: 85,
          explanation: 'অক্সিজেন তৈরি ও খাদ্য শৃঙ্খলের সাথে যুক্ত করে নিজস্ব মতামত জানিয়েছে।',
        },
        correct_points: [
          'অক্সিজেন ছাড়া জীবের বেঁচে থাকা অসম্ভব তা যুক্তি দিয়ে দেখিয়েছে',
          'খাদ্যের প্রত্যক্ষ ও পরোক্ষ উৎস হিসেবে উদ্ভিদের গুরুত্ব তুলে ধরেছে',
        ],
        wrong_points: [],
        missing_points: ['কার্বন ডাই অক্সাইড ও অক্সিজেনের ভারসাম্য বজায় রাখার পয়েন্টটি বিস্তারিত নয়'],
        importance_reason: 'উচ্চতর দক্ষতায় পরিবেশগত ভারসাম্যের সামগ্রিক মূল্যায়ন গুরুত্বপূর্ণ।',
        improvement_points: ['গ্যাসের ভারসাম্য রক্ষার দিকটি আরও ১ বাক্যে অন্তর্ভুক্ত করলে উত্তরটি স্বয়ংসম্পূর্ণ হতো।'],
        feedback: 'যুক্তিনির্ভর চমৎকার উত্তর।',
        confidence: 'medium',
        handwriting_clarity: 'clear',
      },
    ],
    files: [
      {
        id: 'file-3',
        evaluation_id: 'demo-eval-2',
        file_type: 'question',
        file_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        file_name: 'science_question.jpg',
        page_order: 0,
        created_at: '2026-10-06T10:00:00.000Z',
      },
    ],
    created_at: '2026-10-06T09:00:00.000Z',
    updated_at: '2026-10-06T14:00:00.000Z',
  },
];

/**
 * Checks and reports the active storage mode and health.
 */
export async function getStorageStatus(): Promise<StorageStatus> {
  const supabase = getSupabase();

  if (!isSupabaseConfigured() || !supabase) {
    return {
      mode: 'local',
      isConnected: false,
      message: 'লোকাল ডেভেলপমেন্ট স্টোরেজ সক্রিয় (Supabase কনফিগারেশন দেওয়া হয়নি)',
      hasTables: false,
      hasBucket: false,
    };
  }

  try {
    const { error: tableError } = await supabase.from('evaluations').select('id').limit(1);
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasBucket = !!(buckets && buckets.some((b) => b.name === 'evaluation_files'));

    if (tableError) {
      return {
        mode: 'local',
        isConnected: false,
        message: 'লোকাল ডেভেলপমেন্ট স্টোরেজ সক্রিয় (Supabase ডেটাবেস টেবিল তৈরি করা প্রয়োজন)',
        tableName: 'public.evaluations',
        hasTables: false,
        hasBucket,
      };
    }

    return {
      mode: 'supabase',
      isConnected: true,
      message: 'Supabase ডেটাবেস সক্রিয় ও সংযুক্ত',
      tableName: 'public.evaluations',
      hasTables: true,
      hasBucket,
    };
  } catch (err: any) {
    return {
      mode: 'local',
      isConnected: false,
      message: `লোকাল স্টোরেজ সক্রিয় (Supabase সংযোগ ত্রুটি)`,
      hasTables: false,
      hasBucket: false,
    };
  }
}

export async function getAllEvaluations(userId?: string): Promise<Evaluation[]> {
  const supabase = getSupabase();

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data: evaluations, error } = await query;

      if (error) throw error;
      if (evaluations && evaluations.length > 0) {
        // Hydrate each evaluation with its parts and files
        const fullEvaluations: Evaluation[] = await Promise.all(
          evaluations.map(async (ev) => {
            const { data: parts } = await supabase
              .from('evaluation_results')
              .select('*')
              .eq('evaluation_id', ev.id);

            const { data: files } = await supabase
              .from('evaluation_files')
              .select('*')
              .eq('evaluation_id', ev.id)
              .order('page_order', { ascending: true });

            return {
              id: ev.id,
              user_id: ev.user_id,
              class_level: ev.class_level,
              subject: ev.subject,
              chapter: ev.chapter,
              total_marks: Number(ev.total_marks),
              ai_score: Number(ev.ai_score),
              teacher_score: ev.teacher_score ? Number(ev.teacher_score) : undefined,
              teacher_feedback: ev.teacher_feedback,
              ai_confidence: ev.ai_confidence,
              status: ev.status,
              evaluation_source: ev.evaluation_source || 'real_ai',
              overall_feedback: ev.overall_feedback || '',
              question_text: ev.question_text,
              stimulus_text: ev.stimulus_text,
              source_text: ev.source_text,
              created_at: ev.created_at,
              updated_at: ev.updated_at,
              parts: (parts || []).map((p) => {
                const align = (p.question_alignment || {}) as any;
                return {
                  part: p.question_part,
                  score: Number(p.ai_score),
                  max_score: Number(p.max_marks),
                  teacher_score: p.teacher_score ? Number(p.teacher_score) : undefined,
                  question_demand: p.question_demand || align.question_demand || '',
                  student_answer_summary: p.student_answer_summary || align.student_answer_summary || '',
                  stimulus_usage: p.stimulus_usage || align.stimulus_usage,
                  question_alignment: {
                    level: align.level || 'medium',
                    percentage: typeof align.percentage === 'number' ? align.percentage : 70,
                    explanation: align.explanation || '',
                  },
                  correct_points: p.correct_points || [],
                  wrong_points: p.wrong_points || [],
                  missing_points: p.missing_points || [],
                  importance_reason: p.importance_reason,
                  improvement_points: p.improvement_points || [],
                  feedback: p.feedback || '',
                  confidence: p.confidence || 'medium',
                  handwriting_clarity: p.handwriting_clarity || 'clear',
                  criteria_evaluated: p.criteria_evaluated,
                };
              }),
              files: (files || []).map((f) => ({
                id: f.id,
                evaluation_id: f.evaluation_id,
                file_type: f.file_type,
                file_url: f.file_url,
                file_name: f.file_name,
                page_order: f.page_order,
                created_at: f.created_at,
              })),
            };
          })
        );
        return fullEvaluations;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local memory store:', err);
    }
  }

  // Fallback to in-memory store
  return [...inMemoryEvaluations].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getEvaluationById(id: string, userId?: string): Promise<Evaluation | null> {
  const supabase = getSupabase();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: ev, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (ev) {
        // Enforce authorization: if record has an assigned user_id, it must match
        if (userId && ev.user_id && ev.user_id !== userId) {
          return null;
        }
        const { data: parts } = await supabase
          .from('evaluation_results')
          .select('*')
          .eq('evaluation_id', ev.id);

        const { data: files } = await supabase
          .from('evaluation_files')
          .select('*')
          .eq('evaluation_id', ev.id)
          .order('page_order', { ascending: true });

        return {
          id: ev.id,
          user_id: ev.user_id,
          class_level: ev.class_level,
          subject: ev.subject,
          chapter: ev.chapter,
          total_marks: Number(ev.total_marks),
          ai_score: Number(ev.ai_score),
          teacher_score: ev.teacher_score ? Number(ev.teacher_score) : undefined,
          teacher_feedback: ev.teacher_feedback,
          ai_confidence: ev.ai_confidence,
          status: ev.status,
          evaluation_source: ev.evaluation_source || 'real_ai',
          overall_feedback: ev.overall_feedback || '',
          question_text: ev.question_text,
          stimulus_text: ev.stimulus_text,
          source_text: ev.source_text,
          created_at: ev.created_at,
          updated_at: ev.updated_at,
          parts: (parts || []).map((p) => {
            const align = (p.question_alignment || {}) as any;
            return {
              part: p.question_part,
              score: Number(p.ai_score),
              max_score: Number(p.max_marks),
              teacher_score: p.teacher_score ? Number(p.teacher_score) : undefined,
              question_demand: p.question_demand || align.question_demand || '',
              student_answer_summary: p.student_answer_summary || align.student_answer_summary || '',
              stimulus_usage: p.stimulus_usage || align.stimulus_usage,
              question_alignment: {
                level: align.level || 'medium',
                percentage: typeof align.percentage === 'number' ? align.percentage : 70,
                explanation: align.explanation || '',
              },
              correct_points: p.correct_points || [],
              wrong_points: p.wrong_points || [],
              missing_points: p.missing_points || [],
              importance_reason: p.importance_reason,
              improvement_points: p.improvement_points || [],
              feedback: p.feedback || '',
              confidence: p.confidence || 'medium',
              handwriting_clarity: p.handwriting_clarity || 'clear',
              criteria_evaluated: p.criteria_evaluated,
            };
          }),
          files: (files || []).map((f) => ({
            id: f.id,
            evaluation_id: f.evaluation_id,
            file_type: f.file_type,
            file_url: f.file_url,
            file_name: f.file_name,
            page_order: f.page_order,
            created_at: f.created_at,
          })),
        };
      }
    } catch (err) {
      console.warn('Supabase getById failed, checking in-memory store:', err);
    }
  }

  const found = inMemoryEvaluations.find((item) => item.id === id);
  return found || null;
}

export async function saveEvaluation(evaluation: Evaluation): Promise<Evaluation> {
  const supabase = getSupabase();

  if (isSupabaseConfigured() && supabase) {
    try {
      // 1. Upsert evaluation record with safe user_id support
      const evPayload: any = {
        id: evaluation.id,
        class_level: evaluation.class_level,
        subject: evaluation.subject,
        chapter: evaluation.chapter,
        total_marks: evaluation.total_marks,
        ai_score: evaluation.ai_score,
        teacher_score: evaluation.teacher_score,
        teacher_feedback: evaluation.teacher_feedback,
        ai_confidence: evaluation.ai_confidence,
        status: evaluation.status,
        evaluation_source: evaluation.evaluation_source || 'real_ai',
        overall_feedback: evaluation.overall_feedback,
        question_text: evaluation.question_text,
        stimulus_text: evaluation.stimulus_text,
        source_text: evaluation.source_text,
        created_at: evaluation.created_at,
        updated_at: evaluation.updated_at,
      };

      if (evaluation.user_id) {
        evPayload.user_id = evaluation.user_id;
      }

      let { error: evError } = await supabase.from('evaluations').upsert(evPayload);

      // If user_id column doesn't exist yet in Supabase table, retry without user_id
      if (evError && evError.message && evError.message.includes('user_id')) {
        delete evPayload.user_id;
        const retry = await supabase.from('evaluations').upsert(evPayload);
        evError = retry.error;
      }

      if (evError) throw evError;

      // 2. Insert evaluation parts
      if (evaluation.parts && evaluation.parts.length > 0) {
        // delete existing results to avoid duplicates
        await supabase.from('evaluation_results').delete().eq('evaluation_id', evaluation.id);

        const resultsToInsert = evaluation.parts.map((p) => ({
          evaluation_id: evaluation.id,
          question_part: p.part,
          max_marks: p.max_score,
          ai_score: p.score,
          teacher_score: p.teacher_score,
          question_alignment: {
            ...p.question_alignment,
            question_demand: p.question_demand,
            student_answer_summary: p.student_answer_summary,
            stimulus_usage: p.stimulus_usage,
          },
          correct_points: p.correct_points,
          wrong_points: p.wrong_points,
          missing_points: p.missing_points,
          importance_reason: p.importance_reason,
          improvement_points: p.improvement_points,
          feedback: p.feedback,
          confidence: p.confidence,
          handwriting_clarity: p.handwriting_clarity,
        }));

        await supabase.from('evaluation_results').insert(resultsToInsert);
      }

      // 3. Insert files
      if (evaluation.files && evaluation.files.length > 0) {
        await supabase.from('evaluation_files').delete().eq('evaluation_id', evaluation.id);

        const filesToInsert = evaluation.files.map((f) => ({
          evaluation_id: evaluation.id,
          file_type: f.file_type,
          file_url: f.file_url,
          file_name: f.file_name,
          page_order: f.page_order,
        }));

        await supabase.from('evaluation_files').insert(filesToInsert);
      }

      // Keep in-memory cache in sync
      const existingIdx = inMemoryEvaluations.findIndex((e) => e.id === evaluation.id);
      if (existingIdx >= 0) {
        inMemoryEvaluations[existingIdx] = evaluation;
      } else {
        inMemoryEvaluations.unshift(evaluation);
      }

      return evaluation;
    } catch (err) {
      console.warn('Supabase save failed, storing in memory cache:', err);
    }
  }

  // In-memory fallback
  const existingIdx = inMemoryEvaluations.findIndex((e) => e.id === evaluation.id);
  if (existingIdx >= 0) {
    inMemoryEvaluations[existingIdx] = evaluation;
  } else {
    inMemoryEvaluations.unshift(evaluation);
  }

  return evaluation;
}

export async function updateTeacherScoreAndReview(params: {
  id: string;
  teacherScore: number;
  teacherFeedback?: string;
  partScores?: Record<string, number>;
}): Promise<Evaluation | null> {
  const existing = await getEvaluationById(params.id);
  if (!existing) return null;

  const updated: Evaluation = {
    ...existing,
    teacher_score: params.teacherScore,
    teacher_feedback: params.teacherFeedback,
    status: 'reviewed',
    updated_at: new Date().toISOString(),
    parts: existing.parts.map((p) => {
      if (params.partScores && params.partScores[p.part] !== undefined) {
        return {
          ...p,
          teacher_score: params.partScores[p.part],
        };
      }
      return p;
    }),
  };

  return await saveEvaluation(updated);
}
