import { NextRequest, NextResponse } from 'next/server';
import { products as defaultProducts } from '@/lib/data';

// In-memory server store for all CMS resources
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
    { id: 'srv-1', title: 'Custom Cutting', slug: 'custom-cutting', description: 'บริการตัดแต่งเนื้อสุกรตามสเปก Slice, Dice, Mince, และ Portion Cut', image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80', active: true },
    { id: 'srv-2', title: 'Cold Storage', slug: 'cold-storage', description: 'บริการคลังสินค้าควบคุมอุณหภูมิ Chilled (0-4°C) และ Frozen (-18°C)', image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', active: true },
    { id: 'srv-3', title: 'Packaging Solutions', slug: 'packaging', description: 'บริการบรรจุภัณฑ์สุญญากาศ (Vacuum) และ Bulk Packaging', image_url: '/products/pork-belly.webp', active: true },
    { id: 'srv-4', title: 'Cold Chain Logistics', slug: 'cold-chain-logistics', description: 'บริการขนส่งกระจายสินค้าด้วยรถควบคุมอุณหภูมิตลอดเส้นทาง', image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', active: true },
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table') || 'products';
  const data = cmsStore[table] || [];
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table, action, data } = body;

    if (!table || !cmsStore[table]) {
      cmsStore[table] = [];
    }

    if (action === 'delete') {
      cmsStore[table] = cmsStore[table].filter(
        (item) => item.id !== data.id && (!data.slug || item.slug !== data.slug)
      );
      return NextResponse.json({ success: true, data: cmsStore[table] });
    }

    // Save or Update
    const list = [...cmsStore[table]];
    const index = list.findIndex(
      (item) => (data.id && item.id === data.id) || (data.slug && item.slug === data.slug)
    );

    if (index >= 0) {
      list[index] = { ...list[index], ...data };
    } else {
      list.push({ ...data, id: data.id || `item-${Date.now()}` });
    }

    cmsStore[table] = list;
    return NextResponse.json({ success: true, data: cmsStore[table] });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
