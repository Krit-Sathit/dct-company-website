'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/site';
import { products as allProducts } from '@/lib/data';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useLanguage } from '@/lib/language';

export default function RFQ() {
  const { lang, t } = useLanguage();
  const { items, add, remove, update, clear } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Unified Form, Step 2: Review & Submit
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState('');
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

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
    pdpaConsent: false,
  });

  const nextStep = () => {
    if (!companyData.companyName || !companyData.contactName || !companyData.phone || !companyData.email) {
      alert('กรุณากรอกข้อมูลบริษัท ชื่อผู้ติดต่อ เบอร์โทรศัพท์ และอีเมลให้ครบถ้วน');
      return;
    }
    if (!specData.pdpaConsent) {
      alert('กรุณาทำเครื่องหมายยินยอมให้นำข้อมูลไปใช้เพื่อติดต่อและจัดทำใบเสนอราคา');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(1);
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
          spec_note: i.note,
        }));
        await client.from('rfq_items').insert(itemRows);
      }
    } catch {
      // Fallback
    }

    // 2. Safe local store
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
      localStorage.setItem('dct-rfq-submissions', JSON.stringify([submissionPayload, ...saved]));
    }

    setDoneRef(ref);
    clear();
    setSubmitting(false);
  };

  const filteredCatalog = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (p.cutPart && p.cutPart.toLowerCase().includes(catalogSearch.toLowerCase()))
  );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">REQUEST FOR QUOTATION · B2B SERVICE</div>
          <h1>ขอใบเสนอราคาสำหรับธุรกิจ</h1>
          <p className="lead">
            กรอกข้อมูลความต้องการและรายการสินค้าที่ท่านสนใจ เพื่อให้ทีมฝ่ายขาย DCT จัดทำใบเสนอราคาที่ตอบโจทย์ธุรกิจของท่าน
          </p>
        </div>
      </section>

      <main className="section beige">
        <div className="wrap" style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Progress Bar (2 Simple Steps) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 1 ? 'var(--red)' : '#d0c2b2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                1
              </div>
              <span style={{ fontWeight: currentStep === 1 ? 'bold' : 'normal', color: 'var(--ink)', fontSize: '14px' }}>
                ข้อมูลบริษัท & รายละเอียดสินค้า
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 2 ? 'var(--red)' : '#d0c2b2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                2
              </div>
              <span style={{ fontWeight: currentStep === 2 ? 'bold' : 'normal', color: 'var(--ink)', fontSize: '14px' }}>
                ตรวจสอบและยืนยัน
              </span>
            </div>
          </div>

          {doneRef ? (
            <div className="notice" style={{ background: '#fff', border: '1px solid #7cb342', padding: '36px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ fontSize: '24px', color: '#2e7d32', marginBottom: '10px' }}>ส่งข้อมูลขอใบเสนอราคาสำเร็จเรียบร้อย!</h2>
              <p style={{ fontSize: '15px', color: '#555', marginBottom: '16px' }}>
                ระบบได้บันทึกคำขอใบเสนอราคาของท่านเรียบร้อยแล้ว ทีมงานฝ่ายขายดวงเจริญ อินเตอร์เทรด จะติดต่อกลับภายใน 24 ชั่วโมงทำการ
              </p>
              <div style={{ background: '#f5f5f5', padding: '12px 20px', borderRadius: '6px', display: 'inline-block', marginBottom: '24px' }}>
                <span style={{ fontSize: '13px', color: '#777' }}>เลขอ้างอิงคำขอ: </span>
                <b style={{ fontSize: '16px', color: 'var(--red)', letterSpacing: '0.05em' }}>{doneRef}</b>
              </div>
              <div>
                <Link className="pill-btn primary" href="/">
                  กลับสู่หน้าหลัก
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1px solid #e8dfd5', borderRadius: '8px', padding: '36px', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
              {/* STEP 1: รวมข้อมูลผู้ติดต่อและรายละเอียดสินค้าไว้ในหน้าเดียว (Slide 6) */}
              {currentStep === 1 && (
                <div>
                  {/* ส่วนที่ 1: ข้อมูลบริษัทและผู้ติดต่อ */}
                  <h3 style={{ fontSize: '19px', color: 'var(--red)', borderBottom: '2px solid #eadfd4', paddingBottom: '8px', marginBottom: '18px' }}>
                    1. ข้อมูลบริษัทและผู้ติดต่อ
                  </h3>
                  <div className="form-grid" style={{ marginBottom: '32px' }}>
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

                    <div style={{ gridColumn: '1/-1' }}>
                      <label className="small" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                        LINE ID (เพื่อความสะดวกรวดเร็วในการประสานงาน)
                      </label>
                      <input
                        className="field"
                        placeholder="LINE ID สำหรับส่งเอกสารและประสานงานฝ่ายขาย"
                        value={companyData.lineId}
                        onChange={(e) => setCompanyData({ ...companyData, lineId: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* ส่วนที่ 2: บริการที่ต้องการและสินค้า */}
                  <h3 style={{ fontSize: '19px', color: 'var(--red)', borderBottom: '2px solid #eadfd4', paddingBottom: '8px', marginBottom: '18px' }}>
                    2. รายละเอียดสินค้าและความต้องการ
                  </h3>

                  {/* ความต้องการบริการ */}
                  <div style={{ marginBottom: '24px', background: '#fdfbf7', padding: '16px', borderRadius: '6px', border: '1px solid #eadfd4' }}>
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
                        <span>🥩 สั่งซื้อเนื้อสุกร / ชิ้นส่วนมาตรฐาน</span>
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

                  {/* รายการสินค้าในตะกร้า + ปุ่มเปิด Modal (Slide 7) */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <strong style={{ fontSize: '15px' }}>
                        {lang === 'en' ? `Selected Products (${items.length} items)` : `รายการสินค้าที่เลือก (${items.length} รายการ)`}
                      </strong>
                      <button
                        type="button"
                        className="button alt"
                        style={{ fontSize: '13px', padding: '8px 16px', background: '#f5eee3', border: '1px solid #d8c29d', color: 'var(--red)', fontWeight: 700 }}
                        onClick={() => setShowCatalogModal(true)}
                      >
                        {lang === 'en' ? '+ Add from Catalogue' : '+ เพิ่มสินค้าจากแคตตาล็อก'}
                      </button>
                    </div>

                    {!items.length ? (
                      <div className="notice" style={{ background: '#fdf9f4', border: '1px dashed #d8c29d', textAlign: 'center', padding: '24px', borderRadius: '8px' }}>
                        {lang === 'en'
                          ? 'No products selected yet — please click "+ Add from Catalogue" above or describe your needs in the notes below.'
                          : 'ยังไม่มีสินค้าที่เลือกจากแคตตาล็อก — ท่านสามารถกดปุ่ม "+ เพิ่มสินค้าจากแคตตาล็อก" ด้านบน หรือระบุความต้องการในช่องหมายเหตุด้านล่างได้โดยตรง'}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {items.map((i) => (
                          <div
                            key={i.product.id}
                            style={{
                              background: '#ffffff',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #e7ded4',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '16px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* ซ้าย: รูปสินค้า + ข้อมูลสินค้า + สเปก */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px', minWidth: '260px' }}>
                              <img
                                src={i.product.image}
                                alt={lang === 'en' && i.product.nameEn ? i.product.nameEn : i.product.name}
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: '6px',
                                  objectFit: 'cover',
                                  border: '1px solid #ebd8c6',
                                  flexShrink: 0,
                                  background: '#f9f6f0',
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                  <b style={{ fontSize: '15px', color: '#2b221a' }}>
                                    {lang === 'en' && i.product.nameEn ? i.product.nameEn : i.product.name}
                                  </b>
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      color: '#837061',
                                      background: '#f5eee4',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontWeight: 600,
                                      border: '1px solid #eadfcb',
                                    }}
                                  >
                                    {i.product.code}
                                  </span>
                                </div>
                                <input
                                  className="field note"
                                  style={{
                                    width: '100%',
                                    marginTop: '0',
                                    fontSize: '12px',
                                    padding: '6px 10px',
                                    background: '#faf8f5',
                                    border: '1px solid #ded5c9',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box',
                                  }}
                                  placeholder={
                                    lang === 'en'
                                      ? 'Specify specs e.g. sliced 1.5 mm, 80/20 lean, vac pac...'
                                      : 'ระบุสเปก เช่น สไลซ์ 1.5 มม. / หมูบดมัน 20% / แพ็กสุญญากาศ...'
                                  }
                                  value={i.note || ''}
                                  onChange={(e) => update(i.product.id, 'note', e.target.value)}
                                />
                              </div>
                            </div>

                            {/* ขวา: จำนวน + หน่วย + ปุ่มลบ (อยู่บรรทัดเดียวกันทั้งหมดอย่างเป็นระเบียบ) */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexShrink: 0,
                                background: '#fdfbf8',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #eee5dc',
                              }}
                            >
                              <span style={{ fontSize: '13px', color: '#685548', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {lang === 'en' ? 'Qty:' : 'จำนวน:'}
                              </span>
                              <input
                                type="number"
                                min="1"
                                value={i.qty}
                                onChange={(e) => update(i.product.id, 'qty', Math.max(1, +e.target.value))}
                                style={{
                                  width: '64px',
                                  padding: '6px 8px',
                                  background: '#fff',
                                  border: '1px solid #d8ccbe',
                                  borderRadius: '4px',
                                  textAlign: 'center',
                                  fontWeight: 700,
                                  fontSize: '14px',
                                  color: '#2b221a',
                                  outline: 'none',
                                }}
                              />
                              <select
                                value={i.unit}
                                onChange={(e) => update(i.product.id, 'unit', e.target.value)}
                                style={{
                                  width: '78px',
                                  padding: '6px 8px',
                                  background: '#fff',
                                  border: '1px solid #d8ccbe',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: '#2b221a',
                                  cursor: 'pointer',
                                  outline: 'none',
                                }}
                              >
                                <option value="กก.">{lang === 'en' ? 'kg' : 'กก.'}</option>
                                <option value="แพ็ก">{lang === 'en' ? 'pack' : 'แพ็ก'}</option>
                                <option value="ลัง">{lang === 'en' ? 'box' : 'ลัง'}</option>
                                <option value="ตัน">{lang === 'en' ? 'ton' : 'ตัน'}</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => remove(i.product.id)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid #fed7d7',
                                  background: '#fff5f5',
                                  color: '#c53030',
                                  borderRadius: '6px',
                                  fontSize: '16px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  marginLeft: '4px',
                                  flexShrink: 0,
                                }}
                                title={lang === 'en' ? 'Remove item' : 'ลบรายการนี้'}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#c53030';
                                  e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#fff5f5';
                                  e.currentTarget.style.color = '#c53030';
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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

                  {/* PDPA Consent Checkbox */}
                  <div style={{ marginTop: '24px', background: '#fbf7f1', border: '1px solid #ebd8c6', padding: '14px', borderRadius: '6px' }}>
                    <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        style={{ marginTop: '3px' }}
                        checked={specData.pdpaConsent}
                        onChange={(e) => setSpecData({ ...specData, pdpaConsent: e.target.checked })}
                      />
                      <span>
                        ข้าพเจ้ายินยอมให้ บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด เก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลข้างต้น เพื่อวัตถุประสงค์ในการติดต่อ ประสานงาน และจัดทำใบเสนอราคาตามนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                      </span>
                    </label>
                  </div>

                  <div className="actions" style={{ marginTop: '32px', justifyContent: 'flex-end' }}>
                    <button type="button" className="button" onClick={nextStep}>
                      ตรวจสอบและยืนยันข้อมูล →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ตรวจสอบและยืนยันข้อมูล */}
              {currentStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--ink)' }}>2. ตรวจสอบและยืนยันข้อมูล</h3>
                  <p className="small" style={{ color: '#6e584a', marginBottom: '24px' }}>
                    โปรดตรวจสอบความถูกต้องของข้อมูลก่อนกดยืนยันส่งให้ทีมฝ่ายขายจัดทำใบเสนอราคา
                  </p>

                  <div style={{ background: '#fdfbf7', border: '1px solid #eadfd4', borderRadius: '6px', padding: '24px', marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 14px', color: 'var(--red)', borderBottom: '1px solid #eadfd4', paddingBottom: '8px' }}>
                      🏢 ข้อมูลบริษัทและผู้ติดต่อ
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
                      <div style={{ borderTop: '1px dashed #eadfd4', paddingTop: '16px', marginTop: '14px' }}>
                        <b style={{ fontSize: '15px' }}>
                          {lang === 'en' ? `Selected Products (${items.length} items):` : `รายการสินค้าที่เลือก (${items.length} รายการ):`}
                        </b>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                          {items.map((i) => (
                            <div
                              key={i.product.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: '#ffffff',
                                padding: '10px 14px',
                                borderRadius: '6px',
                                border: '1px solid #ebd8c6',
                              }}
                            >
                              <img
                                src={i.product.image}
                                alt={lang === 'en' && i.product.nameEn ? i.product.nameEn : i.product.name}
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '5px',
                                  objectFit: 'cover',
                                  border: '1px solid #ebd8c6',
                                  flexShrink: 0,
                                  background: '#f9f6f0',
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#2b221a', fontSize: '14px' }}>
                                  {lang === 'en' && i.product.nameEn ? i.product.nameEn : i.product.name}{' '}
                                  <span style={{ color: '#856f61', fontSize: '12px', fontWeight: 500 }}>({i.product.code})</span>
                                </div>
                                {i.note && (
                                  <div style={{ fontSize: '12px', color: '#685548', marginTop: '2px' }}>
                                    {lang === 'en' ? 'Spec:' : 'สเปก:'} {i.note}
                                  </div>
                                )}
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--red)', whiteSpace: 'nowrap' }}>
                                {i.qty} {i.unit}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="actions" style={{ marginTop: '32px', justifyContent: 'space-between' }}>
                    <button type="button" className="button alt" onClick={prevStep} disabled={submitting}>
                      ← กลับไปแก้ไขข้อมูล
                    </button>
                    <button type="button" className="button" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? '⏳ กำลังบันทึกและส่งข้อมูล…' : '📨 ส่งข้อมูลให้ทีมขาย (ขอใบเสนอราคา)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          MODAL: เลือกสินค้าจากแคตตาล็อกโดยไม่ต้องเปลี่ยนหน้า (Slide 7)
          ========================================================================= */}
      {showCatalogModal && (
        <div className="cert-modal-backdrop" onClick={() => setShowCatalogModal(false)}>
          <div
            className="cert-modal-content"
            style={{ maxWidth: '640px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🥩</span>
                <h3 style={{ margin: 0, fontSize: '17px', color: 'var(--red)' }}>
                  {lang === 'en' ? 'Select Products from Catalogue' : 'เลือกสินค้าจากแคตตาล็อก'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <input
                className="field"
                placeholder={lang === 'en' ? '🔍 Search product name or code...' : '🔍 พิมพ์ค้นหาชื่อสินค้า หรือรหัสสินค้า...'}
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                style={{ fontSize: '13px', padding: '8px 12px' }}
              />
            </div>

            {/* List of Products in Modal */}
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredCatalog.map((prod) => {
                const alreadyAdded = items.some((it) => it.product.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: alreadyAdded ? '#fbf8f3' : '#fcfcfc',
                      border: alreadyAdded ? '1.5px solid var(--gold)' : '1px solid #ebd8c6',
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '4px',
                          backgroundImage: `url(${prod.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>
                          {lang === 'en' && prod.nameEn ? prod.nameEn : prod.name}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#888' }}>
                          {lang === 'en' ? 'Code:' : 'รหัส:'} {prod.code} · {lang === 'en' ? (prod.cutPartEn || prod.categoryEn) : (prod.cutPart || prod.category)}
                        </div>
                      </div>
                    </div>

                    <div>
                      {alreadyAdded ? (
                        <span style={{ fontSize: '12px', color: '#188038', fontWeight: 700, padding: '4px 10px', background: '#e6f4ea', borderRadius: '4px' }}>
                          {lang === 'en' ? '✓ Selected' : '✓ เลือกแล้ว'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="button alt"
                          style={{ fontSize: '12px', padding: '6px 12px', borderColor: 'var(--red)', color: 'var(--red)' }}
                          onClick={() => add(prod)}
                        >
                          {lang === 'en' ? '+ Add' : '+ เพิ่มรายการ'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '14px', marginTop: '14px' }}>
              <span style={{ fontSize: '13px', color: '#666' }}>
                {lang === 'en' ? `Selected ${items.length} item(s)` : `เลือกแล้ว ${items.length} รายการ`}
              </span>
              <button
                type="button"
                className="button primary"
                style={{ fontSize: '13px', padding: '8px 20px' }}
                onClick={() => setShowCatalogModal(false)}
              >
                {lang === 'en' ? 'Done' : 'เสร็จสิ้น'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
