import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://clszkizgqlhavarnruad.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_1f9RmKSeuoO1OBm7OY-e6A_hhSKQ7m1";

export const supabase = createClient(supabaseUrl, supabaseKey);
