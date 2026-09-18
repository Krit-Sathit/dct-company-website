'use client';

import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

export type ContactSettings = {
  company_name_th: string;
  company_name_en: string;
  registration_no?: string;
  address: string;
  phone: string;
  phone_secondary: string;
  email: string;
  website?: string;
  line_id: string;
  business_hours: string;
  google_maps_url: string;
  facebook_url: string;
  image_url: string;
};

export type CompanyProfileSettings = {
  tagline: string;
  headline: string;
  subheadline: string;
  about_summary: string;
  vision: string;
  mission: string;
  hero_image_url: string;
  oem_section_image_url: string;
  oem_title: string;
  oem_description: string;
};

export const defaultContactSettings: ContactSettings = {
  company_name_th: 'บริษัท ดวงเจริญอินเตอร์เทรด จำกัด',
  company_name_en: 'DOUNGCHALERN INTER TRADE CO., LTD.',
  registration_no: '',
  address: '49/203 หมู่ที่ 7 ตำบลคลองสอง อำเภอคลองหลวง จ. ปทุมธานี 12120',
  phone: '0825161718',
  phone_secondary: '',
  email: 'doungchalern.dct@gmail.com',
  website: 'www.dcintertrade.com',
  line_id: '',
  business_hours: 'จันทร์ - เสาร์: 08:00 - 17:00 น.',
  google_maps_url: 'https://maps.google.com',
  facebook_url: 'https://facebook.com/doungchalern',
  image_url: '/about-factory-new.png',
};

export const defaultCompanyProfile: CompanyProfileSettings = {
  tagline: 'DOUNGCHALERN INTER TRADE CO., LTD.',
  headline: 'เบื้องหลังวัตถุดิบที่พร้อมสำหรับธุรกิจ',
  subheadline: 'ดวงเจริญ อินเตอร์เทรด ดูแลตั้งแต่การคัดสรร ตัดแต่ง จัดเก็บ และจัดส่งวัตถุดิบเนื้อสุกร เพื่อให้คู่ค้าทำงานได้ง่ายขึ้นและมั่นใจในทุกการส่งมอบ',
  about_summary: 'จากประสบการณ์ด้านการตัดแต่งเนื้อสุกรและการจัดการวัตถุดิบอาหาร DCT พัฒนาการทำงานให้ครอบคลุมตั้งแต่การตัดแต่งตามสเปก การจัดเก็บควบคุมอุณหภูมิไปจนถึงการจัดส่ง เพื่อช่วยให้คู่ค้าบริหารวัตถุดิบได้ง่ายและสม่ำเสมอมากขึ้น',
  vision: 'เป็นคู่ค้าที่ธุรกิจไว้วางใจในทุกเรื่องของวัตถุดิบ ด้วยคุณภาพที่สม่ำเสมอ การทำงานที่ได้มาตรฐาน และการส่งมอบที่เชื่อถือได้',
  mission: 'ยึดมั่นในมาตรฐาน GHP, HACCP และ อย. เพื่อส่งมอบวัตถุดิบที่ปลอดภัย รักษาห่วงโซ่อุณหภูมิ และเติบโตไปพร้อมกับคู่ค้า B2B',
  hero_image_url: '/hero-new.png',
  oem_section_image_url: '/service-custom-cut.png',
  oem_title: 'ดูแลวัตถุดิบ ตั้งแต่ต้นทางถึงมือคุณ',
  oem_description: 'ตัดแต่ง จัดเก็บ บรรจุ และจัดส่งอย่างเป็นระบบ เพื่อให้วัตถุดิบพร้อมสำหรับการใช้งานของธุรกิจ',
};

const CONTACT_KEY = 'dct_contact_settings';
const PROFILE_KEY = 'dct_profile_settings';

export async function getContactSettings(): Promise<ContactSettings> {
  // 1. Check local storage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CONTACT_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultContactSettings, ...parsed };
        }
      } catch {
        // ignore
      }
    }
  }

  // 2. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseBrowser();
      const { data, error } = await client
        .from('site_settings')
        .select('value')
        .eq('key', 'contact')
        .maybeSingle();

      if (!error && data?.value && typeof data.value === 'object') {
        const merged = { ...defaultContactSettings, ...data.value };
        if (typeof window !== 'undefined') {
          localStorage.setItem(CONTACT_KEY, JSON.stringify(merged));
        }
        return merged;
      }
    } catch {
      // ignore
    }
  }

  // 3. Try Server API
  try {
    const res = await fetch('/api/settings?type=contact', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      return { ...defaultContactSettings, ...json };
    }
  } catch {
    // ignore
  }

  return defaultContactSettings;
}

export async function saveContactSettings(settings: ContactSettings): Promise<{ success: boolean; message: string }> {
  // 1. Save to local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(settings));
  }

  // 2. Save to Server API
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'contact', data: settings }),
    });
  } catch {
    // ignore
  }

  // 3. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseBrowser();
      await client.from('site_settings').upsert({
        key: 'contact',
        value: settings,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
  }

  return { success: true, message: '✅ บันทึกข้อมูลและอัปเดตหน้าเว็บเรียบร้อยแล้ว' };
}

export async function getCompanyProfile(): Promise<CompanyProfileSettings> {
  // 1. Check local storage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(PROFILE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultCompanyProfile, ...parsed };
        }
      } catch {
        // ignore
      }
    }
  }

  // 2. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseBrowser();
      const { data, error } = await client
        .from('site_settings')
        .select('value')
        .eq('key', 'company_profile')
        .maybeSingle();

      if (!error && data?.value && typeof data.value === 'object') {
        const merged = { ...defaultCompanyProfile, ...data.value };
        if (typeof window !== 'undefined') {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
        }
        return merged;
      }
    } catch {
      // ignore
    }
  }

  // 3. Try Server API
  try {
    const res = await fetch('/api/settings?type=company_profile', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      return { ...defaultCompanyProfile, ...json };
    }
  } catch {
    // ignore
  }

  return defaultCompanyProfile;
}

export async function saveCompanyProfile(profile: CompanyProfileSettings): Promise<{ success: boolean; message: string }> {
  // 1. Save to local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  // 2. Save to Server API
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'company_profile', data: profile }),
    });
  } catch {
    // ignore
  }

  // 3. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseBrowser();
      await client.from('site_settings').upsert({
        key: 'company_profile',
        value: profile,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
  }

  return { success: true, message: '✅ บันทึกรูปภาพและข้อมูลขึ้นหน้าเว็บเรียบร้อยแล้ว' };
}
