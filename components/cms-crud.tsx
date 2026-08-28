'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Row = Record<string, string | boolean | number | null | undefined> & { id?: string };
type Field = { key: string; label: string; type?: 'text' | 'textarea' | 'checkbox' | 'select' | 'datetime'; options?: Array<{ label: string; value: string }> };
type Resource = { table: string; title: string; fields: Field[]; primary: string };

export const resources: Record<string, Resource> = {
  categories: { table: 'categories', title: 'หมวดหมู่สินค้า', primary: 'name', fields: [{ key: 'name', label: 'ชื่อหมวดหมู่' }, { key: 'slug', label: 'Slug' }, { key: 'description', label: 'คำอธิบาย', type: 'textarea' }, { key: 'sort_order', label: 'ลำดับ' }, { key: 'active', label: 'เปิดใช้งาน', type: 'checkbox' }] },
  products: { table: 'products', title: 'สินค้า', primary: 'name', fields: [{ key: 'name', label: 'ชื่อสินค้า' }, { key: 'slug', label: 'Slug' }, { key: 'sku', label: 'รหัสสินค้า' }, { key: 'category_id', label: 'หมวดหมู่', type: 'select' }, { key: 'description', label: 'รายละเอียด', type: 'textarea' }, { key: 'cut_format', label: 'รูปแบบการตัดแต่ง' }, { key: 'packing', label: 'บรรจุภัณฑ์' }, { key: 'storage', label: 'การเก็บรักษา' }, { key: 'recommended_use', label: 'การใช้งานแนะนำ' }, { key: 'image_url', label: 'URL รูปภาพ' }, { key: 'active', label: 'เปิดใช้งาน', type: 'checkbox' }] },
  services: { table: 'services', title: 'บริการ', primary: 'title', fields: [{ key: 'title', label: 'ชื่อบริการ' }, { key: 'slug', label: 'Slug' }, { key: 'description', label: 'รายละเอียด', type: 'textarea' }, { key: 'image_url', label: 'URL รูปภาพ' }, { key: 'active', label: 'เปิดใช้งาน', type: 'checkbox' }] },
  certificates: { table: 'certificates', title: 'มาตรฐานและใบรับรอง', primary: 'name', fields: [{ key: 'name', label: 'ชื่อมาตรฐาน/ใบรับรอง' }, { key: 'description', label: 'รายละเอียด', type: 'textarea' }, { key: 'document_url', label: 'URL เอกสารหรือรูปภาพ' }, { key: 'active', label: 'เปิดใช้งาน', type: 'checkbox' }] },
  articles: { table: 'articles', title: 'ข่าวสาร', primary: 'title', fields: [{ key: 'title', label: 'หัวข้อบทความ' }, { key: 'slug', label: 'Slug' }, { key: 'excerpt', label: 'บทนำ', type: 'textarea' }, { key: 'content', label: 'เนื้อหา', type: 'textarea' }, { key: 'cover_image_url', label: 'URL รูปภาพปก' }, { key: 'status', label: 'สถานะ', type: 'select', options: [{ label: 'ฉบับร่าง', value: 'draft' }, { label: 'เผยแพร่', value: 'published' }] }, { key: 'published_at', label: 'วันเผยแพร่', type: 'datetime' }] },
  faqs: { table: 'faqs', title: 'คำถามที่พบบ่อย', primary: 'question', fields: [{ key: 'question', label: 'คำถาม', type: 'textarea' }, { key: 'answer', label: 'คำตอบ', type: 'textarea' }, { key: 'sort_order', label: 'ลำดับ' }, { key: 'active', label: 'เปิดใช้งาน', type: 'checkbox' }] },
};

function blank(resource: Resource): Row {
  return resource.fields.reduce<Row>((result, field) => ({ ...result, [field.key]: field.type === 'checkbox' ? true : field.key === 'status' ? 'draft' : '' }), {});
}

export function CmsCrud({ resourceKey }: { resourceKey: keyof typeof resources }) {
  const resource = resources[resourceKey];
  const [rows, setRows] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>(() => blank(resource));
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const categoryOptions = useMemo(() => categories.map((category) => ({ value: String(category.id), label: String(category.name) })), [categories]);
  async function load() {
    const client = supabaseBrowser();
    const [{ data, error }, { data: categoryData }] = await Promise.all([
      client.from(resource.table).select('*'),
      client.from('categories').select('id,name'),
    ]);
    if (error) setMessage(`โหลดข้อมูลไม่สำเร็จ: ${error.message}`);
    else setRows((data ?? []) as Row[]);
    setCategories((categoryData ?? []) as Row[]);
  }
  useEffect(() => { setEditing(null); setForm(blank(resource)); void load(); }, [resourceKey]);

  function edit(row: Row) { setEditing(row); setForm({ ...row }); setMessage(''); }
  function cancel() { setEditing(null); setForm(blank(resource)); setMessage(''); }
  function change(key: string, value: string | boolean) { setForm((current) => ({ ...current, [key]: value })); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage('');
    const payload: Row = { ...form };
    delete payload.id;
    for (const field of resource.fields) {
      if (field.key === 'sort_order') payload[field.key] = Number(payload[field.key] || 0);
      if (field.key === 'published_at' && !payload[field.key]) payload[field.key] = null;
      if (field.key === 'category_id' && !payload[field.key]) payload[field.key] = null;
    }
    const client = supabaseBrowser();
    const result = editing?.id ? await client.from(resource.table).update(payload).eq('id', editing.id) : await client.from(resource.table).insert(payload);
    setSaving(false);
    if (result.error) { setMessage(`บันทึกไม่สำเร็จ: ${result.error.message}`); return; }
    setMessage('บันทึกเรียบร้อยแล้ว'); cancel(); await load();
  }
  async function remove(row: Row) {
    if (!row.id || !window.confirm(`ลบ “${row[resource.primary]}” ใช่หรือไม่?`)) return;
    const { error } = await supabaseBrowser().from(resource.table).delete().eq('id', row.id);
    setMessage(error ? `ลบไม่สำเร็จ: ${error.message}` : 'ลบรายการเรียบร้อยแล้ว');
    await load();
  }

  return <section className="card cms-grid">
    <div className="cms-list"><div className="cms-title"><div><h2>{resource.title}</h2><p>{rows.length} รายการ</p></div><button className="button" onClick={cancel}>+ เพิ่มรายการ</button></div>
      {rows.length === 0 ? <p>ยังไม่มีข้อมูล — กด “เพิ่มรายการ” เพื่อเริ่มต้น</p> : <div className="cms-rows">{rows.map((row) => <article key={String(row.id)} className="cms-row"><div><b>{String(row[resource.primary] ?? '')}</b><br /><span className="small">{String(row.slug ?? row.sku ?? '')}</span></div><div className="cms-row-actions"><button className="button secondary" onClick={() => edit(row)}>แก้ไข</button><button className="button danger" onClick={() => void remove(row)}>ลบ</button></div></article>)}</div>}
    </div>
    <form className="cms-form" onSubmit={save}><h3>{editing ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}</h3>{message && <p className="notice">{message}</p>}{resource.fields.map((field) => <label key={field.key} className="login-label">{field.type === 'checkbox' ? <><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => change(field.key, event.target.checked)} /> {field.label}</> : <>{field.label}{field.type === 'textarea' ? <textarea className="field" value={String(form[field.key] ?? '')} onChange={(event) => change(field.key, event.target.value)} /> : field.type === 'select' ? <select className="field" value={String(form[field.key] ?? '')} onChange={(event) => change(field.key, event.target.value)}><option value="">-- เลือก --</option>{(field.options ?? (field.key === 'category_id' ? categoryOptions : [])).map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select> : <input className="field" type={field.type === 'datetime' ? 'datetime-local' : 'text'} value={String(form[field.key] ?? '')} onChange={(event) => change(field.key, event.target.value)} required={['name', 'title', 'question', 'slug'].includes(field.key)} />}</>}</label>)}<div className="actions"><button className="button" disabled={saving}>{saving ? 'กำลังบันทึก…' : 'บันทึก'}</button>{editing && <button type="button" className="button secondary" onClick={cancel}>ยกเลิก</button>}</div></form>
  </section>;
}
