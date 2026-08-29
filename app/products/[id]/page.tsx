import { notFound } from 'next/navigation';
import { products as defaultProducts, Product } from '@/lib/data';
import { AddButton } from '@/components/site';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  // Match by id or slug
  let p: Product | undefined = defaultProducts.find(
    (x) => x.id === decodedId || x.code.toLowerCase() === decodedId.toLowerCase()
  );

  if (!p) {
    // If not found in defaults, return notFound()
    return notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">รหัสสินค้า: {p.code}</div>
          <h1>{p.name}</h1>
          <p className="lead">{p.description}</p>
        </div>
      </section>

      <main className="wrap section details">
        <div
          className="photo"
          style={{
            backgroundImage: `url(${p.image})`,
          }}
        />
        <div>
          <span className="tag">{p.category}</span>
          <h2>{p.name}</h2>
          <p className="lead">{p.description}</p>

          <div className="spec">
            <span>รูปแบบการตัดแต่ง</span>
            <b>{p.cut}</b>
          </div>
          <div className="spec">
            <span>ขนาด / หน่วยบรรจุ</span>
            <b>{p.pack}</b>
          </div>
          <div className="spec">
            <span>การเก็บรักษา</span>
            <b>{p.storage}</b>
          </div>
          <div className="spec">
            <span>การใช้งานแนะนำ</span>
            <b>{p.use}</b>
          </div>

          <div className="actions" style={{ marginTop: '24px' }}>
            <AddButton product={p} />
          </div>
        </div>
      </main>
    </>
  );
}
