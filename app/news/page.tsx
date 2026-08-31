import Link from 'next/link';
import { articles } from '@/lib/data';

export default function News() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">NEWS & KNOWLEDGE HUB · MASTER V2.0</div>
          <h1>ข่าวสารและสาระน่ารู้</h1>
          <p className="lead">
            บทความ เทคนิคการเลือกซื้อเนื้อหมูสำหรับธุรกิจ B2B การเก็บรักษาอาหารสด และความรู้เรื่องมาตรฐาน Food Safety
          </p>
        </div>
      </section>

      <main className="wrap section">
        <div className="grid three">
          {articles.map((a) => (
            <Link className="card" href={`/news/${a.slug}`} key={a.slug} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="tag">{a.category}</span>
                <span className="article-meta">{a.date}</span>
              </div>
              <h3 style={{ fontSize: '18px', lineHeight: 1.5, marginBottom: '10px' }}>{a.title}</h3>
              <p className="small" style={{ color: '#6e584a', lineHeight: 1.7, marginBottom: '18px' }}>
                {a.excerpt}
              </p>
              <div style={{ marginTop: 'auto', color: 'var(--red)', fontWeight: 700, fontSize: '14px' }}>
                อ่านบทความฉบับเต็ม →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
