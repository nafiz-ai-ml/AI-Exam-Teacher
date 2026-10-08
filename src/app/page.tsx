import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CoreCapabilitiesSection } from '@/components/landing/CoreCapabilitiesSection';
import { EvaluationPreviewSection } from '@/components/landing/EvaluationPreviewSection';
import { TeacherPhilosophySection } from '@/components/landing/TeacherPhilosophySection';
import { CallToActionSection } from '@/components/landing/CallToActionSection';

export const metadata: Metadata = {
  title: 'শিক্ষক সহায়ক | AI সৃজনশীল খাতা মূল্যায়ন প্ল্যাটফর্ম',
  description:
    'বাংলা সৃজনশীল (CQ) পরীক্ষার ধারণাগত মূল্যায়ন। শিক্ষার্থীর নিজস্ব ভাষায় লেখা উত্তর বুঝে প্রশ্নের চাহিদা অনুযায়ী নির্ভুল মূল্যায়ন সহায়িকা।',
  openGraph: {
    title: 'শিক্ষক সহায়ক — AI সৃজনশীল খাতা মূল্যায়ন',
    description:
      'মুখস্থ উত্তরের মিল নয়, শিক্ষার্থীর নিজস্ব ভাষায় সঠিক উত্তর যাচাইয়ের ব্যক্তিগত শিক্ষক প্ল্যাটফর্ম।',
    locale: 'bn_BD',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <CoreCapabilitiesSection />
      <EvaluationPreviewSection />
      <TeacherPhilosophySection />
      <CallToActionSection />
    </div>
  );
}
