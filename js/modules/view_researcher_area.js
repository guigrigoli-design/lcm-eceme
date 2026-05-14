function renderResearcherArea(app) {
    if (!app.isLoggedIn) return '';
    const projects = app.projects.filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b pb-6">
                <div><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Painel LCM</h2><p class="text-[10px] text-gray-500 font-bold uppercase">Pesquisador: ${app.currentUser}</p></div>
                <button @click="logout()" class="bg-red-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow-md">Sair</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">Em Andamento</button>
                <button @click="researcherSubView = 'futuro'" class="pb-3 text-xs font-bold uppercase ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">Projetos Futuros</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">Gerenciamento</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-6 py-2 rounded font-bold text-[10px] uppercase shadow">Nova Pesquisa</button>
            </div>

            <div class="grid grid-cols-1 gap-8">
                ${projects.map(p => `
                    <div class="p-8 rounded-lg shadow bg-white border-l-8 ${p.domainId == 1 ? 'border-blue-700' : (p.domainId == 2 ? 'border-green-700' : 'border-orange-700')}">
                        <div class="flex justify-between mb-4">
                            <h4 class="text-lg font-bold uppercase text-[#1e3a2c]">${p.title}</h4>
                            ${p.author === app.currentUser ? `<button @click="deleteProject(${p.id})" class="text-red-700"><i class="fa-solid fa-trash-can"></i></button>` : ''}
                        </div>
                        <p class="text-sm text-gray-700 italic mb-6">${p.description}</p>
                        <div class="bg-gray-50 p-4 rounded text-[11px]">
                            <h5 class="font-bold uppercase mb-2">Interesses Registrados:</h5>
                            ${(p.manifests || []).map(m => `<div class="border-b pb-1 mb-1"><b>${m.author}</b>: ${m.text}</div>`).join('')}
                        </div>
                    </div>`).join('')}
                ${projects.length === 0 ? '<p class="text-center py-20 text-gray-400 italic">Nenhuma pesquisa registrada nesta categoria.</p>' : ''}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" x-cloak>
                <div class="bg-white p-8 rounded-xl max-w-2xl w-full shadow-2xl">
                    <h3 class="text-xl font-bold uppercase mb-6 text-[#1e3a2c]">Publicar Pesquisa</h3>
                    <div class="space-y-4">
                        <input type="text" x-model="newProj.title" placeholder="Título" class="w-full border p-2 rounded text-sm outline-none">
                        <textarea x-model="newProj.description" placeholder="Resumo e CRediT necessários" class="w-full border p-2 rounded text-sm h-32 outline-none"></textarea>
                        <div class="flex space-x-4">
                            <button @click="confirmPublish()" class="bg-[#1e3a2c] text-white px-6 py-2 rounded font-bold uppercase text-xs">Confirmar</button>
                            <button @click="showProjectForm = false" class="bg-gray-200 px-6 py-2 rounded font-bold uppercase text-xs">Voltar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderResearcherLogin(app) {
    return `
        <div class="py-32 flex justify-center">
            <div class="bg-white p-12 rounded-xl shadow-2xl border-t-8 border-[#c5a059] w-full max-w-md text-center">
                <h3 class="font-bold uppercase text-[#1e3a2c] text-xl mb-8">Acesso LCM</h3>
                <div class="space-y-5">
                    <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green transition">
                    <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border-2 p-3 rounded text-sm outline-none focus:border-eb-green transition">
                    <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded uppercase text-xs hover:bg-black transition shadow-lg">Entrar</button>
                </div>
            </div>
        </div>`;
}
