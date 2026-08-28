'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLogin() {
  const router = useRouter();
  const [message, setMessage] = useState('กรอกอีเมลและรหัสผ่านของผู้ดูแลระบบ');
  const [loading, setLoading] = useState(false);
  const next = '/admin';

  useEffect(() => {
    supabaseBrowser().auth.getSession().then(({ data }) => {
      if (data.session) router.replace(next);
    });
  }, [next, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
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

  return <main className="wrap cart"><section className="card login-card"><div className="eyebrow">DCT CMS</div><h1>เข้าสู่ระบบผู้ดูแล</h1><p className="lead">{message}</p><form onSubmit={submit}><label className="login-label">อีเมล<input className="field" type="email" name="email" autoComplete="email" required /></label><label className="login-label">รหัสผ่าน<input className="field" type="password" name="password" autoComplete="current-password" required /></label><div className="actions"><button className="button" disabled={loading}>{loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}</button><Link className="button secondary" href="/">กลับหน้าเว็บไซต์</Link></div></form></section></main>;
}
