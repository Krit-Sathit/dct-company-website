import Link from 'next/link';
import Image from 'next/image';
import { products as allProducts } from '@/lib/data';
import {
  IconRibbon,
  IconShield,
  IconFactory,
  IconTruck,
  IconSupport,
  IconRestaurant,
  IconProcessing,
  IconWholesale,
  IconSupermarket,
  IconCorporate,
  IconMeatCut,
  IconWarehouse,
  IconPackage,
  IconLogistics,
  IconConsulting,
  IconAwardGold,
  IconUsersGold,
  IconGlobeGold,
  IconTruckGold,
} from '@/components/icons';

export default function Home() {
  const featuredProds = allProducts.slice(0, 4);

  return (
    <>
      {/* =========================================================================
          ROW 1: FULL-WIDTH PANORAMIC HERO BANNER (Matching Image 2)
          ========================================================================= */}
      <section className="hero-master-v2">
        <div className="wrap">
          <div className="hero-master-left">
            <h1>แหล่งวัตถุดิบเนื้อหมูสำหรับธุรกิจ</h1>
            <p className="hero-sub">
              ที่ต้องการคุณภาพสม่ำเสมอ ปริมาณเพียงพอ<br />
              และการจัดส่งที่ไว้ใจได้
            </p>
            <div className="hero-tagline">
              Reliable Pork Supply for Business
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
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
              ROW 2: ทำไมธุรกิจเลือกเรา (58%) + กลุ่มลูกค้า (42%)
              ========================================================================= */}
          <section className="row-why-industry">
          {/* Left: ทำไมธุรกิจเลือกเรา */}
          <div className="mockup-card">
            <h3 className="sec-title">ทำไมธุรกิจเลือกเรา</h3>
            <div className="why-features-grid">
              <div className="why-item-card">
                <IconRibbon size={30} color="#8B1E1E" />
                <h4>คุณภาพสม่ำเสมอ</h4>
                <p>คัดสรรวัตถุดิบคุณภาพ ผ่านมาตรฐานการผลิตที่เชื่อถือได้ทุกล็อตสินค้า</p>
              </div>
              <div className="why-item-card">
                <IconShield size={30} color="#8B1E1E" />
                <h4>ปลอดภัย มั่นใจได้</h4>
                <p>ควบคุมคุณภาพทุกขั้นตอน ได้มาตรฐานสากล ตรวจสอบย้อนกลับได้</p>
              </div>
              <div className="why-item-card">
                <IconFactory size={30} color="#8B1E1E" />
                <h4>กำลังการผลิตเพียงพอ</h4>
                <p>รองรับความต้องการได้อย่างต่อเนื่อง ตามแผนธุรกิจของคุณ</p>
              </div>
              <div className="why-item-card">
                <IconTruck size={30} color="#8B1E1E" />
                <h4>จัดส่งตรงเวลา</h4>
                <p>ระบบขนส่งควบคุมอุณหภูมิ ตรงเวลา ครอบคลุมทั่วประเทศ</p>
              </div>
              <div className="why-item-card">
                <IconSupport size={30} color="#8B1E1E" />
                <h4>บริการใส่ใจทุกความต้องการ</h4>
                <p>ทีมงานมืออาชีพ พร้อมให้คำแนะนำและดูแลหลังการขายอย่างใกล้ชิด</p>
              </div>
            </div>
          </div>

          {/* Right: กลุ่มลูกค้า */}
          <div className="mockup-card">
            <h3 className="sec-title">กลุ่มลูกค้าของเรา</h3>
            <div className="industry-items-grid">
              <div className="industry-item-card">
                <IconRestaurant size={26} color="#8B1E1E" />
                <h4>ร้านอาหาร</h4>
                <span>พร้อมปรุง คุณภาพนิ่ง</span>
              </div>
              <div className="industry-item-card">
                <IconProcessing size={26} color="#8B1E1E" />
                <h4>โรงงานแปรรูป</h4>
                <span>สเปกตรงตามไลน์ผลิต</span>
              </div>
              <div className="industry-item-card">
                <IconWholesale size={26} color="#8B1E1E" />
                <h4>ผู้ค้าส่ง</h4>
                <span>สต็อกพร้อม ปริมาณคุ้มค่า</span>
              </div>
              <div className="industry-item-card">
                <IconSupermarket size={26} color="#8B1E1E" />
                <h4>ซูเปอร์มาร์เก็ต</h4>
                <span>สะอาด สดใหม่ ได้มาตรฐาน</span>
              </div>
              <div className="industry-item-card">
                <IconCorporate size={26} color="#8B1E1E" />
                <h4>ลูกค้าองค์กร</h4>
                <span>ห่วงโซ่ Supply มั่นคง</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ROW 3: สินค้าแนะนำ (45%) + เกี่ยวกับเรา (29%) + บริการของเรา (26%)
            ========================================================================= */}
        <section className="row-products-about-services">
          {/* Left: สินค้าแนะนำ */}
          <div className="mockup-card">
            <h3 className="sec-title">สินค้าแนะนำ</h3>
            <div className="product-showcase-grid">
              {featuredProds.map((p) => (
                <div className="mini-product-card" key={p.id}>
                  <div
                    className="img-box"
                    style={{ backgroundImage: `url('${p.image}')` }}
                  />
                  <div className="info-box">
                    <h4>{p.name}</h4>
                    <div className="en-name">{p.nameEn}</div>
                    <Link className="link-text" href={`/products/${p.id}`}>
                      ดูรายละเอียด →
                    </Link>
                  </div>
                </div>
              ))}

              {/* Stock Promotion Mini Box */}
              <div className="promo-mini-box">
                <div>
                  <span className="tag" style={{ background: 'var(--red)', color: '#fff', fontSize: '10px', padding: '2px 6px', marginBottom: '6px' }}>
                    🔥 Stock Promotion
                  </span>
                  <h4>สินค้าพร้อมขาย</h4>
                  <p>สินค้าที่พร้อมส่งมอบทันทีในราคาพิเศษ ประจำเดือน</p>
                </div>
                <Link className="pill-btn primary" href="/rfq" style={{ fontSize: '11px', padding: '6px 12px', width: '100%' }}>
                  ดูโปรโมชั่น →
                </Link>
              </div>
            </div>
          </div>

          {/* Middle: เกี่ยวกับเรา */}
          <div className="mockup-card">
            <h3 className="sec-title">เกี่ยวกับเรา</h3>
            <p className="about-mockup-content">
              ดวงเจริญ อินเตอร์เทรด คือโรงงานตัดแต่งเนื้อหมูและจัดจำหน่ายวัตถุดิบเนื้อหมูสำหรับธุรกิจ ด้วยประสบการณ์กว่า 30 ปี เรามุ่งมั่นส่งมอบคุณภาพสินค้าที่ได้มาตรฐาน ปลอดภัย เพื่อให้ธุรกิจของคุณเติบโตอย่างมั่นคง
            </p>
            <div>
              <Link className="pill-btn primary" href="/about" style={{ fontSize: '12px', padding: '7px 16px' }}>
                เกี่ยวกับเรา →
              </Link>
            </div>
            <div
              className="about-mockup-img"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80')`,
              }}
            />
          </div>

          {/* Right: บริการของเรา */}
          <div className="mockup-card">
            <h3 className="sec-title">บริการของเรา</h3>
            <div className="services-mockup-list">
              <div className="service-mockup-item">
                <IconMeatCut size={22} color="#8B1E1E" />
                <div>
                  <h5>รับผลิตตามความต้องการ</h5>
                  <p>ผลิตให้ตรงตามสูตรและสเปกของลูกค้า</p>
                </div>
              </div>
              <div className="service-mockup-item">
                <IconWarehouse size={22} color="#8B1E1E" />
                <div>
                  <h5>จัดเตรียมสินค้ามาตรฐาน</h5>
                  <p>ตัดแต่งตามมาตรฐานพร้อมส่งมอบ</p>
                </div>
              </div>
              <div className="service-mockup-item">
                <IconPackage size={22} color="#8B1E1E" />
                <div>
                  <h5>แพ็กและบรรจุภัณฑ์</h5>
                  <p>บรรจุภัณฑ์สุญญากาศ สะอาด ปลอดภัย</p>
                </div>
              </div>
              <div className="service-mockup-item">
                <IconLogistics size={22} color="#8B1E1E" />
                <div>
                  <h5>จัดส่งทั่วประเทศ</h5>
                  <p>รถห้องเย็นควบคุมอุณหภูมิ ตรงเวลา</p>
                </div>
              </div>
              <div className="service-mockup-item">
                <IconConsulting size={22} color="#8B1E1E" />
                <div>
                  <h5>ให้คำปรึกษาและดูแลอย่างใกล้ชิด</h5>
                  <p>ทีมงานพร้อมให้คำแนะนำและบริการ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ROW 4: มาตรฐานการผลิตที่คุณวางใจ (44%) + สถิติ 4 ตัว (56%)
            ========================================================================= */}
        <section className="row-standards-stats">
          {/* Left: มาตรฐานการผลิต */}
          <div className="mockup-card">
            <h3 className="sec-title">มาตรฐานการผลิตที่คุณวางใจ</h3>
            <div className="standards-content-split">
              <div className="standards-badges-col">
                <div className="standard-mini-badge">
                  <IconRibbon size={24} color="#8B1E1E" />
                  <div>
                    <h5>GHPs</h5>
                    <p>Good Hygiene Practices</p>
                  </div>
                </div>
                <div className="standard-mini-badge">
                  <IconShield size={24} color="#8B1E1E" />
                  <div>
                    <h5>HACCP</h5>
                    <p>Hazard Analysis & Critical Control</p>
                  </div>
                </div>
                <div className="standard-mini-badge">
                  <IconFactory size={24} color="#8B1E1E" />
                  <div>
                    <h5>ระบบควบคุมคุณภาพ</h5>
                    <p>ตรวจสอบย้อนกลับได้ทุกขั้นตอน</p>
                  </div>
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

          {/* Right: Burgundy Statistics Card */}
          <div className="stats-burgundy-card">
            <div className="stats-mockup-grid">
              <div className="stat-mockup-col">
                <IconAwardGold size={34} color="#e5b85c" />
                <div className="stat-val">30+ ปี</div>
                <div className="stat-lbl">ประสบการณ์ในอุตสาหกรรม</div>
              </div>
              <div className="stat-mockup-col">
                <IconUsersGold size={34} color="#e5b85c" />
                <div className="stat-val">1,000+ ราย</div>
                <div className="stat-lbl">ลูกค้าธุรกิจทั่วประเทศ</div>
              </div>
              <div className="stat-mockup-col">
                <IconGlobeGold size={34} color="#e5b85c" />
                <div className="stat-val">300 ตัน/ด.</div>
                <div className="stat-lbl">กำลังการผลิตและกระจาย</div>
              </div>
              <div className="stat-mockup-col">
                <IconTruckGold size={34} color="#e5b85c" />
                <div className="stat-val">100+ คัน</div>
                <div className="stat-lbl">รถห้องเย็นควบคุมอุณหภูมิ</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ROW 5: FINAL CTA (พร้อมเป็นส่วนหนึ่งในการเติบโตของธุรกิจคุณ)
            ========================================================================= */}
        <section className="row-final-cta">
          <div className="cta-split-left">
            <h2>พร้อมเป็นส่วนหนึ่ง<br />ในการเติบโตของธุรกิจคุณ</h2>
            <p>
              ให้เราช่วยดูแลคุณภาพและวัตถุดิบ เพื่อธุรกิจที่เติบโตอย่างยั่งยืน
            </p>
            <div>
              <Link className="pill-btn primary" href="/contact">
                ติดต่อเรา →
              </Link>
            </div>
          </div>
          <div
            className="cta-split-right"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80')`,
            }}
          />
        </section>
      </div>
    </div>
    </>
  );
}
