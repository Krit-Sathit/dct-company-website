import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products as defaultProducts, Product } from '@/lib/data';
import { AddButton } from '@/components/site';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  // Match by id or slug
  const p: Product | undefined = defaultProducts.find(
    (x) => x.id === decodedId || x.code.toLowerCase() === decodedId.toLowerCase()
  );

  if (!p) {
    return notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          {/* Breadcrumb Navigation */}
          <div style={{ fontSize: '13px', color: '#8c7667', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/" style={{ color: 'var(--brown)', textDecoration: 'underline' }}>หน้าหลัก</Link>
            <span>›</span>
            <Link href="/products" style={{ color: 'var(--brown)', textDecoration: 'underline' }}>สินค้า</Link>
            <span>›</span>
            <span style={{ color: 'var(--red)', fontWeight: 700 }}>{p.name}</span>
          </div>
          <div className="eyebrow">รหัสสินค้า (SKU): {p.code}</div>
          <h1>{p.name}</h1>
          <p className="lead">{p.description}</p>
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
            <span className="tag">{p.category}</span>
            <span className="tag" style={{ background: '#f5eedf', color: 'var(--gold)' }}>มาตรฐาน B2B</span>
          </div>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>รายละเอียดสินค้า</h2>
          <p className="lead" style={{ marginBottom: '24px', fontSize: '15px' }}>{p.description}</p>

          {/* Primary 3 Rows in Pure Thai (Slide 8 Client Feedback) */}
          <div className="spec-box">
            {/* 1. ชื่อสินค้า */}
            <div className="spec">
              <span>ชื่อสินค้า</span>
              <b>{p.name}</b>
            </div>

            {/* 2. ชิ้นส่วน / รูปแบบการตัดแต่ง */}
            <div className="spec">
              <span>ชิ้นส่วน / รูปแบบตัดแต่ง</span>
              <b>{p.cutPart || p.name} — {p.cut}</b>
            </div>

            {/* 3. เหมาะสำหรับ */}
            <div className="spec">
              <span>เหมาะสำหรับ</span>
              <b>{p.use}</b>
            </div>
          </div>

          {/* Accordion for Technical B2B Specifications (Slide 8 & I025) */}
          <details className="spec-accordion">
            <summary>
              <span>📋 ข้อมูลจำเพาะทางเทคนิคเพิ่มเติม (B2B Specifications)</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold)' }}>คลิกเพื่อดูรายละเอียด ▾</span>
            </summary>
            <div className="spec-accordion-body">
              <div className="spec">
                <span>ประเภทเนื้อ</span>
                <b>{p.type || 'สดแช่เย็น (Chilled 0-4°C) / แช่แข็ง (Frozen -18°C)'}</b>
              </div>

              {p.thickness && (
                <div className="spec">
                  <span>ความหนา / ขนาดชิ้น</span>
                  <b>{p.thickness}</b>
                </div>
              )}

              {p.meatFatRatio && (
                <div className="spec">
                  <span>สัดส่วนเนื้อต่อไขมัน</span>
                  <b>{p.meatFatRatio}</b>
                </div>
              )}

              <div className="spec">
                <span>รูปแบบบรรจุภัณฑ์</span>
                <b>{p.pack}</b>
              </div>

              {p.shelfLife && (
                <div className="spec">
                  <span>อายุการเก็บรักษา</span>
                  <b>{p.shelfLife}</b>
                </div>
              )}

              {p.moq && (
                <div className="spec">
                  <span>ปริมาณสั่งซื้อขั้นต่ำ (MOQ)</span>
                  <b>{p.moq}</b>
                </div>
              )}

              <div className="spec">
                <span>การจัดเก็บ</span>
                <b>{p.storage}</b>
              </div>
            </div>
          </details>

          {/* Dual CTAs from Master Copy v2.0 */}
          <div className="actions" style={{ marginTop: '32px' }}>
            <AddButton product={p} />
            <Link className="button alt" href="/rfq">
              สรุปรายการขอใบเสนอราคา
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
