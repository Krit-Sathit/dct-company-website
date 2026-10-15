import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

const VALID_TABLES = ['products', 'categories', 'services', 'certificates', 'articles', 'faqs'] as const;
type ValidTable = typeof VALID_TABLES[number];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const table = (searchParams.get('table') || 'products') as ValidTable;

  if (!VALID_TABLES.includes(table)) {
    return NextResponse.json({ success: false, message: 'Invalid table name' }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  const supabase = getSupabaseServer();

  try {
    let query = supabase.from(table).select('*');

    if (table === 'categories' || table === 'faqs') {
      query = query.order('sort_order', { ascending: true });
    } else if (table === 'products') {
      query = query.order('created_at', { ascending: true });
    } else if (table === 'articles') {
      query = query.order('published_at', { ascending: false, nullsFirst: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`[CMS API] Database error querying ${table}:`, error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(data || [], { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error(`[CMS API] Server error querying ${table}:`, err);
    return NextResponse.json({ success: false, message: err?.message || 'Database error' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table, action, data } = body as { table: ValidTable; action: string; data: Record<string, any> };

    if (!table || !VALID_TABLES.includes(table)) {
      return NextResponse.json({ success: false, message: 'Invalid table' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    if (!data) {
      return NextResponse.json({ success: false, message: 'Missing data payload' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const supabase = getSupabaseServer();

    // 1. Action: DELETE
    if (action === 'delete') {
      let delQuery = supabase.from(table).delete();

      if (data.id && UUID_REGEX.test(String(data.id))) {
        delQuery = delQuery.eq('id', data.id);
      } else if (data.slug) {
        delQuery = delQuery.eq('slug', data.slug);
      } else {
        return NextResponse.json({ success: false, message: 'No valid ID or slug to delete' }, { status: 400, headers: NO_CACHE_HEADERS });
      }

      const { error } = await delQuery;
      if (error) {
        console.error(`[CMS API] Database delete error on ${table}:`, error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
      }

      return NextResponse.json({ success: true, message: 'Deleted successfully' }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Action: SAVE (Insert or Update)
    const cleanPayload: Record<string, any> = { ...data };
    const rawId = cleanPayload.id;
    delete cleanPayload.id; // Strip ID so Postgres manages it or uses UUID matching

    // Clean nullables / formats
    if ('sort_order' in cleanPayload) cleanPayload.sort_order = Number(cleanPayload.sort_order || 0);
    if ('category_id' in cleanPayload) {
      if (!cleanPayload.category_id || !UUID_REGEX.test(String(cleanPayload.category_id))) {
        cleanPayload.category_id = null;
      }
    }
    if ('published_at' in cleanPayload && !cleanPayload.published_at) {
      cleanPayload.published_at = null;
    }

    const isExistingUuid = rawId && UUID_REGEX.test(String(rawId));

    if (isExistingUuid) {
      // UPDATE by UUID
      const { data: updated, error } = await supabase
        .from(table)
        .update(cleanPayload)
        .eq('id', rawId)
        .select()
        .single();

      if (error) {
        console.error(`[CMS API] Database update error on ${table}:`, error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
      }

      return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS });
    }

    // Check if slug exists to update or insert
    if (cleanPayload.slug) {
      const { data: existing } = await supabase
        .from(table)
        .select('id')
        .eq('slug', cleanPayload.slug)
        .maybeSingle();

      if (existing?.id) {
        const { data: updated, error } = await supabase
          .from(table)
          .update(cleanPayload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error(`[CMS API] Database update by slug error on ${table}:`, error);
          return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
        }
        return NextResponse.json({ success: true, data: updated }, { headers: NO_CACHE_HEADERS });
      }
    }

    // INSERT NEW ROW
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(cleanPayload)
      .select()
      .single();

    if (error) {
      console.error(`[CMS API] Database insert error on ${table}:`, error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: true, data: inserted }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('[CMS API] Unhandled POST error:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Server error' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
