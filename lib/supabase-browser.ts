'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(url && url.startsWith('http') && key);
};

let cachedClient: SupabaseClient | null = null;

export const supabaseBrowser = (): SupabaseClient => {
  if (isSupabaseConfigured()) {
    if (!cachedClient) {
      cachedClient = createClient(url, key);
    }
    return cachedClient;
  }

  // Safe dummy client to prevent crash if environment variables are not set
  const dummyQuery = {
    select: () => dummyQuery,
    order: () => dummyQuery,
    eq: () => dummyQuery,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  };

  const dummyClient: any = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => dummyQuery,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };

  return dummyClient as SupabaseClient;
};
