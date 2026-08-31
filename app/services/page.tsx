import Link from 'next/link';

export default function Services() {
  const capabilities = [
    {
      num: '01',
      title: 'Custom Cutting',
      headline: 'บริการตัดแต่งเนื้อสุกรตามสเปก',
      desc: 'รองรับการตัดแต่งเนื้อสุกรตามขนาด รูปแบบ และความต้องการเฉพาะของลูกค้า เพื่อลดขั้นตอนและเวลาการเตรียมในครัวกลางหรือโรงงานแปรรูป',
      options: ['Slice: สไลซ์ความหนา 1.2 - 2.0 มม. สำหรับชาบู ปิ้งย่าง', 'Dice: หั่นเต๋าขนาด 1 - 2 นิ้ว สำหรับเมนูต้ม พะโล้ แกง', 'Mince: บดหยาบ/บดละเอียด ระบุสัดส่วนเนื้อต่อไขมันได้', 'Portion Cut: ตัดชิ้นสเต๊ก ชิ้นทงคัตสึ ควบคุมน้ำหนักต่อจาน'],
      img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      num: '02',
      title: 'Cold Storage',
      headline: 'บริการคลังสินค้าควบคุมอุณหภูมิ',
      desc: 'บริการคลังสินค้าห้องเย็นมาตรฐานสากล รองรับการจัดเก็บวัตถุดิบอาหารสด อาหารแช่เย็น แช่แข็ง และอาหารแห้งอย่างเป็นระบบ',
      options: ['Chilled Storage: ควบคุมอุณหภูมิ 0°C ถึง 4°C รักษาความสดของเนื้อสุกร', 'Frozen Storage: ควบคุมอุณหภูมิ -18°C ถึง -25°C สำหรับจัดเก็บระยะยาว', 'Dry Storage: คลังสินค้าสำหรับอาหารแห้งและบรรจุภัณฑ์', 'ระบบ FIFO / FEFO: บริหารสต็อกสินค้าเข้า-ออกอย่างแม่นยำ'],
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    },
    {
      num: '03',
      title: 'Packaging Solutions',
      headline: 'บริการบรรจุภัณฑ์มาตรฐานอุตสาหกรรม',
      desc: 'รองรับรูปแบบบรรจุภัณฑ์ที่เหมาะสมกับการจัดเก็บ การขนส่ง และการนำไปใช้งานจริงของธุรกิจแต่ละประเภท',
      options: ['Vacuum Packaging: บรรจุภัณฑ์สุญญากาศ ยืดอายุการเก็บรักษาและคงความสด', 'Bulk Packaging: ถุงขนาด 2 กก. / 5 กก. / 10 กก. สะดวกต่อโรงงานและครัวกลาง', 'Custom Pack: บรรจุตามจำนวนชิ้นหรือน้ำหนักที่ลูกค้ากำหนด', 'Food Grade Material: บรรจุภัณฑ์เกรดสัมผัสอาหารปลอดภัย 100%'],
      img: '/products/pork-belly.webp',
    },
    {
      num: '04',
      title: 'Cold Chain Logistics',
      headline: 'บริการจัดส่งควบคุมอุณหภูมิ',
      desc: 'ระบบขนส่งควบคุมอุณหภูมิจากโรงงานถึงมือลูกค้า เพื่อรักษาคุณภาพ ความสดใหม่ และความปลอดภัยของสินค้าตลอดเส้นทาง',
      options: ['Refrigerated Fleet: กองรถห้องเย็นควบคุมอุณหภูมิตลอด 24 ชม.', 'Temperature Monitoring: ระบบบันทึกและตรวจสอบอุณหภูมิแบบเรียลไทม์', 'On-Time Delivery: วางแผนรอบการจัดส่งตรงตามเวลานัดหมาย', 'Coverage: รองรับการจัดส่งครอบคลุมทั่วประเทศ'],
      img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">OUR CAPABILITIES · MASTER V2.0</div>
          <h1>บริการที่รองรับความต้องการของธุรกิจ</h1>
          <p className="lead">
            โครงสร้างบริการที่ครอบคลุมตั้งแต่การตัดแต่ง คลังสินค้า บรรจุภัณฑ์ จนถึงการกระจายสินค้าแบบควบคุมอุณหภูมิครบวงจร
          </p>
        </div>
      </section>

      <main className="section white">
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {capabilities.map((cap, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={cap.num}
                className="split"
                style={{
                  direction: isEven ? 'rtl' : 'ltr',
                  alignItems: 'center',
                }}
              >
                <div
                  className="photo"
                  style={{
                    backgroundImage: `url('${cap.img}')`,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    direction: 'ltr',
                  }}
                />
                <div style={{ direction: 'ltr' }}>
                  <div className="num">CAPABILITY {cap.num} · {cap.title}</div>
                  <h2 style={{ fontSize: '28px', marginTop: '6px' }}>{cap.headline}</h2>
                  <p style={{ lineHeight: 1.8, color: '#5e483b', marginBottom: '20px' }}>{cap.desc}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cap.options.map((opt) => (
                      <div key={opt} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#4a3328' }}>
                        <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>✓</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="actions" style={{ marginTop: '28px' }}>
                    <Link className="button" href="/rfq">
                      ขอใบเสนอราคาบริการนี้
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Partnership & Consultation Bar */}
      <section className="section beige">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <div className="eyebrow">Consultation & Planning</div>
          <h2>ให้คำปรึกษาและดูแลคู่ค้าอย่างใกล้ชิด</h2>
          <p className="lead" style={{ margin: '14px auto 28px' }}>
            ทีมผู้เชี่ยวชาญของดวงเจริญ อินเตอร์เทรด พร้อมประสานงานและร่วมพัฒนาสเปกสินค้าให้ตรงตามรูปแบบการดำเนินงานของธุรกิจคุณ
          </p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <Link className="button" href="/contact">
              ติดต่อฝ่ายขายและพัฒนาธุรกิจ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
