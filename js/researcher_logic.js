/**
 * RESEARCHER LOGIC - Colaboração CRediT e Cores de Domínio
 */
function renderResearcherModule(app) {
    if (!app.isLoggedIn) return renderLogin(app);

    const getDomClass = (id) => id == 1 ? 'bg-dom-1' : (id == 2 ? 'bg-dom-2' : 'bg-dom-3');

    return `
        <div class="container mx-auto px-4 py-12">
            <div class="flex justify-between items-center mb-10 border-b pb-4">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase">Rede de Colaboração LCM</h2>
                <button @click="logout()" class="text-red-700 font-bold text-xs uppercase">Sair <i class="fa-solid fa-power-off"></i></button>
            </div>

            <div class="space-y-8">
                ${(app.projects || []).map(p => `
                    <div class="p-8 rounded-lg shadow-md border-l-8 ${getDomClass(p.domainId)}">
                        <div class="flex justify-between mb-2">
                            <h4 class="text-xl font-bold text-[#1e3a2c]">${p.title}</h4>
                            <span class="text-[9px] font-bold uppercase opacity-60">Domínio ${p.domainId}</span>
                        </div>
                        <a href="${p.link}" target="_blank" class="text-blue-700 text-xs underline mb-4 block italic">Acessar Link da Pesquisa</a>
                        <p class="text-sm text-gray-700 mb-6">${p.description}</p>
                        
                        <div class="mt-4 pt-4 border-t border-black/10">
                            <h5 class="text-[10px] font-bold uppercase text-[#1e3a2c] mb-3">Manifestações CRediT:</h5>
                            ${(p.manifests || []).map(m => `
                                <div class="bg-white/50 p-3 rounded mb-2 text-[10px] border">
                                    <span class="font-bold">${m.author}</span> [${m.creditRole}]: ${m.text}
                                </div>
                            `).join('')}
                        </div>
                        <button onclick="alert('Funcionalidade de Registro CRediT Ativa')" class="mt-6 bg-[#1e3a2c] text-white px-6 py-2 rounded text-[10px] font-bold">COLABORAR NESTA PESQUISA</button>
                    </div>
                `).join('')}
            </div>
        </div>`;
}

function renderLogin(app) {
    return `<div class="py-20 flex justify-center">
        <div class="bg-white p-10 rounded shadow-xl border-t-8 border-[#c5a059] w-full max-w-md">
            <h3 class="font-bold uppercase text-[#1e3a2c] mb-6 text-center">Acesso Área do Pesquisador</h3>
            <div class="space-y-4">
                <input type="email" x-model="loginEmail" placeholder="E-mail" class="w-full border p-2 rounded text-sm outline-none">
                <input type="password" x-model="loginPass" placeholder="Senha" class="w-full border p-2 rounded text-sm outline-none">
                <button @click="handleLogin()" class="w-full bg-[#1e3a2c] text-white font-bold py-2 rounded">ENTRAR</button>
            </div>
        </div>
    </div>`;
}
