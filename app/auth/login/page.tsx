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
    // Check if already authenticated via Master Admin session
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dct_admin_auth');
        if (stored) {
          router.replace(next);
          return;
        }
      } catch {}
    }

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

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();

    // 1. Master Admin credentials validation
    const validEmails = [
      'admin@dcintertrade.com',
      'admin@duangcharoen.com',
      'doungchalern.dct@gmail.com',
      'admin',
    ];
    const validPasswords = ['dct2026', 'dctadmin2026', 'admin1234', 'password'];

    if (
      validEmails.includes(email.toLowerCase()) &&
      validPasswords.includes(password)
    ) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'dct_admin_auth',
          JSON.stringify({ email: email || 'admin@dcintertrade.com', loggedInAt: Date.now() })
        );
      }
      setLoading(false);
      router.replace(next);
      return;
    }

    // 2. Fallback to Supabase Auth if configured
    if (isConfigured) {
      try {
        const { data, error } = await supabaseBrowser().auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.session) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'dct_admin_auth',
              JSON.stringify({ email: data.session.user.email, loggedInAt: Date.now() })
            );
          }
          setLoading(false);
          router.replace(next);
          return;
        }
      } catch {}
    }

    setLoading(false);
    setMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
  }

  return (
    <main className="wrap cart">
      <section className="card login-card">
        <div className="eyebrow">DCT CMS</div>
        <h1>เข้าสู่ระบบผู้ดูแล</h1>
        <p className="lead">{message}</p>

        <div className="notice notice-info" style={{ marginBottom: '18px', fontSize: '13px', lineHeight: 1.6 }}>
          💡 <b>ข้อมูลเข้าใช้งานระบบผู้ดูแล (Master Admin):</b><br />
          • อีเมล: <code>admin@dcintertrade.com</code><br />
          • รหัสผ่าน: <code>dct2026</code>
        </div>

        <form onSubmit={submit}>
          <label className="login-label">
            อีเมล
            <input
              className="field"
              type="text"
              name="email"
              autoComplete="email"
              defaultValue="admin@dcintertrade.com"
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
              defaultValue="dct2026"
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
