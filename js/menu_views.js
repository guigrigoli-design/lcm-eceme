/**
 * MENU VIEWS - Versão 57.0
 * Correção: Imagens 2K com contêiner resiliente e Títulos Inteiros.
 */
function renderMenuModule(app) {
    const { view, lang, data, cnpSubView, uiLabels, menuLabels } = app;

    // --- HOME ---
    if (view === 'home') {
        const news = data.news || [];
        const intro = data.intro?.[lang] || "Laboratório de Ciências Militares - ECEME";
        const carousel = news.length > 0 ? `
            <div class="bg-gray-300 h-[450px] relative overflow-hidden border-b-4 border-[#c5a059]">
                ${news.map((n, i) => `
                    <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${app.activeSlide === i ? 'opacity-100' : 'opacity-0'}" 
                         style="background-image: url('${n.image}')">
                        <div class="absolute inset-0 bg-black/50 flex flex-col justify-end p-16 text-white">
                            <h2 class="text-3xl font-bold uppercase mb-2">${n.title?.[lang] || ""}</h2>
                            <p class="max-w-2xl text-sm italic opacity-80">${n.desc?.[lang] || ""}</p>
                        </div>
                    </div>`).join('')}
            </div>` : '';
        return `${carousel}<div class="container mx-auto px-6 py-20 text-center">
            <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">${menuLabels[lang].home}</h2>
            <div class="text-gray-700 italic text-xl leading-relaxed max-w-4xl mx-auto">${intro}</div></div>`;
    }

    // --- INTEGRANTES (Doutores = Plenos) ---
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            const role = (r.role?.pt || "").toLowerCase();
            const isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return senior ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `<div class="container mx-auto px-6 py-12">
            <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${uiLabels[lang]?.plenos || "..." }</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
            <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${uiLabels[lang]?.regular || "..." }</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`;
    }

    // --- DOMÍNIOS (Correção de Imagens de Alta Resolução) ---
    if (view === 'domains') {
        return `<div class="container mx-auto px-6 py-12">${(data.domains_info || []).map(d => `
            <div class="mb-20 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div class="domain-hero-frame">
                    <img src="${d.image}?v=${Date.now()}" onerror="this.src='https://via.placeholder.com/1200x400?text=LCM+DOMÍNIO'">
                </div>
                <div class="p-12">
                    <h3 class="text-3xl font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-6 mb-6">${d.title[lang]}</h3>
                    <div class="text-gray-700 italic leading-relaxed mb-10 p-8 bg-slate-50 rounded-lg border-l-2 border-slate-300 text-lg">${d.description[lang]}</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-8">
                        ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                            <div class="flex flex-col border-b border-gray-100 pb-2">
                                <span class="font-bold text-sm text-[#1e3a2c]">${r.name}</span>
                                <span class="text-[10px] text-[#c5a059] uppercase font-bold tracking-tight">${r.role?.[lang] || ""}</span>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`).join('')}</div>`;
    }

    // --- PRODUÇÃO E ARTIGOS (Exibição Completa Obrigatória) ---
    if (view === 'theses' || view === 'publications') {
        const docs = view === 'theses' ? data.theses : data.publications;
        const years = [...new Set((docs || []).map(d => d.year))].sort((a,b) => b-a);
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-3xl font-bold text-[#1e3a2c] uppercase text-center mb-16">${menuLabels[lang][view]}</h2>
            <div class="max-w-5xl mx-auto">${years.map(y => `
                <div class="mb-12"><div class="flex items-center mb-8"><span class="bg-black text-white px-5 py-1.5 rounded font-bold text-sm">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
                <div class="space-y-6">${docs.filter(d => d.year == y).map(d => `
                    <div class="bg-white border-l-4 border-[#1e3a2c] p-8 shadow hover:shadow-lg transition flex justify-between items-center group">
                        <div class="flex-grow pr-10">
                            <h4 class="font-bold text-[17px] text-[#1e3a2c] leading-snug uppercase">${d.title}</h4> <p class="text-[11px] text-gray-500 font-bold mt-3 uppercase italic">${d.authors || ''}</p>
                        </div>
                        <a href="${d.link}" target="_blank" class="text-[#1e3a2c] text-4xl group-hover:scale-110 transition flex-shrink-0"><i class="fa-solid fa-file-pdf"></i></a>
                    </div>`).join('')}</div></div>`).join('')}</div></div>`;
    }

    // Fallback de segurança para abas não renderizadas aqui
    if (view === 'cnp') return renderCnpModule(app);
    if (view === 'leadership') return `<div class="container mx-auto px-6 py-12 text-center"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">${menuLabels[lang].leadership}</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-12">${(data.coordinators || []).map(c => renderResearcherCard(c, lang)).join('')}</div></div>`;
    if (view === 'events') return renderEvents(app);
    if (view === 'contact') return renderContact(app);

    return `<div class="p-40 text-center text-gray-400 italic">Processando Inteligência LCM...</div>`;
}

// Funções Auxiliares Isoladas
function renderResearcherCard(r, l) {
    if (!r) return "";
    return `<div class="flex flex-col items-center">
        <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-[12px] leading-tight h-10 flex items-center">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center mt-2">${r.role?.[l] || ""}</p>
        <a href="${r.lattes}" target="_blank" class="text-[8px] font-bold border-2 border-[#1e3a2c] px-4 py-1.5 rounded-full mt-4 hover:bg-[#1e3a2c] hover:text-white transition uppercase">Lattes CV</a>
    </div>`;
}

function renderCnpModule(app) {
    const { lang, data, cnpSubView, menuLabels } = app;
    const ic = data.ic || { coords:[], docs:[], students:[] };
    const subNav = `<div class="flex justify-center space-x-8 mb-12 border-b">
        <button @click="setCnpSubView('coords')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">Orientadores</button>
        <button @click="setCnpSubView('docs')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">Documentação</button>
        <button @click="setCnpSubView('students')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">Integrantes (Alunos)</button>
    </div>`;
    
    let content = "";
    if (cnpSubView === 'coords') content = `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${(ic.coords || []).map(c => renderResearcherCard(c, lang)).join('')}</div>`;
    else if (cnpSubView === 'docs') {
        const years = [...new Set((ic.docs || []).map(d => d.year))].sort((a,b) => b-a);
        content = `<div class="max-w-4xl mx-auto">${years.map(y => `<div class="mb-8"><span class="bg-eb-green text-white px-4 py-1 mb-4 inline-block font-bold rounded text-xs">${y}</span><div class="space-y-3">${ic.docs.filter(d => d.year == y).map(d => `<div class="bg-white p-4 shadow-sm border-l-4 border-eb-green flex justify-between items-center"><h5 class="text-xs font-bold uppercase">${d.title}</h5><a href="${d.link}" target="_blank" class="text-eb-green text-xl"><i class="fa-solid fa-file-arrow-down"></i></a></div>`).join('')}</div></div>`).join('')}</div>`;
    } else content = `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`;
    
    return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${menuLabels[lang].cnp}</h2>${subNav}${content}</div>`;
}

function renderEvents(app) {
    const ev = app.data.events || [];
    return `<div class="container mx-auto px-6 py-12 max-w-4xl"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${app.menuLabels[app.lang].events}</h2>
        ${ev.length > 0 ? ev.map(e => `
            <div class="flex mb-10 bg-white border rounded shadow-md overflow-hidden hover:shadow-lg transition">
                <div class="bg-[#1e3a2c] text-white p-10 w-32 flex flex-col items-center justify-center shrink-0"><span class="text-4xl font-bold">${e.day || ""}</span><span class="text-[11px] uppercase font-bold mt-2">${e.month?.[app.lang] || ""}</span></div>
                <div class="p-10"><h4 class="font-bold text-[#1e3a2c] uppercase text-xl">${e.title?.[app.lang] || ""}</h4><p class="text-base text-gray-600 mt-4 italic leading-relaxed">${e.desc?.[app.lang] || ""}</p></div>
            </div>`).join('') : "<p class='text-center italic text-gray-400'>Nenhum evento registrado no calendário institucional.</p>"}</div>`;
}

function renderContact(app) {
    return `<div class="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div class="bg-white p-12 rounded shadow-2xl border-l-8 border-[#1e3a2c]">
            <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-12">${app.menuLabels[app.lang].contact}</h2>
            <div class="space-y-8">
                <p class="flex items-center text-gray-800 text-lg"><i class="fa-solid fa-envelope text-[#c5a059] w-12 text-3xl"></i> <b>lcm.eceme@eb.mil.br</b></p>
                <p class="flex items-center text-gray-800 text-lg"><i class="fa-solid fa-location-dot text-[#c5a059] w-12 text-3xl"></i> Praça Gen. Tibúrcio, 125, Urca, RJ</p>
            </div>
            <div class="flex space-x-12 mt-12 border-t pt-12">
                <a href="https://instagram.com/lcmeceme" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition hover:scale-110"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://linkedin.com/company/lcmeceme" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition hover:scale-110"><i class="fa-brands fa-linkedin"></i></a>
                <a href="https://youtube.com/@LaboratórioCiênciasMilitares" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition hover:scale-110"><i class="fa-brands fa-youtube"></i></a>
            </div>
        </div>
        <div class="h-[500px] rounded-xl shadow-2xl overflow-hidden border-4 border-white"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="100%" style="border:0;"></iframe></div>
    </div>`;
}
