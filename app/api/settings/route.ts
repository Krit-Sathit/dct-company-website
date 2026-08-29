import { NextRequest, NextResponse } from 'next/server';
import { defaultContactSettings, defaultCompanyProfile } from '@/lib/settings';

// In-memory server store (persists during deployment runtime across all clients)
let globalContact = { ...defaultContactSettings };
let globalProfile = {
  ...defaultCompanyProfile,
  hero_image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1800&q=85',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type === 'contact') {
    return NextResponse.json(globalContact);
  }
  return NextResponse.json(globalProfile);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === 'contact' && data) {
      globalContact = { ...globalContact, ...data };
      return NextResponse.json({ success: true, data: globalContact });
    }

    if (type === 'company_profile' && data) {
      globalProfile = { ...globalProfile, ...data };
      return NextResponse.json({ success: true, data: globalProfile });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
