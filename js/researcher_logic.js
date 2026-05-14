/**
 * RESEARCHER LOGIC - Versão 57.0
 * Correção: Blindagem total contra 'undefined' e fluxo de login.
 */
function renderResearcherModule(app) {
    // PROTEÇÃO CRÍTICA: Se o login falhar ou o objeto de tradução sumir, usamos fallback manual.
    if (!app.isLoggedIn) return renderResearcherLogin(app);

    const labels = {
        pt: { title: "Painel de Pesquisa", sub1: "Andamento", sub2: "Futuro", pub: "Publicar" },
        en: { title: "Research Panel", sub1: "Ongoing", sub2: "Future", pub: "Publish" },
        es: { title: "Panel de Investigación", sub1: "Andamiento", sub2: "Futuro", pub: "Publicar" }
    }[app.lang] || { title: "Painel", sub1: "Andamento", sub2: "Futuro", pub: "Publicar" };

    const projects = (app.projects || []).filter(p => p.status === app.researcherSubView);

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b-2 border-eb-gold pb-8">
                <div><h2 class="text-3xl font-bold text-[#1e3a2c] uppercase">${labels.title}</h2><p class="text-xs text-gray-500 font-bold uppercase mt-2">Conectado: ${app.currentUser}</p></div>
                <button @click="logout()" class="bg-red-700 text-white px-6 py-2 rounded font-bold uppercase text-[11px] shadow-lg">Sair</button>
            </div>
            
            <div class="flex justify-center space-x-12 mb-12 border-b">
                <button @click="researcherSubView = 'andamento'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'andamento' ? 'tab-active' : 'text-gray-400'}">${labels.sub1}</button>
                <button @click="researcherSubView = 'futuro'" class="pb-4 text-xs font-bold uppercase tracking-widest ${app.researcherSubView === 'futuro' ? 'tab-active' : 'text-gray-400'}">${labels.sub2}</button>
            </div>

            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase">${app.researcherSubView === 'andamento' ? 'Em Curso' : 'Planejamento'}</h3>
                <button @click="showProjectForm = true" class="bg-eb-gold text-[#1e3a2c] px-8 py-3 rounded-lg font-bold text-[11px] uppercase shadow-xl hover:scale-105 transition">${labels.pub}</button>
            </div>

            <div class="grid grid-cols-1 gap-10">
                ${projects.map(p => `
                    <div class="p-10 rounded-xl shadow-2xl bg-white ${p.domainId == 1 ? 'bg-dom-1' : (p.domainId == 2 ? 'bg-dom-2' : 'bg-dom-3')}">
                        <div class="flex justify-between items-start mb-6">
                            <h4 class="text-2xl font-bold text-[#1e3a2c] uppercase leading-tight">${p.title}</h4>
                            <span class="text-[10px] font-bold bg-[#1e3a2c] text-white px-4 py-1.5 rounded-full uppercase">Domínio ${p.domainId}</span>
                        </div>
                        <p class="text-gray-700 italic border-t border-black/5 pt-6 mb-8">${p.description}</p>
                        
                        <div class="bg-white/70 p-6 rounded-lg shadow-inner">
                            <h5 class="text-[11px] font-bold uppercase text-[#1e3a2c] mb-4">CRediT Log:</h5>
                            <div class="space-y-4">
                                ${(p.manifests || []).map(m => `
                                    <div class="text-[12px] border-b border-black/5 pb-3">
                                        <div class="flex justify-between font-bold"><span>${m.author}</span><span class="text-gray-400">${m.date}</span></div>
                                        <div class="mt-1">${(m.roles || []).map(r => `<span class="bg-eb-gold/30 text-[9px] px-2 rounded-full font-bold uppercase mr-1">${r}</span>`).join('')}</div>
                                        <p class="mt-2 italic">"${m.text}"</p>
                                    </div>`).join('')}
                            </div>
                        </div>
                        <div class="text-right mt-8"><button @click="selectedProject = ${p.id}; showInterestModal = true" class="bg-[#1e3a2c] text-white px-10 py-3 rounded text-[10px] font-bold uppercase shadow-lg">Manifestar Interesse</button></div>
                    </div>`).join('')}
                ${projects.length === 0 ? '<p class="text-center py-20 text-gray-400 italic">Nenhum projeto registrado.</p>' : ''}
            </div>

            <div x-show="showProjectForm" class="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" x-cloak>
                <div class="bg-white rounded-xl w-full max-w-3xl p-10 relative overflow-y-auto max-h-[90vh]">
                    <button @click="showProjectForm = false" class="absolute top-6 right-6 text-3xl text-gray-400">×</button>
                    <h3 class="text-2xl font-bold text-eb-green uppercase border-b pb-6 mb-8">Formalizar Pesquisa</h3>
                    <div class="space-y-6">
                        <input type="text" x-model="newProj.title" placeholder="Título" class="w-full border-2 p-3 rounded-lg text-sm">
                        <select x-model="newProj.domainId" class="w-full border-2 p-3 rounded-lg text-sm">
                            <option value="1">Domínio 1</option><option value="2">Domínio 2</option><option value="3">Domínio 3</option>
                        </select>
                        <textarea x-model="newProj.description" placeholder="Resumo" class="w-full border-2 p-3 rounded-lg text-sm h-40"></textarea>
                        <button @click="confirmPublish()" class="w-full bg-[#1e3a2c] text-white font-bold py-4 rounded uppercase text-xs shadow-xl">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderResearcherLogin(app) {
    return `<div class="py-32 flex justify-center"><div class="bg-white p-12 rounded-xl shadow-2xl border-t-8 border-eb-gold w-full max-w-md text-center">
        <h3 class="font-bold uppercase text-[#1e3a2c] text-xl mb-8">Acesso Restrito</h3>
        <div class="space-y-5">
            <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border-2 p-3 rounded text-sm outline-none">
            <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border-2 p-3 rounded text-sm outline-none">
            <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-3 rounded uppercase text-xs hover:bg-black shadow-lg">Entrar</button>
        </div>
    </div></div>`;
}
