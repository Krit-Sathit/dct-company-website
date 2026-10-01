'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles as defaultArticles } from '@/lib/data';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

type ArticleItem = {
  id?: string;
  slug: string;
  title: string;
  category?: string;
  date?: string;
  excerpt: string;
  content?: string;
  cover_image_url?: string;
  status?: string;
};

export default function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. Try Supabase
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const { data } = await client.from('articles').select('*').eq('slug', slug).maybeSingle();
          if (data) {
            setArticle({
              id: data.id,
              slug: data.slug,
              title: data.title,
              category: data.category || 'Food Safety',
              date: data.published_at ? new Date(data.published_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'ล่าสุด',
              excerpt: data.excerpt || '',
              content: data.content || data.excerpt || '',
              cover_image_url: data.cover_image_url,
            });
            setLoading(false);
            return;
          }
        } catch {}
      }

      // 2. Try Server API
      try {
        const res = await fetch('/api/cms?table=articles', { cache: 'no-store' });
        if (res.ok) {
          const serverData = await res.json();
          if (Array.isArray(serverData)) {
            const found = serverData.find((a: any) => a.slug === slug || a.id === slug);
            if (found) {
              setArticle({
                id: found.id,
                slug: found.slug,
                title: found.title,
                category: found.category || 'Food Safety',
                date: found.published_at ? new Date(found.published_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'ล่าสุด',
                excerpt: found.excerpt || '',
                content: found.content || found.excerpt || '',
                cover_image_url: found.cover_image_url,
              });
              setLoading(false);
              return;
            }
          }
        }
      } catch {}

      // 3. Fallback to default
      const defaultFound = defaultArticles.find((x) => x.slug === slug);
      if (defaultFound) {
        setArticle(defaultFound);
      }
      setLoading(false);
    }

    void load();
  }, [slug]);

  if (!article && !loading) return notFound();

  if (!article) {
    return (
      <div className="wrap section" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p className="lead">กำลังโหลดบทความ...</p>
      </div>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="tag">{article.category || 'Food Safety'}</span>
            <span className="article-meta">{article.date || 'ล่าสุด'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.3 }}>{article.title}</h1>
        </div>
      </section>

      <article className="wrap section" style={{ maxWidth: '820px', background: '#fffdf9', border: '1px solid #eadfd4', borderRadius: '6px', padding: '40px', margin: '40px auto' }}>
        <p className="lead" style={{ fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid #eadfd4', paddingBottom: '20px', marginBottom: '24px' }}>
          {article.excerpt}
        </p>
        
        {article.cover_image_url && (
          <div style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={article.cover_image_url} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div style={{ whiteSpace: 'pre-line', lineHeight: 1.9, fontSize: '16px', color: '#4a3328' }}>
          {article.content || article.excerpt}
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
