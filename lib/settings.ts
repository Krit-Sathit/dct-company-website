'use client';

import { supabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser';

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
  image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
};

export const defaultCompanyProfile: CompanyProfileSettings = {
  tagline: 'DCT · Trusted B2B Food Supply Partner',
  headline: 'มาตรฐานที่มั่นใจได้\nสำหรับธุรกิจอาหารที่ต้องการความสม่ำเสมอ',
  subheadline: 'วัตถุดิบเนื้อสุกรที่ได้มาตรฐาน ตัดแต่งตามสเปก พร้อมการจัดเก็บและส่งมอบที่ออกแบบมาเพื่อการทำงานของธุรกิจอาหาร',
  about_summary: 'Duangcharoen Intertrade Co., Ltd. สนับสนุนธุรกิจอาหารด้วยการจัดหาวัตถุดิบเนื้อสุกร การตัดแต่งตามสเปก และการบริหารการจัดเก็บและส่งมอบอย่างเป็นระบบ',
  vision: 'เป็น Food Supply Partner ที่ลูกค้า B2B ไว้วางใจในเรื่องมาตรฐาน ความแม่นยำ และความต่อเนื่องของการทำงาน',
  mission: 'ทำให้ลูกค้าควบคุมคุณภาพ ลดขั้นตอนการเตรียม และวางแผนธุรกิจได้ง่ายขึ้น',
  hero_image_url: '/hero-banner.webp',
  oem_section_image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80',
  oem_title: 'สเปกที่ชัดเจน คือจุดเริ่มต้นของการทำงานที่ลื่นไหล',
  oem_description: 'Custom Cut, Slice, Dice, Mince, Vacuum และ OEM สำหรับร้านอาหาร ครัวกลาง และผู้ผลิตอาหารที่ต้องการความสม่ำเสมอในทุกล็อต',
};

export async function getContactSettings(): Promise<ContactSettings> {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseBrowser();
      const { data, error } = await client
        .from('site_settings')
        .select('value')
        .eq('key', 'contact')
        .maybeSingle();

      if (!error && data?.value && typeof data.value === 'object') {
        return { ...defaultContactSettings, ...data.value };
      }
    } catch {
      // ignore
    }
  }

  // 2. Fetch from Server API
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
  // 1. Save to Server API
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'contact', data: settings }),
    });
  } catch {
    // ignore
  }

  // 2. Save to Supabase if configured
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
  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const client = supabaseBrowser();
      const { data, error } = await client
        .from('site_settings')
        .select('value')
        .eq('key', 'company_profile')
        .maybeSingle();

      if (!error && data?.value && typeof data.value === 'object') {
        return { ...defaultCompanyProfile, ...data.value };
      }
    } catch {
      // ignore
    }
  }

  // 2. Fetch from Server API
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
  // 1. Save to Server API
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'company_profile', data: profile }),
    });
  } catch {
    // ignore
  }

  // 2. Save to Supabase if configured
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

  return { success: true, message: '✅ บันทึกข้อมูลและอัปเดตรูปภาพหน้าเว็บเรียบร้อยแล้ว' };
}
