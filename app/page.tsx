'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products as allProducts } from '@/lib/data';
import { useLanguage } from '@/lib/language';
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
  const featuredProds = allProducts.slice(0, 4);

  // Certificate Modal state (Slide 5)
  const [activeCert, setActiveCert] = useState<{
    name: string;
    fullName: string;
    certNo: string;
    issuer: string;
    expiry: string;
    desc: string;
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

  return (
    <>
      {/* =========================================================================
          ROW 1: FULL-WIDTH PANORAMIC HERO BANNER (Slide 1)
          - Headline: "วัตถุดิบคุณภาพ พร้อมส่งต่อให้ธุรกิจของคุณ" / English when EN
          - Sub-headline: "เนื้อสุกรตัดแต่งตามสเปก พร้อมการจัดเก็บและจัดส่งที่ได้มาตรฐาน" / English when EN
          ========================================================================= */}
      <section className="hero-master-v2">
        <div className="wrap">
          <div className="hero-master-left">
            <h1>{t('hero_title')}</h1>
            <p className="hero-sub">
              {t('hero_sub')}
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
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
              - ย้ายขึ้นมาเป็น Section ที่ 2 ทันที
              - สไลด์ภาพ / Carousel พร้อมปุ่มเลื่อนและ Hover Zoom เพิ่มความไดนามิก
              - ภาษาไทย 100% ไม่ปนภาษาอังกฤษ (สลับภาษาอังกฤษเมื่อกด EN)
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
              - ลบกลุ่มลูกค้าของเราออก
              - ทำไมธุรกิจเลือกเรายาวเต็มความกว้าง
              - รวมตัวเลข 4 ตัวที่ยืนยันแล้ว
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <h3 className="sec-title">{t('why_title')}</h3>
              <div className="why-features-grid full-width">
                <div className="why-item-card">
                  <IconRibbon size={32} color="#8B1E1E" />
                  <h4>{t('why_1_title')}</h4>
                  <p>{t('why_1_desc')}</p>
                </div>
                <div className="why-item-card">
                  <IconShield size={32} color="#8B1E1E" />
                  <h4>{t('why_2_title')}</h4>
                  <p>{t('why_2_desc')}</p>
                </div>
                <div className="why-item-card">
                  <IconFactory size={32} color="#8B1E1E" />
                  <h4>{t('why_3_title')}</h4>
                  <p>{t('why_3_desc')}</p>
                </div>
                <div className="why-item-card">
                  <IconTruck size={32} color="#8B1E1E" />
                  <h4>{t('why_4_title')}</h4>
                  <p>{t('why_4_desc')}</p>
                </div>
                <div className="why-item-card">
                  <IconSupport size={32} color="#8B1E1E" />
                  <h4>{t('why_5_title')}</h4>
                  <p>{t('why_5_desc')}</p>
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
              ROW 4: เกี่ยวกับเรา (Slide 4)
              - เอาบริการกล่องใหญ่ออก
              - ขยายเกี่ยวกับเราให้กว้างเต็มตา
              - ทำแถบไฮไลท์บริการ 4 ด้านด้านล่างพร้อมลิงก์ไปหน้าบริการเต็ม
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <h3 className="sec-title">{t('about_title')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '24px', alignItems: 'center' }}>
                <div>
                  <p className="about-mockup-content" style={{ fontSize: '15px', lineHeight: 1.85 }}>
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
                    backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80')`,
                    height: '220px',
                    margin: 0,
                  }}
                />
              </div>

              {/* แถบไฮไลท์บริการ 4 ด้านข้างล่างเกี่ยวกับเรา (ตามคอมเมนต์ Slide 4) */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e8dfd5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#6e584a' }}>
                    {lang === 'en' ? 'Comprehensive Services for Food Businesses:' : 'บริการครบวงจรเพื่อธุรกิจอาหาร:'}
                  </span>
                  <Link href="/services" style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                    {lang === 'en' ? 'View All Services →' : 'ดูบริการทั้งหมดของเรา →'}
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div className="service-compact-chip">
                    <IconMeatCut size={18} color="#8B1E1E" />
                    <span>{t('about_chip_cut')}</span>
                  </div>
                  <div className="service-compact-chip">
                    <IconWarehouse size={18} color="#8B1E1E" />
                    <span>{t('about_chip_cold')}</span>
                  </div>
                  <div className="service-compact-chip">
                    <IconPackage size={18} color="#8B1E1E" />
                    <span>{t('about_chip_pack')}</span>
                  </div>
                  <div className="service-compact-chip">
                    <IconLogistics size={18} color="#8B1E1E" />
                    <span>{t('about_chip_delivery')}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              ROW 5: มาตรฐานการผลิตที่คุณวางใจ (Slide 5)
              - มีปุ่มเปิดดูเอกสารจริง (Modal)
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="sec-title" style={{ margin: 0 }}>{t('standards_title')}</h3>
                <span style={{ fontSize: '12px', color: '#7a6557' }}>
                  {lang === 'en' ? '*Click card to view certificate preview' : '*กดที่การ์ดเพื่อดูเอกสารรับรองตัวอย่าง'}
                </span>
              </div>
              <div className="standards-content-split">
                <div className="standards-badges-col">
                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'GHPs',
                        fullName: lang === 'en' ? 'Good Hygiene Practices (International Food Hygiene Standard)' : 'Good Hygiene Practices (มาตรฐานสุขลักษณะที่ดีในการผลิตอาหาร)',
                        certNo: 'GHP-DCT-2025/089',
                        issuer: lang === 'en' ? 'Department of Livestock Development / Certification Body' : 'กรมปศุสัตว์ / สถาบันรับรองมาตรฐานสากล',
                        expiry: lang === 'en' ? '31 December 2027' : '31 ธันวาคม 2570',
                        desc: lang === 'en' ? 'Certified pork cut and processing procedures, hygiene facilities, and personnel health protocols.' : 'รับรองกระบวนการผลิต การจัดการสุขอนามัยของสถานที่ บุคลากร และเครื่องมือเครื่องจักรในโรงงานตัดแต่งเนื้อสุกร',
                      })
                    }
                  >
                    <IconRibbon size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>GHPs</h5>
                      <p>Good Hygiene Practices</p>
                    </div>
                    <span className="view-cert-badge">{t('view_cert')}</span>
                  </div>

                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'HACCP',
                        fullName: lang === 'en' ? 'Hazard Analysis and Critical Control Point System' : 'Hazard Analysis and Critical Control Point System (ระบบวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม)',
                        certNo: 'HACCP-DCT-2025/112',
                        issuer: lang === 'en' ? 'Department of Livestock Development / Certification Body' : 'กรมปศุสัตว์ / สถาบันรับรองมาตรฐานสากล',
                        expiry: lang === 'en' ? '31 December 2027' : '31 ธันวาคม 2570',
                        desc: lang === 'en' ? 'Certified critical control point monitoring across cutting, chilling, and packing to guarantee 100% food safety.' : 'รับรองระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุมในการผลิตเนื้อสุกร เพื่อความปลอดภัยต่อผู้บริโภค 100%',
                      })
                    }
                  >
                    <IconShield size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>HACCP</h5>
                      <p>Hazard Analysis & Critical Control</p>
                    </div>
                    <span className="view-cert-badge">{t('view_cert')}</span>
                  </div>

                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: lang === 'en' ? 'Quality Control System' : 'ระบบควบคุมคุณภาพ',
                        fullName: 'Quality Control & Traceability System',
                        certNo: 'QC-TRACE-DCT-2026',
                        issuer: lang === 'en' ? 'QC Department, Duangcharoen Intertrade Co., Ltd.' : 'ฝ่ายประกันคุณภาพ บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด',
                        expiry: lang === 'en' ? 'Annual Audit & Review' : 'ทบทวนและตรวจสอบประจำปี',
                        desc: lang === 'en' ? '24-hour Cold Chain temperature monitoring and batch-level traceability for every cut piece.' : 'ระบบควบคุมอุณหภูมิ Cold Chain 24 ชม. และระบบตรวจสอบย้อนกลับ (Traceability) ได้ทุกชิ้นส่วนและทุกล็อตสินค้า',
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
                    backgroundImage: `url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80')`,
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
          MODAL: ดูเอกสารรับรองมาตรฐาน (Slide 5)
          ========================================================================= */}
      {activeCert && (
        <div className="cert-modal-backdrop" onClick={() => setActiveCert(null)}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📜</span>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--red)' }}>{activeCert.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', margin: '0 0 10px' }}>
              {activeCert.fullName}
            </p>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#555', margin: '0 0 16px' }}>
              {activeCert.desc}
            </p>

            <div style={{ background: '#fcf8f3', border: '1px solid #ebd8c6', borderRadius: '6px', padding: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#7a6557' }}>{t('cert_no')}:</span>
                <b>{activeCert.certNo}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#7a6557' }}>{t('cert_issuer')}:</span>
                <b>{activeCert.issuer}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7a6557' }}>{t('cert_expiry')}:</span>
                <b style={{ color: '#188038' }}>{activeCert.expiry}</b>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                className="pill-btn primary"
                style={{ fontSize: '13px', padding: '8px 20px' }}
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
