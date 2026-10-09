'use client';

import React, { useState, Suspense } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  showNewAction?: boolean;
}

export function AppShell({
  children,
  title,
  subtitle,
  breadcrumbs,
  showNewAction = true,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar for Mobile and Desktop */}
      <Suspense fallback={<div className="hidden lg:block w-64 bg-slate-900 h-screen fixed inset-y-0" />}>
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>

      {/* Main Container offset by sidebar width on lg screens */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-200">
        <AppHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          onToggleSidebar={() => setSidebarOpen(true)}
          showNewAction={showNewAction}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
