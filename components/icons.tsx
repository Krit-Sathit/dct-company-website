import React from 'react';

// Common Icon Props
interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 1. Ribbon / Award Badge Icon (คุณภาพสม่ำเสมอ)
export function IconRibbon({ size = 32, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.4 12.5L18 22l-6-3-6 3 2.6-9.5" />
    </svg>
  );
}

// 2. Shield with Checkmark Icon (ปลอดภัย มั่นใจได้)
export function IconShield({ size = 32, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// 3. Factory Building Icon (กำลังการผลิตเพียงพอ)
export function IconFactory({ size = 32, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 20h20" />
      <path d="M6 20V10l5 3V10l5 3V4h4v16" />
      <line x1="18" y1="8" x2="18" y2="8.01" />
      <line x1="18" y1="12" x2="18" y2="12.01" />
      <line x1="18" y1="16" x2="18" y2="16.01" />
    </svg>
  );
}

// 4. Delivery Truck Icon (จัดส่งตรงเวลา)
export function IconTruck({ size = 32, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="4" width="14" height="13" rx="1" />
      <path d="M15 8h4l3 4v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

// 5. Customer Support / 2 People Icon (บริการใส่ใจทุกความต้องการ)
export function IconSupport({ size = 32, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// 6. Restaurant Fork & Knife Icon (ร้านอาหาร)
export function IconRestaurant({ size = 30, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2v20" />
      <path d="M18 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3" />
      <path d="M6 2v20" />
      <path d="M3 2v6a3 3 0 0 0 6 0V2" />
    </svg>
  );
}

// 7. Food Processing Pan Icon (โรงงานอาหารแปรรูป)
export function IconProcessing({ size = 30, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 13h18l-2 8H5l-2-8z" />
      <path d="M12 4v4" />
      <path d="M7 6v2" />
      <path d="M17 6v2" />
      <circle cx="12" cy="17" r="1.5" />
    </svg>
  );
}

// 8. Wholesale Box / Logistics Icon (ผู้ค้าส่ง)
export function IconWholesale({ size = 30, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

// 9. Supermarket Store Icon (ซูเปอร์มาร์เก็ต)
export function IconSupermarket({ size = 30, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// 10. Corporate Users Icon (ลูกค้าองค์กร)
export function IconCorporate({ size = 30, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// 11. Meat Cutting / Custom Cut Icon (รับผลิตตามความต้องการ)
export function IconMeatCut({ size = 26, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 3L5 17l4 4L21 9l-2-6z" />
      <path d="M14 6l4 4" />
      <path d="M3 21l3-3" />
    </svg>
  );
}

// 12. Standard Warehouse Icon (จัดเตรียมสินค้ามาตรฐาน)
export function IconWarehouse({ size = 26, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

// 13. Packaging Seal Icon (แพ็กและบรรจุภัณฑ์)
export function IconPackage({ size = 26, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

// 14. Logistics Delivery Icon (จัดส่งทั่วประเทศ)
export function IconLogistics({ size = 26, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// 15. Handshake / Consulting Icon (ให้คำปรึกษาและดูแลอย่างใกล้ชิด)
export function IconConsulting({ size = 26, color = '#8B1E1E', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 11V7a4 4 0 0 0-8 0v4" />
      <path d="M4 11h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8z" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

// 16. Gold Award Icon (30+ ปี)
export function IconAwardGold({ size = 38, color = '#e5b85c', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

// 17. Gold Users Icon (1,000+ ราย)
export function IconUsersGold({ size = 38, color = '#e5b85c', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// 18. Gold Globe/Production Icon (300 ตัน/เดือน)
export function IconGlobeGold({ size = 38, color = '#e5b85c', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

// 19. Gold Truck Icon (100+ คัน)
export function IconTruckGold({ size = 38, color = '#e5b85c', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
