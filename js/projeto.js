document.addEventListener('DOMContentLoaded', () => {
    loadHeaderAndFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'), 10);
    const project = projectsData.find(p => p.id === projectId);

    if (!project) {
        document.title = "Projeto não encontrado";
        document.body.innerHTML = '<div class="text-center p-20"><h1>Projeto não encontrado</h1><a href="portfolio.html" class="underline">Voltar ao portfólio</a></div>';
        return;
    }

    document.title = `Studio Schizzo | ${project.title}`;

    // 1. Popular o Cabeçalho
    const header = document.getElementById('project-header');
    header.innerHTML = `
        <a href="portfolio.html" class="font-bold text-lg p-4">Voltar</a>
        <h1 class="font-studio text-xl absolute left-1/2 -translate-x-1/2">${project.title}</h1>
        <span class="p-4"></span>
    `;

    // 2. Popular a Ficha Técnica
    const infoSection = document.getElementById('project-info');
    const briefingList = project.briefing.map(item => `<li class="border-b py-2">${item}</li>`).join('');
    infoSection.innerHTML = `
        <h2 class="text-3xl font-bold mb-2">${project.title}</h2>
        <p class="text-gray-500 mb-4">${project.location}</p>
        <div class="grid grid-cols-2 gap-4 text-sm mb-6">
            <div><strong class="block">Terreno:</strong> ${project.metragem_terreno}</div>
            <div><strong class="block">Área Construída:</strong> ${project.metragem_construida}</div>
        </div>
        <h3 class="font-bold uppercase tracking-widest text-xs text-gray-400 mb-2">Briefing</h3>
        <ul class="text-gray-700">${briefingList}</ul>
    `;

    // 3. Popular a Galeria
    const gallery = document.getElementById('project-gallery-container');
    const imagesHTML = project.images.map(img => `
        <img src="${img}" alt="${project.title}" class="gallery-image">
    `).join('');
    gallery.innerHTML = imagesHTML;
});
