// header.js — injeta o header correto em todas as páginas
// Uso: <div id="header-root"></div> + <script src="header.js"></script>

(function () {
  const sessaoRaw = localStorage.getItem('liberty_sessao');
  const usuario   = sessaoRaw ? JSON.parse(sessaoRaw) : null;

  // Detecta a página atual para marcar o link ativo
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html',    label: 'Início' },
    { href: 'feminino.html', label: 'Feminino' },
    { href: 'masculino.html',label: 'Masculino' },
    { href: 'kits.html',     label: 'Kits' },
    { href: 'sobrenos.html', label: 'Sobre Nós' },
  ];

  const menuLinks = links.map(l => {
    const ativo = paginaAtual === l.href ? 'style="color:var(--gold)"' : '';
    return `<a href="${l.href}" ${ativo}>${l.label}</a>`;
  }).join('');

  // Link de acesso (Entrar / nome do usuário)
  let linkAcesso;
  if (usuario) {
    const destino = usuario.admin ? 'admin.html' : 'perfil.html';
    linkAcesso = `<a href="${destino}" class="link-entrar">${usuario.nome.split(' ')[0]}</a>`;
  } else {
    linkAcesso = `<a href="login-cliente.html" class="link-entrar">Entrar</a>`;
  }

  const html = `
    <header>
      <div class="logo"><a href="index.html">Liberty Perfumaria</a></div>
      <div class="header-search">
        <input type="text" id="input-busca" placeholder="Buscar perfume..." autocomplete="off">
        <span class="search-icon">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <div class="search-results" id="search-results"></div>
      </div>
      <nav class="menu">
        ${menuLinks}
        ${linkAcesso}
      </nav>
    </header>`;

  // Injeta no elemento #header-root ou no início do body
  const root = document.getElementById('header-root');
  if (root) {
    root.innerHTML = html;
  } else {
    document.body.insertAdjacentHTML('afterbegin', html);
  }
})();
