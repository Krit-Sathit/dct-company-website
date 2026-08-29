'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products as defaultProducts, articles, Product } from '@/lib/data';
import { AddButton } from '@/components/site';
import { CompanyProfileSettings, defaultCompanyProfile, getCompanyProfile } from '@/lib/settings';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

export default function Home() {
  const [profile, setProfile] = useState<CompanyProfileSettings>(defaultCompanyProfile);
  const [prods, setProds] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    async function load() {
      // 1. Load company profile
      const prof = await getCompanyProfile();
      setProfile(prof);

      // 2. Load products from Supabase Cloud if configured
      if (!isSupabaseConfigured()) {
        setProds(defaultProducts);
        return;
      }

      try {
        const client = supabaseBrowser();
        const { data: dbProducts } = await client.from('products').select('*').eq('active', true).limit(3);
        if (dbProducts && dbProducts.length > 0) {
          setProds(
            dbProducts.map((p) => ({
              id: p.slug || p.id,
              name: p.name,
              code: p.sku || 'DCT-PK-000',
              category: p.category_id || 'สินค้าแนะนำ',
              description: p.description || '',
              cut: p.cut_format || 'Custom cut',
              pack: p.packing || 'ตามสเปกลูกค้า',
              storage: p.storage || 'แช่เย็น / แช่แข็ง',
              use: p.recommended_use || 'ธุรกิจอาหาร',
              image: p.image_url || 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1000&q=80',
            }))
          );
        } else {
          setProds(defaultProducts);
        }
      } catch {
        setProds(defaultProducts);
      }
    }
    void load();
  }, []);

  const heroBg = profile.hero_image_url || '/hero-banner.webp';
  const oemBg = profile.oem_section_image_url || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80';

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(247, 242, 234, 0.85) 0%, rgba(247, 242, 234, 0.35) 35%, rgba(247, 242, 234, 0) 55%), url('${heroBg}')`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="wrap">
          <div className="eyebrow">{profile.tagline || 'DCT · Trusted B2B Food Supply Partner'}</div>
          <h1 style={{ whiteSpace: 'pre-line' }}>{profile.headline}</h1>
          <p>{profile.subheadline}</p>
          <div className="actions">
            <Link className="button" href="/rfq">
              ขอใบเสนอราคา
            </Link>
            <Link className="button alt" href="/products">
              ดูแคตตาล็อกสินค้า
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="eyebrow">What we deliver</div>
          <h2>ความพร้อมที่ช่วยให้ธุรกิจเดินหน้าได้อย่างมั่นใจ</h2>
          <div className="flow" />
          <div className="grid four">
            {[
              ['01', 'Food Safety', 'มองมาตรฐานและความสะอาดเป็นพื้นฐานของทุกขั้นตอน'],
              ['02', 'Precision', 'ปรับรูปแบบการตัดแต่งและบรรจุภัณฑ์ให้ตรงสเปก'],
              ['03', 'Cold Chain', 'ดูแลคุณภาพตลอดการจัดเก็บและการส่งมอบ'],
              ['04', 'Reliability', 'วางแผนการส่งมอบอย่างเป็นระบบสำหรับลูกค้า B2B'],
            ].map((x) => (
              <div className="card" key={x[1]}>
                <div className="num">{x[0]}</div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section beige">
        <div className="wrap">
          <div className="eyebrow">Product catalogue</div>
          <h2>เลือกสินค้า พร้อมต่อยอดตามสเปกของคุณ</h2>
          <div className="grid three">
            {prods.slice(0, 3).map((p) => (
              <div className="card product-card" key={p.id}>
                <div className="product-image" style={{ backgroundImage: `url(${p.image})` }} />
                <div className="inside">
                  <h3>{p.name}</h3>
                  <p className="small">{p.description}</p>
                  <div className="actions">
                    <AddButton product={p} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="actions" style={{ marginTop: '24px' }}>
            <Link className="button alt" href="/products">
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div
            className="photo"
            style={{
              backgroundImage: `url('${oemBg}')`,
            }}
          />
          <div>
            <div className="eyebrow">Custom Cut · OEM</div>
            <h2>{profile.oem_title || 'สเปกที่ชัดเจน คือจุดเริ่มต้นของการทำงานที่ลื่นไหล'}</h2>
            <p className="lead">
              {profile.oem_description ||
                'Custom Cut, Slice, Dice, Mince, Vacuum และ OEM สำหรับร้านอาหาร ครัวกลาง และผู้ผลิตอาหารที่ต้องการความสม่ำเสมอในทุกล็อต'}
            </p>
            <Link className="button" href="/services">
              ดูบริการของเรา
            </Link>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="eyebrow">Supply chain</div>
          <h2>ดูแลความพร้อม ตั้งแต่วัตถุดิบจนถึงคู่ค้าของเรา</h2>
          <div className="steps">
            {['Source', 'Process', 'Store', 'Deliver', 'Partner'].map((x, i) => (
              <div className="step" key={x}>
                <b>0{i + 1}</b>
                <strong>{x}</strong>
                <p className="small">
                  {
                    [
                      'คัดสรรตามแนวทางที่ตกลง',
                      'ตัดแต่งและควบคุมสเปก',
                      'จัดเก็บตามเงื่อนไขสินค้า',
                      'จัดส่งตามแผนงาน',
                      'สนับสนุนการเติบโตของธุรกิจ',
                    ][i]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="eyebrow">Insights</div>
          <h2>ข่าวสารและความรู้สำหรับธุรกิจอาหาร</h2>
          <div className="grid three">
            {articles.map((a) => (
              <Link className="card" href={`/news/${a.slug}`} key={a.slug}>
                <span className="tag">{a.category}</span>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
                <p className="article-meta">{a.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
