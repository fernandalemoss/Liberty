// produto-modal.js — popup de detalhes + avise-me + cliques

document.body.insertAdjacentHTML('beforeend', `
<div id="produto-overlay" style="display:none">
  <div id="produto-modal">
    <button id="modal-fechar" onclick="fecharModal()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <div id="modal-corpo">
      <div id="modal-img-wrap">
        <img id="modal-img" src="" alt="">
        <div id="modal-badge-desconto" style="display:none">
          <span id="modal-pct-desconto"></span> OFF
        </div>
      </div>
      <div id="modal-info">
        <div id="modal-cats">
          <span id="modal-cat" class="modal-tag"></span>
          <span id="modal-subcat" class="modal-tag sub"></span>
        </div>
        <h2 id="modal-nome"></h2>
        <div id="modal-precos">
          <span id="modal-preco-original" style="display:none"></span>
          <span id="modal-preco-final"></span>
          <span id="modal-economia" style="display:none"></span>
        </div>
        <div id="modal-estoque-wrap">
          <span id="modal-estoque-dot"></span>
          <span id="modal-estoque-txt"></span>
        </div>
        <p id="modal-desc-curta"></p>
        <div id="modal-desc-longa-wrap" style="display:none">
          <hr class="modal-sep">
          <p id="modal-desc-longa"></p>
        </div>
        <hr class="modal-sep">
        <div id="modal-acoes">
          <a id="modal-btn-wa" href="#" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Comprar via WhatsApp
          </a>
          <button id="modal-btn-fav" onclick="toggleFavModal()">
            <svg id="modal-fav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="18" height="18">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div id="modal-avise-wrap" style="display:none">
          <hr class="modal-sep">
          <p class="modal-avise-titulo">Avise-me quando voltar</p>
          <div class="modal-avise-form">
            <input type="email" id="modal-avise-email" placeholder="seu@email.com">
            <button onclick="cadastrarAviso()">Quero ser avisado</button>
          </div>
          <p class="modal-avise-msg" id="modal-avise-msg"></p>
        </div>
      </div>
    </div>
    <div id="modal-relacionados-wrap" style="display:none">
      <hr class="modal-sep-full">
      <p id="modal-relacionados-titulo"></p>
      <div id="modal-relacionados-grid"></div>
    </div>
  </div>
</div>
`);

const style = document.createElement('style');
style.textContent = `
#produto-overlay {
  position:fixed; inset:0; z-index:500;
  background:rgba(0,0,0,0.85); backdrop-filter:blur(6px);
  display:flex; align-items:center; justify-content:center;
  padding:20px; animation:overlayIn .25s ease;
}
@keyframes overlayIn { from{opacity:0} to{opacity:1} }
#produto-modal {
  background:#111; border:1px solid rgba(201,168,76,0.2);
  width:100%; max-width:900px; max-height:90vh; overflow-y:auto;
  position:relative; animation:modalIn .3s ease;
  scrollbar-width:thin; scrollbar-color:rgba(201,168,76,0.3) transparent;
}
@keyframes modalIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
#produto-modal::before {
  content:''; display:block; height:1px;
  background:linear-gradient(90deg,transparent,#c9a84c,transparent);
}
#modal-fechar {
  position:sticky; top:12px; left:100%; float:right; margin:12px 12px -40px 0;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
  color:rgba(237,224,200,0.5); width:36px; height:36px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:.2s; z-index:10; border-radius:2px; flex-shrink:0;
}
#modal-fechar:hover { background:rgba(255,255,255,0.1); color:#ede0c8; }
#modal-corpo { display:grid; grid-template-columns:1fr 1fr; gap:0; clear:both; }
#modal-img-wrap {
  position:relative; background:#0a0a0a; min-height:420px;
  display:flex; align-items:center; justify-content:center; overflow:hidden;
  border-right:1px solid rgba(201,168,76,0.08);
}
#modal-img { width:100%; height:100%; object-fit:contain; padding:32px; max-height:480px; transition:transform .5s ease; }
#modal-img:hover { transform:scale(1.04); }
#modal-badge-desconto {
  position:absolute; top:16px; left:16px;
  background:#c9a84c; color:#080808;
  font-family:'Jost',sans-serif; font-size:11px; font-weight:700;
  letter-spacing:2px; text-transform:uppercase; padding:6px 12px;
}
#modal-info { padding:40px 36px 36px; display:flex; flex-direction:column; }
#modal-cats { display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
.modal-tag {
  font-size:9px; letter-spacing:2px; text-transform:uppercase;
  padding:4px 10px; border:1px solid rgba(201,168,76,0.3);
  color:#c9a84c; background:rgba(201,168,76,0.06);
}
.modal-tag.sub { color:rgba(237,224,200,0.45); border-color:rgba(255,255,255,0.08); background:transparent; }
#modal-nome { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:#fff; letter-spacing:2px; line-height:1.2; margin-bottom:18px; }
#modal-precos { display:flex; align-items:baseline; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
#modal-preco-original { font-size:16px; color:rgba(237,224,200,0.35); text-decoration:line-through; font-family:'Jost',sans-serif; }
#modal-preco-final { font-size:28px; color:#c9a84c; font-weight:500; font-family:'Jost',sans-serif; letter-spacing:1px; }
#modal-economia { font-size:12px; background:rgba(80,180,100,0.12); border:1px solid rgba(80,180,100,0.25); color:#70c880; padding:3px 10px; letter-spacing:1px; }
#modal-estoque-wrap { display:flex; align-items:center; gap:8px; margin-bottom:20px; }
#modal-estoque-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
#modal-estoque-txt { font-size:12px; letter-spacing:1px; color:rgba(237,224,200,0.5); }
#modal-desc-curta { font-size:14px; color:rgba(237,224,200,0.55); line-height:1.7; letter-spacing:.5px; margin-bottom:4px; }
.modal-sep { border:none; border-top:1px solid rgba(201,168,76,0.08); margin:20px 0; }
#modal-desc-longa { font-size:14px; color:rgba(237,224,200,0.45); line-height:1.8; letter-spacing:.5px; }
#modal-acoes { display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }
#modal-btn-wa {
  flex:1; display:inline-flex; align-items:center; justify-content:center; gap:10px;
  padding:14px 20px; background:#c9a84c; color:#080808; text-decoration:none;
  font-family:'Jost',sans-serif; font-size:11px; font-weight:600;
  letter-spacing:3px; text-transform:uppercase; transition:background .2s;
}
#modal-btn-wa:hover { background:#e2c97e; }
#modal-btn-fav {
  width:50px; flex-shrink:0; background:transparent;
  border:1px solid rgba(201,168,76,0.25); color:#c9a84c; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:.2s;
}
#modal-btn-fav:hover { background:rgba(201,168,76,0.08); border-color:#c9a84c; }
#modal-btn-fav.favoritado #modal-fav-svg { fill:#c9a84c; }

/* AVISE-ME */
.modal-avise-titulo { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:rgba(237,224,200,0.45); margin-bottom:10px; }
.modal-avise-form { display:flex; gap:8px; }
.modal-avise-form input {
  flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.2);
  padding:10px 14px; font-family:'Jost',sans-serif; font-size:13px; color:#ede0c8; outline:none;
  transition:border-color .2s;
}
.modal-avise-form input:focus { border-color:#c9a84c; }
.modal-avise-form input::placeholder { color:rgba(237,224,200,0.2); }
.modal-avise-form button {
  background:transparent; border:1px solid rgba(201,168,76,0.4); color:#c9a84c;
  padding:10px 18px; font-family:'Jost',sans-serif; font-size:10px;
  letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:.2s; white-space:nowrap;
}
.modal-avise-form button:hover { background:rgba(201,168,76,0.1); border-color:#c9a84c; }
.modal-avise-msg { font-size:12px; margin-top:8px; letter-spacing:1px; }
.modal-avise-msg.ok   { color:#70c880; }
.modal-avise-msg.erro { color:#e07070; }

/* RELACIONADOS */
.modal-sep-full { border:none; border-top:1px solid rgba(201,168,76,0.08); margin:0; }
#modal-relacionados-wrap { padding:32px 36px 36px; }
#modal-relacionados-titulo { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:300; color:rgba(237,224,200,0.5); letter-spacing:3px; text-transform:uppercase; margin-bottom:20px; }
#modal-relacionados-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }
.rel-card { background:#0f0f0f; border:1px solid rgba(255,255,255,0.05); cursor:pointer; transition:border-color .25s,transform .25s; overflow:hidden; }
.rel-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-4px); }
.rel-card img { width:100%; height:140px; object-fit:contain; background:#0a0a0a; padding:12px; display:block; }
.rel-card-info { padding:10px 12px 12px; }
.rel-card-nome { font-family:'Cormorant Garamond',serif; font-size:15px; color:#fff; letter-spacing:.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rel-card-preco { font-size:13px; color:#c9a84c; margin-top:3px; font-weight:500; }
.rel-card-desc { font-size:11px; color:rgba(237,224,200,0.35); margin-top:2px; letter-spacing:.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

@media (max-width:700px) {
  #modal-corpo { grid-template-columns:1fr; }
  #modal-img-wrap { min-height:260px; border-right:none; border-bottom:1px solid rgba(201,168,76,0.08); }
  #modal-info { padding:24px 20px; }
  #modal-nome { font-size:24px; }
  #modal-relacionados-wrap { padding:24px 20px; }
  .modal-avise-form { flex-direction:column; }
}
`;
document.head.appendChild(style);

let produtoAtual = null;

async function abrirModal(produtoId) {
  const overlay = document.getElementById('produto-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('produto-modal').scrollTop = 0;
  document.getElementById('modal-relacionados-wrap').style.display = 'none';
  document.getElementById('modal-img').src = '';
  document.getElementById('modal-avise-msg').textContent = '';
  document.getElementById('modal-avise-email').value = '';

  // Registra clique para o dashboard
  await db.from('produto_cliques').insert({ produto_id: Number(produtoId) });

  const { data: p, error } = await db
    .from('produtos')
    .select('*, subcategorias(id, nome, categoria_id, categorias(id, nome))')
    .eq('id', produtoId)
    .single();

  if (error || !p) { fecharModal(); return; }
  produtoAtual = p;

  document.getElementById('modal-img').src = p.imagem || '';
  document.getElementById('modal-img').alt = p.nome;

  const desconto = p.desconto || 0;
  const badgeEl  = document.getElementById('modal-badge-desconto');
  if (desconto > 0) {
    document.getElementById('modal-pct-desconto').textContent = `-${desconto}%`;
    badgeEl.style.display = 'block';
  } else {
    badgeEl.style.display = 'none';
  }

  const catNome  = p.subcategorias?.categorias?.nome || '';
  const subNome  = p.subcategorias?.nome || '';
  const catEl    = document.getElementById('modal-cat');
  const subcatEl = document.getElementById('modal-subcat');
  catEl.textContent    = catNome; catEl.style.display    = catNome ? 'inline' : 'none';
  subcatEl.textContent = subNome; subcatEl.style.display = subNome ? 'inline' : 'none';

  document.getElementById('modal-nome').textContent = p.nome;

  const precoOriginal = Number(p.preco);
  const precoFinal    = desconto > 0 ? precoOriginal * (1 - desconto / 100) : precoOriginal;
  const economia      = precoOriginal - precoFinal;
  const fmtBRL = v => 'R$ ' + v.toFixed(2).replace('.', ',');

  document.getElementById('modal-preco-final').textContent = fmtBRL(precoFinal);
  const elOrig = document.getElementById('modal-preco-original');
  const elEcon = document.getElementById('modal-economia');
  if (desconto > 0) {
    elOrig.textContent = fmtBRL(precoOriginal); elOrig.style.display = 'inline';
    elEcon.textContent = `Economia de ${fmtBRL(economia)}`; elEcon.style.display = 'inline';
  } else {
    elOrig.style.display = 'none'; elEcon.style.display = 'none';
  }

  const estoque = p.estoque ?? 0;
  const dotEl   = document.getElementById('modal-estoque-dot');
  const txtEl   = document.getElementById('modal-estoque-txt');
  const aviseWrap = document.getElementById('modal-avise-wrap');
  const btnWa     = document.getElementById('modal-btn-wa');

  if (estoque === 0) {
    dotEl.style.background = '#e07070';
    txtEl.textContent = 'Produto esgotado';
    btnWa.style.opacity = '0.3';
    btnWa.style.pointerEvents = 'none';
    btnWa.innerHTML = 'Produto esgotado';
    aviseWrap.style.display = 'block';
  } else if (estoque <= 5) {
    dotEl.style.background = '#f0b429';
    txtEl.textContent = `Últimas ${estoque} unidade${estoque > 1 ? 's' : ''}`;
    btnWa.style.opacity = '1'; btnWa.style.pointerEvents = 'auto';
    const waLink = `https://wa.me/5599999999999?text=${encodeURIComponent(`Olá! Tenho interesse no perfume ${p.nome}.`)}`;
    btnWa.href = waLink;
    btnWa.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Comprar via WhatsApp`;
    aviseWrap.style.display = 'none';
  } else {
    dotEl.style.background = '#70c880';
    txtEl.textContent = 'Em estoque';
    btnWa.style.opacity = '1'; btnWa.style.pointerEvents = 'auto';
    const waLink = `https://wa.me/5599999999999?text=${encodeURIComponent(`Olá! Tenho interesse no perfume ${p.nome}.`)}`;
    btnWa.href = waLink;
    btnWa.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Comprar via WhatsApp`;
    aviseWrap.style.display = 'none';
  }

  document.getElementById('modal-desc-curta').textContent = p.descricao || '';
  const dlWrap = document.getElementById('modal-desc-longa-wrap');
  if (p.descricao_longa) {
    document.getElementById('modal-desc-longa').textContent = p.descricao_longa;
    dlWrap.style.display = 'block';
  } else { dlWrap.style.display = 'none'; }

  const favBtn = document.getElementById('modal-btn-fav');
  favBtn.classList.remove('favoritado');
  if (usuario) {
    const { data: fav } = await db.from('favoritos')
      .select('id').eq('usuario_id', usuario.id).eq('produto_id', p.id).single();
    if (fav) favBtn.classList.add('favoritado');
    // Preenche email no avise-me se logado
    document.getElementById('modal-avise-email').value = usuario.email || '';
  }

  await carregarRelacionados(p);
}

async function carregarRelacionados(p) {
  if (!p.subcategoria_id) return;
  const { data } = await db.from('produtos')
    .select('id, nome, descricao, preco, imagem, desconto')
    .eq('ativo', true).eq('subcategoria_id', p.subcategoria_id).neq('id', p.id).limit(6);

  const wrap  = document.getElementById('modal-relacionados-wrap');
  const grid  = document.getElementById('modal-relacionados-grid');
  const titulo = document.getElementById('modal-relacionados-titulo');
  if (!data || data.length === 0) { wrap.style.display = 'none'; return; }

  titulo.textContent = `Mais em ${p.subcategorias?.nome || 'perfumes'}`;
  wrap.style.display = 'block';
  grid.innerHTML = data.map(r => {
    const preco  = Number(r.preco);
    const desc   = r.desconto || 0;
    const final  = desc > 0 ? preco * (1 - desc / 100) : preco;
    const fmt    = 'R$ ' + final.toFixed(2).replace('.', ',');
    return `
      <div class="rel-card" onclick="abrirModal(${r.id})">
        <img src="${r.imagem||''}" alt="${r.nome}" onerror="this.style.display='none'">
        <div class="rel-card-info">
          <div class="rel-card-nome">${r.nome}</div>
          <div class="rel-card-preco">${fmt}${desc > 0 ? ` <small style="color:#70c880;font-size:10px">-${desc}%</small>` : ''}</div>
          <div class="rel-card-desc">${r.descricao||''}</div>
        </div>
      </div>`;
  }).join('');
}

async function cadastrarAviso() {
  const email  = document.getElementById('modal-avise-email').value.trim();
  const msgEl  = document.getElementById('modal-avise-msg');
  if (!email || !email.includes('@')) { msgEl.textContent = 'Email inválido.'; msgEl.className = 'modal-avise-msg erro'; return; }
  if (!produtoAtual) return;

  const { error } = await db.from('avisos_estoque')
    .insert({ produto_id: produtoAtual.id, email })
    .select().single();

  if (error && error.code === '23505') {
    msgEl.textContent = 'Você já está na lista de avisos!';
    msgEl.className = 'modal-avise-msg ok';
  } else if (error) {
    msgEl.textContent = 'Erro ao cadastrar. Tente novamente.';
    msgEl.className = 'modal-avise-msg erro';
  } else {
    msgEl.textContent = 'Você será avisado quando voltar ao estoque!';
    msgEl.className = 'modal-avise-msg ok';
  }
}

async function toggleFavModal() {
  if (!produtoAtual) return;
  const btn = document.getElementById('modal-btn-fav');
  await toggleFav(btn, produtoAtual.id);
  const cardBtn = document.getElementById('fav-' + produtoAtual.id);
  if (cardBtn) {
    if (btn.classList.contains('favoritado')) cardBtn.classList.add('favoritado');
    else cardBtn.classList.remove('favoritado');
  }
}

function fecharModal() {
  document.getElementById('produto-overlay').style.display = 'none';
  document.body.style.overflow = '';
  produtoAtual = null;
}

document.getElementById('produto-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) fecharModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });
