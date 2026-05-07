# 🧪 Casos de Teste — Liberty Perfumaria

## 📋 Índice
1. [Testes de Configuração](#1-testes-de-configuração)
2. [Testes de Autenticação](#2-testes-de-autenticação)
3. [Testes de Catálogo Público](#3-testes-de-catálogo-público)
4. [Testes de Favoritos](#4-testes-de-favoritos)
5. [Testes de Admin — Produtos](#5-testes-de-admin---produtos)
6. [Testes de Admin — Categorias](#6-testes-de-admin---categorias)
7. [Testes de Upload de Imagem](#7-testes-de-upload-de-imagem)
8. [Testes de Integridade](#8-testes-de-integridade)
9. [Testes de UI/UX](#9-testes-de-uiux)
10. [Testes de Segurança](#10-testes-de-segurança)

---

## 1. Testes de Configuração

### TC-001 — Verificar estrutura de pastas e arquivos
**Objetivo:** Confirmar que todos os arquivos necessários estão presentes

**Pré-condições:**
- Projeto clonado/local

**Passos:**
1. Listar arquivos da raiz
2. Verificar existência de:
   - `admin.html`
   - `adms.html`
   - `index.html`
   - `login-cliente.html`
   - `perfil.html`
   - `supabase-config.js`
   - `DOCS.md`

**Resultado esperado:**
- Todos os arquivos listados existem

---

### TC-002 — Verificar chaves Supabase
**Objetivo:** Garantir que as credenciais estão corretas

**Passos:**
1. Abrir `supabase-config.js`
2. Verificar que `SUPABASE_URL` e `SUPABASE_KEY` estão preenchidos
3. Abrir console do navegador em qualquer página
4. Digitar: `console.log(db)`

**Resultado esperado:**
- `db` é um objeto Supabase Client (não undefined)
- Sem erros de conexão no console

---

### TC-003 — Verificar bucket `imagens` no Supabase
**Objetivo:** Confirmar que o bucket foi criado corretamente

**Passos:**
1. Acessar Supabase Dashboard → Storage
2. Verificar bucket `imagens` existe
3. Verificar política `Upload livre no bucket imagens`
4. Verificar que bucket está como **Public**

**Resultado esperado:**
- Bucket `imagens` listado
- Política RLS existe e permite INSERT
- Opção "Public" ativada

---

## 2. Testes de Autenticação

### TC-004 — Login com credenciais válidas
**Objetivo:** Login bem-sucedido como admin

**Pré-condições:**
- Usuário admin criado no Supabase
  - email: `admin@liberty.com`
  - senha: `senha123`

**Passos:**
1. Acessar `login-cliente.html`
2. Aba "Entrar" ativa
3. Digitar email: `admin@liberty.com`
4. Digitar senha: `senha123`
5. Clicar "Entrar"

**Resultado esperado:**
- Redirecionamento para `admin.html`
- Sidebar mostra "Produtos" ativo
- Nome do admin aparece no header

---

### TC-005 — Login com credenciais inválidas
**Objetivo:** Tratamento de erro no login

**Passos:**
1. Acessar `login-cliente.html`
2. Digitar email: `erro@test.com`
3. Digitar senha: `123`
4. Clicar "Entrar"

**Resultado esperado:**
- Mensagem de erro: "Email ou senha incorretos."
- Permanece na mesma página
- Campo senha limpo

---

### TC-006 — Cadastro de novo usuário
**Objetivo:** Registrar cliente comum

**Passos:**
1. Acessar `login-cliente.html`
2. Clicar na aba "Criar conta"
3. Preencher:
   - Nome: `João Silva`
   - Email: `joao@test.com`
   - Senha: `abc12345`
4. Clicar "Criar conta"

**Resultado esperado:**
- Mensagem de sucesso: "Conta criada! Bem-vinda, João!"
- Redirecionamento para `perfil.html` após ~1s
- Usuário aparece na tabela `usuarios` do Supabase com `admin = false`

---

### TC-007 — Logout
**Objetivo:** Encerrar sessão corretamente

**Pré-condições:**
- Usuário logado (admin ou cliente)

**Passos:**
1. Em qualquer página autenticada, clicar em "Sair"
2. Confirmar (se houver confirmação)

**Resultado esperado:**
- `localStorage` limpo (`liberty_sessao` removido)
- Redirecionamento para `index.html` ou `login-cliente.html`
- Link do menu muda de "Nome" para "Entrar"

---

## 3. Testes de Catálogo Público

### TC-008 — Carregamento de produtos na home
**Objetivo:** Grid exibe produtos ativos

**Pré-condições:**
- Pelo menos 3 produtos cadastrados no Supabase com `ativo = true`

**Passos:**
1. Acessar `index.html`
2. Esperar carregamento

**Resultado esperado:**
- aparece contagem: "3 perfumes disponíveis"
- Grid mostra cards com imagem, nome, descrição, preço
- Botão "Comprar via WhatsApp" em cada card
- Coração de favorito aparece se logado

---

### TC-009 — Filtro por categoria (home)
**Objetivo:** Botões de filtro funcionam

**Pré-condições:**
- Produtos com categorias diferentes (ex: Feminino, Masculino)

**Passos:**
1. Em `index.html`, localizar botões de filtro (abaixo do título)
2. Clicar em "Feminino"

**Resultado esperado:**
- Grid mostra apenas produtos da categoria "Feminino"
- Botão "Feminino" fica ativo (estilo gold)
- Contador atualiza quantidade

---

### TC-010 — Página de categoria específica
**Objetivo:** `feminino.html` mostra só produtos da categoria

**Pré-condições:**
- Categoria "Feminino" existe e tem produtos

**Passos:**
1. Acessar `feminino.html`
2. Verificar grid

**Resultado esperado:**
- Todos os produtos têm `categorias.nome = 'Feminino'`
- Filtro não aparece (página já é específica)

---

## 4. Testes de Favoritos

### TC-011 — Adicionar favorito (logado)
**Objetivo:** Coração preenche e salva no banco

**Pré-condições:**
- Usuário logado como cliente
- Página `index.html` aberta

**Passos:**
1. Localizar um produto no grid
2. Clicar no coração (ícone favorito)
3. Observe animação

**Resultado esperado:**
- Coração preenche (classe `favoritado`)
- Toast aparece: "Salvo nos favoritos"
- No Supabase, nova linha em `favoritos` com `usuario_id` e `produto_id`

---

### TC-012 — Remover favorito
**Objetivo:** Remover da lista de favoritos

**Pré-condições:**
- Produto já favoritado

**Passos:**
1. Clicar novamente no coração do mesmo produto

**Resultado esperado:**
- Coração volta a vazar
- Toast: "Removido dos favoritos"
- Row deletada da tabela `favoritos`

---

### TC-013 — Tentar favoritar sem login
**Objetivo:** Redirecionamento para login

**Pré-condições:**
- Não logado
- `index.html` aberta

**Passos:**
1. Clicar em um coração qualquer

**Resultado esperado:**
- Alerta JavaScript: "Faça login para salvar favoritos..."
- Botão "OK" redireciona para `login-cliente.html`

---

### TC-014 — Visualizar favoritos no perfil
**Objetivo:** Lista de favoritos aparece

**Pré-condições:**
- Usuário com pelo menos 2 favoritos

**Passos:**
1. Logar como cliente
2. Acessar `perfil.html`

**Resultado esperado:**
- Mostra "2 perfumes salvos"
- Cards com imagem, nome, preço, botão "Comprar via WhatsApp"
- Botão "Remover" em cada card

---

### TC-015 — Remover favorito do perfil
**Objetivo:** Excluir favorito pela página de perfil

**Passos:**
1. Em `perfil.html`, clicar em "Remover" de um produto
2. Confirmar (se houver confirmação JS)

**Resultado esperado:**
- Card desaparece com animação fade-out
- Contador diminui
- Row deletada da tabela `favoritos`

---

## 5. Testes de Admin — Produtos

### TC-016 — Abrir modal "Novo produto"
**Objetivo:** Modal aparece sobre a página

**Pré-condições:**
- Admin logado
- Em `admin.html`, aba "Produtos" ativa

**Passos:**
1. Clicar no botão "Novo produto" (topo da página)

**Resultado esperado:**
- Overlay escuro cobre tela
- Modal centralizado com animação `fadeUp`
- Campos: Nome, Descrição, Preço, Estoque, SKU, Categoria, Imagem, Ativo
- Botões "Salvar" e "Cancelar" visíveis

---

### TC-017 — Validação obrigatória de nome e preço
**Objetivo:** Não permite salvar sem campos obrigatórios

**Passos:**
1. Abrir modal novo produto
2. Preencher apenas Descrição
3. Clicar "Salvar"

**Resultado esperado:**
- Mensagem de erro no modal: "Nome e preço são obrigatórios."
- Modal permanece aberto

---

### TC-018 — Upload de imagem (novo produto)
**Objetivo:** Imagem enviada ao bucket e URL salva

**Pré-condições:**
- Bucket `imagens` criado e com política RLS
- Admin logado

**Passos:**
1. Abrir modal novo produto
2. Preencher Nome: "Test Perfume"
3. Preencher Preço: 199.90
4. Clicar em "Escolher imagem"
5. Selecionar arquivo JPG/PNG < 5MB
6. Ver preview aparecer (120×120)
7. Clicar "Salvar"

**Resultado esperado:**
- Mensagem "Fazendo upload da imagem..." aparece
- Após alguns segundos, modal fecha
- Toast: "Produto criado!"
- Produto aparece na tabela com imagem
- No Supabase:
  - Tabela `produtos` tem nova row com `imagem = URL completa`
  - Bucket `imagens` contém o arquivo

---

### TC-019 — Editar produto (sem mudar imagem)
**Objetivo:** Atualizar dados mantendo imagem atual

**Pré-condições:**
- Produto existente com imagem

**Passos:**
1. Na tabela, clicar "Editar" do produto
2. Modificar Preço para 299.90
3. Clicar "Salvar"

**Resultado esperado:**
- Modal fecha
- Toast: "Produto atualizado!"
- Tabela mostra novo preço
- Imagem permanece a mesma

---

### TC-020 — Editar produto (mudar imagem)
**Objetivo:** Substituir imagem do produto

**Passos:**
1. Editar produto existente
2. Selecionar nova imagem
3. Ver preview da nova imagem
4. Salvar

**Resultado esperado:**
- Upload da nova imagem feito
- URL atualizada no banco
- Nova imagem aparece na tabela
- Imagem anterior ainda existe no bucket (não é deletada)

---

### TC-021 — Excluir produto
**Objetivo:** Remover produto do catálogo

**Passos:**
1. Clicar "Excluir" de um produto na tabela
2. Confirmar alerta

**Resultado esperado:**
- Toast: "Produto excluído."
- Row some da tabela
- No Supabase: `DELETE FROM produtos WHERE id = ...`
- **Nota:** Imagem no bucket não é removida automaticamente

---

## 6. Testes de Admin — Categorias

### TC-022 — Criar categoria
**Objetivo:** Adicionar nova categoria

**Passos:**
1. Ir em "Categorias" na sidebar
2. Clicar "Nova categoria"
3. Preencher:
   - Nome: "Feminino"
   - Tipo/Slug: "feminino"
   - Descrição: "Perfumes femininos"
4. Ativo: Sim
5. Salvar

**Resultado esperado:**
- Toast: "Categoria criada!"
- Categoria aparece na tabela
- Slug aparece no select de categorias do modal produto

---

### TC-023 — Editar categoria
**Objetivo:** Modificar categoria existente

**Passos:**
1. Clicar "Editar" de uma categoria
2. Alterar Nome para "Feminino Floral"
3. Salvar

**Resultado esperado:**
- Categoria atualizada na tabela
- Nome reflete nos produtos que a usam (via JOIN)

---

### TC-024 — Excluir categoria com produtos vinculados
**Objetivo:** Verificar proteção de integridade

**Pré-condições:**
- Categoria que tem produtos associados

**Passos:**
1. Tentar excluir essa categoria

**Resultado esperado:**
- Erro: "Erro ao excluir (pode ter produtos vinculados)."
- Categoria não é removida
- Produtos permanecem com `categoria_id` intacto

---

## 7. Testes de Upload de Imagem

### TC-025 — Upload de arquivo muito grande
**Objetivo:** Validar limite de 5MB

**Pré-condições:**
- Admin logado

**Passos:**
1. Abrir modal novo produto
2. Selecionar imagem > 5MB
3. Observar

**Resultado esperado:**
- Toast: "Imagem muito grande (máx. 5MB)"
- Upload não inicia
- Campo arquivo limpo

---

### TC-026 — Upload de arquivo não-imagem
**Objetivo:** Validar tipo de arquivo

**Passos:**
1. Selecionar arquivo `.txt` ou `.pdf`

**Resultado esperado:**
- Toast: "Selecione um arquivo de imagem válido"
- Upload não ocorre

---

### TC-027 — Nome do arquivo no bucket
**Objetivo:** Padronização de nomes

**Passos:**
1. Fazer upload de `perfume.jpg` (produto sem ID)
2. Verificar nome no bucket Supabase

**Resultado esperado:**
- Nome: `[timestamp]-[timestamp].jpg` (ex: `1713294847123-1713294847123.jpg`)
- Para edição: `[id]-[timestamp].jpg`

---

### TC-028 — URL gerada corretamente
**Objetivo:** Formato da URL salva

**Passos:**
1. Fazer upload
2. Verificar valor no campo `imagem` do banco

**Resultado esperado:**
```
https://[SEU-PROJETO].supabase.co/storage/v1/object/public/imagens/NOME_ARQUIVO.jpg
```

---

## 8. Testes de Integridade

### TC-029 — Produto sem imagem
**Objetivo:** Permite salvar sem imagem

**Passos:**
1. Novo produto
2. Não selecionar imagem
3. Preencher nome e preço
4. Salvar

**Resultado esperado:**
- Produto criado com `imagem = null`
- Na tabela, coluna imagem vazia
- No grid público, `onerror` esconde img tag

---

### TC-030 — Categoria inativa não aparece no select
**Objetivo:** Filtro de categorias ativas

**Pré-condições:**
- Uma categoria com `ativo = false`

**Passos:**
1. Abrir modal "Novo produto"
2. Verificar select de categorias

**Resultado esperado:**
- Apenas categorias com `ativo = true` aparecem
- Categoria inativa não está no options list

---

### TC-031 — Estoque negativo não permitido
**Objetivo:** Validação de inteiro não-negativo

**Passos:**
1. Tentar digitar `-5` no campo estoque
2. Ou tentar salvar com valor negativo via console

**Resultado esperado:**
- Input `type="number" min="0"` previne entrada no UI
- No banco, valor negativo deveria ser rejeitado (se houver constraint)

---

## 9. Testes de UI/UX

### TC-032 — Responsividade do modal
**Objetivo:** Modal se adapta a telas menores

**Passos:**
1. Abrir DevTools (F12)
2. Ativar modo responsivo (Ctrl+Shift+M)
3. Definir width: 400px
4. Abrir modal

**Resultado esperado:**
- Modal tem `max-width: 520px` mas com `width: auto` ou `90%`
- Campos não quebram completamente
- Botões permanecem clicáveis

---

### TC-033 — Preview da imagem funciona
**Objetivo:** Image preview antes do upload

**Passos:**
1. Selecionar imagem
2. Antes de salvar, ver img preview

**Resultado esperado:**
- `<img id="p-imagem-preview">` tem `display: block`
- `src` é base64 data URL
- Tamanho 120×120, fundo preto, padding 8px

---

### TC-034 — Toast aparece e desaparece
**Objetivo:** Feedback visual de ações

**Passos:**
1. Realizar qualquer ação (ex: criar produto)
2. Observar toast inferior

**Resultado esperado:**
- Toast aparece com opacity 1
- Mensagem clara
- Some após ~2.8s com fade out

---

### TC-035 — Loading state no botão Salvar (opcional)
**Objetivo:** Indicar processo de upload

**Passos:**
1. Fazer upload de imagem
2. Observar botão durante envio

**Resultado esperado:**
- Botão "Salvar" poderia ficar com texto "Salvando..." ou spinner
*(Nota: implementação atual não tem loading state)*

---

## 10. Testes de Segurança

### TC-036 — Acesso sem login a admin.html
**Objetivo:** Redirecionamento automático

**Passos:**
1. Abrir nova aba anônima
2. Digitar `admin.html` diretamente

**Resultado esperado:**
- Redirecionado para `login-cliente.html`
- `localStorage` vazio não permite acesso

---

### TC-037 — Acesso admin por cliente comum
**Objetivo:** Cliente não acessa painel admin

**Pré-condições:**
- Usuário comum logado (`admin = false`)

**Passos:**
1. Tentar acessar `admin.html` diretamente

**Resultado esperado:**
- Redirecionado para `perfil.html`

---

### TC-038 — RLS desativado nas tabelas principais
**Objetivo:** Verificar configuração de segurança

**Passos:**
1. No Supabase Dashboard → Table Editor
2. Selecionar tabela `produtos`
3. Verificar Status: **RLS disabled**

**Resultado esperado:**
- RLS desativado em: `usuarios`, `produtos`, `categorias`, `favoritos`
- (Simplificação para projeto sem política complexa)

---

## 🧩 Matriz de Rastreabilidade

| TC | Requisito | Feature | Status |
|----|-----------|---------|--------|
| TC-004 | RF-001 Login | Autenticação | ⏳ |
| TC-006 | RF-002 Cadastro | Autenticação | ⏳ |
| TC-008 | RF-003 Catálogo | Loja | ⏳ |
| TC-011 | RF-004 Favoritos | Favoritos | ⏳ |
| TC-018 | RF-005 Upload | Admin | ⏳ |
| TC-022 | RF-006 Categorias | Admin | ⏳ |

---

## 🐛 Bugs Conhecidos

1. Upload de imagem não deleta arquivo anterior ao editar (acumula lixo no bucket)
2. Campo de select de categorias pode não atualizar após criar nova categoria (necessário recarregar página)
3. Sem validação de extensão no input file (confia em `accept` apenas)
4. Sem feedback visual de progresso no upload

---

## 🛠️ Como Executar Testes Manuais

1. **Preparar ambiente:**
   - Criar projeto Supabase
   - Executar SQL das tabelas
   - Criar bucket `imagens` (public)
   - Criar política RLS
   - Inserir admin

2. **Configurar app:**
   - Editar `supabase-config.js` com URL e key
   - Abrir `admin.html` em navegador

3. **Executar suite:**
   - Seguir ordem dos testes (1 → 10)
   - Anotar resultados em uma planilha ou no próprio arquivo
   - Marcar Status: ✅ Passou / ⚠️ Falhou / ❌ Bloqueado

4. **Reportar bugs:**
   - Incluir: steps to reproduce, expected vs actual, console logs, screenshots

---

**Última atualização:** 16/04/2025  
**Responsável:** Kilo (CLI)
