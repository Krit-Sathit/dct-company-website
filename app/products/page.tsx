'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categories as defaultCategories, products as defaultProducts, Product } from '@/lib/data';
import { AddButton } from '@/components/site';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

export default function Products() {
  const [q, setQ] = useState('');
  const [c, setC] = useState('ทั้งหมด');
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [catList, setCatList] = useState<string[]>(defaultCategories);

  useEffect(() => {
    async function load() {
      // 1. Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const [{ data: dbProducts }, { data: dbCategories }] = await Promise.all([
            client.from('products').select('*').eq('active', true),
            client.from('categories').select('*').eq('active', true).order('sort_order', { ascending: true }),
          ]);

          if (dbCategories && dbCategories.length > 0) {
            setCatList(['ทั้งหมด', ...dbCategories.map((cat) => cat.name)]);
          }

          if (dbProducts && dbProducts.length > 0) {
            const mapped: Product[] = dbProducts.map((p) => ({
              id: p.slug || p.id,
              name: p.name,
              nameEn: p.name_en,
              code: p.sku || 'DCT-PK-000',
              category: p.category || p.category_id || 'ชิ้นส่วนมาตรฐาน',
              description: p.description || '',
              type: p.type || 'สดแช่เย็น (Chilled) / แช่แข็ง (Frozen)',
              cut: p.cut_format || 'Custom cut',
              thickness: p.thickness || 'ตามสเปก',
              meatFatRatio: p.meat_fat_ratio || 'ตามสเปก',
              pack: p.packing || 'Vacuum pack',
              storage: p.storage || 'แช่เย็น 0-4°C / แช่แข็ง -18°C',
              shelfLife: p.shelf_life || 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
              moq: p.moq || 'ขั้นต่ำ 20 กก.',
              use: p.recommended_use || 'ธุรกิจอาหาร',
              image: p.image_url || p.image || '/products/pork-neck.webp',
            }));
            setProductList(mapped);
            return;
          }
        } catch {
          // Fallback to Server API
        }
      }

      // 2. Fetch from Server API (Auto-CMS Store)
      try {
        const res = await fetch('/api/cms?table=products', { cache: 'no-store' });
        if (res.ok) {
          const serverProducts = await res.json();
          if (Array.isArray(serverProducts) && serverProducts.length > 0) {
            const activeOnes = serverProducts.filter((p: any) => p.active !== false);
            if (activeOnes.length > 0) {
              setProductList(
                activeOnes.map((p: any) => ({
                  id: p.slug || p.id,
                  name: p.name,
                  nameEn: p.nameEn,
                  code: p.sku || 'DCT-PK-000',
                  category: p.category || 'ชิ้นส่วนมาตรฐาน',
                  description: p.description || '',
                  type: p.type || 'สดแช่เย็น (Chilled) / แช่แข็ง (Frozen)',
                  cut: p.cut_format || p.cut || 'Custom cut',
                  thickness: p.thickness || 'ตามสเปก',
                  meatFatRatio: p.meatFatRatio || 'ตามสเปก',
                  pack: p.packing || p.pack || 'Vacuum pack',
                  storage: p.storage || 'แช่เย็น 0-4°C / แช่แข็ง -18°C',
                  shelfLife: p.shelfLife || 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
                  moq: p.moq || 'ขั้นต่ำ 20 กก.',
                  use: p.recommended_use || p.use || 'ธุรกิจอาหาร',
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

      // 3. Fallback
      setProductList(defaultProducts);
    }
    void load();
  }, []);

  const list = productList.filter(
    (p) =>
      (c === 'ทั้งหมด' || p.category === c) &&
      `${p.name} ${p.nameEn || ''} ${p.code} ${p.description}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">B2B Product Catalogue · Master v2.0</div>
          <h1>ผลิตภัณฑ์เนื้อสุกรสำหรับธุรกิจ</h1>
          <p className="lead">
            วัตถุดิบเนื้อสุกรสำหรับการใช้งานหลากหลายรูปแบบ พร้อมทางเลือกในการตัดแต่งและควบคุมสเปกตามความต้องการ
          </p>
        </div>
      </section>

      <main className="wrap section">
        {/* Search & Filter Toolbar */}
        <div className="catalog-tools">
          <input
            className="field filter"
            placeholder="🔍 ค้นหาชื่อ สเปก หรือรหัสสินค้า..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1 }}
          />
          <select className="field filter" value={c} onChange={(e) => setC(e.target.value)}>
            {catList.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
          <Link className="button alt" href="/rfq" style={{ whiteSpace: 'nowrap' }}>
            📑 สรุปรายการขอใบเสนอราคา
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid three">
          {list.map((p) => (
            <div className="card product-card" key={p.id}>
              <div
                className="product-image"
                style={{
                  backgroundImage: `url(${p.image})`,
                }}
              />
              <div className="inside">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="tag">{p.category}</span>
                  <span className="num" style={{ fontSize: '11px' }}>{p.code}</span>
                </div>
                <h3 style={{ fontSize: '20px', margin: '4px 0 2px' }}>{p.name}</h3>
                {p.nameEn && <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '8px' }}>{p.nameEn}</div>}
                <p className="small" style={{ color: '#6e584a', marginBottom: '16px', lineHeight: 1.6 }}>
                  {p.description}
                </p>

                <div style={{ background: '#fdf9f4', border: '1px solid #f0e4d6', borderRadius: '4px', padding: '10px 12px', fontSize: '12px', marginBottom: '16px' }}>
                  <div><b>รูปแบบ:</b> {p.cut}</div>
                  <div><b>บรรจุ:</b> {p.pack}</div>
                </div>

                <div className="actions" style={{ marginTop: 'auto' }}>
                  <Link className="button alt" href={`/products/${p.id}`} style={{ width: '100%', fontSize: '13px', padding: '9px 12px' }}>
                    ดูสเปกและข้อมูลเทคนิค
                  </Link>
                  <div style={{ width: '100%' }}>
                    <AddButton product={p} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!list.length && (
          <div className="notice" style={{ marginTop: '24px' }}>
            ไม่พบสินค้าที่ตรงกับคำค้นหา
          </div>
        )}

        {/* Technical Specifications Guide Table */}
        <div style={{ marginTop: '64px' }}>
          <div className="eyebrow">Technical Specifications</div>
          <h2>ตารางสเปกสินค้าและรายละเอียดทางเทคนิคสำหรับ B2B</h2>
          <p className="lead">
            ข้อมูลมาตรฐานสำหรับการสั่งตัดแต่งและกำหนด Specification เพื่อส่งต่อทีมจัดซื้อและโรงงานผลิต
          </p>

          <div className="tech-table-wrap">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>ฟิลด์ข้อมูล (Field Name)</th>
                  <th>รายละเอียดและตัวอย่างข้อมูล (Description Example)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="label">ประเภทเนื้อ (Type)</td>
                  <td>เนื้อสุกรสด (Chilled 0-4°C) / สุกรแช่แข็ง (Frozen -18°C)</td>
                </tr>
                <tr>
                  <td className="label">ส่วนประกอบ / ชิ้นส่วน (Cut Part)</td>
                  <td>สันคอ (Pork Collar), สันนอก (Pork Loin), สามชั้น (Pork Belly), ซี่โครง (Spare Ribs), สันใน, สะโพก</td>
                </tr>
                <tr>
                  <td className="label">รูปแบบการตัดแต่ง (Cutting Options)</td>
                  <td>ชิ้นบล็อก (Whole Cut) / สไลซ์ (Slice) / หั่นเต๋า (Dice) / บด (Mince) / Portion Cut ตามขนาด</td>
                </tr>
                <tr>
                  <td className="label">ความหนา / ขนาดชิ้น (Portion / Thickness)</td>
                  <td>ความหนาสไลซ์ 1.2 - 2.0 มม. หรือ ขนาดหั่นเต๋า 1 นิ้ว / สเต๊กตามน้ำหนักต่อชิ้น (สั่งตัดตามสเปกได้)</td>
                </tr>
                <tr>
                  <td className="label">อัตราส่วนเนื้อต่อไขมัน (Meat/Fat Ratio)</td>
                  <td>เช่น 90/10, 80/20 หรือ 70/30 (สำคัญมากสำหรับโรงงานแปรรูป ไส้กรอก และร้านอาหาร)</td>
                </tr>
                <tr>
                  <td className="label">รูปแบบบรรจุภัณฑ์ (Packaging)</td>
                  <td>สุญญากาศ (Vacuum Sealed) / บรรจุถุง Bulk Pack 5-10 กก. / Custom Box</td>
                </tr>
                <tr>
                  <td className="label">อายุการเก็บรักษา (Shelf Life)</td>
                  <td>แช่เย็น (0 ถึง 4°C): 7-14 วัน / แช่แข็ง (-18°C): 6-12 เดือน</td>
                </tr>
                <tr>
                  <td className="label">ปริมาณสั่งซื้อขั้นต่ำ (MOQ)</td>
                  <td>ขั้นต่ำ 20 กิโลกรัม / 100 กิโลกรัม (หรือตามข้อตกลงรอบส่งมอบของคู่ค้า)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
