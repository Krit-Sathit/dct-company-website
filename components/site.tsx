'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/data';
import { ContactSettings, defaultContactSettings, getContactSettings } from '@/lib/settings';

type CartLine = { product: Product; qty: number; unit: string; note: string };
type Cart = {
  items: CartLine[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  update: (id: string, k: 'qty' | 'unit' | 'note', v: string | number) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error('Cart missing');
  return c;
};

export function RFQProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    const x = localStorage.getItem('dct-rfq');
    if (x) {
      try {
        setItems(JSON.parse(x));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dct-rfq', JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      add: (product: Product) =>
        setItems((x) =>
          x.some((i) => i.product.id === product.id)
            ? x.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i))
            : [...x, { product, qty: 1, unit: 'กก.', note: '' }]
        ),
      remove: (id: string) => setItems((x) => x.filter((i) => i.product.id !== id)),
      update: (id: string, k: 'qty' | 'unit' | 'note', v: string | number) =>
        setItems((x) => x.map((i) => (i.product.id === id ? { ...i, [k]: v } : i))),
      clear: () => setItems([]),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Compact Modern Floating Action Button (FAB) */}
      <Link href="/rfq" className="rfq-fab" aria-label="รายการขอใบเสนอราคา" title="ดูรายการขอใบเสนอราคา">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className="badge">{items.length}</span>
      </Link>
    </CartContext.Provider>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="top">
        <div className="wrap nav">
          <Link className="brand" href="/" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo-lockup.png" alt="บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด" />
          </Link>

          {/* Desktop Navigation (Official Master Copy v2.0) */}
          <nav className="links">
            <Link href="/about">เกี่ยวกับเรา</Link>
            <Link href="/products">สินค้า</Link>
            <Link href="/services">บริการของเรา</Link>
            <Link href="/standards">มาตรฐานการผลิต</Link>
            <Link href="/news">ข่าวสาร</Link>
            <Link href="/contact">ติดต่อเรา</Link>
            <Link className="cta" href="/rfq">
              ขอใบเสนอราคา
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="เปิดเมนูหลัก"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Slide-out Drawer */}
      <aside className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <img src="/logo-lockup.png" alt="DCT" />
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="ปิดเมนู"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-links">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            🏠 หน้าหลัก
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
            ℹ️ เกี่ยวกับเรา
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
            🥩 สินค้า
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
            ⚙️ บริการของเรา
          </Link>
          <Link href="/standards" onClick={() => setMobileMenuOpen(false)}>
            🏅 มาตรฐานการผลิต
          </Link>
          <Link href="/news" onClick={() => setMobileMenuOpen(false)}>
            📰 ข่าวสาร
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
            📍 ติดต่อเรา
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid #eadfd4' }}>
          <Link
            className="button"
            href="/rfq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ width: '100%', marginBottom: '12px' }}
          >
            📑 ขอใบเสนอราคา
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '13px',
              color: '#806c60',
              textDecoration: 'underline',
              padding: '6px',
            }}
          >
            🔒 ระบบผู้ดูแล (Admin CMS)
          </Link>
        </div>
      </aside>
    </>
  );
}

export function Footer() {
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    getContactSettings().then((data) => setContact(data));
  }, []);

  return (
    <footer className="footer-mockup">
      <div className="wrap footer-mockup-grid">
        {/* Column 1: Brand & Tagline */}
        <div className="footer-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <img src="/dct-emblem.png" alt="DCT Emblem" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--ink)', display: 'block', lineHeight: 1.3 }}>
                {contact.company_name_th || 'ดวงเจริญ อินเตอร์เทรด จำกัด'}
              </strong>
              <span style={{ fontSize: '10.5px', color: '#8c7667', fontWeight: 600 }}>
                {contact.company_name_en || 'DUANGCHAROEN INTERTRADE CO., LTD.'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#6e584a', margin: '0 0 14px' }}>
            แหล่งวัตถุดิบเนื้อหมูสำหรับธุรกิจ ที่ต้องการคุณภาพสม่ำเสมอ ปริมาณเพียงพอ และการจัดส่งที่ไว้ใจได้
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#06C755', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>L</span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#1877F2', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>f</span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF0000', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>▶</span>
          </div>
        </div>

        {/* Column 2: เมนูหลัก */}
        <div className="footer-col">
          <h4>เมนูหลัก</h4>
          <ul>
            <li><Link href="/">หน้าแรก</Link></li>
            <li><Link href="/about">เกี่ยวกับเรา</Link></li>
            <li><Link href="/products">สินค้า</Link></li>
            <li><Link href="/services">บริการของเรา</Link></li>
            <li><Link href="/standards">มาตรฐานการผลิต</Link></li>
            <li><Link href="/news">ข่าวสาร</Link></li>
            <li><Link href="/contact">ติดต่อเรา</Link></li>
          </ul>
        </div>

        {/* Column 3: สินค้า */}
        <div className="footer-col">
          <h4>สินค้า</h4>
          <ul>
            <li><Link href="/products">เนื้อหมูสดแช่เย็น (Fresh)</Link></li>
            <li><Link href="/products">เนื้อหมูแช่แข็ง (Frozen)</Link></li>
            <li><Link href="/products/pork-neck">สันคอหมู</Link></li>
            <li><Link href="/products/loin">สันนอกหมู</Link></li>
            <li><Link href="/products/pork-belly">สามชั้นหมู</Link></li>
            <li><Link href="/products/ribs">ซี่โครงหมู</Link></li>
            <li><Link href="/rfq">สินค้าพร้อมขาย</Link></li>
          </ul>
        </div>

        {/* Column 4: บริการของเรา */}
        <div className="footer-col">
          <h4>บริการของเรา</h4>
          <ul>
            <li><Link href="/services">รับผลิตตามความต้องการ</Link></li>
            <li><Link href="/services">จัดเตรียมสินค้ามาตรฐาน</Link></li>
            <li><Link href="/services">แพ็กและบรรจุภัณฑ์</Link></li>
            <li><Link href="/services">จัดส่งทั่วประเทศ</Link></li>
            <li><Link href="/services">ให้คำปรึกษาและดูแลอย่างใกล้ชิด</Link></li>
          </ul>
        </div>

        {/* Column 5: ติดต่อเรา */}
        <div className="footer-col">
          <h4>ติดต่อเรา</h4>
          <ul>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📞</span>
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✉️</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span>📍</span>
              <span style={{ fontSize: '11.5px', lineHeight: 1.4 }}>{contact.address}</span>
            </li>
            <li style={{ marginTop: '6px' }}>
              <Link href="/admin" style={{ fontSize: '11px', color: '#9e8a7c', textDecoration: 'underline' }}>
                🔒 ระบบผู้ดูแล (Admin CMS)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #f0e6dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11.5px', color: '#9e8a7c' }}>
        <div>© {new Date().getFullYear()} บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/standards" style={{ color: '#9e8a7c' }}>มาตรฐานความปลอดภัย</Link>
          <Link href="/rfq" style={{ color: '#9e8a7c' }}>ขอใบเสนอราคา (B2B)</Link>
        </div>
      </div>
    </footer>
  );
}

export function AddButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button className="button" onClick={() => add(product)}>
      + เพิ่มในรายการขอราคา
    </button>
  );
}
