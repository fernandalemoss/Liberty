// supabase-config.js — configuração central do projeto
// Nunca suba este arquivo com chaves reais para o GitHub!
 
const SUPABASE_URL = 'https://hbihafvizwpvjiymdcol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ALtbA-cSOcSISJ0zswCwmg__xySRfxz';
 
// Chave do Resend para envio de emails (só usada no admin)
window.SUPABASE_URL = 'https://hbihafvizwpvjiymdcol.supabase.co';
window.SUPABASE_KEY = 'sb_publishable_ALtbA-cSOcSISJ0zswCwmg__xySRfxz';
 
// Cliente Supabase
const { createClient } = supabase;
const db = createClient('https://hbihafvizwpvjiymdcol.supabase.co', 'sb_publishable_ALtbA-cSOcSISJ0zswCwmg__xySRfxz');