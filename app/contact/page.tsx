'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContactSettings, defaultContactSettings, getContactSettings } from '@/lib/settings';

export default function Contact() {
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    async function load() {
      const data = await getContactSettings();
      setContact(data);
    }
    void load();
  }, []);

  const factoryImage =
    contact.image_url ||
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80';

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">CONTACT DUANGCHAROEN · MASTER V2.0</div>
          <h1>ติดต่อเรา</h1>
          <p className="lead">
            สอบถามสินค้า บริการ และความต้องการด้านวัตถุดิบสำหรับธุรกิจ ติดต่อทีมงานดวงเจริญ อินเตอร์เทรดได้โดยตรง
          </p>
        </div>
      </section>

      <main className="wrap section split">
        <div className="card" style={{ padding: '36px' }}>
          <div className="eyebrow">Sales & Business Inquiry</div>
          <h2 style={{ fontSize: '26px', marginTop: '4px' }}>ข้อมูลติดต่อฝ่ายขาย</h2>
          
          <div className="spec-box">
            <div className="spec">
              <span>ชื่อบริษัท</span>
              <b>{contact.company_name_th}</b>
            </div>
            <div className="spec">
              <span>ที่อยู่สำนักงาน</span>
              <b>{contact.address}</b>
            </div>
            <div className="spec">
              <span>โทรศัพท์ฝ่ายขาย</span>
              <b>
                <a href={`tel:${contact.phone}`} style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {contact.phone}
                </a>
                {contact.phone_secondary && (
                  <>
                    {' · '}
                    <a href={`tel:${contact.phone_secondary}`} style={{ color: 'var(--red)', textDecoration: 'none' }}>
                      {contact.phone_secondary}
                    </a>
                  </>
                )}
              </b>
            </div>
            <div className="spec">
              <span>อีเมล</span>
              <b>
                <a href={`mailto:${contact.email}`} style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {contact.email}
                </a>
              </b>
            </div>
            <div className="spec">
              <span>LINE Official</span>
              <b>
                {contact.line_id ? (
                  contact.line_id.startsWith('http') ? (
                    <a href={contact.line_id} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 700 }}>
                      เพิ่มเพื่อน LINE (@dctfood)
                    </a>
                  ) : (
                    <span>{contact.line_id}</span>
                  )
                ) : (
                  '-'
                )}
              </b>
            </div>
            {contact.business_hours && (
              <div className="spec">
                <span>เวลาทำการ</span>
                <b>{contact.business_hours}</b>
              </div>
            )}
          </div>

          <div className="actions" style={{ marginTop: '28px' }}>
            <Link className="button" href="/rfq">
              📑 ขอใบเสนอราคาออนไลน์
            </Link>
            {contact.google_maps_url && (
              <a
                className="button alt"
                href={contact.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ ดูแผนที่โรงงาน / สำนักงาน
              </a>
            )}
          </div>
        </div>

        <div
          className="photo"
          style={{
            backgroundImage: `url('${factoryImage}')`,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          }}
        />
      </main>
    </>
  );
}
