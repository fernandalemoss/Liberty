# Guia — Configurar Edge Function de Email (Resend + Supabase)

## Por que precisa disso?
O browser bloqueia chamadas diretas para a API do Resend por segurança (CORS).
A Edge Function roda no servidor do Supabase, sem esse bloqueio.

---

## PASSO 1 — Instalar o Supabase CLI

Abra o terminal no VS Code e rode:

```bash
npm install -g supabase
```

Confirme que instalou:
```bash
supabase --version
```

---

## PASSO 2 — Fazer login no Supabase CLI

```bash
supabase login
```

Vai abrir o browser pedindo autorização. Confirme e volte ao terminal.

---

## PASSO 3 — Vincular ao seu projeto

Na pasta do projeto Liberty, rode:

```bash
supabase link --project-ref SEU-PROJECT-REF
```

> Para achar o **Project Ref**: acesse o Supabase → seu projeto → **Settings → General → Reference ID**
> É um código como: `abcdefghijklmnop`

---

## PASSO 4 — Criar a estrutura da função

```bash
supabase functions new enviar-email
```

Isso cria a pasta:
```
supabase/
  functions/
    enviar-email/
      index.ts   ← substitua pelo arquivo enviar-email.ts que você baixou
```

Copie o conteúdo do arquivo `enviar-email.ts` para dentro de `supabase/functions/enviar-email/index.ts`

---

## PASSO 5 — Fazer deploy da função

```bash
supabase functions deploy enviar-email
```

Aguarde a mensagem de sucesso:
```
✓ Function enviar-email deployed
```

---

## PASSO 6 — Configurar a chave do Resend

No arquivo `supabase-config.js` do projeto, coloque sua chave:

```js
window.RESEND_KEY = 'sua_chave_resend_aqui';
```

> ⚠️ Não suba esse arquivo com a chave real para o GitHub!
> Adicione `supabase-config.js` no `.gitignore`

---

## PASSO 7 — Testar

1. Abra o painel admin
2. Vá em **Avisos Estoque**
3. Coloque um produto em estoque (edite o produto e coloque estoque > 0)
4. Clique em **Notificar** ao lado de um email cadastrado
5. O email deve chegar em alguns segundos

---

## Problema com o email do remetente

O Resend exige que o domínio do remetente seja verificado.
Enquanto não tiver um domínio próprio, use o domínio de teste deles:

```
from: "Liberty Perfumaria <onboarding@resend.dev>"
```

Isso funciona para testes mas os emails vão para **spam**.

Para emails reais chegarem na caixa de entrada:
1. Acesse **resend.com → Domains**
2. Adicione seu domínio (ex: libertyperfumaria.com.br)
3. Configure os registros DNS que o Resend pedir
4. Após verificado, troque o `from` na Edge Function para:
   ```
   from: "Liberty Perfumaria <noreply@libertyperfumaria.com.br>"
   ```
5. Redeploy: `supabase functions deploy enviar-email`

---

## Comandos úteis

```bash
# Ver logs da função em tempo real
supabase functions logs enviar-email

# Testar localmente antes de deployar
supabase functions serve enviar-email

# Listar funções deployadas
supabase functions list
```

---

## Estrutura final do projeto

```
Liberty/
├── supabase/
│   └── functions/
│       └── enviar-email/
│           └── index.ts      ← a Edge Function
├── index.html
├── admin.html
├── supabase-config.js        ← tem a RESEND_KEY (não suba no GitHub!)
└── ...
```
