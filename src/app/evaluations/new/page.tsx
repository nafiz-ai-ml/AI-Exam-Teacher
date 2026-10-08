import React from 'react';
import NewEvaluationForm from '@/components/evaluations/NewEvaluationForm';
import { AppShell } from '@/components/layout/AppShell';

export const metadata = {
  title: 'নতুন খাতা যাচাই | সৃজনশীল মূল্যায়ন',
  description: '৬ষ্ঠ ও ৭ম শ্রেণির শিক্ষার্থীদের সৃজনশীল পরীক্ষার উত্তরপত্র যাচাই করুন।',
};

export default function NewEvaluationPage() {
  return (
    <AppShell
      title="নতুন মূল্যায়ন তৈরি করুন"
      subtitle="প্রশ্ন ও শিক্ষার্থীর উত্তরপত্র যাচাই"
      breadcrumbs={[
        { label: 'ড্যাশবোর্ড', href: '/dashboard' },
        { label: 'নতুন মূল্যায়ন' },
      ]}
      showNewAction={false}
    >
      <NewEvaluationForm />
    </AppShell>
  );
}
