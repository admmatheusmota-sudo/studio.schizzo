document.addEventListener('DOMContentLoaded', () => {
    // A função de carregar header/footer é movida para uma função global
    // para ser acessível pelos novos scripts.
    if (typeof loadHeaderAndFooter === 'function') {
        loadHeaderAndFooter();
    }

    if (document.getElementById('home-projects-grid')) {
        renderHomeProjects();
    }
});

function loadComponent(elementId, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            }
            if (callback) callback();
        })
        .catch(error => console.error('Error loading component:', error));
}

// Tornando a função global para ser acessada por portfolio.js e projeto.js
window.loadHeaderAndFooter = function() {
    loadComponent('header-placeholder', 'components/header.html', () => {
        // Adiciona funcionalidade ao menu hambúrguer do header
        const menuButton = document.querySelector('.mobile-menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                 window.toggleMenu();
            });
        }
    });
    loadComponent('footer-placeholder', 'components/footer.html');
}

// ... (O restante do código de orçamento e outras funções globais permanecem) ...

window.toggleMenu = function() {
    // Implementação do menu (deve existir ou ser criada)
    // Exemplo:
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay) {
        menuOverlay.classList.toggle('translate-x-full');
    }
}

window.navigate = function(pageId) {
    // A navegação agora é simplificada, pois o portfólio é uma página separada.
    // A função é mantida para a navegação interna da home (ex: Sobre).
    if (document.getElementById('menu-overlay')){
        document.getElementById('menu-overlay').classList.add('translate-x-full');
    }
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active-page');
    });
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active-page');
        window.scrollTo(0, 0);
    }
}

// --- LÓGICA DA GALERIA DE PROJETOS (MODIFICADA) ---

// renderPortfolio() foi removida daqui e sua lógica está em js/portfolio.js

// A galeria da home agora usa os cards que linkam para as páginas de projeto.
function renderHomeProjects() {
    const grid = document.getElementById('home-projects-grid');
    if (!grid) return;
    const homeProjects = projectsData.slice(0, 4); // Mostra 4 projetos na home
    grid.innerHTML = homeProjects.map(proj => `
      <a href="projeto.html?id=${proj.id}" class="snap-card group block">
        <div class="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 rounded-lg">
           <img src="${proj.thumb}" alt="${proj.title}" 
                class="reveal-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" />
        </div>
        <h3 class="font-studio text-2xl uppercase leading-none">${proj.title}</h3>
        <p class="text-[10px] font-bold uppercase text-gray-400 mt-1">${proj.location}</p>
      </a>
    `).join('');
}


// O sistema de galeria modal (openGallery, closeGallery, etc.) foi substituído 
// pela nova página de projeto. Essas funções podem ser removidas ou mantidas
// para outro uso futuro, mas não são mais usadas pelo portfólio.


// --- LÓGICA DO ORÇAMENTO (PERMANECE INALTERADA) ---
// [Todo o código do formulário de orçamento continua aqui]

let currentStep = 0;
let userAnswers = {};
// ... etc.
