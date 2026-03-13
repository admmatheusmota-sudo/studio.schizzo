document.addEventListener('DOMContentLoaded', () => {
    // A inicialização dos componentes globais é gerenciada pelo main.js.
    renderPortfolioGrid();
});

function renderPortfolioGrid() {
    const grid = document.getElementById('grid-portfolio');
    if (!grid || typeof projectsData === 'undefined') {
        console.error('#grid-portfolio ou projectsData não foram encontrados.');
        return;
    }

    // Gera o HTML para cada card de projeto com a nova estrutura de overlay.
    grid.innerHTML = projectsData.map(proj => `
      <a href="projeto.html?id=${proj.id}" class="group block">
        <div class="aspect-square bg-gray-100 overflow-hidden rounded-xl relative">
          <img src="${proj.thumb}" alt="${proj.alt || proj.title}" loading="lazy" decoding="async" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out">
          <div class="portfolio-item-overlay">
              <h3 class="font-studio text-2xl uppercase">${proj.title}</h3>
              <p class="text-xs text-gray-300 uppercase tracking-widest">${proj.location}</p>
          </div>
        </div>
      </a>
    `).join('');
}
