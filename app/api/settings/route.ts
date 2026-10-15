import { NextRequest, NextResponse } from 'next/server';
import { defaultContactSettings, defaultCompanyProfile } from '@/lib/settings';
import { getSupabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback
let globalContact = { ...defaultContactSettings };
let globalProfile = { ...defaultCompanyProfile };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const supabase = getSupabaseServer();

  if (type === 'contact') {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact')
        .maybeSingle();

      if (!error && data?.value && typeof data.value === 'object') {
        globalContact = { ...defaultContactSettings, ...data.value };
        return NextResponse.json(globalContact, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });
      }
    } catch (e) {
      console.error('[API Settings] Error fetching contact from Supabase:', e);
    }
    return NextResponse.json(globalContact, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }

  // company_profile
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'company_profile')
      .maybeSingle();

    if (!error && data?.value && typeof data.value === 'object') {
      globalProfile = { ...defaultCompanyProfile, ...data.value };
      return NextResponse.json(globalProfile, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }
  } catch (e) {
    console.error('[API Settings] Error fetching profile from Supabase:', e);
  }

  return NextResponse.json(globalProfile, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const supabase = getSupabaseServer();

    if (type === 'contact' && data) {
      globalContact = { ...globalContact, ...data };

      try {
        await supabase.from('site_settings').upsert({
          key: 'contact',
          value: globalContact,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[API Settings] Error saving contact to Supabase:', err);
      }

      return NextResponse.json({ success: true, data: globalContact });
    }

    if (type === 'company_profile' && data) {
      globalProfile = { ...globalProfile, ...data };

      try {
        await supabase.from('site_settings').upsert({
          key: 'company_profile',
          value: globalProfile,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[API Settings] Error saving profile to Supabase:', err);
      }

      return NextResponse.json({ success: true, data: globalProfile });
    }

    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}
