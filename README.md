# 🕯️ Liberty Perfumaria — E-commerce

> Sistema de vendas de perfumes com painel admin, catálogo público e favoritos — integrado ao Supabase

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| **[DOCS.md](DOCS.md)** | Documentação técnica completa (arquitetura, tabelas, funcionalidades) |
| **[TESTES.md](TESTES.md)** | Casos de teste manuais (35+ cenários) |
| **[TESTES-AUTOMATIZADOS.md](TESTES-AUTOMATIZADOS.md)** | Suite Playwright para automação E2E |
| **[TESTES-API.md](TESTES-API.md)** | Testes de integração com Supabase (Node.js) |
| **[SANITY-CHECK.md](SANITY-CHECK.md)** | Checklist rápido para validação diária |
| **[LEIA-ME-SUPABASE.md](LEIA-ME-SUPABASE.md)** | Configuração inicial do Supabase |

---

## 🚀 Começo Rápido

### 1. Configurar Supabase
```bash
# Seguir LEIA-ME-SUPABASE.md
# 1. Criar projeto
# 2. Executar SQL das tabelas
# 3. Criar bucket "imagens" (Public)
# 4. Copiar chaves para supabase-config.js
```

### 2. Criar Admin
```sql
INSERT INTO usuarios (nome, email, senha, master)
VALUES ('Tatiane', 'fernandalemos.acad@gmail.com', 'senha123', true);
```

### 3. Abrir o sistema
```bash
# Abrir index.html no navegador
# OU usar Live Server (VS Code)
```

---

## 🗂️ Estrutura de Pastas

```
LIBERTY PERFUMARIA/
├── 📄 index.html              # Catálogo público
├── 📄 admin.html              # Painel Admin (CRUD completo)
├── 📄 adms.html               # Admin simplificado
├── 📄 login-cliente.html      # Login/Cadastro
├── 📄 perfil.html             # Perfil + favoritos
├── 📄 categorias/*.html       # Páginas de categoria
├── 📁 Liberty/                # Versão alternativa
├── 🗄️ supabase-config.js      # Config Supabase
├── 📘 DOCS.md                 # Documentação técnica
├── 🧪 TESTES.md               # Testes manuais
├── 🤖 TESTES-AUTOMATIZADOS.md # Playwright
├── 🔌 TESTES-API.md           # Testes API
└── ✅ SANITY-CHECK.md         # Checklist rápido
```

---

## 🎯 Funcionalidades

| Módulo | O que faz |
|--------|-----------|
| **Catálogo** | Grid responsivo, filtros por categoria, favoritar, WhatsApp |
| **Admin** | CRUD produtos (com upload de imagem), categorias, visualização usuários |
| **Favoritos** | Adicionar/remover, persistência por usuário |
| **Upload** | Supabase Storage (bucket `imagens`) com preview |

---

## 🔑 Credenciais Padrão

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | fernandalemos.acad@gmail.com | senha123 |

> ⚠️ **Alterar em produção!**

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Upload dá erro 403 | Criar policy RLS no bucket `imagens` (ver DOCS.md) |
| Login falha | Verificar RLS desativado na tabela `usuarios` |
| Imagem não aparece | Bucket `imagens` deve ser Public |
| Campo de URL ainda visível | Limpar cache (Ctrl+Shift+Del) |

---

## 🛠️ Stack Tecnológica

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **Estilo:** Tema gold/preto, fontes Cormorant Garamond + Jost
- **Integração:** WhatsApp API (link `wa.me`)

---

## 📦 Dependências Externas

- Supabase JS SDK v2 (CDN)
- Google Fonts
- Nenhum build step necessário — puro HTML/CSS/JS

---

## 🎨 Design

**Paleta:** Gold (#c9a84c) + Preto (#0a0a0a)  
**Tipografia:** Serif para títulos, Sans para corpo  
**Componentes:** Cards, modais animados, toast notifications

---

## 📞 Contato & Suporte

- Issues: [GitHub Issues](https://github.com/Kilo-Org/kilocode/issues)
- Doc principal: `DOCS.md`

---

**Status:** ✅ Produção (com upload de imagens funcionando)  
**Última atualização:** 16 de Abril de 2025
