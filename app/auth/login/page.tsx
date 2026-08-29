'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

export default function AdminLogin() {
  const router = useRouter();
  const [message, setMessage] = useState('กรอกอีเมลและรหัสผ่านของผู้ดูแลระบบ');
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const next = '/admin';

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (configured) {
      supabaseBrowser().auth.getSession().then(({ data }) => {
        if (data?.session) router.replace(next);
      });
    }
  }, [next, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (!isConfigured) {
      // Allow login in local demo mode
      setLoading(false);
      router.replace(next);
      return;
    }

    const form = new FormData(event.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
    });
    setLoading(false);
    if (error) {
      setMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
      return;
    }
    router.replace(next);
  }

  return (
    <main className="wrap cart">
      <section className="card login-card">
        <div className="eyebrow">DCT CMS</div>
        <h1>เข้าสู่ระบบผู้ดูแล</h1>
        <p className="lead">{message}</p>

        {!isConfigured && (
          <div className="notice notice-info" style={{ marginBottom: '16px' }}>
            💡 <b>โหมดทดสอบในเครื่อง (Local Mode):</b> สามารถคลิกปุ่มเข้าสู่ระบบเพื่อเข้าใช้งานแผงควบคุม CMS ได้ทันที
          </div>
        )}

        <form onSubmit={submit}>
          <label className="login-label">
            อีเมล
            <input
              className="field"
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={!isConfigured ? 'admin@duangcharoen.com' : ''}
              required
            />
          </label>
          <label className="login-label">
            รหัสผ่าน
            <input
              className="field"
              type="password"
              name="password"
              autoComplete="current-password"
              defaultValue={!isConfigured ? 'password' : ''}
              required
            />
          </label>
          <div className="actions" style={{ marginTop: '24px' }}>
            <button className="button" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
            </button>
            <Link className="button secondary" href="/">
              กลับหน้าเว็บไซต์
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
