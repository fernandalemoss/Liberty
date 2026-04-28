# ✅ Sanity Check Diário — Liberty Perfumaria

**Duração:** ~5 minutos  
**Objetivo:** Verificar saúde básica do sistema após deploy ou alterações

---

## 📋 Checklist Rápida

### A. Conexão Supabase
- [ ] Acessar `index.html` → produtos carregam (sem erro console)
- [ ] Abrir DevTools → Network → requests à `supabase.co` retornam 200
- [ ] Não há errors `StorageApiError` ou `RLS` no console

### B. Autenticação
- [ ] Login com admin: `admin@liberty.com` / `senha123` → redireciona para admin
- [ ] Logout limpa sessão e volta para home
- [ ] Cliente comum consegue cadastrar conta

### C. Admin — Produtos
- [ ] Botão "Novo produto" abre modal
- [ ] Upload de imagem < 5MB funciona (preview aparece)
- [ ] Salvar novo produto cria row no banco
- [ ] Produto criado aparece na tabela com imagem
- [ ] Editar produto altera dados sem erro
- [ ] Excluir produto remove da tabela

### D. Admin — Categorias
- [ ] Nova categoria criada
- [ ] Categoria aparece no select do modal produto
- [ ] Inativação funciona (não aparece no select)

### E. Catálogo Público
- [ ] Grid de produtos renderizado
- [ ] Filtros de categoria funcionam
- [ ] Imagens aparecem (não broken)
- [ ] Botão WhatsApp abre conversa com número correto
- [ ] Coração de favorito funciona (se logado)

### F. Favoritos (Cliente)
- [ ] Adicionar favorito mostra toast
- [ ] Remover favorito funciona
- [ ] Perfil lista favoritos corretamente

### G. Storage
- [ ] Bucket `imagens` listável (Dashboard → Storage)
- [ ] Arquivos fazem `INSERT` sem erro 403
- [ ] URLs públicas acessíveis (abrir em nova aba)

---

## 🚨 Validações de Emergência

Se algo **não passar**:

1. **Nada carrega (erro Supabase):**
   - Verificar `supabase-config.js` (URL e KEY)
   - Verificar se projeto Supabase está online

2. **Upload falha (403):**
   - Executar no SQL Editor:
   ```sql
   CREATE POLICY "Upload livre no bucket imagens"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'imagens');
   ```

3. **Login falha:**
   - Verificar tabela `usuarios` existe e tem RLS desativado
   - Testar credenciais direto no Table Editor

4. **Imagens não aparecem:**
   - Verificar bucket `imagens` está **Public**
   - Verificar URL no campo `imagem` (deve ser completa)

---

## 🔄 Pós-Deploy

Após cada alteração/código novo:

1. Rodar sanity check
2. Verificar console (F12) por erros JS
3. Testar fluxo principal:
   ```
   Login Admin → Criar Produto (com img) → 
   Ver Home → Favoritar (como cliente) → 
   Ver Perfil
   ```

---

**Última revisão:** 16/04/2025  
**Versão:** 1.0
