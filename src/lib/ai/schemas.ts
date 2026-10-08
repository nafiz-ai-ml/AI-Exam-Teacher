import { z } from 'zod';

const StringArraySchema = z
  .array(z.string())
  .or(
    z.string().transform((str) => (str.trim() ? [str.trim()] : []))
  )
  .or(z.null().transform(() => []))
  .or(z.undefined().transform(() => []))
  .default([]);

const ConfidenceSchema = z
  .enum(['high', 'medium', 'low'])
  .or(
    z.string().transform((val) => {
      const lower = val.toLowerCase();
      if (val === 'উচ্চ' || lower.includes('high')) return 'high';
      if (val === 'কম' || lower.includes('low')) return 'low';
      return 'medium';
    })
  )
  .default('medium');

const HandwritingSchema = z
  .enum(['clear', 'partially_clear', 'unclear'])
  .or(
    z.string().transform((val) => {
      const lower = val.toLowerCase();
      if (val === 'স্পষ্ট' || lower === 'clear') return 'clear';
      if (val === 'অস্পষ্ট' || lower === 'unclear') return 'unclear';
      return 'partially_clear';
    })
  )
  .optional()
  .default('clear');

export const QuestionAlignmentSchema = z
  .object({
    level: ConfidenceSchema.optional(),
    percentage: z.number().min(0).max(100).optional(),
    score: z.number().optional(),
    explanation: z.string().optional().default('প্রশ্নের চাহিদার সাথে সংগতিপূর্ণ।'),
  })
  .transform((data) => {
    const rawPct =
      data.percentage !== undefined
        ? data.percentage
        : typeof data.score === 'number'
        ? Math.min(100, Math.round(data.score * 10))
        : 75;

    const level =
      data.level ||
      (rawPct >= 80 ? 'high' : rawPct >= 50 ? 'medium' : 'low');

    return {
      level,
      percentage: rawPct,
      explanation: data.explanation || 'প্রশ্নের মূল চাহিদা পূরণ হয়েছে।',
    };
  });

export const StimulusUsageSchema = z
  .object({
    used: z.boolean().default(false),
    quality: z
      .enum(['effective', 'partial', 'superficial', 'not_used'])
      .or(
        z.string().transform((val) => {
          const l = val.toLowerCase();
          if (l.includes('effect') || l === 'যথাযথ') return 'effective';
          if (l.includes('part') || l === 'আংশিক') return 'partial';
          if (l.includes('superficial') || l === 'কেবল উল্লেখ') return 'superficial';
          return 'not_used';
        })
      )
      .optional()
      .default('not_used'),
    explanation: z.string().default(''),
  })
  .or(
    z.string().transform((str) => ({
      used: str.trim().length > 0 && !str.includes('প্রয়োজন নেই'),
      quality: 'partial' as const,
      explanation: str,
    }))
  )
  .optional();

export const QuestionPartEvaluationSchema = z.object({
  part: z.string().min(1),
  score: z.number().min(0),
  max_score: z.number().min(1),
  question_demand: z.string().optional().default(''),
  student_answer_summary: z.string().optional().default(''),
  stimulus_usage: StimulusUsageSchema,
  question_alignment: QuestionAlignmentSchema,
  correct_points: StringArraySchema,
  wrong_points: StringArraySchema,
  missing_points: StringArraySchema,
  importance_reason: z.string().optional(),
  improvement_points: StringArraySchema,
  feedback: z.string().min(1),
  confidence: ConfidenceSchema,
  handwriting_clarity: HandwritingSchema,
  criteria_evaluated: z.array(z.string()).optional(),
});

export const StructuredEvaluationResultSchema = z.object({
  total_score: z.number().min(0),
  total_marks: z.number().min(1),
  confidence: ConfidenceSchema,
  overall_feedback: z.string().min(1),
  evaluation_source: z.enum(['real_ai', 'mock']).default('real_ai'),
  parts: z.array(QuestionPartEvaluationSchema).min(1),
});

export type StructuredEvaluationResult = z.infer<typeof StructuredEvaluationResultSchema>;
