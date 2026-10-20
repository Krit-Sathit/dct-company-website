'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { defaultContactSettings, getContactSettings, ContactSettings } from '@/lib/settings';

type RfqItem = {
  product_name: string;
  sku?: string;
  quantity: number;
  unit: string;
  note?: string;
};

type RfqDoc = {
  reference: string;
  status: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  line_id?: string;
  address?: string;
  notes?: string;
  created_at: string;
  items: RfqItem[];
  attachments: string[];
};

function PrintContent() {
  const searchParams = useSearchParams();
  const ref = searchParams?.get('ref') || '';
  const id = searchParams?.get('id') || '';
  const autoPrint = searchParams?.get('autoprint') === '1';

  const [rfq, setRfq] = useState<RfqDoc | null>(null);
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);
  const [loading, setLoading] = useState(true);
  const [searchRef, setSearchRef] = useState(ref);

  useEffect(() => {
    void getContactSettings().then(setContact);
  }, []);

  useEffect(() => {
    async function fetchRfq() {
      setLoading(true);
      try {
        const res = await fetch('/api/rfq', { cache: 'no-store' });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            const found = list.find(
              (r: any) =>
                (ref && (r.reference === ref || r.ref === ref || r.id === ref)) ||
                (id && (r.id === id || r.reference === id))
            );

            if (found) {
              const comp = found.company || {};
              const cust = found.customer || {};
              const specs = found.specs || {};

              // Extract attachments from notes or attachments field
              const notesRaw = found.notes || [specs.orderFrequency, specs.additionalNotes].filter(Boolean).join(' | ') || cust.detail || '';
              let extractedAttachments: string[] = found.attachments || specs.attachedImages || [];

              if (extractedAttachments.length === 0 && notesRaw.includes('[ATTACHMENTS]:')) {
                const parts = notesRaw.split('[ATTACHMENTS]:');
                if (parts[1]) {
                  extractedAttachments = parts[1]
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean);
                }
              }

              // Clean notes display
              const cleanNotes = notesRaw.split('[ATTACHMENTS]:')[0].trim();

              setRfq({
                reference: found.reference || found.ref || ref || 'RFQ',
                status: found.status === 'new' ? 'รอตรวจสอบ' : found.status || 'รอตรวจสอบ',
                company_name: found.company_name || comp.companyName || cust.company || 'ไม่ระบุ',
                contact_name: found.contact_name || comp.contactName || cust.name || 'ไม่ระบุ',
                phone: found.phone || comp.phone || cust.phone || '-',
                email: found.email || comp.email || cust.email || '-',
                line_id: found.line_id || comp.lineId || cust.line || '',
                address: found.address || specs.deliveryLocation || cust.address || '',
                notes: cleanNotes,
                created_at: found.created_at || found.createdAt || new Date().toISOString(),
                items: (found.items || found.rfq_items || []).map((i: any) => ({
                  product_name: i.product_name || i.name || 'สินค้า',
                  sku: i.sku || i.code || '',
                  quantity: i.quantity || i.qty || 1,
                  unit: i.unit || 'กก.',
                  note: i.note || i.spec_note || '',
                })),
                attachments: extractedAttachments,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching RFQ for print:', err);
      }
      setLoading(false);
    }

    if (ref || id) {
      void fetchRfq();
    } else {
      setLoading(false);
    }
  }, [ref, id]);

  useEffect(() => {
    if (autoPrint && rfq && !loading) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, rfq, loading]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      window.location.href = `/rfq/print?ref=${encodeURIComponent(searchRef.trim())}`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <p style={{ color: '#666' }}>กำลังโหลดเอกสารใบขอราคา...</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#525659', minHeight: '100vh', padding: '20px 0' }}>
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 16px', background: '#2d3748', padding: '12px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', flexWrap: 'wrap', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/admin" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '13px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '4px' }}>
            ← กลับหน้า CMS
          </Link>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>
            {rfq ? `เอกสารอ้างอิง: ${rfq.reference}` : 'พิมพ์เอกสารคำขอใบเสนอราคา (RFQ)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {rfq && (
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              🖨️ บันทึกเป็น PDF / สั่งพิมพ์ (Print / Save as PDF)
            </button>
          )}
        </div>
      </div>

      {/* Guide Note (Hidden on print) */}
      <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 16px', background: '#ebf8ff', border: '1px solid #bee3f8', padding: '10px 16px', borderRadius: '6px', fontSize: '12.5px', color: '#2b6cb0', lineHeight: 1.5 }}>
        💡 <b>วิธีบันทึกเป็นไฟล์ PDF:</b> กดปุ่ม <b>"บันทึกเป็น PDF / สั่งพิมพ์"</b> ด้านบน จากนั้นในช่อง <b>เครื่องพิมพ์ (Destination)</b> ให้เลือกเป็น <b>"บันทึกเป็น PDF" (Save as PDF)</b> และกดปุ่มบันทึก เพื่อเก็บไฟล์ไว้ในเครื่องหรือส่งต่อให้ลูกค้า/ฝ่ายตัดแต่งได้ทันที
      </div>

      {!rfq ? (
        <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--red)', marginTop: 0 }}>ไม่พบรหัสใบขอราคา</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            กรุณาระบุรหัสอ้างอิง RFQ (เช่น <code>DCT-RFQ-20261020-XXXX</code>) หรือเลือกดูจากระบบหลังบ้าน CMS
          </p>
          <form onSubmit={handleManualSearch} style={{ display: 'flex', justifyContent: 'center', gap: '8px', maxWidth: '450px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="พิมพ์รหัสอ้างอิง RFQ..."
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px' }}
            />
            <button type="submit" style={{ background: 'var(--red)', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              ค้นหาเอกสาร
            </button>
          </form>
        </div>
      ) : (
        /* Printable A4 Sheet */
        <div
          id="rfq-document"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            background: '#ffffff',
            padding: '40px 48px',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            color: '#1a202c',
            fontFamily: "'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #8B1E1E', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src="/dct-emblem.png"
                alt="DCT Logo"
                style={{ width: '64px', height: '64px', objectFit: 'contain' }}
              />
              <div>
                <h1 style={{ margin: 0, fontSize: '18px', color: '#8B1E1E', fontWeight: 800, lineHeight: 1.2 }}>
                  {contact.company_name_th || 'บริษัท ดวงเจริญอินเตอร์เทรด จำกัด'}
                </h1>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#4a5568', marginTop: '2px' }}>
                  {contact.company_name_en || 'DOUNGCHALERN INTER TRADE CO., LTD.'}
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginTop: '4px', maxWidth: '360px', lineHeight: 1.4 }}>
                  {contact.address}<br />
                  โทร: {contact.phone} {contact.phone_secondary ? `| ${contact.phone_secondary}` : ''} · อีเมล: {contact.email}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#8B1E1E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ใบคำขอใบเสนอราคา (B2B RFQ)
              </div>
              <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                REQUEST FOR QUOTATION DOCUMENT
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', background: '#f7fafc', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                <div>เลขที่อ้างอิง: <b style={{ color: '#8B1E1E' }}>{rfq.reference}</b></div>
                <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                  วันที่: {new Date(rfq.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Customer Profile */}
          <div style={{ marginBottom: '18px', background: '#fcfaf6', border: '1px solid #ebd8c6', borderRadius: '6px', padding: '14px 18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#8B1E1E', marginBottom: '8px', borderBottom: '1px solid #ebd8c6', paddingBottom: '4px' }}>
              🏢 1. ข้อมูลบริษัทและผู้ติดต่อขอราคา (CUSTOMER PROFILE)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 24px', fontSize: '12.5px' }}>
              <div><span style={{ color: '#718096' }}>ชื่อบริษัท / ร้านค้า:</span> <b>{rfq.company_name}</b></div>
              <div><span style={{ color: '#718096' }}>ชื่อผู้ติดต่อ:</span> <b>{rfq.contact_name}</b></div>
              <div><span style={{ color: '#718096' }}>เบอร์โทรศัพท์:</span> <b>{rfq.phone}</b></div>
              <div><span style={{ color: '#718096' }}>อีเมล:</span> <b>{rfq.email}</b></div>
              <div><span style={{ color: '#718096' }}>LINE ID:</span> {rfq.line_id || '-'}</div>
              <div><span style={{ color: '#718096' }}>สถานที่จัดส่ง / สาขา:</span> {rfq.address || '-'}</div>
            </div>
          </div>

          {/* Section 2: Order Specifications & Requirements */}
          <div style={{ marginBottom: '18px', background: '#fcfaf6', border: '1px solid #ebd8c6', borderRadius: '6px', padding: '14px 18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#8B1E1E', marginBottom: '8px', borderBottom: '1px solid #ebd8c6', paddingBottom: '4px' }}>
              ⚙️ 2. เงื่อนไขการจัดส่งและสเปกเพิ่มเติม (SPECIFICATIONS & NOTES)
            </div>
            <div style={{ fontSize: '12.5px', color: '#2d3748', lineHeight: 1.6 }}>
              {rfq.notes || 'ไม่มีหมายเหตุเพิ่มเติม'}
            </div>
          </div>

          {/* Section 3: Attached Customer Sample Photos (If Any) */}
          {rfq.attachments && rfq.attachments.length > 0 && (
            <div style={{ marginBottom: '20px', background: '#fdfbf7', border: '1.5px dashed #c49a45', borderRadius: '6px', padding: '14px 18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#8B1E1E', marginBottom: '8px', borderBottom: '1px solid #ebd8c6', paddingBottom: '4px' }}>
                📸 3. รูปภาพสเปกตัวอย่าง / รูปถ่ายจากลูกค้า ({rfq.attachments.length} รูป)
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
                {rfq.attachments.map((imgUrl, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <img
                      src={imgUrl}
                      alt={`Spec sample ${i + 1}`}
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1.5px solid #d8ccbe',
                        display: 'block',
                      }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#718096', marginTop: '3px', display: 'block' }}>
                      รูปที่ {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Products Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#8B1E1E', marginBottom: '8px', borderBottom: '1.5px solid #8B1E1E', paddingBottom: '4px' }}>
              🥩 {rfq.attachments && rfq.attachments.length > 0 ? '4' : '3'}. รายการสินค้าและสเปกที่ขอราคา (REQUESTED ITEMS - {rfq.items.length} รายการ)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#8B1E1E', color: '#ffffff' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'center', width: '38px', border: '1px solid #8B1E1E' }}>ลำดับ</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #8B1E1E' }}>ชื่อสินค้า / ชิ้นส่วน</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', width: '90px', border: '1px solid #8B1E1E' }}>รหัส (SKU)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', width: '80px', border: '1px solid #8B1E1E' }}>จำนวน</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', width: '60px', border: '1px solid #8B1E1E' }}>หน่วย</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', width: '220px', border: '1px solid #8B1E1E' }}>สเปกที่ต้องการ / หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {rfq.items.length > 0 ? (
                  rfq.items.map((it, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#faf6f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #e2d8ce' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 10px', border: '1px solid #e2d8ce', fontWeight: 600 }}>{it.product_name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #e2d8ce', color: '#718096' }}>{it.sku || '-'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #e2d8ce', fontWeight: 700, color: '#8B1E1E' }}>{it.quantity}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #e2d8ce' }}>{it.unit}</td>
                      <td style={{ padding: '8px 10px', border: '1px solid #e2d8ce', color: '#4a5568' }}>{it.note || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#718096', border: '1px solid #e2d8ce' }}>
                      ไม่มีรายการสินค้าจากแคตตาล็อก (ระบุความต้องการในข้อ 2)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Section 5: Official Signatures */}
          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', fontSize: '11.5px' }}>
              <div>
                <div style={{ height: '55px', borderBottom: '1px dashed #cbd5e0', marginBottom: '8px' }}></div>
                <div><b>ผู้ขอราคา / เซลล์ผู้ประสานงาน</b></div>
                <div style={{ color: '#718096', fontSize: '10.5px' }}>วันที่: ____ / ____ / ________</div>
              </div>
              <div>
                <div style={{ height: '55px', borderBottom: '1px dashed #cbd5e0', marginBottom: '8px' }}></div>
                <div><b>เจ้าหน้าที่ฝ่ายขาย / ประเมินราคา</b></div>
                <div style={{ color: '#718096', fontSize: '10.5px' }}>วันที่: ____ / ____ / ________</div>
              </div>
              <div>
                <div style={{ height: '55px', borderBottom: '1px dashed #cbd5e0', marginBottom: '8px' }}></div>
                <div><b>ผู้อนุมัติสเปกโรงงานตัดแต่ง (QC)</b></div>
                <div style={{ color: '#718096', fontSize: '10.5px' }}>วันที่: ____ / ____ / ________</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ marginTop: '28px', paddingTop: '12px', borderTop: '1px solid #edf2f7', fontSize: '10.5px', color: '#a0aec0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              เอกสารคำขอใบเสนอราคาอัตโนมัติ · บริษัท ดวงเจริญอินเตอร์เทรด จำกัด (DCT)
            </div>
            <div>
              www.dcintertrade.com · โทร. {contact.phone}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #rfq-document {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
        }
      `}</style>
    </div>
  );
}

export default function RfqPrintPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>กำลังเตรียมเอกสาร...</div>}>
      <PrintContent />
    </Suspense>
  );
}
