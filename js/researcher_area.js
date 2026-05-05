// Configuração de Funções CRediT
const creditFunctions = [
    "Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento",
    "Investigação", "Metodologia", "Administração do Projeto", "Recursos",
    "Programação de Software", "Supervisão", "Validação", "Visualização",
    "Redação – rascunho original", "Redação – revisão e edição"
];

function renderResearcherArea(app) {
    if (!app.isLoggedIn && app.view === 'researcher_login') {
        return `<!-- Estrutura de Login -->`;
    }

    // Estrutura do Dashboard com Cores por Domínio
    return `
        <div class="container mx-auto px-4 py-12">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-8">Área de Colaboração Científica</h2>
            <!-- Listagem de Projetos com Cores Específicas -->
            <div class="space-y-6">
                ${app.projects.map(p => `
                    <div class="p-6 rounded-lg shadow-md border-l-8 ${getDomainClass(p.domainId)}">
                        <h4 class="text-xl font-bold">${p.title}</h4>
                        <a href="${p.researchLink}" class="text-blue-800 text-xs underline block mb-2">${p.researchLink}</a>
                        <p class="text-sm italic text-gray-700">${p.description}</p>
                        <!-- Log de Manifestações Visíveis -->
                        <div class="mt-4 pt-4 border-t border-black/10">
                            <h5 class="text-[10px] font-bold uppercase mb-2">Colaborações Registradas:</h5>
                            ${p.interests.map(i => `
                                <div class="text-[10px] mb-1"><strong>${i.author}:</strong> ${i.message} (${i.creditRole})</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function getDomainClass(id) {
    // 1 - Azul claro, 2 - Verde claro, 3 - Laranja claro[cite: 1]
    if (id == 1) return 'bg-blue-100 border-blue-500';
    if (id == 2) return 'bg-green-100 border-green-500';
    if (id == 3) return 'bg-orange-100 border-orange-500';
    return 'bg-white';
}
