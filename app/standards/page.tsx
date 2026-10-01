'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

type CertificateItem = {
  id?: string;
  name: string;
  description?: string;
  document_url?: string;
  active?: boolean;
};

const defaultCerts: CertificateItem[] = [
  {
    name: 'GHP Certified (Good Hygiene Practices)',
    description: 'มาตรฐานสุขลักษณะที่ดีในกระบวนการผลิตอาหาร การจัดการสิ่งแวดล้อม และสุขอนามัยส่วนบุคคลของผู้ปฏิบัติงาน ได้รับการรับรองโดย Intertek',
    document_url: '/certificates/ghp-intertek-cert.jpg',
    active: true,
  },
  {
    name: 'HACCP Standard',
    description: 'ระบบการจัดการความปลอดภัยของอาหาร วิเคราะห์อันตรายและควบคุมจุดวิกฤตตลอดห่วงโซ่การผลิต ครอบคลุมการตัดแต่งและแช่เยือกแข็ง ได้รับการรับรองโดย Intertek',
    document_url: '/certificates/ghp-intertek-cert.jpg',
    active: true,
  },
  {
    name: 'อย. และ ปศุสัตว์ OK',
    description: 'การรับรองมาตรฐานสถานที่ผลิตและตัดแต่งเนื้อสัตว์จาก อย. และกรมปศุสัตว์ ปลอดสารเร่งเนื้อแดง',
    document_url: '',
    active: true,
  },
];

export default function Standards() {
  const [certs, setCerts] = useState<CertificateItem[]>(defaultCerts);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    async function loadCertificates() {
      let loaded: CertificateItem[] = [];

      // 1. Try Supabase
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const { data, error } = await client
            .from('certificates')
            .select('*')
            .eq('active', true);

          if (!error && data && data.length > 0) {
            loaded = data;
          }
        } catch {
          // ignore
        }
      }

      // 2. Try Server API
      if (loaded.length === 0) {
        try {
          const res = await fetch('/api/cms?table=certificates', { cache: 'no-store' });
          if (res.ok) {
            const serverData = await res.json();
            if (Array.isArray(serverData) && serverData.length > 0) {
              loaded = serverData.filter((c: any) => c.active !== false);
            }
          }
        } catch {
          // ignore
        }
      }

      // 3. Try LocalStorage CMS cache
      if (loaded.length === 0 && typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('dct_cms_certificates');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loaded = parsed.filter((c: any) => c.active !== false);
            }
          }
        } catch {
          // ignore
        }
      }

      if (loaded.length > 0) {
        setCerts(
          loaded.map((c) => {
            if (!c.document_url && (c.name.includes('GHP') || c.name.includes('HACCP'))) {
              return { ...c, document_url: '/certificates/ghp-intertek-cert.jpg' };
            }
            return c;
          })
        );
      }
    }

    void loadCertificates();

    const handleCmsUpdate = (e: any) => {
      if (!e.detail || e.detail.table === 'certificates') void loadCertificates();
    };
    window.addEventListener('dct_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('dct_cms_updated', handleCmsUpdate);
  }, []);

  const processes = [
    {
      num: '01',
      title: 'Raw Material',
      headline: 'การคัดสรรวัตถุดิบคุณภาพ',
      desc: 'คัดสรรเนื้อสุกรจากฟาร์มเลี้ยงที่ได้มาตรฐาน ปลอดสารเร่งเนื้อแดง และสามารถตรวจสอบย้อนกลับถึงแหล่งกำเนิดได้',
    },
    {
      num: '02',
      title: 'Processing',
      headline: 'การตัดแต่งในพื้นที่ควบคุม',
      desc: 'กระบวนการตัดแต่ง ชำแหละ สไลซ์ และบด ดำเนินการในห้องควบคุมอุณหภูมิและสุขอนามัยอย่างเคร่งครัด',
    },
    {
      num: '03',
      title: 'Storage',
      headline: 'การจัดเก็บในห้องเย็นมาตรฐาน',
      desc: 'จัดเก็บในคลังสินค้าควบคุมอุณหภูมิที่เหมาะสม ทั้ง Chilled (0°C ถึง 4°C) และ Frozen (-18°C ถึง -25°C)',
    },
    {
      num: '04',
      title: 'Delivery',
      headline: 'การขนส่งแบบ Cold Chain',
      desc: 'กระจายสินค้าด้วยรถห้องเย็นปรับอุณหภูมิ เพื่อรักษาคุณภาพ ความสด และสุขอนามัยจนถึงมือลูกค้า',
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">STANDARDS & FOOD SAFETY · MASTER V2.0</div>
          <h1>มาตรฐานการผลิตและความปลอดภัยด้านอาหาร</h1>
          <p className="lead">
            หัวใจสำคัญในการดำเนินงานของดวงเจริญ อินเตอร์เทรด คือความปลอดภัยด้านอาหารและคุณภาพที่ควบคุมได้ในทุกขั้นตอน
          </p>
        </div>
      </section>

      {/* Quality Process Flow */}
      <main className="section white">
        <div className="wrap">
          <div className="eyebrow">Quality Process</div>
          <h2>กระบวนการควบคุมคุณภาพ 4 ขั้นตอน</h2>
          <p className="lead">
            เราให้ความสำคัญกับความปลอดภัยด้านอาหารและคุณภาพในทุกขั้นตอน ตั้งแต่การคัดสรรวัตถุดิบ การตัดแต่ง การควบคุมอุณหภูมิ ไปจนถึงการจัดเก็บและส่งมอบ
          </p>

          <div className="quality-flow" style={{ marginTop: '36px' }}>
            {processes.map((p) => (
              <div className="quality-step" key={p.num}>
                <div className="q-num">STEP {p.num}</div>
                <h4>{p.headline}</h4>
                <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 700, marginBottom: '6px' }}>{p.title}</div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Certifications & Traceability */}
      <section className="section beige">
        <div className="wrap">
          <div className="eyebrow">Certifications & Compliance</div>
          <h2>มาตรฐานและการรับรองระดับสากล</h2>
          <p className="lead">
            โครงสร้างมาตรฐานที่รับประกันความสะอาด ความปลอดภัย และความสม่ำเสมอของวัตถุดิบสำหรับธุรกิจ
          </p>

          <div className="grid three" style={{ marginTop: '32px' }}>
            {certs.map((c, idx) => (
              <div
                className="card"
                key={c.id || idx}
                style={{
                  borderTop: '4px solid var(--red)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                }}
              >
                <div>
                  <div className="num">CERTIFICATION {idx + 1}</div>
                  <h3 style={{ fontSize: '22px', margin: '6px 0 8px', color: 'var(--red)' }}>{c.name}</h3>
                  <p className="small" style={{ color: '#6e584a', lineHeight: 1.65, marginBottom: '16px' }}>
                    {c.description}
                  </p>
                </div>

                {c.document_url ? (
                  <div style={{ marginTop: '14px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                    <div
                      style={{
                        position: 'relative',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid #ebd8c6',
                        cursor: 'pointer',
                        background: '#faf6f0',
                        textAlign: 'center',
                        padding: '8px',
                      }}
                      onClick={() => setPreviewDoc({ name: c.name, url: c.document_url! })}
                    >
                      <img
                        src={c.document_url}
                        alt={c.name}
                        style={{ maxHeight: '180px', width: 'auto', margin: '0 auto', display: 'block', borderRadius: '4px' }}
                      />
                      <div
                        style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: 'var(--red)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        🔍 คลิกเพื่อดูเอกสารรับรองฉบับเต็ม
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                    ✓ ผ่านการรับรองมาตรฐานสากล
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Traceability Box */}
          <div className="card" style={{ marginTop: '36px', background: '#fff', borderLeft: '4px solid var(--gold)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '32px' }}>🔍</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 6px', color: 'var(--ink)' }}>Traceability — ระบบตรวจสอบย้อนกลับ</h3>
                <p style={{ margin: 0, color: '#6e584a', lineHeight: 1.7 }}>
                  วัตถุดิบเนื้อสุกรทุกล็อตมาจากแหล่งที่สามารถตรวจสอบย้อนกลับได้ (Traceable Origin) พร้อมระบบบันทึกและควบคุมกระบวนการตั้งแต่วัตถุดิบต้นทาง การตัดแต่ง จนถึงการจัดเก็บในห้องเย็นเพื่อความโปร่งใสและมั่นใจสูงสุด
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link className="button" href="/rfq">
              ขอใบเสนอราคาตามมาตรฐาน
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Certificate Preview */}
      {previewDoc && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setPreviewDoc(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--red)', fontSize: '18px' }}>🏅 เอกสารรับรอง: {previewDoc.name}</h3>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}
              >
                ✕
              </button>
            </div>
            <img
              src={previewDoc.url}
              alt={previewDoc.name}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
