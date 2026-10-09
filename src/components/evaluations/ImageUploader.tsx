'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  ArrowLeft,
  ArrowRight,
  Eye,
  FileImage,
  FileType,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { toBengaliNumber } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { renderPdfToImages } from '@/lib/utils/pdfRenderer';

export interface UploadedImageFile {
  id: string;
  file_name: string;
  file_url: string; // Base64 or object URL
  file_size?: number;
  page_order: number;
}

interface ImageUploaderProps {
  label: string;
  description?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
  images: UploadedImageFile[];
  onChange: (images: UploadedImageFile[]) => void;
  required?: boolean;
}

export function ImageUploader({
  label,
  description,
  multiple = false,
  maxFiles = 15,
  maxSizeMb = 20,
  images,
  onChange,
  required = false,
}: ImageUploaderProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<UploadedImageFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Process selected image files
  const handleImageFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    if (!files || files.length === 0) return;

    if (!multiple && images.length >= 1) {
      // Replace single file
    } else if (images.length + files.length > maxFiles) {
      setErrorMessage(`সর্বোচ্চ ${toBengaliNumber(maxFiles)}টি পাতা আপলোড করা যাবে।`);
      return;
    }

    const newUploadedFiles: UploadedImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // If PDF dropped into image zone
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        await handlePdfFile(file);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        setErrorMessage('শুধুমাত্র ইমেজ (JPG, PNG, WebP) অথবা PDF ফাইল আপলোড করা যাবে।');
        continue;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        setErrorMessage(`ছবির সাইজ সর্বোচ্চ ${toBengaliNumber(maxSizeMb)} MB হতে পারবে।`);
        continue;
      }

      try {
        const base64 = await compressImageIfNeeded(file);
        newUploadedFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file_name: file.name,
          file_url: base64,
          file_size: file.size,
          page_order: multiple ? images.length + newUploadedFiles.length + 1 : 1,
        });
      } catch (err: any) {
        setErrorMessage(err.message || 'ছবি প্রসেস করতে ব্যর্থ হয়েছে।');
      }
    }

    if (newUploadedFiles.length > 0) {
      if (multiple) {
        const combined = [...images, ...newUploadedFiles].map((item, idx) => ({
          ...item,
          page_order: idx + 1,
        }));
        onChange(combined);
      } else {
        onChange([newUploadedFiles[0]]);
      }
    }
  };

  // Process selected PDF file
  const handlePdfFile = async (file: File) => {
    setErrorMessage(null);
    if (!file) return;

    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorMessage(`PDF সাইজ সর্বোচ্চ ${toBengaliNumber(maxSizeMb)} MB হতে পারবে।`);
      return;
    }

    setIsProcessingPdf(true);
    setPdfProgressText('PDF লোড করা হচ্ছে...');

    try {
      const renderedPages = await renderPdfToImages(file, (current, total) => {
        setPdfProgressText(`PDF পৃষ্ঠা প্রস্তুত হচ্ছে (${toBengaliNumber(current)}/${toBengaliNumber(total)})...`);
      });

      const newPages: UploadedImageFile[] = renderedPages.map((p, idx) => ({
        id: `${Date.now()}-pdf-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        file_name: `${file.name.replace(/\.[^/.]+$/, '')} (পৃষ্ঠা ${toBengaliNumber(p.pageNumber)})`,
        file_url: p.dataUrl,
        page_order: multiple ? images.length + idx + 1 : idx + 1,
      }));

      if (multiple) {
        const combined = [...images, ...newPages].map((item, idx) => ({
          ...item,
          page_order: idx + 1,
        }));
        onChange(combined);
      } else {
        onChange(newPages.slice(0, 1));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'PDF রূপান্তর করতে সমস্যা হয়েছে। অন্য ফাইল চেষ্টা করুন।');
    } finally {
      setIsProcessingPdf(false);
      setPdfProgressText(null);
    }
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    const reordered = filtered.map((item, idx) => ({
      ...item,
      page_order: idx + 1,
    }));
    onChange(reordered);
  };

  const clearAll = () => {
    onChange([]);
  };

  const moveOrder = (index: number, direction: 'prev' | 'next') => {
    if (direction === 'prev' && index === 0) return;
    if (direction === 'next' && index === images.length - 1) return;

    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    const newItems = [...images];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const reordered = newItems.map((item, idx) => ({
      ...item,
      page_order: idx + 1,
    }));
    onChange(reordered);
  };

  return (
    <div className="space-y-3.5">
      {/* Header Label and Page count */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        {multiple && images.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              {toBengaliNumber(images.length)}টি পাতা নির্বাচিত
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="সব পাতা মুছে ফেলুন"
            >
              মুছে ফেলুন
            </button>
          </div>
        )}
      </div>

      {description && <p className="text-xs text-slate-500 leading-normal">{description}</p>}

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center space-x-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PDF Processing Indicator */}
      {isProcessingPdf && (
        <div className="flex items-center justify-center space-x-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs sm:text-sm font-medium animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-700" />
          <span>{pdfProgressText || 'PDF প্রসেস করা হচ্ছে...'}</span>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) handleImageFiles(e.target.files);
          if (imageInputRef.current) imageInputRef.current.value = '';
        }}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) handlePdfFile(e.target.files[0]);
          if (pdfInputRef.current) pdfInputRef.current.value = '';
        }}
        className="hidden"
      />

      {/* Upload Zone & Action Buttons */}
      {(!multiple && images.length === 0) || multiple ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files) handleImageFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center transition-all ${
            isDragOver
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-indigo-900">
              <UploadCloud className="w-6 h-6 text-indigo-800" />
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                ফাইল ড্র্যাগ করে আনুন অথবা নিচের বাটন চাপুন
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500">
                JPG, PNG, WebP বা PDF (পৃষ্ঠাগুলো স্বয়ংক্রিয়ভাবে আলাদা হবে)
              </p>
            </div>

            {/* Two Action Buttons: Image vs PDF */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isProcessingPdf}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-indigo-500 active:bg-slate-100 shadow-xs transition-all cursor-pointer"
              >
                <FileImage className="w-4 h-4 text-indigo-700" />
                <span>ছবি আপলোড করুন</span>
              </button>

              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isProcessingPdf}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-900 text-white hover:bg-indigo-950 active:bg-slate-950 shadow-xs transition-all cursor-pointer"
              >
                <FileType className="w-4 h-4 text-teal-300" />
                <span>PDF আপলোড করুন</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Thumbnail Grid & Page Management */}
      {images.length > 0 && (
        <div
          className={`grid gap-3 pt-1 ${
            multiple
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col"
            >
              {/* Image Preview Container */}
              <div
                onClick={() => setPreviewImage(img)}
                className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center cursor-pointer"
              >
                <img
                  src={img.file_url}
                  alt={img.file_name}
                  className="object-cover w-full h-full"
                />

                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 bg-indigo-950/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  পাতা {toBengaliNumber(img.page_order)}
                </div>

                {/* Zoom overlay hint */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-5 h-5 drop-shadow-sm" />
                </div>
              </div>

              {/* Bottom Card Controls: Ordering & Delete */}
              <div className="p-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[90px]" title={img.file_name}>
                  {img.file_name}
                </span>

                <div className="flex items-center space-x-1">
                  {multiple && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveOrder(index, 'prev');
                        }}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-500 hover:text-indigo-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="আগের পাতায় সরান"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveOrder(index, 'next');
                        }}
                        disabled={index === images.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-indigo-900 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="পরের পাতায় সরান"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="এই পাতা মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Large Image Preview Modal */}
      {previewImage && (
        <Modal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          title={`পাতা ${toBengaliNumber(previewImage.page_order)} এর পূর্ণাঙ্গ ছবি`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="max-h-[70vh] overflow-auto rounded-xl bg-slate-900 flex items-center justify-center p-2">
              <img
                src={previewImage.file_url}
                alt={previewImage.file_name}
                className="max-h-[68vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{previewImage.file_name}</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/**
 * Automatically resizes & compresses high-resolution camera images on the client side.
 * Converts 5-12MB mobile photos to ~250-400KB crisp JPEGs (max 1600px).
 * Prevents Vercel 4.5MB request limit overflow (HTTP 413) and accelerates OpenAI Vision inference.
 */
function compressImageIfNeeded(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        try {
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
