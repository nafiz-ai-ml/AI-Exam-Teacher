import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AI খাতা মূল্যায়নকারী | শিক্ষকের ব্যক্তিগত সহায়ক টুল',
  description:
    '৬ষ্ঠ ও ৭ম শ্রেণির সৃজনশীল (CQ) পরীক্ষার ধারণাগত মূল্যায়ন। মুখস্থ উত্তরের মিল নয়, শিক্ষার্থীর নিজস্ব ভাষায় সঠিক উত্তর যাচাইয়ের প্ল্যাটফর্ম।',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
