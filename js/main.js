
// --- LÓGICA DE INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // A inicialização agora é gerenciada por uma função assíncrona
    // para garantir a ordem correta de carregamento.
    if (typeof window.initializeSite === 'function') {
        window.initializeSite();
    }

    // Renderiza os projetos *apenas* se o grid da home existir
    if (document.getElementById('home-projects-grid')) {
        renderHomeProjects();
    }
});

// --- FUNÇÕES DE COMPONENTES E NAVEGAÇÃO ---

/**
 * Carrega um componente HTML de uma URL em um elemento do DOM.
 * Retorna uma Promise que resolve quando o componente é carregado.
 */
function loadComponent(elementId, url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Falha ao carregar componente: ${url}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                return true; // Sucesso
            }
            return false; // Elemento placeholder não encontrado
        })
        .catch(error => {
            console.error(`Erro ao carregar ${url}:`, error);
            return false; // Falha
        });
}

/**
 * Função de inicialização principal. Garante que os componentes críticos
 * sejam carregados antes de anexar eventos.
 */
window.initializeSite = async function() {
    // Carrega todos os componentes em paralelo e espera que terminem.
    await Promise.all([
        loadComponent('header-placeholder', 'components/header.html'),
        loadComponent('menu-placeholder', 'components/menu.html'),
        loadComponent('orcamento-placeholder', 'components/orcamento.html'),
        loadComponent('footer-placeholder', 'components/footer.html')
    ]);

    // AGORA que todos os componentes estão no DOM, podemos anexar os eventos com segurança.
    attachGlobalEventListeners();
}

/**
 * Anexa todos os listeners de eventos globais DEPOIS que os componentes foram carregados.
 */
function attachGlobalEventListeners() {
    // Anexa o evento para o botão de menu
    const menuButton = document.querySelector('.mobile-menu-button');
    if (menuButton) {
        menuButton.addEventListener('click', () => window.toggleMenu());
    }

    // Anexa o evento para o link do logo
    const logoLink = document.getElementById('home-logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', () => window.navigate('home'));
    }
}

// --- FUNÇÕES GLOBAIS (TOGGLE, NAVIGATE, ETC.) ---

// Controla a visibilidade do menu overlay
window.toggleMenu = function() {
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay) {
        menuOverlay.classList.toggle('translate-x-full');
    } else {
        console.error('#menu-overlay não encontrado. O componente foi carregado?');
    }
}

// Abre o formulário de orçamento
window.openOrcamentoForm = function() {
    const orcamentoOverlay = document.getElementById('orcamento-overlay');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuOverlay) {
      menuOverlay.classList.add('translate-x-full');
    }

    if (!orcamentoOverlay) {
        console.error('Elemento #orcamento-overlay não encontrado. O componente foi carregado?');
        return;
    }
    orcamentoOverlay.classList.remove('hidden');
    setTimeout(() => orcamentoOverlay.classList.remove('opacity-0'), 10);
    currentStep = 0;
    userAnswers = {};
    renderCurrentStep();
}

// DEPRECATED: Esta função é agora substituída por `initializeSite`.
window.loadGlobalComponents = function() {
    console.warn("loadGlobalComponents está obsoleta. Use initializeSite.");
    window.initializeSite();
}


// --- LÓGICA DA HOME PAGE ---

function renderHomeProjects() {
    const grid = document.getElementById('home-projects-grid');
    if (!grid || typeof projectsData === 'undefined') return;
    const homeProjects = projectsData.slice(0, 4);
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

// --- LÓGICA DO FORMULÁRIO DE ORÇAMENTO (sem alterações) ---

let currentStep = 0;
let userAnswers = {};
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

window.closeOrcamentoForm = function() {
    const overlay = document.getElementById('orcamento-overlay');
    if (!overlay) return;
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function renderCurrentStep() {
    const modal = document.getElementById('orcamento-modal');
    if (!modal) return;
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
    content += `<div class="mt-8 flex justify-between items-center">`;
     if (currentStep > 0) {
        content += `<button onclick="prevStep()" class="text-sm text-gray-500 hover:text-black">Voltar</button>`;
    }
    else { content += `<span></span>`}
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
window.prevStep = function() {
    if (currentStep > 0) {
        currentStep--;
        renderCurrentStep();
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

// Manter a navegação da home
window.navigate = function(pageId) {
    const menuOverlay = document.getElementById('menu-overlay');
     if (menuOverlay) {
        menuOverlay.classList.add('translate-x-full');
    }

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active-page');
        });
        const target = document.getElementById(pageId);
        if (target) {
            target.classList.add('active-page');
            window.scrollTo(0, 0);
        } else {
          const home = document.getElementById('home');
          if(home) home.classList.add('active-page');
        }
    } else {
      window.location.href = `index.html#${pageId}`;
    }
}
