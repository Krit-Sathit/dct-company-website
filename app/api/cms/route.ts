import { NextRequest, NextResponse } from 'next/server';
import { products as defaultProducts } from '@/lib/data';

// In-memory server store for all CMS resources
const cmsStore: Record<string, any[]> = {
  products: defaultProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.id,
    sku: p.code,
    category: p.category,
    description: p.description,
    cut_format: p.cut,
    packing: p.pack,
    storage: p.storage,
    recommended_use: p.use,
    image_url: p.image,
    active: true,
  })),
  categories: [
    { id: 'cat-1', name: 'เนื้อหมูตัดแต่ง', slug: 'trimmed-pork', description: 'เนื้อหมูตัดแต่ง สำหรับธุรกิจอาหาร', sort_order: 1, active: true },
    { id: 'cat-2', name: 'ชิ้นส่วนพรีเมียม', slug: 'premium-cuts', description: 'ชิ้นส่วนพรีเมียม สำหรับธุรกิจอาหาร', sort_order: 2, active: true },
    { id: 'cat-3', name: 'สินค้าตามสเปก', slug: 'custom-spec', description: 'สินค้าตามสเปก สำหรับธุรกิจอาหาร', sort_order: 3, active: true },
  ],
  services: [
    { id: 'srv-1', title: 'Custom Cut & Portioning', slug: 'custom-cut', description: 'บริการตัดแต่งตามขนาด น้ำหนัก และรูปแบบที่ตกลงเพื่อลดขั้นตอนเตรียม', image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80', active: true },
    { id: 'srv-2', title: 'Vacuum & B2B Packing', slug: 'b2b-packing', description: 'บรรจุภัณฑ์สุญญากาศและแพ็กเกจสำหรับจัดเก็บและขนส่งอย่างเป็นระบบ', image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80', active: true },
    { id: 'srv-3', title: 'Cold Chain Delivery', slug: 'cold-chain-delivery', description: 'บริหารการจัดส่งแบบควบคุมอุณหภูมิตามรอบเวลาที่นัดหมาย', image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', active: true },
  ],
  certificates: [
    { id: 'cert-1', name: 'GMP / HACCP Certified', description: 'มาตรฐานความปลอดภัยและสุขอนามัยในกระบวนการผลิตอาหาร', issued_date: '2024-01-01', expiry_date: '2027-01-01', active: true },
    { id: 'cert-2', name: 'DLD Meat Standard', description: 'มาตรฐานสถานที่จำหน่ายและตัดแต่งเนื้อสัตว์ กรมปศุสัตว์', issued_date: '2024-01-01', expiry_date: '2027-01-01', active: true },
    { id: 'cert-3', name: 'EST Standard Partner', description: 'โรงงานคู่ค้ามาตรฐานส่งออกเพื่อความปลอดภัยสูงสุด', issued_date: '2024-01-01', expiry_date: '2027-01-01', active: true },
  ],
  articles: [
    { id: 'art-1', title: 'เริ่มจากสเปกที่ชัดเจน เพื่อความสม่ำเสมอของทุกจาน', slug: 'spec-first', excerpt: 'การกำหนดรูปแบบการตัดแต่ง ขนาด และบรรจุภัณฑ์ ช่วยให้ทีมปฏิบัติการทำงานได้แม่นยำขึ้น', content: 'การกำหนดรูปแบบการตัดแต่ง ขนาด และบรรจุภัณฑ์ ช่วยให้ทีมปฏิบัติการทำงานได้แม่นยำขึ้น', status: 'published', published_at: new Date().toISOString() },
    { id: 'art-2', title: 'Cold Chain ที่ดี ช่วยรักษาคุณภาพวัตถุดิบอย่างไร', slug: 'cold-chain', excerpt: 'มองภาพการควบคุมอุณหภูมิตั้งแต่การจัดเก็บจนถึงการส่งมอบ', content: 'มองภาพการควบคุมอุณหภูมิตั้งแต่การจัดเก็บจนถึงการส่งมอบ', status: 'published', published_at: new Date().toISOString() },
    { id: 'art-3', title: 'เตรียม OEM Brief อย่างไรให้ทีมผลิตเข้าใจตรงกัน', slug: 'oem-brief', excerpt: 'รายการข้อมูลพื้นฐานที่ช่วยให้การพัฒนาสินค้าตามสเปกเริ่มต้นได้อย่างเป็นระบบ', content: 'รายการข้อมูลพื้นฐานที่ช่วยให้การพัฒนาสินค้าตามสเปกเริ่มต้นได้อย่างเป็นระบบ', status: 'published', published_at: new Date().toISOString() },
  ],
  faqs: [
    { id: 'faq-1', question: 'DCT รับทำสินค้าตามสเปกหรือไม่?', answer: 'รองรับการหารือเรื่องรูปแบบการตัดแต่ง Slice, Dice, Mince, Vacuum และ OEM โดยรายละเอียดขึ้นกับสเปกและการยืนยันกับทีมขาย', sort_order: 1, active: true },
    { id: 'faq-2', question: 'มีราคาสินค้าแสดงบนเว็บไซต์หรือไม่?', answer: 'เว็บไซต์นี้ไม่แสดงราคา ผู้ใช้สามารถเลือกสินค้าและส่งรายการขอใบเสนอราคาเพื่อรับข้อมูลที่เหมาะกับสเปกและปริมาณ', sort_order: 2, active: true },
    { id: 'faq-3', question: 'ขอใบเสนอราคาได้หลายรายการหรือไม่?', answer: 'ได้ สามารถเพิ่มสินค้าหลายรายการ พร้อมระบุจำนวน หน่วย และหมายเหตุของแต่ละรายการ', sort_order: 3, active: true },
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
