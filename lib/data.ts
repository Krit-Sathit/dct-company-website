export type Product = {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  type: string; // Product Type: Chilled (สดแช่เย็น 0-4°C) / Frozen (แช่แข็ง -18°C)
  typeEn?: string;
  cutPart?: string; // Cut Part: ชิ้นส่วน
  cutPartEn?: string;
  cut: string; // Cutting Options: รูปแบบการตัดแต่ง (ภาษาไทย 100%)
  cutEn?: string; // Cutting Options: English
  thickness?: string; // Portion / Thickness: ความหนา / ขนาดชิ้น
  thicknessEn?: string;
  meatFatRatio?: string; // Meat / Fat Ratio: อัตราส่วนเนื้อต่อไขมัน
  meatFatRatioEn?: string;
  pack: string; // Packaging: รูปแบบบรรจุภัณฑ์
  packEn?: string;
  storage: string; // Storage: การจัดเก็บ
  storageEn?: string;
  shelfLife?: string; // Shelf Life: อายุการเก็บรักษา
  shelfLifeEn?: string;
  moq?: string; // MOQ: ปริมาณสั่งซื้อขั้นต่ำ
  moqEn?: string;
  use: string;
  useEn?: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 'pork-neck',
    name: 'สันคอหมู',
    nameEn: 'Pork Collar',
    code: 'DCT-PK-022',
    category: 'ชิ้นส่วนมาตรฐาน',
    categoryEn: 'Standard Cuts',
    description: 'สันคอหมูคัดเกรดพรีเมียม ลายไขมันแทรกสม่ำเสมอ เหมาะสำหรับเมนูย่าง ชาบู สเต๊ก หรือหมัก',
    descriptionEn: 'Premium grade pork collar with well-marbled fat, ideal for grilling, shabu-shabu, steak, or marinating.',
    type: 'สดแช่เย็น (0-4°C) / แช่แข็ง (-18°C)',
    typeEn: 'Chilled (0-4°C) / Frozen (-18°C)',
    cutPart: 'สันคอ',
    cutPartEn: 'Pork Collar',
    cut: 'ชิ้นบล็อก / สไลซ์ (1.5-2.0 มม.) / สเต๊ก',
    cutEn: 'Whole Cut / Slice (1.5-2.0 mm) / Steak Portion',
    thickness: 'สไลซ์ 1.5 - 2 มม. หรือ ตัดสเต๊ก 1 - 1.5 นิ้ว (ตามสเปก)',
    thicknessEn: 'Sliced 1.5 - 2 mm or Steak Cut 1 - 1.5 inches (customizable)',
    meatFatRatio: '75 / 25 (ไขมันแทรกลายหินอ่อน)',
    meatFatRatioEn: '75 / 25 (Marbled fat distribution)',
    pack: 'ถุงสุญญากาศ 2-5 กก. / บรรจุกล่องตามตกลง',
    packEn: 'Vacuum pack 2-5 kg / Bulk pack as agreed',
    storage: 'แช่เย็น 0 ถึง 4°C หรือ แช่แข็ง -18°C',
    storageEn: 'Chilled 0 to 4°C or Frozen -18°C',
    shelfLife: 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
    shelfLifeEn: 'Chilled 7-14 days / Frozen 6-12 months',
    moq: 'ขั้นต่ำ 20 กก. (หรือตามข้อตกลงคู่ค้า)',
    moqEn: 'Minimum 20 kg (or per agreement)',
    use: 'ร้านอาหาร ชาบู-ปิ้งย่าง ครัวกลาง และโรงแรม',
    useEn: 'Restaurants, Shabu & Grill, Central Kitchens, and Hotels',
    image: '/products/pork-neck.webp',
  },
  {
    id: 'loin',
    name: 'สันนอกหมู',
    nameEn: 'Pork Loin',
    code: 'DCT-PK-031',
    category: 'ชิ้นส่วนมาตรฐาน',
    categoryEn: 'Standard Cuts',
    description: 'เนื้อสันนอกตัดแต่งไร้มันส่วนเกิน เนื้อแน่นนุ่ม ควบคุมต้นทุนและคำนวณ Portion ต่อง่าย',
    descriptionEn: 'Trimmed lean pork loin without excess fat, firm yet tender, easy for cost control and precise portioning.',
    type: 'สดแช่เย็น (0-4°C) / แช่แข็ง (-18°C)',
    typeEn: 'Chilled (0-4°C) / Frozen (-18°C)',
    cutPart: 'สันนอก',
    cutPartEn: 'Pork Loin',
    cut: 'ชิ้นอบ / สเต๊กตามน้ำหนัก / ทงคัตสึ / หั่นเต๋า',
    cutEn: 'Whole Roast / Portion Cut / Tonkatsu Cut / Dice',
    thickness: 'ตัดชิ้น 100-200 กรัม หรือสไลซ์ตามสเปก',
    thicknessEn: 'Portion cut 100-200g or sliced to spec',
    meatFatRatio: '90 / 10 (เน้นเนื้อแดงคุณค่าสูง)',
    meatFatRatioEn: '90 / 10 (High lean meat ratio)',
    pack: 'ถุงสุญญากาศ 5 กก. / บรรจุกล่องตามสเปก',
    packEn: 'Vacuum pack 5 kg / Custom carton box',
    storage: 'แช่เย็น 0 ถึง 4°C หรือ แช่แข็ง -18°C',
    storageEn: 'Chilled 0 to 4°C or Frozen -18°C',
    shelfLife: 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
    shelfLifeEn: 'Chilled 7-14 days / Frozen 6-12 months',
    moq: 'ขั้นต่ำ 20 กก.',
    moqEn: 'Minimum 20 kg',
    use: 'สเต๊ก หมูทอดทงคัตสึ และอาหารพร้อมปรุง',
    useEn: 'Pork steaks, Japanese tonkatsu, and ready-to-cook meals',
    image: '/products/loin.webp',
  },
  {
    id: 'pork-belly',
    name: 'สามชั้นหมูคัดเกรด',
    nameEn: 'Pork Belly',
    code: 'DCT-PK-014',
    category: 'ชิ้นส่วนมาตรฐาน',
    categoryEn: 'Standard Cuts',
    description: 'สามชั้นคัดสัดส่วนชั้นเนื้อและไขมันสวยงาม เพื่อความสม่ำเสมอในทุกจานและทุกล็อตการผลิต',
    descriptionEn: 'Selected pork belly with balanced layers of lean meat and fat for culinary consistency in every dish.',
    type: 'สดแช่เย็น (0-4°C) / แช่แข็ง (-18°C)',
    typeEn: 'Chilled (0-4°C) / Frozen (-18°C)',
    cutPart: 'สามชั้น',
    cutPartEn: 'Pork Belly',
    cut: 'ชิ้นแผ่น / สไลซ์ (ชาบู/หมูกระทะ) / หั่นเต๋า (พะโล้)',
    cutEn: 'Whole Slab / Slice (Shabu/Hotpot) / Cube (Stew)',
    thickness: 'สไลซ์บาง 1.2-1.8 มม. หรือ ชิ้นเต๋า 1-2 นิ้ว',
    thicknessEn: 'Thin sliced 1.2-1.8 mm or Cubed 1-2 inches',
    meatFatRatio: '60 / 40 หรือ 50 / 50 (สัดส่วนชั้นสวย)',
    meatFatRatioEn: '60 / 40 or 50 / 50 (Well-defined layers)',
    pack: 'ถุงสุญญากาศตามสเปกลูกค้า',
    packEn: 'Vacuum pack customized to client spec',
    storage: 'แช่เย็น 0 ถึง 4°C หรือ แช่แข็ง -18°C',
    storageEn: 'Chilled 0 to 4°C or Frozen -18°C',
    shelfLife: 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
    shelfLifeEn: 'Chilled 7-14 days / Frozen 6-12 months',
    moq: 'ขั้นต่ำ 20 กก.',
    moqEn: 'Minimum 20 kg',
    use: 'ร้านอาหาร ชาบู ปิ้งย่าง หมูกรอบ และแปรรูป',
    useEn: 'Restaurants, Shabu, BBQ, Crispy Pork Belly, and Food Processors',
    image: '/products/pork-belly.webp',
  },
  {
    id: 'ribs',
    name: 'ซี่โครงหมู',
    nameEn: 'Pork Spare Ribs',
    code: 'DCT-PK-045',
    category: 'ชิ้นส่วนมาตรฐาน',
    categoryEn: 'Standard Cuts',
    description: 'ซี่โครงหมูคัดเนื้อติดกระดูกสวยงาม เหมาะสำหรับเมนูอบ บาร์บีคิว ต้มซุป หรือตุ๋นยาจีน',
    descriptionEn: 'Selected pork ribs with meaty bones, ideal for baking, BBQ ribs, broth soups, or Chinese herbal stews.',
    type: 'สดแช่เย็น (0-4°C) / แช่แข็ง (-18°C)',
    typeEn: 'Chilled (0-4°C) / Frozen (-18°C)',
    cutPart: 'ซี่โครง',
    cutPartEn: 'Pork Spare Ribs',
    cut: 'แผงซี่โครงเต็ม / หั่นท่อน (2-3 นิ้ว)',
    cutEn: 'Full Rack / Cut Pieces (2-3 inches)',
    thickness: 'แผงเต็ม หรือ ตัดท่อนตามขนาดหม้อต้ม',
    thicknessEn: 'Full rack or cut to cooking pot dimensions',
    meatFatRatio: 'เนื้อติดกระดูกมาตรฐาน',
    meatFatRatioEn: 'Standard bone-in meat',
    pack: 'บรรจุกล่องมาตรฐาน 5-10 กก.',
    packEn: 'Standard pack 5-10 kg',
    storage: 'แช่เย็น 0 ถึง 4°C หรือ แช่แข็ง -18°C',
    storageEn: 'Chilled 0 to 4°C or Frozen -18°C',
    shelfLife: 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
    shelfLifeEn: 'Chilled 7-14 days / Frozen 6-12 months',
    moq: 'ขั้นต่ำ 20 กก.',
    moqEn: 'Minimum 20 kg',
    use: 'ร้านอาหาร ภัตตาคาร โรงแรม และครัวกลาง',
    useEn: 'Restaurants, Fine Dining, Hotels, and Central Kitchens',
    image: '/products/ribs.webp',
  },
  {
    id: 'trimmed-pork',
    name: 'เนื้อหมูตัดแต่งตามสเปก',
    nameEn: 'Custom Trimmed Pork',
    code: 'DCT-PK-001',
    category: 'ชิ้นส่วนแปรรูป / ตัดแต่งพิเศษ',
    categoryEn: 'Custom & Portion Cuts',
    description: 'เนื้อสุกรคัดสรรพร้อมตัดแต่ง Slice, Dice, Portion ตาม Specification เพื่อลดขั้นตอนในครัวกลาง',
    descriptionEn: 'Carefully selected pork cut into slices, dice, or portion cuts to exact specifications to streamline kitchen workflows.',
    type: 'สดแช่เย็น (0-4°C) / แช่แข็ง (-18°C)',
    typeEn: 'Chilled (0-4°C) / Frozen (-18°C)',
    cutPart: 'เนื้อหมูตัดแต่ง',
    cutPartEn: 'Trimmed Pork Cuts',
    cut: 'ตัดแต่งพิเศษ / หั่นเต๋า / สไลซ์เส้น / แบ่งชิ้นตามน้ำหนัก',
    cutEn: 'Custom Trim / Dice / Strip / Portioning',
    thickness: 'ปรับขนาดและน้ำหนักต่องวดตามข้อตกลง',
    thicknessEn: 'Adjustable weight and sizing per order specification',
    meatFatRatio: '80 / 20 หรือ 85 / 15',
    meatFatRatioEn: '80 / 20 or 85 / 15',
    pack: 'ถุงสุญญากาศ 2 / 5 กก.',
    packEn: 'Vacuum pack 2 / 5 kg',
    storage: 'แช่เย็นหรือแช่แข็งตามข้อตกลง',
    storageEn: 'Chilled or Frozen as agreed',
    shelfLife: 'แช่เย็น 7-14 วัน / แช่แข็ง 6-12 เดือน',
    shelfLifeEn: 'Chilled 7-14 days / Frozen 6-12 months',
    moq: 'ตามข้อตกลงความต้องการของธุรกิจ',
    moqEn: 'Per business agreement',
    use: 'ครัวกลาง โรงงานอาหารแปรรูป และร้านอาหารแฟรนไชส์',
    useEn: 'Central Kitchens, Processing Plants, and Restaurant Franchises',
    image: '/products/trimmed-pork.webp',
  },
  {
    id: 'mince',
    name: 'หมูบดตามสเปก',
    nameEn: 'Minced Pork',
    code: 'DCT-PK-060',
    category: 'ชิ้นส่วนแปรรูป / ตัดแต่งพิเศษ',
    categoryEn: 'Custom & Portion Cuts',
    description: 'กำหนดระดับความละเอียดของการบดและสัดส่วนเนื้อต่อไขมันตามกระบวนการผลิตของคุณ',
    descriptionEn: 'Custom grind coarseness and precise lean-to-fat ratio to match your specific production requirements.',
    type: 'สดแช่เย็น (0-4°C) / แช่แข็ง (-18°C)',
    typeEn: 'Chilled (0-4°C) / Frozen (-18°C)',
    cutPart: 'เนื้อหมูบด',
    cutPartEn: 'Minced Pork',
    cut: 'บดหยาบ / บดละเอียด (ตามสเปก)',
    cutEn: 'Coarse Mince / Fine Mince (to spec)',
    thickness: 'ใบมีดบด 3 มม. / 5 มม. / 8 มม.',
    thicknessEn: 'Grind plate 3 mm / 5 mm / 8 mm',
    meatFatRatio: 'ระบุได้ตั้งแต่ 90/10, 80/20, ถึง 70/30',
    meatFatRatioEn: 'Configurable from 90/10, 80/20, to 70/30',
    pack: 'ถุงสุญญากาศ 1 / 5 กก.',
    packEn: 'Vacuum pack 1 / 5 kg',
    storage: 'แช่เย็น 0 ถึง 4°C หรือ แช่แข็ง -18°C',
    storageEn: 'Chilled 0 to 4°C or Frozen -18°C',
    shelfLife: 'แช่เย็น 5-7 วัน / แช่แข็ง 6-12 เดือน',
    shelfLifeEn: 'Chilled 5-7 days / Frozen 6-12 months',
    moq: 'ขั้นต่ำ 20 กก.',
    moqEn: 'Minimum 20 kg',
    use: 'โรงงานแปรรูป ไส้กรอก ติ่มซำ ครัวกลาง',
    useEn: 'Processing Plants, Sausages, Dim Sum, and Central Kitchens',
    image: '/products/mince.webp',
  },
];

export const categories = [
  'ทั้งหมด',
  'ชิ้นส่วนมาตรฐาน',
  'ชิ้นส่วนแปรรูป / ตัดแต่งพิเศษ',
  'อวัยวะภายในและส่วนอื่น ๆ',
];

export const articles = [
  {
    slug: 'b2b-pork-selection',
    title: 'เทคนิคการเลือกซื้อเนื้อหมูสำหรับธุรกิจ B2B เพื่อคุมต้นทุนและคุณภาพ',
    date: '28 สิงหาคม 2569',
    category: 'Knowledge',
    excerpt: 'การทำความเข้าใจสเปกชิ้นส่วน สัดส่วนเนื้อต่อไขมัน และบรรจุภัณฑ์ ช่วยให้ร้านอาหารและโรงงานลดของเสียและคุมกำไรได้แม่นยำขึ้น',
    content: `การบริหารต้นทุนวัตถุดิบในธุรกิจอาหาร (Food Cost Management) ไม่ได้ขึ้นอยู่กับราคาต่อกิโลกรัมเพียงอย่างเดียว แต่ขึ้นอยู่กับ "Yield" หรือปริมาณเนื้อที่นำไปปรุงจริงได้โดยไม่ต้องตัดแต่งทิ้ง

1. กำหนดสเปกให้ชัดเจนตั้งแต่แรก:
ระบุความหนา รูปแบบการตัดแต่ง (Whole Cut, Sliced, Diced หรือ Minced) และสัดส่วนเนื้อต่อไขมัน (เช่น 80/20 หรือ 70/30) เพื่อให้ทีมครัวกลางไม่ต้องเสียเวลาและแรงงานในการแต่งชิ้นเนื้อซ้ำ

2. บรรจุภัณฑ์แบบสุญญากาศ (Vacuum Packaging):
ช่วยลดการสัมผัสอากาศ ยืดอายุการเก็บรักษาในตู้เย็น และป้องกันการสูญเสียน้ำหนักจากความชื้นระเหย (Weight Loss)

3. ซัพพลายเออร์ที่มีระบบ Cold Chain ที่ไว้ใจได้:
การรักษาอุณหภูมิ 0-4°C อย่างต่อเนื่องตั้งแต่ออกจากโรงงานจนถึงหน้าร้าน ช่วยคงความสดและลดอัตราการเสื่อมสภาพของเนื้อสัตว์`,
  },
  {
    slug: 'cold-chain-integrity',
    title: 'การเก็บรักษาอาหารสดและการควบคุม Cold Chain ในห่วงโซ่อุปทาน',
    date: '15 สิงหาคม 2569',
    category: 'Knowledge',
    excerpt: 'มองภาพการควบคุมอุณหภูมิตั้งแต่การตัดแต่ง คลังสินค้าห้องเย็น จนถึงการส่งมอบด้วยรถควบคุมอุณหภูมิ',
    content: `Cold Chain คือหัวใจสำคัญของความปลอดภัยทางอาหาร (Food Safety) โดยเฉพาะเนื้อสุกรสดและแปรรูป

1. อุณหภูมิการจัดเก็บที่ได้มาตรฐาน:
- เนื้อสดแช่เย็น (Chilled): ต้องควบคุมอุณหภูมิให้อยู่ระหว่าง 0°C ถึง 4°C
- เนื้อแช่แข็ง (Frozen): ต้องรักษาอุณหภูมิที่ -18°C หรือต่ำกว่าอย่างสม่ำเสมอ

2. การขนส่งแบบควบคุมอุณหภูมิ (Refrigerated Logistics):
รถขนส่งต้องติดตั้งระบบบันทึกอุณหภูมิ (Temperature Datalogger) แบบเรียลไทม์ และมีระบบการขนถ่าย (Loading & Unloading) ที่รวดเร็วเพื่อไม่ให้อุณหภูมิแกว่ง

3. ความปลอดภัยและสุขอนามัย:
การรักษาห่วงโซ่อุณหภูมิที่สมบูรณ์ช่วยยับยั้งการเจริญเติบโตของแบคทีเรีย ทำให้เนื้อสุกรคงความสด นุ่ม และปลอดภัยต่อผู้บริโภคสูงสุด`,
  },
  {
    slug: 'food-safety-standards',
    title: 'ความรู้เรื่องมาตรฐาน Food Safety: GHP, HACCP และ อย. สำหรับผู้ประกอบการ',
    date: '02 สิงหาคม 2569',
    category: 'Knowledge',
    excerpt: 'มาตรฐานสากลด้านสุขอนามัยและความปลอดภัยที่โรงงานตัดแต่งเนื้อสัตว์ต้องมีเพื่อสร้างความมั่นใจให้คู่ค้า',
    content: `การดำเนินธุรกิจอาหารในยุคปัจจุบัน มาตรฐานด้านความปลอดภัยไม่ใช่แค่เรื่องทางเลือก แต่เป็นเงื่อนไขพื้นฐานในการสร้างความเชื่อมั่น

1. GHP (Good Hygiene Practices):
แนวทางปฏิบัติสุขลักษณะที่ดี ครอบคลุมตั้งแต่การออกแบบสถานที่ผลิต การดูแลสุขอนามัยของผู้ปฏิบัติงาน การทำความสะอาด และการป้องกันการปนเปื้อนข้าม

2. HACCP (Hazard Analysis and Critical Control Points):
ระบบวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุมในการผลิตอาหาร เพื่อป้องกันอันตรายทางกายภาพ เคมี และชีวภาพอย่างเป็นระบบ

3. Traceability (ระบบตรวจสอบย้อนกลับ):
ความสามารถในการตรวจสอบย้อนกลับถึงแหล่งที่มาของวัตถุดิบและเส้นทางการผลิต ทุกล็อตสินค้าต้องสามารถระบุที่มาได้เพื่อความโปร่งใสและปลอดภัย`,
  },
];
