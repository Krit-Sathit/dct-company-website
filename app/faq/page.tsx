'use client';

import { useState } from 'react';
import Link from 'next/link';

const faq = [
  [
    'DCT รับทำสินค้าตัดแต่งตามสเปกหรือไม่?',
    'รองรับการตัดแต่งเนื้อสุกรตามความต้องการเฉพาะของธุรกิจ เช่น Slice (สไลซ์บางชาบู/ปิ้งย่าง), Dice (หั่นเต๋า), Mince (บดตามสัดส่วนเนื้อต่อไขมัน), และ Portion Cut พร้อมบริการบรรจุภัณฑ์สุญญากาศ (Vacuum) และคลังสินค้าห้องเย็น',
  ],
  [
    'มีราคาสินค้าแสดงบนเว็บไซต์หรือไม่?',
    'เนื่องจากราคาเนื้อสุกรขึ้นอยู่กับปริมาณการสั่งซื้อ รูปแบบการตัดแต่ง สเปกบรรจุภัณฑ์ และความถี่ในการส่งมอบ เว็บไซต์จึงใช้ระบบขอใบเสนอราคา (B2B RFQ) เพื่อให้ทีมฝ่ายขายประเมินราคาที่เหมาะสมและคุ้มค่าที่สุดสำหรับธุรกิจของคุณ',
  ],
  [
    'ขอใบเสนอราคาได้หลายรายการในครั้งเดียวได้หรือไม่?',
    'ได้ คุณสามารถเลือกสินค้าจากแคตตาล็อกได้หลายรายการ พร้อมระบุจำนวน หน่วย และหมายเหตุสเปกของแต่ละรายการได้อย่างสะดวกผ่านระบบ 3-Step RFQ Wizard',
  ],
  [
    'การจัดส่งสินค้าครอบคลุมพื้นที่ใดบ้าง?',
    'เรามีบริการจัดส่งด้วยรถห้องเย็นควบคุมอุณหภูมิ (Cold Chain Logistics) ครอบคลุมทั้งพื้นที่กรุงเทพฯ ปริมณฑล และต่างจังหวัดทั่วประเทศ',
  ],
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">FAQ · FREQUENTLY ASKED QUESTIONS</div>
          <h1>คำถามที่พบบ่อย</h1>
          <p className="lead">
            รวบรวมข้อสงสัยเกี่ยวกับการสั่งซื้อ การตัดแต่งตามสเปก การจัดส่ง และการขอใบเสนอราคา
          </p>
        </div>
      </section>

      <main className="wrap section" style={{ maxWidth: '840px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faq.map((x, i) => (
            <div className="card" key={x[0]} style={{ padding: '20px 24px' }}>
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  background: 'none',
                  border: 0,
                  width: '100%',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '17px',
                  color: 'var(--ink)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{x[0]}</span>
                <span style={{ fontSize: '22px', color: 'var(--red)', marginLeft: '12px' }}>
                  {openIdx === i ? '−' : '+'}
                </span>
              </button>
              {openIdx === i && (
                <p style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f0e6dc', color: '#5e483b', lineHeight: 1.7 }}>
                  {x[1]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#6e584a', marginBottom: '16px' }}>หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อทีมงานฝ่ายขายได้โดยตรง</p>
          <Link className="button" href="/contact">
            ติดต่อเรา
          </Link>
        </div>
      </main>
    </>
  );
}
