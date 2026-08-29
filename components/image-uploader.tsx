'use client';

import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helperText?: string;
}

type ProcessedImageResult = {
  dataUrl: string;
  blob: Blob;
  originalSizeKb: number;
  optimizedSizeKb: number;
  width: number;
  height: number;
};

// Auto-resize large images (max 1200px) and convert format to modern WebP (quality 82%)
async function processAndConvertToWebp(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<ProcessedImageResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Enable high quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP Data URL
        let dataUrl = canvas.toDataURL('image/webp', quality);
        // Fallback to JPEG if browser doesn't support WebP canvas export
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create WebP blob'));
              return;
            }
            const optimizedSizeKb = Math.round(blob.size / 1024);
            resolve({
              dataUrl,
              blob,
              originalSizeKb,
              optimizedSizeKb,
              width,
              height,
            });
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
    };
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการเปิดไฟล์'));
  });
}

export function ImageUploader({ label, value, onChange, folder = 'uploads', helperText }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [optimizeStats, setOptimizeStats] = useState<{ orig: number; opt: number; dim: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP, HEIC)');
      return;
    }
    setErrorMsg('');
    setUploading(true);
    setOptimizeStats(null);

    try {
      // 1. Process, Auto-Resize & Convert to WebP on client side
      const processed = await processAndConvertToWebp(file, 1200, 1200, 0.82);
      setOptimizeStats({
        orig: processed.originalSizeKb,
        opt: processed.optimizedSizeKb,
        dim: `${processed.width} × ${processed.height}px`,
      });

      // 2. If Supabase is configured, attempt upload to Storage bucket `dct-media` as .webp
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

          const { data, error } = await client.storage.from('dct-media').upload(fileName, processed.blob, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: true,
          });

          if (!error && data?.path) {
            const { data: publicUrlData } = client.storage.from('dct-media').getPublicUrl(data.path);
            if (publicUrlData?.publicUrl) {
              onChange(publicUrlData.publicUrl);
              setUploading(false);
              return;
            }
          }
        } catch {
          // Fallback to compressed WebP data URL
        }
      }

      // 3. Fallback: Use optimized WebP Data URL directly
      onChange(processed.dataUrl);
      setUploading(false);
    } catch (err: any) {
      setErrorMsg(`เกิดข้อผิดพลาดในการแปลงรูปภาพ: ${err?.message || 'ข้อผิดพลาด'}`);
      setUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--brown)' }}>{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{ background: 'none', border: 0, color: '#806c60', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {showUrlInput ? '📁 ซ่อนช่องวาง URL' : '🔗 หรือวางลิงก์ URL'}
        </button>
      </div>

      {showUrlInput && (
        <input
          className="field"
          style={{ marginBottom: '10px', fontSize: '13px' }}
          placeholder="วางลิงก์รูปภาพ เช่น https://... หรือ /products/..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOptimizeStats(null);
          }}
        />
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--red)' : '#d8c7b7'}`,
          borderRadius: '6px',
          padding: value ? '14px' : '28px 16px',
          textAlign: 'center',
          backgroundColor: dragOver ? '#fff5f0' : '#fffdf9',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/jpg, image/heic"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ color: 'var(--red)', fontWeight: 600, padding: '16px 0' }}>
            ⚡ กำลัง Resize ขนาดภาพ และแปลงเป็นฟอร์แมต WebP อัตโนมัติ…
          </div>
        ) : value ? (
          <div>
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
              <img
                src={value}
                alt="Uploaded preview"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '180px',
                  borderRadius: '4px',
                  margin: '0 auto',
                  objectFit: 'contain',
                  border: '1px solid #eadfd4',
                }}
              />
            </div>

            {optimizeStats && (
              <div
                style={{
                  marginTop: '8px',
                  display: 'inline-block',
                  background: '#f0fff4',
                  border: '1px solid #c6f6d5',
                  color: '#22543d',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ✓ แปลงเป็น WebP สำเร็จ: {optimizeStats.orig} KB → <b>{optimizeStats.opt} KB</b> ({optimizeStats.dim})
              </div>
            )}

            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                className="button secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                🔄 เปลี่ยนรูปภาพใหม่
              </button>
              <button
                type="button"
                className="button danger"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                  setOptimizeStats(null);
                }}
              >
                🗑️ ลบรูป
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
            <b style={{ color: 'var(--red)', fontSize: '15px' }}>คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง</b>
            <p className="small" style={{ color: '#806c60', margin: '4px 0 0' }}>
              หรือลากไฟล์รูปภาพมาวางที่นี่ (ระบบจะ Resize และแปลงเป็น <b>WebP</b> ให้อัตโนมัติ)
            </p>
          </div>
        )}
      </div>

      {helperText && <span className="small" style={{ color: '#806c60', marginTop: '6px', display: 'block' }}>{helperText}</span>}
      {errorMsg && <div className="notice notice-error" style={{ marginTop: '8px', fontSize: '13px' }}>{errorMsg}</div>}
    </div>
  );
}
