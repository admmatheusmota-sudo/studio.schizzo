document.addEventListener('DOMContentLoaded', () => {
    // Garante que a função global para carregar componentes exista e a executa.
    if (typeof window.loadGlobalComponents === 'function') {
        window.loadGlobalComponents();
    } else {
        console.error('A função loadGlobalComponents não foi encontrada. Verifique se o main.js foi carregado corretamente.');
    }

    // Renderiza a grade de projetos do portfólio.
    renderPortfolioGrid();
});

function renderPortfolioGrid() {
    const grid = document.getElementById('grid-portfolio');
    // Garante que a grade e os dados dos projetos existam antes de continuar.
    if (!grid || typeof projectsData === 'undefined') {
        console.error('O elemento #grid-portfolio ou os dados dos projetos (projectsData) não foram encontrados.');
        return;
    }

    // Gera o HTML para cada card de projeto e o insere na grade.
    grid.innerHTML = projectsData.map(proj => `
      <a href="projeto.html?id=${proj.id}" class="group block">
        <div class="aspect-square bg-gray-100 overflow-hidden mb-4 rounded-xl">
          <img src="${proj.thumb}" alt="${proj.alt || proj.title}" loading="lazy" decoding="async" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out">
        </div>
        <h3 class="font-studio text-xl uppercase">${proj.title}</h3>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${proj.location}</p>
      </a>
    `).join('');
}
