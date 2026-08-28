'use client';
import { FormEvent, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function UpdatePassword() {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('กำลังยืนยันคำเชิญ…');
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setMessage('ระบบผู้ดูแลกำลังตั้งค่า กรุณารับลิงก์คำเชิญฉบับใหม่');
      return;
    }
    const client = supabaseBrowser();
    client.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
      setMessage(data.session ? 'ตั้งรหัสผ่านสำหรับบัญชีผู้ดูแล DCT' : 'ลิงก์คำเชิญไม่ถูกต้องหรือหมดอายุ กรุณาขอคำเชิญใหม่');
    });
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirm = String(form.get('confirm') || '');
    if (password.length < 12 || password !== confirm) { setMessage('รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษรและต้องตรงกัน'); return; }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { error } = await supabaseBrowser().auth.updateUser({ password });
    setMessage(error ? error.message : 'ตั้งรหัสผ่านเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบ CMS ได้');
  }
  return <main className="wrap cart"><div className="card"><div className="eyebrow">DCT CMS</div><h1>ตั้งรหัสผ่านผู้ดูแล</h1><p className="lead">{message}</p>{ready && <form onSubmit={submit}><div className="form-grid"><input className="field" name="password" type="password" minLength={12} required placeholder="รหัสผ่านใหม่ (อย่างน้อย 12 ตัวอักษร)"/><input className="field" name="confirm" type="password" minLength={12} required placeholder="ยืนยันรหัสผ่าน"/></div><div className="actions"><button className="button">บันทึกรหัสผ่าน</button></div></form>}</div></main>;
}
