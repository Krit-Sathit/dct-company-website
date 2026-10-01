'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products as defaultProducts, Product } from '@/lib/data';
import { useLanguage } from '@/lib/language';
import { getCompanyProfile, getContactSettings, defaultCompanyProfile, defaultContactSettings, CompanyProfileSettings, ContactSettings } from '@/lib/settings';
import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';
import {
  IconRibbon,
  IconShield,
  IconFactory,
  IconTruck,
  IconSupport,
  IconMeatCut,
  IconWarehouse,
  IconPackage,
  IconLogistics,
  IconAwardGold,
  IconUsersGold,
  IconGlobeGold,
  IconTruckGold,
} from '@/components/icons';

export default function Home() {
  const { lang, t } = useLanguage();
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [profile, setProfile] = useState<CompanyProfileSettings>(defaultCompanyProfile);
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);

  const featuredProds = productList.slice(0, 4);

  useEffect(() => {
    async function loadData() {
      // 1. Load Profile & Contact
      const [profData, contactData] = await Promise.all([
        getCompanyProfile(),
        getContactSettings(),
      ]);
      setProfile(profData);
      setContact(contactData);

      // 2. Load Products (Supabase -> Server API -> Fallback)
      if (isSupabaseConfigured()) {
        try {
          const client = supabaseBrowser();
          const { data } = await client.from('products').select('*').eq('active', true);
          if (data && data.length > 0) {
            setProductList(
              data.map((p: any) => ({
                id: p.slug || p.id,
                name: p.name,
                nameEn: p.name_en || p.nameEn,
                code: p.sku || 'DCT-PK-000',
                category: p.category_id || p.category || 'ชิ้นส่วนมาตรฐาน',
                description: p.description || '',
                type: p.product_type || p.type || 'สดแช่เย็น (Chilled) / แช่แข็ง (Frozen)',
                cut: p.cutting_options || p.cut_format || p.cut || 'Custom cut',
                thickness: p.portion_thickness || p.thickness || 'ตามสเปก',
                meatFatRatio: p.meat_fat_ratio || p.meatFatRatio || 'ตามสเปก',
                pack: p.packing || p.pack || 'Vacuum pack',
                storage: p.storage || 'แช่เย็น 0-4°C / แช่แข็ง -18°C',
                shelfLife: p.shelf_life || p.shelfLife || 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
                moq: p.moq || 'ขั้นต่ำ 20 กก.',
                use: p.recommended_use || p.use || 'ธุรกิจอาหาร',
                image: p.image_url || p.image || '/products/pork-neck.webp',
              }))
            );
            return;
          }
        } catch {}
      }

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
                  nameEn: p.name_en || p.nameEn,
                  code: p.sku || p.code || 'DCT-PK-000',
                  category: p.category_id || p.category || 'ชิ้นส่วนมาตรฐาน',
                  description: p.description || '',
                  type: p.product_type || p.type || 'สดแช่เย็น (Chilled) / แช่แข็ง (Frozen)',
                  cut: p.cutting_options || p.cut_format || p.cut || 'Custom cut',
                  thickness: p.portion_thickness || p.thickness || 'ตามสเปก',
                  meatFatRatio: p.meat_fat_ratio || p.meatFatRatio || 'ตามสเปก',
                  pack: p.packing || p.pack || 'Vacuum pack',
                  storage: p.storage || 'แช่เย็น 0-4°C / แช่แข็ง -18°C',
                  shelfLife: p.shelf_life || p.shelfLife || 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
                  moq: p.moq || 'ขั้นต่ำ 20 กก.',
                  use: p.recommended_use || p.use || 'ธุรกิจอาหาร',
                  image: p.image_url || p.image || '/products/pork-neck.webp',
                }))
              );
            }
          }
        }
      } catch {}
    }

    void loadData();

    const handleSettingsUpdate = () => {
      void loadData();
    };
    const handleCmsUpdate = (e: any) => {
      if (!e.detail || e.detail.table === 'products') {
        void loadData();
      }
    };

    window.addEventListener('dct_settings_updated', handleSettingsUpdate);
    window.addEventListener('dct_cms_updated', handleCmsUpdate);
    return () => {
      window.removeEventListener('dct_settings_updated', handleSettingsUpdate);
      window.removeEventListener('dct_cms_updated', handleCmsUpdate);
    };
  }, []);

  // Certificate Modal state (Slide 5)
  const [activeCert, setActiveCert] = useState<{
    name: string;
    fullName: string;
    certNo: string;
    issuer: string;
    issueDate?: string;
    expiry: string;
    desc: string;
    imageUrl?: string;
    scope?: string;
  } | null>(null);

  // Slider ref for smooth horizontal scrolling (Slide 2)
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const heroImage = profile.hero_image_url || '/hero-banner.webp';
  const aboutImage = contact.image_url || '/about-factory-new.png';

  return (
    <>
      {/* =========================================================================
          ROW 1: FULL-WIDTH PANORAMIC HERO BANNER (Slide 1)
          ========================================================================= */}
      <section
        className="hero-master-v2"
        style={profile.hero_image_url ? { backgroundImage: `linear-gradient(90deg, rgba(20,12,8,0.92) 0%, rgba(20,12,8,0.7) 50%, rgba(20,12,8,0.2) 100%), url('${heroImage}')` } : undefined}
      >
        <div className="wrap">
          <div className="hero-master-left">
            <h1>{lang === 'th' && profile.headline ? profile.headline : t('hero_title')}</h1>
            <p className="hero-sub">
              {lang === 'th' && profile.subheadline ? profile.subheadline : t('hero_sub')}
            </p>

            <div className="hero-master-actions">
              <Link className="pill-btn primary" href="/products">
                {t('hero_cta_products')}
              </Link>
              <Link className="pill-btn outline" href="/rfq">
                {t('hero_cta_rfq')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DASHBOARD CANVAS (Warm Luxury Cream & Sand Palette)
          ========================================================================= */}
      <div className="mockup-canvas">
        <div className="wrap">
          {/* =========================================================================
              ROW 2: สินค้าแนะนำ (Slide 2)
              ========================================================================= */}
          <section className="row-products-full" style={{ marginTop: 0 }}>
            <div className="mockup-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 className="sec-title" style={{ margin: 0 }}>{t('featured_title')}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6e584a' }}>
                    {t('featured_sub')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => scrollSlider('left')}
                      className="slider-nav-btn"
                      aria-label={lang === 'en' ? 'Scroll left' : 'เลื่อนซ้าย'}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSlider('right')}
                      className="slider-nav-btn"
                      aria-label={lang === 'en' ? 'Scroll right' : 'เลื่อนขวา'}
                    >
                      →
                    </button>
                  </div>
                  <Link href="/products" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--red)', textDecoration: 'none' }}>
                    {t('view_all_catalogue')}
                  </Link>
                </div>
              </div>

              {/* Slider Track */}
              <div className="product-slider-container" ref={sliderRef}>
                {featuredProds.map((p) => (
                  <div className="slider-product-card" key={p.id}>
                    <div className="img-zoom-wrapper">
                      <div
                        className="img-box zoom-effect"
                        style={{ backgroundImage: `url('${p.image}')` }}
                      />
                    </div>
                    <div className="info-box">
                      <h4>{lang === 'en' ? (p.nameEn || p.name) : p.name}</h4>
                      <div className="th-spec-desc">{lang === 'en' ? (p.cutEn || p.cut) : p.cut}</div>
                      <Link className="link-text" href={`/products/${p.id}`}>
                        {t('view_details')}
                      </Link>
                    </div>
                  </div>
                ))}

                {/* กล่องโปรโมชันประจำเดือน */}
                <div className="promo-mini-box slider-promo-card">
                  <div>
                    <span className="tag" style={{ background: 'var(--red)', color: '#fff', fontSize: '11px', padding: '3px 8px', marginBottom: '8px' }}>
                      {t('promo_badge')}
                    </span>
                    <h4>{t('promo_title')}</h4>
                    <p>{t('promo_desc')}</p>
                  </div>
                  <Link className="pill-btn primary" href="/rfq" style={{ fontSize: '12px', padding: '8px 14px', width: '100%', textAlign: 'center' }}>
                    {t('promo_cta')}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              ROW 3: ทำไมธุรกิจเลือกเรา & ไฮไลท์จุดเด่นสถิติ (Slide 3)
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <h3 className="sec-title">{t('why_title')}</h3>
              <div className="why-features-grid full-width">
                <div className="why-item-card">
                  <IconRibbon size={42} color="#8B1E1E" />
                  <h4>{t('why_1_title')}</h4>
                </div>
                <div className="why-item-card">
                  <IconShield size={42} color="#8B1E1E" />
                  <h4>{t('why_2_title')}</h4>
                </div>
                <div className="why-item-card">
                  <IconFactory size={42} color="#8B1E1E" />
                  <h4>{t('why_3_title')}</h4>
                </div>
                <div className="why-item-card">
                  <IconTruck size={42} color="#8B1E1E" />
                  <h4>{t('why_4_title')}</h4>
                </div>
                <div className="why-item-card">
                  <IconSupport size={42} color="#8B1E1E" />
                  <h4>{t('why_5_title')}</h4>
                </div>
              </div>

              {/* ก้อนสถิติจุดเด่นสีแดงเบอร์กันดี รวมใน Section เดียวกัน */}
              <div className="stats-burgundy-card" style={{ marginTop: '16px' }}>
                <div className="stats-mockup-grid">
                  <div className="stat-mockup-col">
                    <IconAwardGold size={32} color="#e5b85c" />
                    <div className="stat-val">{t('stat_1_val')}</div>
                    <div className="stat-lbl">{t('stat_1_lbl')}</div>
                  </div>
                  <div className="stat-mockup-col">
                    <IconUsersGold size={32} color="#e5b85c" />
                    <div className="stat-val">{t('stat_2_val')}</div>
                    <div className="stat-lbl">{t('stat_2_lbl')}</div>
                  </div>
                  <div className="stat-mockup-col">
                    <IconGlobeGold size={32} color="#e5b85c" />
                    <div className="stat-val">{t('stat_3_val')}</div>
                    <div className="stat-lbl">{t('stat_3_lbl')}</div>
                  </div>
                  <div className="stat-mockup-col">
                    <IconTruckGold size={32} color="#e5b85c" />
                    <div className="stat-val">{t('stat_4_val')}</div>
                    <div className="stat-lbl">{t('stat_4_lbl')}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              ROW 4: เกี่ยวกับเรา (Slide 4 & Slide 23)
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <h3 className="sec-title">{t('about_title')}</h3>
              <div className="about-mockup-split">
                <div>
                  <p className="about-mockup-content" style={{ fontSize: '15px', lineHeight: 1.85, marginBottom: '16px' }}>
                    <b>{t('about_company')}</b> {t('about_desc')}
                  </p>
                  <div>
                    <Link className="pill-btn primary" href="/about" style={{ fontSize: '13px', padding: '9px 20px' }}>
                      {t('about_cta')}
                    </Link>
                  </div>
                </div>
                <div
                  className="about-mockup-img"
                  style={{
                    backgroundImage: `url('${aboutImage}')`,
                  }}
                />
              </div>

              {/* แถบไฮไลท์บริการ 4 ด้านข้างล่างเกี่ยวกับเรา (ขยายใหญ่ขึ้นตาม Slide 23) */}
              <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #e8dfd5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>
                    {lang === 'en' ? 'Comprehensive Services for Food Businesses:' : 'บริการครบวงจรเพื่อธุรกิจอาหาร:'}
                  </span>
                  <Link href="/services" style={{ fontSize: '12.5px', color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                    {lang === 'en' ? 'View All Services →' : 'ดูบริการทั้งหมดของเรา →'}
                  </Link>
                </div>
                <div className="about-services-showcase-grid">
                  <Link href="/services#service-01" className="service-showcase-card">
                    <div className="service-showcase-top">
                      <span className="service-showcase-num">01</span>
                      <IconMeatCut size={24} color="#8B1E1E" />
                    </div>
                    <h4>{t('about_chip_cut')}</h4>
                    <span className="service-showcase-sub">
                      {lang === 'en' ? 'Custom Cutting' : 'ตัดแต่งตามสเปก'}
                    </span>
                  </Link>
                  <Link href="/services#service-02" className="service-showcase-card">
                    <div className="service-showcase-top">
                      <span className="service-showcase-num">02</span>
                      <IconPackage size={24} color="#8B1E1E" />
                    </div>
                    <h4>{t('about_chip_pack')}</h4>
                    <span className="service-showcase-sub">
                      {lang === 'en' ? 'Packaging Solutions' : 'บริการบรรจุภัณฑ์'}
                    </span>
                  </Link>
                  <Link href="/services#service-03" className="service-showcase-card">
                    <div className="service-showcase-top">
                      <span className="service-showcase-num">03</span>
                      <IconWarehouse size={24} color="#8B1E1E" />
                    </div>
                    <h4>{t('about_chip_cold')}</h4>
                    <span className="service-showcase-sub">
                      {lang === 'en' ? 'Cold Storage' : 'คลังสินค้าควบคุมอุณหภูมิ'}
                    </span>
                  </Link>
                  <Link href="/services#service-04" className="service-showcase-card">
                    <div className="service-showcase-top">
                      <span className="service-showcase-num">04</span>
                      <IconLogistics size={24} color="#8B1E1E" />
                    </div>
                    <h4>{t('about_chip_delivery')}</h4>
                    <span className="service-showcase-sub">
                      {lang === 'en' ? 'Cold Chain Logistics' : 'จัดส่งควบคุมอุณหภูมิ'}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              ROW 5: มาตรฐานการผลิตที่คุณวางใจ (Slide 5)
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="sec-title" style={{ margin: 0 }}>{t('standards_title')}</h3>
                <span style={{ fontSize: '12px', color: '#7a6557' }}>
                  {lang === 'en' ? '*Click card to view certificate preview' : '*กดที่การ์ดเพื่อดูเอกสารรับรองตัวจริง'}
                </span>
              </div>
              <div className="standards-content-split">
                <div className="standards-badges-col">
                  {/* Badge 1: GHPs */}
                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'GHPs Certified',
                        fullName: lang === 'en'
                          ? 'Good Hygiene Practices (GHPs) — CXC 1-1969 (Revised 2022)'
                          : 'Good Hygiene Practices (GHPs) — มาตรฐานสุขลักษณะที่ดีในการผลิตอาหาร',
                        certNo: '24042407001',
                        issuer: 'Intertek Industry and Certification Services (Thailand) Limited (ACFS)',
                        issueDate: lang === 'en' ? '02 October 2024' : '02 ตุลาคม 2567',
                        expiry: lang === 'en' ? '01 October 2027' : '01 ตุลาคม 2570',
                        scope: 'การผลิต (การตัด, การตัดแต่ง) ของเนื้อหมูแช่เย็น หรือแช่เยือกแข็ง, หมูบดแช่เยือกแข็ง, หมูหมักแช่เยือกแข็ง และเครื่องในแช่เยือกแข็ง',
                        desc: lang === 'en'
                          ? 'Certified by Intertek for pork processing, custom cut, chilling, and personnel hygiene in compliance with global food safety standards.'
                          : 'ได้รับการตรวจประเมินและรับรองจาก Intertek ว่า บริษัท ดวงเจริญอินเตอร์เทรด จำกัด ปฏิบัติตามมาตรฐานการจัดการสุขลักษณะที่ดีในกระบวนการผลิตอาหารอย่างเคร่งครัด',
                        imageUrl: '/certificates/ghp-intertek-cert.jpg',
                      })
                    }
                  >
                    <IconRibbon size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>GHPs Certified</h5>
                      <p>Good Hygiene Practices (Intertek)</p>
                    </div>
                    <span className="view-cert-badge">{t('view_cert')}</span>
                  </div>

                  {/* Badge 2: HACCP */}
                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'HACCP Standard',
                        fullName: lang === 'en'
                          ? 'Hazard Analysis and Critical Control Point System (HACCP) — CXC 1-1969'
                          : 'Hazard Analysis and Critical Control Point System (HACCP) — ระบบวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม',
                        certNo: '24042407001',
                        issuer: 'Intertek Industry and Certification Services (Thailand) Limited (ACFS)',
                        issueDate: lang === 'en' ? '02 October 2024' : '02 ตุลาคม 2567',
                        expiry: lang === 'en' ? '01 October 2027' : '01 ตุลาคม 2570',
                        scope: 'การผลิต (การตัด, การตัดแต่ง) ของเนื้อหมูแช่เย็น หรือแช่เยือกแข็ง, หมูบดแช่เยือกแข็ง, หมูหมักแช่เยือกแข็ง และเครื่องในแช่เยือกแข็ง',
                        desc: lang === 'en'
                          ? 'Certified critical control point monitoring across cutting, chilling, and packing to guarantee 100% food safety.'
                          : 'ได้รับการรับรองระบบ HACCP จาก Intertek ครอบคลุมการควบคุมจุดวิกฤตในทุกกระบวนการตัดแต่ง จัดเก็บ และรักษาอุณหภูมิ เพื่อความปลอดภัยสูงสุดต่อผู้บริโภค',
                        imageUrl: '/certificates/ghp-intertek-cert.jpg',
                      })
                    }
                  >
                    <IconShield size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>HACCP Standard</h5>
                      <p>Hazard Analysis & Critical Control</p>
                    </div>
                    <span className="view-cert-badge">{t('view_cert')}</span>
                  </div>

                  {/* Badge 3: Quality Control & Traceability */}
                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: lang === 'en' ? 'Quality Control & Traceability' : 'ระบบควบคุมคุณภาพ & ตรวจสอบย้อนกลับ',
                        fullName: 'Quality Control & Traceable Origin System',
                        certNo: 'QC-TRACE-DCT-2026',
                        issuer: lang === 'en' ? 'Quality Assurance Department, Duangcharoen Intertrade Co., Ltd.' : 'ฝ่ายประกันคุณภาพ บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด',
                        issueDate: lang === 'en' ? 'Continuous Audit' : 'ตรวจประเมินต่อเนื่อง',
                        expiry: lang === 'en' ? 'Annual Review 2027' : 'ทบทวนและตรวจสอบประจำปี 2570',
                        scope: 'ควบคุมอุณหภูมิ Cold Chain ตลอด 24 ชม. และระบบบันทึก Lot Number ย้อนกลับถึงฟาร์มต้นทาง',
                        desc: lang === 'en'
                          ? '24-hour Cold Chain temperature monitoring and batch-level traceability for every cut piece.'
                          : 'ระบบควบคุมอุณหภูมิ Cold Chain 24 ชม. และระบบตรวจสอบย้อนกลับ (Traceability) ได้ทุกชิ้นส่วนและทุกล็อตสินค้า เพื่อความโปร่งใสและมั่นใจสูงสุด',
                        imageUrl: '/certificates/ghp-intertek-cert.jpg',
                      })
                    }
                  >
                    <IconFactory size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>{lang === 'en' ? 'Quality Control System' : 'ระบบควบคุมคุณภาพ'}</h5>
                      <p>{lang === 'en' ? '100% Traceability across all steps' : 'ตรวจสอบย้อนกลับได้ทุกขั้นตอน'}</p>
                    </div>
                    <span className="view-cert-badge">{t('view_cert')}</span>
                  </div>
                </div>

                <div
                  className="standards-photo"
                  style={{
                    backgroundImage: `url('/standards-factory.jpg')`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* =========================================================================
              ROW 6: FINAL CTA BANNER (Seamless Handshake)
              ========================================================================= */}
          <section className="row-final-cta">
            <div className="cta-split-left">
              <h2>
                {lang === 'en' ? (
                  <>Ready to Partner<br />in Growing Your Business</>
                ) : (
                  <>พร้อมเป็นส่วนหนึ่ง<br />ในการเติบโตของธุรกิจคุณ</>
                )}
              </h2>
              <p>
                {lang === 'en'
                  ? 'Let us take care of raw material quality and reliability for your sustainable growth.'
                  : 'ให้เราช่วยดูแลคุณภาพและวัตถุดิบ เพื่อธุรกิจที่เติบโตอย่างยั่งยืน'}
              </p>
              <div>
                <Link className="pill-btn primary" href="/contact">
                  {lang === 'en' ? 'Contact Sales →' : 'ติดต่อฝ่ายขาย →'}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ดูเอกสารรับรองมาตรฐานพร้อมรูปภาพจริง (Slide 5)
          ========================================================================= */}
      {activeCert && (
        <div className="cert-modal-backdrop" onClick={() => setActiveCert(null)}>
          <div
            className="cert-modal-content"
            style={{ maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8B1E1E', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📜</span>
                <h3 style={{ margin: 0, fontSize: '19px', color: 'var(--red)', fontWeight: 'bold' }}>{activeCert.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', margin: '0 0 8px' }}>
                {activeCert.fullName}
              </p>
              <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#555', margin: '0 0 16px' }}>
                {activeCert.desc}
              </p>

              {/* ข้อมูลทะเบียนใบรับรองจริง */}
              <div style={{ background: '#fcf8f3', border: '1px solid #ebd8c6', borderRadius: '8px', padding: '16px', fontSize: '13.5px', lineHeight: 1.8, marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: '#7a6557' }}>{t('cert_no')} (Certificate No.):</span>
                  <b style={{ color: 'var(--red)', letterSpacing: '0.05em' }}>{activeCert.certNo}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: '#7a6557' }}>{t('cert_issuer')} (Issued by):</span>
                  <b>{activeCert.issuer}</b>
                </div>
                {activeCert.issueDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ color: '#7a6557' }}>วันที่ออกใบรับรอง (Issue Date):</span>
                    <b>{activeCert.issueDate}</b>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: '#7a6557' }}>{t('cert_expiry')} (Expiry Date):</span>
                  <b style={{ color: '#188038' }}>{activeCert.expiry}</b>
                </div>
                {activeCert.scope && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #ded4c8', fontSize: '12.5px', color: '#685548' }}>
                    <b>ขอบเขตการรับรอง (Scope):</b> {activeCert.scope}
                  </div>
                )}
              </div>

              {/* แสดงรูปภาพใบรับรองจริง */}
              {activeCert.imageUrl && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px' }}>
                    🏅 เอกสารรับรองฉบับจริง (Intertek Certificate of Registration):
                  </div>
                  <div style={{ border: '1px solid #ebd8c6', borderRadius: '8px', overflow: 'hidden', background: '#faf6f0', padding: '10px' }}>
                    <img
                      src={activeCert.imageUrl}
                      alt={activeCert.name}
                      style={{ maxWidth: '100%', maxHeight: '420px', width: 'auto', margin: '0 auto', display: 'block', borderRadius: '4px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #eee' }}>
              <Link href="/standards" className="button alt" style={{ fontSize: '12.5px', padding: '7px 16px' }} onClick={() => setActiveCert(null)}>
                ดูหน้ามาตรฐานทั้งหมด →
              </Link>
              <button
                type="button"
                className="pill-btn primary"
                style={{ fontSize: '13px', padding: '8px 22px' }}
                onClick={() => setActiveCert(null)}
              >
                {t('cert_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
