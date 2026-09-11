'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/data';
import { ContactSettings, defaultContactSettings, getContactSettings } from '@/lib/settings';
import { useLanguage } from '@/lib/language';

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
  const { lang, setLang, t } = useLanguage();

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
            <img src="/logo-lockup.png" alt={t('brand_name')} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="links">
            <Link href="/about">{t('nav_about')}</Link>
            <Link href="/products">{t('nav_products')}</Link>
            <Link href="/services">{t('nav_services')}</Link>
            <Link href="/standards">{t('nav_standards')}</Link>
            <Link href="/news">{t('nav_news')}</Link>
            <Link href="/contact">{t('nav_contact')}</Link>
            
            {/* Interactive Language Switcher */}
            <div className="lang-switcher-pill" role="group" aria-label="Language Switcher">
              <button
                type="button"
                className={lang === 'th' ? 'active' : 'inactive'}
                onClick={() => setLang('th')}
                title="เปลี่ยนเป็นภาษาไทย (TH)"
              >
                TH
              </button>
              <span className="divider" style={{ opacity: 0.35, userSelect: 'none' }}>|</span>
              <button
                type="button"
                className={lang === 'en' ? 'active' : 'inactive'}
                onClick={() => setLang('en')}
                title="Switch to English (EN)"
              >
                EN
              </button>
            </div>

            <Link className="cta" href="/rfq">
              {t('nav_rfq')}
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

        <div style={{ marginTop: '14px', marginBottom: '6px' }}>
          <div className="lang-switcher-pill" style={{ width: 'fit-content' }}>
            <span style={{ color: '#8c7667', fontSize: '12px', marginRight: '4px' }}>{t('lang_label')}</span>
            <button
              type="button"
              className={lang === 'th' ? 'active' : 'inactive'}
              onClick={() => setLang('th')}
            >
              TH
            </button>
            <span style={{ opacity: 0.35, userSelect: 'none' }}>|</span>
            <button
              type="button"
              className={lang === 'en' ? 'active' : 'inactive'}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
        </div>

        <nav className="mobile-drawer-links">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            🏠 {t('nav_home')}
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
            ℹ️ {t('nav_about')}
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
            🥩 {t('nav_products')}
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
            ⚙️ {t('nav_services')}
          </Link>
          <Link href="/standards" onClick={() => setMobileMenuOpen(false)}>
            🏅 {t('nav_standards')}
          </Link>
          <Link href="/news" onClick={() => setMobileMenuOpen(false)}>
            📰 {t('nav_news')}
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
            📍 {t('nav_contact')}
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid #eadfd4' }}>
          <Link
            className="button"
            href="/rfq"
            onClick={() => setMobileMenuOpen(false)}
            style={{ width: '100%' }}
          >
            📑 {t('nav_rfq')}
          </Link>
        </div>
      </aside>
    </>
  );
}

export function Footer() {
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);
  const { lang, t } = useLanguage();

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
                {lang === 'en' ? (contact.company_name_en || 'DUANGCHAROEN INTERTRADE CO., LTD.') : (contact.company_name_th || 'ดวงเจริญ อินเตอร์เทรด จำกัด')}
              </strong>
              <span style={{ fontSize: '10.5px', color: '#8c7667', fontWeight: 600 }}>
                {contact.company_name_en || 'DUANGCHAROEN INTERTRADE CO., LTD.'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#6e584a', margin: '0 0 14px' }}>
            {t('footer_tagline')}
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#06C755', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>L</span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#1877F2', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>f</span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF0000', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>▶</span>
          </div>
        </div>

        {/* Column 2: เมนูหลัก */}
        <div className="footer-col">
          <h4>{t('footer_main_menu')}</h4>
          <ul>
            <li><Link href="/">{t('nav_home')}</Link></li>
            <li><Link href="/about">{t('nav_about')}</Link></li>
            <li><Link href="/products">{t('nav_products')}</Link></li>
            <li><Link href="/services">{t('nav_services')}</Link></li>
            <li><Link href="/standards">{t('nav_standards')}</Link></li>
            <li><Link href="/news">{t('nav_news')}</Link></li>
            <li><Link href="/contact">{t('nav_contact')}</Link></li>
          </ul>
        </div>

        {/* Column 3: สินค้า */}
        <div className="footer-col">
          <h4>{t('footer_products')}</h4>
          <ul>
            <li><Link href="/products">{t('footer_pork_fresh')}</Link></li>
            <li><Link href="/products">{t('footer_pork_frozen')}</Link></li>
            <li><Link href="/products/pork-neck">{lang === 'en' ? 'Pork Collar' : 'สันคอหมู'}</Link></li>
            <li><Link href="/products/loin">{lang === 'en' ? 'Pork Loin' : 'สันนอกหมู'}</Link></li>
            <li><Link href="/products/pork-belly">{lang === 'en' ? 'Pork Belly' : 'สามชั้นหมู'}</Link></li>
            <li><Link href="/products/ribs">{lang === 'en' ? 'Pork Spare Ribs' : 'ซี่โครงหมู'}</Link></li>
            <li><Link href="/rfq">{t('footer_ready_stock')}</Link></li>
          </ul>
        </div>

        {/* Column 4: บริการของเรา */}
        <div className="footer-col">
          <h4>{t('footer_services')}</h4>
          <ul>
            <li><Link href="/services">{lang === 'en' ? 'Custom Cutting' : 'รับผลิตตามความต้องการ'}</Link></li>
            <li><Link href="/services">{lang === 'en' ? 'Standard Wholesale' : 'จัดเตรียมสินค้ามาตรฐาน'}</Link></li>
            <li><Link href="/services">{lang === 'en' ? 'Vacuum Packaging' : 'แพ็กและบรรจุภัณฑ์'}</Link></li>
            <li><Link href="/services">{lang === 'en' ? 'Nationwide Cold Chain' : 'จัดส่งทั่วประเทศ'}</Link></li>
            <li><Link href="/services">{lang === 'en' ? 'B2B Consultation' : 'ให้คำปรึกษาและดูแลอย่างใกล้ชิด'}</Link></li>
          </ul>
        </div>

        {/* Column 5: ติดต่อเรา */}
        <div className="footer-col">
          <h4>{t('footer_contact')}</h4>
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
          </ul>
        </div>
      </div>

      <div className="wrap" style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #f0e6dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11.5px', color: '#9e8a7c' }}>
        <div>© {new Date().getFullYear()} {lang === 'en' ? 'DUANGCHAROEN INTERTRADE CO., LTD.' : 'บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด'}. {t('footer_rights')}</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/standards" style={{ color: '#9e8a7c' }}>{t('footer_privacy')}</Link>
          <Link href="/rfq" style={{ color: '#9e8a7c' }}>{t('nav_rfq')} (B2B)</Link>
          <Link href="/contact" style={{ color: '#9e8a7c' }}>{t('footer_sales_contact')}</Link>
        </div>
      </div>
    </footer>
  );
}

export function AddButton({ product }: { product: Product }) {
  const { add } = useCart();
  const { lang } = useLanguage();
  return (
    <button className="button" onClick={() => add(product)}>
      {lang === 'en' ? '+ Add to Quote Request' : '+ เพิ่มในรายการขอราคา'}
    </button>
  );
}
