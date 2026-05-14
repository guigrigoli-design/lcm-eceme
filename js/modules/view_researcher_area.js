/**
 * MODULE: Área do Pesquisador (Versão 60.0)
 */
function renderResearcherArea(app) {
    if (!app.isLoggedIn) return '';
    const projects = app.projects.filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b-2 border-eb-gold pb-6">
                <div>
                    <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase">Gestão Acadêmica de Pesquisas</h2>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Autenticado como: ${app.currentUser}</p>
                </div>
                <button @click="logout()" class="bg-red-700 text-white px-5 py-2 rounded text-[10px] font-bold uppercase shadow-lg hover:bg-red-900 transition">Encerrar Sessão</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Pesquisas em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Laboratório em Curso' : 'Planejamento e Prospectiva'}</h3>
                <button @click="showProjectForm = true" class="bg-[#c5a059] text-[#1e3a2c] px-8 py-3 rounded font-bold text-[11px] uppercase shadow-xl hover:scale-105 transition">
                    <i class="fa-solid fa-plus-circle mr-2"></i>Publicar Pesquisa / Projeto
                </button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${projects.map(p => `
                    <div class="p-10 rounded-xl shadow-2xl bg-white border-l-8 ${p.domainId == 1 ? 'border-blue-800' : (p.domainId == 2 ? 'border-green-800' : 'border-orange-800')}">
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="text-2xl font-bold text-[#1e3a2c] uppercase leading-tight">${p.title}</h4>
                            <div class="flex space-x-4">
                                ${p.author === app.currentUser ? `
                                    <button @click="deleteProject(${p.id})" class="text-red-700 hover:scale-125 transition" title="Excluir"><i class="fa-solid fa-trash-can"></i></button>
                                    ${p.status === 'futuro' ? `
                                        <button @click="migrateToOngoing(${p.id})" class="text-blue-700 hover:scale-125 transition" title="Migrar para 'Em Andamento'"><i class="fa-solid fa-rocket"></i></button>
                                    ` : ''}
                                ` : ''}
                                <span class="bg-[#1e3a2c] text-white px-4 py-1.5 rounded-full text-[9px] font-bold">Domínio ${p.domainId}</span>
                            </div>
                        </div>
                        <p class="text-gray-700 italic border-t pt-6 mb-8 text-lg">${p.description}</p>
                        
                        <div class="mb-8">
                            <h5 class="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest">Colaboração CRediT Necessária:</h5>
                            <div class="flex flex-wrap gap-2">
                                ${p.needsCredit && p.needsCredit.length > 0 ? p.needsCredit.map(c => `
                                    <span class="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-md text-[9px] font-bold uppercase">${c}</span>
                                `).join('') : '<span class="text-[10px] italic text-gray-300">Nenhuma função CRediT especificada.</span>'}
                            </div>
                        </div>

                        <div class="bg-slate-50 p-6 rounded-lg shadow-inner">
                            <h5 class="text-[11px] font-bold uppercase text-[#1e3a2c] mb-6 flex items-center">
                                <i class="fa-solid fa-users-gear text-[#c5a059] mr-3"></i>Manifestações de Interesse Colaborativo:
                            </h5>
                            <div class="space-y-6">
                                ${p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="text-[12px] border-b border-gray-200 pb-4 relative">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-bold text-[#1e3a2c] uppercase">${m.author}</span>
                                            <div class="flex items-center space-x-3">
                                                <span class="text-[10px] text-gray-400 italic">${m.date}</span>
                                                ${m.author === app.currentUser ? `
                                                    <button @click="deleteManifest(${p.id}, ${m.id})" class="text-red-400 hover:text-red-700 text-xs"><i class="fa-solid fa-xmark"></i></button>
                                                ` : ''}
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-2 mb-3">
                                            ${(m.roles || []).map(r => `<span class="bg-[#c5a059]/20 text-[#1e3a2c] text-[9px] px-2 py-0.5 rounded font-bold uppercase">${r}</span>`).join('')}
                                        </div>
                                        <p class="text-gray-600 leading-relaxed italic border-l-2 border-[#c5a059]/30 pl-4">"${m.text}"</p>
                                    </div>
                                `).join('') : '<p class="text-center text-gray-300 italic text-[11px]">Nenhuma manifestação registrada até o momento.</p>'}
                            </div>
                        </div>

                        <div class="text-right mt-10">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-10 py-4 rounded font-bold text-[10px] uppercase shadow-xl hover:bg-black transition">
                                <i class="fa-solid fa-handshake mr-2"></i>Manifestar Interesse
                            </button>
                        </div>
                    </div>`).join('')}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[100]" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-3xl p-10 relative overflow-y-auto max-h-[90vh] shadow-2xl border-t-8 border-eb-gold">
                    <button @click="showProjectForm = false" class="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-600 transition">×</button>
                    <h3 class="text-2xl font-bold text-[#1e3a2c] uppercase border-b pb-6 mb-8">Formalizar Pesquisa / Projeto</h3>
                    <div class="space-y-6">
                        <input type="text" x-model="newProj.title" placeholder="Título Completo do Artigo ou Projeto" class="w-full border-2 p-4 rounded-lg text-sm outline-none focus:border-eb-gold">
                        <select x-model="newProj.domainId" class="w-full border-2 p-4 rounded-lg text-sm bg-white">
                            <option value="1">Domínio 1 - Ciência, Tecnologia e Inovação</option>
                            <option value="2">Domínio 2 - Preparo e Emprego</option>
                            <option value="3">Domínio 3 - Ambiente Estratégico</option>
                        </select>
                        <textarea x-model="newProj.description" placeholder="Resumo Executivo e Finalidade Acadêmica" class="w-full border-2 p-4 rounded-lg text-sm h-40 outline-none"></textarea>
                        
                        <div class="bg-gray-50 p-6 rounded-lg border">
                            <h5 class="text-[10px] font-bold uppercase text-gray-500 mb-4 tracking-widest italic">Quais competências CRediT você necessita para esta pesquisa?</h5>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <template x-for="role in app.creditOptions" :key="role">
                                    <label class="flex items-center space-x-2 text-[10px] cursor-pointer hover:text-eb-gold font-bold">
                                        <input type="checkbox" :value="role" x-model="newProj.needsCredit" class="rounded text-[#1e3a2c] focus:ring-[#1e3a2c]">
                                        <span x-text="role"></span>
                                    </label>
                                </template>
                            </div>
                        </div>

                        <button @click="confirmPublish()" class="w-full bg-[#1e3a2c] text-white font-bold py-5 rounded uppercase text-[11px] shadow-2xl tracking-widest hover:bg-black transition">
                            <i class="fa-solid fa-cloud-arrow-up mr-2"></i> ${app.uiLabels[app.lang].confirm}
                        </button>
                    </div>
                </div>
            </div>

            <div x-show="showInterestModal" class="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[110]" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-3xl p-12 relative overflow-y-auto max-h-[90vh]">
                    <button @click="showInterestModal = false" class="absolute top-6 right-6 text-3xl text-gray-400 hover:text-red-600 transition">×</button>
                    <h3 class="text-2xl font-bold text-[#1e3a2c] uppercase border-b pb-6 mb-8">${app.uiLabels[app.lang].creditTitle}</h3>
                    
                    <div class="space-y-6">
                        <div class="bg-slate-50 p-6 rounded-lg border">
                            <h5 class="text-[10px] font-bold uppercase text-gray-500 mb-4 tracking-widest italic text-center">Selecione suas áreas de atuação nesta colaboração:</h5>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <template x-for="role in app.creditOptions" :key="role">
                                    <label class="flex items-center space-x-2 text-[10px] cursor-pointer hover:text-eb-gold font-bold">
                                        <input type="checkbox" :value="role" x-model="manifestForm.selectedRoles" class="rounded text-[#1e3a2c]">
                                        <span x-text="role"></span>
                                    </label>
                                </template>
                            </div>
                        </div>

                        <textarea x-model="manifestForm.text" class="w-full border-2 p-5 rounded-lg text-sm h-40 outline-none" placeholder="Escreva sua proposta de colaboração ao autor..."></textarea>
                        
                        <button @click="submitManifest()" class="w-full bg-[#c5a059] text-[#1e3a2c] font-bold py-5 rounded uppercase text-[11px] shadow-2xl tracking-widest hover:bg-yellow-600 transition">
                            <i class="fa-solid fa-paper-plane mr-2"></i> Registrar Proposta de Apoio
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

// LOGIN MODULE (Mantido estável)
function renderResearcherLogin(app) {
    return `<div class="py-32 flex justify-center"><div class="bg-white p-12 rounded-xl shadow-2xl border-t-8 border-eb-gold w-full max-w-md text-center">
        <h3 class="font-bold uppercase text-[#1e3a2c] text-xl mb-8">Acesso Restrito LCM</h3>
        <div class="space-y-5">
            <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green">
            <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green">
            <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded uppercase text-xs shadow-lg">Entrar</button>
        </div>
    </div></div>`;
}
