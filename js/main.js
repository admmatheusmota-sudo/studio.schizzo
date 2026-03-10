document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
    
    if (document.getElementById('home-projects-grid')) {
        renderHomeProjects();
    }
    if (document.getElementById('grid-portfolio')) {
        renderPortfolio();
    }
});

function loadComponent(elementId, url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}
function navigate(pageId) {
      document.getElementById('menu-overlay').classList.add('translate-x-full');
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active-page');
      });
      const target = document.getElementById(pageId);
      if (target) {
        target.classList.add('active-page');
        window.scrollTo(0, 0);
      }
    }

    function renderHomeProjects() {
      const grid = document.getElementById('home-projects-grid');
      const homeProjects = projectsData.slice(0, 3);
      grid.innerHTML = homeProjects.map(proj => `
        <div class="snap-card cursor-pointer group" onclick="openGallery(${proj.id})">
          <div class="aspect-[4/5] bg-gray-200 overflow-hidden mb-4 relative rounded-lg">
             <img src="${proj.thumb}" 
                  class="reveal-image w-full h-full object-cover group-hover:grayscale-0 transition-all duration-700" />
          </div>
          <h3 class="font-studio text-2xl uppercase leading-none">${proj.title}</h3>
          <p class="text-[10px] font-bold uppercase text-gray-400 mt-1">${proj.location}</p>
        </div>
      `).join('');
    }

    function renderPortfolio() {
      const grid = document.getElementById('grid-portfolio');
      grid.innerHTML = projectsData.map(proj => `
        <div class="cursor-pointer group" onclick="openGallery(${proj.id})">
          <div class="aspect-square bg-gray-100 overflow-hidden mb-4 rounded-xl">
            <img src="${proj.thumb}" alt="${proj.alt}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0">
          </div>
          <h3 class="font-studio text-xl uppercase">${proj.title}</h3>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${proj.location}</p>
        </div>
      `).join('');
    }

    document.addEventListener('DOMContentLoaded', (event) => {
        renderHomeProjects();
        renderPortfolio();
    });

    function toggleMenu() {
      document.getElementById('menu-overlay').classList.toggle('translate-x-full');
    }

    let currentProject = 0;
    let currentImageIndex = 0;

    function openGallery(projectId) {
      const project = projectsData.find(p => p.id === projectId);
      if (!project) return;
      currentProject = projectId;
      currentImageIndex = 0;
      const overlay = document.getElementById('gallery-overlay');
      overlay.classList.remove('hidden');
      setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      updateCarousel();
    }

    function closeGallery() {
      const overlay = document.getElementById('gallery-overlay');
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    function updateCarousel() {
      const data = projectsData.find(p => p.id === currentProject);
      const container = document.getElementById('carousel-container');
      const total = data.images.length;
      const prev = (currentImageIndex - 1 + total) % total;
      const next = (currentImageIndex + 1) % total;
      document.getElementById('gallery-title').innerText = data.title;
      container.innerHTML = `
        <img src="${data.images[prev]}" alt="${data.title}" loading="lazy" decoding="async" class="absolute left-[-10%] md:left-0 h-40 md:h-64 opacity-30 scale-75 blur-[1px] hidden md:block">
        <img src="${data.images[currentImageIndex]}" alt="${data.title}" loading="lazy" decoding="async" class="z-20 h-auto max-h-[60vh] md:max-h-[70vh] max-w-[90vw] shadow-2xl rounded-lg">
        <img src="${data.images[next]}" alt="${data.title}" loading="lazy" decoding="async" class="absolute right-[-10%] md:right-0 h-40 md:h-64 opacity-30 scale-75 blur-[1px] hidden md:block">
      `;
    }

    function changeSlide(dir) {
      const proj = projectsData.find(p => p.id === currentProject);
      currentImageIndex = (currentImageIndex + dir + proj.images.length) % proj.images.length;
      updateCarousel();
    }

    function enviarParaWhatsapp() {
      const nome = document.getElementById('nome').value;
      const tel = document.getElementById('telefone').value;
      if (!nome || !tel) { alert("Preencha nome e telefone!"); return; }

      const texto = `*SOLICITAÇÃO DE ORÇAMENTO*%0A*Nome:* ${nome}%0A*Telefone:* ${tel}`;
      window.open(`https://wa.me/5562992470702?text=${texto}`, '_blank');
    }
