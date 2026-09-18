'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContactSettings, defaultContactSettings, getContactSettings } from '@/lib/settings';
import { useLanguage } from '@/lib/language';

export default function Contact() {
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);
  const { lang, t } = useLanguage();

  useEffect(() => {
    async function load() {
      const data = await getContactSettings();
      setContact(data);
    }
    void load();
  }, []);

  const factoryImage = contact.image_url || '/about-factory-new.png';

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">
            {lang === 'en' ? 'CONTACT US · DOUNGCHALERN INTER TRADE' : 'ข้อมูลติดต่อ · บริษัท ดวงเจริญอินเตอร์เทรด จำกัด'}
          </div>
          <h1>{lang === 'en' ? 'Contact Us' : 'ติดต่อเรา'}</h1>
          <p className="lead">
            {lang === 'en'
              ? 'Inquire about products, custom cutting specifications, and cold chain services. Our B2B specialists are ready to assist your business.'
              : 'สอบถามสินค้า บริการตัดแต่งตามสเปก และระบบขนส่งควบคุมอุณหภูมิสำหรับธุรกิจ ติดต่อทีมงานดวงเจริญอินเตอร์เทรดได้โดยตรง'}
          </p>
        </div>
      </section>

      <main className="wrap section split">
        <div className="card" style={{ padding: '36px' }}>
          <div className="eyebrow">Sales & Business Inquiry</div>
          <h2 style={{ fontSize: '26px', marginTop: '4px' }}>
            {lang === 'en' ? 'Official Business Contact' : 'ข้อมูลติดต่อฝ่ายขายและสำนักงาน'}
          </h2>

          <div className="spec-box">
            <div className="spec">
              <span>{lang === 'en' ? 'Company Name (TH)' : 'ชื่อบริษัท (ไทย)'}</span>
              <b>{contact.company_name_th || 'บริษัท ดวงเจริญอินเตอร์เทรด จำกัด'}</b>
            </div>
            <div className="spec">
              <span>{lang === 'en' ? 'Company Name (EN)' : 'ชื่อบริษัท (อังกฤษ)'}</span>
              <b>{contact.company_name_en || 'DOUNGCHALERN INTER TRADE CO., LTD.'}</b>
            </div>
            {contact.registration_no && (
              <div className="spec">
                <span>{lang === 'en' ? 'Registration No.' : 'เลขทะเบียนนิติบุคคล'}</span>
                <b style={{ color: 'var(--red)', fontWeight: 700 }}>
                  {contact.registration_no}
                </b>
              </div>
            )}
            <div className="spec">
              <span>{lang === 'en' ? 'Headquarters / Address' : 'ที่อยู่สำนักงาน'}</span>
              <b>{contact.address || '49/203 หมู่ที่ 7 ตำบลคลองสอง อำเภอคลองหลวง จ. ปทุมธานี 12120'}</b>
            </div>
            <div className="spec">
              <span>{lang === 'en' ? 'Sales Hotline' : 'เบอร์โทรศัพท์'}</span>
              <b>
                <a href={`tel:${contact.phone || '0825161718'}`} style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {contact.phone || '082-516-1718'}
                </a>
              </b>
            </div>
            <div className="spec">
              <span>{lang === 'en' ? 'Email' : 'อีเมล'}</span>
              <b>
                <a href={`mailto:${contact.email || 'doungchalern.dct@gmail.com'}`} style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {contact.email || 'doungchalern.dct@gmail.com'}
                </a>
              </b>
            </div>
            <div className="spec">
              <span>{lang === 'en' ? 'Official Website' : 'เว็บไซต์'}</span>
              <b>
                <a
                  href={`https://${contact.website || 'www.dcintertrade.com'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--red)', textDecoration: 'none' }}
                >
                  {contact.website || 'www.dcintertrade.com'}
                </a>
              </b>
            </div>
            {contact.line_id && (
              <div className="spec">
                <span>LINE Official</span>
                <b>
                  {contact.line_id.startsWith('http') ? (
                    <a href={contact.line_id} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 700 }}>
                      เพิ่มเพื่อน LINE ({contact.line_id})
                    </a>
                  ) : (
                    <span>{contact.line_id}</span>
                  )}
                </b>
              </div>
            )}
            {contact.business_hours && (
              <div className="spec">
                <span>{lang === 'en' ? 'Business Hours' : 'เวลาทำการ'}</span>
                <b>{contact.business_hours}</b>
              </div>
            )}
          </div>

          <div className="actions" style={{ marginTop: '28px' }}>
            <Link className="button" href="/rfq">
              {lang === 'en' ? '📑 Request a B2B Quote' : '📑 ขอใบเสนอราคาออนไลน์'}
            </Link>
            {contact.google_maps_url && (
              <a
                className="button alt"
                href={contact.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang === 'en' ? '🗺️ Google Maps' : '🗺️ ดูแผนที่โรงงาน / สำนักงาน'}
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
