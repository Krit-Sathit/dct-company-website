import { NextRequest, NextResponse } from 'next/server';
import { products as defaultProducts } from '@/lib/data';
import { getSupabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback for initial render / offline fallback
const cmsStore: Record<string, any[]> = {
  products: defaultProducts.map((p) => ({
    id: p.id,
    name: p.name,
    name_en: p.nameEn,
    slug: p.id,
    sku: p.code,
    category_id: p.category,
    product_type: p.type,
    cut_part: p.cutPart || p.name,
    cutting_options: p.cut,
    portion_thickness: p.thickness,
    meat_fat_ratio: p.meatFatRatio,
    packing: p.pack,
    storage: p.storage,
    shelf_life: p.shelfLife,
    moq: p.moq,
    recommended_use: p.use,
    description: p.description,
    image_url: p.image,
    active: true,
  })),
  categories: [
    { id: 'cat-1', name: 'เนื้อหมูตัดแต่ง', slug: 'trimmed-pork', description: 'เนื้อหมูตัดแต่ง สำหรับธุรกิจอาหาร', sort_order: 1, active: true },
    { id: 'cat-2', name: 'ชิ้นส่วนพรีเมียม', slug: 'premium-cuts', description: 'ชิ้นส่วนพรีเมียม สำหรับธุรกิจอาหาร', sort_order: 2, active: true },
    { id: 'cat-3', name: 'สินค้าตามสเปก', slug: 'custom-spec', description: 'สินค้าตามสเปก สำหรับธุรกิจอาหาร', sort_order: 3, active: true },
  ],
  services: [
    { id: 'srv-1', title: 'Custom Cutting', slug: 'custom-cutting', description: 'บริการตัดแต่งเนื้อสุกรตามสเปก Slice, Dice, Mince, และ Portion Cut', image_url: '/service-custom-cut.png', active: true },
    { id: 'srv-2', title: 'Packaging Solutions', slug: 'packaging', description: 'บริการบรรจุภัณฑ์สุญญากาศ (Vacuum) และ Bulk Packaging', image_url: '/service-packaging.png', active: true },
    { id: 'srv-3', title: 'Cold Storage', slug: 'cold-storage', description: 'บริการคลังสินค้าควบคุมอุณหภูมิ Chilled (0-4°C) และ Frozen (-18°C)', image_url: '/service-cold-storage.png', active: true },
    { id: 'srv-4', title: 'Cold Chain Logistics', slug: 'cold-chain-logistics', description: 'บริการขนส่งกระจายสินค้าด้วยรถควบคุมอุณหภูมิตลอดเส้นทาง', image_url: '/service-delivery.png', active: true },
  ],
  certificates: [
    { id: 'cert-1', name: 'GHP Certified', description: 'มาตรฐานสุขลักษณะที่ดีในกระบวนการผลิตอาหาร', issued_date: '2024-01-01', expiry_date: '2027-01-01', active: true },
    { id: 'cert-2', name: 'HACCP Standard', description: 'มาตรฐานวิเคราะห์อันตรายและควบคุมจุดวิกฤต', issued_date: '2024-01-01', expiry_date: '2027-01-01', active: true },
    { id: 'cert-3', name: 'อย. และ ปศุสัตว์ OK', description: 'มาตรฐานรับรองสถานที่จำหน่ายและตัดแต่งเนื้อสัตว์ กรมปศุสัตว์', issued_date: '2024-01-01', expiry_date: '2027-01-01', active: true },
  ],
  articles: [
    { id: 'art-1', title: 'เทคนิคการเลือกซื้อเนื้อหมูสำหรับธุรกิจ B2B เพื่อคุมต้นทุนและคุณภาพ', slug: 'b2b-pork-selection', excerpt: 'การทำความเข้าใจสเปกชิ้นส่วน สัดส่วนเนื้อต่อไขมัน และบรรจุภัณฑ์ ช่วยให้ร้านอาหารและโรงงานลดของเสียและคุมกำไรได้แม่นยำขึ้น', content: 'การทำความเข้าใจสเปกชิ้นส่วน สัดส่วนเนื้อต่อไขมัน และบรรจุภัณฑ์ ช่วยให้ร้านอาหารและโรงงานลดของเสียและคุมกำไรได้แม่นยำขึ้น', status: 'published', published_at: new Date().toISOString() },
    { id: 'art-2', title: 'การเก็บรักษาอาหารสดและการควบคุม Cold Chain ในห่วงโซ่อุปทาน', slug: 'cold-chain-integrity', excerpt: 'มองภาพการควบคุมอุณหภูมิตั้งแต่การตัดแต่ง คลังสินค้าห้องเย็น จนถึงการส่งมอบด้วยรถควบคุมอุณหภูมิ', content: 'มองภาพการควบคุมอุณหภูมิตั้งแต่การตัดแต่ง คลังสินค้าห้องเย็น จนถึงการส่งมอบด้วยรถควบคุมอุณหภูมิ', status: 'published', published_at: new Date().toISOString() },
    { id: 'art-3', title: 'ความรู้เรื่องมาตรฐาน Food Safety: GHP, HACCP และ อย. สำหรับผู้ประกอบการ', slug: 'food-safety-standards', excerpt: 'มาตรฐานสากลด้านสุขอนามัยและความปลอดภัยที่โรงงานตัดแต่งเนื้อสัตว์ต้องมีเพื่อสร้างความมั่นใจให้คู่ค้า', content: 'มาตรฐานสากลด้านสุขอนามัยและความปลอดภัยที่โรงงานตัดแต่งเนื้อสัตว์ต้องมีเพื่อสร้างความมั่นใจให้คู่ค้า', status: 'published', published_at: new Date().toISOString() },
  ],
  faqs: [
    { id: 'faq-1', question: 'DCT รับทำสินค้าตัดแต่งตามสเปกหรือไม่?', answer: 'รองรับการตัดแต่งตามความต้องการ เช่น Slice, Dice, Mince, Vacuum Packaging และจัดเก็บในห้องเย็น โดยสามารถระบุสเปกในใบเสนอราคาได้ทันที', sort_order: 1, active: true },
    { id: 'faq-2', question: 'มีราคาสินค้าแสดงบนเว็บไซต์หรือไม่?', answer: 'เนื่องจากราคาเนื้อสุกรขึ้นอยู่กับปริมาณ สเปกการตัดแต่ง และรอบการส่งมอบ ผู้ใช้สามารถส่งรายการขอใบเสนอราคา (RFQ) เพื่อรับข้อเสนอที่ดีที่สุดจากทีมฝ่ายขาย', sort_order: 2, active: true },
    { id: 'faq-3', question: 'ขอใบเสนอราคาได้หลายรายการหรือไม่?', answer: 'ได้ สามารถเพิ่มสินค้าหลายรายการ พร้อมระบุจำนวน หน่วย และสเปกของแต่ละรายการผ่านระบบ RFQ Wizard', sort_order: 3, active: true },
  ],
};

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'products';

  const supabase = getSupabaseServer();

  // 1. Try Supabase site_settings for this table's persistent data
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', `cms_${table}`)
      .maybeSingle();

    if (!error && Array.isArray(data?.value) && data.value.length > 0) {
      cmsStore[table] = data.value;
      return NextResponse.json(data.value, { headers: NO_CACHE_HEADERS });
    }
  } catch (err) {
    console.error(`[CMS API] Supabase error fetching cms_${table}:`, err);
  }

  // 2. Fallback to memory
  const fallbackData = cmsStore[table] || [];
  return NextResponse.json(fallbackData, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table, action, data } = body;

    if (!table) {
      return NextResponse.json({ success: false, message: 'Missing table' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // First fetch current list from Supabase if available
    let currentList = cmsStore[table] || [];
    try {
      const { data: remoteData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', `cms_${table}`)
        .maybeSingle();

      if (Array.isArray(remoteData?.value)) {
        currentList = remoteData.value;
      }
    } catch {
      // use currentList fallback
    }

    let updatedList = [...currentList];

    if (action === 'delete') {
      updatedList = updatedList.filter(
        (item) => item.id !== data?.id && (!data?.slug || item.slug !== data?.slug)
      );
    } else {
      // Save or Update
      const index = updatedList.findIndex(
        (item) => (data?.id && item.id === data.id) || (data?.slug && item.slug === data.slug)
      );

      if (index >= 0) {
        updatedList[index] = { ...updatedList[index], ...data };
      } else {
        updatedList.push({ ...data, id: data?.id || `item-${Date.now()}` });
      }
    }

    // Persist to Supabase site_settings
    try {
      await supabase.from('site_settings').upsert({
        key: `cms_${table}`,
        value: updatedList,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error(`[CMS API] Failed to persist cms_${table} to Supabase:`, e);
    }

    // Keep in-memory store in sync
    cmsStore[table] = updatedList;

    return NextResponse.json({ success: true, data: updatedList }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}
