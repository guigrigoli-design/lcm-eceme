function renderResearcherArea(app) {
    if (!app.isLoggedIn) return '';
    const projects = app.projects.filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b pb-6">
                <div><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Painel LCM</h2><p class="text-[10px] text-gray-500 font-bold uppercase">Sessão: ${app.currentUser}</p></div>
                <button @click="logout()" class="bg-red-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">Sair</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Pesquisas em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">Projetos</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-6 py-2 rounded font-bold text-[10px] uppercase shadow-lg">Publicar Pesquisa</button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${projects.map(p => `
                    <div class="p-8 rounded-lg shadow-xl bg-white border-l-8 ${p.domainId == 1 ? 'border-blue-700' : (p.domainId == 2 ? 'border-green-700' : 'border-orange-700')}">
                        <div class="flex justify-between mb-4">
                            <h4 class="text-xl font-bold uppercase text-[#1e3a2c]">${p.title}</h4>
                            ${p.author === app.currentUser ? `<button @click="deleteAndSave(${p.id})" class="text-red-700"><i class="fa-solid fa-trash-can"></i></button>` : ''}
                        </div>
                        <p class="text-gray-700 italic mb-6">${p.description}</p>
                        <div class="bg-slate-50 p-4 rounded text-[11px]">
                            <h5 class="font-bold uppercase mb-2">Colaboração CRediT:</h5>
                            ${p.manifests.map(m => `<div><b>${m.author}</b> (${m.date}): ${m.text}</div>`).join('')}
                        </div>
                    </div>`).join('')}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" x-cloak>
                <div class="bg-white p-8 rounded-xl max-w-2xl w-full">
                    <h3 class="text-xl font-bold uppercase mb-6 text-[#1e3a2c]">Nova Pesquisa</h3>
                    <div class="space-y-4">
                        <input type="text" x-model="newProj.title" placeholder="Título" class="w-full border p-2 rounded text-sm">
                        <textarea x-model="newProj.description" placeholder="Resumo" class="w-full border p-2 rounded text-sm h-32"></textarea>
                        <div class="flex space-x-4">
                            <button @click="publishAndSave()" class="bg-[#1e3a2c] text-white px-6 py-2 rounded font-bold uppercase text-xs">Publicar</button>
                            <button @click="showProjectForm = false" class="bg-gray-200 px-6 py-2 rounded font-bold uppercase text-xs">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

// Extensões da lógica para persistência (Adicionar ao app_core ou injetar)
function publishAndSave() {
    this.confirmPublish();
    this.savePersistence();
}

function deleteAndSave(id) {
    this.deleteProject(id);
    this.savePersistence();
}
