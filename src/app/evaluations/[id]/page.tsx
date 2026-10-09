import React from 'react';
import { getEvaluationById } from '@/lib/db/store';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import EvaluationResultView from '@/components/results/EvaluationResultView';
import { AppShell } from '@/components/layout/AppShell';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  const evaluation = await getEvaluationById(id, user?.id);
  if (!evaluation) {
    return { title: 'খাতা পাওয়া যায়নি' };
  }
  return {
    title: `${evaluation.class_level} শ্রেণি - ${evaluation.subject} মূল্যায়ন ফলাফল`,
    description: `AI ও শিক্ষকের সমন্বিত সৃজনশীল মূল্যায়ন ফলাফল`,
  };
}

export default async function EvaluationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  const evaluation = await getEvaluationById(id, user?.id);

  if (!evaluation) {
    return (
      <AppShell
        title="মূল্যায়ন ফলাফল"
        breadcrumbs={[
          { label: 'ড্যাশবোর্ড', href: '/dashboard' },
          { label: 'খাতা পাওয়া যায়নি' },
        ]}
      >
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            মূল্যায়নটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-sm text-slate-600">
            অনুরোধকৃত খাতার আইডিটি সঠিক নয় অথবা আপনার এই মূল্যায়নটি দেখার অনুমতি নেই।
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-900 text-white hover:bg-indigo-950 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              ড্যাশবোর্ডে ফিরে যান
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="মূল্যায়ন ফলাফল"
      subtitle={`${evaluation.class_level} শ্রেণি • ${evaluation.subject}`}
      breadcrumbs={[
        { label: 'ড্যাশবোর্ড', href: '/dashboard' },
        { label: `${evaluation.class_level} শ্রেণি - ${evaluation.subject}` },
      ]}
    >
      <EvaluationResultView initialEvaluation={evaluation} />
    </AppShell>
  );
}
