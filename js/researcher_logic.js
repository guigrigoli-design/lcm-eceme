function renderResearcherModule(app) {
    if (!app.isLoggedIn) return renderResearcherLogin(app);

    const filteredProjects = (app.projects || []).filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b pb-6">
                <div><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Painel de Colaboração LCM</h2><p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pesquisador: ${app.currentUser}</p></div>
                <button @click="logout()" class="bg-red-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase hover:bg-red-800 transition shadow">Sair <i class="fa-solid fa-power-off ml-2"></i></button>
            </div>
            
            <div class="flex justify-center space-x-8 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-3 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Pesquisas em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-3 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-lg font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Em Curso' : 'Pesquisas Futuras'}</h3>
                <button @click="showProjectForm = true" class="bg-[#c5a059] text-[#1e3a2c] px-6 py-2 rounded font-bold text-[10px] uppercase shadow-lg hover:scale-105 transition">Publicar Pesquisa</button>
            </div>

            <div class="grid grid-cols-1 gap-8">
                ${filteredProjects.map(p => `
                    <div class="p-8 rounded-lg shadow-md bg-white ${p.domainId == 1 ? 'bg-dom-1' : (p.domainId == 2 ? 'bg-dom-2' : 'bg-dom-3')}">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="text-xl font-bold text-[#1e3a2c] uppercase">${p.title}</h4>
                            <div class="flex space-x-2">
                                ${p.author === app.currentUser ? `
                                    <button @click="deleteProject(${p.id})" class="text-red-700 hover:text-red-900 transition" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                                    ${p.status === 'futuro' ? `<button @click="migrateToCurrent(${p.id})" class="text-blue-700 hover:text-blue-900 transition" title="Migrar para Em Curso"><i class="fa-solid fa-rocket"></i></button>` : ''}
                                ` : ''}
                                <span class="text-[9px] font-bold bg-[#1e3a2c] text-white px-3 py-1 rounded">Domínio ${p.domainId}</span>
                            </div>
                        </div>
                        <div class="mb-4"><a href="${p.link}" target="_blank" class="text-blue-800 text-xs font-bold underline italic hover:text-blue-600 transition"><i class="fa-solid fa-link mr-2"></i>Link da Pesquisa</a></div>
                        <p class="text-sm text-gray-700 italic border-t border-black/5 pt-4 mb-4">${p.description}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${(p.creditNeeds || []).map(need => `<span class="text-[8px] bg-white/60 px-2 py-0.5 rounded-full border border-black/10 font-bold uppercase text-gray-600">${need}</span>`).join('')}
                        </div>

                        <div class="bg-white/50 p-4 rounded border border-black/5">
                            <h5 class="text-[10px] font-bold uppercase text-[#1e3a2c] mb-2">Colaboradores Interessados:</h5>
                            <div class="space-y-2">
                                ${p.manifests && p.manifests.length > 0 ? p.manifests.map(m => `
                                    <div class="text-[11px] border-b pb-1"><b>${m.author}</b> <span class="text-eb-gold uppercase text-[9px]">[${m.role}]</span>: ${m.text}</div>
                                `).join('') : '<p class="text-[10px] text-gray-400 italic">Sem manifestações.</p>'}
                            </div>
                        </div>
                        <div class="text-right mt-4">
                            <button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-6 py-1.5 rounded text-[10px] font-bold uppercase">Manifestar Interesse</button>
                        </div>
                    </div>`).join('')}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-lg w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
                    <button @click="showProjectForm = false" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-600">×</button>
                    <h3 class="text-xl font-bold text-eb-green uppercase border-b pb-4 mb-6">Cadastrar Pesquisa</h3>
                    <div class="space-y-4">
                        <input type="text" x-model="newProj.title" placeholder="Título da Pesquisa" class="w-full border p-2 rounded text-sm outline-none">
                        <input type="url" x-model="newProj.link" placeholder="URL de Acesso (Link da Pesquisa)" class="w-full border p-2 rounded text-sm outline-none">
                        <select x-model="newProj.domainId" class="w-full border p-2 rounded text-sm outline-none">
                            <option value="1">Domínio 1 - Sustentação</option>
                            <option value="2">Domínio 2 - Preparo</option>
                            <option value="3">Domínio 3 - Prospecção</option>
                        </select>
                        <textarea x-model="newProj.description" placeholder="Resumo e Intenções" class="w-full border p-2 rounded text-sm h-32 outline-none"></textarea>
                        
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-500 mb-2 italic">Selecione o tipo de colaboração necessária (CRediT):</label>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <template x-for="opt in creditOptions" :key="opt">
                                    <label class="flex items-center space-x-2 text-[9px] bg-gray-50 p-2 rounded cursor-pointer hover:bg-gray-200 transition">
                                        <input type="checkbox" :value="opt" x-model="newProj.creditNeeds" class="rounded text-[#1e3a2c]">
                                        <span x-text="opt"></span>
                                    </label>
                                </template>
                            </div>
                        </div>

                        <button @click="confirmPublish()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded text-xs uppercase hover:bg-black transition shadow-lg">Confirmar Pesquisa</button>
                    </div>
                </div>
            </div>

            <div x-show="showInterestModal" class="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-lg w-full max-w-lg p-8 relative">
                    <button @click="showInterestModal = false" class="absolute top-4 right-4 text-2xl text-gray-400">×</button>
                    <h3 class="text-xl font-bold text-eb-green uppercase border-b pb-4 mb-6">Manifestar Interesse</h3>
                    <div class="space-y-4">
                        <textarea x-model="manifestForm.text" class="w-full border p-4 rounded text-sm h-32 outline-none" placeholder="Sua proposta..."></textarea>
                        <select x-model="manifestForm.role" class="w-full border p-2 rounded text-sm outline-none">
                            <template x-for="role in app.creditOptions" :key="role"><option :value="role" x-text="role"></option></template>
                        </select>
                        <button @click="submitManifest(app)" class="w-full bg-[#c5a059] text-[#1e3a2c] font-bold py-3 rounded text-xs uppercase">Registrar Manifestação</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderResearcherLogin(app) {
    return `<div class="py-20 flex justify-center"><div class="bg-white p-10 rounded shadow-2xl border-t-8 border-[#c5a059] w-full max-w-md text-center">
        <h3 class="font-bold uppercase text-[#1e3a2c] mb-6">Área Restrita LCM</h3>
        <div class="space-y-4">
            <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border p-2 rounded text-sm outline-none">
            <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border p-2 rounded text-sm outline-none">
            <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-2 rounded text-xs uppercase transition hover:bg-black">Entrar</button>
        </div>
    </div></div>`;
}
