'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { EvaluationFile } from '@/types/evaluation';
import { toBengaliNumber } from '@/lib/utils';
import { Layers, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: EvaluationFile[];
}

export function FilePreviewModal({
  isOpen,
  onClose,
  files,
}: FilePreviewModalProps) {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    files[0]?.id || ''
  );

  const activeFile = files.find((f) => f.id === selectedFileId) || files[0];

  const getFileCategoryLabel = (type: string, order: number) => {
    switch (type) {
      case 'question':
        return 'প্রশ্নপত্র';
      case 'stimulus':
        return 'উদ্দীপক';
      case 'source':
        return 'পাঠ্যবই/রেফারেন্স';
      case 'answer':
        return `উত্তরের পাতা ${toBengaliNumber(order)}`;
      default:
        return 'সংযুক্ত ফাইল';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="সংযুক্ত প্রশ্নপত্র ও শিক্ষার্থীর খাতার পাতাসমূহ"
      maxWidth="full"
    >
      <div className="flex flex-col md:flex-row gap-6 min-h-[480px]">
        {/* Left Sidebar: Thumbnail list */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 pr-0 md:pr-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[140px] md:max-h-[550px] shrink-0">
          {files.map((file) => {
            const isSelected = file.id === (activeFile?.id || selectedFileId);
            return (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-3 shrink-0 md:shrink md:w-full ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                  <img
                    src={file.file_url}
                    alt={file.file_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="truncate text-xs">
                  <div className="font-bold">
                    {getFileCategoryLabel(file.file_type, file.page_order)}
                  </div>
                  <div className="text-[11px] text-slate-700 truncate max-w-[120px]">
                    {file.file_name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Area: Active Image Viewer */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-100/60 rounded-xl p-4 border border-slate-200 overflow-hidden">
          {activeFile ? (
            <div className="flex flex-col items-center max-h-[600px] w-full">
              <div className="mb-2 text-xs font-semibold text-slate-600 flex items-center justify-between w-full px-2">
                <span>
                  {getFileCategoryLabel(activeFile.file_type, activeFile.page_order)} • {activeFile.file_name}
                </span>
                <a
                  href={activeFile.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-emerald-700 hover:underline"
                >
                  পূর্ণ আকারে খুলুন <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <div className="overflow-auto max-h-[540px] w-full flex items-center justify-center p-2">
                <img
                  src={activeFile.file_url}
                  alt={activeFile.file_name}
                  className="max-h-[520px] max-w-full object-contain rounded-lg shadow-sm bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-700 p-8">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p>কোনো ফাইল পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
