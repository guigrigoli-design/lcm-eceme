/**
 * MENU VIEWS - Versão 53.0
 * Correção: Caminho de Imagem dos Domínios e Estabilidade de Carregamento.
 */
function renderMenuModule(app) {
    const { view, lang, data, cnpSubView, uiLabels, menuLabels } = app;

    if (view === 'home') return renderHome(app);

    // 1. INTEGRANTES (Plenos = Doutores)
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            const role = (r.role && r.role.pt) ? r.role.pt.toLowerCase() : "";
            return senior ? ((role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando")) : !((role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando"));
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `<div class="container mx-auto px-6 py-12">
            <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${uiLabels[lang].plenos}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
            <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${uiLabels[lang].regular}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`;
    }

    // 2. DOMÍNIOS (Correção de Imagens e Layout)
    if (view === 'domains') {
        const domains = data.domains_info || [];
        return `<div class="container mx-auto px-6 py-12">${domains.map(d => `
            <div class="mb-20 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <div class="domain-box">
                    <img src="${d.image}" class="domain-img-main" onerror="this.src='https://via.placeholder.com/1200x350?text=Laboratório+de+Ciências+Militares'">
                </div>
                <div class="p-10">
                    <h3 class="text-2xl font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-6 mb-6">${d.title[lang]}</h3>
                    <div class="text-gray-700 italic leading-relaxed mb-10 p-6 bg-gray-50 rounded-lg border-l-2 border-gray-300">${d.description[lang]}</div>
                    <h4 class="text-xs font-bold uppercase text-gray-400 mb-6 tracking-widest border-b pb-2">Pesquisadores Associados</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                            <div class="flex flex-col border-b border-gray-100 pb-2">
                                <span class="font-bold text-sm text-[#1e3a2c]">${r.name}</span>
                                <span class="text-[10px] text-[#c5a059] uppercase font-bold tracking-tight">${r.role ? r.role[lang] : ""}</span>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`).join('')}</div>`;
    }

    // 3. COORDENAÇÃO
    if (view === 'leadership') {
        return `<div class="container mx-auto px-6 py-12 text-center">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">${menuLabels[lang].leadership}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                ${(data.coordinators || []).map(c => renderResearcherCard(c, lang)).join('')}
            </div></div>`;
    }

    // 4. CAPACITAÇÃO DE NOVOS PESQUISADORES
    if (view === 'cnp') {
        const ic = data.ic || { coords:[], docs:[], students:[] };
        const subNav = `<div class="flex justify-center space-x-6 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">Orientadores</button>
            <button @click="setCnpSubView('docs')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">Documentação</button>
            <button @click="setCnpSubView('students')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">Pesquisadores (Alunos)</button>
        </div>`;
        let content = cnpSubView === 'coords' ? `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${(ic.coords || []).map(c => renderResearcherCard(c, lang)).join('')}</div>` : 
                      (cnpSubView === 'docs' ? renderDocumentListRaw(ic.docs || [], lang) : `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`);
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-10">${menuLabels[lang].cnp}</h2>${subNav}${content}</div>`;
    }

    // 5. PRODUÇÃO ACADÊMICA E ARTIGOS
    if (view === 'theses') return renderDocumentList(data.theses || [], lang, menuLabels[lang].theses);
    if (view === 'publications') return renderDocumentList(data.publications || [], lang, menuLabels[lang].publications);

    // 6. EVENTOS
    if (view === 'events') {
        const events = data.events || [];
        return `<div class="container mx-auto px-6 py-12 max-w-4xl"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${menuLabels[lang].events}</h2>
            ${events.length > 0 ? events.map(e => `
                <div class="flex mb-8 bg-white border rounded shadow-md overflow-hidden hover:shadow-lg transition">
                    <div class="bg-[#1e3a2c] text-white p-8 w-28 flex flex-col items-center justify-center shrink-0">
                        <span class="text-3xl font-bold">${e.day || ""}</span>
                        <span class="text-[10px] uppercase font-bold mt-1">${e.month ? e.month[lang] : ""}</span>
                    </div>
                    <div class="p-8"><h4 class="font-bold text-[#1e3a2c] uppercase text-lg">${e.title ? e.title[lang] : ""}</h4><p class="text-sm text-gray-600 mt-3 italic leading-relaxed">${e.desc ? e.desc[lang] : ""}</p></div>
                </div>`).join('') : "<p class='text-center italic text-gray-400'>Sem eventos programados.</p>"}</div>`;
    }

    // 7. CONTATO
    if (view === 'contact') {
        return `<div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
            <div class="bg-white p-10 rounded shadow-lg border-l-8 border-[#1e3a2c]">
                <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-10">${menuLabels[lang].contact}</h2>
                <div class="space-y-6">
                    <p class="flex items-center text-gray-800"><i class="fa-solid fa-envelope text-[#c5a059] w-10 text-2xl"></i> <span class="font-bold">lcm.eceme@eb.mil.br</span></p>
                    <p class="flex items-center text-gray-800"><i class="fa-solid fa-location-dot text-[#c5a059] w-10 text-2xl"></i> Praça General Tibúrcio, 125, Urca, RJ</p>
                </div>
                <div class="flex space-x-10 mt-12 border-t pt-10">
                    <a href="https://instagram.com/lcmeceme" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://linkedin.com/company/lcmeceme" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://youtube.com/@Laborat%C3%B3riodeCi%C3%AAnciasMilitares" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
            <div class="h-[400px] rounded shadow-2xl overflow-hidden border"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="100%" style="border:0;"></iframe></div>
        </div>`;
    }

    return `<div class="p-32 text-center text-gray-300 italic uppercase tracking-widest">Processando conteúdo...</div>`;
}

function renderHome(app) {
    const { lang, data, activeSlide } = app;
    const news = data.news || [];
    const intro = (data.intro && data.intro[lang]) ? data.intro[lang] : "";
    return `
        <div class="bg-gray-300 h-[480px] relative overflow-hidden border-b-4 border-[#c5a059]">
            ${news.map((n, i) => `<div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${activeSlide === i ? 'opacity-100' : 'opacity-0'}" style="background-image: url('${n.image}')"><div class="absolute inset-0 bg-black/50 flex flex-col justify-end p-16 text-white"><h2 class="text-3xl font-bold uppercase mb-2">${n.title ? n.title[lang] : ""}</h2><p class="max-w-2xl text-sm italic opacity-80">${n.desc ? n.desc[lang] : ""}</p></div></div>`).join('')}
        </div>
        <div class="container mx-auto px-6 py-20 max-w-4xl text-center">
            <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">${menuLabels[lang].home}</h2>
            <div class="text-gray-700 leading-relaxed italic text-lg">${intro}</div>
        </div>`;
}

function renderResearcherCard(r, l) {
    if (!r) return "";
    return `<div class="flex flex-col items-center">
        <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-[13px] leading-tight h-10 flex items-center">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center mt-2">${r.role ? r.role[l] : ""}</p>
        <a href="${r.lattes}" target="_blank" class="text-[8px] font-bold border-2 border-[#1e3a2c] px-4 py-1.5 rounded-full mt-4 hover:bg-[#1e3a2c] hover:text-white transition uppercase">Lattes CV</a>
    </div>`;
}

function renderDocumentList(docs, l, t) {
    const years = [...new Set((docs || []).map(d => d.year))].sort((a,b) => b-a);
    const list = `<div class="max-w-4xl mx-auto">${years.map(y => `
        <div class="mb-12"><div class="flex items-center mb-8"><span class="year-badge bg-black text-white px-4 py-1 rounded shadow-sm">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
        <div class="space-y-4">${docs.filter(d => d.year == y).map(d => `
            <div class="bg-white border-l-4 border-[#1e3a2c] p-6 shadow hover:shadow-md transition flex justify-between items-center group">
                <div><h4 class="font-bold text-sm text-[#1e3a2c] leading-snug uppercase">${d.title}</h4><p class="text-[10px] text-gray-500 font-bold mt-2">${d.authors || ''}</p></div>
                <a href="${d.link}" target="_blank" class="text-[#1e3a2c] text-3xl ml-6 hover:scale-110 transition"><i class="fa-solid fa-file-pdf"></i></a>
            </div>`).join('')}</div></div>`).join('')}</div>`;
    return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${t}</h2>${list}</div>`;
}

function renderDocumentListRaw(docs, l) {
    const years = [...new Set((docs || []).map(d => d.year))].sort((a,b) => b-a);
    return `<div class="max-w-4xl mx-auto">${years.map(y => `<div class="mb-8"><span class="year-badge bg-black text-white px-4 py-1 mb-4 inline-block">${y}</span><div class="space-y-2">${docs.filter(d => d.year == y).map(d => `<div class="bg-white p-4 shadow-sm border-l-4 border-eb-green flex justify-between items-center"><span class="text-xs font-bold uppercase">${d.title}</span><a href="${d.link}" target="_blank" class="text-eb-green"><i class="fa-solid fa-download"></i></a></div>`).join('')}</div></div>`).join('')}</div>`;
}
