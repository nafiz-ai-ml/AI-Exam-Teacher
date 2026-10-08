'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, ArrowLeft, Lock, Mail, RotateCw, Calculator } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadCaptcha = async () => {
    setIsCaptchaLoading(true);
    try {
      const res = await fetch('/api/auth/captcha');
      const data = await res.json();
      setCaptchaToken(data.token);
      setCaptchaQuestion(data.question);
      setCaptchaAnswer('');
    } catch {
      setCaptchaQuestion('৫ + ৩ = ?');
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password || !confirmPassword) {
      setErrorMessage('সবগুলো ঘর পূরণ করুন।');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।');
      return;
    }

    if (!captchaAnswer.trim()) {
      setErrorMessage('গণিত যাচাইকরণ প্রশ্নের উত্তর দিন।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          captchaToken,
          captchaAnswer: captchaAnswer.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।');
      }

      if (data.requiresConfirmation) {
        setSuccessMessage(
          'আপনার অ্যাকাউন্টে একটি ভেরিফিকেশন ইমেইল পাঠানো হয়েছে। ইমেইলের লিংকে ক্লিক করে অ্যাকাউন্ট নিশ্চিত করুন।'
        );
      } else {
        setSuccessMessage('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।');
      loadCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>

        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight block">
                শিক্ষক সহায়ক
              </span>
              <span className="text-[11px] font-medium text-emerald-700 -mt-1 block">
                সৃজনশীল খাতা মূল্যায়ন
              </span>
            </div>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            আপনার অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 max-w-sm mx-auto">
            ব্যক্তিগতভাবে আপনার শিক্ষার্থীদের খাতা মূল্যায়নের জন্য অ্যাকাউন্ট তৈরি করুন।
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
          {errorMessage && (
            <Alert type="error" title="রেজিস্ট্রেশন ব্যর্থ">
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert type="success" title="অ্যাকাউন্ট তৈরি হয়েছে">
              {successMessage}
            </Alert>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="teacher@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  পাসওয়ার্ড <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৮ অক্ষর"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Math CAPTCHA challenge - Mobile Optimized */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                  <span className="flex items-center space-x-1.5">
                    <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                    <span>গণিত যাচাই <span className="text-rose-500">*</span></span>
                  </span>
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    disabled={isCaptchaLoading}
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 inline-flex items-center space-x-1 cursor-pointer font-bold shrink-0"
                    title="নতুন সমস্যা আনুন"
                  >
                    <RotateCw className={`w-3 h-3 ${isCaptchaLoading ? 'animate-spin' : ''}`} />
                    <span>নতুন সমস্যা</span>
                  </button>
                </div>

                <div className="flex items-stretch gap-2">
                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 text-sm tracking-wide select-none flex items-center justify-center shrink-0 min-w-[80px] shadow-xs">
                    {captchaQuestion || '...'}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="উত্তর দিন"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-full min-w-0 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 shadow-md shadow-emerald-700/20 hover:shadow-lg disabled:opacity-60 transition-all text-sm cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>অ্যাকাউন্ট তৈরি করা হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <span>অ্যাকাউন্ট তৈরি করুন</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link
              href="/sign-in"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
