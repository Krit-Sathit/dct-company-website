'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';

export default function Services() {
  const { lang } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(25);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight - windowH;
      if (docH > 0) {
        // Calculate progress normalized between 15% and 100%
        const ratio = Math.min(Math.max(scrollY / (docH * 0.75), 0), 1);
        const percent = Math.max(25, Math.round(ratio * 100));
        setScrollProgress(percent);

        if (percent >= 90) setActiveStep(4);
        else if (percent >= 65) setActiveStep(3);
        else if (percent >= 40) setActiveStep(2);
        else setActiveStep(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToService = (id: string, stepIndex: number) => {
    setActiveStep(stepIndex);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const servicesList = [
    {
      id: 'service-01',
      num: '01',
      tag: '01 · Custom Cutting',
      titleTh: 'ตัดแต่งตามสเปก',
      titleEn: 'Custom Cutting',
      subTag: null,
      descTh: 'ตัดแต่งเนื้อสุกรตามรูปแบบที่เหมาะกับการใช้งานของแต่ละธุรกิจ',
      descEn: 'Precision pork cutting tailored to meet the exact culinary and production needs of each business.',
      ctaTh: 'สอบถามสเปก',
      ctaEn: 'Inquire Cutting Specs',
      ctaHref: '/rfq',
      img: '/service-custom-cut.png',
      alt: 'ตัดแต่งตามสเปก - Custom Cutting',
    },
    {
      id: 'service-02',
      num: '02',
      tag: '02 · Cold Storage',
      titleTh: 'คลังสินค้าควบคุมอุณหภูมิ',
      titleEn: 'Cold Storage',
      subTag: 'CHILLED · FROZEN',
      descTh: 'บริการจัดเก็บวัตถุดิบในสภาวะอุณหภูมิที่เหมาะสมกับสินค้า',
      descEn: 'Temperature-controlled warehousing maintaining optimum conditions for chilled and frozen products.',
      ctaTh: 'สอบถามบริการ',
      ctaEn: 'Inquire Storage',
      ctaHref: '/contact',
      img: '/service-cold-storage.png',
      alt: 'คลังสินค้าควบคุมอุณหภูมิ - Cold Storage',
    },
    {
      id: 'service-03',
      num: '03',
      tag: '03 · Packaging Solutions',
      titleTh: 'บริการบรรจุภัณฑ์',
      titleEn: 'Packaging Solutions',
      subTag: null,
      descTh: 'บรรจุวัตถุดิบในรูปแบบที่เหมาะกับสินค้าและการใช้งานของธุรกิจ',
      descEn: 'Industrial packaging formats designed to best protect quality, extend shelf-life, and simplify kitchen usage.',
      ctaTh: 'สอบถามรูปแบบการแพ็ก',
      ctaEn: 'Inquire Packaging Options',
      ctaHref: '/rfq',
      img: '/service-packaging.png',
      alt: 'บริการบรรจุภัณฑ์ - Packaging Solutions',
    },
    {
      id: 'service-04',
      num: '04',
      tag: '04 · Cold Chain Logistics',
      titleTh: 'จัดส่งควบคุมอุณหภูมิ',
      titleEn: 'Cold Chain Logistics',
      subTag: 'TEMPERATURE CONTROL · BUSINESS DELIVERY',
      descTh: 'ดูแลการจัดส่งวัตถุดิบด้วยระบบควบคุมอุณหภูมิที่เหมาะสม',
      descEn: 'Dedicated refrigerated fleet delivering on-time with unbroken temperature monitoring from warehouse to your door.',
      ctaTh: 'สอบถามการจัดส่ง',
      ctaEn: 'Inquire Delivery Schedules',
      ctaHref: '/contact',
      img: '/service-delivery.png',
      alt: 'จัดส่งควบคุมอุณหภูมิ - Cold Chain Logistics',
    },
  ];

  return (
    <>
      {/* Slide 17: Hero Section */}
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">
            {lang === 'en' ? 'OUR SERVICES · DOUNGCHALERN INTER TRADE' : 'บริการของเรา · บริษัท ดวงเจริญอินเตอร์เทรด จำกัด'}
          </div>
          <h1>
            {lang === 'en' ? 'Care for Raw Materials, From Origin to Your Business' : 'ดูแลวัตถุดิบ ตั้งแต่ต้นทางถึงมือคุณ'}
          </h1>
          <p className="lead" style={{ maxWidth: '780px' }}>
            {lang === 'en'
              ? 'Cutting, warehousing, packaging, and delivering systematically to ensure raw materials are perfectly ready for business operations.'
              : 'ตัดแต่ง จัดเก็บ บรรจุ และจัดส่งอย่างเป็นระบบ เพื่อให้วัตถุดิบพร้อมสำหรับการใช้งานของธุรกิจ'}
          </p>
        </div>
      </section>

      {/* Slide 17: Dynamic Drawing Process Stepper (CUT → PACK → STORE → DELIVER) */}
      <section className="service-flow-section">
        <div className="wrap">
          <div className="service-flow-wrapper">
            <div className="service-flow-track">
              {/* Background gray line */}
              <div className="service-flow-line-bg">
                {/* Animated draw fill line */}
                <div
                  className="service-flow-line-fill"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Step 1: CUT */}
              <div
                className={`service-flow-step ${activeStep >= 1 ? 'active' : ''}`}
                onClick={() => scrollToService('service-01', 1)}
                role="button"
                tabIndex={0}
              >
                <div className="service-flow-circle">01</div>
                <div className="service-flow-title">CUT</div>
                <div className="service-flow-desc">
                  {lang === 'en' ? 'Custom Cut' : 'ตัดแต่งตามสเปก'}
                </div>
              </div>

              {/* Step 2: PACK */}
              <div
                className={`service-flow-step ${activeStep >= 2 ? 'active' : ''}`}
                onClick={() => scrollToService('service-03', 2)}
                role="button"
                tabIndex={0}
              >
                <div className="service-flow-circle">02</div>
                <div className="service-flow-title">PACK</div>
                <div className="service-flow-desc">
                  {lang === 'en' ? 'Packaging' : 'บริการบรรจุภัณฑ์'}
                </div>
              </div>

              {/* Step 3: STORE */}
              <div
                className={`service-flow-step ${activeStep >= 3 ? 'active' : ''}`}
                onClick={() => scrollToService('service-02', 3)}
                role="button"
                tabIndex={0}
              >
                <div className="service-flow-circle">03</div>
                <div className="service-flow-title">STORE</div>
                <div className="service-flow-desc">
                  {lang === 'en' ? 'Cold Storage' : 'คลังสินค้าควบคุมอุณหภูมิ'}
                </div>
              </div>

              {/* Step 4: DELIVER */}
              <div
                className={`service-flow-step ${activeStep >= 4 ? 'active' : ''}`}
                onClick={() => scrollToService('service-04', 4)}
                role="button"
                tabIndex={0}
              >
                <div className="service-flow-circle">04</div>
                <div className="service-flow-title">DELIVER</div>
                <div className="service-flow-desc">
                  {lang === 'en' ? 'Cold Chain' : 'จัดส่งควบคุมอุณหภูมิ'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Service Cards (Slide 18-21: Single-Side Layout, Concise Copy, New Images) */}
      <main className="section white">
        <div className="wrap">
          <div className="service-cards-stack">
            {servicesList.map((srv) => (
              <div key={srv.id} id={srv.id} className="service-single-card">
                <div className="service-card-media">
                  <img src={srv.img} alt={srv.alt} />
                </div>
                <div className="service-card-content">
                  <div className="service-badge-row">
                    <span className="service-num-badge">{srv.num}</span>
                    {srv.subTag && (
                      <span className="service-tag-pill">{srv.subTag}</span>
                    )}
                  </div>
                  <h2 className="service-card-title">
                    {lang === 'en' ? srv.titleEn : srv.titleTh}
                  </h2>
                  <div className="service-card-subtitle">
                    {lang === 'en' ? srv.titleTh : srv.titleEn}
                  </div>
                  <p className="service-card-desc">
                    {lang === 'en' ? srv.descEn : srv.descTh}
                  </p>
                  <div className="service-card-actions">
                    <Link className="pill-btn primary" href={srv.ctaHref}>
                      {lang === 'en' ? srv.ctaEn : srv.ctaTh} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide 22: Closing Call to Action Banner */}
          <section className="services-closing-banner">
            <h2>
              {lang === 'en'
                ? 'Have Specific Requirements for Your Business?'
                : 'มีความต้องการเฉพาะสำหรับธุรกิจ ?'}
            </h2>
            <p>
              {lang === 'en'
                ? 'Inform us of your desired cuts, volume, or custom specifications. The DCT team is ready to discuss all details with you.'
                : 'แจ้งสินค้า ปริมาณ หรือสเปกที่ต้องการ ทีมงาน DCT พร้อมพูดคุยรายละเอียดกับคุณ'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link className="banner-btn-primary" href="/rfq">
                {lang === 'en' ? 'Request a Quote →' : 'ขอใบเสนอราคา →'}
              </Link>
              <Link className="banner-btn-secondary" href="/contact">
                {lang === 'en' ? 'Contact Sales' : 'ติดต่อฝ่ายขาย'}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
