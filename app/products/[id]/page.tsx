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
          <div className="eyebrow">รหัสสินค้า (SKU): {p.code}</div>
          <h1>{p.name}</h1>
          {p.nameEn && <div style={{ fontSize: '18px', color: 'var(--gold)', fontWeight: 700, marginTop: '4px' }}>{p.nameEn}</div>}
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <span className="tag">{p.category}</span>
            <span className="tag" style={{ background: '#f5eedf', color: 'var(--gold)' }}>B2B Specification</span>
          </div>
          <h2>ข้อมูลจำเพาะทางเทคนิค (Technical Specs)</h2>
          <p className="lead" style={{ marginBottom: '24px' }}>{p.description}</p>

          <div className="spec">
            <span>ประเภทสินค้า (Type)</span>
            <b>{p.type || 'สดแช่เย็น (Chilled: 0-4°C) / แช่แข็ง (Frozen: -18°C)'}</b>
          </div>
          <div className="spec">
            <span>รูปแบบการตัดแต่ง (Cut)</span>
            <b>{p.cut}</b>
          </div>
          {p.thickness && (
            <div className="spec">
              <span>ความหนา / ขนาดชิ้น</span>
              <b>{p.thickness}</b>
            </div>
          )}
          {p.meatFatRatio && (
            <div className="spec">
              <span>สัดส่วนเนื้อ/ไขมัน</span>
              <b>{p.meatFatRatio}</b>
            </div>
          )}
          <div className="spec">
            <span>รูปแบบบรรจุภัณฑ์</span>
            <b>{p.pack}</b>
          </div>
          <div className="spec">
            <span>การเก็บรักษา (Storage)</span>
            <b>{p.storage}</b>
          </div>
          {p.shelfLife && (
            <div className="spec">
              <span>อายุการเก็บรักษา</span>
              <b>{p.shelfLife}</b>
            </div>
          )}
          {p.moq && (
            <div className="spec">
              <span>ขั้นต่ำในการสั่ง (MOQ)</span>
              <b>{p.moq}</b>
            </div>
          )}
          <div className="spec">
            <span>การใช้งานแนะนำ</span>
            <b>{p.use}</b>
          </div>

          <div className="actions" style={{ marginTop: '32px' }}>
            <AddButton product={p} />
            <Link className="button alt" href="/contact">
              ติดต่อฝ่ายขาย
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
