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
  hero_image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1800&q=85',
  oem_section_image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80',
  oem_title: 'สเปกที่ชัดเจน คือจุดเริ่มต้นของการทำงานที่ลื่นไหล',
  oem_description: 'Custom Cut, Slice, Dice, Mince, Vacuum และ OEM สำหรับร้านอาหาร ครัวกลาง และผู้ผลิตอาหารที่ต้องการความสม่ำเสมอในทุกล็อต',
};

export async function getContactSettings(): Promise<ContactSettings> {
  if (!isSupabaseConfigured()) {
    return defaultContactSettings;
  }

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
    // Supabase query error
  }

  return defaultContactSettings;
}

export async function saveContactSettings(settings: ContactSettings): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: '❌ ไม่สามารถบันทึกได้: ยังไม่ได้เชื่อมต่อ Cloud Database (Supabase) บน Vercel กรุณาตั้งค่า Supabase เพื่อให้ข้อมูลบันทึกขึ้นระบบกลางและซิงค์ทุกอุปกรณ์',
    };
  }

  try {
    const client = supabaseBrowser();
    const { error } = await client.from('site_settings').upsert({
      key: 'contact',
      value: settings,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, message: `❌ บันทึกล้มเหลว (Supabase error: ${error.message})` };
    }
    return { success: true, message: '✅ บันทึกข้อมูลขึ้น Cloud Database เรียบร้อยแล้ว (อัปเดตทุกอุปกรณ์ทันที)' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: `❌ เกิดข้อผิดพลาดในการเชื่อมต่อ: ${msg}` };
  }
}

export async function getCompanyProfile(): Promise<CompanyProfileSettings> {
  if (!isSupabaseConfigured()) {
    return defaultCompanyProfile;
  }

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
    // Supabase error
  }

  return defaultCompanyProfile;
}

export async function saveCompanyProfile(profile: CompanyProfileSettings): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: '❌ ไม่สามารถบันทึกได้: ยังไม่ได้เชื่อมต่อ Cloud Database (Supabase) บน Vercel กรุณาตั้งค่า Supabase เพื่อให้ข้อมูลบันทึกขึ้นระบบกลางและซิงค์ทุกอุปกรณ์',
    };
  }

  try {
    const client = supabaseBrowser();
    const { error } = await client.from('site_settings').upsert({
      key: 'company_profile',
      value: profile,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, message: `❌ บันทึกล้มเหลว (Supabase error: ${error.message})` };
    }
    return { success: true, message: '✅ บันทึกข้อมูลขึ้น Cloud Database เรียบร้อยแล้ว (อัปเดตทุกอุปกรณ์ทันที)' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, message: `❌ เกิดข้อผิดพลาดในการเชื่อมต่อ: ${msg}` };
  }
}
