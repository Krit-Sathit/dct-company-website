'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';

export default function About() {
  const { lang, t } = useLanguage();

  return (
    <>
      {/* Slide 12: Hero & Headline */}
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">
            {lang === 'en' ? 'ABOUT US · DOUNGCHALERN INTER TRADE' : 'เกี่ยวกับเรา · บริษัท ดวงเจริญอินเตอร์เทรด จำกัด'}
          </div>
          <h1>
            {lang === 'en' ? 'The Foundation of Business-Ready Raw Ingredients' : 'เบื้องหลังวัตถุดิบที่พร้อมสำหรับธุรกิจ'}
          </h1>
          <p className="lead">
            {lang === 'en'
              ? 'DOUNGCHALERN INTER TRADE oversees every stage—from selection, precision cutting, cold storage to temperature-controlled delivery—so partners can operate seamlessly with utmost confidence in every shipment.'
              : 'ดวงเจริญ อินเตอร์เทรด ดูแลตั้งแต่การคัดสรร ตัดแต่ง จัดเก็บ และจัดส่งวัตถุดิบเนื้อสุกร เพื่อให้คู่ค้าทำงานได้ง่ายขึ้นและมั่นใจในทุกการส่งมอบ'}
          </p>
        </div>
      </section>

      {/* Slide 13: Company Profile */}
      <main className="section white">
        <div className="wrap split">
          <div>
            <div className="eyebrow">Company Profile</div>
            <h2 style={{ fontSize: '28px', lineHeight: 1.3, marginBottom: '16px' }}>
              {lang === 'en'
                ? 'We understand that businesses demand ingredients that are "Ready to Use"'
                : 'เราเข้าใจว่าธุรกิจต้องการวัตถุดิบที่ “พร้อมใช้”'}
            </h2>
            <p style={{ lineHeight: 1.85, color: '#5e483b', fontSize: '15.5px' }}>
              {lang === 'en'
                ? 'Backed by decades of experience in pork cutting and food supply chain management, DCT has built a seamless end-to-end operation—ranging from custom cutting to exact specifications, temperature-controlled warehousing, through to cold chain delivery—enabling our partners to manage ingredients effortlessly with dependable consistency in every single lot.'
                : 'จากประสบการณ์ด้านการตัดแต่งเนื้อสุกรและการจัดการวัตถุดิบอาหาร DCT พัฒนาการทำงานให้ครอบคลุมตั้งแต่การตัดแต่งตามสเปก การจัดเก็บควบคุมอุณหภูมิไปจนถึงการจัดส่ง เพื่อช่วยให้คู่ค้าบริหารวัตถุดิบได้ง่ายและสม่ำเสมอมากขึ้น'}
            </p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span className="pill-tag">✓ ตัดแต่งตามสเปก (Custom Cut)</span>
              <span className="pill-tag">✓ ควบคุมอุณหภูมิ 0-4°C / -18°C</span>
              <span className="pill-tag">✓ จัดส่งตรงเวลา</span>
            </div>
          </div>
          <div
            className="photo"
            style={{
              backgroundImage: `url('/about-factory-new.png')`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              minHeight: '380px',
            }}
          />
        </div>
      </main>

      {/* Slide 14 & 15: Vision & Values (No "Pillar" badge) */}
      <section className="section beige">
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
            <div className="eyebrow">{lang === 'en' ? 'Vision & Mission' : 'วิสัยทัศน์และพันธกิจ'}</div>
            <h2 style={{ fontSize: '28px', margin: '8px 0 16px' }}>
              {lang === 'en'
                ? 'A Trusted Partner in Raw Ingredients for Businesses'
                : 'เป็นคู่ค้าที่ธุรกิจไว้วางใจในทุกเรื่องของวัตถุดิบ'}
            </h2>
            <p className="lead" style={{ fontSize: '16.5px', color: '#4a3328' }}>
              {lang === 'en'
                ? '“Delivering consistent quality, standardized operations, and dependable logistics for every partner.”'
                : '“ด้วยคุณภาพที่สม่ำเสมอ การทำงานที่ได้มาตรฐาน และการส่งมอบที่เชื่อถือได้”'}
            </p>
          </div>

          <div className="grid four">
            {[
              {
                num: '01',
                tag: '01 — Standard & Safety',
                title: lang === 'en' ? 'Controllable Quality' : 'คุณภาพที่ควบคุมได้',
                desc:
                  lang === 'en'
                    ? 'Meticulous care at every stage—from live selection, cutting, through to cold storage—to ensure consistently superior quality.'
                    : 'ใส่ใจทุกขั้นตอนตั้งแต่วัตถุดิบ การตัดแต่ง ไปจนถึงการจัดเก็บ เพื่อให้ได้สินค้าที่มีคุณภาพสม่ำเสมอ',
              },
              {
                num: '02',
                tag: '02 — Customization & Precision',
                title: lang === 'en' ? 'Tailored to Your Kitchen' : 'ตัดแต่งให้ตรงกับงาน',
                desc:
                  lang === 'en'
                    ? 'Supporting custom cut specifications and packaging formats tailored to the exact culinary and production needs of each business.'
                    : 'รองรับการตัดแต่งตามสเปกและรูปแบบการใช้งานของแต่ละธุรกิจ',
              },
              {
                num: '03',
                tag: '03 — Cold Chain Integrity',
                title: lang === 'en' ? 'Preserving Quality in Transit' : 'รักษาคุณภาพตลอดการเดินทาง',
                desc:
                  lang === 'en'
                    ? 'Strict temperature control across warehouse storage and refrigerated fleet logistics to preserve raw freshness throughout.'
                    : 'ควบคุมอุณหภูมิในการจัดเก็บและขนส่ง เพื่อรักษาคุณภาพของสินค้า',
              },
              {
                num: '04',
                tag: '04 — Partnership',
                title: lang === 'en' ? 'Growing Together with Partners' : 'เติบโตไปพร้อมกับคู่ค้า',
                desc:
                  lang === 'en'
                    ? 'Operating with honesty, dedicated delivery punctuality, and long-term commitment to support every business need.'
                    : 'ทำงานอย่างตรงไปตรงมา ใส่ใจการส่งมอบ และพร้อมดูแลความต้องการของธุรกิจในระยะยาว',
              },
            ].map((m) => (
              <div
                className="card"
                key={m.num}
                style={{
                  borderTop: '3px solid var(--red)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--red)', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  {m.tag}
                </div>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px', color: 'var(--ink)' }}>
                  {m.title}
                </h3>
                <p className="small" style={{ color: '#6e584a', lineHeight: 1.65, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slide 16: Supply Chain Ecosystem */}
      <section className="section white">
        <div className="wrap">
          <div className="eyebrow">Supply Chain Ecosystem</div>
          <h2 style={{ fontSize: '28px' }}>
            {lang === 'en' ? 'From Raw Ingredients, Directly to Your Business' : 'จากวัตถุดิบ ถึงมือธุรกิจของคุณ'}
          </h2>
          <div className="steps" style={{ marginTop: '28px' }}>
            {[
              {
                num: '01',
                name: 'Source',
                desc: lang === 'en' ? 'Traceable premium swine sourced from certified high-standard farms' : 'คัดสรรวัตถุดิบสุกรจากฟาร์มมาตรฐาน ตรวจสอบย้อนกลับได้',
              },
              {
                num: '02',
                name: 'Process',
                desc: lang === 'en' ? 'Precision cutting: Slice, Dice, Mince, Portion to exact specifications' : 'ตัดแต่ง Slice, Dice, Mince, Portion ตามสเปก',
              },
              {
                num: '03',
                name: 'Store',
                desc: lang === 'en' ? 'State-of-the-art cold warehouse facilities: Chilled (0-4°C) & Frozen (-18°C)' : 'จัดเก็บในคลังสินค้าควบคุมอุณหภูมิ Chilled & Frozen',
              },
              {
                num: '04',
                name: 'Deliver',
                desc: lang === 'en' ? 'Dedicated refrigerated logistics fleet dispatched strictly on schedule' : 'กระจายสินค้าด้วยรถควบคุมอุณหภูมิตรงตามรอบเวลา',
              },
              {
                num: '05',
                name: 'Partner',
                desc: lang === 'en' ? 'Collaborative B2B account support & joint supply chain planning' : 'ดูแลประสานงานและวางแผน Supply Chain ร่วมกับคู่ค้า',
              },
            ].map((s) => (
              <div className="step" key={s.num}>
                <div className="num">STEP {s.num}</div>
                <b>{s.name}</b>
                <p className="small">{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link className="button" href="/products" style={{ marginRight: '12px' }}>
              {lang === 'en' ? 'View Products & Specs' : 'ดูสินค้าและสเปก'}
            </Link>
            <Link className="button alt" href="/contact">
              {lang === 'en' ? 'Contact Sales Team' : 'ติดต่อทีมงาน'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
