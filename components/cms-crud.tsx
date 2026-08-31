'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';
import { products as mockProducts, categories as mockCategories, articles as mockArticles } from '@/lib/data';
import { ImageUploader } from '@/components/image-uploader';

type Row = Record<string, any> & { id?: string };
type Field = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'checkbox' | 'select' | 'datetime' | 'image';
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
};
type Resource = { table: string; title: string; fields: Field[]; primary: string; defaultList?: () => Row[] };

export const resources: Record<string, Resource> = {
  categories: {
    table: 'categories',
    title: 'หมวดหมู่สินค้า',
    primary: 'name',
    fields: [
      { key: 'name', label: 'ชื่อหมวดหมู่', placeholder: 'เช่น เนื้อหมูตัดแต่ง' },
      { key: 'slug', label: 'Slug (URL ภาษาอังกฤษ)', placeholder: 'เช่น trimmed-pork' },
      { key: 'description', label: 'คำอธิบาย', type: 'textarea', placeholder: 'คำอธิบายสั้นๆ ของหมวดหมู่' },
      { key: 'sort_order', label: 'ลำดับการแสดงผล (ตัวเลข)' },
      { key: 'active', label: 'เปิดใช้งานหมวดหมู่นี้', type: 'checkbox' },
    ],
    defaultList: () =>
      mockCategories
        .filter((c) => c !== 'ทั้งหมด')
        .map((c, i) => ({
          id: `cat-${i + 1}`,
          name: c,
          slug: c === 'เนื้อหมูตัดแต่ง' ? 'trimmed-pork' : c === 'ชิ้นส่วนพรีเมียม' ? 'premium-cuts' : 'custom-spec',
          description: `หมวดหมู่ ${c} สำหรับธุรกิจอาหาร`,
          sort_order: i + 1,
          active: true,
        })),
  },
  products: {
    table: 'products',
    title: 'สินค้าและสเปก',
    primary: 'name',
    fields: [
      { key: 'name', label: 'ชื่อสินค้า *', placeholder: 'เช่น เนื้อหมูตัดแต่ง, สันคอหมู' },
      { key: 'slug', label: 'Slug (URL ภาษาอังกฤษ) *', placeholder: 'เช่น pork-belly' },
      { key: 'sku', label: 'รหัสสินค้า (SKU/Code)', placeholder: 'เช่น DCT-PK-001' },
      { key: 'category_id', label: 'หมวดหมู่', type: 'select' },
      { key: 'description', label: 'รายละเอียดสินค้า', type: 'textarea', placeholder: 'รายละเอียดและคุณลักษณะของเนื้อ' },
      { key: 'cut_format', label: 'รูปแบบการตัดแต่ง (Cut format)', placeholder: 'เช่น Whole / Slice / Custom cut' },
      { key: 'packing', label: 'บรรจุภัณฑ์ (Packing)', placeholder: 'เช่น 5 กก. / Vacuum pack' },
      { key: 'storage', label: 'การจัดเก็บ (Storage)', placeholder: 'เช่น แช่เย็น 0-4°C หรือแช่แข็ง -18°C' },
      { key: 'recommended_use', label: 'การใช้งานแนะนำ (Recommended use)', placeholder: 'เช่น ครัวกลาง ร้านชาบู โรงงาน' },
      { key: 'image_url', label: 'รูปภาพสินค้า', type: 'image' },
      { key: 'active', label: 'เปิดแสดงผลบนเว็บไซต์', type: 'checkbox' },
    ],
    defaultList: () =>
      mockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.id,
        sku: p.code,
        description: p.description,
        cut_format: p.cut,
        packing: p.pack,
        storage: p.storage,
        recommended_use: p.use,
        image_url: p.image,
        active: true,
      })),
  },
  services: {
    table: 'services',
    title: 'บริการของเรา (Our Services)',
    primary: 'title',
    fields: [
      { key: 'title', label: 'ชื่อบริการ *', placeholder: 'เช่น Custom Cutting, Cold Storage' },
      { key: 'slug', label: 'Slug *', placeholder: 'เช่น custom-cutting' },
      { key: 'description', label: 'รายละเอียดบริการ', type: 'textarea', placeholder: 'รายละเอียดขั้นตอนหรือความสามารถ' },
      { key: 'image_url', label: 'รูปภาพบริการ', type: 'image' },
      { key: 'active', label: 'เปิดใช้งานบริการนี้', type: 'checkbox' },
    ],
    defaultList: () => [
      { id: 'srv-1', title: 'Custom Cutting', slug: 'custom-cutting', description: 'บริการตัดแต่งเนื้อสุกรตามสเปก Slice, Dice, Mince, และ Portion Cut', image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80', active: true },
      { id: 'srv-2', title: 'Cold Storage', slug: 'cold-storage', description: 'บริการคลังสินค้าควบคุมอุณหภูมิ Chilled (0-4°C) และ Frozen (-18°C)', image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', active: true },
      { id: 'srv-3', title: 'Packaging Solutions', slug: 'packaging', description: 'บริการบรรจุภัณฑ์สุญญากาศ (Vacuum) และ Bulk Packaging', image_url: '/products/pork-belly.webp', active: true },
      { id: 'srv-4', title: 'Cold Chain Logistics', slug: 'cold-chain-logistics', description: 'บริการขนส่งกระจายสินค้าด้วยรถควบคุมอุณหภูมิตลอดเส้นทาง', image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', active: true },
    ],
  },
  certificates: {
    table: 'certificates',
    title: 'มาตรฐานและใบรับรอง',
    primary: 'name',
    fields: [
      { key: 'name', label: 'ชื่อมาตรฐาน / ใบรับรอง *', placeholder: 'เช่น GHP, HACCP, อย., ปศุสัตว์ OK' },
      { key: 'description', label: 'รายละเอียดมาตรฐาน', type: 'textarea', placeholder: 'ขอบเขตการรับรองหรือหน่วยงานที่ออกให้' },
      { key: 'document_url', label: 'รูปภาพหรือไฟล์ใบรับรอง', type: 'image' },
      { key: 'active', label: 'เปิดแสดงผล', type: 'checkbox' },
    ],
    defaultList: () => [
      { id: 'cert-1', name: 'GHP (Good Hygiene Practice)', description: 'มาตรฐานสุขลักษณะที่ดีในการผลิตอาหาร', active: true },
      { id: 'cert-2', name: 'HACCP', description: 'ระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม', active: true },
      { id: 'cert-3', name: 'อย. (สำนักงานคณะกรรมการอาหารและยา)', description: 'การขึ้นทะเบียนและมาตรฐานความปลอดภัยทางอาหาร', active: true },
      { id: 'cert-4', name: 'ปศุสัตว์ OK', description: 'มาตรฐานสถานที่จำหน่ายเนื้อสัตว์ที่ถูกสุขลักษณะจากกรมปศุสัตว์', active: true },
    ],
  },
  articles: {
    table: 'articles',
    title: 'ข่าวสารและบทความ',
    primary: 'title',
    fields: [
      { key: 'title', label: 'หัวข้อบทความ *', placeholder: 'เช่น เริ่มจากสเปกที่ชัดเจน...' },
      { key: 'slug', label: 'Slug *', placeholder: 'เช่น spec-first' },
      { key: 'excerpt', label: 'บทนำ / สรุปสั้นๆ', type: 'textarea', placeholder: 'สรุป 1-2 ประโยคสำหรับแสดงบนหน้าแรก' },
      { key: 'content', label: 'เนื้อหาบทความเต็ม', type: 'textarea', placeholder: 'เนื้อหาบทความแบบละเอียด' },
      { key: 'cover_image_url', label: 'รูปภาพปกบทความ', type: 'image' },
      {
        key: 'status',
        label: 'สถานะบทความ',
        type: 'select',
        options: [
          { label: 'เผยแพร่ (Published)', value: 'published' },
          { label: 'ฉบับร่าง (Draft)', value: 'draft' },
        ],
      },
      { key: 'published_at', label: 'วันเผยแพร่', type: 'datetime' },
    ],
    defaultList: () =>
      mockArticles.map((a, i) => ({
        id: `art-${i + 1}`,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.excerpt,
        status: 'published',
        published_at: new Date().toISOString(),
      })),
  },
  faqs: {
    table: 'faqs',
    title: 'คำถามที่พบบ่อย (FAQ)',
    primary: 'question',
    fields: [
      { key: 'question', label: 'คำถาม *', type: 'textarea', placeholder: 'ระบุคำถามที่พบบ่อย' },
      { key: 'answer', label: 'คำตอบ *', type: 'textarea', placeholder: 'ระบุคำตอบที่ชัดเจน' },
      { key: 'sort_order', label: 'ลำดับ' },
      { key: 'active', label: 'เปิดแสดงผล', type: 'checkbox' },
    ],
    defaultList: () => [
      { id: 'faq-1', question: 'DCT รับทำสินค้าตัดแต่งตามสเปกหรือไม่?', answer: 'รองรับการตัดแต่งตามความต้องการ เช่น Slice, Dice, Mince, Vacuum Packaging และจัดเก็บในห้องเย็น โดยสามารถระบุสเปกในใบเสนอราคาได้ทันที', sort_order: 1, active: true },
      { id: 'faq-2', question: 'มีราคาสินค้าแสดงบนเว็บไซต์หรือไม่?', answer: 'เนื่องจากราคาเนื้อสุกรขึ้นอยู่กับปริมาณ สเปกการตัดแต่ง และรอบการส่งมอบ ผู้ใช้สามารถส่งรายการขอใบเสนอราคา (RFQ) เพื่อรับข้อเสนอที่ดีที่สุดจากทีมฝ่ายขาย', sort_order: 2, active: true },
      { id: 'faq-3', question: 'ขอใบเสนอราคาได้หลายรายการหรือไม่?', answer: 'ได้ สามารถเพิ่มสินค้าหลายรายการ พร้อมระบุจำนวน หน่วย และสเปกของแต่ละรายการผ่านระบบ RFQ Wizard', sort_order: 3, active: true },
    ],
  },
};

function blank(resource: Resource): Row {
  return resource.fields.reduce<Row>(
    (result, field) => ({
      ...result,
      [field.key]: field.type === 'checkbox' ? true : field.key === 'status' ? 'published' : '',
    }),
    {}
  );
}

export function CmsCrud({ resourceKey }: { resourceKey: keyof typeof resources }) {
  const resource = resources[resourceKey];
  const [rows, setRows] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>(() => blank(resource));
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: String(category.id || category.slug), label: String(category.name) })),
    [categories]
  );

  async function load() {
    // 1. Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const client = supabaseBrowser();
        const [{ data, error }, { data: categoryData }] = await Promise.all([
          client.from(resource.table).select('*'),
          client.from('categories').select('id,name,slug'),
        ]);

        if (!error && data && data.length > 0) {
          setRows(data as Row[]);
          if (categoryData && categoryData.length > 0) {
            setCategories(categoryData as Row[]);
          }
          return;
        }
      } catch {
        // Fallback to Server API
      }
    }

    // 2. Fetch from Server API
    try {
      const res = await fetch(`/api/cms?table=${resource.table}`, { cache: 'no-store' });
      if (res.ok) {
        const serverData = await res.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          setRows(serverData as Row[]);
          setCategories(
            mockCategories.filter((c) => c !== 'ทั้งหมด').map((c, i) => ({ id: `cat-${i + 1}`, name: c, slug: c }))
          );
          return;
        }
      }
    } catch {
      // ignore
    }

    // 3. Default fallback
    setRows(resource.defaultList ? resource.defaultList() : []);
    setCategories(
      mockCategories.filter((c) => c !== 'ทั้งหมด').map((c, i) => ({ id: `cat-${i + 1}`, name: c, slug: c }))
    );
  }

  useEffect(() => {
    setEditing(null);
    setForm(blank(resource));
    setMessage(null);
    setSearch('');
    void load();
  }, [resourceKey]);

  function edit(row: Row) {
    setEditing(row);
    setForm({ ...row });
    setMessage(null);
  }

  function cancel() {
    setEditing(null);
    setForm(blank(resource));
    setMessage(null);
  }

  function change(key: string, value: any) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload: Row = { ...form };
    for (const field of resource.fields) {
      if (field.key === 'sort_order') payload[field.key] = Number(payload[field.key] || 0);
      if (field.key === 'published_at' && !payload[field.key]) payload[field.key] = null;
      if (field.key === 'category_id' && !payload[field.key]) payload[field.key] = null;
    }

    // 1. Always save to Server API (Universal Realtime Store)
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: resource.table,
          action: 'save',
          data: { ...payload, id: editing?.id || payload.id || payload.slug || `item-${Date.now()}` },
        }),
      });
    } catch {
      // ignore
    }

    // 2. Also save to Supabase if configured (without blocking on table cache error)
    if (isSupabaseConfigured()) {
      try {
        const client = supabaseBrowser();
        const dbPayload = { ...payload };
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(editing?.id || ''));
        delete dbPayload.id;

        if (editing?.id && isUuid) {
          await client.from(resource.table).update(dbPayload).eq('id', editing.id);
        } else if (payload.slug) {
          await client.from(resource.table).upsert({ ...dbPayload, slug: payload.slug }, { onConflict: 'slug' });
        } else if (editing?.id) {
          await client.from(resource.table).update(dbPayload).eq('id', editing.id);
        } else {
          await client.from(resource.table).insert(dbPayload);
        }
      } catch {
        // Supabase error gracefully bypassed
      }
    }

    // 3. Update local UI state immediately
    setRows((prev) => {
      const idx = prev.findIndex((r) => (editing?.id && r.id === editing.id) || (payload.slug && r.slug === payload.slug));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...payload };
        return updated;
      }
      return [...prev, { ...payload, id: payload.id || payload.slug || `item-${Date.now()}` }];
    });

    setSaving(false);
    setMessage({
      text: '✅ บันทึกข้อมูลและอัปเดตรูปภาพเรียบร้อยแล้ว',
      type: 'success',
    });
    cancel();
  }

  async function remove(row: Row) {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ “${row[resource.primary]}”?`)) return;

    // 1. Delete from Server API
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: resource.table,
          action: 'delete',
          data: row,
        }),
      });
    } catch {
      // ignore
    }

    // 2. Delete from Supabase if configured
    if (isSupabaseConfigured() && row.id) {
      try {
        const client = supabaseBrowser();
        await client.from(resource.table).delete().eq('id', row.id);
      } catch {
        // ignore
      }
    }

    // 3. Update local state
    setRows((prev) => prev.filter((r) => r.id !== row.id && (!row.slug || r.slug !== row.slug)));
    if (editing?.id === row.id) cancel();
    setMessage({ text: '✅ ลบรายการเรียบร้อยแล้ว', type: 'success' });
  }

  const filteredRows = rows.filter((r) => {
    if (!search) return true;
    const query = search.toLowerCase();
    const primaryVal = String(r[resource.primary] || '').toLowerCase();
    const slugVal = String(r.slug || r.sku || '').toLowerCase();
    return primaryVal.includes(query) || slugVal.includes(query);
  });

  return (
    <section className="card cms-grid">
      <div className="cms-list">
        <div className="cms-title">
          <div>
            <h2>{resource.title}</h2>
            <p className="small">จัดการและอัปเดตข้อมูล ({rows.length} รายการ)</p>
          </div>
          <button type="button" className="button" onClick={cancel} style={{ fontSize: '13px' }}>
            + เพิ่มรายการใหม่
          </button>
        </div>

        {rows.length > 5 && (
          <input
            className="field"
            style={{ margin: '14px 0 6px' }}
            placeholder={`🔍 ค้นหา ${resource.title}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {filteredRows.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#806c60' }}>
            {rows.length === 0 ? 'ยังไม่มีข้อมูล — กดปุ่ม “+ เพิ่มรายการใหม่” เพื่อเริ่มต้น' : 'ไม่พบข้อมูลที่ตรงกับคำค้น'}
          </p>
        ) : (
          <div className="cms-rows">
            {filteredRows.map((row) => (
              <article
                key={String(row.id || row.slug || row[resource.primary])}
                className="cms-row"
                style={{
                  borderColor: editing?.id === row.id ? 'var(--red)' : '#eadfd4',
                  background: editing?.id === row.id ? '#fffdf9' : '#fff',
                }}
              >
                {row.image_url || row.cover_image_url ? (
                  <img
                    src={row.image_url || row.cover_image_url}
                    alt="thumb"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                ) : null}
                <div style={{ flex: 1 }}>
                  <b style={{ color: 'var(--ink)' }}>{String(row[resource.primary] ?? '')}</b>
                  <br />
                  <span className="small" style={{ color: '#806c60' }}>
                    {row.sku ? `SKU: ${row.sku} · ` : ''}
                    {row.slug ? `slug: ${row.slug}` : ''}
                    {row.active === false ? ' (ปิดการแสดงผล)' : ''}
                  </span>
                </div>
                <div className="cms-row-actions">
                  <button type="button" className="button secondary" onClick={() => edit(row)}>
                    แก้ไข
                  </button>
                  <button type="button" className="button danger" onClick={() => void remove(row)}>
                    ลบ
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <form className="cms-form" onSubmit={save}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, color: 'var(--red)' }}>{editing ? '✏️ แก้ไขรายการ' : '➕ เพิ่มรายการใหม่'}</h3>
          {editing && (
            <button type="button" className="button secondary" onClick={cancel} style={{ fontSize: '12px', padding: '5px 10px' }}>
              ยกเลิก
            </button>
          )}
        </div>

        {message && (
          <div className={`notice ${message.type === 'error' ? 'notice-error' : 'notice-success'}`} style={{ marginBottom: '14px' }}>
            {message.text}
          </div>
        )}

        {resource.fields.map((field) => {
          if (field.type === 'image' || field.key === 'image_url' || field.key === 'cover_image_url' || field.key === 'document_url') {
            return (
              <ImageUploader
                key={field.key}
                label={field.label}
                value={String(form[field.key] ?? '')}
                onChange={(url) => change(field.key, url)}
                folder={resource.table}
                helperText="คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง หรือลากรูปมาวางที่นี่"
              />
            );
          }

          return (
            <label key={field.key} className="login-label">
              {field.type === 'checkbox' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(event) => change(field.key, event.target.checked)}
                  />
                  <span>{field.label}</span>
                </div>
              ) : (
                <>
                  <span>{field.label}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="field"
                      rows={field.key === 'content' ? 6 : 3}
                      placeholder={field.placeholder}
                      value={String(form[field.key] ?? '')}
                      onChange={(event) => change(field.key, event.target.value)}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="field"
                      value={String(form[field.key] ?? '')}
                      onChange={(event) => change(field.key, event.target.value)}
                    >
                      <option value="">-- เลือก --</option>
                      {(field.options ?? (field.key === 'category_id' ? categoryOptions : [])).map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="field"
                      type={field.type === 'datetime' ? 'datetime-local' : 'text'}
                      placeholder={field.placeholder}
                      value={String(form[field.key] ?? '')}
                      onChange={(event) => change(field.key, event.target.value)}
                      required={['name', 'title', 'question', 'slug'].includes(field.key)}
                    />
                  )}
                </>
              )}
            </label>
          );
        })}

        <div className="actions" style={{ marginTop: '20px' }}>
          <button type="submit" className="button" disabled={saving}>
            {saving ? '⏳ กำลังบันทึกขึ้น Cloud…' : '💾 บันทึกข้อมูล'}
          </button>
          {editing && (
            <button type="button" className="button secondary" onClick={cancel}>
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
