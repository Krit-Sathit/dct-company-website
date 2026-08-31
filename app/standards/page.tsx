import Link from 'next/link';

export default function Standards() {
  const processes = [
    {
      num: '01',
      title: 'Raw Material',
      headline: 'การคัดสรรวัตถุดิบคุณภาพ',
      desc: 'คัดสรรเนื้อสุกรจากฟาร์มเลี้ยงที่ได้มาตรฐาน ปลอดสารเร่งเนื้อแดง และสามารถตรวจสอบย้อนกลับถึงแหล่งกำเนิดได้',
    },
    {
      num: '02',
      title: 'Processing',
      headline: 'การตัดแต่งในพื้นที่ควบคุม',
      desc: 'กระบวนการตัดแต่ง ชำแหละ สไลซ์ และบด ดำเนินการในห้องควบคุมอุณหภูมิและสุขอนามัยอย่างเคร่งครัด',
    },
    {
      num: '03',
      title: 'Storage',
      headline: 'การจัดเก็บในห้องเย็นมาตรฐาน',
      desc: 'จัดเก็บในคลังสินค้าควบคุมอุณหภูมิที่เหมาะสม ทั้ง Chilled (0°C ถึง 4°C) และ Frozen (-18°C ถึง -25°C)',
    },
    {
      num: '04',
      title: 'Delivery',
      headline: 'การขนส่งแบบ Cold Chain',
      desc: 'กระจายสินค้าด้วยรถห้องเย็นปรับอุณหภูมิ เพื่อรักษาคุณภาพ ความสด และสุขอนามัยจนถึงมือลูกค้า',
    },
  ];

  const certs = [
    {
      title: 'GHP',
      subtitle: 'Good Hygiene Practices',
      desc: 'มาตรฐานสุขลักษณะที่ดีในกระบวนการผลิตอาหาร การจัดการสิ่งแวดล้อม และสุขอนามัยส่วนบุคคลของผู้ปฏิบัติงาน',
    },
    {
      title: 'HACCP',
      subtitle: 'Hazard Analysis and Critical Control Points',
      desc: 'ระบบการจัดการความปลอดภัยของอาหาร วิเคราะห์อันตรายและควบคุมจุดวิกฤตตลอดห่วงโซ่การผลิต',
    },
    {
      title: 'อย.',
      subtitle: 'Food and Drug Administration',
      desc: 'การรับรองมาตรฐานสถานที่ผลิตและตัดแต่งเนื้อสัตว์จากสำนักงานคณะกรรมการอาหารและยา กระทรวงสาธารณสุข',
    },
    {
      title: 'ปศุสัตว์ OK',
      subtitle: 'Department of Livestock Development',
      desc: 'มาตรฐานสถานที่จำหน่ายและตัดแต่งเนื้อสัตว์ปลอดภัย ไร้สารตกค้าง จากกรมปศุสัตว์',
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">STANDARDS & FOOD SAFETY · MASTER V2.0</div>
          <h1>มาตรฐานการผลิตและความปลอดภัยด้านอาหาร</h1>
          <p className="lead">
            หัวใจสำคัญในการดำเนินงานของดวงเจริญ อินเตอร์เทรด คือความปลอดภัยด้านอาหารและคุณภาพที่ควบคุมได้ในทุกขั้นตอน
          </p>
        </div>
      </section>

      {/* Quality Process Flow */}
      <main className="section white">
        <div className="wrap">
          <div className="eyebrow">Quality Process</div>
          <h2>กระบวนการควบคุมคุณภาพ 4 ขั้นตอน</h2>
          <p className="lead">
            เราให้ความสำคัญกับความปลอดภัยด้านอาหารและคุณภาพในทุกขั้นตอน ตั้งแต่การคัดสรรวัตถุดิบ การตัดแต่ง การควบคุมอุณหภูมิ ไปจนถึงการจัดเก็บและส่งมอบ
          </p>

          <div className="quality-flow" style={{ marginTop: '36px' }}>
            {processes.map((p) => (
              <div className="quality-step" key={p.num}>
                <div className="q-num">STEP {p.num}</div>
                <h4>{p.headline}</h4>
                <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 700, marginBottom: '6px' }}>{p.title}</div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Certifications & Traceability */}
      <section className="section beige">
        <div className="wrap">
          <div className="eyebrow">Certifications & Compliance</div>
          <h2>มาตรฐานและการรับรองระดับสากล</h2>
          <p className="lead">
            โครงสร้างมาตรฐานที่รับประกันความสะอาด ความปลอดภัย และความสม่ำเสมอของวัตถุดิบสำหรับธุรกิจ
          </p>

          <div className="grid four" style={{ marginTop: '32px' }}>
            {certs.map((c) => (
              <div className="card" key={c.title} style={{ borderTop: '3px solid var(--red)' }}>
                <div className="num">CERTIFICATION</div>
                <h3 style={{ fontSize: '24px', margin: '4px 0 2px', color: 'var(--red)' }}>{c.title}</h3>
                <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>{c.subtitle}</div>
                <p className="small" style={{ color: '#6e584a' }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Traceability Box */}
          <div className="card" style={{ marginTop: '36px', background: '#fff', borderLeft: '4px solid var(--gold)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '32px' }}>🔍</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 6px', color: 'var(--ink)' }}>Traceability — ระบบตรวจสอบย้อนกลับ</h3>
                <p style={{ margin: 0, color: '#6e584a', lineHeight: 1.7 }}>
                  วัตถุดิบเนื้อสุกรทุกล็อตมาจากแหล่งที่สามารถตรวจสอบย้อนกลับได้ (Traceable Origin) พร้อมระบบบันทึกและควบคุมกระบวนการตั้งแต่วัตถุดิบต้นทาง การตัดแต่ง จนถึงการจัดเก็บในห้องเย็นเพื่อความโปร่งใสและมั่นใจสูงสุด
                </p>
                <div className="stat-tbc" style={{ marginTop: '8px', color: '#9e8c80' }}>
                  * หมายเหตุ: แสดง Certificate / เอกสารรับรองฉบับจริงเมื่อได้รับการยืนยันและอัปโหลดจากบริษัท
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link className="button" href="/rfq">
              ขอใบเสนอราคาตามมาตรฐาน
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
