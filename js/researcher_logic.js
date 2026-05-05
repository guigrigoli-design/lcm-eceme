function renderResearcherModule(app) {
    if (!app.isLoggedIn) return renderLogin(app);

    // Lógica de Cores por Domínio[cite: 1]
    const getDomClass = (id) => id == 1 ? 'bg-dom-1' : (id == 2 ? 'bg-dom-2' : 'bg-dom-3');

    return `
        <div class="container mx-auto px-4 py-12">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-10">Área de Colaboração</h2>
            <div class="space-y-8">
                ${app.projects ? app.projects.map(p => `
                    <div class="p-8 rounded-lg shadow-md border-l-8 ${getDomClass(p.domainId)}">
                        <h4 class="text-xl font-bold text-[#1e3a2c] mb-1">${p.title}</h4>
                        <a href="${p.link}" target="_blank" class="text-blue-700 text-xs underline mb-4 block italic">Link da Pesquisa</a>
                        <p class="text-sm text-gray-700 mb-6">${p.description}</p>
                        
                        <!-- REGISTRO DE MANIFESTAÇÕES (Visível para todos) -->
                        <div class="mt-4 pt-4 border-t border-black/10">
                            <h5 class="text-[10px] font-bold uppercase mb-2">Manifestações de Interesse (CREDIT):</h5>
                            ${(p.manifests || []).map(m => `
                                <div class="bg-white/50 p-2 rounded mb-2 text-[10px]">
                                    <strong>${m.author}</strong> (${m.creditRole}): ${m.text}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : '<p class="italic">Nenhum projeto publicado.</p>'}
            </div>
        </div>`;
}

function renderLogin(app) {
    return `<div class="py-20 flex justify-center">
        <div class="bg-white p-10 rounded shadow-xl border-t-8 border-[#c5a059] w-full max-w-md text-center">
            <h3 class="font-bold uppercase text-[#1e3a2c] mb-6">Acesso Área do Pesquisador</h3>
            <input type="email" id="lEmail" placeholder="E-mail" class="w-full border p-2 mb-4 rounded text-sm">
            <input type="password" id="lPass" placeholder="Senha" class="w-full border p-2 mb-6 rounded text-sm">
            <button onclick="app().handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-2 rounded">ENTRAR</button>
        </div>
    </div>`;
}
