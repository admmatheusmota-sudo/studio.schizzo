document.addEventListener('DOMContentLoaded', () => {
    // Garante que a função para carregar header/footer exista e a executa.
    if (typeof window.loadHeaderAndFooter === 'function') {
        window.loadHeaderAndFooter();
    } else {
        console.error('A função loadHeaderAndFooter não foi encontrada. Verifique se o main.js foi carregado corretamente.');
    }

    // Pega o ID do projeto da URL.
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'), 10);
    
    // Garante que os dados dos projetos existam.
    if (typeof projectsData === 'undefined') {
        console.error('Os dados dos projetos (projectsData) não foram encontrados.');
        return;
    }

    const project = projectsData.find(p => p.id === projectId);

    // Se o projeto não for encontrado, exibe uma mensagem de erro.
    if (!project) {
        document.title = "Projeto não encontrado";
        document.body.innerHTML = '<div class="text-center p-20"><h1>Projeto não encontrado</h1><a href="portfolio.html" class="underline">Voltar ao portfólio</a></div>';
        return;
    }

    // Define o título da página.
    document.title = `Studio Schizzo | ${project.title}`;

    // Popula o cabeçalho do projeto.
    const header = document.getElementById('project-header');
    if (header) {
        header.innerHTML = `
            <a href="portfolio.html" class="font-bold text-lg p-4">Voltar</a>
            <h1 class="font-studio text-xl absolute left-1/2 -translate-x-1/2">${project.title}</h1>
            <span class="p-4"></span>
        `;
    }

    // Popula a seção de informações do projeto (Ficha Técnica).
    const infoSection = document.getElementById('project-info');
    if (infoSection) {
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
    }

    // Popula a galeria de imagens do projeto.
    const gallery = document.getElementById('project-gallery-container');
    if (gallery) {
        const imagesHTML = project.images.map(img => `
            <img src="${img}" alt="${project.title}" class="gallery-image">
        `).join('');
        gallery.innerHTML = imagesHTML;
    }
});
