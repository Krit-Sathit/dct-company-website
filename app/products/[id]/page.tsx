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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="tag">{p.category}</span>
            <span className="tag" style={{ background: '#f5eedf', color: 'var(--gold)' }}>B2B Specification</span>
          </div>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>Product Detail — ข้อมูลจำเพาะทางเทคนิค</h2>
          <p className="lead" style={{ marginBottom: '24px', fontSize: '15px' }}>{p.description}</p>

          {/* 1. Product Name */}
          <div className="spec">
            <span>Product Name</span>
            <b>{p.name} {p.nameEn ? `(${p.nameEn})` : ''}</b>
          </div>

          {/* 2. Product Type */}
          <div className="spec">
            <span>Product Type</span>
            <b>{p.type || 'Chilled (สดแช่เย็น 0-4°C) / Frozen (แช่แข็ง -18°C)'}</b>
          </div>

          {/* 3. Cut Part */}
          <div className="spec">
            <span>Cut Part</span>
            <b>{p.cutPart || p.name}</b>
          </div>

          {/* 4. Cutting Options */}
          <div className="spec">
            <span>Cutting Options</span>
            <b>{p.cut}</b>
          </div>

          {/* 5. Portion / Thickness */}
          {p.thickness && (
            <div className="spec">
              <span>Portion / Thickness</span>
              <b>{p.thickness}</b>
            </div>
          )}

          {/* 6. Meat / Fat Ratio */}
          {p.meatFatRatio && (
            <div className="spec">
              <span>Meat / Fat Ratio</span>
              <b>{p.meatFatRatio}</b>
            </div>
          )}

          {/* 7. Packaging */}
          <div className="spec">
            <span>Packaging</span>
            <b>{p.pack}</b>
          </div>

          {/* 8. Shelf Life */}
          {p.shelfLife && (
            <div className="spec">
              <span>Shelf Life</span>
              <b>{p.shelfLife}</b>
            </div>
          )}

          {/* 9. MOQ */}
          {p.moq && (
            <div className="spec">
              <span>MOQ</span>
              <b>{p.moq}</b>
            </div>
          )}

          {/* 10. Storage & Use */}
          <div className="spec">
            <span>Storage & Use</span>
            <b>{p.storage} · {p.use}</b>
          </div>

          {/* Dual CTAs from Master Copy v2.0 */}
          <div className="actions" style={{ marginTop: '36px' }}>
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
