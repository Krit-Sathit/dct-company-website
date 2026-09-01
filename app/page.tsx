'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products as defaultProducts, articles, Product } from '@/lib/data';
import { AddButton } from '@/components/site';
import { CompanyProfileSettings, defaultCompanyProfile, getCompanyProfile } from '@/lib/settings';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

const industries = [
  {
    id: 'restaurants',
    title: 'ร้านอาหาร & ภัตตาคาร',
    subtitle: 'วัตถุดิบเนื้อสุกรสำหรับการใช้งานในธุรกิจร้านอาหาร',
    desc: 'บริการตัดแต่งสเปก สไลซ์บาง ชาบู ปิ้งย่าง สเต๊ก พร้อมใช้งานได้ทันที ลดขั้นตอนและเวลาการเตรียมในครัว',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    tags: ['สไลซ์ชาบู/ปิ้งย่าง', 'ควบคุม Portion', 'Vacuum Pack'],
  },
  {
    id: 'food-factories',
    title: 'โรงงานอาหารแปรรูป',
    subtitle: 'วัตถุดิบที่รองรับความต้องการของกระบวนการผลิต',
    desc: 'รองรับการคัดสรรสัดส่วนเนื้อต่อไขมัน (Meat/Fat Ratio) สเปกการบด และการส่งมอบในปริมาณมากอย่างต่อเนื่อง',
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1000&q=80',
    tags: ['Meat/Fat Ratio 80/20', 'บดหยาบ/ละเอียด', 'Lot Consistency'],
  },
  {
    id: 'wholesalers',
    title: 'ผู้ค้าส่งวัตถุดิบ',
    subtitle: 'รองรับความต้องการด้านสินค้าและปริมาณสำหรับธุรกิจค้าส่ง',
    desc: 'กำลังการผลิตและสต็อกที่เพียงพอ พร้อมระบบการจัดส่งแบบยกพาเลทและ Bulk Packaging ที่สะดวกต่อการกระจายสินค้า',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    tags: ['Bulk Packaging', 'สต็อกพร้อมส่ง', 'Pallet Logistics'],
  },
  {
    id: 'supermarkets',
    title: 'ซูเปอร์มาร์เก็ต & โมเดิร์นเทรด',
    subtitle: 'รองรับวัตถุดิบสำหรับการจัดจำหน่ายและค้าปลีก',
    desc: 'บรรจุภัณฑ์มาตรฐานสำหรับวางจำหน่ายหน้าร้าน คุมความสด สะอาด และปลอดภัยด้วยมาตรฐาน GHP/HACCP',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    tags: ['Retail Ready', 'มาตรฐาน อย.', 'Chilled Delivery'],
  },
  {
    id: 'corporate',
    title: 'ลูกค้าองค์กร & ครัวกลาง',
    subtitle: 'รองรับความต้องการด้านวัตถุดิบและ Supply ของลูกค้าองค์กร',
    desc: 'การวางแผน Supply Chain ระยะยาว ทำงานร่วมกับทีมจัดซื้อและเชฟ เพื่อส่งมอบวัตถุดิบที่ตอบโจทย์โครงสร้างต้นทุน',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80',
    tags: ['สัญญาระยะยาว', 'Supply Planning', 'Dedicated Account'],
  },
];

export default function Home() {
  const [profile, setProfile] = useState<CompanyProfileSettings>(defaultCompanyProfile);
  const [prods, setProds] = useState<Product[]>(defaultProducts);
  const [activeIndustry, setActiveIndustry] = useState(0);

  useEffect(() => {
    async function load() {
      // 1. Load company profile
      const prof = await getCompanyProfile();
      setProfile(prof);

      // 2. Load products from Supabase or Server CMS API
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const { data: dbProducts } = await client.from('products').select('*').eq('active', true).limit(4);
          if (dbProducts && dbProducts.length > 0) {
            setProds(
              dbProducts.map((p) => ({
                id: p.slug || p.id,
                name: p.name,
                code: p.sku || 'DCT-PK-000',
                category: p.category_id || 'สินค้าแนะนำ',
                description: p.description || '',
                type: p.cut_format || 'สดแช่เย็น / แช่แข็ง',
                cut: p.cut_format || 'Custom cut',
                pack: p.packing || 'ตามสเปกลูกค้า',
                storage: p.storage || 'แช่เย็น / แช่แข็ง',
                use: p.recommended_use || 'ธุรกิจอาหาร',
                image: p.image_url || '/products/pork-neck.webp',
              }))
            );
            return;
          }
        } catch {
          // ignore
        }
      }

      // 3. Server CMS API Fallback
      try {
        const res = await fetch('/api/cms?table=products', { cache: 'no-store' });
        if (res.ok) {
          const serverProducts = await res.json();
          if (Array.isArray(serverProducts) && serverProducts.length > 0) {
            const activeOnes = serverProducts.filter((p: any) => p.active !== false);
            if (activeOnes.length > 0) {
              setProds(
                activeOnes.map((p: any) => ({
                  id: p.slug || p.id,
                  name: p.name,
                  code: p.sku || 'DCT-PK-000',
                  category: p.category || 'สินค้าแนะนำ',
                  description: p.description || '',
                  type: p.cut_format || 'สดแช่เย็น / แช่แข็ง',
                  cut: p.cut_format || 'Custom cut',
                  pack: p.packing || 'ตามสเปกลูกค้า',
                  storage: p.storage || 'แช่เย็น / แช่แข็ง',
                  use: p.recommended_use || 'ธุรกิจอาหาร',
                  image: p.image_url || p.image || '/products/pork-neck.webp',
                }))
              );
              return;
            }
          }
        }
      } catch {
        // ignore
      }

      setProds(defaultProducts);
    }
    void load();
  }, []);

  const heroBg = profile.hero_image_url || '/hero-banner.webp';
  const currentInd = industries[activeIndustry];

  return (
    <>
      {/* SECTION 01 — HERO (Video Ready & Master Copy v2.0) */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(247, 242, 234, 0.90) 0%, rgba(247, 242, 234, 0.45) 42%, rgba(247, 242, 234, 0.05) 65%), url('${heroBg}')`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="wrap hero-content">
          <div className="eyebrow">{profile.tagline || 'DUANGCHAROEN INTERTRADE CO., LTD.'}</div>
          <h1 style={{ whiteSpace: 'pre-line' }}>{profile.headline || 'แหล่งวัตถุดิบเนื้อสุกรสำหรับธุรกิจ'}</h1>
          <div className="hero english-tag" style={{ minHeight: 'auto', padding: 0, background: 'none' }}>
            Reliable Pork Supply for Business
          </div>
          <p>{profile.subheadline || 'ที่ต้องการคุณภาพสม่ำเสมอ ปริมาณเพียงพอ และการจัดส่งที่ไว้ใจได้'}</p>
          <div className="actions">
            <Link className="button" href="/products">
              ดูสินค้าและบริการ
            </Link>
            <Link className="button alt" href="/rfq">
              ขอใบเสนอราคา
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 02 — ทำไมธุรกิจเลือกเรา (Staggered Feature Strip) */}
      <section className="section white">
        <div className="wrap">
          <div className="eyebrow">Why Choose DCT</div>
          <h2>ทำไมธุรกิจเลือกเรา</h2>
          <p className="lead">
            โครงสร้างการทำงานและมาตรฐานที่ออกแบบมาเพื่อสนับสนุนการเติบโตอย่างมั่นคงของธุรกิจอาหาร
          </p>
          <div className="feature-strip">
            {[
              {
                num: '01',
                title: 'คุณภาพสม่ำเสมอ',
                desc: 'ควบคุมคุณภาพของวัตถุดิบและกระบวนการผลิต เพื่อส่งมอบสินค้าที่มีคุณภาพสม่ำเสมอทุกล็อต',
              },
              {
                num: '02',
                title: 'ปลอดภัย มั่นใจได้',
                desc: 'ควบคุมกระบวนการผลิตภายใต้มาตรฐานด้านความปลอดภัยอาหารระดับสากล',
              },
              {
                num: '03',
                title: 'กำลังการผลิตเพียงพอ',
                desc: 'รองรับความต้องการของธุรกิจ และการสั่งซื้อในปริมาณที่เหมาะสมได้อย่างต่อเนื่อง',
              },
              {
                num: '04',
                title: 'จัดส่งตรงเวลา',
                desc: 'ระบบจัดเก็บและการขนส่งควบคุมอุณหภูมิ เพื่อรองรับการส่งมอบตรงตามเวลานัดหมาย',
              },
              {
                num: '05',
                title: 'บริการใส่ใจทุกความต้องการ',
                desc: 'ให้บริการและประสานงานกับคู่ค้าอย่างใกล้ชิด เพื่อตอบโจทย์ของแต่ละธุรกิจ',
              },
            ].map((f) => (
              <div className="feature-box" key={f.num}>
                <div className="f-num">{f.num}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03 — กลุ่มลูกค้าของเรา (Interactive Industry Selector) */}
      <section className="section beige">
        <div className="wrap">
          <div className="eyebrow">Target Industries</div>
          <h2>กลุ่มลูกค้าของเรา</h2>
          <p className="lead">
            เรารองรับธุรกิจอาหารหลากหลายรูปแบบ ด้วยความเข้าใจในกระบวนการและความต้องการเฉพาะด้าน
          </p>

          <div className="industry-container">
            <div className="industry-nav">
              {industries.map((ind, i) => (
                <button
                  type="button"
                  key={ind.id}
                  className={`industry-btn ${activeIndustry === i ? 'active' : ''}`}
                  onClick={() => setActiveIndustry(i)}
                >
                  <span>{ind.title}</span>
                  <span>→</span>
                </button>
              ))}
            </div>

            <div className="industry-panel">
              <div
                className="photo-preview"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%), url('${currentInd.image}')`,
                }}
              />
              <h3 style={{ color: 'var(--red)', margin: '0 0 6px' }}>{currentInd.title}</h3>
              <p style={{ fontWeight: 700, margin: '0 0 10px', color: 'var(--ink)' }}>{currentInd.subtitle}</p>
              <p style={{ margin: '0 0 18px', color: '#6e584a', lineHeight: 1.7 }}>{currentInd.desc}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {currentInd.tags.map((t) => (
                  <span className="tag" key={t}>
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — สินค้าแนะนำ (Featured Sales Tool & Promotion) */}
      <section className="section white">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="eyebrow">Product Catalogue</div>
              <h2>สินค้าแนะนำ</h2>
              <p className="lead">
                วัตถุดิบเนื้อสุกรที่ตอบโจทย์การใช้งานของธุรกิจ พร้อมรูปแบบการตัดแต่งตามความต้องการ
              </p>
            </div>
            <Link className="button alt" href="/products">
              ดูแคตตาล็อกสินค้าทั้งหมด →
            </Link>
          </div>

          <div className="grid four" style={{ marginTop: '36px' }}>
            {prods.slice(0, 4).map((p) => (
              <div className="card product-card" key={p.id}>
                <div className="product-image" style={{ backgroundImage: `url(${p.image})` }} />
                <div className="inside">
                  <div className="num" style={{ fontSize: '11px' }}>{p.code}</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>{p.name}</h3>
                  <p className="small" style={{ color: '#6e584a', marginBottom: '14px' }}>
                    {p.description}
                  </p>
                  <div className="actions">
                    <Link className="button alt" href={`/products/${p.id}`} style={{ width: '100%', fontSize: '13px', padding: '9px 12px' }}>
                      ดูรายละเอียด
                    </Link>
                    <div style={{ width: '100%' }}>
                      <AddButton product={p} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stock Promotion Module */}
          <div className="promotion-banner-box">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="tag" style={{ background: 'var(--red)', color: '#fff' }}>
                  🔥 Stock Promotion
                </span>
                <strong style={{ fontSize: '18px', color: 'var(--ink)' }}>สินค้าพร้อมขาย / Stock Promotion</strong>
              </div>
              <p style={{ margin: 0, color: '#6e584a', fontSize: '15px' }}>
                สินค้าที่พร้อมส่งมอบในราคาพิเศษ ประจำเดือน
              </p>
            </div>
            <Link className="button" href="/rfq" style={{ whiteSpace: 'nowrap' }}>
              ดูสินค้า
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 05 — เกี่ยวกับเรา (Split Screen Story) */}
      <section className="section beige">
        <div className="wrap split">
          <div>
            <div className="eyebrow">About Duangcharoen</div>
            <h2>เกี่ยวกับเรา</h2>
            <p className="lead" style={{ fontWeight: 600, color: 'var(--ink)' }}>
              บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด เป็นผู้เชี่ยวชาญด้านการแปรรูปและตัดแต่งเนื้อสุกรคุณภาพสูง พร้อมให้บริการคลังสินค้าควบคุมอุณหภูมิสำหรับอาหารสด อาหารแช่เย็น แช่แข็ง และอาหารแห้งครบวงจร
            </p>
            <p style={{ lineHeight: 1.8, color: '#5e483b', marginTop: '16px' }}>
              เรามุ่งมั่นยกระดับห่วงโซ่อุปทานอาหาร (Food Supply Chain) ของไทย ด้วยการส่งมอบวัตถุดิบเนื้อสุกรที่สด สะอาด มีคุณภาพสม่ำเสมอ เพื่อตอบโจทย์ความต้องการของกลุ่มลูกค้าร้านอาหาร โรงงานแปรรูปอาหาร ซูเปอร์มาร์เก็ต และผู้ประกอบการ B2B ทั่วประเทศ
            </p>
            <div className="actions" style={{ marginTop: '28px' }}>
              <Link className="button" href="/about">
                เกี่ยวกับเรา
              </Link>
            </div>
          </div>
          <div
            className="photo"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80')`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </section>

      {/* SECTION 06 — บริการของเรา (Capability Flow - No OEM) */}
      <section className="section white">
        <div className="wrap">
          <div className="eyebrow">Our Capabilities</div>
          <h2>บริการของเรา</h2>
          <p className="lead">
            โครงสร้างบริการที่ครอบคลุมตั้งแต่การตัดแต่ง คลังสินค้า บรรจุภัณฑ์ จนถึงการกระจายสินค้าแบบควบคุมอุณหภูมิ
          </p>

          <div className="capability-grid">
            {[
              {
                step: '01',
                title: 'รับตัดแต่งตามความต้องการ',
                desc: 'บริการตัดแต่งเนื้อสุกรตามขนาด รูปแบบ และ Specification ที่ต้องการ',
                img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '02',
                title: 'จัดเก็บในคลังสินค้ามาตรฐาน',
                desc: 'บริการคลังสินค้าควบคุมอุณหภูมิ รองรับการจัดเก็บอาหารแช่เย็น แช่แข็ง และอาหารแห้ง',
                img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '03',
                title: 'แพ็กสินค้าแบบต่าง ๆ',
                desc: 'รองรับรูปแบบบรรจุภัณฑ์ที่เหมาะกับการจัดเก็บและการใช้งานของลูกค้า เช่น Vacuum Packaging',
                img: '/products/pork-belly.webp',
              },
              {
                step: '04',
                title: 'จัดส่งด้วยระบบควบคุมอุณหภูมิ',
                desc: 'ระบบขนส่งควบคุมอุณหภูมิ เพื่อรักษาคุณภาพและความสดใหม่ของสินค้าจากโรงงานถึงมือลูกค้า',
                img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
              },
            ].map((c) => (
              <div className="capability-card" key={c.step}>
                <div className="capability-img" style={{ backgroundImage: `url('${c.img}')` }} />
                <div className="capability-content">
                  <div className="step-no">CAPABILITY {c.step}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', background: '#fdf9f4', border: '1px solid #eadfd4', borderRadius: '6px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>05 — ให้คำปรึกษาและดูแลคู่ค้า</strong>
              <p style={{ margin: '4px 0 0', color: '#6e584a', fontSize: '14px' }}>ให้บริการและประสานงานกับคู่ค้า เพื่อรองรับความต้องการของแต่ละธุรกิจ</p>
            </div>
            <Link className="button alt" href="/services">
              ดูบริการทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 07 — มาตรฐานการผลิตที่คุณวางใจ (Quality & Standards) */}
      <section className="section beige">
        <div className="wrap">
          <div className="eyebrow">Quality & Standards</div>
          <h2>มาตรฐานการผลิตที่คุณวางใจ</h2>
          <p className="lead">
            เราให้ความสำคัญกับความปลอดภัยด้านอาหารและคุณภาพในทุกขั้นตอน ตั้งแต่การคัดสรรวัตถุดิบ การตัดแต่ง การควบคุมอุณหภูมิ ไปจนถึงการจัดเก็บและส่งมอบ
          </p>

          <div className="quality-flow">
            {[
              { num: '01', title: 'Raw Material', desc: 'การคัดสรรวัตถุดิบจากแหล่งที่สามารถตรวจสอบย้อนกลับได้' },
              { num: '02', title: 'Processing', desc: 'การตัดแต่งในพื้นที่ที่ควบคุมอุณหภูมิและสุขอนามัย' },
              { num: '03', title: 'Storage', desc: 'การจัดเก็บภายใต้เงื่อนไขอุณหภูมิที่เหมาะสม' },
              { num: '04', title: 'Delivery', desc: 'การขนส่งควบคุมอุณหภูมิเพื่อรักษาคุณภาพจนถึงลูกค้า' },
            ].map((q) => (
              <div className="quality-step" key={q.num}>
                <div className="q-num">STEP {q.num}</div>
                <h4>{q.title}</h4>
                <p>{q.desc}</p>
              </div>
            ))}
          </div>

          <div className="cert-badges">
            <div className="cert-badge">🏅 GHP — Good Hygiene Practices</div>
            <div className="cert-badge">🛡️ HACCP — Hazard Analysis and Critical Control Points</div>
            <div className="cert-badge">⚙️ ระบบควบคุมคุณภาพ — ตรวจสอบและควบคุมคุณภาพในทุกขั้นตอนการผลิต</div>
            <div className="cert-badge">🔍 Traceability — ตรวจสอบย้อนกลับได้</div>
            <div className="cert-badge">🏢 อย. / ปศุสัตว์ OK — รอเอกสารยืนยันจากบริษัท</div>
            <Link className="button alt" href="/standards" style={{ marginLeft: 'auto', fontSize: '13px', padding: '8px 14px' }}>
              ดูมาตรฐานการผลิต
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 08 — Business Proof & Statistics (Burgundy Proof Band) */}
      <section className="section burgundy" style={{ padding: '64px 0' }}>
        <div className="wrap">
          <div className="stats-band">
            {[
              { num: '30+', label: 'ปี — ประสบการณ์ในอุตสาหกรรม', tbc: 'TBC' },
              { num: '1,000+', label: 'ราย — ลูกค้าธุรกิจที่ไว้วางใจ', tbc: 'TBC' },
              { num: '300', unit: 'ตัน/เดือน', label: 'กำลังการผลิตและกระจายสินค้า', tbc: 'TBC' },
              { num: '100+', label: 'คัน — รถห้องเย็นควบคุมอุณหภูมิ', tbc: 'TBC' },
            ].map((s, idx) => (
              <div className="stat-item" key={idx}>
                <div className="stat-num">
                  {s.num} {s.unit && <span style={{ fontSize: '22px' }}>{s.unit}</span>}
                </div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-tbc">สถานะ: {s.tbc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 09 — FINAL CTA (Partnership) */}
      <section className="section white">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div className="eyebrow">Start Partnership</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 46px)' }}>พร้อมเป็นส่วนหนึ่งในการเติบโตของธุรกิจคุณ</h2>
          <p className="lead" style={{ margin: '16px auto 32px' }}>
            ให้เราช่วยดูแลความต้องการด้านวัตถุดิบเนื้อสุกร การตัดแต่ง และการจัดส่ง เพื่อให้ธุรกิจของคุณทำงานได้อย่างต่อเนื่องและมีประสิทธิภาพสูงสุด
          </p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <Link className="button" href="/contact" style={{ padding: '14px 28px', fontSize: '16px' }}>
              ติดต่อฝ่ายขาย
            </Link>
            <Link className="button alt" href="/rfq" style={{ padding: '14px 28px', fontSize: '16px' }}>
              ขอใบเสนอราคาออนไลน์
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
