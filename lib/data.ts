export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  cut: string;
  pack: string;
  storage: string;
  use: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 'trimmed-pork',
    name: 'เนื้อหมูตัดแต่ง',
    code: 'DCT-PK-001',
    category: 'เนื้อหมูตัดแต่ง',
    description: 'เนื้อสุกรคัดสรรสำหรับครัวกลางและธุรกิจอาหาร รองรับการตัดแต่งตามสเปก',
    cut: 'Trim ตามสเปกลูกค้า',
    pack: '5 กก. / Vacuum pack',
    storage: 'แช่เย็นหรือแช่แข็งตามข้อตกลง',
    use: 'ครัวกลาง ร้านอาหาร และโรงงาน',
    image: '/products/trimmed-pork.webp',
  },
  {
    id: 'pork-belly',
    name: 'สามชั้นคัดเกรด',
    code: 'DCT-PK-014',
    category: 'ชิ้นส่วนพรีเมียม',
    description: 'สามชั้นคัดสัดส่วนชั้นเนื้อและไขมัน เพื่อความสม่ำเสมอในการปรุง',
    cut: 'Whole / Slice / Custom cut',
    pack: 'Vacuum pack ตามสเปก',
    storage: 'แช่เย็นหรือแช่แข็ง',
    use: 'ร้านอาหาร ชาบู และผลิตภัณฑ์แปรรูป',
    image: '/products/pork-belly.webp',
  },
  {
    id: 'pork-neck',
    name: 'สันคอหมู',
    code: 'DCT-PK-022',
    category: 'ชิ้นส่วนพรีเมียม',
    description: 'สันคอหมูพร้อมปรับขนาดและความหนาสำหรับเมนูย่างหรือหมัก',
    cut: 'Whole / Slice',
    pack: '5 กก. / Custom',
    storage: 'แช่เย็นหรือแช่แข็ง',
    use: 'ร้านอาหารและครัวกลาง',
    image: '/products/pork-neck.webp',
  },
  {
    id: 'loin',
    name: 'สันนอกหมู',
    code: 'DCT-PK-031',
    category: 'เนื้อหมูตัดแต่ง',
    description: 'เนื้อสันนอกตัดแต่งพร้อมใช้งาน สื่อสารสเปกเพื่อควบคุมต้นทุนได้ง่าย',
    cut: 'Trim / Portion',
    pack: 'Vacuum pack',
    storage: 'แช่เย็นหรือแช่แข็ง',
    use: 'สเต๊ก หมูทอด และอาหารพร้อมปรุง',
    image: '/products/loin.webp',
  },
  {
    id: 'ribs',
    name: 'ซี่โครงหมู',
    code: 'DCT-PK-045',
    category: 'ชิ้นส่วนพรีเมียม',
    description: 'ซี่โครงหมูสำหรับเมนูอบ ตุ๋น และย่าง จัดรูปแบบตามการใช้งาน',
    cut: 'Rack / Cut pieces',
    pack: 'Custom pack',
    storage: 'แช่เย็นหรือแช่แข็ง',
    use: 'ร้านอาหาร โรงแรม และครัวกลาง',
    image: '/products/ribs.webp',
  },
  {
    id: 'mince',
    name: 'หมูบดตามสเปก',
    code: 'DCT-PK-060',
    category: 'สินค้าตามสเปก',
    description: 'กำหนดระดับการบดและสัดส่วนเนื้อ-ไขมันตามกระบวนการผลิตของคุณ',
    cut: 'Mince ตามขนาดที่ตกลง',
    pack: '1 / 5 กก. Vacuum',
    storage: 'แช่เย็นหรือแช่แข็ง',
    use: 'โรงงานแปรรูปและครัวกลาง',
    image: '/products/mince.webp',
  },
];

export const categories = ['ทั้งหมด', 'เนื้อหมูตัดแต่ง', 'ชิ้นส่วนพรีเมียม', 'สินค้าตามสเปก'];

export const articles = [
  {
    slug: 'spec-first',
    title: 'เริ่มจากสเปกที่ชัดเจน เพื่อความสม่ำเสมอของทุกจาน',
    date: '16 สิงหาคม 2569',
    category: 'Know-how',
    excerpt: 'การกำหนดรูปแบบการตัดแต่ง ขนาด และบรรจุภัณฑ์ ช่วยให้ทีมปฏิบัติการทำงานได้แม่นยำขึ้น',
  },
  {
    slug: 'cold-chain',
    title: 'Cold Chain ที่ดี ช่วยรักษาคุณภาพวัตถุดิบอย่างไร',
    date: '02 สิงหาคม 2569',
    category: 'Operation',
    excerpt: 'มองภาพการควบคุมอุณหภูมิตั้งแต่การจัดเก็บจนถึงการส่งมอบ',
  },
  {
    slug: 'oem-brief',
    title: 'เตรียม OEM Brief อย่างไรให้ทีมผลิตเข้าใจตรงกัน',
    date: '20 กรกฎาคม 2569',
    category: 'Partnership',
    excerpt: 'รายการข้อมูลพื้นฐานที่ช่วยให้การพัฒนาสินค้าตามสเปกเริ่มต้นได้อย่างเป็นระบบ',
  },
];
