'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/data';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Rfq = {
  ref: string;
  status: string;
  items: unknown[];
  customer: { company: string; name: string };
};

const tabs = ['ภาพรวม', 'สินค้า', 'หมวดหมู่', 'บริการ', 'ใบรับรอง', 'ข่าวสาร', 'FAQ', 'ข้อมูลติดต่อ', 'RFQ'];

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState('ภาพรวม');
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const client = supabaseBrowser();
    client.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/auth/login?next=/admin');
        return;
      }
      setEmail(data.session.user.email ?? 'ผู้ดูแลระบบ');
      setRfqs(JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]'));
      setChecking(false);
    });
  }, [router]);

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    router.replace('/auth/login');
  }

  if (checking) return <main className="wrap section"><p className="lead">กำลังตรวจสอบสิทธิ์ผู้ดูแล…</p></main>;

  return <main className="wrap section">
    <div className="eyebrow">DCT CMS · STAGING</div>
    <div className="admin-heading"><div><h1>จัดการเนื้อหา DCT</h1><p className="small">เข้าสู่ระบบในชื่อ {email}</p></div><button className="button secondary" onClick={signOut}>ออกจากระบบ</button></div>
    <div className="notice">CMS อยู่ระหว่างเชื่อมข้อมูลจริงจาก Supabase โดยหน้าจัดการนี้เข้าถึงได้เฉพาะผู้ดูแลที่ล็อกอินแล้ว</div>
    <div className="admin-nav">{tabs.map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'RFQ' ? <section className="card"><h2>คำขอใบเสนอราคา ({rfqs.length})</h2>{rfqs.length ? rfqs.map((rfq) => <div className="spec" key={rfq.ref}><div><b>{rfq.ref}</b><br /><span className="small">{rfq.customer.company} · {rfq.customer.name} · {rfq.items.length} รายการ</span></div><span className="tag">{rfq.status}</span></div>) : <p>ยังไม่มีคำขอจากเบราว์เซอร์นี้</p>}</section> : <section className="card"><h2>จัดการ {tab}</h2><p>โครงสร้างข้อมูลพร้อมสำหรับให้ผู้ดูแลจัดการจาก Supabase</p>{tab === 'สินค้า' && <div className="grid three">{products.map((product) => <article className="card" key={product.id}><b>{product.name}</b><br /><span className="small">{product.code} · {product.category}</span></article>)}</div>}<Link className="button" href="/">ดูหน้าเว็บไซต์</Link></section>}
  </main>;
}
