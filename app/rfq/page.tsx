'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/site';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function RFQ() {
  const { items, remove, update } = useCart();
  const [done, setDone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!items.length) return;
    setSubmitting(true);

    const f = new FormData(e.currentTarget);
    if (f.get('website')) return; // honeypot

    const ref = `DCT-RFQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const customerData = {
      company: String(f.get('company') || ''),
      name: String(f.get('name') || ''),
      phone: String(f.get('phone') || ''),
      email: String(f.get('email') || ''),
      line: String(f.get('line') || ''),
      address: String(f.get('address') || ''),
      detail: String(f.get('detail') || ''),
    };

    // 1. Try insert to Supabase
    try {
      const client = supabaseBrowser();
      const { data: rfqRow, error: rfqErr } = await client
        .from('rfqs')
        .insert({
          reference: ref,
          status: 'new',
          company_name: customerData.company,
          contact_name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          line_id: customerData.line,
          address: customerData.address,
          notes: customerData.detail,
        })
        .select()
        .single();

      if (!rfqErr && rfqRow?.id) {
        const itemRows = items.map((i) => ({
          rfq_id: rfqRow.id,
          product_name: i.product.name,
          sku: i.product.code,
          quantity: i.qty,
          unit: i.unit,
          note: i.note,
        }));
        await client.from('rfq_items').insert(itemRows);
      }
    } catch {
      // ignore
    }

    // 2. Always persist locally for safety & staging preview
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
      localStorage.setItem(
        'dct-rfq-submissions',
        JSON.stringify([
          {
            ref,
            status: 'new',
            createdAt: new Date().toISOString(),
            customer: customerData,
            items,
          },
          ...saved,
        ])
      );
      // Clear cart
      localStorage.removeItem('dct-rfq');
    }

    setSubmitting(false);
    setDone(ref);
  };

  if (done) {
    return (
      <main className="wrap cart">
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="eyebrow" style={{ color: 'var(--red)', fontSize: '15px' }}>
            ✓ Request Received Successfully
          </div>
          <h1 style={{ marginTop: '12px' }}>ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว</h1>
          <p className="lead" style={{ margin: '16px 0 24px' }}>
            รหัสอ้างอิงใบเสนอราคาของคุณคือ <b style={{ color: 'var(--red)', fontSize: '22px' }}>{done}</b>
          </p>
          <p style={{ maxWidth: '560px', margin: '0 auto 28px', color: '#806c60' }}>
            เจ้าหน้าที่ฝ่ายขาย บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด จะตรวจสอบรายการและสเปกสินค้า พร้อมติดต่อกลับตามข้อมูลที่ท่านได้แจ้งไว้โดยเร็วที่สุด
          </p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <Link className="button" href="/products">
              เลือกดูสินค้าเพิ่มเติม
            </Link>
            <Link className="button secondary" href="/">
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap cart">
      <div className="eyebrow">Request for quotation</div>
      <h1>รายการขอใบเสนอราคา (B2B RFQ)</h1>
      <p className="lead" style={{ marginBottom: '24px' }}>
        เลือกสินค้าที่ต้องการ ระบุจำนวนและสเปกตัดแต่งที่ต้องการ จากนั้นส่งข้อมูลเพื่อให้ฝ่ายขายจัดทำใบเสนอราคา
      </p>

      {!items.length ? (
        <div className="notice" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>🛒 ยังไม่มีรายการสินค้าในรายการขอราคา</p>
          <Link className="button" href="/products">
            ไปที่แคตตาล็อกสินค้า →
          </Link>
        </div>
      ) : (
        <>
          <div className="card">
            <h3>รายการสินค้าที่เลือก ({items.length} รายการ)</h3>
            {items.map((i) => (
              <div className="line" key={i.product.id}>
                <div>
                  <b style={{ fontSize: '16px', color: 'var(--ink)' }}>{i.product.name}</b>
                  <br />
                  <span className="small" style={{ color: '#806c60' }}>
                    รหัส: {i.product.code} · {i.product.cut}
                  </span>
                  <input
                    className="field note"
                    style={{ marginTop: '8px' }}
                    placeholder="ระบุสเปกพิเศษ เช่น ความหนา, อัตราส่วนมัน 20/80..."
                    value={i.note}
                    onChange={(e) => update(i.product.id, 'note', e.target.value)}
                  />
                </div>
                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '4px' }}>
                    จำนวน
                  </label>
                  <input
                    className="field"
                    aria-label="จำนวน"
                    min="1"
                    type="number"
                    value={i.qty}
                    onChange={(e) => update(i.product.id, 'qty', Math.max(1, +e.target.value))}
                  />
                </div>
                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '4px' }}>
                    หน่วย
                  </label>
                  <select
                    className="field"
                    value={i.unit}
                    onChange={(e) => update(i.product.id, 'unit', e.target.value)}
                  >
                    <option>กก.</option>
                    <option>แพ็ก</option>
                    <option>กล่อง</option>
                    <option>ตัน</option>
                    <option>ชิ้น</option>
                  </select>
                </div>
                <button
                  type="button"
                  aria-label="ลบสินค้า"
                  onClick={() => remove(i.product.id)}
                  style={{
                    border: 0,
                    background: 'none',
                    color: 'var(--red)',
                    fontSize: 26,
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                  title="ลบสินค้านี้"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="card" style={{ marginTop: 24 }}>
            <h3>ข้อมูลผู้ขอใบเสนอราคา</h3>
            <p className="small" style={{ marginBottom: '18px', color: '#806c60' }}>
              กรุณากรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับพร้อมรายละเอียดราคาและเงื่อนไขการจัดส่ง
            </p>

            <div className="form-grid">
              <input className="field" name="company" required placeholder="ชื่อบริษัท / ร้านอาหาร / โรงงาน *" />
              <input className="field" name="name" required placeholder="ชื่อผู้ติดต่อ *" />
              <input
                className="field"
                name="phone"
                required
                pattern="[0-9+ -]{8,}"
                placeholder="เบอร์โทรศัพท์ติดต่อ *"
              />
              <input className="field" name="email" required type="email" placeholder="อีเมล *" />
              <input className="field" name="line" placeholder="LINE ID (ถ้ามี)" />
              <input className="field" name="address" placeholder="ที่อยู่จัดส่ง / สาขาที่ต้องการส่ง" />
              <textarea
                className="field"
                name="detail"
                placeholder="รายละเอียดเพิ่มเติม เช่น วันที่ต้องการรับสินค้า, ปริมาณการใช้ต่อเดือน, เงื่อนไขเครดิต ฯลฯ"
              />
              <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
            </div>

            <div className="actions" style={{ marginTop: '20px' }}>
              <button className="button" type="submit" disabled={submitting}>
                {submitting ? '⏳ กำลังส่งข้อมูล…' : '📤 ส่งคำขอใบเสนอราคา'}
              </button>
              <Link className="button secondary" href="/products">
                + เพิ่มสินค้าอื่นอีก
              </Link>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
