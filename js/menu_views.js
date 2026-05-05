function renderMenuModule(app) {
    const { view, lang, data } = app;
    
    // ABA: PESQUISADORES[cite: 1]
    if (view === 'all_researchers') {
        const getGroup = (cat) => data.researchers.filter(r => {
            let role = (r.role.pt || "").toLowerCase();
            let isDr = (role.includes("doutor") || role.includes("phd"));
            return cat === 'pleno' ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `
            <div class="container mx-auto px-6 py-12">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">Pesquisadores Plenos</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    ${getGroup('pleno').map(r => renderResearcherCard(r, lang)).join('')}
                </div>
                <h3 class="text-xl font-bold text-gray-600 uppercase border-b-4 border-gray-300 pb-2 mb-10">Pesquisadores</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    ${getGroup('assistente').map(r => renderResearcherCard(r, lang)).join('')}
                </div>
            </div>`;
    }

    // ABA: DOMÍNIOS (Com Sustentação)[cite: 1]
    if (view === 'domains') {
        const domains = [
            { id: 1, title: "Ciência, Tecnologia, Inovação e Sustentação em Defesa" },
            { id: 2, title: "Preparo e Emprego do Poder Militar" },
            { id: 3, title: "Análise e Prospecção do Ambiente Estratégico" }
        ];
        return `
            <div class="container mx-auto px-6 py-12">
                ${domains.map(d => `
                    <div class="mb-16">
                        <h3 class="text-lg font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-4 mb-8">${d.title}</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                            ${data.researchers.filter(r => r.domain_id == d.id).map(r => renderResearcherCard(r, lang)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>`;
    }

    // Fallback para Home
    return `<div class="container mx-auto px-6 py-20 text-center italic">${data.intro ? data.intro[lang] : 'Carregando...'}</div>`;
}

function renderResearcherCard(r, lang) {
    return `
        <div class="flex flex-col items-center">
            <div class="circle-container"><img src="${r.photo}" class="circle-img"></div>
            <h4 class="font-bold text-center text-sm">${r.name}</h4>
            <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center">${r.role[lang] || ''}</p>
            <a href="${r.lattes}" target="_blank" class="text-[9px] font-bold border-2 border-[#1e3a2c] px-4 py-1 rounded-full mt-3">LATTES CV</a>
        </div>`;
}
