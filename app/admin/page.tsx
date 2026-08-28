'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CmsCrud } from '@/components/cms-crud';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Rfq = { id?: string; reference?: string; status: string; company_name: string; contact_name: string; created_at?: string };
type Tab = 'overview' | 'products' | 'categories' | 'services' | 'certificates' | 'articles' | 'faqs' | 'contact' | 'rfqs';
const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'overview', label: 'ภาพรวม' }, { id: 'products', label: 'สินค้า' }, { id: 'categories', label: 'หมวดหมู่' }, { id: 'services', label: 'บริการ' }, { id: 'certificates', label: 'ใบรับรอง' }, { id: 'articles', label: 'ข่าวสาร' }, { id: 'faqs', label: 'FAQ' }, { id: 'contact', label: 'ข้อมูลติดต่อ' }, { id: 'rfqs', label: 'RFQ' },
];

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [rfqs, setRfqs] = useState<Rfq[]>([]);

  useEffect(() => {
    const client = supabaseBrowser();
    client.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/auth/login'); return; }
      setEmail(data.session.user.email ?? 'ผู้ดูแลระบบ');
      const { data: requests } = await client.from('rfqs').select('*').order('created_at', { ascending: false });
      setRfqs((requests ?? []) as Rfq[]);
      setChecking(false);
    });
  }, [router]);

  async function signOut() { await supabaseBrowser().auth.signOut(); router.replace('/auth/login'); }
  if (checking) return <main className="wrap section"><p className="lead">กำลังตรวจสอบสิทธิ์ผู้ดูแล…</p></main>;

  const resourceMap = { products: 'products', categories: 'categories', services: 'services', certificates: 'certificates', articles: 'articles', faqs: 'faqs' } as const;
  return <main className="wrap section"><div className="eyebrow">DCT CMS · STAGING</div><div className="admin-heading"><div><h1>จัดการเนื้อหา DCT</h1><p className="small">เข้าสู่ระบบในชื่อ {email}</p></div><button className="button secondary" onClick={signOut}>ออกจากระบบ</button></div><div className="notice">ใช้แท็บด้านล่างเพื่อเพิ่ม แก้ไข หรือลบข้อมูล ระบบบันทึกข้อมูลลง Supabase โดยตรง</div><div className="admin-nav">{tabs.map((item) => <button className={tab === item.id ? 'active' : ''} key={item.id} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
    {tab in resourceMap ? <CmsCrud resourceKey={resourceMap[tab as keyof typeof resourceMap]} /> : tab === 'rfqs' ? <section className="card"><h2>คำขอใบเสนอราคา ({rfqs.length})</h2>{rfqs.length ? rfqs.map((rfq) => <div className="spec" key={rfq.id}><div><b>{rfq.reference}</b><br /><span className="small">{rfq.company_name} · {rfq.contact_name}</span></div><span className="tag">{rfq.status}</span></div>) : <p>ยังไม่มีคำขอใบเสนอราคาในฐานข้อมูล</p>}</section> : <section className="card"><h2>{tab === 'contact' ? 'ข้อมูลติดต่อ' : 'ภาพรวม CMS'}</h2><p>{tab === 'contact' ? 'ข้อมูลติดต่อจะอยู่ใน Site Settings ในขั้นถัดไป' : 'เลือกแท็บสินค้า หมวดหมู่ บริการ ใบรับรอง ข่าวสาร หรือ FAQ เพื่อจัดการข้อมูล'}</p></section>}
  </main>;
}
