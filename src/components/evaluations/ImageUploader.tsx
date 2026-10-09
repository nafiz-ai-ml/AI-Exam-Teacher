'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  FileImage,
  AlertCircle,
} from 'lucide-react';
import { toBengaliNumber } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

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
  maxFiles = 10,
  maxSizeMb = 15,
  images,
  onChange,
  required = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<UploadedImageFile | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!multiple && images.length >= 1) {
      // Replace existing single file
    } else if (images.length + files.length > maxFiles) {
      setErrorMessage(`সর্বোচ্চ ${toBengaliNumber(maxFiles)}টি ছবি আপলোড করা যাবে।`);
      return;
    }

    const newUploadedFiles: UploadedImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) আপলোড করা যাবে।');
        continue;
      }

      // Validate size
      if (file.size > maxSizeMb * 1024 * 1024) {
        setErrorMessage(`ছবির সাইজ সর্বোচ্চ ${toBengaliNumber(maxSizeMb)} MB হতে পারবে।`);
        continue;
      }

      // Read & auto-compress high-res camera photos to prevent Vercel 4.5MB payload limit
      const base64 = await compressImageIfNeeded(file);
      newUploadedFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file_name: file.name,
        file_url: base64,
        file_size: file.size,
        page_order: multiple ? images.length + i + 1 : 1,
      });
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

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {multiple && images.length > 0 && (
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {toBengaliNumber(images.length)}টি পাতা যুক্ত হয়েছে
          </span>
        )}
      </div>

      {description && <p className="text-xs text-slate-700 leading-normal">{description}</p>}

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center space-x-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop / Upload Trigger Box */}
      {(!multiple && images.length === 0) || multiple ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:scale-105 transition-all">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-slate-600">
              <span className="font-semibold text-emerald-700 group-hover:underline">
                ছবি নির্বাচন করুন
              </span>{' '}
              বা ড্রপ করুন
            </div>
            <p className="text-[11px] text-slate-400">
              JPG, PNG বা WebP (সর্বোচ্চ {toBengaliNumber(maxSizeMb)} MB)
              {multiple && ` • একাধিক পাতা পাতা-অনুযায়ী সাজানো যাবে`}
            </p>
          </div>
        </div>
      ) : null}

      {/* Image Preview & Ordering Grid */}
      {images.length > 0 && (
        <div
          className={`grid gap-3 ${
            multiple
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Image thumbnail */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={img.file_url}
                  alt={img.file_name}
                  className="object-cover w-full h-full"
                />

                {/* Page Badge */}
                {multiple && (
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    পাতা {toBengaliNumber(img.page_order)}
                  </div>
                )}

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(img);
                    }}
                    className="p-1.5 bg-white text-slate-700 hover:text-emerald-700 rounded-lg shadow-sm hover:scale-110 transition-transform"
                    title="বড় করে দেখুন"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="p-1.5 bg-white text-rose-600 hover:text-rose-700 rounded-lg shadow-sm hover:scale-110 transition-transform"
                    title="মুছে ফেলুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Footer with Details & Reordering */}
              <div className="p-2 flex items-center justify-between text-xs bg-white border-t border-slate-100">
                <span className="truncate max-w-[120px] text-slate-600 font-medium" title={img.file_name}>
                  {img.file_name}
                </span>

                {multiple && (
                  <div className="flex items-center space-x-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveOrder(index, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:hover:text-slate-400 rounded"
                      title="আগে নিন"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveOrder(index, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:hover:text-slate-400 rounded"
                      title="পরে নিন"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Preview Modal */}
      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title={
          previewImage
            ? `${previewImage.file_name} ${
                multiple ? `(পাতা ${toBengaliNumber(previewImage.page_order)})` : ''
              }`
            : 'ছবি প্রিভিউ'
        }
        maxWidth="4xl"
      >
        {previewImage && (
          <div className="flex flex-col items-center justify-center p-2">
            <img
              src={previewImage.file_url}
              alt={previewImage.file_name}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

/**
 * Automatically resizes & compresses high-resolution camera images on the client side.
 * Converts 5-12MB mobile phone photos to ~250-400KB crisp JPEGs (max 1600px).
 * Prevents Vercel 4.5MB request body size overflow (HTTP 413) and accelerates OpenAI Vision inference.
 */
function compressImageIfNeeded(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, read directly as base64
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

          // Downscale if larger than maxDimension
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
