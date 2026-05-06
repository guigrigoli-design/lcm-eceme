/**
 * RESEARCHER LOGIC - Versão 45.0
 * Módulo Completo: Publicação, Colaboração CRediT e Gestão de Projetos.
 */

function renderResearcherModule(app) {
    // 1. Verificação de Autenticação
    if (!app.isLoggedIn) return renderResearcherLogin(app);

    // 2. Filtragem de Projetos por Submenu (Andamento vs Futuro)
    const filteredProjects = (app.projects || []).filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <!-- Cabeçalho do Dashboard -->
            <div class="flex justify-between items-center mb-10 border-b pb-6">
                <div>
                    <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Painel de Colaboração Científica</h2>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Conectado: ${app.currentUser}</p>
                </div>
                <button @click="logout()" class="bg-red-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase hover:bg-red-800 transition">Sair <i class="fa-solid fa-power-off ml-2"></i></button>
            </div>

            <!-- Navegação de Submenus da Área Restrita -->
            <div class="flex justify-center space-x-8 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-3 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Pesquisas em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-3 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <!-- Cabeçalho da Listagem e Botão de Publicação -->
            <div class="flex justify-between items-center mb-8">
                <h3 class="text-lg font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Pesquisas em Curso' : 'Novas Iniciativas'}</h3>
                <button @click="showProjectForm = true; newProj.status = researcherSubView" class="bg-[#c5a059] text-[#1e3a2c] px-6 py-2 rounded font-bold text-[10px] uppercase shadow-lg hover:scale-105 transition">
                    <i class="fa-solid fa-plus mr-2"></i> Publicar ${app.researcherSubView === 'andamento' ? 'Pesquisa' : 'Projeto'}
                </button>
            </div>

            <!-- Grade de Projetos com Cores por Domínio -->
            <div class="grid grid-cols-1 gap-8">
                ${filteredProjects.map(p => `
                    <div class="p-8 rounded-lg shadow-md bg-white ${p.domainId == 1 ? 'bg-dom-1' : (p.domainId == 2 ? 'bg-dom-2' : 'bg-dom-3')}">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="text-xl font-bold text-[#1e3a2c] uppercase">${p.title}</h4>
                            <span class="text-[9px] font-bold bg-[#1e3a2c] text-white px-3 py-1 rounded">Domínio ${p.domainId}</span>
                        </div>
                        
                        <!-- Link da Pesquisa (Entre Nome e Descrição) -->
                        <div class="mb-4">
                            <a href="${p.link}" target="_blank" class="text-blue-800 text-xs font-bold underline italic hover:text-blue-600 transition">
                                <i class="fa-solid fa-link mr-2"></i>Acessar Link da Pesquisa
                            </a>
                        </div>

                        <p class="text-sm text-gray-700 leading-relaxed italic mb-8 border-t border-black/5 pt-4">${p.description}</p>
                        
                        <!-- Log de Manifestações de Interesse (Visível para outros pesquisadores) -->
                        <div class="bg-white/50 p-6 rounded-md border border-black/5 mb-6">
                            <h5 class="text-[10px] font-bold uppercase text-[#1e3a2c] mb-4 border-b pb-2">Manifestações de Colaboração (CRediT):</h5>
                            <div class="space-y-4">
                                ${p.manifests && p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="text-[11px] border-b border-black/5 pb-2">
                                        <div class="flex justify-between font-bold text-eb-green mb-1">
                                            <span>${m.author}</span>
                                            <span class="bg-eb-gold text-[8px] px-2 rounded-full uppercase">${m.role}</span>
                                        </div>
                                        <p class="text-gray-600">${m.text}</p>
                                    </div>
                                `).join('') : '<p class="text-[10px] text-gray-400 italic">Nenhuma manifestação registrada ainda.</p>'}
                            </div>
                        </div>

                        <div class="text-right">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-8 py-2 rounded text-[10px] font-bold uppercase hover:bg-black transition">
                                <i class="fa-solid fa-handshake mr-2"></i>Manifestar Interesse
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${filteredProjects.length === 0 ? '<p class="text-center text-gray-400 py-12 italic">Nenhum registro encontrado nesta categoria.</p>' : ''}
            </div>

            <!-- MODAL: FORMULÁRIO DE PUBLICAÇÃO -->
            <div x-show="showProjectForm" class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-lg w-full max-w-2xl p-8 shadow-2xl relative">
                    <button @click="showProjectForm = false" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-600">&times;</button>
                    <h3 class="text-xl font-bold text-eb-green uppercase border-b pb-4 mb-6">Publicar no Portal LCM</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Título do Projeto/Pesquisa</label>
                            <input type="text" x-model="newProj.title" class="w-full border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-eb-gold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Link de Acesso Externo</label>
                            <input type="url" x-model="newProj.link" placeholder="http://..." class="w-full border p-2 rounded text-sm outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Domínio de Enquadramento</label>
                            <select x-model="newProj.domainId" class="w-full border p-2 rounded text-sm outline-none">
                                <option value="1">Domínio 1 - Sustentação (Azul)</option>
                                <option value="2">Domínio 2 - Preparo (Verde)</option>
                                <option value="3">Domínio 3 - Prospecção (Laranja)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-1">Descrição Detalhada</label>
                            <textarea x-model="newProj.description" class="w-full border p-2 rounded text-sm h-32 outline-none"></textarea>
                        </div>
                        <button @click="publishProject(app)" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded hover:bg-black transition uppercase text-xs">Confirmar Publicação</button>
                    </div>
                </div>
            </div>

            <!-- MODAL: MANIFESTAÇÃO DE INTERESSE (14 OPÇÕES CREDIT) -->
            <div x-show="showInterestModal" class="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-2xl">
                    <button @click="showInterestModal = false" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-600">&times;</button>
                    <h3 class="text-xl font-bold text-eb-green uppercase border-b pb-4 mb-6">Proposta de Colaboração</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-2">Descreva seu interesse e como pretende colaborar:</label>
                            <textarea x-model="manifestForm.text" class="w-full border p-4 rounded text-sm h-32 outline-none" placeholder="Justificativa da colaboração..."></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-2">Função Pretendida (Taxonomia CRediT):</label>
                            <select x-model="manifestForm.role" class="w-full border p-2 rounded text-sm outline-none">
                                <template x-for="role in app.creditOptions" :key="role">
                                    <option :value="role" x-text="role"></option>
                                </template>
                            </select>
                        </div>
                        <button @click="submitManifest(app)" class="w-full bg-[#c5a059] text-[#1e3a2c] font-bold py-3 rounded hover:bg-yellow-600 transition uppercase text-xs tracking-widest">Enviar Manifestação</button>
                    </div>
                </div>
            </div>
        </div>`;
}

/** 
 * FUNÇÕES AUXILIARES DE INTERAÇÃO 
 */

function publishProject(app) {
    if (!app.newProj.title) {
        alert("O título é obrigatório.");
        return;
    }
    const project = { 
        ...app.newProj, 
        id: Date.now(), 
        author: app.currentUser, 
        manifests: [] 
    };
    app.projects.push(project);
    app.showProjectForm = false;
    // Reseta o formulário mantendo o status do submenu atual
    app.newProj = { title: '', link: '', domainId: 1, description: '', status: app.researcherSubView };
}

function submitManifest(app) {
    const proj = app.projects.find(p => p.id === app.selectedProject);
    if (proj && app.manifestForm.text) {
        proj.manifests.push({
            id: Date.now(),
            author: app.currentUser,
            text: app.manifestForm.text,
            role: app.manifestForm.role
        });
        app.showInterestModal = false;
        app.manifestForm = { text: '', role: 'Conceitualização' };
    } else {
        alert("Por favor, preencha o texto da manifestação.");
    }
}

function renderResearcherLogin(app) {
    return `
        <div class="py-20 flex justify-center">
            <div class="bg-white p-10 rounded shadow-2xl border-t-8 border-[#c5a059] w-full max-w-md">
                <h3 class="font-bold uppercase text-[#1e3a2c] mb-6 text-center">Login Área do Pesquisador</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1">E-mail funcional</label>
                        <input type="email" x-model="loginEmail" class="w-full border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-eb-gold">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1">Senha</label>
                        <input type="password" x-model="loginPass" class="w-full border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-eb-gold">
                    </div>
                    <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded uppercase text-xs hover:bg-black transition">Entrar no Sistema</button>
                </div>
            </div>
        </div>`;
}
