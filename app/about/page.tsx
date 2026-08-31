import Link from 'next/link';

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">ABOUT US · DUANGCHAROEN INTERTRADE</div>
          <h1>ผู้เชี่ยวชาญด้านการตัดแต่งเนื้อสุกรและคลังสินค้าควบคุมอุณหภูมิ</h1>
          <p className="lead">
            บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด เป็นผู้เชี่ยวชาญด้านการแปรรูป ตัดแต่งเนื้อสุกรคุณภาพสูง และให้บริการคลังสินค้าควบคุมอุณหภูมิสำหรับอาหารสด อาหารแช่เย็น แช่แข็ง และอาหารแห้งครบวงจร
          </p>
        </div>
      </section>

      {/* Main Story & Vision */}
      <main className="section white">
        <div className="wrap split">
          <div>
            <div className="eyebrow">Company Profile</div>
            <h2>ยกระดับห่วงโซ่อุปทานอาหารของไทย</h2>
            <p style={{ lineHeight: 1.8, color: '#5e483b' }}>
              เรามุ่งมั่นสนับสนุนธุรกิจร้านอาหาร ครัวกลาง โรงงานแปรรูป และผู้ประกอบการ B2B ทั่วประเทศ ด้วยการส่งมอบวัตถุดิบเนื้อสุกรที่มีมาตรฐาน ความสะอาด และความสม่ำเสมอในทุกล็อตการผลิต
            </p>
            <p style={{ lineHeight: 1.8, color: '#5e483b' }}>
              ด้วยระบบการตัดแต่งตามสเปก คลังสินค้าควบคุมอุณหภูมิมาตรฐาน และการขนส่งแบบ Cold Chain เราช่วยลดภาระขั้นตอนการเตรียมวัตถุดิบและควบคุมต้นทุนของคู่ค้าให้มีประสิทธิภาพสูงสุด
            </p>
          </div>
          <div
            className="photo"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80')`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </main>

      {/* Vision & Mission 4 Pillars */}
      <section className="section beige">
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 48px' }}>
            <div className="eyebrow">Core Values & Direction</div>
            <h2>วิสัยทัศน์และพันธกิจ</h2>
            <p className="lead">
              <b>วิสัยทัศน์ (Vision):</b> &ldquo;มุ่งสู่การเป็นพันธมิตรชั้นนำด้านการตัดแต่งเนื้อสุกรและบริการคลังสินค้าควบคุมอุณหภูมิ ที่ได้รับความไว้วางใจสูงสุดในเรื่องคุณภาพ ความสะอาด และมาตรฐานความปลอดภัยทางอาหารระดับสากล&rdquo;
            </p>
          </div>

          <div className="grid four">
            {[
              {
                num: '01',
                title: 'Standard & Safety',
                desc: 'ยึดมั่นในมาตรฐาน GHP, HACCP และ อย. เพื่อส่งมอบวัตถุดิบเนื้อสุกรที่ปลอดภัยและถูกสุขอนามัยสูงสุด',
              },
              {
                num: '02',
                title: 'Customization & Precision',
                desc: 'มอบบริการตัดแต่งเนื้อสุกรที่ตรงตามสเปกและตอบโจทย์ความต้องการเฉพาะของคู่ค้า B2B อย่างแม่นยำ',
              },
              {
                num: '03',
                title: 'Cold Chain Integrity',
                desc: 'รักษาห่วงโซ่อุณหภูมิและคุณภาพความสดใหม่ด้วยระบบคลังสินค้าและการขนส่งควบคุมอุณหภูมิอย่างเข้มงวด',
              },
              {
                num: '04',
                title: 'Partnership',
                desc: 'เติบโตไปพร้อมกับคู่ค้าด้วยความซื่อสัตย์ การส่งมอบตรงเวลา และบริการที่เป็นมืออาชีพอย่างต่อเนื่อง',
              },
            ].map((m) => (
              <div className="card" key={m.num} style={{ borderTop: '3px solid var(--red)' }}>
                <div className="num">PILLAR {m.num}</div>
                <h3 style={{ fontSize: '18px', margin: '8px 0 10px', color: 'var(--ink)' }}>{m.title}</h3>
                <p className="small" style={{ color: '#6e584a' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supply Chain Integration */}
      <section className="section white">
        <div className="wrap">
          <div className="eyebrow">Supply Chain Ecosystem</div>
          <h2>ระบบการทำงานที่เชื่อมต่อถึงกัน</h2>
          <div className="steps" style={{ marginTop: '28px' }}>
            {[
              { num: '01', name: 'Source', desc: 'คัดสรรวัตถุดิบสุกรจากฟาร์มมาตรฐาน ตรวจสอบย้อนกลับได้' },
              { num: '02', name: 'Process', desc: 'ตัดแต่ง Slice, Dice, Mince, Portion ตามสเปก' },
              { num: '03', name: 'Store', desc: 'จัดเก็บในคลังสินค้าควบคุมอุณหภูมิ Chilled & Frozen' },
              { num: '04', name: 'Deliver', desc: 'กระจายสินค้าด้วยรถควบคุมอุณหภูมิตรงตามรอบเวลา' },
              { num: '05', name: 'Partner', desc: 'ดูแลประสานงานและวางแผน Supply Chain ร่วมกับคู่ค้า' },
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
              ดูสินค้าและสเปก
            </Link>
            <Link className="button alt" href="/contact">
              ติดต่อทีมงาน
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
