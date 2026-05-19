/**
 * MODULE: Researcher Area (v66.0)
 * Implementação do Menu de Seleção CRediT e Card Detalhado de Manifestação.
 */
function renderResearcherArea(app) {
    if (!app.isLoggedIn) return '';
    const projects = app.projects.filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b pb-6">
                <div><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Painel Acadêmico LCM</h2><p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sessão Ativa: ${app.currentUser}</p></div>
                <button @click="logout()" class="bg-red-700 text-white px-5 py-2 rounded text-[10px] font-bold uppercase shadow-md">Sair</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Pesquisas Ativas' : 'Projetos de Pesquisa Futuros'}</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-6 py-2 rounded font-bold text-[10px] uppercase shadow">Publicar Pesquisa</button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${projects.map(p => `
                    <div class="p-8 rounded-lg shadow-xl bg-white border-l-8 ${p.domainId == 1 ? 'border-blue-800' : (p.domainId == 2 ? 'border-green-800' : 'border-orange-800')}">
                        <div class="flex justify-between mb-4">
                            <h4 class="text-xl font-bold uppercase text-[#1e3a2c]">${p.title}</h4>
                            <div class="flex space-x-4">
                                ${p.author === app.currentUser ? `
                                    <button @click="deleteProject(${p.id})" class="text-red-700 hover:scale-110 transition"><i class="fa-solid fa-trash-can"></i></button>
                                    ${p.status === 'futuro' ? `<button @click="migrateToOngoing(${p.id})" class="text-blue-700 hover:scale-110 transition"><i class="fa-solid fa-rocket"></i></button>` : ''}
                                ` : ''}
                                <span class="bg-[#1e3a2c] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase">Domínio ${p.domainId}</span>
                            </div>
                        </div>
                        <p class="text-gray-700 italic border-t pt-4 mb-6 text-base">${p.description}</p>
                        
                        <div class="bg-gray-50 p-6 rounded-lg border space-y-4">
                            <h5 class="text-[11px] font-bold uppercase mb-2 text-[#c5a059] flex items-center">
                                <i class="fa-solid fa-users-rectangle mr-2"></i> Colaboradores Interessados e Funções CRediT:
                            </h5>
                            <div class="grid grid-cols-1 gap-4">
                                ${p.manifests && p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
                                        <div class="flex justify-between items-center border-b pb-2 mb-2">
                                            <span class="font-bold text-[#1e3a2c] text-xs uppercase"><i class="fa-solid fa-user-check mr-1"></i> Colaborador: ${m.author}</span>
                                            <span class="text-[10px] text-gray-400 font-bold"><i class="fa-solid fa-calendar-alt mr-1"></i> ${m.date}</span>
                                        </div>
                                        <div class="mb-3">
                                            <span class="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Áreas de Atuação (Taxonomia CRediT):</span>
                                            <div class="flex flex-wrap gap-1.5">
                                                ${(m.roles || []).map(role => `<span class="bg-[#c5a059]/10 text-[#1e3a2c] text-[9px] px-2.5 py-0.5 rounded font-bold uppercase border border-[#c5a059]/20 shadow-xs">${role}</span>`).join('')}
                                            </div>
                                        </div>
                                        <p class="text-gray-600 text-[11px] italic bg-slate-50 p-2.5 rounded border border-gray-100 leading-relaxed">"${m.text}"</p>
                                        
                                        <div class="mt-2 pt-2 border-t border-dashed flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                            <span>Registrado por: ${m.author}</span>
                                            ${m.author === app.currentUser ? `
                                                <button @click="deleteManifest(${p.id}, ${m.id})" class="text-red-600 hover:text-red-800 font-bold transition flex items-center space-x-1 border border-red-200 px-2 py-0.5 rounded bg-red-50 shadow-xs">
                                                    <i class="fa-solid fa-circle-minus"></i> <span>Retirar Manifestação</span>
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>`).join('') : '<p class="text-[11px] text-gray-400 italic text-center py-2">Nenhum pesquisador manifestou intenção de participação até o momento.</p>'}
                            </div>
                        </div>

                        <div class="text-right mt-6">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-8 py-2 rounded text-[10px] font-bold uppercase hover:bg-black transition shadow">
                                Manifestar Interesse
                            </button>
                        </div>
                    </div>`).join('')}
            </div>

            <div x-show="showInterestModal" class="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[110]" x-cloak>
                <div class="bg-white p-8 rounded-xl max-w-2xl w-full shadow-2xl relative">
                    <button @click="showInterestModal = false" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-600">×</button>
                    <h3 class="text-xl font-bold uppercase mb-6 border-b pb-4 text-[#1e3a2c]">${app.uiLabels[app.lang].creditTitle}</h3>
                    
                    <div x-data="{ openMenu: false }" class="relative mb-6">
                        <label class="text-[10px] font-bold uppercase text-gray-400 block mb-2 tracking-wider">Menu de Seleção CRediT (Selecione múltiplas opções):</label>
                        <button @click="openMenu = !openMenu" type="button" class="w-full bg-white border-2 p-3 rounded-lg text-sm text-left flex justify-between items-center focus:border-eb-gold outline-none shadow-xs">
                            <span x-text="manifestForm.selectedRoles.length ? 'Funções Selecionadas: (' + manifestForm.selectedRoles.length + ')' : 'Clique para abrir o menu de seleção...'" class="font-bold text-gray-700"></span>
                            <i class="fa-solid fa-chevron-down text-gray-400 transition-transform duration-200" :class="openMenu ? 'rotate-180' : ''"></i>
                        </button>
                        
                        <div x-show="openMenu" @click.outside="openMenu = false" class="absolute left-0 right-0 mt-1 bg-white border-2 rounded-lg shadow-2xl max-h-56 overflow-y-auto z-[120] p-2 space-y-1" x-cloak>
                            <template x-for="role in app.creditOptions" :key="role">
                                <label class="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 cursor-pointer text-xs font-bold text-gray-700 transition">
                                    <input type="checkbox" :value="role" x-model="manifestForm.selectedRoles" class="rounded text-[#1e3a2c] focus:ring-[#1e3a2c] h-4 w-4 border-gray-300">
                                    <span x-text="role" :class="manifestForm.selectedRoles.includes(role) ? 'text-[#c5a059]' : ''"></span>
                                </label>
                            </template>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mt-3">
                            <template x-for="role in manifestForm.selectedRoles" :key="role">
                                <span class="bg-gray-100 text-gray-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200 shadow-3xs" x-text="role"></span>
                            </template>
                        </div>
                    </div>

                    <textarea x-model="manifestForm.text" class="w-full border-2 p-4 rounded-lg text-sm h-28 mb-6 outline-none focus:border-eb-gold shadow-2xs" placeholder="Descreva pormenorizadamente sua intenção de cooperação acadêmica..."></textarea>
                    
                    <button @click="submitManifest()" class="w-full bg-[#c5a059] text-[#1e3a2c] font-bold py-4 rounded uppercase text-xs shadow-xl hover:bg-yellow-600 transition tracking-widest">
                        Enviar Manifestação de Interesse
                    </button>
                </div>
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" x-cloak>
                <div class="bg-white p-10 rounded-xl max-w-2xl w-full shadow-2xl">
                    <h3 class="text-xl font-bold uppercase mb-6 text-[#1e3a2c] border-b pb-4">Nova Publicação de Pesquisa</h3>
                    <div class="space-y-4">
                        <input type="text" x-model="newProj.title" placeholder="Título da Pesquisa Científica" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-gold">
                        <select x-model="newProj.domainId" class="w-full border-2 p-3 rounded text-sm bg-white outline-none">
                            <option value="1">Domínio 1 - Ciência, Tecnologia e Inovação</option>
                            <option value="2">Domínio 2 - Preparo e Emprego</option>
                            <option value="3">Domínio 3 - Ambiente Estratégico</option>
                        </select>
                        <textarea x-model="newProj.description" placeholder="Resumo Executivo / Metodologia Inicial" class="w-full border-2 p-3 rounded text-sm h-32 outline-none focus:border-eb-gold"></textarea>
                        
                        <div class="flex space-x-4 mt-6">
                            <button @click="confirmPublish()" class="bg-[#1e3a2c] text-white px-10 py-3 rounded font-bold uppercase text-xs shadow-lg">Confirmar Publicação</button>
                            <button @click="showProjectForm = false" class="bg-gray-300 px-6 py-3 rounded font-bold uppercase text-xs">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderResearcherLogin(app) {
    return `<div class="py-32 flex justify-center"><div class="bg-white p-12 rounded-xl shadow-2xl border-t-8 border-eb-gold w-full max-w-md text-center">
        <h3 class="font-bold uppercase text-[#1e3a2c] text-xl mb-8 tracking-tighter">Autenticação Institucional</h3>
        <div class="space-y-5">
            <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green">
            <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green">
            <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded uppercase text-xs hover:bg-black transition shadow-lg">Entrar</button>
        </div>
    </div></div>`;
}
