import crypto from 'crypto';
import { toBengaliNumber } from '@/lib/utils';

const CAPTCHA_SECRET =
  process.env.SUPABASE_ANON_KEY ||
  process.env.OPENAI_API_KEY ||
  'ai-exam-teacher-captcha-salt-2026';

export interface CaptchaChallenge {
  token: string;
  question: string;
}

const OPERATORS = [
  { sign: '+', bengaliSign: '+', fn: (a: number, b: number) => a + b },
  { sign: '-', bengaliSign: '-', fn: (a: number, b: number) => a - b },
  { sign: '×', bengaliSign: '×', fn: (a: number, b: number) => a * b },
];

export function generateMathCaptcha(): CaptchaChallenge {
  const opIndex = Math.floor(Math.random() * OPERATORS.length);
  const op = OPERATORS[opIndex];

  let num1 = Math.floor(Math.random() * 9) + 2; // 2..10
  let num2 = Math.floor(Math.random() * 8) + 1; // 1..8

  // For subtraction, ensure positive result
  if (op.sign === '-' && num1 < num2) {
    [num1, num2] = [num2, num1];
  }

  // For multiplication, keep numbers manageable
  if (op.sign === '×') {
    num1 = Math.floor(Math.random() * 6) + 2; // 2..7
    num2 = Math.floor(Math.random() * 5) + 2; // 2..6
  }

  const answer = op.fn(num1, num2);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  const salt = crypto.randomBytes(8).toString('hex');

  const payload = `${answer}:${expiresAt}:${salt}`;
  const hmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64url');

  const question = `${toBengaliNumber(num1)} ${op.bengaliSign} ${toBengaliNumber(num2)} = ?`;

  return {
    token,
    question,
  };
}

export function verifyMathCaptcha(token: string, userAnswer: string | number): { valid: boolean; error?: string } {
  if (!token || !userAnswer) {
    return { valid: false, error: 'গণিত যাচাইয়ের উত্তর প্রদান করুন।' };
  }

  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = raw.split(':');
    if (parts.length !== 4) {
      return { valid: false, error: 'গণিত যাচাইয়ের টোকেন সঠিক নয়।' };
    }

    const [expectedAnswerStr, expiresAtStr, salt, providedHmac] = parts;
    const payload = `${expectedAnswerStr}:${expiresAtStr}:${salt}`;
    const calculatedHmac = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payload).digest('hex');

    if (calculatedHmac !== providedHmac) {
      return { valid: false, error: 'গণিত যাচাইকরণ ব্যর্থ হয়েছে।' };
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      return { valid: false, error: 'গণিত যাচাইয়ের সময়সীমা শেষ হয়েছে। আবার চেষ্টা করুন।' };
    }

    // Convert potential Bengali digits to English for comparison
    const sanitizedAnswer = String(userAnswer)
      .replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)))
      .trim();

    if (parseInt(sanitizedAnswer, 10) !== parseInt(expectedAnswerStr, 10)) {
      return { valid: false, error: 'গণিতের উত্তরটি সঠিক নয়।' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'গণিত যাচাই প্রক্রিয়া চলাকালীন ত্রুটি হয়েছে।' };
  }
}
