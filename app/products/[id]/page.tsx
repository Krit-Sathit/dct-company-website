'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products as defaultProducts, Product } from '@/lib/data';
import { AddButton } from '@/components/site';
import { useLanguage } from '@/lib/language';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLanguage();
  const decodedId = decodeURIComponent(id);

  // Match by id or slug
  const p: Product | undefined = defaultProducts.find(
    (x) => x.id === decodedId || x.code.toLowerCase() === decodedId.toLowerCase()
  );

  if (!p) {
    return notFound();
  }

  const isEn = lang === 'en';

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          {/* Breadcrumb Navigation */}
          <div style={{ fontSize: '13px', color: '#8c7667', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--brown)', textDecoration: 'underline' }}>
              {isEn ? 'Home' : 'หน้าหลัก'}
            </Link>
            <span>›</span>
            <Link href="/products" style={{ color: 'var(--brown)', textDecoration: 'underline' }}>
              {isEn ? 'Products' : 'สินค้า'}
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>
              {isEn ? (p.nameEn || p.name) : p.name}
            </span>
          </div>
          <div className="eyebrow">{isEn ? `SKU Code: ${p.code}` : `รหัสสินค้า (SKU): ${p.code}`}</div>
          <h1>{isEn ? (p.nameEn || p.name) : p.name}</h1>
          <p className="lead">{isEn ? (p.descriptionEn || p.description) : p.description}</p>
        </div>
      </section>

      <main className="wrap section details">
        <div
          className="photo"
          style={{
            backgroundImage: `url(${p.image})`,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          }}
        />
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="tag">{isEn ? (p.categoryEn || p.category) : p.category}</span>
            <span className="tag" style={{ background: '#f5eedf', color: 'var(--gold)' }}>
              {isEn ? 'B2B Certified Standard' : 'มาตรฐาน B2B'}
            </span>
          </div>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>
            {isEn ? 'Product Specifications' : 'รายละเอียดสินค้า'}
          </h2>
          <p className="lead" style={{ marginBottom: '24px', fontSize: '15px' }}>
            {isEn ? (p.descriptionEn || p.description) : p.description}
          </p>

          {/* Primary 3 Rows (Slide 8 Client Feedback) */}
          <div className="spec-box">
            {/* 1. ชื่อสินค้า */}
            <div className="spec">
              <span>{isEn ? 'Product Name' : 'ชื่อสินค้า'}</span>
              <b>{isEn ? (p.nameEn || p.name) : p.name}</b>
            </div>

            {/* 2. ชิ้นส่วน / รูปแบบการตัดแต่ง */}
            <div className="spec">
              <span>{isEn ? 'Cut Part / Cut Options' : 'ชิ้นส่วน / รูปแบบตัดแต่ง'}</span>
              <b>
                {isEn
                  ? `${p.cutPartEn || p.cutPart || p.name} — ${p.cutEn || p.cut}`
                  : `${p.cutPart || p.name} — ${p.cut}`}
              </b>
            </div>

            {/* 3. เหมาะสำหรับ */}
            <div className="spec">
              <span>{isEn ? 'Recommended Use' : 'เหมาะสำหรับ'}</span>
              <b>{isEn ? (p.useEn || p.use) : p.use}</b>
            </div>
          </div>

          {/* Accordion for Technical B2B Specifications (Slide 8 & I025) */}
          <details className="spec-accordion">
            <summary>
              <span>{isEn ? '📋 Additional Technical Specifications (B2B)' : '📋 ข้อมูลจำเพาะทางเทคนิคเพิ่มเติม (B2B Specifications)'}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold)' }}>
                {isEn ? 'Click to expand ▾' : 'คลิกเพื่อดูรายละเอียด ▾'}
              </span>
            </summary>
            <div className="spec-accordion-body">
              <div className="spec">
                <span>{isEn ? 'Product Type' : 'ประเภทเนื้อ'}</span>
                <b>
                  {isEn
                    ? (p.typeEn || 'Chilled (0-4°C) / Frozen (-18°C)')
                    : (p.type || 'สดแช่เย็น (Chilled 0-4°C) / แช่แข็ง (Frozen -18°C)')}
                </b>
              </div>

              {(p.thickness || p.thicknessEn) && (
                <div className="spec">
                  <span>{isEn ? 'Portion / Thickness' : 'ความหนา / ขนาดชิ้น'}</span>
                  <b>{isEn ? (p.thicknessEn || p.thickness) : p.thickness}</b>
                </div>
              )}

              {(p.meatFatRatio || p.meatFatRatioEn) && (
                <div className="spec">
                  <span>{isEn ? 'Meat to Fat Ratio' : 'สัดส่วนเนื้อต่อไขมัน'}</span>
                  <b>{isEn ? (p.meatFatRatioEn || p.meatFatRatio) : p.meatFatRatio}</b>
                </div>
              )}

              <div className="spec">
                <span>{isEn ? 'Packaging' : 'รูปแบบบรรจุภัณฑ์'}</span>
                <b>{isEn ? (p.packEn || p.pack) : p.pack}</b>
              </div>

              {(p.shelfLife || p.shelfLifeEn) && (
                <div className="spec">
                  <span>{isEn ? 'Shelf Life' : 'อายุการเก็บรักษา'}</span>
                  <b>{isEn ? (p.shelfLifeEn || p.shelfLife) : p.shelfLife}</b>
                </div>
              )}

              {(p.moq || p.moqEn) && (
                <div className="spec">
                  <span>{isEn ? 'Minimum Order (MOQ)' : 'ปริมาณสั่งซื้อขั้นต่ำ (MOQ)'}</span>
                  <b>{isEn ? (p.moqEn || p.moq) : p.moq}</b>
                </div>
              )}

              <div className="spec">
                <span>{isEn ? 'Storage' : 'การจัดเก็บ'}</span>
                <b>{isEn ? (p.storageEn || p.storage) : p.storage}</b>
              </div>
            </div>
          </details>

          {/* Dual CTAs from Master Copy v2.0 */}
          <div className="actions" style={{ marginTop: '32px' }}>
            <AddButton product={p} />
            <Link className="button alt" href="/rfq">
              {isEn ? 'Review RFQ Cart' : 'สรุปรายการขอใบเสนอราคา'}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
