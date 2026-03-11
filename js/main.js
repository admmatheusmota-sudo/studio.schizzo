// --- LÓGICA DE INICIALIZAÇÃO ---
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

// --- ESTADO GLOBAL DA APLICAÇÃO ---
let currentStep = 0;
let userAnswers = {};
let currentProject = 0;
let currentImageIndex = 0;

// --- DEFINIÇÃO DAS ETAPAS DO ORÇAMENTO ---
const orcamentoSteps = [
    { id: 'nome', question: 'Qual é o seu nome completo?', type: 'text', placeholder: 'Digite seu nome' },
    { id: 'telefone', question: 'E o seu telefone?', type: 'text', inputType: 'tel', placeholder: 'DDD + Número' },
    { id: 'local', question: 'Onde será realizado o projeto?', type: 'text', placeholder: 'Cidade-Estado, Setor/Bairro' },
    { id: 'tipo_servico', question: 'O que você procura?', type: 'single', options: ['Projeto arquitetônico', 'Projeto de interiores', 'Projeto de arquitetura e interiores'] },
    { id: 'tipo_imovel', question: 'Que tipo de imóvel é?', type: 'single', options: ['Casa', 'Apartamento', 'Comercial', 'Outro'] },
    { id: 'estagio', question: 'O projeto será em qual estágio?', type: 'multiple', options: ['Terreno recém-adquirido', 'Obra em andamento', 'Imóvel já construído', 'Ainda estou planejando'] },
    { id: 'metragem', question: 'Qual é a metragem aproximada do imóvel?', type: 'single', options: ['Entre 50 e 100 m²', 'Entre 100 e 200 m²', 'Entre 200 e 400 m²', 'Acima de 400 m²'] },
    { id: 'prazo', question: 'Quando pretende iniciar o projeto?', type: 'single', options: ['Nos próximos 30 dias', 'Nos próximos 3 meses', 'Dentro de 6 meses', 'Ainda estou apenas pesquisando'] }
];

// --- FUNÇÕES GLOBAIS (ANEXADAS AO WINDOW) ---

window.toggleMenu = function() {
    document.getElementById('menu-overlay').classList.toggle('translate-x-full');
}

window.navigate = function(pageId) {
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

// --- LÓGICA DO ORÇAMENTO ---

window.openOrcamentoForm = function() {
    const overlay = document.getElementById('orcamento-overlay');
    if (document.getElementById('menu-overlay')) {
      document.getElementById('menu-overlay').classList.add('translate-x-full');
    }
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    currentStep = 0;
    userAnswers = {};
    renderCurrentStep();
}

window.closeOrcamentoForm = function() {
    const overlay = document.getElementById('orcamento-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function renderCurrentStep() {
    const modal = document.getElementById('orcamento-modal');
    const stepData = orcamentoSteps[currentStep];
    const progress = ((currentStep + 1) / orcamentoSteps.length) * 100;

    let content = `<div id="progress-bar"><div id="progress-bar-inner" style="width: ${progress}%"></div></div>`;
    content += `<div class="form-step">`;
    content += `<h3 class="text-2xl font-bold mb-6">${stepData.question}</h3>`;

    if (stepData.type === 'text') {
        content += `<input type="${stepData.inputType || 'text'}" id="step-input" class="form-input" placeholder="${stepData.placeholder || ''}" />`;
    } else if (stepData.type === 'single' || stepData.type === 'multiple') {
        content += `<div class="flex flex-col gap-3">`;
        stepData.options.forEach(option => {
            content += `<button class="option-button" onclick="selectOption(this, '${stepData.id}', '${stepData.type}')">${option}</button>`;
        });
        if (stepData.options.includes('Outro')) {
             content += `<input type="text" id="outro-input" class="form-input mt-2 hidden" placeholder="Qual?" />`;
        }
        content += `</div>`;
    }

    content += `<div class="mt-8 flex justify-end">`;
    if (currentStep < orcamentoSteps.length - 1) {
        content += `<button onclick="nextStep()" class="bg-black text-white px-8 py-3 rounded-full font-bold">Continuar</button>`;
    } else {
         content += `<button onclick="finishForm()" class="bg-green-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2"><i class="fa-brands fa-whatsapp"></i> Enviar via WhatsApp</button>`;
    }
    content += `</div></div>`;

    modal.innerHTML = content;
    
    const input = document.getElementById('step-input');
    if (input) input.focus();
}

window.selectOption = function(button, stepId, type) {
    if (type === 'single') {
        document.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        userAnswers[stepId] = button.innerText;

        const outroInput = document.getElementById('outro-input');
        if (outroInput) {
            outroInput.classList.toggle('hidden', button.innerText !== 'Outro');
        }

    } else if (type === 'multiple') {
        button.classList.toggle('selected');
        if (!userAnswers[stepId]) userAnswers[stepId] = [];
        const value = button.innerText;
        if (userAnswers[stepId].includes(value)) {
            userAnswers[stepId] = userAnswers[stepId].filter(item => item !== value);
        } else {
            userAnswers[stepId].push(value);
        }
    }
}

window.nextStep = function() {
    const stepData = orcamentoSteps[currentStep];
    if (stepData.type === 'text') {
        const input = document.getElementById('step-input');
        if (!input.value) { alert('Por favor, preencha o campo.'); return; }
        userAnswers[stepData.id] = input.value;
    }
    
    if (stepData.id === 'tipo_imovel' && userAnswers['tipo_imovel'] === 'Outro') {
        const outroInput = document.getElementById('outro-input');
        if (!outroInput.value) { alert('Por favor, especifique o tipo de imóvel.'); return; }
        userAnswers['tipo_imovel'] = `Outro: ${outroInput.value}`;
    }

    if (currentStep < orcamentoSteps.length - 1) {
        currentStep++;
        renderCurrentStep();
    }
}

window.finishForm = function() {
    const stepData = orcamentoSteps[currentStep];
    if (userAnswers[stepData.id] === undefined && !userAnswers[stepData.id]?.length) {
         alert('Por favor, selecione uma opção.'); return; 
    }

    let message = `*NOVO PEDIDO DE ORÇAMENTO*%0A--- --- ---%0A`;
    orcamentoSteps.forEach(step => {
        const answer = userAnswers[step.id];
        message += `*${step.question}*%0A`;
        if (answer) {
            if (Array.isArray(answer)) {
                message += answer.join(', ') + '%0A%0A';
            } else {
                message += `${answer}%0A%0A`;
            }
        } else {
            message += `Não preenchido%0A%0A`;
        }
    });

    const whatsappUrl = `https://wa.me/5562992470702?text=${message}`;
    window.open(whatsappUrl, '_blank');
    closeOrcamentoForm();
}


// --- LÓGICA DA GALERIA DE PROJETOS ---

function renderHomeProjects() {
    const grid = document.getElementById('home-projects-grid');
    if (!grid) return;
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
    if (!grid) return;
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

window.openGallery = function(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    currentProject = projectId;
    currentImageIndex = 0;
    const overlay = document.getElementById('gallery-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    updateCarousel();
}

window.closeGallery = function() {
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

window.changeSlide = function(dir) {
    const proj = projectsData.find(p => p.id === currentProject);
    currentImageIndex = (currentImageIndex + dir + proj.images.length) % proj.images.length;
    updateCarousel();
}
