'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/site';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function RFQ() {
  const { items, remove, update, clear } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState('');

  // Form State
  const [companyData, setCompanyData] = useState({
    companyName: '',
    businessType: 'ร้านอาหาร / ภัตตาคาร',
    contactName: '',
    position: '',
    phone: '',
    email: '',
    lineId: '',
  });

  const [specData, setSpecData] = useState({
    needsBuyPork: true,
    needsCustomCut: false,
    needsColdStorage: false,
    needsDelivery: true,
    deliveryLocation: '',
    targetDate: '',
    orderFrequency: 'สั่งประจำทุกสัปดาห์',
    additionalNotes: '',
  });

  const nextStep = () => {
    if (currentStep === 1) {
      if (!companyData.companyName || !companyData.contactName || !companyData.phone || !companyData.email) {
        alert('กรุณากรอกข้อมูลบริษัท ชื่อผู้ติดต่อ เบอร์โทรศัพท์ และอีเมลให้ครบถ้วน');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const ref = `DCT-RFQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const submissionPayload = {
      ref,
      company: companyData,
      specs: specData,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        code: i.product.code,
        qty: i.qty,
        unit: i.unit,
        note: i.note,
      })),
      createdAt: new Date().toISOString(),
    };

    // 1. Try Supabase
    try {
      const client = supabaseBrowser();
      const { data: rfqRow } = await client
        .from('rfqs')
        .insert({
          reference: ref,
          status: 'new',
          company_name: companyData.companyName,
          contact_name: companyData.contactName,
          phone: companyData.phone,
          email: companyData.email,
          line_id: companyData.lineId,
          address: specData.deliveryLocation,
          notes: `${specData.orderFrequency} | ${specData.additionalNotes}`,
        })
        .select()
        .single();

      if (rfqRow?.id && items.length > 0) {
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

    // 2. Safe local store
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
      localStorage.setItem('dct-rfq-submissions', JSON.stringify([submissionPayload, ...saved]));
      clear();
    }

    setSubmitting(false);
    setDoneRef(ref);
  };

  if (doneRef) {
    return (
      <main className="wrap section" style={{ maxWidth: '780px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="eyebrow" style={{ color: 'var(--red)', fontSize: '15px' }}>
            ✓ Request Received Successfully
          </div>
          <h1 style={{ marginTop: '12px' }}>ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว</h1>
          <p className="lead" style={{ margin: '16px 0 24px' }}>
            รหัสอ้างอิงของคุณคือ <b style={{ color: 'var(--red)', fontSize: '24px' }}>{doneRef}</b>
          </p>
          <p style={{ maxWidth: '580px', margin: '0 auto 28px', color: '#6e584a', lineHeight: 1.7 }}>
            ทีมฝ่ายขายและการตลาด บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด ได้รับข้อมูลของท่านแล้ว และจะจัดทำใบเสนอราคาพร้อมเงื่อนไขการจัดส่งติดต่อกลับภายใน 24 ชั่วโมงทำการ
          </p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <Link className="button" href="/products">
              เลือกดูสินค้าอื่นเพิ่มเติม
            </Link>
            <Link className="button alt" href="/">
              กลับสู่หน้าหลัก
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">REQUEST FOR QUOTATION · MASTER V2.0</div>
          <h1>ขอใบเสนอราคา (B2B RFQ)</h1>
          <p className="lead">
            แจ้งประเภทสินค้า สเปก ปริมาณ และความต้องการในการจัดส่ง เพื่อให้ทีมฝ่ายขายประเมินและจัดทำใบเสนอราคา
          </p>
        </div>
      </section>

      <main className="wrap section">
        <div className="rfq-wizard">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-node ${currentStep === 1 ? 'active' : currentStep > 1 ? 'done' : ''}`}>
              <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
              <div className="step-title">ข้อมูลบริษัท</div>
            </div>
            <div className={`step-node ${currentStep === 2 ? 'active' : currentStep > 2 ? 'done' : ''}`}>
              <div className="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
              <div className="step-title">รายละเอียดสินค้า</div>
            </div>
            <div className={`step-node ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <div className="step-title">ยืนยันข้อมูล</div>
            </div>
          </div>

          {/* STEP 1: ข้อมูลบริษัท */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--ink)' }}>Step 1: ข้อมูลบริษัทและผู้ติดต่อ</h3>
              <p className="small" style={{ color: '#6e584a', marginBottom: '24px' }}>
                กรุณาระบุข้อมูลพื้นฐานของธุรกิจท่านเพื่อการประสานงานและจัดทำเอกสารอย่างถูกต้อง
              </p>

              <div className="form-grid">
                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    ชื่อบริษัท / ร้านอาหาร / องค์กร *
                  </label>
                  <input
                    className="field"
                    required
                    placeholder="เช่น บริษัท สยามฟู้ดส์ จำกัด / ร้านอาหารชาบูเฮาส์"
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    ประเภทธุรกิจ
                  </label>
                  <select
                    className="field"
                    value={companyData.businessType}
                    onChange={(e) => setCompanyData({ ...companyData, businessType: e.target.value })}
                  >
                    <option>ร้านอาหาร / ภัตตาคาร / ชาบู-ปิ้งย่าง</option>
                    <option>โรงงานอาหารแปรรูป / ผู้ผลิตอาหาร</option>
                    <option>ผู้ค้าส่ง / ตัวแทนจำหน่ายวัตถุดิบ</option>
                    <option>ซูเปอร์มาร์เก็ต / โมเดิร์นเทรด</option>
                    <option>ครัวกลาง / ธุรกิจจัดเลี้ยง (Catering)</option>
                    <option>โรงแรม / รีสอร์ต</option>
                    <option>อื่น ๆ</option>
                  </select>
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    ชื่อผู้ติดต่อ *
                  </label>
                  <input
                    className="field"
                    required
                    placeholder="ชื่อ - นามสกุล"
                    value={companyData.contactName}
                    onChange={(e) => setCompanyData({ ...companyData, contactName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    ตำแหน่ง
                  </label>
                  <input
                    className="field"
                    placeholder="เช่น ผู้จัดการฝ่ายจัดซื้อ / เชฟใหญ่ / เจ้าของกิจการ"
                    value={companyData.position}
                    onChange={(e) => setCompanyData({ ...companyData, position: e.target.value })}
                  />
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    เบอร์โทรศัพท์ติดต่อ *
                  </label>
                  <input
                    className="field"
                    required
                    placeholder="08X-XXX-XXXX หรือ 02-XXX-XXXX"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    อีเมล *
                  </label>
                  <input
                    className="field"
                    type="email"
                    required
                    placeholder="contact@company.com"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    LINE ID (เพื่อความสะดวกรวดเร็ว)
                  </label>
                  <input
                    className="field"
                    placeholder="LINE ID สำหรับส่งเอกสาร"
                    value={companyData.lineId}
                    onChange={(e) => setCompanyData({ ...companyData, lineId: e.target.value })}
                  />
                </div>
              </div>

              <div className="actions" style={{ marginTop: '32px', justifyContent: 'flex-end' }}>
                <button type="button" className="button" onClick={nextStep}>
                  ถัดไป: ระบุรายละเอียดสินค้า →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: รายละเอียดสินค้าและความต้องการ */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--ink)' }}>Step 2: รายละเอียดสินค้าและความต้องการ</h3>
              
              {/* ความต้องการบริการ */}
              <div style={{ marginBottom: '24px', background: '#fdf9f4', padding: '16px', borderRadius: '6px', border: '1px solid #eadfd4' }}>
                <label className="small" style={{ display: 'block', fontWeight: 700, marginBottom: '10px' }}>
                  บริการที่ท่านต้องการ (เลือกได้มากกว่า 1 ข้อ):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={specData.needsBuyPork}
                      onChange={(e) => setSpecData({ ...specData, needsBuyPork: e.target.checked })}
                    />
                    <span>🥩 ซื้อเนื้อสุกร / สั่งชิ้นส่วนมาตรฐาน</span>
                  </label>
                  <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={specData.needsCustomCut}
                      onChange={(e) => setSpecData({ ...specData, needsCustomCut: e.target.checked })}
                    />
                    <span>✂️ ตัดแต่งตามสเปก (Custom Cut/Portion)</span>
                  </label>
                  <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={specData.needsColdStorage}
                      onChange={(e) => setSpecData({ ...specData, needsColdStorage: e.target.checked })}
                    />
                    <span>❄️ ฝากแช่เย็น / แช่แข็ง (Cold Storage)</span>
                  </label>
                  <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={specData.needsDelivery}
                      onChange={(e) => setSpecData({ ...specData, needsDelivery: e.target.checked })}
                    />
                    <span>🚚 บริการจัดส่งควบคุมอุณหภูมิ</span>
                  </label>
                </div>
              </div>

              {/* รายการสินค้าใน Cart */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong>รายการสินค้าที่เลือก ({items.length} รายการ)</strong>
                  <Link href="/products" className="button alt" style={{ fontSize: '12px', padding: '6px 12px' }}>
                    + เพิ่มสินค้าจากแคตตาล็อก
                  </Link>
                </div>

                {!items.length ? (
                  <div className="notice">
                    ยังไม่มีสินค้าที่เลือกจากแคตตาล็อก (ท่านสามารถกรอกรายละเอียดที่ต้องการในช่องด้านล่างได้โดยตรง)
                  </div>
                ) : (
                  items.map((i) => (
                    <div className="line" key={i.product.id} style={{ background: '#fff', padding: '12px 14px', borderRadius: '4px', marginBottom: '8px', border: '1px solid #f0e6dc' }}>
                      <div>
                        <b>{i.product.name}</b>
                        <span className="small" style={{ marginLeft: '8px', color: '#806c60' }}>({i.product.code})</span>
                        <input
                          className="field note"
                          style={{ marginTop: '6px', fontSize: '12px', padding: '6px 10px' }}
                          placeholder="ระบุสเปก เช่น สไลซ์ 1.5 มม. หรือ มัน 20/80..."
                          value={i.note}
                          onChange={(e) => update(i.product.id, 'note', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          className="field"
                          min="1"
                          type="number"
                          value={i.qty}
                          onChange={(e) => update(i.product.id, 'qty', Math.max(1, +e.target.value))}
                          style={{ padding: '6px 8px' }}
                        />
                      </div>
                      <div>
                        <select
                          className="field"
                          value={i.unit}
                          onChange={(e) => update(i.product.id, 'unit', e.target.value)}
                          style={{ padding: '6px 8px' }}
                        >
                          <option>กก.</option>
                          <option>แพ็ก</option>
                          <option>กล่อง</option>
                          <option>ตัน</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(i.product.id)}
                        style={{ border: 0, background: 'none', color: 'var(--red)', fontSize: '20px', cursor: 'pointer' }}
                        title="ลบ"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Delivery & Logistics Fields */}
              <div className="form-grid">
                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    ความถี่ในการสั่งซื้อ
                  </label>
                  <select
                    className="field"
                    value={specData.orderFrequency}
                    onChange={(e) => setSpecData({ ...specData, orderFrequency: e.target.value })}
                  >
                    <option>สั่งประจำทุกวัน</option>
                    <option>สั่งประจำ 2-3 ครั้ง/สัปดาห์</option>
                    <option>สั่งประจำทุกสัปดาห์</option>
                    <option>สั่งเป็นล็อตรายเดือน</option>
                    <option>สั่งรอบเดียวเพื่อทดลองตลาด (Trial Order)</option>
                  </select>
                </div>

                <div>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    วันที่ / ช่วงเวลาที่ต้องการเริ่มรับสินค้า
                  </label>
                  <input
                    className="field"
                    placeholder="เช่น ภายในสัปดาห์หน้า / วันที่ 15 ของเดือน"
                    value={specData.targetDate}
                    onChange={(e) => setSpecData({ ...specData, targetDate: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    สถานที่จัดส่ง / สาขาที่ต้องการให้ส่งมอบ
                  </label>
                  <input
                    className="field"
                    placeholder="ระบุเขต/อำเภอ จังหวัด หรือสถานที่ตั้งครัวกลาง"
                    value={specData.deliveryLocation}
                    onChange={(e) => setSpecData({ ...specData, deliveryLocation: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    รายละเอียดเพิ่มเติม / สเปกพิเศษที่ต้องการ
                  </label>
                  <textarea
                    className="field"
                    placeholder="ระบุความต้องการเพิ่มเติม เช่น สัดส่วนเนื้อแดง/ไขมัน, บรรจุภัณฑ์ Vacuum ถุงละกี่กิโลกรัม หรือเงื่อนไขอื่นๆ"
                    value={specData.additionalNotes}
                    onChange={(e) => setSpecData({ ...specData, additionalNotes: e.target.value })}
                  />
                </div>
              </div>

              <div className="actions" style={{ marginTop: '32px', justifyContent: 'space-between' }}>
                <button type="button" className="button alt" onClick={prevStep}>
                  ← ย้อนกลับ
                </button>
                <button type="button" className="button" onClick={nextStep}>
                  ถัดไป: สรุปและยืนยันข้อมูล →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ยืนยันข้อมูล */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--ink)' }}>Step 3: ตรวจสอบและยืนยันข้อมูล</h3>
              <p className="small" style={{ color: '#6e584a', marginBottom: '24px' }}>
                โปรดตรวจสอบความถูกต้องของข้อมูลก่อนกดส่งให้ทีมฝ่ายขายจัดทำใบเสนอราคา
              </p>

              <div style={{ background: '#fff', border: '1px solid #eadfd4', borderRadius: '6px', padding: '24px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 14px', color: 'var(--red)', borderBottom: '1px solid #eadfd4', paddingBottom: '8px' }}>
                  🏢 ข้อมูลผู้ติดต่อ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div><b>บริษัท:</b> {companyData.companyName}</div>
                  <div><b>ประเภทธุรกิจ:</b> {companyData.businessType}</div>
                  <div><b>ผู้ติดต่อ:</b> {companyData.contactName} {companyData.position ? `(${companyData.position})` : ''}</div>
                  <div><b>โทรศัพท์:</b> {companyData.phone}</div>
                  <div><b>อีเมล:</b> {companyData.email}</div>
                  <div><b>LINE ID:</b> {companyData.lineId || '-'}</div>
                </div>

                <h4 style={{ margin: '20px 0 14px', color: 'var(--red)', borderBottom: '1px solid #eadfd4', paddingBottom: '8px' }}>
                  📦 สรุปความต้องการและสินค้า
                </h4>
                <div style={{ fontSize: '14px', marginBottom: '14px' }}>
                  <div><b>ความถี่:</b> {specData.orderFrequency}</div>
                  <div><b>สถานที่ส่ง:</b> {specData.deliveryLocation || '-'}</div>
                  {specData.targetDate && <div><b>ช่วงเวลาที่ต้องการ:</b> {specData.targetDate}</div>}
                  {specData.additionalNotes && <div><b>หมายเหตุ:</b> {specData.additionalNotes}</div>}
                </div>

                {items.length > 0 && (
                  <div style={{ borderTop: '1px dashed #eadfd4', paddingTop: '12px' }}>
                    <b>รายการสินค้าที่เลือก ({items.length} รายการ):</b>
                    <ul style={{ margin: '8px 0 0', paddingLeft: '20px', fontSize: '14px' }}>
                      {items.map((i) => (
                        <li key={i.product.id} style={{ marginBottom: '4px' }}>
                          <b>{i.product.name}</b> ({i.product.code}) — {i.qty} {i.unit} {i.note ? `[สเปก: ${i.note}]` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="actions" style={{ marginTop: '32px', justifyContent: 'space-between' }}>
                <button type="button" className="button alt" onClick={prevStep} disabled={submitting}>
                  ← แก้ไขข้อมูล
                </button>
                <button type="button" className="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? '⏳ กำลังบันทึกและส่งข้อมูล…' : '📨 ส่งข้อมูลให้ทีมขาย (ขอใบเสนอราคา)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
