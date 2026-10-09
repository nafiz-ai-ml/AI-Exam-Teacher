'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs sm:text-sm',
    lg: 'p-1.5 text-sm sm:text-base',
  };

  const itemSizeStyles = {
    sm: 'py-1 px-2.5',
    md: 'py-2 px-3.5',
    lg: 'py-2.5 px-4.5',
  };

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center bg-slate-100 rounded-xl border border-slate-200/80 select-none w-full sm:w-auto',
        sizeStyles[size],
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 sm:flex-initial inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer text-slate-600 gap-2',
              itemSizeStyles[size],
              isSelected
                ? 'bg-white text-indigo-950 font-semibold shadow-xs border border-slate-200/60'
                : 'hover:text-slate-900 hover:bg-slate-200/50'
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none',
                  isSelected ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
