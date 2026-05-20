// ============================================================
//  supabase-config.js — configuração central do projeto
//  Nunca suba este arquivo com chaves reais para o GitHub!
// ============================================================

const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_KEY = 'SUA-CHAVE-PUBLICA-AQUI';

// Chave do Resend para envio de emails (só usada no admin)
// Crie em: https://resend.com/api-keys
window.RESEND_KEY = 'SUA-CHAVE-RESEND-AQUI';

// Cliente Supabase
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);
