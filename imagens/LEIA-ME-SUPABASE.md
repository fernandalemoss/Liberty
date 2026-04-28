# 🗄️ GUIA SUPABASE — Liberty Perfumaria

Siga esses passos ANTES de abrir o site.

---

## PASSO 1 — Criar conta gratuita
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Entre com sua conta do GitHub (ou crie uma conta)

---

## PASSO 2 — Criar um projeto
1. Clique em "New Project"
2. Preencha:
   - **Name:** liberty-perfumaria
   - **Database Password:** escolha uma senha forte (guarde ela!)
   - **Region:** South America (São Paulo)
3. Clique em "Create new project"
4. Aguarde ~1 minuto enquanto o banco é criado

---

## PASSO 3 — Criar a tabela de usuários
1. No menu lateral, clique em **SQL Editor**
2. Clique em "New query"
3. Cole o código abaixo e clique em **RUN**:

```sql
CREATE TABLE usuarios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  master BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT now()
);

CREATE TABLE favoritos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_email TEXT NOT NULL,
  produto_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  desc TEXT,
  preco TEXT,
  imagem TEXT,
  link_whatsapp TEXT,
  criado_em TIMESTAMP DEFAULT now(),
  UNIQUE(usuario_email, produto_id)
);
```

---

## PASSO 4 — Criar o administrador master
No SQL Editor, rode este comando (troque os dados pelo que quiser):

```sql
INSERT INTO usuarios (nome, email, senha, master)
VALUES ('Tatiane', 'admin@liberty.com', 'senha123', true);
```

⚠️ Guarde esse email e senha — é o acesso admin!

---

## PASSO 5 — Pegar as chaves do projeto
1. No menu lateral, clique em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie:
   - **Project URL** (parece com: https://xyzxyz.supabase.co)
   - **anon public key** (chave longa)

4. Abra o arquivo **supabase-config.js** e cole os valores:
```js
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_KEY = 'SUA-CHAVE-PUBLICA-AQUI';
```

---

## PASSO 6 — Desativar RLS (para simplificar)
1. Vá em **Table Editor**
2. Clique na tabela **usuarios**
3. Clique em **RLS disabled** para manter desativado
4. Repita para a tabela **favoritos**

---

✅ Pronto! Agora abra o `index.html` no navegador e tudo vai funcionar.
