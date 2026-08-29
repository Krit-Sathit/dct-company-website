'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type RfqItem = {
  id?: string;
  product_name: string;
  sku?: string;
  quantity: number;
  unit: string;
  note?: string;
};

type Rfq = {
  id: string;
  reference: string;
  status: 'new' | 'in_progress' | 'quoted' | 'closed' | string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  line_id?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  items?: RfqItem[];
};

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'ใหม่ / รอตรวจสอบ', color: '#8B1E1E', bg: '#ffebe9' },
  in_progress: { label: 'กำลังดำเนินการ', color: '#B8954A', bg: '#fff7e2' },
  quoted: { label: 'เสนอราคาแล้ว', color: '#2b6cb0', bg: '#ebf8ff' },
  closed: { label: 'ปิดรายการ', color: '#2f855a', bg: '#f0fff4' },
};

export function CmsRfq() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfq, setSelectedRfq] = useState<Rfq | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  async function loadRfqs() {
    setLoading(true);
    let list: Rfq[] = [];

    // 1. Try Supabase
    try {
      const client = supabaseBrowser();
      const { data: dbRfqs, error } = await client
        .from('rfqs')
        .select('*, rfq_items(*)')
        .order('created_at', { ascending: false });

      if (!error && dbRfqs && dbRfqs.length > 0) {
        list = dbRfqs.map((r: any) => ({
          ...r,
          items: r.rfq_items || [],
        }));
      }
    } catch {
      // ignore
    }

    // 2. Load local submissions as well if any
    if (typeof window !== 'undefined') {
      try {
        const localSaved = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
        if (Array.isArray(localSaved)) {
          const formattedLocal: Rfq[] = localSaved.map((item: any, idx: number) => ({
            id: item.ref || `local-${idx}`,
            reference: item.ref,
            status: item.status === 'ใหม่' ? 'new' : item.status || 'new',
            company_name: item.customer?.company || 'ไม่ระบุ',
            contact_name: item.customer?.name || 'ไม่ระบุ',
            phone: item.customer?.phone || '-',
            email: item.customer?.email || '-',
            line_id: item.customer?.line || '',
            address: item.customer?.address || '',
            notes: item.customer?.detail || '',
            created_at: item.createdAt,
            items: (item.items || []).map((i: any) => ({
              product_name: i.product?.name || 'สินค้า',
              sku: i.product?.code || '',
              quantity: i.qty || 1,
              unit: i.unit || 'กก.',
              note: i.note || '',
            })),
          }));

          // Merge without duplicate references
          const existingRefs = new Set(list.map((r) => r.reference));
          for (const loc of formattedLocal) {
            if (!existingRefs.has(loc.reference)) {
              list.push(loc);
            }
          }
        }
      } catch {
        // ignore
      }
    }

    setRfqs(list);
    setLoading(false);
  }

  useEffect(() => {
    void loadRfqs();
  }, []);

  async function handleStatusChange(rfqId: string, newStatus: string) {
    setMessage('');
    // Update local state
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status: newStatus } : r))
    );
    if (selectedRfq && selectedRfq.id === rfqId) {
      setSelectedRfq((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // Update in Supabase
    try {
      const client = supabaseBrowser();
      const { error } = await client
        .from('rfqs')
        .update({ status: newStatus })
        .eq('id', rfqId);

      if (error) {
        // If it's a local rfq, update in localStorage
        updateLocalStorageRfq(rfqId, { status: newStatus });
      }
      setMessage('อัปเดตสถานะใบเสนอราคาเรียบร้อยแล้ว');
    } catch {
      updateLocalStorageRfq(rfqId, { status: newStatus });
      setMessage('อัปเดตสถานะเรียบร้อยแล้ว');
    }
  }

  function updateLocalStorageRfq(idOrRef: string, changes: Partial<Rfq>) {
    if (typeof window === 'undefined') return;
    try {
      const local = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
      const updated = local.map((item: any) => {
        if (item.ref === idOrRef || `local-${item.ref}` === idOrRef) {
          return { ...item, ...changes };
        }
        return item;
      });
      localStorage.setItem('dct-rfq-submissions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  async function handleDeleteRfq(rfq: Rfq) {
    if (!window.confirm(`คุณต้องการลบคำขอใบเสนอราคา ${rfq.reference} ใช่หรือไม่?`)) return;

    // Delete in Supabase
    try {
      const client = supabaseBrowser();
      await client.from('rfqs').delete().eq('id', rfq.id);
    } catch {
      // ignore
    }

    // Delete in localStorage
    if (typeof window !== 'undefined') {
      try {
        const local = JSON.parse(localStorage.getItem('dct-rfq-submissions') || '[]');
        const filtered = local.filter((item: any) => item.ref !== rfq.reference);
        localStorage.setItem('dct-rfq-submissions', JSON.stringify(filtered));
      } catch {
        // ignore
      }
    }

    setRfqs((prev) => prev.filter((r) => r.id !== rfq.id));
    if (selectedRfq?.id === rfq.id) setSelectedRfq(null);
    setMessage(`ลบรายการ ${rfq.reference} เรียบร้อยแล้ว`);
  }

  const filteredRfqs = rfqs.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchQuery =
      searchQuery === '' ||
      r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>จัดการคำขอใบเสนอราคา (RFQ)</h2>
          <p className="small">ตรวจสอบรายการขอราคา ติดตามสถานะ และดูสเปกสินค้าที่ลูกค้าต้องการ ({rfqs.length} รายการ)</p>
        </div>
        <button className="button secondary" onClick={loadRfqs} style={{ fontSize: '13px', padding: '8px 14px' }}>
          🔄 รีเฟรชข้อมูล
        </button>
      </div>

      {message && <div className="notice notice-success" style={{ margin: '16px 0' }}>{message}</div>}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '20px 0' }}>
        <input
          className="field"
          style={{ flex: '1 1 250px' }}
          placeholder="🔍 ค้นหารหัส RFQ, บริษัท, ผู้ติดต่อ, เบอร์โทร..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="field"
          style={{ width: 'auto', minWidth: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">ทุกสถานะ ({rfqs.length})</option>
          <option value="new">ใหม่ / รอตรวจสอบ ({rfqs.filter((r) => r.status === 'new').length})</option>
          <option value="in_progress">กำลังดำเนินการ ({rfqs.filter((r) => r.status === 'in_progress').length})</option>
          <option value="quoted">เสนอราคาแล้ว ({rfqs.filter((r) => r.status === 'quoted').length})</option>
          <option value="closed">ปิดรายการ ({rfqs.filter((r) => r.status === 'closed').length})</option>
        </select>
      </div>

      {loading ? (
        <p className="lead">กำลังโหลดรายการ RFQ…</p>
      ) : filteredRfqs.length === 0 ? (
        <div className="notice" style={{ margin: '20px 0' }}>
          {rfqs.length === 0 ? 'ยังไม่มีรายการขอใบเสนอราคาเข้ามา' : 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedRfq ? '1.1fr 1.3fr' : '1fr', gap: '20px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {filteredRfqs.map((rfq) => {
              const statusInfo = statusLabels[rfq.status] || { label: rfq.status, color: '#6B4636', bg: '#f2e8de' };
              const isSelected = selectedRfq?.id === rfq.id;
              return (
                <div
                  key={rfq.id}
                  onClick={() => setSelectedRfq(rfq)}
                  style={{
                    padding: '16px',
                    border: `1px solid ${isSelected ? 'var(--red)' : '#eadfd4'}`,
                    backgroundColor: isSelected ? '#fffdf9' : '#fff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(139,30,30,0.1)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <b style={{ color: 'var(--ink)', fontSize: '15px' }}>{rfq.reference}</b>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        color: statusInfo.color,
                        backgroundColor: statusInfo.bg,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--brown)', marginBottom: '6px' }}>
                    🏢 <b>{rfq.company_name}</b> · {rfq.contact_name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#806c60' }}>
                    <span>📞 {rfq.phone}</span>
                    <span>{rfq.created_at ? new Date(rfq.created_at).toLocaleDateString('th-TH') : ''}</span>
                  </div>
                  {rfq.items && rfq.items.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
                      📦 {rfq.items.length} รายการสินค้า
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedRfq && (
            <div style={{ border: '1px solid #eadfd4', padding: '22px', borderRadius: '6px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--red)' }}>{selectedRfq.reference}</h3>
                  <span className="small">วันที่ส่ง: {selectedRfq.created_at ? new Date(selectedRfq.created_at).toLocaleString('th-TH') : '-'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRfq(null)}
                  style={{ background: 'none', border: 0, fontSize: '20px', cursor: 'pointer', color: '#806c60' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '20px', padding: '14px', background: '#fbf8f4', borderRadius: '6px' }}>
                <label className="login-label" style={{ marginTop: 0 }}>
                  <b>สถานะของคำขอใบเสนอราคานี้:</b>
                  <select
                    className="field"
                    value={selectedRfq.status}
                    onChange={(e) => void handleStatusChange(selectedRfq.id, e.target.value)}
                    style={{ marginTop: '6px', fontWeight: 600 }}
                  >
                    <option value="new">🔴 ใหม่ / รอตรวจสอบ</option>
                    <option value="in_progress">🟡 กำลังดำเนินการ / ตรวจสอบสเปก</option>
                    <option value="quoted">🔵 เสนอราคาเรียบร้อยแล้ว</option>
                    <option value="closed">🟢 ปิดรายการ / ซื้อขายสำเร็จ</option>
                  </select>
                </label>
              </div>

              <h4>ข้อมูลลูกค้า</h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px', marginBottom: '20px' }}>
                <div className="spec"><span>บริษัท:</span><b>{selectedRfq.company_name}</b></div>
                <div className="spec"><span>ผู้ติดต่อ:</span><b>{selectedRfq.contact_name}</b></div>
                <div className="spec"><span>โทรศัพท์:</span><b><a href={`tel:${selectedRfq.phone}`}>{selectedRfq.phone}</a></b></div>
                <div className="spec"><span>อีเมล:</span><b><a href={`mailto:${selectedRfq.email}`}>{selectedRfq.email}</a></b></div>
                {selectedRfq.line_id && <div className="spec"><span>LINE ID:</span><b>{selectedRfq.line_id}</b></div>}
                {selectedRfq.address && <div className="spec"><span>ที่อยู่จัดส่ง:</span><b>{selectedRfq.address}</b></div>}
                {selectedRfq.notes && <div className="spec"><span>หมายเหตุเพิ่มเติม:</span><b>{selectedRfq.notes}</b></div>}
              </div>

              <h4>รายการสินค้าที่ขอราคา ({selectedRfq.items?.length || 0})</h4>
              {selectedRfq.items && selectedRfq.items.length > 0 ? (
                <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                  {selectedRfq.items.map((item, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', border: '1px solid #eee', borderRadius: '4px', background: '#fafafa', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>{item.product_name} {item.sku && `(${item.sku})`}</span>
                        <span style={{ color: 'var(--red)' }}>{item.quantity} {item.unit}</span>
                      </div>
                      {item.note && <div style={{ color: '#806c60', marginTop: '4px' }}>💬 สเปกพิเศษ: {item.note}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="small">ไม่มีรายการสินค้าระบุ</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <button
                  type="button"
                  className="button danger"
                  onClick={() => void handleDeleteRfq(selectedRfq)}
                  style={{ fontSize: '13px', padding: '8px 12px' }}
                >
                  🗑️ ลบคำขอนี้
                </button>
                <a
                  href={`mailto:${selectedRfq.email}?subject=ใบเสนอราคาจาก บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด (อ้างอิง ${selectedRfq.reference})`}
                  className="button"
                  style={{ fontSize: '13px', padding: '8px 14px' }}
                >
                  ✉️ ส่งอีเมลตอบกลับลูกค้า
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
