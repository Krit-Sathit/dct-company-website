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
          
          {/* Desktop Navigation */}
          <nav className="links">
            <Link href="/about">เกี่ยวกับเรา</Link>
            <Link href="/products">สินค้า</Link>
            <Link href="/services">บริการ OEM</Link>
            <Link href="/standards">มาตรฐาน</Link>
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
            🏠 หน้าแรก
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
            ℹ️ เกี่ยวกับเรา
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
            🥩 แคตตาล็อกสินค้า
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
            ⚙️ บริการ OEM & ตัดแต่ง
          </Link>
          <Link href="/standards" onClick={() => setMobileMenuOpen(false)}>
            🏅 มาตรฐานและกระบวนการ
          </Link>
          <Link href="/news" onClick={() => setMobileMenuOpen(false)}>
            📰 ข่าวสารและความรู้
          </Link>
          <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>
            ❓ คำถามที่พบบ่อย (FAQ)
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
            📑 ขอใบเสนอราคาออนไลน์
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
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <img src="/logo-lockup.png" alt="DCT" />
          <p className="small" style={{ marginTop: '12px' }}>
            <b>{contact.company_name_th}</b>
            <br />
            Trusted B2B Food Supply Partner
            <br />
            มาตรฐานที่มั่นใจได้ สำหรับธุรกิจอาหารที่ต้องการความสม่ำเสมอ
          </p>
        </div>
        <div>
          <b>สำรวจ</b>
          <p className="small">
            <Link href="/products">แคตตาล็อกสินค้า</Link>
            <br />
            <Link href="/services">Custom Cut & OEM</Link>
            <br />
            <Link href="/standards">มาตรฐานและกระบวนการ</Link>
            <br />
            <Link href="/news">ข่าวสารและความรู้</Link>
            <br />
            <Link href="/faq">คำถามที่พบบ่อย</Link>
          </p>
        </div>
        <div>
          <b>ติดต่อเรา</b>
          <p className="small">
            โทร: <a href={`tel:${contact.phone}`} style={{ color: '#e7d8c8' }}>{contact.phone}</a>
            {contact.phone_secondary && <><br />มือถือ: <a href={`tel:${contact.phone_secondary}`} style={{ color: '#e7d8c8' }}>{contact.phone_secondary}</a></>}
            <br />
            อีเมล: <a href={`mailto:${contact.email}`} style={{ color: '#e7d8c8' }}>{contact.email}</a>
            <br />
            LINE: {contact.line_id || '-'}
            <br />
            <Link href="/contact" style={{ textDecoration: 'underline', color: '#e7d8c8' }}>ดูช่องทางติดต่อทั้งหมด →</Link>
          </p>
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
