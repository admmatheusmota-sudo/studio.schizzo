document.addEventListener('DOMContentLoaded', () => {
    // A função loadHeaderAndFooter de main.js agora cuidará do cabeçalho e rodapé.
    if (typeof window.loadHeaderAndFooter === 'function') {
        window.loadHeaderAndFooter();
    } else {
        console.error('A função loadHeaderAndFooter não foi encontrada. Verifique se o main.js foi carregado corretamente.');
        return; // Interrompe a execução se a função principal estiver ausente.
    }

    // Pega o ID do projeto da URL.
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'), 10);
    
    // Garante que os dados dos projetos existam.
    if (typeof projectsData === 'undefined') {
        console.error('Os dados dos projetos (projectsData) não foram encontrados. Verifique se projects.js foi carregado.');
        return;
    }

    const project = projectsData.find(p => p.id === projectId);

    // Se o projeto não for encontrado, exibe uma mensagem de erro clara.
    if (!project) {
        document.title = "Projeto não encontrado";
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = '<div class="text-center p-20"><h1>Projeto não encontrado</h1><a href="portfolio.html" class="underline">Voltar ao portfólio</a></div>';
        }
        return;
    }

    // Define o título da página.
    document.title = `Studio Schizzo | ${project.title}`;

    // A lógica de popular o #project-header foi REMOVIDA, pois o cabeçalho agora é carregado globalmente.

    // Popula a seção de informações do projeto (Ficha Técnica).
    const infoSection = document.getElementById('project-info');
    if (infoSection) {
        const briefingList = project.briefing.map(item => `<li class="border-b py-2">${item}</li>`).join('');
        infoSection.innerHTML = `
            <div class="text-center mb-12">
              <h1 class="text-5xl md:text-7xl font-studio italic uppercase">${project.title}</h1>
              <p class="text-gray-500 mt-2">${project.location}</p>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm mb-8 max-w-md mx-auto">
                <div><strong class="block text-gray-400 font-normal">Terreno:</strong> ${project.metragem_terreno}</div>
                <div><strong class="block text-gray-400 font-normal">Área Construída:</strong> ${project.metragem_construida}</div>
            </div>
            <div class="max-w-md mx-auto">
              <h3 class="font-bold uppercase tracking-widest text-xs text-gray-400 mb-2">Briefing</h3>
              <ul class="text-gray-700">${briefingList}</ul>
            </div>
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
