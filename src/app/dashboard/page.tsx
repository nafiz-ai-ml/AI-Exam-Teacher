import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { getAllEvaluations, getStorageStatus } from '@/lib/db/store';
import { isAiConfigured, getAiModel } from '@/lib/ai/client';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { AppShell } from '@/components/layout/AppShell';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/sign-in?redirect=/dashboard');
  }

  const evaluations = await getAllEvaluations(user.id);
  const storageStatus = await getStorageStatus();
  const aiInfo = {
    isConfigured: isAiConfigured(),
    model: getAiModel(),
  };

  return (
    <AppShell title="ড্যাশবোর্ড" subtitle="শিক্ষকের ব্যক্তিগত সহায়ক">
      <DashboardClient
        initialEvaluations={evaluations}
        storageStatus={storageStatus}
        aiInfo={aiInfo}
      />
    </AppShell>
  );
}
