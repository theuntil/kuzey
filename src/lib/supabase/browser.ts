/**
 * SUPABASE BROWSER CLIENT
 * --------------------------------------------------
 * - Client Component'lerde kullanılır
 * - Anon public key kullanır
 * - Auth (login, logout, session) içindir
 */

import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
