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

// Compress image on client side to keep size optimal (max 1200px, jpeg 85%)
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

export function ImageUploader({ label, value, onChange, folder = 'uploads', helperText }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP)');
      return;
    }
    setErrorMsg('');
    setUploading(true);

    try {
      // 1. If Supabase is configured, attempt upload to Storage bucket `dct-media`
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const ext = file.name.split('.').pop() || 'jpg';
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

          const { data, error } = await client.storage.from('dct-media').upload(fileName, file, {
            cacheControl: '3600',
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
          // Fallback to compressed base64
        }
      }

      // 2. Client-side compressed data URL (works anywhere, zero setup needed)
      const compressedDataUrl = await compressImage(file);
      onChange(compressedDataUrl);
      setUploading(false);
    } catch (err: any) {
      setErrorMsg(`อัปโหลดรูปภาพไม่สำเร็จ: ${err?.message || 'ข้อผิดพลาด'}`);
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
          onChange={(e) => onChange(e.target.value)}
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
          accept="image/png, image/jpeg, image/webp, image/jpg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ color: 'var(--red)', fontWeight: 600, padding: '12px 0' }}>
            ⏳ กำลังประมวลผลและอัปโหลดรูปภาพ…
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
              หรือลากไฟล์รูปภาพ (JPG, PNG, WEBP) มาวางที่นี่
            </p>
          </div>
        )}
      </div>

      {helperText && <span className="small" style={{ color: '#806c60', marginTop: '6px', display: 'block' }}>{helperText}</span>}
      {errorMsg && <div className="notice notice-error" style={{ marginTop: '8px', fontSize: '13px' }}>{errorMsg}</div>}
    </div>
  );
}
