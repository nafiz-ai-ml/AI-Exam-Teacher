import { NextResponse } from 'next/server';
import { generateMathCaptcha } from '@/lib/auth/captcha';

export async function GET() {
  const challenge = generateMathCaptcha();
  return NextResponse.json(challenge);
}
