import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '০';
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
}

export function toBengaliScore(score: number, maxScore: number): string {
  return `${toBengaliNumber(score)} / ${toBengaliNumber(maxScore)}`;
}

export function toBengaliPercentage(pct: number): string {
  return `${toBengaliNumber(Math.round(pct))}%`;
}

export function toBengaliDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const day = toBengaliNumber(date.getDate());
    const month = months[date.getMonth()];
    const year = toBengaliNumber(date.getFullYear());
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'বিকাল' : 'সকাল';
    const displayHour = hours % 12 || 12;

    return `${day} ${month}, ${year} (${period} ${toBengaliNumber(displayHour)}:${toBengaliNumber(minutes)})`;
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'এইমাত্র';
    if (diff < 3600) return `${toBengaliNumber(Math.floor(diff / 60))} মিনিট আগে`;
    if (diff < 86400) return `${toBengaliNumber(Math.floor(diff / 3600))} ঘণ্টা আগে`;
    return `${toBengaliNumber(Math.floor(diff / 86400))} দিন আগে`;
  } catch {
    return 'কিছুক্ষণ আগে';
  }
}
