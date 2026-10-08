import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন।' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'সার্ভার ডেটাবেস সংযোগে সমস্যা হয়েছে।' }, { status: 500 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        return NextResponse.json({ error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' }, { status: 401 });
      }
      if (msg.includes('email not confirmed')) {
        return NextResponse.json(
          { error: 'আপনার ইমেইলটি এখনও যাচাই করা হয়নি। ইনবক্সে গিয়ে যাচাই করুন।' },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: error.message || 'সাইন ইন করা সম্ভব হয়নি।' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'সাইন ইন করার সময় সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
