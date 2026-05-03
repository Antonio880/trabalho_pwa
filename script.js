const CHAVE_STORAGE = 'catalogo_produtos';

const IMAGEM_PADRAO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180'%3E%3Crect fill='%230f3460' width='300' height='180'/%3E%3Ctext fill='%23e94560' font-family='sans-serif' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ESem imagem%3C/text%3E%3C/SVG%3E";

const PRODUTOS_EXEMPLO = [
  {
    id: 'ex1',
    nome: 'Fone Bluetooth Pro',
    preco: 299.90,
    categoria: 'Eletrônicos',
    descricao: 'Fone sem fio com cancelamento de ruído ativo e 30h de bateria.',
    imagem: 'https://picsum.photos/seed/fone/300/180',
    estoque: 15
  },
  {
    id: 'ex2',
    nome: 'Teclado Mecânico RGB',
    preco: 450.00,
    categoria: 'Eletrônicos',
    descricao: 'Teclado compacto 75% com switches blue e iluminação RGB completa.',
    imagem: 'https://picsum.photos/seed/teclado/300/180',
    estoque: 8
  },
  {
    id: 'ex3',
    nome: 'Camiseta Minimalista',
    preco: 89.90,
    categoria: 'Roupas',
    descricao: 'Camiseta de algodão premium, corte slim, disponível em várias cores.',
    imagem: 'https://picsum.photos/seed/camisa/300/180',
    estoque: 50
  },
  {
    id: 'ex4',
    nome: 'Café Especial 250g',
    preco: 42.00,
    categoria: 'Alimentos',
    descricao: 'Café arábica torrado médio, notas de caramelo e amêndoa.',
    imagem: 'https://picsum.photos/seed/cafe/300/180',
    estoque: 3
  },
  {
    id: 'ex5',
    nome: 'Mochila Urban Pack',
    preco: 189.90,
    categoria: 'Outros',
    descricao: 'Mochila resistente à água com porta USB e compartimento para notebook.',
    imagem: 'https://picsum.photos/seed/mochila/300/180',
    estoque: 12
  },
  {
    id: 'ex6',
    nome: 'Smartwatch Fit',
    preco: 599.00,
    categoria: 'Eletrônicos',
    descricao: 'Relógio inteligente com monitor cardíaco, GPS e 7 dias de bateria.',
    imagem: 'https://picsum.photos/seed/watch/300/180',
    estoque: 4
  }
];

function carregarProdutos() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  return dados ? JSON.parse(dados) : null;
}

function salvarProdutos(lista) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
}

function obterTodos() {
  let lista = carregarProdutos();
  if (!lista) {
    lista = PRODUTOS_EXEMPLO;
    salvarProdutos(lista);
  }
  return lista;
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function criarProduto(dados) {
  const lista = obterTodos();
  const novoProduto = { id: gerarId(), ...dados };
  lista.push(novoProduto);
  salvarProdutos(lista);
  return novoProduto;
}

function atualizarProduto(id, dados) {
  const lista = obterTodos();
  const indice = lista.findIndex(function (p) { return p.id === id; });
  if (indice === -1) return null;
  lista[indice] = { id: id, ...dados };
  salvarProdutos(lista);
  return lista[indice];
}

function deletarProduto(id) {
  let lista = obterTodos();
  lista = lista.filter(function (p) { return p.id !== id; });
  salvarProdutos(lista);
}

function buscarProdutos(termo, categoria) {
  const lista = obterTodos();
  const termoMinusculo = termo.toLowerCase().trim();

  return lista.filter(function (p) {
    const nomeOuDescricao = p.nome.toLowerCase().includes(termoMinusculo) ||
      p.descricao.toLowerCase().includes(termoMinusculo);
    const categoriaOk = categoria === '' || p.categoria === categoria;
    return nomeOuDescricao && categoriaOk;
  });
}

function renderizarCatalogo(lista) {
  const grid = document.getElementById('grid-produtos');
  const semProdutos = document.getElementById('sem-produtos');
  const contador = document.getElementById('contador-resultados');

  grid.innerHTML = '';

  if (lista.length === 0) {
    semProdutos.classList.remove('oculto');
    contador.textContent = '';
    return;
  }

  semProdutos.classList.add('oculto');
  contador.textContent = lista.length + ' produto(s) encontrado(s)';

  lista.forEach(function (produto) {
    const card = criarCard(produto);
    grid.appendChild(card);
  });
}

function criarCard(produto) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = produto.id;

  const estoqueTexto = produto.estoque + ' un.';
  const badgeEstoqueBaixo = produto.estoque <= 5
    ? '<span class="badge-estoque-baixo">Estoque baixo</span>'
    : '';

  const precoFormatado = 'R$ ' + Number(produto.preco).toFixed(2).replace('.', ',');

  card.innerHTML =
    '<div class="card-imagem">' +
    '<img alt="' + escaparHTML(produto.nome) + '" data-src="' + (produto.imagem || '') + '">' +
    '<span class="badge-categoria">' + escaparHTML(produto.categoria) + '</span>' +
    badgeEstoqueBaixo +
    '</div>' +
    '<div class="card-corpo">' +
    '<h3 class="card-nome">' + escaparHTML(produto.nome) + '</h3>' +
    '<p class="card-descricao">' + escaparHTML(produto.descricao || '') + '</p>' +
    '<div class="card-rodape">' +
    '<span class="card-preco">' + precoFormatado + '</span>' +
    '<span class="card-estoque">' + estoqueTexto + '</span>' +
    '</div>' +
    '</div>' +
    '<div class="card-acoes">' +
    '<button class="btn-editar" data-id="' + produto.id + '">Editar</button>' +
    '<button class="btn-excluir" data-id="' + produto.id + '">Excluir</button>' +
    '</div>';

  const img = card.querySelector('img');
  carregarImagem(img, produto.imagem);

  return card;
}

function carregarImagem(img, src) {
  if (!src) {
    img.src = IMAGEM_PADRAO;
    return;
  }
  img.src = src;
  img.onerror = function () {
    this.src = IMAGEM_PADRAO;
    this.onerror = null;
  };
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(texto)));
  return div.innerHTML;
}

let idEditando = null;

function abrirModal(produto) {
  const overlay = document.getElementById('overlay-modal');
  const titulo = document.getElementById('modal-titulo');

  if (produto) {
    idEditando = produto.id;
    titulo.textContent = 'Editar Produto';
    document.getElementById('campo-nome').value = produto.nome;
    document.getElementById('campo-preco').value = produto.preco;
    document.getElementById('campo-estoque').value = produto.estoque;
    document.getElementById('campo-categoria').value = produto.categoria;
    document.getElementById('campo-imagem').value = produto.imagem || '';
    document.getElementById('campo-descricao').value = produto.descricao || '';
  } else {
    idEditando = null;
    titulo.textContent = 'Adicionar Produto';
    document.getElementById('form-produto').reset();
  }

  overlay.classList.remove('oculto');
  document.getElementById('campo-nome').focus();
}

function fecharModal() {
  document.getElementById('overlay-modal').classList.add('oculto');
  idEditando = null;
}

function submeterForm(evento) {
  evento.preventDefault();

  const nome = document.getElementById('campo-nome').value.trim();
  const preco = parseFloat(document.getElementById('campo-preco').value);
  const estoque = parseInt(document.getElementById('campo-estoque').value);
  const categoria = document.getElementById('campo-categoria').value;
  const imagem = document.getElementById('campo-imagem').value.trim();
  const descricao = document.getElementById('campo-descricao').value.trim();

  if (!nome || isNaN(preco) || isNaN(estoque) || !categoria) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const dados = { nome, preco, estoque, categoria, imagem, descricao };

  if (idEditando) {
    atualizarProduto(idEditando, dados);
  } else {
    criarProduto(dados);
  }

  fecharModal();
  atualizarListaFiltrada();
}

function iniciarParallax() {
  var heroBg = document.getElementById('hero-bg');
  var heroConteudo = document.getElementById('hero-conteudo');

  document.addEventListener('mousemove', function (e) {
    var dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    var dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    heroBg.style.transform = 'translate(' + (dx * 40) + 'px, ' + (dy * 22) + 'px)';
    heroConteudo.style.transform = 'translate(' + (dx * 16) + 'px, ' + (dy * 9) + 'px)';
  });
}

function atualizarListaFiltrada() {
  const termo = document.getElementById('busca').value;
  const categoria = document.getElementById('filtro-categoria').value;
  const resultado = buscarProdutos(termo, categoria);
  renderizarCatalogo(resultado);
}

function inicializar() {
  renderizarCatalogo(obterTodos());

  iniciarParallax();
  document.getElementById('btn-adicionar').addEventListener('click', function () {
    abrirModal(null);
  });
  document.getElementById('btn-hero-adicionar').addEventListener('click', function () {
    abrirModal(null);
  });

  document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);
  document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
  document.getElementById('overlay-modal').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharModal();
  });
  document.getElementById('form-produto').addEventListener('submit', submeterForm);
  document.getElementById('busca').addEventListener('input', atualizarListaFiltrada);
  document.getElementById('filtro-categoria').addEventListener('change', atualizarListaFiltrada);

  document.getElementById('grid-produtos').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;

    var id = btn.dataset.id;

    if (btn.classList.contains('btn-editar')) {
      var lista = obterTodos();
      var produto = lista.find(function (p) { return p.id === id; });
      if (produto) abrirModal(produto);
    }

    if (btn.classList.contains('btn-excluir')) {
      var confirmar = confirm('Excluir o produto "' + btn.closest('.card').querySelector('.card-nome').textContent + '"?');
      if (confirmar) {
        deletarProduto(id);
        atualizarListaFiltrada();
      }
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (erro) {
      console.warn('Service Worker não registrado:', erro);
    });
  }
}

inicializar();
