document.addEventListener('DOMContentLoaded', () => {
    // Carrega o header e footer reutilizáveis
    loadHeaderAndFooter();

    const portfolioGrid = document.getElementById('grid-portfolio');
    if (!portfolioGrid) return;

    projectsData.forEach(project => {
        const projectCard = `
            <a href="projeto.html?id=${project.id}" class="block group">
                <div class="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                    <img src="${project.thumb}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out">
                </div>
                <h3 class="font-bold text-lg mt-4">${project.title}</h3>
                <p class="text-sm text-gray-500">${project.location}</p>
            </a>
        `;
        portfolioGrid.innerHTML += projectCard;
    });
});
