'use client';

import React, { useState } from 'react';
import { EvaluationFile } from '@/types/evaluation';
import { toBengaliNumber } from '@/lib/utils';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface AnswerSheetViewerProps {
  files: EvaluationFile[];
}

export function AnswerSheetViewer({ files }: AnswerSheetViewerProps) {
  const answerFiles = files.filter((f) => f.file_type === 'answer');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (answerFiles.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2 text-slate-500 text-xs">
        <FileText className="w-8 h-8 text-slate-400 mx-auto" />
        <p>কোনো উত্তরপত্রের ছবি পাওয়া যায়নি।</p>
      </div>
    );
  }

  const currentFile = answerFiles[selectedPageIndex] || answerFiles[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 60));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
      {/* Top Controls Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Page Switcher */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setSelectedPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={selectedPageIndex === 0}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="আগের পাতা"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-semibold text-slate-800 px-1">
            পাতা {toBengaliNumber(selectedPageIndex + 1)} / {toBengaliNumber(answerFiles.length)}
          </span>

          <button
            type="button"
            onClick={() => setSelectedPageIndex((prev) => Math.min(prev + 1, answerFiles.length - 1))}
            disabled={selectedPageIndex === answerFiles.length - 1}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="পরের পাতা"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
            title="ছোট করুন"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-1.5 py-1 rounded-lg hover:bg-slate-200 text-[11px] font-medium text-slate-600 cursor-pointer"
            title="রিসেট করুন"
          >
            {zoomLevel}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
            title="বড় করুন"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
            title="ঘোরান (Rotate 90°)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-indigo-900 cursor-pointer"
            title="পূর্ণাঙ্গ স্ক্রিনে দেখুন"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewer Container */}
      <div className="relative h-[480px] lg:h-[580px] bg-slate-900/95 overflow-auto flex items-center justify-center p-3 select-none">
        <div
          style={{
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 150ms ease-out',
          }}
          className="max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={currentFile.file_url}
            alt={currentFile.file_name}
            className="max-w-full max-h-[460px] lg:max-h-[560px] object-contain shadow-lg rounded"
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip (if multiple pages exist) */}
      {answerFiles.length > 1 && (
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto">
          {answerFiles.map((file, idx) => (
            <button
              key={file.id || idx}
              type="button"
              onClick={() => {
                setSelectedPageIndex(idx);
                setZoomLevel(100);
              }}
              className={`relative shrink-0 w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                selectedPageIndex === idx
                  ? 'border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                  : 'border-slate-300 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={file.file_url}
                alt={`পাতা ${toBengaliNumber(idx + 1)}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] text-white text-center font-bold">
                {toBengaliNumber(idx + 1)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`শিক্ষার্থীর উত্তরপত্র — পাতা ${toBengaliNumber(selectedPageIndex + 1)}`}
          size="lg"
        >
          <div className="max-h-[75vh] overflow-auto bg-slate-950 rounded-xl p-2 flex items-center justify-center">
            <img
              src={currentFile.file_url}
              alt={currentFile.file_name}
              className="max-h-[72vh] w-auto object-contain rounded"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
