'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CmsCrud } from '@/components/cms-crud';
import { CmsSettings } from '@/components/cms-settings';
import { CmsRfq } from '@/components/cms-rfq';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

type Tab =
  | 'overview'
  | 'contact'
  | 'products'
  | 'categories'
  | 'services'
  | 'certificates'
  | 'articles'
  | 'faqs'
  | 'rfqs';

const tabs: Array<{ id: Tab; label: string; icon: string }> = [
  { id: 'overview', label: 'ภาพรวม', icon: '📊' },
  { id: 'contact', label: 'ข้อมูลติดต่อ & เว็บไซต์', icon: '📍' },
  { id: 'products', label: 'สินค้า', icon: '🥩' },
  { id: 'categories', label: 'หมวดหมู่', icon: '📁' },
  { id: 'services', label: 'บริการ OEM', icon: '⚙️' },
  { id: 'certificates', label: 'ใบรับรอง', icon: '🏅' },
  { id: 'articles', label: 'ข่าวสาร', icon: '📰' },
  { id: 'faqs', label: 'FAQ', icon: '❓' },
  { id: 'rfqs', label: 'คำขอใบเสนอราคา (RFQ)', icon: '📑' },
];

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [stats, setStats] = useState({
    products: 6,
    categories: 3,
    services: 4,
    articles: 3,
    rfqs: 0,
  });

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      // Local/Staging demo mode
      setEmail('admin@duangcharoen.com (Local / Demo Mode)');
      
      // Load local RFQ stats
      if (typeof window !== 'undefined') {
        try {
          const loc = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
          if (Array.isArray(loc)) {
            setStats((prev) => ({ ...prev, rfqs: loc.length }));
          }
        } catch {
          // ignore
        }
      }
      setChecking(false);
      return;
    }

    const client = supabaseBrowser();
    client.auth.getSession().then(async ({ data }) => {
      if (!data?.session) {
        router.replace('/auth/login');
        return;
      }
      setEmail(data.session.user.email ?? 'ผู้ดูแลระบบ');

      // Fetch stats safely
      try {
        const [
          { count: prodCount },
          { count: catCount },
          { count: srvCount },
          { count: artCount },
          { count: rfqCount },
        ] = await Promise.all([
          client.from('products').select('*', { count: 'exact', head: true }),
          client.from('categories').select('*', { count: 'exact', head: true }),
          client.from('services').select('*', { count: 'exact', head: true }),
          client.from('articles').select('*', { count: 'exact', head: true }),
          client.from('rfqs').select('*', { count: 'exact', head: true }),
        ]);

        let localRfqCount = 0;
        if (typeof window !== 'undefined') {
          try {
            const loc = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
            localRfqCount = Array.isArray(loc) ? loc.length : 0;
          } catch {
            // ignore
          }
        }

        setStats({
          products: prodCount || 6,
          categories: catCount || 3,
          services: srvCount || 4,
          articles: artCount || 3,
          rfqs: Math.max(rfqCount || 0, localRfqCount),
        });
      } catch {
        // keep fallback stats
      }

      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });
  }, [router]);

  async function signOut() {
    if (isConfigured) {
      await supabaseBrowser().auth.signOut();
    }
    router.replace('/auth/login');
  }

  if (checking) {
    return (
      <main className="wrap section">
        <p className="lead">กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ…</p>
      </main>
    );
  }

  const resourceMap = {
    products: 'products',
    categories: 'categories',
    services: 'services',
    certificates: 'certificates',
    articles: 'articles',
    faqs: 'faqs',
  } as const;

  return (
    <main className="wrap section">
      <div className="eyebrow">DCT CMS · DUANGCHAROEN INTERTRADE</div>
      <div className="admin-heading" style={{ margin: '12px 0 20px' }}>
        <div>
          <h1>ระบบจัดการเนื้อหาเว็บไซต์ (CMS)</h1>
          <p className="small">
            เข้าสู่ระบบในชื่อ <b>{email}</b>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/" target="_blank" className="button secondary" style={{ fontSize: '13px' }}>
            🌐 เปิดหน้าเว็บ
          </Link>
          <button className="button secondary" onClick={signOut} style={{ fontSize: '13px' }}>
            ออกจากระบบ
          </button>
        </div>
      </div>

      {!isConfigured && (
        <div className="notice notice-info" style={{ marginBottom: '20px' }}>
          ℹ️ <b>โหมดพัฒนาในเครื่อง (Local Mode):</b> ยังไม่ได้ตั้งค่า URL Supabase ในไฟล์ <code>.env.local</code> ระบบจะบันทึกและจำลองข้อมูลผ่านพื้นที่จัดเก็บในเบราว์เซอร์ให้คุณทดสอบได้ทุกฟังก์ชัน
        </div>
      )}

      <div className="notice" style={{ marginBottom: '24px' }}>
        💡 <b>คำแนะนำ:</b> คุณสามารถคลิกเลือกแท็บด้านล่างเพื่อ <b>แก้ไขข้อมูลติดต่อและที่อยู่</b>, <b>เพิ่ม/แก้ไขสินค้า</b>, <b>ดูใบเสนอราคา RFQ</b> หรือจัดการเนื้อหาได้ทันที
      </div>

      <div className="admin-nav">
        {tabs.map((item) => (
          <button
            className={tab === item.id ? 'active' : ''}
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <section className="card">
          <h2>📊 ภาพรวมระบบจัดการเนื้อหา (Overview)</h2>
          <p className="lead" style={{ marginBottom: '24px' }}>
            ยินดีต้อนรับสู่ระบบบริหารจัดการเว็บไซต์ DCT B2B Food Supply Partner
          </p>

          <div className="grid four" style={{ marginBottom: '32px' }}>
            <div
              className="card"
              style={{ cursor: 'pointer', borderLeft: '4px solid var(--red)' }}
              onClick={() => setTab('contact')}
            >
              <div className="num">CONTACT & SETTINGS</div>
              <h3 style={{ margin: '8px 0 4px', fontSize: '22px' }}>📍 ข้อมูลติดต่อ</h3>
              <p className="small">จัดการที่อยู่, เบอร์โทร, LINE, อีเมล และข้อความหลัก</p>
            </div>

            <div
              className="card"
              style={{ cursor: 'pointer', borderLeft: '4px solid var(--gold)' }}
              onClick={() => setTab('products')}
            >
              <div className="num">PRODUCTS</div>
              <h3 style={{ margin: '8px 0 4px', fontSize: '22px' }}>🥩 {stats.products} สินค้า</h3>
              <p className="small">จัดการรายการสินค้า, รูปแบบตัดแต่ง และสเปก</p>
            </div>

            <div
              className="card"
              style={{ cursor: 'pointer', borderLeft: '4px solid var(--brown)' }}
              onClick={() => setTab('rfqs')}
            >
              <div className="num">RFQ QUOTATIONS</div>
              <h3 style={{ margin: '8px 0 4px', fontSize: '22px' }}>📑 {stats.rfqs} ใบขอราคา</h3>
              <p className="small">ตรวจสอบคำขอใบเสนอราคาจากลูกค้า B2B</p>
            </div>

            <div
              className="card"
              style={{ cursor: 'pointer', borderLeft: '4px solid #2b6cb0' }}
              onClick={() => setTab('articles')}
            >
              <div className="num">ARTICLES & NEWS</div>
              <h3 style={{ margin: '8px 0 4px', fontSize: '22px' }}>📰 {stats.articles} ข่าวสาร</h3>
              <p className="small">บทความ ข่าวสาร และสาระน่ารู้ธุรกิจอาหาร</p>
            </div>
          </div>

          <h3>⚡ ทางลัดด่วน (Quick Actions)</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}>
            <button className="button" onClick={() => setTab('contact')}>
              📍 แก้ไขข้อมูลติดต่อและที่อยู่บริษัท
            </button>
            <button className="button alt" onClick={() => setTab('products')}>
              🥩 เพิ่ม / แก้ไขรายการสินค้า
            </button>
            <button className="button alt" onClick={() => setTab('rfqs')}>
              📑 ตรวจสอบคำขอใบเสนอราคา (RFQ)
            </button>
            <button className="button secondary" onClick={() => setTab('articles')}>
              📰 เพิ่มบทความข่าวสารใหม่
            </button>
          </div>
        </section>
      )}

      {tab === 'contact' && <CmsSettings />}

      {tab === 'rfqs' && <CmsRfq />}

      {tab in resourceMap && <CmsCrud resourceKey={resourceMap[tab as keyof typeof resourceMap]} />}
    </main>
  );
}
