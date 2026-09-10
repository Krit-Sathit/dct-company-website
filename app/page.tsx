'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products as allProducts } from '@/lib/data';
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
          - Headline: "วัตถุดิบคุณภาพ พร้อมส่งต่อให้ธุรกิจของคุณ"
          - Sub-headline: "เนื้อสุกรตัดแต่งตามสเปก พร้อมการจัดเก็บและจัดส่งที่ได้มาตรฐาน"
          - ภาษาไทย 100% (ไม่มีภาษาอังกฤษปน)
          ========================================================================= */}
      <section className="hero-master-v2">
        <div className="wrap">
          <div className="hero-master-left">
            <h1>วัตถุดิบคุณภาพ พร้อมส่งต่อให้ธุรกิจของคุณ</h1>
            <p className="hero-sub">
              เนื้อสุกรตัดแต่งตามสเปก พร้อมการจัดเก็บและจัดส่งที่ได้มาตรฐาน
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
              <Link className="pill-btn primary" href="/products">
                ดูสินค้าและบริการ →
              </Link>
              <Link className="pill-btn outline" href="/rfq">
                ขอใบเสนอราคา
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
              - ภาษาไทย 100% ไม่ปนภาษาอังกฤษ
              ========================================================================= */}
          <section className="row-products-full" style={{ marginTop: 0 }}>
            <div className="mockup-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 className="sec-title" style={{ margin: 0 }}>สินค้าแนะนำ</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6e584a' }}>
                    คัดสรรชิ้นส่วนสุกรคุณภาพ ตัดแต่งตามสเปกที่ตอบโจทย์ทุกกลุ่มธุรกิจ
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => scrollSlider('left')}
                      className="slider-nav-btn"
                      aria-label="เลื่อนซ้าย"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSlider('right')}
                      className="slider-nav-btn"
                      aria-label="เลื่อนขวา"
                    >
                      →
                    </button>
                  </div>
                  <Link href="/products" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--red)', textDecoration: 'none' }}>
                    ดูแคตตาล็อกทั้งหมด →
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
                      <h4>{p.name}</h4>
                      <div className="th-spec-desc">{p.cut || 'ตัดแต่งมาตรฐานตามสเปก'}</div>
                      <Link className="link-text" href={`/products/${p.id}`}>
                        ดูรายละเอียด →
                      </Link>
                    </div>
                  </div>
                ))}

                {/* กล่องโปรโมชันประจำเดือน (ภาษาไทยล้วน) */}
                <div className="promo-mini-box slider-promo-card">
                  <div>
                    <span className="tag" style={{ background: 'var(--red)', color: '#fff', fontSize: '11px', padding: '3px 8px', marginBottom: '8px' }}>
                      🔥 โปรโมชันประจำเดือน
                    </span>
                    <h4>สินค้าพร้อมส่ง</h4>
                    <p>สินค้าที่พร้อมส่งมอบทันทีในราคาพิเศษ ประจำเดือนนี้</p>
                  </div>
                  <Link className="pill-btn primary" href="/rfq" style={{ fontSize: '12px', padding: '8px 14px', width: '100%', textAlign: 'center' }}>
                    ดูโปรโมชั่น →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              ROW 3: ทำไมธุรกิจเลือกเรา & ไฮไลท์จุดเด่นสถิติ (Slide 3)
              - ลบกลุ่มลูกค้าของเราออก
              - ทำไมธุรกิจเลือกเรายาวเต็มความกว้าง
              - รวมตัวเลข 4 ตัวที่ยืนยันแล้ว:
                • 30+ ปี ประสบการณ์ในอุตสาหกรรม
                • 100+ ราย ลูกค้าธุรกิจทั่วประเทศ
                • 200+ ตัน/ด. กำลังการผลิตเพิ่มทุกเดือน
                • 150 ตัน ความจุห้องเย็นพร้อมควบคุมอุณหภูมิ
              ========================================================================= */}
          <section style={{ marginTop: '20px' }}>
            <div className="mockup-card">
              <h3 className="sec-title">ทำไมธุรกิจเลือกเรา</h3>
              <div className="why-features-grid full-width">
                <div className="why-item-card">
                  <IconRibbon size={32} color="#8B1E1E" />
                  <h4>คุณภาพสม่ำเสมอ</h4>
                  <p>คัดสรรวัตถุดิบคุณภาพ ผ่านมาตรฐานการผลิตที่เชื่อถือได้ทุกล็อตสินค้า</p>
                </div>
                <div className="why-item-card">
                  <IconShield size={32} color="#8B1E1E" />
                  <h4>ปลอดภัย มั่นใจได้</h4>
                  <p>ควบคุมคุณภาพทุกขั้นตอน ได้มาตรฐานสากล ตรวจสอบย้อนกลับได้</p>
                </div>
                <div className="why-item-card">
                  <IconFactory size={32} color="#8B1E1E" />
                  <h4>กำลังการผลิตเพียงพอ</h4>
                  <p>รองรับความต้องการได้อย่างต่อเนื่อง ตามแผนธุรกิจของคุณ</p>
                </div>
                <div className="why-item-card">
                  <IconTruck size={32} color="#8B1E1E" />
                  <h4>จัดส่งตรงเวลา</h4>
                  <p>ระบบขนส่งควบคุมอุณหภูมิ ตรงเวลา ครอบคลุมทั่วประเทศ</p>
                </div>
                <div className="why-item-card">
                  <IconSupport size={32} color="#8B1E1E" />
                  <h4>บริการใส่ใจทุกความต้องการ</h4>
                  <p>ทีมงานมืออาชีพ พร้อมให้คำแนะนำและดูแลหลังการขายอย่างใกล้ชิด</p>
                </div>
              </div>

              {/* ก้อนสถิติจุดเด่นสีแดงเบอร์กันดี รวมใน Section เดียวกันตามคอมเมนต์ */}
              <div className="stats-burgundy-card" style={{ marginTop: '16px' }}>
                <div className="stats-mockup-grid">
                  <div className="stat-mockup-col">
                    <IconAwardGold size={32} color="#e5b85c" />
                    <div className="stat-val">30+ ปี</div>
                    <div className="stat-lbl">ประสบการณ์ในอุตสาหกรรม</div>
                  </div>
                  <div className="stat-mockup-col">
                    <IconUsersGold size={32} color="#e5b85c" />
                    <div className="stat-val">100+ ราย</div>
                    <div className="stat-lbl">ลูกค้าธุรกิจทั่วประเทศ</div>
                  </div>
                  <div className="stat-mockup-col">
                    <IconGlobeGold size={32} color="#e5b85c" />
                    <div className="stat-val">200+ ตัน/ด.</div>
                    <div className="stat-lbl">กำลังการผลิตเพิ่มทุกเดือน</div>
                  </div>
                  <div className="stat-mockup-col">
                    <IconTruckGold size={32} color="#e5b85c" />
                    <div className="stat-val">150 ตัน</div>
                    <div className="stat-lbl">ความจุห้องเย็นพร้อมควบคุมอุณหภูมิ</div>
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
              <h3 className="sec-title">เกี่ยวกับเรา</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '24px', alignItems: 'center' }}>
                <div>
                  <p className="about-mockup-content" style={{ fontSize: '15px', lineHeight: 1.85 }}>
                    <b>บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด</b> คือโรงงานตัดแต่งเนื้อสุกรและจัดจำหน่ายวัตถุดิบเนื้อหมูสำหรับธุรกิจครบวงจร ด้วยประสบการณ์กว่า 30 ปีในอุตสาหกรรมอาหาร เรามุ่งมั่นส่งมอบคุณภาพสินค้าที่ได้มาตรฐานระดับสากล ปลอดภัย ตรวจสอบย้อนกลับได้ และจัดส่งตรงเวลา เพื่อร่วมเป็นส่วนสำคัญในการเติบโตของธุรกิจคุณอย่างมั่นคง
                  </p>
                  <div>
                    <Link className="pill-btn primary" href="/about" style={{ fontSize: '13px', padding: '9px 20px' }}>
                      เกี่ยวกับเรา →
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
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#6e584a' }}>บริการครบวงจรเพื่อธุรกิจอาหาร:</span>
                  <Link href="/services" style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                    ดูบริการทั้งหมดของเรา →
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div className="service-compact-chip">
                    <IconMeatCut size={18} color="#8B1E1E" />
                    <span>ตัดแต่งตามสเปก</span>
                  </div>
                  <div className="service-compact-chip">
                    <IconWarehouse size={18} color="#8B1E1E" />
                    <span>คลังสินค้าห้องเย็น</span>
                  </div>
                  <div className="service-compact-chip">
                    <IconPackage size={18} color="#8B1E1E" />
                    <span>บรรจุภัณฑ์สุญญากาศ</span>
                  </div>
                  <div className="service-compact-chip">
                    <IconLogistics size={18} color="#8B1E1E" />
                    <span>จัดส่งทั่วประเทศ</span>
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
                <h3 className="sec-title" style={{ margin: 0 }}>มาตรฐานการผลิตที่คุณวางใจ</h3>
                <span style={{ fontSize: '12px', color: '#7a6557' }}>*กดที่การ์ดเพื่อดูเอกสารรับรองตัวอย่าง</span>
              </div>
              <div className="standards-content-split">
                <div className="standards-badges-col">
                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'GHPs',
                        fullName: 'Good Hygiene Practices (มาตรฐานสุขลักษณะที่ดีในการผลิตอาหาร)',
                        certNo: 'GHP-DCT-2025/089',
                        issuer: 'กรมปศุสัตว์ / สถาบันรับรองมาตรฐานสากล',
                        expiry: '31 ธันวาคม 2570',
                        desc: 'รับรองกระบวนการผลิต การจัดการสุขอนามัยของสถานที่ บุคลากร และเครื่องมือเครื่องจักรในโรงงานตัดแต่งเนื้อสุกร',
                      })
                    }
                  >
                    <IconRibbon size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>GHPs</h5>
                      <p>Good Hygiene Practices</p>
                    </div>
                    <span className="view-cert-badge">ดูเอกสาร →</span>
                  </div>

                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'HACCP',
                        fullName: 'Hazard Analysis and Critical Control Point System',
                        certNo: 'HACCP-DCT-2025/112',
                        issuer: 'กรมปศุสัตว์ / สถาบันรับรองมาตรฐานสากล',
                        expiry: '31 ธันวาคม 2570',
                        desc: 'รับรองระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุมในการผลิตเนื้อสุกร เพื่อความปลอดภัยต่อผู้บริโภค 100%',
                      })
                    }
                  >
                    <IconShield size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>HACCP</h5>
                      <p>Hazard Analysis & Critical Control</p>
                    </div>
                    <span className="view-cert-badge">ดูเอกสาร →</span>
                  </div>

                  <div
                    className="standard-mini-badge clickable"
                    onClick={() =>
                      setActiveCert({
                        name: 'ระบบควบคุมคุณภาพ',
                        fullName: 'Quality Control & Traceability System',
                        certNo: 'QC-TRACE-DCT-2026',
                        issuer: 'ฝ่ายประกันคุณภาพ บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด',
                        expiry: 'ทบทวนและตรวจสอบประจำปี',
                        desc: 'ระบบควบคุมอุณหภูมิ Cold Chain 24 ชม. และระบบตรวจสอบย้อนกลับ (Traceability) ได้ทุกชิ้นส่วนและทุกล็อตสินค้า',
                      })
                    }
                  >
                    <IconFactory size={24} color="#8B1E1E" />
                    <div style={{ flex: 1 }}>
                      <h5>ระบบควบคุมคุณภาพ</h5>
                      <p>ตรวจสอบย้อนกลับได้ทุกขั้นตอน</p>
                    </div>
                    <span className="view-cert-badge">ดูเอกสาร →</span>
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
              <h2>พร้อมเป็นส่วนหนึ่ง<br />ในการเติบโตของธุรกิจคุณ</h2>
              <p>
                ให้เราช่วยดูแลคุณภาพและวัตถุดิบ เพื่อธุรกิจที่เติบโตอย่างยั่งยืน
              </p>
              <div>
                <Link className="pill-btn primary" href="/contact">
                  ติดต่อฝ่ายขาย →
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
                <span style={{ color: '#7a6557' }}>เลขที่ใบรับรอง:</span>
                <b>{activeCert.certNo}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#7a6557' }}>หน่วยงานผู้ออก:</span>
                <b>{activeCert.issuer}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7a6557' }}>สถานะ / วันหมดอายุ:</span>
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
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
