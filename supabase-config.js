// ============================================================
//  supabase-config.js
//  Cole aqui as suas chaves do Supabase (veja o LEIA-ME.md)
// ============================================================

const SUPABASE_URL = 'https://hbihafvizwpvjiymdcol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ALtbA-cSOcSISJ0zswCwmg__xySRfxz';

// Cliente do Supabase (usado em todas as páginas)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);
