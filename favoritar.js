// favoritar.js — lógica compartilhada de favoritos
// produto_id é BIGINT no banco — sempre usar Number()

const sessaoRaw = localStorage.getItem('liberty_sessao');
const usuario   = sessaoRaw ? JSON.parse(sessaoRaw) : null;

// Atualiza link do menu
const linkAcesso = document.getElementById('link-acesso');
if (linkAcesso) {
  if (usuario) {
    linkAcesso.textContent = usuario.nome.split(' ')[0];
    linkAcesso.href = usuario.admin ? 'admin.html' : 'perfil.html';
  } else {
    linkAcesso.textContent = 'Entrar';
    linkAcesso.href = 'login-cliente.html';
  }
}

// Marca corações dos produtos já favoritados
async function marcarFavoritos() {
  if (!usuario) return;
  const { data, error } = await db
    .from('favoritos')
    .select('produto_id')
    .eq('usuario_id', usuario.id);
  if (error || !data) return;
  data.forEach(f => {
    const btn = document.getElementById('fav-' + f.produto_id);
    if (btn) btn.classList.add('favoritado');
  });
}

// Toggle favorito — produto_id é BIGINT, sempre Number()
async function toggleFav(btn, produtoId) {
  if (!usuario) {
    if (confirm('Faça login para salvar favoritos.\n\nIr para o login?')) {
      window.location.href = 'login-cliente.html';
    }
    return;
  }

  const id    = Number(produtoId); // garante BIGINT
  const jaFav = btn.classList.contains('favoritado');

  // Animação imediata
  btn.classList.remove('pop');
  void btn.offsetWidth;
  btn.classList.add('pop');

  if (jaFav) {
    btn.classList.remove('favoritado');
    const { error } = await db
      .from('favoritos')
      .delete()
      .eq('usuario_id', usuario.id)
      .eq('produto_id', id);
    if (error) {
      btn.classList.add('favoritado');
      console.error('Erro ao remover favorito:', error.message);
      mostrarToast('Erro ao remover. Tente novamente.');
    } else {
      mostrarToast('Removido dos favoritos');
    }
  } else {
    btn.classList.add('favoritado');
    const { error } = await db
      .from('favoritos')
      .insert({ usuario_id: usuario.id, produto_id: id });
    if (error) {
      btn.classList.remove('favoritado');
      console.error('Erro ao favoritar:', error.message, error.code);
      mostrarToast('Erro ao salvar. Tente novamente.');
    } else {
      mostrarToast('Salvo nos favoritos');
    }
  }
}

let _tt;
function mostrarToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(_tt);
  _tt = setTimeout(() => el.style.opacity = '0', 2600);
}

marcarFavoritos();
