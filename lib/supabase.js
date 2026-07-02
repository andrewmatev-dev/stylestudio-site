// Supabase client for browser usage (auth, queries, storage uploads).
// Server-side code uses a separate admin client when needed.

import { createBrowserClient } from '@supabase/ssr';

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return _client;
}
