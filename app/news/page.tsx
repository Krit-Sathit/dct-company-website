'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function News() {
  const [articlesList, setArticlesList] = useState<ArticleItem[]>(defaultArticles);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const { data } = await client.from('articles').select('*').eq('status', 'published');
          if (data && data.length > 0) {
            setArticlesList(
              data.map((a, i) => ({
                id: a.id,
                slug: a.slug || `article-${i + 1}`,
                title: a.title,
                category: a.category || 'Food Safety',
                date: a.published_at ? new Date(a.published_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'ล่าสุด',
                excerpt: a.excerpt || '',
                content: a.content || a.excerpt || '',
                cover_image_url: a.cover_image_url,
              }))
            );
            return;
          }
        } catch {}
      }

      try {
        const res = await fetch('/api/cms?table=articles', { cache: 'no-store' });
        if (res.ok) {
          const serverData = await res.json();
          if (Array.isArray(serverData) && serverData.length > 0) {
            const activeOnes = serverData.filter((a: any) => a.status !== 'draft');
            if (activeOnes.length > 0) {
              setArticlesList(
                activeOnes.map((a: any, i: number) => ({
                  id: a.id,
                  slug: a.slug || `article-${i + 1}`,
                  title: a.title,
                  category: a.category || 'Food Safety',
                  date: a.published_at ? new Date(a.published_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'ล่าสุด',
                  excerpt: a.excerpt || '',
                  content: a.content || a.excerpt || '',
                  cover_image_url: a.cover_image_url,
                }))
              );
              return;
            }
          }
        }
      } catch {}

      setArticlesList(defaultArticles);
    }

    void load();

    const handleCmsUpdate = (e: any) => {
      if (!e.detail || e.detail.table === 'articles') void load();
    };
    window.addEventListener('dct_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('dct_cms_updated', handleCmsUpdate);
  }, []);

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
          {articlesList.map((a) => (
            <Link className="card" href={`/news/${a.slug}`} key={a.slug} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="tag">{a.category || 'Food Safety'}</span>
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
