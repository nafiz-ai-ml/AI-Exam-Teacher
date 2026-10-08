'use client';

import React, { useState } from 'react';
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
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
