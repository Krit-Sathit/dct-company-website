import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import './product-card.css';
import './contrast.css';
import { Header, Footer, RFQProvider } from '@/components/site';
const noto = Noto_Sans_Thai({ subsets: ['thai'], weight: ['400','500','600','700'], variable: '--font-thai' });
export const metadata: Metadata = { title: { default: 'DCT | Trusted B2B Food Supply Partner', template: '%s | DCT' }, description: 'มาตรฐานที่มั่นใจได้ สำหรับธุรกิจอาหารที่ต้องการความสม่ำเสมอ', openGraph: { title: 'Duangcharoen Intertrade', description: 'Trusted B2B Food Supply Partner', type: 'website', locale: 'th_TH' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th"><body className={noto.variable}><RFQProvider><Header />{children}<Footer /></RFQProvider></body></html>; }
