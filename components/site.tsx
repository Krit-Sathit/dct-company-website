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
      <Link href="/rfq" className="cta rfq-pill">
        รายการขอราคา <span className="badge">{items.length}</span>
      </Link>
    </CartContext.Provider>
  );
}

export function Header() {
  return (
    <header className="top">
      <div className="wrap nav">
        <Link className="brand" href="/">
          <img src="/logo-lockup.png" alt="บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด" />
        </Link>
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
      </div>
    </header>
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
