function renderMenuModule(app) {
    const { view, lang, data, cnpSubView, uiLabels } = app;

    // 1. HOME
    if (view === 'home') return renderHome(app);

    // 2. INTEGRANTES (Lógica Corrigida: Plenos = Doutores)
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            const role = (r.role.pt || "").toLowerCase();
            const isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return senior ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `<div class="container mx-auto px-6 py-12">
            <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${uiLabels[lang].plenos}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
            <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${uiLabels[lang].regular}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`;
    }

    // 3. CAPACITAÇÃO DE NOVOS PESQUISADORES (NCNP)
    if (view === 'cnp') {
        const labels = {
            pt: { s1: 'Coordenadores', s2: 'Documentação', s3: 'Pesquisadores (Alunos)' },
            en: { s1: 'Advisors', s2: 'Documents', s3: 'Researchers (Students)' },
            es: { s1: 'Coordinadores', s2: 'Documentación', s3: 'Investigadores' }
        };
        const subNav = `<div class="flex justify-center space-x-6 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-2 text-[10px] uppercase font-bold ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">${labels[lang].s1}</button>
            <button @click="setCnpSubView('docs')" class="pb-2 text-[10px] uppercase font-bold ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">${labels[lang].s2}</button>
            <button @click="setCnpSubView('students')" class="pb-2 text-[10px] uppercase font-bold ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">${labels[lang].s3}</button>
        </div>`;
        let content = "";
        if (cnpSubView === 'coords') content = `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${(data.ic.coords || []).map(c => renderResearcherCard(c, lang)).join('')}</div>`;
        else if (cnpSubView === 'docs') content = renderDocumentListRaw(data.ic.docs || [], lang);
        else content = `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(data.ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`;
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-10">${app.menuLabels[lang].cnp}</h2>${subNav}${content}</div>`;
    }

    // 4. DOMÍNIOS (Nova Estrutura: Imagem + Descrição + Lista Simplificada)
    if (view === 'domains') {
        const domains = data.domains_info || [];
        return `<div class="container mx-auto px-6 py-12">${domains.map(d => `
            <div class="mb-20 bg-white p-8 rounded-lg shadow-sm border-t-8 border-[#c5a059]">
                <img src="${d.image}" class="domain-img mb-6 shadow-md">
                <h3 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-4">${d.title[lang]}</h3>
                <div class="text-gray-700 italic leading-relaxed mb-10 border-l-4 border-gray-200 pl-4">${d.description[lang]}</div>
                <h4 class="text-xs font-bold uppercase text-gray-400 mb-6 tracking-widest">Corpo de Pesquisadores</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                        <div class="flex flex-col border-b border-gray-100 pb-2">
                            <span class="font-bold text-sm text-[#1e3a2c]">${r.name}</span>
                            <span class="text-[10px] text-[#c5a059] uppercase font-bold">${r.role[lang]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`).join('')}</div>`;
    }

    // 5. PRODUÇÃO ACADÊMICA E ARTIGOS (Exibição Completa)
    if (view === 'theses') return renderDocumentList(data.theses || [], lang, app.menuLabels[lang].theses);
    if (view === 'publications') return renderDocumentList(data.publications || [], lang, app.menuLabels[lang].publications);

    // 6. CONTATO (E-mail + Mídias Sociais)
    if (view === 'contact') {
        return `<div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
            <div class="bg-white p-8 rounded shadow-sm">
                <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-8">${app.menuLabels[lang].contact}</h2>
                <div class="space-y-6">
                    <p class="flex items-center text-gray-700"><i class="fa-solid fa-envelope text-[#c5a059] w-8 text-xl"></i> <b>lcm.eceme@eb.mil.br</b></p>
                    <p class="flex items-center text-gray-700"><i class="fa-solid fa-location-dot text-[#c5a059] w-8 text-xl"></i> Praça General Tibúrcio, 125, Urca, RJ</p>
                </div>
                <div class="flex space-x-6 mt-10 border-t pt-8">
                    <a href="https://instagram.com/lcm" target="_blank" class="text-3xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://linkedin.com/company/lcm" target="_blank" class="text-3xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://youtube.com/lcm" target="_blank" class="text-3xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
            <div class="h-80 border rounded shadow-lg overflow-hidden"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="100%" style="border:0;"></iframe></div>
        </div>`;
    }

    if (view === 'events') return renderEvents(app);
    return `<div class="p-20 text-center italic">Conteúdo em tradução...</div>`;
}

// Auxiliares de Renderização
function renderResearcherCard(r, lang) {
    return `<div class="flex flex-col items-center">
        <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-sm">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center mt-1">${r.role[lang] || ''}</p>
        <a href="${r.lattes}" target="_blank" class="text-[9px] font-bold border-2 border-[#1e3a2c] px-4 py-1 rounded-full mt-3 hover:bg-[#1e3a2c] hover:text-white transition">LATTES CV</a>
    </div>`;
}

function renderDocumentList(docs, lang, title) {
    return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${title}</h2>${renderDocumentListRaw(docs, lang)}</div>`;
}

function renderDocumentListRaw(docs, lang) {
    const years = [...new Set((docs || []).map(d => d.year))].sort((a,b) => b-a);
    return `<div class="max-w-4xl mx-auto">${years.map(y => `
        <div class="mb-10"><div class="flex items-center mb-6"><span class="year-badge bg-black text-white">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
        <div class="space-y-3">${docs.filter(d => d.year == y).map(d => `
            <div class="bg-white border-l-4 border-[#1e3a2c] p-5 shadow-sm flex justify-between items-center hover:border-[#c5a059] transition">
                <div>
                    <h4 class="font-bold text-sm text-[#1e3a2c] leading-snug">${d.title}</h4> <p class="text-[10px] text-gray-500 uppercase font-bold mt-2">${d.authors || ''}</p>
                </div>
                <a href="${d.link}" target="_blank" class="text-[#1e3a2c] text-2xl ml-4"><i class="fa-solid fa-file-pdf"></i></a>
            </div>`).join('')}</div></div>`).join('')}</div>`;
}
