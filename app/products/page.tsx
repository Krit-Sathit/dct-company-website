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
      if (!isSupabaseConfigured()) {
        setProductList(defaultProducts);
        setCatList(defaultCategories);
        return;
      }

      try {
        const client = supabaseBrowser();
        const [{ data: dbProducts }, { data: dbCategories }] = await Promise.all([
          client.from('products').select('*').eq('active', true),
          client.from('categories').select('*').eq('active', true).order('sort_order', { ascending: true }),
        ]);

        if (dbCategories && dbCategories.length > 0) {
          const names = ['ทั้งหมด', ...dbCategories.map((cat) => cat.name)];
          setCatList(names);
        }

        if (dbProducts && dbProducts.length > 0) {
          const mapped: Product[] = dbProducts.map((p) => ({
            id: p.slug || p.id,
            name: p.name,
            code: p.sku || 'DCT-PK-000',
            category: p.category_id || 'สินค้าทั่วไป',
            description: p.description || '',
            cut: p.cut_format || 'Custom cut',
            pack: p.packing || 'ตามสเปกลูกค้า',
            storage: p.storage || 'แช่เย็น / แช่แข็ง',
            use: p.recommended_use || 'ธุรกิจอาหาร',
            image: p.image_url || 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1000&q=80',
          }));
          setProductList(mapped);
        } else {
          setProductList(defaultProducts);
        }
      } catch {
        setProductList(defaultProducts);
      }
    }
    void load();
  }, []);

  const list = productList.filter(
    (p) =>
      (c === 'ทั้งหมด' || p.category === c) &&
      `${p.name} ${p.code} ${p.description}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">B2B Catalogue</div>
          <h1>ผลิตภัณฑ์และหมวดหมู่สินค้า</h1>
          <p className="lead">
            รายละเอียดสินค้าและสเปกเนื้อสุกรตัดแต่งสำหรับธุรกิจอาหาร เลือกลงรายการเพื่อขอใบเสนอราคา
          </p>
        </div>
      </section>

      <main className="wrap section">
        <div className="catalog-tools">
          <input
            className="field filter"
            placeholder="🔍 ค้นหาชื่อ สเปก หรือรหัสสินค้า..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="field filter" value={c} onChange={(e) => setC(e.target.value)}>
            {catList.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>

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
                <h3>{p.name}</h3>
                <p className="small">
                  <b>รหัส:</b> {p.code}
                  <br />
                  {p.description}
                </p>
                <div className="actions">
                  <Link className="button alt" href={`/products/${p.id}`}>
                    ดูสเปกสินค้า
                  </Link>
                  <AddButton product={p} />
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
      </main>
    </>
  );
}
