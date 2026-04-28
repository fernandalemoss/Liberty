# 📘 Documentação — Liberty Perfumaria

**E-commerce de perfumes com painel admin, catálogo público e sistema de favoritos**

---

## 📁 Estrutura do Projeto

```
LIBERTY PERFUMARIA/
├── index.html              # Página inicial — catálogo público
├── index.css               # Estilos da loja
├── favoritar.js            # Lógica de favoritos (compartilhada)
├── supabase-config.js      # Configuração Supabase (chaves)
├── admin.html              # Painel Admin Completo (CRUD produtos + categorias + usuários)
├── adms.html               # Painel Admin Simplificado
├── adm.css                 # Estilos do admin
├── perfil.html             # Página de perfil do cliente (favoritos)
├── login-cliente.html      # Login/Cadastro
├── login.css               # Estilos de login
├── feminino.html           # Página categoria Feminino
├── masculino.html          # Página categoria Masculino
├── kits.html               # Página Kits
├── sobrenos.html           # Sobre Nós
├── contato.css             # Estilos de contato
├── LEIA-ME-SUPABASE.md     # Guia de configuração Supabase
├── imagens/                # (Bucket do Supabase Storage)
└── Liberty/                # Versão espelhada da loja
    ├── index.html
    ├── admin.html
    └── ...
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas

**`usuarios`**
```sql
id            UUID PRIMARY KEY
nome          TEXT NOT NULL
email         TEXT UNIQUE NOT NULL
senha         TEXT NOT NULL
admin         BOOLEAN DEFAULT false
criado_em     TIMESTAMP DEFAULT now()
```

**`produtos`**
```sql
id              UUID PRIMARY KEY
nome            TEXT NOT NULL
descricao       TEXT
preco           DECIMAL NOT NULL
estoque         INTEGER DEFAULT 0
sku             TEXT
imagem          TEXT           -- URL da imagem (Supabase Storage)
ativo           BOOLEAN DEFAULT true
categoria_id    UUID REFERENCES categorias(id)
criado_por      UUID REFERENCES usuarios(id)
atualizado_por  UUID REFERENCES usuarios(id)
criado_em       TIMESTAMP DEFAULT now()
atualizado_em   TIMESTAMP DEFAULT now()
```

**`categorias`**
```sql
id        UUID PRIMARY KEY
nome      TEXT NOT NULL
tipo      TEXT UNIQUE NOT NULL    -- slug: 'feminino', 'masculino', 'kits'
descricao TEXT
ativo     BOOLEAN DEFAULT true
criado_em TIMESTAMP DEFAULT now()
```

**`favoritos`**
```sql
id            UUID PRIMARY KEY
usuario_id    UUID REFERENCES usuarios(id) ON DELETE CASCADE
produto_id    UUID REFERENCES produtos(id) ON DELETE CASCADE
criado_em     TIMESTAMP DEFAULT now()
UNIQUE(usuario_id, produto_id)
```

---

## 🖼️ Storage (Supabase)

### Bucket: `imagens`
- **Tipo:** Public
- **Uso:** Armazenamento de imagens de produtos
- **URL padrão:** `https://[PROJETO].supabase.co/storage/v1/object/public/imagens/[ARQUIVO]`
- **Política RLS necessária:**
```sql
CREATE POLICY "Upload livre no bucket imagens"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'imagens');
```

---

## 🔧 Configuração Inicial

1. **Criar projeto no Supabase** (ver `LEIA-ME-SUPABASE.md`)
2. **Executar SQL** para criar tabelas
3. **Criar bucket `imagens`** no Storage
4. **Adicionar chaves** no `supabase-config.js`:
```js
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_KEY = 'sua-chave-publica-aqui';
```
5. **Desativar RLS** nas tabelas `usuarios`, `produtos`, `categorias`, `favoritos`

---

## 📱 Páginas e Funcionalidades

### `index.html` — Catálogo Público
- Grid responsivo de produtos
- Filtros por categoria (dinâmicos)
- Botão favorito (coração)
- Link WhatsApp por produto
- Contador de produtos
- **JS:** carrega produtos ativos da tabela `produtos` com JOIN `categorias`

### `feminino.html`, `masculino.html`, `kits.html`
- Estrutura idêntica ao index
- Filtram por categoria específica via parâmetro ou lógica própria

### `login-cliente.html`
- Abas: Entrar / Criar Conta
- Login: valida `email` + `senha` na tabela `usuarios`
- Cadastro: insere novo usuário com `admin = false`
- Sessão salva em `localStorage` como `liberty_sessao`

### `perfil.html`
- Acesso restrito (verifica sessão)
- Lista favoritos do usuário (JOIN `produtos` + `categorias`)
- Botão remover favorito
- Sair (limpa sessão)

### `admin.html` — Painel Admin
#### Abas:
1. **Produtos** — CRUD completo
   - Modal com campos: nome, descrição, preço, estoque, SKU, categoria, ativo
   - Upload de imagem → Supabase Storage (`imagens/`)
   - Preview da imagem antes de salvar
   - Validação: tamanho máx. 5MB, apenas imagens
2. **Categorias** — CRUD
   - Campos: nome, tipo (slug), descrição, ativo
3. **Usuários** — Visualização
   - Tabela read-only com todos os usuários

#### Upload de imagem (admin.html):
```js
- Input file escondido → botão estilizado
- Preview em tempo real
- Upload ao salvar: chama uploadImagem()
- URL salva no campo hidden 'p-imagem'
```
**Função `uploadImagem()`:**
- Gera nome único com timestamp
- Upload via `db.storage.from('imagens').upload()`
- Retorna URL pública: `${SUPABASE_URL}/storage/v1/object/public/imagens/${caminho}`

### `adms.html` — Painel Admin Simplificado
- Formulário único para adicionar produtos
- Upload de imagem integrado
- Sem tabela de visualização (apenas adição)

---

## 🎨 Tema Visual

**Cores:**
- Gold principal: `#c9a84c`
- Background: `#0a0a0a`
- Surface: `#111`
- Texto: `#e8dcc8`
- Muted: `rgba(232,220,200,0.45)`

**Fontes:**
- Títulos: `Cormorant Garamond` (serif)
- Corpo: `Jost` (sans-serif)

**Componentes notáveis:**
- Cards de produto com imagem + botão WhatsApp
- Botão favorito (coração SVG)
- Modais com animação `fadeUp`
- Toast notifications (parte inferior)

---

## 🔗 Integração WhatsApp

Todos os produtos têm link:
```
https://wa.me/5599999999999?text=Tenho%20interesse%20no%20[NOME_PRODUTO]
```
Número configurável em:
- `index.html` (linha 115)
- `perfil.html` (linha 148)

---

## ⚙️ Variáveis de Configuração

| Arquivo | Variável | Descrição |
|---------|----------|-----------|
| `supabase-config.js` | `SUPABASE_URL` | URL do projeto Supabase |
| `supabase-config.js` | `SUPABASE_KEY` | Chave pública (anon) |
| `admin.html` | `STORAGE_BUCKET` | Nome do bucket de imagens ('imagens') |
| `index.html` | `waBase` | número WhatsApp (hardcoded) |

---

## 🔐 Sistema de Autenticação

**Simples (sem JWT):**
- Login valida `email` + `senha` direto na tabela `usuarios`
- Sessão armazenada em `localStorage` como JSON:
```json
{
  "id": "uuid",
  "nome": "Fulano",
  "email": "fulano@email.com",
  "admin": true/false
}
```
- Rotas protegidas verificam `localStorage.getItem('liberty_sessao')`
- Admin: redireciona para `admin.html`
- Cliente: redireciona para `perfil.html`

---

## 📦 Funcionalidades por Página

| Página | Autentic. | Funções |
|--------|-----------|---------|
| `index.html` | Não | Grid produtos, filtrar categorias, favoritar (se logado) |
| `feminino.html` | Não | Mesmo index, filtro fixo Feminino |
| `masculino.html` | Não | Mesmo index, filtro fixo Masculino |
| `kits.html` | Não | Mesmo index, filtro fixo Kits |
| `login-cliente.html` | Não | Login, cadastro |
| `perfil.html` | Sim (cliente) | Lista favoritos, remover, sair |
| `admin.html` | Sim (admin) | CRUD produtos, categorias; view usuários |
| `adms.html` | Sim (admin) | Adicionar produtos apenas |

---

## 🚀 Como Adicionar um Produto (Admin)

1. Acesse `admin.html` (como admin)
2. Clique **"Novo produto"**
3. Preencha:
   - Nome
   - Descrição (opcional)
   - Preço (ex: 279.90)
   - Estoque (inteiro)
   - SKU (opcional)
   - **Imagem:** clique em "Escolher imagem" → selecione JPG/PNG/WEBP (máx. 5MB)
   - Categoria (selecione)
   - Ativo: Sim/Não
4. Clique **Salvar**
5. A imagem é enviada ao bucket `imagens` e a URL é gravada no campo `imagem` da tabela

**Nota:** O campo URL não aparece mais — apenas upload direto.

---

## 🐛 Troubleshooting

### Upload de imagem falha (403)
- **Causa:** Política RLS ausente no bucket `imagens`
- **Solução:** Executar no Supabase SQL:
```sql
CREATE POLICY "Upload livre no bucket imagens"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'imagens');
```

### Imagem não aparece no catálogo
- Verificar se o campo `imagem` da tabela `produtos` está preenchido com a URL completa
- Verificar se o bucket `imagens` está como **Public**
- Abrir console (F12) para erros de carregamento

### Login não funciona
- Verificar se a tabela `usuarios` existe e tem RLS desativado
- Testar credenciais diretamente no Supabase Table Editor
- Verificar se `supabase-config.js` tem as chaves corretas

### Campo de URL ainda aparece
- Limpar cache do navegador (Ctrl+Shift+Del)
- Verificar se o arquivo `admin.html` local é o modificado

---

## 📝 Manutenção

**Adicionar nova categoria:**
1. Admin → Categorias → Nova categoria
2. Nome: ex: "Feminino"
3. Tipo/Slug: ex: "feminino" (usado nas URLs/filtros)
4. Ativo: Sim

**Alterar número WhatsApp:**
- Editar `index.html` linha 115: `const waBase = 'https://wa.me/NUMERO?...'`
- Editar `perfil.html` linha 148

**Adicionar nova página de categoria:**
1. Copiar `index.html`
2. Renomear (ex: `nova-categoria.html`)
3. Modificar código JS para filtrar por categoria específica:
```js
// Na função carregarProdutos, adicionar filter:
.eq('categoria_id', ID_DA_CATEGORIA)
```
4. Atualizar menu em todas as páginas

---

## 🗂️ Tabelas — Relacionamentos

```
usuarios (1) ←——→ (N) favoritos (N) ←——→ (1) produtos
                                   ↓
                              (1) categorias
```

---

## 📦 Dependências Externas

- **Supabase JS v2** (CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`)
- **Google Fonts:** Cormorant Garamond + Jost
- **Ícones:** SVG inline (sem biblioteca externa)

---

## 🎯 Próximas Melhorias Sugeridas

- [ ] Adicionar edição em lote de produtos
- [ ] Upload múltiplo de imagens
- [ ] Redimensionamento automático no front-end antes do upload
- [ ] Histórico de alterações (audit log)
- [ ] Dashboard com gráficos de vendas (se adicionar tabela pedidos)
- [ ] Busca por nome/SKU no admin
- [ ] Ordenação de colunas na tabela
- [ ] Paginação no grid de produtos

---

**Última atualização:** 16/04/2025  
**Versão:** 1.0 (com upload Supabase Storage implementado)
