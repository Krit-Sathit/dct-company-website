'use client';

import { supabaseBrowser } from '@/lib/supabase-browser';

export type ContactSettings = {
  company_name_th: string;
  company_name_en: string;
  address: string;
  phone: string;
  phone_secondary: string;
  email: string;
  line_id: string;
  business_hours: string;
  google_maps_url: string;
  facebook_url: string;
};

export type CompanyProfileSettings = {
  tagline: string;
  headline: string;
  subheadline: string;
  about_summary: string;
  vision: string;
  mission: string;
};

export const defaultContactSettings: ContactSettings = {
  company_name_th: 'บริษัท ดวงเจริญ อินเตอร์เทรด จำกัด',
  company_name_en: 'Duangcharoen Intertrade Co., Ltd.',
  address: 'เลขที่ 88/8 หมู่ที่ 5 ตำบลบางบัวทอง อำเภอบางบัวทอง จังหวัดนนทบุรี 11110',
  phone: '02-123-4567',
  phone_secondary: '089-999-8888',
  email: 'sales@duangcharoen.com',
  line_id: '@dctfood',
  business_hours: 'จันทร์ - เสาร์: 08:00 - 17:00 น.',
  google_maps_url: 'https://maps.google.com',
  facebook_url: 'https://facebook.com/duangcharoen',
};

export const defaultCompanyProfile: CompanyProfileSettings = {
  tagline: 'DCT · Trusted B2B Food Supply Partner',
  headline: 'มาตรฐานที่มั่นใจได้ สำหรับธุรกิจอาหารที่ต้องการความสม่ำเสมอ',
  subheadline: 'วัตถุดิบเนื้อสุกรที่ได้มาตรฐาน ตัดแต่งตามสเปก พร้อมการจัดเก็บและส่งมอบที่ออกแบบมาเพื่อการทำงานของธุรกิจอาหาร',
  about_summary: 'Duangcharoen Intertrade Co., Ltd. สนับสนุนธุรกิจอาหารด้วยการจัดหาวัตถุดิบเนื้อสุกร การตัดแต่งตามสเปก และการบริหารการจัดเก็บและส่งมอบอย่างเป็นระบบ',
  vision: 'เป็น Food Supply Partner ที่ลูกค้า B2B ไว้วางใจในเรื่องมาตรฐาน ความแม่นยำ และความต่อเนื่องของการทำงาน',
  mission: 'ทำให้ลูกค้าควบคุมคุณภาพ ลดขั้นตอนการเตรียม และวางแผนธุรกิจได้ง่ายขึ้น',
};

const CONTACT_STORAGE_KEY = 'dct_contact_settings';
const PROFILE_STORAGE_KEY = 'dct_profile_settings';

export async function getContactSettings(): Promise<ContactSettings> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultContactSettings, ...parsed };
        }
      } catch {
        // ignore parse error
      }
    }
  }

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
        localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch {
    // Supabase might not be configured or reachable
  }

  return defaultContactSettings;
}

export async function saveContactSettings(settings: ContactSettings): Promise<{ success: boolean; message: string }> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(settings));
  }

  try {
    const client = supabaseBrowser();
    const { error } = await client.from('site_settings').upsert({
      key: 'contact',
      value: settings,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, message: `บันทึกในเครื่องแล้ว (Supabase: ${error.message})` };
    }
    return { success: true, message: 'บันทึกข้อมูลติดต่อเรียบร้อยแล้ว' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: true, message: `บันทึกในเครื่องแล้ว (${msg})` };
  }
}

export async function getCompanyProfile(): Promise<CompanyProfileSettings> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(PROFILE_STORAGE_KEY);
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
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch {
    // Supabase error
  }

  return defaultCompanyProfile;
}

export async function saveCompanyProfile(profile: CompanyProfileSettings): Promise<{ success: boolean; message: string }> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }

  try {
    const client = supabaseBrowser();
    const { error } = await client.from('site_settings').upsert({
      key: 'company_profile',
      value: profile,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, message: `บันทึกในเครื่องแล้ว (Supabase: ${error.message})` };
    }
    return { success: true, message: 'บันทึกข้อมูลเว็บไซต์เรียบร้อยแล้ว' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: true, message: `บันทึกในเครื่องแล้ว (${msg})` };
  }
}
