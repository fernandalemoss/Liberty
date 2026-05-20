# Liberty Perfumaria

Site de vendas de perfumes com catálogo dinâmico, sistema de login, favoritos, painel administrativo e integração com Supabase.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML, CSS, JavaScript puro |
| Banco de dados | Supabase (PostgreSQL) |
| Armazenamento de imagens | Supabase Storage |
| Versionamento | Git + GitHub |

---

## Estrutura de arquivos

```
Liberty/
│
├── index.html              # Página inicial — todos os perfumes
├── feminino.html           # Perfumes femininos filtrados por categoria
├── masculino.html          # Perfumes masculinos filtrados por categoria
├── kits.html               # Kits e combos
├── sobrenos.html           # Página institucional
├── login-cliente.html      # Login e cadastro de usuários
├── perfil.html             # Perfil do cliente — favoritos + editar dados
├── admin.html              # Painel administrativo (acesso master)
│
├── index.css               # CSS global compartilhado por todas as páginas
├── supabase-config.js      # Configuração do cliente Supabase (URL + chave)
├── favoritar.js            # Lógica de favoritos compartilhada
├── header.js               # Header de navegação compartilhado
├── produto-modal.js        # Modal de detalhes do produto
│
└── README.md               # Este arquivo
```

---

## Banco de dados (Supabase)

### Tabelas

#### `usuarios`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGINT (PK) | Auto incremento |
| nome | VARCHAR(100) | Nome completo |
| email | VARCHAR(150) | Email único |
| senha | TEXT | Senha do usuário |
| admin | BOOLEAN | `true` = acesso admin, `false` = cliente |
| criado_em | TIMESTAMP | Data de cadastro |

#### `categorias`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGINT (PK) | Auto incremento |
| nome | VARCHAR(100) | Nome exibido (ex: Feminino) |
| tipo | VARCHAR(100) | Slug único (ex: feminino) |
| descricao | TEXT | Descrição opcional |
| ativo | BOOLEAN | Visível no site |
| criado_em | TIMESTAMP | Data de criação |

#### `subcategorias`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGINT (PK) | Auto incremento |
| nome | VARCHAR(100) | Nome exibido (ex: Floral) |
| tipo | VARCHAR(100) | Slug único (ex: floral) |
| descricao | TEXT | Descrição opcional |
| ativo | BOOLEAN | Visível no site |
| categoria_id | BIGINT (FK) | Referência à tabela `categorias` |
| criado_em | TIMESTAMP | Data de criação |

#### `produtos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGINT (PK) | Auto incremento |
| nome | VARCHAR(150) | Nome do perfume |
| descricao | TEXT | Descrição curta (exibida no card) |
| descricao_longa | TEXT | Descrição detalhada (exibida no modal) |
| preco | DECIMAL(10,2) | Preço base |
| desconto | INTEGER | Percentual de desconto (0 = sem desconto) |
| estoque | INTEGER | Quantidade em estoque |
| imagem | TEXT | URL pública da imagem no Supabase Storage |
| sku | VARCHAR(80) | Código único do produto |
| ativo | BOOLEAN | Visível no site |
| subcategoria_id | BIGINT (FK) | Referência à tabela `subcategorias` |
| criado_por | BIGINT (FK) | Usuário que cadastrou |
| atualizado_por | BIGINT (FK) | Último usuário que editou |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Atualizado automaticamente via trigger |

#### `favoritos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGINT (PK) | Auto incremento |
| usuario_id | BIGINT (FK) | Referência à tabela `usuarios` |
| produto_id | BIGINT (FK) | Referência à tabela `produtos` |
| criado_em | TIMESTAMP | Data em que foi favoritado |

> `UNIQUE(usuario_id, produto_id)` — impede duplicatas

### Relacionamentos
```
categorias ──< subcategorias ──< produtos
usuarios ──< favoritos >── produtos
usuarios ──< produtos (criado_por / atualizado_por)
```

### Trigger automático
O campo `atualizado_em` da tabela `produtos` é atualizado automaticamente a cada `UPDATE` via trigger `trg_produtos_atualizado_em`.

### Supabase Storage
- Bucket: `imagens` (público)
- Imagens enviadas pelo admin são salvas com nome `produto_{timestamp}.ext`
- A URL pública é salva diretamente no campo `imagem` da tabela `produtos`

---

## Configuração do projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/fernandalemoss/Liberty.git
cd Liberty
```

### 2. Configurar o Supabase
Edite o arquivo `supabase-config.js` com as suas credenciais:
```js
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_KEY = 'SUA-CHAVE-PUBLICA-AQUI';
```

> ⚠️ Nunca suba as chaves reais para o GitHub público.

### 3. Criar as tabelas no Supabase
Acesse **SQL Editor** no Supabase e execute o script `banco.sql` (se disponível) ou crie as tabelas manualmente conforme a estrutura acima.

### 4. Criar o bucket de imagens
No Supabase, vá em **Storage → New bucket**:
- Nome: `imagens`
- Visibilidade: **Public**

### 5. Criar o usuário admin
```sql
INSERT INTO usuarios (nome, email, senha, admin)
VALUES ('Seu Nome', 'admin@seusite.com', 'sua_senha', true);
```

### 6. Abrir o projeto
Abra o `index.html` diretamente no navegador ou use uma extensão como **Live Server** no VS Code.

---

## Funcionalidades

### Site (cliente)
- Catálogo de perfumes carregado dinamicamente do banco
- Filtros por categoria e subcategoria
- Busca por nome em tempo real com dropdown
- Modal de detalhes do produto com foto, preço com desconto, indicador de estoque, descrição longa e produtos relacionados da mesma subcategoria
- Botão de favoritar (coração) em todos os cards — requer login
- Integração com WhatsApp para compra

### Conta do cliente
- Cadastro e login unificados em `login-cliente.html`
- Após login: redireciona para `perfil.html` (cliente) ou `admin.html` (admin)
- Página de perfil com duas abas:
  - **Favoritos** — lista de produtos salvos com opção de remover
  - **Editar Perfil** — alterar nome e senha

### Painel Admin (`admin.html`)
Acesso exclusivo para usuários com `admin = true`. Seções:

| Seção | O que faz |
|-------|-----------|
| Produtos | Criar, editar, excluir produtos. Upload de imagem direto para o Supabase Storage. Campos: nome, descrição curta, descrição longa, preço, desconto, estoque, SKU, subcategoria, ativo |
| Categorias | Gerenciar categorias principais (Feminino, Masculino, Kits) |
| Subcategorias | Gerenciar subcategorias vinculadas às categorias (Floral, Amadeirado...) |
| Usuários | Visualizar todos os usuários cadastrados |

### Segurança
- Login único para clientes e admin — o redirecionamento é feito pelo banco (`admin: true/false`)
- Clientes não sabem da existência da rota `/admin.html`
- Sessão salva no `localStorage` com `id`, `nome`, `email` e `admin`
- Páginas protegidas redirecionam para login se não houver sessão

---

## Arquivos JS compartilhados

### `supabase-config.js`
Inicializa o cliente Supabase. Deve ser o primeiro script carregado em todas as páginas.

### `header.js`
Gera o header de navegação dinamicamente em todas as páginas. Detecta a página atual para destacar o link ativo e exibe o nome do usuário logado no lugar do botão "Entrar".

### `favoritar.js`
- Atualiza o link de acesso no menu conforme sessão
- Marca os corações dos produtos já favoritados ao carregar a página
- Função `toggleFav(btn, produtoId)` — salva/remove do banco com `usuario_id` e `produto_id` (BIGINT)
- Função `mostrarToast(msg)` — exibe notificação no rodapé da tela

### `produto-modal.js`
Injeta e controla o popup de detalhes do produto:
- Busca dados completos do produto no banco ao abrir
- Exibe badge de desconto, preço original riscado e economia calculada
- Indicador de estoque colorido (verde / amarelo / vermelho)
- Botão favoritar sincronizado com o card da página
- Seção de produtos relacionados da mesma subcategoria (clicáveis)
- Fecha com ESC, clique fora ou botão X

---

## Como subir alterações para o GitHub

```bash
git add .
git commit -m "descrição do que foi alterado"
git push
```

---

## Melhorias futuras sugeridas

- [ ] Página de detalhe individual por produto (URL amigável)
- [ ] Galeria de múltiplas fotos por produto
- [ ] Avaliações e estrelas dos clientes
- [ ] Histórico de pedidos
- [ ] Cupom de desconto
- [ ] Ordenação por preço / mais recente
- [ ] Newsletter
- [ ] Botão WhatsApp flutuante em todas as páginas
- [ ] SEO com meta tags por produto
- [ ] Página 404 personalizada

---

## Créditos

Desenvolvido para **Liberty Perfumaria** — Divinópolis, MG.
Fundadora: Tatiane Moreira
