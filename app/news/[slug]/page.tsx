import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/data';

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return notFound();

  return (
    <>
      <section className="page-hero">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="tag">{a.category}</span>
            <span className="article-meta">{a.date}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.3 }}>{a.title}</h1>
        </div>
      </section>

      <article className="wrap section" style={{ maxWidth: '820px', background: '#fffdf9', border: '1px solid #eadfd4', borderRadius: '6px', padding: '40px', margin: '40px auto' }}>
        <p className="lead" style={{ fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid #eadfd4', paddingBottom: '20px', marginBottom: '24px' }}>
          {a.excerpt}
        </p>
        
        <div style={{ whiteSpace: 'pre-line', lineHeight: 1.9, fontSize: '16px', color: '#4a3328' }}>
          {a.content || a.excerpt}
        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #eadfd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Link className="button alt" href="/news">
            ← กลับไปหน้าข่าวสาร
          </Link>
          <Link className="button" href="/rfq">
            ขอใบเสนอราคาวัตถุดิบ
          </Link>
        </div>
      </article>
    </>
  );
}
