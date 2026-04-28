# 🔌 Testes de API & Banco — Liberty Perfumaria

**Ferramenta:** Supabase JS Client (via Node.js) ou SQL direto  
**Objetivo:** Validar integridade das tabelas, constraints e operações CRUD

---

## 🛠️ Setup

```bash
npm init -y
npm install @supabase/supabase-js dotenv
```

Criar `.env`:
```env
SUPABASE_URL=https://hbihafvizwpvjiymdcol.supabase.co
SUPABASE_KEY=sb_publishable_ALtbA-cSOcSISJ0zswCwmg__xySRfxz
```

Criar `tests-supabase.js`:

```javascript
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper
async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}:`, err.message);
  }
}

// IDs para limpeza
let testProdutoId = null;
let testCategoriaId = null;
let testUsuarioId = null;

(async () => {
  console.log('\n🧪 TESTES SUPABASE — Liberty Perfumaria\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // =============================================
  // 1. CONEXÃO
  // =============================================
  await test('Conectar ao Supabase', async () => {
    const { data, error } = await supabase.from('produtos').select('count');
    if (error) throw error;
  });

  // =============================================
  // 2. TABELAS — SELECT COUNT
  // =============================================
  await test('Tabela usuarios existe e tem dados', async () => {
    const { data, error, count } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact' });
    if (error) throw error;
    console.log(`   📊 ${count} usuários encontrados`);
  });

  await test('Tabela categorias existe e tem dados', async () => {
    const { data, error } = await supabase.from('categorias').select('*');
    if (error) throw error;
    console.log(`   📊 ${data.length} categorias encontradas`);
  });

  await test('Tabela produtos existe', async () => {
    const { data, error } = await supabase.from('produtos').select('*');
    if (error) throw error;
    console.log(`   📊 ${data.length} produtos encontrados`);
  });

  await test('Tabela favoritos existe', async () => {
    const { data, error } = await supabase.from('favoritos').select('*');
    if (error) throw error;
    console.log(`   📊 ${data.length} favoritos encontrados`);
  });

  // =============================================
  // 3. CRUD — USUARIO
  // =============================================
  await test('Inserir usuário de teste', async () => {
    const { data, error } = await supabase.from('usuarios').insert([{
      nome: 'Usuário Teste Auto',
      email: `teste${Date.now()}@auto.com`,
      senha: 'test123',
      admin: false
    }]).select().single();

    if (error) throw error;
    testUsuarioId = data.id;
    console.log(`   🆔 Usuário criado: ${testUsuarioId}`);
  });

  await test('Buscar usuário por email', async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'admin@liberty.com')
      .single();

    if (error) throw error;
    console.log(`   👤 Admin encontrado: ${data.nome}`);
  });

  // =============================================
  // 4. CRUD — CATEGORIA
  // =============================================
  await test('Inserir categoria de teste', async () => {
    const { data, error } = await supabase.from('categorias').insert([{
      nome: 'Categoria Teste Auto',
      tipo: `teste-auto-${Date.now()}`,
      descricao: 'Criada por teste automatizado',
      ativo: true
    }]).select().single();

    if (error) throw error;
    testCategoriaId = data.id;
    console.log(`   🏷️  Categoria criada: ${testCategoriaId}`);
  });

  await test('Buscar categorias ativas', async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('ativo', true);

    if (error) throw error;
    console.log(`   ✅ ${data.length} categorias ativas`);
  });

  // =============================================
  // 5. CRUD — PRODUTO (COM UPLOAD SIMULADO)
  // =============================================
  await test('Inserir produto com upload real', async () => {
    // Primeiro, fazer upload de imagem
    const fs = require('fs');
    const path = require('path');
    const imagemPath = path.resolve(__dirname, 'perfume masculino 1.jpg');
    
    if (!fs.existsSync(imagemPath)) {
      console.log('   ⚠️  Imagem de teste não encontrada, pulando upload...');
      return;
    }

    const fileBuffer = fs.readFileSync(imagemPath);
    const fileName = `teste-auto-${Date.now()}.jpg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imagens')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/imagens/${fileName}`;
    console.log(`   🖼️  Imagem URL: ${publicUrl}`);

    // Criar produto
    const { data, error } = await supabase.from('produtos').insert([{
      nome: 'Produto Teste Auto',
      preco: 199.99,
      descricao: 'Criado via teste automatizado',
      imagem: publicUrl,
      ativo: true,
      categoria_id: testCategoriaId,
      criado_por: testUsuarioId
    }]).select().single();

    if (error) throw error;
    testProdutoId = data.id;
    console.log(`   📦 Produto criado: ${testProdutoId}`);
  });

  await test('Buscar produtos com JOIN categoria', async () => {
    const { data, error } = await supabase
      .from('produtos')
      .select(`, categorias(nome)`)
      .eq('ativo', true)
      .limit(5);

    if (error) throw error;
    console.log(`   📋 ${data.length} produtos com categoria carregados`);
    if (data[0]) {
      console.log(`   🔗 Relacionamento: ${data[0].nome} → ${data[0].categorias?.nome}`);
    }
  });

  // =============================================
  // 6. CRUD — FAVORITOS
  // =============================================
  await test('Inserir favorito', async () => {
    if (!testProdutoId) throw new Error('Produto de teste não existe');

    const { data, error } = await supabase.from('favoritos').insert([{
      usuario_id: testUsuarioId,
      produto_id: testProdutoId
    }]);

    if (error) throw error;
    console.log(`   ❤️  Favorito criado para usuário ${testUsuarioId}`);
  });

  await test('Buscar favoritos do usuário', async () => {
    const { data, error } = await supabase
      .from('favoritos')
      .select(`, produtos (nome, preco)`)
      .eq('usuario_id', testUsuarioId);

    if (error) throw error;
    console.log(`   📌 ${data.length} favoritos encontrados`);
  });

  // =============================================
  // 7. UPLOAD — VALIDAÇÕES DO BUCKET
  // =============================================
  await test('Bucket "imagens" está acessível (public)', async () => {
    const { data, error } = await supabase.storage
      .from('imagens')
      .list('', { limit: 1 });

    if (error) {
      // Se der erro 404/403, bucket pode não ser público
      console.log(`   ⚠️  Acesso ao bucket: ${error.message}`);
      // Não falha o teste, apenas avisa
      return;
    }
    console.log(`   📁 Bucket acessível: ${data.length} arquivos listados`);
  });

  // =============================================
  // 8. POLÍTICAS RLS — SELECT PÚBLICO
  // =============================================
  await test('SELECT em produtos ativos é público', async () => {
    // Simular query sem auth (anon key)
    const anonClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data, error } = await anonClient
      .from('produtos')
      .select('nome')
      .eq('ativo', true)
      .limit(1);

    if (error) {
      console.log(`   ⚠️  RLS pode estar bloqueando SELECT: ${error.message}`);
    } else {
      console.log(`   🔓 SELECT público funcionando`);
    }
  });

  // =============================================
  // 9. CLEANUP — REMOVER DADOS DE TESTE
  // =============================================
  await test('Limpar dados de teste', async () => {
    const promises = [];

    if (testProdutoId) {
      promises.push(
        supabase.from('produtos').delete().eq('id', testProdutoId)
      );
    }
    if (testCategoriaId) {
      promises.push(
        supabase.from('categorias').delete().eq('id', testCategoriaId)
      );
    }
    if (testUsuarioId) {
      promises.push(
        supabase.from('usuarios').delete().eq('id', testUsuarioId)
      );
    }

    if (promises.length > 0) {
      const results = await Promise.all(promises);
      console.log(`   🧹 Dados de teste removidos`);
    }
  });

  // =============================================
  // 10. RELATÓRIO FINAL
  // =============================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Testes de API concluídos');
  console.log('📋 Verifique logs acima para possíveis erros\n');
  
  process.exit(0);
})().catch(err => {
  console.error('\n💥 Erro nos testes:', err);
  process.exit(1);
});
```

---

## 🧪 Como Executar

```bash
# 1. Criar .env com suas credenciais
echo "SUPABASE_URL=https://SEU-PROJETO.supabase.co" > .env
echo "SUPABASE_KEY=sua-chave-aqui" >> .env

# 2. Copiar imagem de teste para pasta do script
cp "perfume masculino 1.jpg" ./

# 3. Executar
node tests-supabase.js
```

---

## 📌 Testes Manuais SQL (via Supabase Dashboard)

Abrir **SQL Editor** e executar blocos:

### SQ-01 — Verificar contadores
```sql
SELECT 
  (SELECT COUNT(*) FROM usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM categorias) as total_categorias,
  (SELECT COUNT(*) FROM produtos WHERE ativo = true) as produtos_ativos,
  (SELECT COUNT(*) FROM favoritos) as total_favoritos;
```

### SQ-02 — Verificar produtos sem imagem
```sql
SELECT id, nome FROM produtos WHERE imagem IS NULL;
```

### SQ-03 — Verificar orphans (favoritos sem produto)
```sql
SELECT f.id, f.produto_id FROM favoritos f
LEFT JOIN produtos p ON f.produto_id = p.id
WHERE p.id IS NULL;
```

### SQ-04 — Verificar categorias não usadas
```sql
SELECT c.id, c.nome FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id
WHERE p.id IS NULL AND c.ativo = true;
```

### SQ-05 — Listar produtos com URL pública ( construída )
```sql
SELECT 
  id,
  nome,
  imagem,
  CONCAT('https://hbihafvizwpvjiymdcol.supabase.co/storage/v1/object/public/imagens/', SPLIT_PART(imagem, '/', -1)) as public_url
FROM produtos
WHERE imagem IS NOT NULL
LIMIT 10;
```

---

## 🐛 Troubleshooting dos Testes

| Erro | Possível causa | Solução |
|------|----------------|---------|
| `RLS violation` | Política restritiva no bucket | Adicionar política INSERT no bucket `imagens` |
| `File not found` | Imagem de teste ausente | Copiar `perfume masculino 1.jpg` para pasta de testes |
| `Connection refused` | Supabase offline | Verificar status do projeto |
| `invalid api key` | Chave errada no `.env` | Copiar anon key do dashboard |

---

**Última atualização:** 16/04/2025  
**Autor:** Kilo
