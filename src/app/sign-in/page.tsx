'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, ArrowRight, ArrowLeft, Lock, Mail } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('ইমেইল এবং পাসওয়ার্ড উভয়ই পূরণ করুন।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'সাইন ইন করতে সমস্যা হয়েছে।');
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
      setIsLoading(false);
    }
  };

  return (
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
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-900 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-950 transition-colors">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
          </div>
          <div className="text-left">
            <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight block">
              শিক্ষক সহায়ক
            </span>
            <span className="text-[11px] font-medium text-teal-700 -mt-1 block">
              সৃজনশীল খাতা মূল্যায়ন
            </span>
          </div>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          আবার স্বাগতম
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          আপনার শিক্ষক অ্যাকাউন্টে সাইন ইন করে সংরক্ষিত খাতা ও মূল্যায়ন দেখুন।
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
        {errorMessage && (
          <Alert type="error" title="সাইন ইন ব্যর্থ">
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ইমেইল ঠিকানা <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-indigo-900 hover:bg-indigo-950 active:bg-slate-950 shadow-xs disabled:opacity-60 transition-all text-sm cursor-pointer mt-2"
          >

            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>সাইন ইন করা হচ্ছে...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span>সাইন ইন করুন</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
          অ্যাকাউন্ট নেই?{' '}
          <Link
            href="/sign-up"
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white/50 rounded-2xl animate-pulse" />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
