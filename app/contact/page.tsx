'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContactSettings, defaultContactSettings, getContactSettings } from '@/lib/settings';

export default function Contact() {
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getContactSettings();
      setContact(data);
      setLoading(false);
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
          <div className="eyebrow">Contact DCT</div>
          <h1>เริ่มต้นพูดคุยกับทีมของเรา</h1>
          <p className="lead">
            ยินดีให้คำปรึกษาเรื่องการจัดหาวัตถุดิบเนื้อสุกร การตัดแต่งตามสเปกเฉพาะ และบริการ OEM สำหรับธุรกิจอาหารทุกประเภท
          </p>
        </div>
      </section>

      <main className="wrap section split">
        <div className="card">
          <h2>ข้อมูลติดต่อ</h2>
          <div className="spec">
            <span>บริษัท</span>
            <b>{contact.company_name_th || contact.company_name_en}</b>
          </div>
          <div className="spec">
            <span>ที่อยู่</span>
            <b>{contact.address}</b>
          </div>
          <div className="spec">
            <span>โทรศัพท์</span>
            <b>
              <a href={`tel:${contact.phone}`} style={{ color: 'var(--red)' }}>
                {contact.phone}
              </a>
              {contact.phone_secondary && (
                <>
                  {' · '}
                  <a href={`tel:${contact.phone_secondary}`} style={{ color: 'var(--red)' }}>
                    {contact.phone_secondary}
                  </a>
                </>
              )}
            </b>
          </div>
          <div className="spec">
            <span>อีเมล</span>
            <b>
              <a href={`mailto:${contact.email}`} style={{ color: 'var(--red)' }}>
                {contact.email}
              </a>
            </b>
          </div>
          <div className="spec">
            <span>LINE Official</span>
            <b>
              {contact.line_id ? (
                contact.line_id.startsWith('http') ? (
                  <a href={contact.line_id} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>
                    เพิ่มเพื่อน LINE
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

          <div className="actions" style={{ marginTop: '24px' }}>
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
                🗺️ ดูแผนที่ Google Maps
              </a>
            )}
          </div>
        </div>

        <div
          className="photo"
          style={{
            backgroundImage: `url('${factoryImage}')`,
          }}
        />
      </main>
    </>
  );
}
