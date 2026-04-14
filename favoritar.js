// favoritar.js

const sessaoRaw = localStorage.getItem('liberty_sessao');
const usuario = sessaoRaw ? JSON.parse(sessaoRaw) : null;

// Atualiza menu (Entrar / Nome)
const linkAcesso = document.getElementById('link-acesso');
if (linkAcesso && usuario) {
  linkAcesso.textContent = usuario.nome.split(' ')[0];
  linkAcesso.href = 'favoritos.html';
}

// Marca favoritos ao carregar
async function marcarFavoritos() {
  if (!usuario) return;

  const { data } = await db
    .from('favoritos')
    .select('produto_id')
    .eq('usuario_id', usuario.id);

  if (!data) return;

  data.forEach(f => {
    const btn = document.getElementById('fav-' + f.produto_id);
    if (btn) btn.classList.add('favoritado');
  });
}

// Toggle favorito
async function toggleFav(btn, produto_id) {
  if (!usuario) {
    if (confirm('Faça login para salvar favoritos.\n\nIr para o login?')) {
      window.location.href = 'login-cliente.html';
    }
    return;
  }

  const jaFav = btn.classList.contains('favoritado');

  // animação
  btn.classList.remove('pop');
  void btn.offsetWidth;
  btn.classList.add('pop');

  if (jaFav) {
    // REMOVE
    btn.classList.remove('favoritado');

    await db
      .from('favoritos')
      .delete()
      .eq('usuario_id', usuario.id)
      .eq('produto_id', produto_id);

    mostrarToast('Removido dos favoritos');

  } else {
    // ADD
    btn.classList.add('favoritado');

    await db
      .from('favoritos')
      .upsert(
        [{
          usuario_id: usuario.id,
          produto_id: produto_id
        }],
        { onConflict: 'usuario_id,produto_id' }
      );

    mostrarToast('Salvo nos favoritos');
  }
}

// Toast
let _toastTimer;
function mostrarToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;

  el.textContent = msg;
  el.style.opacity = '1';

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.style.opacity = '0';
  }, 2600);
}

marcarFavoritos();