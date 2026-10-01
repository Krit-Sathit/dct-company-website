'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ContactSettings,
  CompanyProfileSettings,
  defaultContactSettings,
  defaultCompanyProfile,
  getContactSettings,
  getCompanyProfile,
  saveContactSettings,
  saveCompanyProfile,
} from '@/lib/settings';
import { ImageUploader } from '@/components/image-uploader';

export function CmsSettings() {
  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'profile'>('contact');
  const [contact, setContact] = useState<ContactSettings>(defaultContactSettings);
  const [profile, setProfile] = useState<CompanyProfileSettings>(defaultCompanyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cData, pData] = await Promise.all([getContactSettings(), getCompanyProfile()]);
      setContact(cData);
      setProfile(pData);
      setLoading(false);
    }
    void loadData();
  }, []);

  function handleContactChange(field: keyof ContactSettings, value: string) {
    setContact((prev) => ({ ...prev, [field]: value }));
  }

  function handleProfileChange(field: keyof CompanyProfileSettings, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let res;
    if (activeSubTab === 'contact') {
      res = await saveContactSettings(contact);
    } else {
      res = await saveCompanyProfile(profile);
    }

    setSaving(false);
    setMessage({
      text: res.message,
      type: res.success ? 'success' : 'error',
    });
  }

  function handleReset() {
    if (!window.confirm('คุณต้องการคืนค่ากลับเป็นค่าเริ่มต้นใช่หรือไม่?')) return;
    if (activeSubTab === 'contact') {
      setContact(defaultContactSettings);
    } else {
      setProfile(defaultCompanyProfile);
    }
    setMessage({ text: 'คืนค่าข้อมูลเป็นค่าเริ่มต้นแล้ว (กรุณากดบันทึกเพื่อนำไปใช้)', type: 'info' });
  }

  if (loading) {
    return <section className="card"><p className="lead">กำลังโหลดข้อมูลการตั้งค่า…</p></section>;
  }

  return (
    <section className="card cms-settings-box">
      <div className="cms-settings-header">
        <div>
          <h2>ตั้งค่าเว็บไซต์และข้อมูลติดต่อ</h2>
          <p className="small">จัดการข้อมูลติดต่อ เบอร์โทรศัพท์ ที่อยู่ รูปภาพหน้าแรก/โรงงาน และข้อความหลักของเว็บไซต์</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a href="/contact" target="_blank" rel="noopener noreferrer" className="button secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
            👁️ ดูหน้าติดต่อเรา
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer" className="button secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
            👁️ ดูหน้าแรก
          </a>
        </div>
      </div>

      <div className="settings-subtabs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', borderBottom: '1px solid #eadfd4', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`button ${activeSubTab === 'contact' ? '' : 'secondary'}`}
            onClick={() => { setActiveSubTab('contact'); setMessage(null); }}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            📍 ข้อมูลติดต่อ & รูปภาพโรงงาน
          </button>
          <button
            type="button"
            className={`button ${activeSubTab === 'profile' ? '' : 'secondary'}`}
            onClick={() => { setActiveSubTab('profile'); setMessage(null); }}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            🏷️ ข้อมูลแบรนด์ & รูปภาพหน้าแรก
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => handleSave(e as any)}
          disabled={saving}
          className="button"
          style={{ padding: '8px 20px', fontSize: '14px', background: 'var(--red)', color: '#fff' }}
        >
          {saving ? '⏳ กำลังบันทึก…' : '💾 บันทึกข้อมูลทันที'}
        </button>
      </div>

      {message && (
        <div className={`notice ${message.type === 'error' ? 'notice-error' : message.type === 'success' ? 'notice-success' : ''}`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        {activeSubTab === 'contact' ? (
          <div className="settings-grid">
            <div className="settings-col">
              <label className="login-label">
                ชื่อบริษัท (ภาษาไทย) *
                <input
                  className="field"
                  value={contact.company_name_th}
                  onChange={(e) => handleContactChange('company_name_th', e.target.value)}
                  required
                  placeholder="เช่น บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด"
                />
              </label>

              <label className="login-label">
                ชื่อบริษัท (ภาษาอังกฤษ)
                <input
                  className="field"
                  value={contact.company_name_en}
                  onChange={(e) => handleContactChange('company_name_en', e.target.value)}
                  placeholder="เช่น Duangcharoen Intertrade Co., Ltd."
                />
              </label>

              <label className="login-label">
                เบอร์โทรศัพท์หลัก *
                <input
                  className="field"
                  value={contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  required
                  placeholder="เช่น 02-123-4567"
                />
              </label>

              <label className="login-label">
                เบอร์โทรศัพท์มือถือ / สายด่วน
                <input
                  className="field"
                  value={contact.phone_secondary}
                  onChange={(e) => handleContactChange('phone_secondary', e.target.value)}
                  placeholder="เช่น 089-999-8888"
                />
              </label>

              <label className="login-label">
                อีเมลติดต่อหลัก *
                <input
                  className="field"
                  type="email"
                  value={contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  required
                  placeholder="เช่น sales@dcintertrade.com"
                />
              </label>

              <label className="login-label">
                อีเมลรับสำเนาแจ้งเตือนเพิ่มเติม (CC)
                <input
                  className="field"
                  value={contact.email_cc || ''}
                  onChange={(e) => handleContactChange('email_cc', e.target.value)}
                  placeholder="เช่น admin@dcintertrade.com, manager@gmail.com (คั่นด้วยจุลภาค)"
                />
                <span style={{ fontSize: '12px', color: '#7a6557', marginTop: '4px', display: 'block', fontWeight: 'normal' }}>
                  💡 ใส่อีเมลที่ต้องการให้ได้รับสำเนาคำขอราคา (ใส่ได้หลายอีเมล โดยคั่นด้วยเครื่องหมายจุลภาค <code>,</code>)
                </span>
              </label>

              <label className="login-label">
                LINE ID / LINE Official
                <input
                  className="field"
                  value={contact.line_id}
                  onChange={(e) => handleContactChange('line_id', e.target.value)}
                  placeholder="เช่น @dctfood หรือ https://line.me/ti/p/..."
                />
              </label>

              <div style={{ marginTop: '16px', padding: '14px', background: '#faf4ec', borderRadius: '6px', border: '1px solid #ebd8c6' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#8B1E1E', marginBottom: '8px' }}>
                  🔑 ตั้งค่าระบบส่งอีเมลอัตโนมัติ (Resend API)
                </div>
                <label className="login-label" style={{ marginBottom: '10px' }}>
                  Resend API Key
                  <input
                    className="field"
                    type="password"
                    value={contact.resend_api_key || ''}
                    onChange={(e) => handleContactChange('resend_api_key', e.target.value)}
                    placeholder="เช่น re_123456789..."
                  />
                  <span style={{ fontSize: '11.5px', color: '#7a6557', marginTop: '3px', display: 'block', fontWeight: 'normal' }}>
                    สร้างได้จากเมนู API keys ใน Resend (นำคีย์ <code>re_...</code> มาใส่ที่นี่เพื่อเปิดใช้ระบบส่งอีเมลทันที)
                  </span>
                </label>

                <label className="login-label" style={{ marginBottom: 0 }}>
                  อีเมลผู้ส่ง (Sender Email / From)
                  <input
                    className="field"
                    value={contact.email_from || ''}
                    onChange={(e) => handleContactChange('email_from', e.target.value)}
                    placeholder="เช่น onboarding@resend.dev หรือ DCT <sales@dcintertrade.com>"
                  />
                  <span style={{ fontSize: '11.5px', color: '#7a6557', marginTop: '3px', display: 'block', fontWeight: 'normal' }}>
                    หากยังไม่ได้ผูกโดเมนใน Resend ให้ใช้ <code>onboarding@resend.dev</code> (ส่งเข้าอีเมลบัญชีเจ้าของ Resend ได้ทันที)
                  </span>
                </label>
              </div>
            </div>

            <div className="settings-col">
              <ImageUploader
                label="🖼️ รูปภาพโรงงาน / สำนักงาน (แสดงในหน้าติดต่อเรา)"
                value={contact.image_url || ''}
                onChange={(url) => handleContactChange('image_url', url)}
                folder="factory"
                helperText="คลิกเลือกไฟล์รูปโรงงานจริงจากเครื่องของคุณ หรือลากไฟล์มาวางได้เลย"
              />

              <label className="login-label">
                เวลาทำการ
                <input
                  className="field"
                  value={contact.business_hours}
                  onChange={(e) => handleContactChange('business_hours', e.target.value)}
                  placeholder="เช่น จันทร์ - เสาร์: 08:00 - 17:00 น."
                />
              </label>

              <label className="login-label">
                ลิงก์ Google Maps / พิกัดสถานที่
                <input
                  className="field"
                  value={contact.google_maps_url}
                  onChange={(e) => handleContactChange('google_maps_url', e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </label>

              <label className="login-label">
                ที่อยู่สำนักงาน / โรงงาน *
                <textarea
                  className="field"
                  rows={3}
                  value={contact.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  required
                  placeholder="ระบุที่อยู่เต็ม เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="settings-grid">
            <div className="settings-col">
              <label className="login-label">
                สโลแกน / Tagline (แสดงบนแถบ Header / Hero)
                <input
                  className="field"
                  value={profile.tagline}
                  onChange={(e) => handleProfileChange('tagline', e.target.value)}
                  placeholder="เช่น DCT · Trusted B2B Food Supply Partner"
                />
              </label>

              <label className="login-label">
                หัวข้อหลักหน้าแรก (Hero Headline)
                <textarea
                  className="field"
                  rows={2}
                  value={profile.headline}
                  onChange={(e) => handleProfileChange('headline', e.target.value)}
                  placeholder="เช่น มาตรฐานที่มั่นใจได้ สำหรับธุรกิจอาหารที่ต้องการความสม่ำเสมอ"
                />
              </label>

              <label className="login-label">
                คำบรรยายหน้าแรก (Hero Subheadline)
                <textarea
                  className="field"
                  rows={3}
                  value={profile.subheadline}
                  onChange={(e) => handleProfileChange('subheadline', e.target.value)}
                  placeholder="เช่น วัตถุดิบเนื้อสุกรที่ได้มาตรฐาน ตัดแต่งตามสเปก..."
                />
              </label>

              <ImageUploader
                label="🌅 รูปภาพพื้นหลัง Hero Banner (หน้าแรก)"
                value={profile.hero_image_url || ''}
                onChange={(url) => handleProfileChange('hero_image_url', url)}
                folder="homepage"
                helperText="รูปภาพพื้นหลังส่วนหัวของหน้าแรก (ระบบจะปรับขนาดและแปลงเป็น WebP ให้อัตโนมัติ)"
              />
            </div>

            <div className="settings-col">
              <ImageUploader
                label="🥩 รูปภาพส่วนบริการของเรา (หน้าแรก)"
                value={profile.oem_section_image_url || ''}
                onChange={(url) => handleProfileChange('oem_section_image_url', url)}
                folder="homepage"
                helperText="รูปภาพประกอบส่วนบริการของเรา ที่แสดงอยู่ตรงกลางหน้าแรก"
              />

              <label className="login-label">
                หัวข้อส่วนบริการของเรา
                <input
                  className="field"
                  value={profile.oem_title}
                  onChange={(e) => handleProfileChange('oem_title', e.target.value)}
                  placeholder="เช่น บริการที่รองรับความต้องการของธุรกิจ"
                />
              </label>

              <label className="login-label">
                คำบรรยายส่วนบริการของเรา
                <textarea
                  className="field"
                  rows={3}
                  value={profile.oem_description}
                  onChange={(e) => handleProfileChange('oem_description', e.target.value)}
                  placeholder="เช่น Custom Cutting, Cold Storage, Packaging และ Cold Chain Logistics ครบวงจร..."
                />
              </label>

              <label className="login-label">
                ภาพรวมบริษัท / ข้อมูลสั้น (About Summary)
                <textarea
                  className="field"
                  rows={3}
                  value={profile.about_summary}
                  onChange={(e) => handleProfileChange('about_summary', e.target.value)}
                  placeholder="ประวัติหรือภาพรวมบริษัทสั้นๆ สำหรับแสดงบนหน้าเว็บและส่วนท้าย"
                />
              </label>
            </div>
          </div>
        )}

        <div className="actions" style={{ marginTop: '28px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="submit" className="button" disabled={saving} style={{ minWidth: '150px' }}>
            {saving ? '⏳ กำลังบันทึก…' : '💾 บันทึกข้อมูล'}
          </button>
          <button type="button" className="button secondary" onClick={handleReset}>
            🔄 คืนค่าเริ่มต้น
          </button>
        </div>
      </form>
    </section>
  );
}
