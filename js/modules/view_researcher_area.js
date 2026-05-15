/**
 * MODULE: Researcher Area (v66.0)
 * Implementação de Seleção CRediT e Log de Colaboração.
 */
function renderResearcherArea(app) {
    if (!app.isLoggedIn) return '';
    const projects = app.projects.filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b pb-6">
                <div><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Painel Acadêmico LCM</h2><p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sessão: ${app.currentUser}</p></div>
                <button @click="logout()" class="bg-red-700 text-white px-5 py-2 rounded text-[10px] font-bold uppercase">Sair</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">Gestão de Pesquisas</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-6 py-2 rounded font-bold text-[10px] uppercase shadow">Publicar Pesquisa</button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${projects.map(p => `
                    <div class="p-8 rounded-lg shadow-xl bg-white border-l-8 ${p.domainId == 1 ? 'border-blue-800' : (p.domainId == 2 ? 'border-green-800' : 'border-orange-800')}">
                        <div class="flex justify-between mb-4">
                            <h4 class="text-xl font-bold uppercase text-[#1e3a2c]">${p.title}</h4>
                            <div class="flex space-x-4">
                                ${p.author === app.currentUser ? `
                                    <button @click="deleteProject(${p.id})" class="text-red-700 hover:scale-110 transition"><i class="fa-solid fa-trash"></i></button>
                                    ${p.status === 'futuro' ? `<button @click="migrateToOngoing(${p.id})" class="text-blue-700 hover:scale-110 transition"><i class="fa-solid fa-rocket"></i></button>` : ''}
                                ` : ''}
                                <span class="bg-[#1e3a2c] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase">Domínio ${p.domainId}</span>
                            </div>
                        </div>
                        <p class="text-gray-700 italic border-t pt-4 mb-6">${p.description}</p>
                        
                        <div class="bg-gray-50 p-6 rounded-lg border">
                            <h5 class="text-[11px] font-bold uppercase mb-4 text-[#c5a059] flex items-center">
                                <i class="fa-solid fa-users-rectangle mr-2"></i> Colaboradores e Interesses (CRediT):
                            </h5>
                            <div class="space-y-4">
                                ${p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="border-b border-gray-200 pb-3 relative">
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="font-bold text-[#1e3a2c] uppercase text-[12px]">${m.author}</span>
                                            <div class="flex items-center space-x-3">
                                                <span class="text-[10px] text-gray-400 italic">${m.date}</span>
                                                ${m.author === app.currentUser ? `<button @click="deleteManifest(${p.id}, ${m.id})" class="text-red-400 text-xs hover:text-red-700">×</button>` : ''}
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-2 mb-2">
                                            ${(m.roles || []).map(r => `<span class="bg-[#c5a059]/20 text-[#1e3a2c] px-2 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-tighter border border-[#c5a059]/30">${r}</span>`).join('')}
                                        </div>
                                        <p class="text-gray-600 text-[11px] italic leading-relaxed">"${m.text}"</p>
                                    </div>`).join('') : '<p class="text-[10px] text-gray-300 italic">Nenhuma manifestação para este trabalho.</p>'}
                            </div>
                        </div>

                        <div class="text-right mt-6">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-8 py-2 rounded text-[10px] font-bold uppercase hover:bg-black transition">
                                Manifestar Interesse
                            </button>
                        </div>
                    </div>`).join('')}
            </div>

            <div x-show="showInterestModal" class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[110]" x-cloak>
                <div class="bg-white p-10 rounded-xl max-w-2xl w-full shadow-2xl relative">
                    <button @click="showInterestModal = false" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-600">×</button>
                    <h3 class="text-xl font-bold uppercase mb-6 border-b pb-4 text-[#1e3a2c]">${app.uiLabels[app.lang].creditTitle}</h3>
                    
                    <div class="mb-6">
                        <p class="text-[10px] font-bold uppercase text-gray-400 mb-3 italic">Selecione suas áreas de contribuição:</p>
                        <div class="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg border max-h-48 overflow-y-auto">
                            <template x-for="role in app.creditOptions" :key="role">
                                <label class="flex items-center space-x-2 text-[10px] font-bold cursor-pointer hover:text-eb-gold transition">
                                    <input type="checkbox" :value="role" x-model="manifestForm.selectedRoles" class="rounded text-[#1e3a2c] focus:ring-[#1e3a2c]"> 
                                    <span x-text="role"></span>
                                </label>
                            </template>
                        </div>
                    </div>

                    <textarea x-model="manifestForm.text" class="w-full border-2 p-3 rounded text-sm h-24 mb-6 outline-none focus:border-eb-gold" placeholder="Descreva brevemente sua intenção de apoio ao autor..."></textarea>
                    
                    <button @click="submitManifest()" class="w-full bg-[#c5a059] text-[#1e3a2c] font-bold py-4 rounded uppercase text-xs shadow-xl hover:bg-yellow-600 transition">
                        Enviar Manifestação
                    </button>
                </div>
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" x-cloak>
                <div class="bg-white p-10 rounded-xl max-w-2xl w-full shadow-2xl">
                    <h3 class="text-xl font-bold uppercase mb-6 text-[#1e3a2c] border-b pb-4">Nova Publicação Acadêmica</h3>
                    <div class="space-y-4">
                        <input type="text" x-model="newProj.title" placeholder="Título da Pesquisa ou Projeto" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-gold">
                        <select x-model="newProj.domainId" class="w-full border-2 p-3 rounded text-sm bg-white">
                            <option value="1">Domínio 1</option><option value="2">Domínio 2</option><option value="3">Domínio 3</option>
                        </select>
                        <textarea x-model="newProj.description" placeholder="Resumo Executivo" class="w-full border-2 p-3 rounded text-sm h-32 outline-none focus:border-eb-gold"></textarea>
                        
                        <div class="flex space-x-4 mt-6">
                            <button @click="confirmPublish()" class="bg-[#1e3a2c] text-white px-10 py-3 rounded font-bold uppercase text-xs shadow-lg">Confirmar Publicação</button>
                            <button @click="showProjectForm = false" class="bg-gray-300 px-6 py-3 rounded font-bold uppercase text-xs">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

// LOGIN MODULE (Mantido estável)
function renderResearcherLogin(app) {
    return `<div class="py-32 flex justify-center"><div class="bg-white p-12 rounded-xl shadow-2xl border-t-8 border-eb-gold w-full max-w-md text-center">
        <h3 class="font-bold uppercase text-[#1e3a2c] text-xl mb-8 tracking-tighter">Autenticação LCM</h3>
        <div class="space-y-5">
            <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green">
            <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green">
            <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded uppercase text-xs hover:bg-black transition shadow-lg">Entrar</button>
        </div>
    </div></div>`;
}
