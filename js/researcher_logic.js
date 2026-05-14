/**
 * RESEARCHER LOGIC - Versão 53.0
 * Correção: Gatilho de confirmação de postagem e multiseleção CRediT.
 */
function renderResearcherModule(app) {
    if (!app.isLoggedIn) return renderResearcherLogin(app);

    const filteredProjects = (app.projects || []).filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b-2 border-eb-gold pb-8">
                <div>
                    <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase">Painel Estratégico de Pesquisa</h2>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2"><i class="fa-solid fa-user-check text-eb-gold mr-2"></i>Sessão Ativa: ${app.currentUser}</p>
                </div>
                <button @click="logout()" class="bg-red-700 text-white px-6 py-2.5 rounded font-bold uppercase text-[11px] hover:bg-red-900 transition shadow-lg">Encerrar Sessão</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Pesquisas em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Em Curso' : 'Planejamento de Pesquisa'}</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-8 py-3 rounded-lg font-bold text-[11px] uppercase shadow-xl hover:scale-105 transition">
                    <i class="fa-solid fa-file-signature mr-2"></i>Publicar Pesquisa
                </button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${filteredProjects.map(p => `
                    <div class="p-10 rounded-xl shadow-2xl bg-white ${p.domainId == 1 ? 'bg-dom-1' : (p.domainId == 2 ? 'bg-dom-2' : 'bg-dom-3')} border border-gray-100">
                        <div class="flex justify-between items-start mb-6">
                            <h4 class="text-2xl font-bold text-[#1e3a2c] uppercase leading-tight max-w-3xl">${p.title}</h4>
                            <div class="flex space-x-3">
                                ${p.author === app.currentUser ? `
                                    <button @click="deleteProject(${p.id})" class="text-red-700 hover:text-red-900 transition text-xl" title="Excluir"><i class="fa-solid fa-trash-can"></i></button>
                                    ${p.status === 'futuro' ? `<button @click="migrateToCurrent(${p.id})" class="text-blue-700 hover:text-blue-900 transition text-xl" title="Migrar"><i class="fa-solid fa-circle-arrow-up"></i></button>` : ''}
                                ` : ''}
                                <span class="text-[10px] font-bold bg-[#1e3a2c] text-white px-4 py-1.5 rounded-full shadow-sm">DOMÍNIO ${p.domainId}</span>
                            </div>
                        </div>
                        <div class="mb-6">
                            <a href="${p.link}" target="_blank" class="text-blue-800 text-xs font-bold underline italic flex items-center gap-2">
                                <i class="fa-solid fa-link"></i> Acessar Documentação da Pesquisa
                            </a>
                        </div>
                        <p class="text-base text-gray-700 italic border-t border-black/5 pt-6 mb-8">${p.description}</p>
                        
                        <div class="bg-white/70 p-6 rounded-lg border border-black/5 shadow-inner">
                            <h5 class="text-[11px] font-bold uppercase text-[#1e3a2c] mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-users-gear text-eb-gold"></i> Log de Colaboração Institucional:
                            </h5>
                            <div class="space-y-5">
                                ${p.manifests && p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="text-[12px] border-b border-black/5 pb-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-bold text-[#1e3a2c] uppercase"><i class="fa-solid fa-id-badge mr-2"></i> ${m.author}</span>
                                            <span class="text-[10px] text-gray-400 font-bold italic">${m.date}</span>
                                        </div>
                                        <div class="flex flex-wrap gap-2 mb-3">
                                            ${m.roles.map(r => `<span class="bg-eb-gold/80 text-[#1e3a2c] text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-tighter">${r}</span>`).join('')}
                                        </div>
                                        <p class="text-gray-600 leading-relaxed border-l-2 border-eb-gold/30 pl-4">"${m.text}"</p>
                                    </div>
                                `).join('') : '<p class="text-[11px] text-gray-400 italic">Nenhum registro de manifestação CRediT até o momento.</p>'}
                            </div>
                        </div>

                        <div class="text-right mt-8">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-10 py-3 rounded-lg text-[11px] font-bold uppercase hover:bg-black transition shadow-lg">
                                <i class="fa-solid fa-hand-holding-hand mr-2"></i>Manifestar Interesse Colaborativo
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-3xl p-10 relative overflow-y-auto max-h-[95vh] shadow-2xl border-t-8 border-eb-gold">
                    <button @click="showProjectForm = false" class="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-600 transition">&times;</button>
                    <h3 class="text-2xl font-bold text-eb-green uppercase border-b-2 border-gray-100 pb-6 mb-8">Formalizar Nova Pesquisa no LCM</h3>
                    
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Título do Trabalho</label>
                                <input type="text" x-model="newProj.title" class="w-full border-2 border-gray-100 p-3 rounded-lg text-sm outline-none focus:border-eb-gold transition">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Domínio de Enquadramento</label>
                                <select x-model="newProj.domainId" class="w-full border-2 border-gray-100 p-3 rounded-lg text-sm outline-none">
                                    <option value="1">Domínio 1 - Sustentação</option>
                                    <option value="2">Domínio 2 - Preparo</option>
                                    <option value="3">Domínio 3 - Prospecção</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">URL de Referência (Lattes/Documento)</label>
                            <input type="url" x-model="newProj.link" placeholder="https://..." class="w-full border-2 border-gray-100 p-3 rounded-lg text-sm outline-none">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Resumo Estratégico</label>
                            <textarea x-model="newProj.description" class="w-full border-2 border-gray-100 p-3 rounded-lg text-sm h-40 outline-none focus:border-eb-gold" placeholder="Objetivos e metas da pesquisa..."></textarea>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-gray-500 mb-4 tracking-widest italic">Áreas de Colaboração Requeridas (CRediT):</label>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg border">
                                <template x-for="opt in creditOptions" :key="opt">
                                    <label class="flex items-center space-x-3 text-[10px] cursor-pointer hover:text-eb-gold font-bold">
                                        <input type="checkbox" :value="opt" x-model="newProj.creditNeeds" class="rounded text-eb-green focus:ring-eb-gold">
                                        <span x-text="opt"></span>
                                    </label>
                                </template>
                            </div>
                        </div>

                        <button @click="confirmPublish()" class="w-full bg-[#1e3a2c] text-white font-bold py-4 rounded-lg text-xs uppercase hover:bg-black transition shadow-xl mt-4">
                            <i class="fa-solid fa-check-double mr-2"></i> ${uiLabels[lang].confirm}
                        </button>
                    </div>
                </div>
            </div>

            <div x-show="showInterestModal" class="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-2xl p-10 relative overflow-y-auto max-h-[95vh] shadow-2xl">
                    <button @click="showInterestModal = false" class="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-600 transition">&times;</button>
                    <h3 class="text-2xl font-bold text-eb-green uppercase border-b-2 border-gray-100 pb-6 mb-8">${uiLabels[lang].creditTitle}</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-gray-500 mb-4 tracking-widest italic">Áreas de Atuação Propostas:</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50 p-5 rounded-lg border">
                                <template x-for="role in creditOptions" :key="role">
                                    <label class="flex items-center space-x-3 text-[10px] cursor-pointer font-bold hover:text-eb-gold">
                                        <input type="checkbox" :value="role" x-model="manifestForm.selectedRoles" class="rounded text-eb-green">
                                        <span x-text="role"></span>
                                    </label>
                                </template>
                            </div>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Mensagem ao Coordenador</label>
                            <textarea x-model="manifestForm.text" class="w-full border-2 border-gray-100 p-4 rounded-lg text-sm h-40 outline-none focus:ring-2 focus:ring-eb-gold" placeholder="Como você pretende agregar valor a esta pesquisa?"></textarea>
                        </div>

                        <button @click="submitManifest()" class="w-full bg-[#c5a059] text-[#1e3a2c] font-bold py-5 rounded-lg text-xs uppercase hover:bg-yellow-600 transition shadow-xl tracking-widest">
                            <i class="fa-solid fa-paper-plane mr-2"></i> Registrar Proposta de Colaboração
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderResearcherLogin(app) {
    return `
        <div class="py-32 flex justify-center">
            <div class="bg-white p-12 rounded-xl shadow-2xl border-t-8 border-eb-gold w-full max-w-md text-center">
                <div class="mb-8">
                    <img src="brasao-lcm.png" class="h-16 mx-auto mb-4 grayscale">
                    <h3 class="font-bold uppercase text-[#1e3a2c] text-xl tracking-tighter">Acesso Restrito LCM</h3>
                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Uso exclusivo de pesquisadores cadastrados</p>
                </div>
                <div class="space-y-5">
                    <input type="email" x-model="loginEmail" placeholder="E-mail Funcional" class="w-full border-2 p-3 rounded-lg text-sm outline-none focus:border-eb-green">
                    <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border-2 p-3 rounded-lg text-sm outline-none focus:border-eb-green">
                    <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded-lg uppercase text-xs transition hover:bg-black shadow-lg">Autenticar Sistema</button>
                </div>
            </div>
        </div>`;
}
