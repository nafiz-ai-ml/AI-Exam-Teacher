import { NextRequest, NextResponse } from 'next/server';
import {
  getEvaluationById,
  updateTeacherScoreAndReview,
} from '@/lib/db/store';

import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    const evaluation = await getEvaluationById(id, user?.id);

    if (!evaluation) {
      return NextResponse.json(
        { error: 'মূল্যায়নটি খুঁজে পাওয়া যায়নি বা আপনার দেখার অনুমতি নেই।' },
        { status: 404 }
      );
    }

    return NextResponse.json(evaluation);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'মূল্যায়ন তথ্য লোড করতে ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    const existing = await getEvaluationById(id, user?.id);

    if (!existing) {
      return NextResponse.json(
        { error: 'মূল্যায়নটি খুঁজে পাওয়া যায়নি বা আপনার সম্পাদনার অনুমতি নেই।' },
        { status: 404 }
      );
    }

    const body = await req.json();

    const { teacherScore, teacherFeedback, partScores } = body;

    if (teacherScore === undefined || teacherScore === null) {
      return NextResponse.json(
        { error: 'শিক্ষকের চূড়ান্ত নম্বর দেওয়া আবশ্যক।' },
        { status: 400 }
      );
    }

    const updated = await updateTeacherScoreAndReview({
      id,
      teacherScore: Number(teacherScore),
      teacherFeedback,
      partScores,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'মূল্যায়নটি খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'শিক্ষকের মূল্যায়ন সংরক্ষণ ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}
