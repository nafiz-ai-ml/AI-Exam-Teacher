import { NextResponse } from 'next/server';
import { isAiConfigured, getAiModel } from '@/lib/ai/client';
import { isSupabaseConfigured } from '@/lib/db/supabase';
import { getStorageStatus } from '@/lib/db/store';

export async function GET() {
  const isDev = process.env.NODE_ENV !== 'production';

  const aiConfigured = isAiConfigured();
  const aiModel = getAiModel();
  const supabaseConfigured = isSupabaseConfigured();
  const storageStatus = await getStorageStatus();

  return NextResponse.json({
    environment: process.env.NODE_ENV || 'development',
    ai: {
      status: aiConfigured ? 'connected' : 'not_configured',
      provider: 'InMetech (OpenAI-compatible)',
      model: aiModel,
      isConfigured: aiConfigured,
      label: aiConfigured ? 'AI API সংযুক্ত' : 'AI API কনফিগার করা হয়নি',
    },
    supabase: {
      status: supabaseConfigured ? 'connected' : 'not_configured',
      isConfigured: supabaseConfigured,
      hasTables: storageStatus.hasTables,
      hasBucket: storageStatus.hasBucket,
      activeMode: storageStatus.mode,
      label: storageStatus.message,
    },
    storage: {
      mode: storageStatus.mode,
      label: storageStatus.mode === 'supabase' ? 'Supabase Storage' : 'লোকাল মেমরি/ডেভেলপমেন্ট স্টোরেজ',
    },
    bengaliSummary: {
      aiStatus: aiConfigured ? 'সক্রিয় ও প্রস্তুত' : 'অফলাইন/কনফিগারেশন বাকি',
      storageStatus: storageStatus.message,
    },
  });
}
