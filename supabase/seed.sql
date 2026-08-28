-- Optional mock content for a new staging database. Replace before production.
insert into categories (name, slug, description, sort_order) values
('เนื้อหมูตัดแต่ง','trimmed-pork','เนื้อหมูตัดแต่งตามการใช้งาน',1),
('ชิ้นส่วนพรีเมียม','premium-cuts','ชิ้นส่วนสำหรับธุรกิจอาหาร',2),
('สินค้าตามสเปก','custom-spec','รองรับการกำหนดสเปก',3)
on conflict (slug) do nothing;
insert into services (title,slug,description) values
('Custom Cut','custom-cut','ตัดแต่งตามรูปแบบ ขนาด และสัดส่วนที่ตกลง'),
('Slice / Dice / Mince','slice-dice-mince','เตรียมรูปแบบสินค้าให้เหมาะกับกระบวนการ'),
('Vacuum Packaging','vacuum','รูปแบบบรรจุภัณฑ์ตามการจัดเก็บ'),
('OEM Partnership','oem','ร่วมพัฒนาสินค้าตามสเปก')
on conflict (slug) do nothing;
insert into faqs (question,answer,sort_order) values
('DCT รับทำสินค้าตามสเปกหรือไม่?','รองรับการหารือเรื่องรูปแบบการตัดแต่งและ OEM โดยให้ยืนยันรายละเอียดกับทีมขาย',1),
('มีราคาสินค้าแสดงบนเว็บไซต์หรือไม่?','เว็บไซต์ไม่แสดงราคา กรุณาส่งรายการขอใบเสนอราคา',2)
on conflict do nothing;
insert into site_settings (key,value) values
('company_profile','{"headline":"Trusted B2B Food Supply Partner","is_mock":true}'),
('contact','{"address":"[รอข้อมูลที่อยู่จริง]","phone":"[รอข้อมูลจริง]","email":"[รอข้อมูลจริง]","is_mock":true}')
on conflict (key) do update set value=excluded.value;
