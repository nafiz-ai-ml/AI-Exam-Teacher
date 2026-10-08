import { getAiClient, getAiModel, isAiConfigured } from './client';
import { BENGALI_AI_SYSTEM_PROMPT, buildEvaluationUserPrompt } from './prompts';
import {
  StructuredEvaluationResult,
  StructuredEvaluationResultSchema,
} from './schemas';
import { ClassLevel, Subject } from '@/types/evaluation';

export class AiEvaluationError extends Error {
  bengaliMessage: string;
  statusCode: number;

  constructor(bengaliMessage: string, statusCode = 500) {
    super(bengaliMessage);
    this.name = 'AiEvaluationError';
    this.bengaliMessage = bengaliMessage;
    this.statusCode = statusCode;
  }
}

export function mapAiErrorToBengali(err: any): AiEvaluationError {
  const status = err?.status || err?.statusCode || 500;
  const message = (err?.message || '').toLowerCase();

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
    return new AiEvaluationError('AI API Key সেট করা হয়নি।', 400);
  }
  if (!process.env.OPENAI_BASE_URL || process.env.OPENAI_BASE_URL.trim() === '') {
    return new AiEvaluationError('AI API Base URL সেট করা হয়নি।', 400);
  }
  if (!process.env.OPENAI_MODEL || process.env.OPENAI_MODEL.trim() === '') {
    return new AiEvaluationError('AI Model সেট করা হয়নি।', 400);
  }

  if (status === 401 || message.includes('api key') || message.includes('unauthorized') || message.includes('forbidden')) {
    return new AiEvaluationError('AI API Key গ্রহণ করা হয়নি। API configuration পরীক্ষা করুন।', 401);
  }
  if (status === 404 && (message.includes('model') || message.includes('not found'))) {
    return new AiEvaluationError('নির্বাচিত AI Model এই provider-এ সমর্থিত নয় বা পাওয়া যায়নি।', 404);
  }
  if (
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes('econnrefused') ||
    message.includes('fetch failed') ||
    message.includes('network')
  ) {
    return new AiEvaluationError('এই মুহূর্তে AI সেবায় সংযোগ করা যাচ্ছে না।', 503);
  }
  if (message.includes('timeout') || message.includes('timed out') || message.includes('etimedout')) {
    return new AiEvaluationError('AI মূল্যায়নের সময়সীমা শেষ হয়েছে। আবার চেষ্টা করুন।', 504);
  }
  if (message.includes('invalid base url') || message.includes('failed to parse url') || message.includes('invalid url')) {
    return new AiEvaluationError('AI API সংযোগের ঠিকানা সঠিক নয়।', 400);
  }
  if (err?.name === 'ZodError') {
    return new AiEvaluationError('AI থেকে প্রাপ্ত উত্তরের কাঠামোগত ফরম্যাট সঠিক পাওয়া যায়নি। আবার চেষ্টা করুন।', 502);
  }

  return new AiEvaluationError(
    'AI সেবা থেকে মূল্যায়ন পাওয়া যায়নি। API সংযোগ, API Key বা Model configuration পরীক্ষা করুন।',
    status
  );
}

export interface EvaluateCreativeAnswerParams {
  classLevel: ClassLevel;
  subject: Subject;
  chapter?: string;
  totalMarks: number;
  questionText?: string;
  stimulusText?: string;
  sourceText?: string;
  partsConfig: { part: string; max_score: number }[];
  questionImages?: string[];
  stimulusImages?: string[];
  sourceImages?: string[];
  answerImages?: string[];
}

export async function evaluateCreativeAnswer(
  params: EvaluateCreativeAnswerParams
): Promise<StructuredEvaluationResult> {
  const isConfigured = isAiConfigured();

  if (isConfigured) {
    try {
      const client = getAiClient();
      if (!client) {
        throw new AiEvaluationError('AI ক্লায়েন্ট শুরু করা সম্ভব হয়নি। API Key পরীক্ষা করুন।', 400);
      }

      const model = getAiModel();
      const userTextPrompt = buildEvaluationUserPrompt({
        classLevel: params.classLevel,
        subject: params.subject,
        chapter: params.chapter,
        totalMarks: params.totalMarks,
        questionText: params.questionText,
        stimulusText: params.stimulusText,
        sourceText: params.sourceText,
        partsConfig: params.partsConfig,
        questionImagesCount: params.questionImages?.length ?? 0,
        stimulusImagesCount: params.stimulusImages?.length ?? 0,
        sourceImagesCount: params.sourceImages?.length ?? 0,
        answerImagesCount: params.answerImages?.length ?? 0,
      });

      // Multimodal payload formulation
      const contentParts: Array<
        | { type: 'text'; text: string }
        | { type: 'image_url'; image_url: { url: string; detail?: 'auto' | 'low' | 'high' } }
      > = [{ type: 'text', text: userTextPrompt }];

      // Attach question images if present
      if (params.questionImages && params.questionImages.length > 0) {
        contentParts.push({ type: 'text', text: '\n[প্রশ্নপত্রের ছবিসমূহ]:' });
        params.questionImages.forEach((imgUrl, idx) => {
          if (imgUrl.startsWith('data:image/') || imgUrl.startsWith('http')) {
            contentParts.push({
              type: 'text',
              text: `\n[প্রশ্নপত্রের পাতা ${idx + 1}]:`,
            });
            contentParts.push({
              type: 'image_url',
              image_url: { url: imgUrl, detail: 'high' },
            });
          }
        });
      }

      // Attach stimulus images if present
      if (params.stimulusImages && params.stimulusImages.length > 0) {
        contentParts.push({ type: 'text', text: '\n[উদ্দীপকের ছবিসমূহ]:' });
        params.stimulusImages.forEach((imgUrl, idx) => {
          if (imgUrl.startsWith('data:image/') || imgUrl.startsWith('http')) {
            contentParts.push({
              type: 'text',
              text: `\n[উদ্দীপকের পাতা ${idx + 1}]:`,
            });
            contentParts.push({
              type: 'image_url',
              image_url: { url: imgUrl, detail: 'high' },
            });
          }
        });
      }

      // Attach textbook/source reference images if present
      if (params.sourceImages && params.sourceImages.length > 0) {
        contentParts.push({ type: 'text', text: '\n[পাঠ্যবই/রেফারেন্সের ছবিসমূহ]:' });
        params.sourceImages.forEach((imgUrl, idx) => {
          if (imgUrl.startsWith('data:image/') || imgUrl.startsWith('http')) {
            contentParts.push({
              type: 'text',
              text: `\n[পাঠ্যবই রেফারেন্সের পাতা ${idx + 1}]:`,
            });
            contentParts.push({
              type: 'image_url',
              image_url: { url: imgUrl, detail: 'high' },
            });
          }
        });
      }

      // Attach student handwritten answer images in page sequence
      if (params.answerImages && params.answerImages.length > 0) {
        contentParts.push({
          type: 'text',
          text: `\n[শিক্ষার্থীর হস্তলিখিত উত্তরের ছবিসমূহ (মোট ${params.answerImages.length}টি পাতা ক্রমানুসারে)]:`,
        });
        params.answerImages.forEach((imgUrl, idx) => {
          if (imgUrl.startsWith('data:image/') || imgUrl.startsWith('http')) {
            contentParts.push({
              type: 'text',
              text: `\n[শিক্ষার্থীর হস্তলিখিত উত্তরের পাতা ${idx + 1} (সর্বমোট ${params.answerImages?.length}টি পাতার মধ্যে ${idx + 1} নম্বর পৃষ্ঠা)]:\nদয়া করে এই পাতাটিকে পূর্ববর্তী ও পরবর্তী পাতার ধারাবাহিক অংশ হিসেবে বিবেচনা করুন।`,
            });
            contentParts.push({
              type: 'image_url',
              image_url: { url: imgUrl, detail: 'high' },
            });
          }
        });
      }

      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: BENGALI_AI_SYSTEM_PROMPT },
          { role: 'user', content: contentParts as any },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2, // Consistent & objective conceptual grading
      });

      const responseContent = response.choices[0]?.message?.content;
      if (!responseContent) {
        throw new AiEvaluationError('AI থেকে কোনো প্রতিক্রিয়া পাওয়া যায়নি।', 502);
      }

      // Clean potential markdown wrapper if model outputted code fence
      let cleanedJson = responseContent.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      let parsedJson: any;
      try {
        parsedJson = JSON.parse(cleanedJson);
      } catch (parseErr: any) {
        console.error('[AI Evaluator] JSON Parse error:', parseErr?.message);
        throw new AiEvaluationError('AI থেকে প্রাপ্ত উত্তরের ফরম্যাট সঠিক পাওয়া যায়নি।', 502);
      }

      const validatedResult = StructuredEvaluationResultSchema.parse({
        ...parsedJson,
        evaluation_source: 'real_ai',
      });
      return validatedResult;
    } catch (err: any) {
      // Safe server-side diagnostic logging (never log full secrets)
      console.error(
        '[AI Evaluation Error] Code:',
        err?.status || err?.statusCode,
        'Message:',
        err?.message || err
      );

      // CRITICAL: DO NOT SILENTLY USE MOCK DATA when real API is configured!
      // Throw controlled failure with clean Bengali message for the teacher.
      throw mapAiErrorToBengali(err);
    }
  }

  // If API credentials are NOT configured at all, explicit offline development fallback
  return generateContextualMockEvaluation(params);
}

/**
 * Generates an educational, highly contextual evaluation conforming to Bengali CQ rules
 * ONLY when running in explicit offline development mode without API credentials.
 */
function generateContextualMockEvaluation(
  params: EvaluateCreativeAnswerParams
): StructuredEvaluationResult {
  const partsEvaluations = params.partsConfig.map((partConfig) => {
    const partName = partConfig.part;
    const maxScore = partConfig.max_score;

    if (partName === 'ক') {
      return {
        part: 'ক',
        score: maxScore,
        max_score: maxScore,
        question_demand: 'প্রশ্নে সরাসরি মৌলিক সংজ্ঞা বা তথ্যের নির্ভুলতা জানতে চাওয়া হয়েছে।',
        student_answer_summary: 'শিক্ষার্থী নিজের ভাষায় মূল ধারণাটি সংক্ষেপে ও স্পষ্টভাবে উপস্থাপন করেছে।',
        stimulus_usage: {
          used: false,
          quality: 'not_used' as const,
          explanation: 'ক অংশে উদ্দীপকের ব্যবহারের প্রয়োজন নেই।',
        },
        question_alignment: {
          level: 'high' as const,
          percentage: 100,
          explanation: 'শিক্ষার্থী নিজস্ব সহজ ভাষায় মূল তথ্যটি সরাসরি এবং সঠিকভাবে উল্লেখ করেছে। গাইড বইয়ের মুখস্থ ভাষা না হলেও তথ্য সঠিক হওয়ায় পূর্ণ নম্বর প্রযোজ্য।',
        },
        correct_points: [
          'সঠিক সংজ্ঞা/তথ্যটি নিজস্ব ভাষায় চিহ্নিত করেছে',
          'প্রশ্নে চাওয়া মূল ধারণার স্পষ্ট প্রতিফলন রয়েছে',
        ],
        wrong_points: [],
        missing_points: [],
        importance_reason: 'জ্ঞানমূলক প্রশ্নের মূল উদ্দেশ্য তথ্যের সঠিকতা যাচাই করা।',
        improvement_points: ['ভাষাগত উপস্থাপনা আরও কিছুটা গুছিয়ে লেখা যেতে পারে।'],
        feedback: 'প্রশ্নের চাহিদা পুরোপুরি পূরণ হয়েছে। সংক্ষিপ্ত কিন্তু ধারণাগতভাবে সম্পূর্ণ সঠিক।',
        confidence: 'high' as const,
        handwriting_clarity: 'clear' as const,
      };
    }

    if (partName === 'খ') {
      const awarded = Math.max(1, maxScore - 0.5);
      return {
        part: 'খ',
        score: awarded,
        max_score: maxScore,
        question_demand: 'প্রশ্নে বিষয়টির অন্তর্নিহিত কারণ বা তাৎপর্য নিজের ভাষায় ব্যাখ্যা করতে বলা হয়েছে।',
        student_answer_summary: 'শিক্ষার্থী বিষয়টি অনুধাবন করে কারণ দর্শিয়ে নিজের ভাষায় বুঝিয়েছে।',
        stimulus_usage: {
          used: false,
          quality: 'not_used' as const,
          explanation: 'খ অংশে উদ্দীপক ব্যবহারের বাধ্যবাধকতা নেই।',
        },
        question_alignment: {
          level: 'high' as const,
          percentage: 85,
          explanation: 'অনুধাবনের মূল ভাবটি শিক্ষার্থী নিজস্ব বাক্যে চমৎকারভাবে ব্যাখ্যা করেছে। ব্যাখ্যার গভীরতা যথেষ্ট ভালো।',
        },
        correct_points: [
          'মূল ভাব ও ধারণা যথাযথভাবে চিহ্নিত করা হয়েছে',
          'শিক্ষার্থী নিজের ভাষায় প্রাসঙ্গিক যুক্তি দিয়ে কারণটি বুঝিয়েছে',
        ],
        wrong_points: [],
        missing_points: ['দ্বিতীয় প্যারায় আরও একটি সুস্পষ্ট উদাহরণ দিলে ব্যাখ্যাটি আরও সমৃদ্ধ হতো।'],
        importance_reason: 'অনুধাবনমূলক প্রশ্নে ধারণার পেছনের কারণ স্পষ্ট করা জরুরি।',
        improvement_points: ['ব্যাখ্যার উপসংহারে এক লাইনে মূল বক্তব্যটি পুনরায় সংক্ষেপ করলে ভালো হবে।'],
        feedback: 'শিক্ষার্থী বিষয়টি ভালোভাবে বুঝতে পেরেছে। মুখস্থ না লিখে নিজের ভাষায় গুছিয়ে লেখার প্রচেষ্টা প্রশংসনীয়।',
        confidence: 'high' as const,
        handwriting_clarity: 'clear' as const,
      };
    }

    if (partName === 'গ') {
      const awarded = Math.max(1, Math.round(maxScore * 0.75 * 10) / 10);
      return {
        part: 'গ',
        score: awarded,
        max_score: maxScore,
        question_demand: 'উদ্দীপকের তথ্যের সাথে পাঠ্যবইয়ের সংশ্লিষ্ট ধারণার সংযোগ ও প্রয়োগ ব্যাখ্যা করতে বলা হয়েছে।',
        student_answer_summary: 'শিক্ষার্থী উদ্দীপকের পরিস্থিতির সাথে পাঠ্যবইয়ের বিষয়ের সাদৃশ্য চিহ্নিত করে প্রয়োগ করেছে।',
        stimulus_usage: {
          used: true,
          quality: 'effective' as const,
          explanation: 'উদ্দীপকের প্রাসঙ্গিক তথ্য চিহ্নিত করে পাঠ্যবইয়ের তত্ত্বের সাথে যোগসূত্র স্থাপন করেছে।',
        },
        question_alignment: {
          level: 'medium' as const,
          percentage: 75,
          explanation: 'উদ্দীপকের চরিত্র/ঘটনার সাথে পাঠ্যবইয়ের সাদৃশ্য অংশটি চিহ্নিত হয়েছে, তবে প্রয়োগমূলক সমন্বয়ে কিছুটা অপূর্ণতা রয়েছে।',
        },
        correct_points: [
          'উদ্দীপকের মূল পরিস্থিতির সাথে বিষয়বস্তুর যোগসূত্র স্থাপন করতে পেরেছে',
          'বিষয়বস্তুর প্রয়োজনীয় দিকগুলো শনাক্ত করেছে',
        ],
        wrong_points: [
          'উদ্দীপকের একটি নির্দিষ্ট ঘটনার সাথে পাঠ্যবইয়ের অংশের তুলনা কিছুটা অগভীর রয়ে গেছে',
        ],
        missing_points: [
          'উদ্দীপক থেকে নির্দিষ্ট উদাহরণ টেনে সরাসরি পাঠ্যবইয়ের ধারণার সাথে সংযোগ স্পষ্ট করা হয়নি',
        ],
        importance_reason: 'প্রয়োগমূলক অংশে উদ্দীপক ও পাঠ্যবইয়ের মধ্যে সেতু বন্ধন গড়ে তোলা আবশ্যক।',
        improvement_points: [
          'তিনটি পৃথক স্তরে (জ্ঞান, অনুধাবন, প্রয়োগ) উত্তর সাজালে সর্বোচ্চ নম্বর পাওয়া সম্ভব।',
          'উদ্দীপকের সংশ্লিষ্ট অংশ সরাসরি উল্লেখ করে ব্যাখ্যা প্রদান করা উচিত।',
        ],
        feedback: 'শিক্ষার্থীর ধারণাগত স্পষ্টতা রয়েছে। উদ্দীপক ব্যবহারের কৌশলটি আরেকটু নিখুঁত করতে হবে।',
        confidence: 'medium' as const,
        handwriting_clarity: 'partially_clear' as const,
        criteria_evaluated: ['উদ্দীপকের সঠিক ব্যবহার', 'পাঠ্যবইয়ের সাথে সংযোগ', 'প্রয়োগমূলক ব্যাখ্যা'],
      };
    }

    // Default / 'ঘ' (উচ্চতর দক্ষতামূলক)
    const awarded = Math.max(1, Math.round(maxScore * 0.7 * 10) / 10);
    return {
      part: partName,
      score: awarded,
      max_score: maxScore,
      question_demand: 'উদ্দীপক ও পাঠ্যবইয়ের তথ্যের ওপর ভিত্তি করে যৌক্তিক বিশ্লেষণ ও নিজস্ব সিদ্ধান্তমূলক মতামত চাওয়া হয়েছে।',
      student_answer_summary: 'শিক্ষার্থী উক্তিটির পক্ষে বিশ্লেষণমূলক যুক্তি দিয়ে নিজস্ব দৃষ্টিভঙ্গি ব্যক্ত করেছে।',
      stimulus_usage: {
        used: true,
        quality: 'partial' as const,
        explanation: 'উদ্দীপকের তথ্য ব্যবহার করা হয়েছে, তবে আরও গভীর তুলনামূলক বিশ্লেষণের সুযোগ ছিল।',
      },
      question_alignment: {
        level: 'medium' as const,
        percentage: 70,
        explanation: 'উচ্চতর দক্ষতার প্রশ্নে শিক্ষার্থী মতামত দিয়েছে কিন্তু যুক্তির গভীরতা ও তুলনামূলক বিচার কিছুটা সীমিত।',
      },
      correct_points: [
        'প্রশ্নে চাহিত বক্তব্যের পক্ষে নিজের যৌক্তিক অভিমত ব্যক্ত করেছে',
        'বিষয়বস্তুর ইতিবাচক ও বাস্তবমুখী দিক চিহ্নিত করেছে',
      ],
      wrong_points: [],
      missing_points: [
        'যৌক্তিক বিশ্লেষণের ক্ষেত্রে দ্বিমুখী দৃষ্টিভঙ্গি বা গভীর কারণ-ফল সম্পর্কের অনুপস্থিতি',
        'একটি দৃঢ় ও সুস্পষ্ট সিদ্ধান্তমূলক উপসংহার টানা হয়নি',
      ],
      importance_reason: 'উচ্চতর দক্ষতায় শুধুমাত্র বর্ণনা নয়, বিশ্লেষণ ও নিজস্ব সিদ্ধান্তমূলক রায় দেওয়া বাধ্যতামূলক।',
      improvement_points: [
        'সিদ্ধান্ত গ্রহণের পূর্বে স্বপক্ষে ও বিপক্ষে শক্তিশালী যুক্তি উপস্থাপন করতে হবে।',
        'উদ্দীপক এবং পাঠ্যবই—উভয়ের তথ্য একীভূত করে চূড়ান্ত মতামত প্রদান করতে হবে।',
      ],
      feedback: 'উত্তরটিতে চিন্তন দক্ষতার ছাপ রয়েছে। বিশ্লেষণের ধারাবাহিকতা বজায় রেখে আরও জোরালো উপসংহার দেওয়া প্রয়োজন।',
      confidence: 'medium' as const,
      handwriting_clarity: 'clear' as const,
      criteria_evaluated: ['গভীর বিশ্লেষণ', 'যুক্তি ও কারণ-ফল সম্পর্ক', 'সিদ্ধান্ত ও মূল্যায়ন'],
    };
  });

  const totalScore = partsEvaluations.reduce((sum, p) => sum + p.score, 0);

  return {
    total_score: totalScore,
    total_marks: params.totalMarks,
    confidence: 'high',
    evaluation_source: 'mock',
    overall_feedback:
      '[অফলাইন ডেভেলপমেন্ট নমুনা] শিক্ষার্থী প্রশ্নের মূল উদ্দেশ্য বুঝতে পেরেছে এবং মুখস্থ বিদ্যার সাহায্য না নিয়ে নিজের সহজ বাংলায় উত্তর উপস্থাপন করেছে।',
    parts: partsEvaluations,
  };
}
