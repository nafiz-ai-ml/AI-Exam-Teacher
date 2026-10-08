import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyMathCaptcha } from '@/lib/auth/captcha';

export async function POST(req: NextRequest) {
  try {
    const { email, password, captchaToken, captchaAnswer } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'একটি বৈধ ইমেইল ঠিকানা প্রদান করুন।' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।' }, { status: 400 });
    }

    // Verify Math CAPTCHA
    const captchaCheck = verifyMathCaptcha(captchaToken, captchaAnswer);
    if (!captchaCheck.valid) {
      return NextResponse.json({ error: captchaCheck.error || 'গণিতের উত্তরটি সঠিক নয়।' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'সার্ভার ডেটাবেস সংযোগে সমস্যা হয়েছে।' }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('user already exists')) {
        return NextResponse.json({ error: 'এই ইমেইল দিয়ে একটি অ্যাকাউন্ট ইতিমধ্যে আছে।' }, { status: 400 });
      }
      if (msg.includes('password')) {
        return NextResponse.json({ error: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি।' }, { status: 400 });
    }

    // Check if email confirmation is required
    const needsEmailConfirmation = data.user && (!data.session || data.user.identities?.length === 0);

    return NextResponse.json({
      success: true,
      user: data.user,
      needsEmailConfirmation,
      message: needsEmailConfirmation
        ? 'আপনার ইমেইলে একটি যাচাইকরণ লিংক পাঠানো হয়েছে। লিংকে ক্লিক করে অ্যাকাউন্ট সক্রিয় করুন।'
        : 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'অ্যাকাউন্ট তৈরি করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
