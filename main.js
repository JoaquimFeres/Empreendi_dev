function sendMail() {
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        feedback__text: document.getElementById("feedback__text").value,
    };

    emailjs.send("service_cnqlqkw", "template_lggaxu6", parms)
        .then(function(response) {
            alert("Email enviado com sucesso!");
        })
        .catch(function(error) {
            console.error("Erro ao enviar o email:", error);
            alert("Ocorreu um erro ao enviar o email. Verifique os dados e tente novamente.");
        });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const items = document.querySelectorAll(".grid-item, .grid-item__empresas");

  // Impede que o form recarregue a página
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterItems();
  });

  // Permite filtrar em tempo real enquanto digita
  searchInput.addEventListener("input", filterItems);

function normalizeText(text) {
  return text
    .normalize("NFD") // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase(); // deixa tudo minúsculo
}

function filterItems() {
  const query = normalizeText(searchInput.value);

  items.forEach((item) => {
    const name = normalizeText(item.querySelector(".index__empresarios__texto, .empresas__empresas__texto").textContent);

    if (query === "" || name.includes(query)) {
      item.style.display = "block"; // mostra o item
    } else {
      item.style.display = "none"; // esconde o item
    }
  });
}

});

document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 9; // 3 linhas × 3 colunas
  const items = document.querySelectorAll(".grid-item, .grid-item__empresas");
  const pageButtons = document.querySelectorAll(".page-btn, .page-btn__empresas");

  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    items.forEach((item, index) => {
      if (index >= start && index < end) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    // Atualiza estilo ativo do botão
    pageButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.page-btn[data-page="${page}"], .page-btn__empresas[data-page="${page}"]`).classList.add("active");
  }

  // Clique nos botões
  pageButtons.forEach(button => {
    button.addEventListener("click", () => {
      const page = parseInt(button.dataset.page);
      showPage(page);
    });
  });

  // Exibir a primeira página ao carregar
  showPage(1);
});

// Mostrar/esconder filtros ao clicar no botão de menu (novo: integra filtros DENTRO da search-bar)
// ======== novo: animação de height suave e simétrica (abrir/fechar) ========
const menuBtn = document.querySelector(".menu-btn, .menu-btn__empresas");
const searchForm = document.getElementById("searchForm");
const filtroContainer = document.getElementById("filtroContainer");
const aplicarBtn = document.getElementById("aplicarFiltros");
const searchRow = searchForm.querySelector(".search-row__empresas");

// lê a altura retraída da variável CSS (ex.: "64px") ou usa fallback
const collapsedVar = getComputedStyle(searchForm).getPropertyValue('--searchbar-collapsed-height') || '64px';
const COLLAPSED_HEIGHT = parseFloat(collapsedVar);

// função que abre de forma suave
function openSearchBar() {
  if (searchForm.classList.contains('expanded')) return;

  // altura atual (px)
  const start = searchForm.getBoundingClientRect().height;
  // altura total do conteúdo (inclui filtros)
  const end = searchForm.scrollHeight;

  // prepara para animar: start -> end
  searchForm.style.height = `${start}px`;

  // força repaint e depois adiciona classe + final height (inicia a transição)
  requestAnimationFrame(() => {
    searchForm.classList.add('expanded');     // ativa .expanded (ex: para filtros aparecerem)
    // dar uma micro pausa ao layout já com .expanded não necessária: apenas animar height
    searchForm.style.height = `${end}px`;
  });

  // quando terminar, remove style.height para que o container passe a ter height: auto
  const onEnd = (ev) => {
    if (ev.propertyName === 'height') {
      // permite redimensionamento automático depois de abrir
      searchForm.style.height = 'auto';
      searchForm.removeEventListener('transitionend', onEnd);
    }
  };
  searchForm.addEventListener('transitionend', onEnd);

  // acessibilidade
  menuBtn.setAttribute('aria-expanded', 'true');
  filtroContainer.setAttribute('aria-hidden', 'false');
}

// função que fecha de forma suave
function closeSearchBar() {
  if (!searchForm.classList.contains('expanded')) return;

  // altura atual (pode ser 'auto' -> medimos)
  const start = searchForm.getBoundingClientRect().height;
  // alvo: COLLAPSED_HEIGHT (px)
  const end = COLLAPSED_HEIGHT;

  // fixamos altura atual para iniciar transição (auto -> px)
  searchForm.style.height = `${start}px`;

  // forçamos repaint e em seguida reduzimos para end (inicia a animação)
  requestAnimationFrame(() => {
    // removemos a classe .expanded para que filtros comecem a sumir visualmente
    searchForm.classList.remove('expanded');
    searchForm.style.height = `${end}px`;
  });

  const onEnd = (ev) => {
    if (ev.propertyName === 'height') {
      // remove inline height para voltar ao controle via CSS (var)
      searchForm.style.height = '';
      searchForm.removeEventListener('transitionend', onEnd);
    }
  };
  searchForm.addEventListener('transitionend', onEnd);

  // acessibilidade
  menuBtn.setAttribute('aria-expanded', 'false');
  filtroContainer.setAttribute('aria-hidden', 'true');
}

// toggle ao clicar no botão
menuBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  // alterna a classe do ícone (faz o hambúrguer virar X e voltar)
  menuBtn.classList.toggle("active");

  if (searchForm.classList.contains('expanded')) {
    closeSearchBar();
  } else {
    openSearchBar();
  }
});

// fecha se clicar fora
document.addEventListener('click', (e) => {
  if (!searchForm.contains(e.target)) {
    closeSearchBar();
    menuBtn.classList.remove("active"); // força reset do ícone
  }
});

// fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearchBar();
   menuBtn.classList.remove("active"); // força reset do ícone
});

// aplicar filtros: (mantive sua lógica e agora usa closeSearchBar())
aplicarBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const selecionados = Array.from(
    document.querySelectorAll(".checkbox_filtro:checked, .checkbox_filtro__empresas:checked")
  ).map(input => input.value);

  const itens = document.querySelectorAll(".grid-item, .grid-item__empresas");

  itens.forEach(item => {
    const filtrosDoItem = item.dataset.filtros
      ? item.dataset.filtros.split(",")
      : [];

    if (
      selecionados.length === 0 ||
      selecionados.some(f => filtrosDoItem.includes(f))
    ) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });

  // fecha com a animação suave
  closeSearchBar();

  // garante que o menu-btn volte sempre ao estado hambúrguer
  menuBtn.classList.remove("active");
});
