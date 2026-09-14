'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'th' | 'en';

export const translations = {
  th: {
    brand_name: 'บริษัท ดวงเจริญอินเตอร์เทรด จำกัด',
    brand_name_en: 'DOUNGCHALERN INTER TRADE CO., LTD.',
    nav_home: 'หน้าหลัก',
    nav_about: 'เกี่ยวกับเรา',
    nav_products: 'สินค้า',
    nav_services: 'บริการของเรา',
    nav_standards: 'มาตรฐานการผลิต',
    nav_news: 'ข่าวสาร',
    nav_contact: 'ติดต่อเรา',
    nav_rfq: 'ขอใบเสนอราคา',
    lang_label: 'ภาษา:',

    // Hero
    hero_title: 'วัตถุดิบคุณภาพ พร้อมส่งต่อให้ธุรกิจของคุณ',
    hero_sub: 'เนื้อสุกรตัดแต่งตามสเปก พร้อมการจัดเก็บและจัดส่งที่ได้มาตรฐาน',
    hero_cta_products: 'ดูสินค้าและบริการ →',
    hero_cta_rfq: 'ขอใบเสนอราคา',

    // Featured Products
    featured_title: 'สินค้าแนะนำ',
    featured_sub: 'คัดสรรชิ้นส่วนสุกรคุณภาพ ตัดแต่งตามสเปกที่ตอบโจทย์ทุกกลุ่มธุรกิจ',
    view_all_catalogue: 'ดูแคตตาล็อกทั้งหมด →',
    view_details: 'ดูรายละเอียด →',
    promo_badge: '🔥 โปรโมชันประจำเดือน',
    promo_title: 'สินค้าพร้อมส่ง',
    promo_desc: 'สินค้าที่พร้อมส่งมอบทันทีในราคาพิเศษ ประจำเดือนนี้',
    promo_cta: 'ดูโปรโมชั่น →',

    // Why Choose Us
    why_title: 'ทำไมธุรกิจเลือกเรา',
    why_1_title: 'คุณภาพสม่ำเสมอ',
    why_1_desc: 'คัดสรรวัตถุดิบคุณภาพ ผ่านมาตรฐานการผลิตที่เชื่อถือได้ทุกล็อตสินค้า',
    why_2_title: 'ปลอดภัย มั่นใจได้',
    why_2_desc: 'ควบคุมคุณภาพทุกขั้นตอน ได้มาตรฐานสุขอนามัยอาหารระดับสากล',
    why_3_title: 'กำลังการผลิตเพียงพอ',
    why_3_desc: 'รองรับความต้องการได้อย่างต่อเนื่อง ตามปริมาณที่ตกลงกัน',
    why_4_title: 'จัดส่งตรงเวลา',
    why_4_desc: 'ระบบขนส่งควบคุมอุณหภูมิ ตรงเวลา เพื่อความสดใหม่ของวัตถุดิบ',
    why_5_title: 'บริการใส่ใจทุกความต้องการ',
    why_5_desc: 'ทีมงานมืออาชีพ พร้อมให้คำแนะนำและดูแลตลอดกระบวนการสั่งซื้อ',

    // Stats
    stat_1_val: '30+ ปี',
    stat_1_lbl: 'ประสบการณ์ในอุตสาหกรรม',
    stat_2_val: '100+ ราย',
    stat_2_lbl: 'ลูกค้าธุรกิจทั่วประเทศ',
    stat_3_val: '200+ ตัน/ด.',
    stat_3_lbl: 'กำลังการผลิตเพิ่มทุกเดือน',
    stat_4_val: '150 ตัน',
    stat_4_lbl: 'ความจุห้องเย็นควบคุมอุณหภูมิ',

    // About
    about_title: 'เกี่ยวกับเรา',
    about_company: 'บริษัท ดวงเจริญอินเตอร์เทรด จำกัด',
    about_desc:
      'เราคือผู้เชี่ยวชาญด้านการตัดแต่งและจัดจำหน่ายเนื้อสุกรสำหรับธุรกิจอาหาร ครัวกลาง ภัตตาคาร และโรงงานแปรรูป ด้วยประสบการณ์มากกว่า 30 ปี เรามุ่งมั่นส่งมอบเนื้อสุกรที่สด สะอาด ตรงตามสเปก และปลอดภัยตามมาตรฐานสากล GHPs และ HACCP พร้อมระบบจัดเก็บห้องเย็นและโลจิสติกส์ควบคุมอุณหภูมิที่ครอบคลุมทั่วประเทศ',
    about_chip_cut: 'ตัดแต่งตามสเปก',
    about_chip_cold: 'ห้องเย็นมาตรฐาน',
    about_chip_pack: 'แพ็กสุญญากาศ',
    about_chip_delivery: 'จัดส่งควบคุมอุณหภูมิ',
    about_cta: 'อ่านเพิ่มเติมเกี่ยวกับเรา →',

    // Standards
    standards_title: 'มาตรฐานการผลิตและความปลอดภัย',
    standards_desc: 'ทุกขั้นตอนผ่านการรับรองมาตรฐานระดับสากล เพื่อความมั่นใจสูงสุดของคู่ค้าและผู้บริโภค',
    view_cert: 'ดูใบรับรอง →',
    cert_close: 'ปิดหน้าต่าง',
    cert_verified: 'ตรวจรับรองอย่างถูกต้อง',
    cert_no: 'เลขที่ใบรับรอง',
    cert_issuer: 'หน่วยงานผู้ออก',
    cert_expiry: 'วันหมดอายุ',

    // Footer
    footer_tagline: 'แหล่งวัตถุดิบเนื้อหมูสำหรับธุรกิจ ที่ต้องการคุณภาพสม่ำเสมอ ปริมาณเพียงพอ และการจัดส่งที่ไว้ใจได้',
    footer_main_menu: 'เมนูหลัก',
    footer_products: 'สินค้า',
    footer_services: 'บริการของเรา',
    footer_contact: 'ติดต่อเรา',
    footer_rights: 'สงวนลิขสิทธิ์ทุกประการ.',
    footer_pork_fresh: 'เนื้อหมูสดแช่เย็น (Fresh)',
    footer_pork_frozen: 'เนื้อหมูแช่แข็ง (Frozen)',
    footer_ready_stock: 'สินค้าพร้อมขาย',
    footer_privacy: 'มาตรฐานความปลอดภัย',
    footer_sales_contact: 'ติดต่อฝ่ายขาย',
  },
  en: {
    brand_name: 'DOUNGCHALERN INTER TRADE CO., LTD.',
    brand_name_en: 'DOUNGCHALERN INTER TRADE CO., LTD.',
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_products: 'Products',
    nav_services: 'Services',
    nav_standards: 'Standards',
    nav_news: 'News',
    nav_contact: 'Contact Us',
    nav_rfq: 'Request a Quote',
    lang_label: 'Language:',

    // Hero
    hero_title: 'Premium Quality Ingredients, Delivered for Your Business',
    hero_sub: 'Custom-cut pork to your exact specifications with standardized cold chain storage & delivery',
    hero_cta_products: 'View Products & Services →',
    hero_cta_rfq: 'Request a Quote',

    // Featured Products
    featured_title: 'Featured Products',
    featured_sub: 'Selected premium pork cuts, tailored to meet every food service requirement',
    view_all_catalogue: 'View Full Catalogue →',
    view_details: 'View Details →',
    promo_badge: '🔥 Monthly Promotion',
    promo_title: 'Ready to Ship',
    promo_desc: 'Special monthly offers ready for immediate delivery at business rates',
    promo_cta: 'View Promotions →',

    // Why Choose Us
    why_title: 'Why Businesses Choose Us',
    why_1_title: 'Consistent Quality',
    why_1_desc: 'Selected premium raw materials passing rigorous production standards for every batch',
    why_2_title: 'Safe & Certified',
    why_2_desc: 'Quality control at every stage adhering to international GHPs and HACCP food hygiene standards',
    why_3_title: 'Ample Capacity',
    why_3_desc: 'Continuous and dependable supply volume tailored to your operational requirements',
    why_4_title: 'On-Time Logistics',
    why_4_desc: 'Temperature-controlled delivery fleet ensuring on-time arrival with optimum freshness',
    why_5_title: 'Dedicated Support',
    why_5_desc: 'Professional sales and QC team ready to assist and provide custom cutting guidance',

    // Stats
    stat_1_val: '30+ Yrs',
    stat_1_lbl: 'Industry Experience',
    stat_2_val: '100+ Clients',
    stat_2_lbl: 'Nationwide Business Clients',
    stat_3_val: '200+ Tons/mo',
    stat_3_lbl: 'Growing Production Capacity',
    stat_4_val: '150 Tons',
    stat_4_lbl: 'Cold Storage Capacity',

    // About
    about_title: 'About Us',
    about_company: 'DOUNGCHALERN INTER TRADE CO., LTD.',
    about_desc:
      'We are a trusted B2B meat cutting and wholesale partner with over 30 years of experience serving restaurants, central kitchens, hotel chains, and food processing plants. Certified under GHPs and HACCP standards, we operate state-of-the-art cold storage and temperature-controlled logistics to guarantee freshness and safety nationwide.',
    about_chip_cut: 'Custom Cutting',
    about_chip_cold: 'Cold Storage',
    about_chip_pack: 'Vacuum Packing',
    about_chip_delivery: 'Cold Chain Delivery',
    about_cta: 'Learn More About Us →',

    // Standards
    standards_title: 'Production & Food Safety Standards',
    standards_desc: 'Every production stage is certified under international food safety benchmarks for complete peace of mind.',
    view_cert: 'View Certificate →',
    cert_close: 'Close Window',
    cert_verified: 'Officially Certified',
    cert_no: 'Certificate No.',
    cert_issuer: 'Issuing Body',
    cert_expiry: 'Valid Until',

    // Footer
    footer_tagline: 'A trusted pork ingredient supply partner for businesses requiring consistent quality, reliable volume, and dependable delivery.',
    footer_main_menu: 'Navigation',
    footer_products: 'Products',
    footer_services: 'Services',
    footer_contact: 'Contact Us',
    footer_rights: 'All rights reserved.',
    footer_pork_fresh: 'Chilled Fresh Pork',
    footer_pork_frozen: 'Frozen Pork Cuts',
    footer_ready_stock: 'Ready-to-Ship Stock',
    footer_privacy: 'Safety Standards',
    footer_sales_contact: 'Contact Sales',
  },
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['th']) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'th',
  setLang: () => {},
  t: (key) => translations.th[key] || (key as string),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('th');

  useEffect(() => {
    const saved = localStorage.getItem('dct-lang') as Language | null;
    if (saved === 'th' || saved === 'en') {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('dct-lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof translations['th']): string => {
    return translations[lang][key] || translations.th[key] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
