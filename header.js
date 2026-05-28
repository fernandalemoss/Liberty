// header.js — menu de navegação compartilhado com mobile
(function () {
  const sessaoRaw   = localStorage.getItem('liberty_sessao');
  const usuario     = sessaoRaw ? JSON.parse(sessaoRaw) : null;
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html',    label: 'Início' },
    { href: 'sobrenos.html', label: 'Sobre Nós' },
  ];

  const menuLinks = links.map(l => {
    const ativo = paginaAtual === l.href ? 'style="color:var(--gold)"' : '';
    return `<a href="${l.href}" ${ativo}>${l.label}</a>`;
  }).join('');

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
      <button class="menu-toggle-site" id="menu-toggle-site" aria-label="Menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <nav class="menu" id="menu-site">
        ${menuLinks}
        ${linkAcesso}
      </nav>
    </header>`;

  const root = document.getElementById('header-root');
  if (root) root.innerHTML = html;
  else document.body.insertAdjacentHTML('afterbegin', html);

  // Aguarda DOM estar pronto para adicionar eventos
  function initMenu() {
    const toggle = document.getElementById('menu-toggle-site');
    const menu   = document.getElementById('menu-site');
    if (!toggle || !menu) return;

    const iconMenu   = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    const iconFechar = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const aberto = menu.classList.toggle('aberto');
      toggle.innerHTML = aberto ? iconFechar : iconMenu;
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('aberto');
        toggle.innerHTML = iconMenu;
      }
    });

    // Fecha ao clicar em link do menu
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('aberto');
        toggle.innerHTML = iconMenu;
      });
    });
  }

  // Inicializa após injetar HTML
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();
