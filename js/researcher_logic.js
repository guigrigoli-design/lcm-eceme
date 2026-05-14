/**
 * RESEARCHER LOGIC - Versão 57.0
 * Correção: Blindagem contra 'undefined' via encadeamento opcional e injeção de app.
 */
function renderResearcherModule(app) {
    // Verificação de Sessão
    if (!app.isLoggedIn) return renderResearcherLogin(app);

    // Filtro reativo para as abas de projeto
    const filteredProjects = (app.projects || []).filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b-2 border-eb-gold pb-8">
                <div>
                    <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase">Painel Estratégico LCM</h2>
                    <p class="text-xs text-gray-500 font-bold uppercase mt-2"><i class="fa-solid fa-user-shield text-eb-gold mr-2"></i>Sessão Ativa: ${app.currentUser}</p>
                </div>
                <button @click="logout()" class="bg-red-700 text-white px-6 py-2 rounded font-bold uppercase text-[11px] shadow-lg hover:bg-red-900 transition">Encerrar Sessão</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Pesquisas em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Projetos em Curso' : 'Planejamento de Pesquisa'}</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-8 py-3 rounded-lg font-bold text-[11px] uppercase shadow-xl hover:scale-105 transition">Publicar Pesquisa</button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${filteredProjects.map(p => `
                    <div class="p-10 rounded-xl shadow-2xl bg-white ${p.domainId == 1 ? 'bg-dom-1' : (p.domainId == 2 ? 'bg-dom-2' : 'bg-dom-3')}">
                        <div class="flex justify-between items-start mb-6">
                            <h4 class="text-2xl font-bold text-[#1e3a2c] uppercase leading-tight max-w-3xl">${p.title}</h4>
                            <div class="flex space-x-4">
                                ${p.author === app.currentUser ? `
                                    <button @click="deleteProject(${p.id})" class="text-red-700 text-xl hover:scale-110 transition"><i class="fa-solid fa-trash-can"></i></button>
                                ` : ''}
                                <span class="text-[10px] font-bold bg-[#1e3a2c] text-white px-5 py-2 rounded-full uppercase tracking-tighter">Domínio ${p.domainId}</span>
                            </div>
                        </div>
                        <p class="text-gray-700 italic border-t border-black/5 pt-6 mb-8 text-lg">${p.description}</p>
                        
                        <div class="bg-white/70 p-6 rounded-lg border border-black/5 shadow-inner">
                            <h5 class="text-[11px] font-bold uppercase text-[#1e3a2c] mb-4 flex items-center">
                                <i class="fa-solid fa-users-rectangle text-eb-gold mr-3"></i> Registro de Manifestações Acadêmicas:
                            </h5>
                            <div class="space-y-5">
                                ${p.manifests && p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="text-[12px] border-b border-black/5 pb-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-bold text-[#1e3a2c] uppercase"><i class="fa-solid fa-id-card-clip mr-2"></i> ${m.author}</span>
                                            <span class="text-[10px] font-bold text-gray-400 italic">${m.date}</span>
                                        </div>
                                        <div class="flex flex-wrap gap-2 mb-3">
                                            ${(m.roles || []).map(role => `<span class="bg-eb-gold/30 text-[#1e3a2c] text-[9px] px-3 py-0.5 rounded-md font-bold uppercase border border-eb-gold/50">${role}</span>`).join('')}
                                        </div>
                                        <p class="text-gray-600 leading-relaxed italic">"${m.text}"</p>
                                    </div>
                                `).join('') : '<p class="text-[11px] text-gray-400 italic">Nenhum pesquisador manifestou interesse para este projeto ainda.</p>'}
                            </div>
                        </div>
                        <div class="text-right mt-10">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-10 py-4 rounded-lg text-[11px] font-bold uppercase shadow-lg hover:bg-black transition">
                                <i class="fa-solid fa-handshake mr-2"></i> ${app.uiLabels[app.lang]?.interest || 'Manifestar Interesse'}
                            </button>
                        </div>
                    </div>`).join('')}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-3xl p-10 relative overflow-y-auto max-h-[95vh] shadow-2xl border-t-8 border-eb-gold">
                    <button @click="showProjectForm = false" class="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-600 transition">×</button>
                    <h3 class="text-2xl font-bold text-eb-green uppercase border-b pb-6 mb-8">Formalizar Pesquisa no LCM</h3>
                    <div class="space-y-6">
                        <input type="text" x-model="newProj.title" placeholder="Título Completo do Trabalho" class="w-full border-2 p-4 rounded-lg text-sm outline-none focus:border-eb-gold transition">
                        <select x-model="newProj.domainId" class="w-full border-2 p-4 rounded-lg text-sm outline-none bg-white">
                            <option value="1">Domínio 1 - Sustentação em Defesa</option>
                            <option value="2">Domínio 2 - Preparo e Emprego</option>
                            <option value="3">Domínio 3 - Ambiente Estratégico</option>
                        </select>
                        <textarea x-model="newProj.description" placeholder="Resumo e Objetivos Estratégicos" class="w-full border-2 p-4 rounded-lg text-sm h-48 outline-none focus:border-eb-gold transition"></textarea>
                        <button @click="confirmPublish()" class="w-full bg-[#1e3a2c] text-white font-bold py-5 rounded-lg uppercase text-[11px] shadow-2xl tracking-widest hover:bg-black transition">
                            <i class="fa-solid fa-check-double mr-2"></i> ${app.uiLabels[app.lang]?.confirm || 'Confirmar Publicação'}
                        </button>
                    </div>
                </div>
            </div>

            <div x-show="showInterestModal" class="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-3xl p-12 relative overflow-y-auto max-h-[95vh] shadow-2xl">
                    <button @click="showInterestModal = false" class="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-600 transition">×</button>
                    <h3 class="text-2xl font-bold text-eb-green uppercase border-b pb-6 mb-8">${app.uiLabels[app.lang]?.creditTitle || 'Interesse'}</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-6 rounded-lg mb-8 border border-black/5 shadow-inner">
                        <template x-for="role in app.creditOptions" :key="role">
                            <label class="flex items-start space-x-3 text-[10px] cursor-pointer font-bold hover:text-eb-gold transition">
                                <input type="checkbox" :value="role" x-model="manifestForm.selectedRoles" class="mt-0.5 rounded text-eb-green focus:ring-eb-gold">
                                <span x-text="role"></span>
                            </label>
                        </template>
                    </div>
                    <textarea x-model="manifestForm.text" class="w-full border-2 p-5 rounded-lg text-sm h-40 mb-8 outline-none focus:ring-2 focus:ring-eb-gold transition" placeholder="Descreva sua proposta de colaboração para este projeto..."></textarea>
                    <button @click="submitManifest()" class="w-full bg-eb-gold text-[#1e3a2c] font-bold py-5 rounded-lg uppercase text-[11px] shadow-2xl tracking-widest hover:bg-yellow-600 transition">
                        <i class="fa-solid fa-paper-plane mr-2"></i> Registrar Proposta Acadêmica
                    </button>
                </div>
            </div>
        </div>`;
}

function renderResearcherLogin(app) {
    return `<div class="py-40 flex justify-center"><div class="bg-white p-16 rounded-xl shadow-2xl border-t-8 border-eb-gold w-full max-w-md text-center">
        <img src="brasao-lcm.png" class="h-16 mx-auto mb-8 grayscale opacity-50">
        <h3 class="font-bold uppercase text-[#1e3a2c] text-xl mb-10 tracking-tighter">Acesso Restrito LCM</h3>
        <div class="space-y-6">
            <input type="email" x-model="loginEmail" placeholder="E-mail Institucional" class="w-full border-2 p-4 rounded-lg text-sm outline-none focus:border-eb-green transition shadow-sm">
            <input type="password" x-model="loginPass" placeholder="Senha de Acesso" class="w-full border-2 p-4 rounded-lg text-sm outline-none focus:border-eb-green transition shadow-sm">
            <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-4 rounded-lg uppercase text-xs hover:bg-black shadow-2xl transition tracking-widest">Autenticar Sistema</button>
        </div>
    </div></div>`;
}
