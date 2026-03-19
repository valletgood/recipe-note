import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.',
  );
}

/** 서버 전용 클라이언트 — service role key로 RLS 우회 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
