// supabase/functions/enviar-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, nomeProduto, precoFmt } = await req.json();

    // Lê a chave do ambiente — não precisa mais passar pelo browser
    const RESEND_KEY = Deno.env.get("RESEND_KEY");

    if (!RESEND_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_KEY não configurada nos secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || !nomeProduto) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: email, nomeProduto" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Liberty Perfumaria <onboarding@resend.dev>",
        to: [email],
        subject: `✨ ${nomeProduto} voltou ao estoque!`,
        html: `
          <div style="font-family:Helvetica,sans-serif;max-width:500px;margin:0 auto;background:#0f0f0f;color:#ede0c8;padding:40px 32px;">
            <h1 style="font-family:Georgia,serif;color:#c9a84c;letter-spacing:4px;font-weight:300;font-size:22px;text-align:center;margin-bottom:32px;">
              LIBERTY PERFUMARIA
            </h1>
            <div style="border-top:1px solid rgba(201,168,76,0.3);padding-top:32px;">
              <h2 style="color:#fff;font-family:Georgia,serif;font-weight:300;font-size:20px;margin-bottom:16px;">
                Boas notícias! 🎉
              </h2>
              <p style="color:rgba(237,224,200,0.7);line-height:1.7;margin-bottom:20px;">
                O perfume <strong style="color:#c9a84c;">${nomeProduto}</strong> que você estava aguardando voltou ao estoque!
              </p>
              <p style="color:rgba(237,224,200,0.7);line-height:1.7;margin-bottom:32px;">
                Preço: <strong style="color:#c9a84c;">${precoFmt}</strong>
              </p>
              <a href="https://wa.me/5599999999999?text=Olá!%20Quero%20comprar%20o%20${encodeURIComponent(nomeProduto)}%20que%20voltou%20ao%20estoque!"
                 style="display:inline-block;background:#c9a84c;color:#080808;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">
                COMPRAR AGORA
              </a>
            </div>
            <div style="margin-top:40px;border-top:1px solid rgba(201,168,76,0.1);padding-top:20px;text-align:center;">
              <p style="color:rgba(237,224,200,0.3);font-size:11px;letter-spacing:1px;">
                Liberty Perfumaria · Divinópolis, MG<br>
                Você recebeu este email pois solicitou aviso de estoque.
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data }),
        { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
