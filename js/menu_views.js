/**
 * MENU VIEWS - Versão 57.0
 * Correção: Caminho absoluto para imagens e Títulos de Artigos sem cortes.
 */
function renderMenuModule(app) {
    const { view, lang, data, uiLabels, menuLabels } = app;

    if (view === 'home') return renderHome(app);

    // INTEGRANTES
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            const role = (r.role?.pt || "").toLowerCase();
            const isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return senior ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `<div class="container mx-auto px-6 py-12">
            <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${uiLabels[lang]?.plenos || '...'}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
            <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${uiLabels[lang]?.regular || '...'}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`;
    }

    // DOMÍNIOS (Correção de Imagem 2192x1440)
    if (view === 'domains') {
        return `<div class="container mx-auto px-6 py-12">${(data.domains_info || []).map(d => `
            <div class="mb-20 bg-white rounded-xl shadow-2xl overflow-hidden border">
                <div class="domain-img-wrapper">
                    <img src="${d.image}" onerror="this.src='https://via.placeholder.com/1200x400?text=Laboratorio+LCM'">
                </div>
                <div class="p-10">
                    <h3 class="text-3xl font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-6 mb-6">${d.title[lang]}</h3>
                    <div class="text-gray-700 italic leading-relaxed mb-10 p-6 bg-slate-50 rounded-lg border-l-2 border-slate-300 text-lg">${d.description[lang]}</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                            <div class="flex flex-col border-b pb-2">
                                <span class="font-bold text-sm text-[#1e3a2c]">${r.name}</span>
                                <span class="text-[10px] text-[#c5a059] uppercase font-bold">${r.role?.[lang] || ""}</span>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`).join('')}</div>`;
    }

    // ARTIGOS ACADÊMICOS (Nome Completo Obrigatório)
    if (view === 'publications' || view === 'theses') {
        const docs = view === 'theses' ? data.theses : data.publications;
        const years = [...new Set((docs || []).map(d => d.year))].sort((a,b) => b-a);
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${menuLabels[lang][view]}</h2>
            <div class="max-w-5xl mx-auto">${years.map(y => `
                <div class="mb-12"><div class="flex items-center mb-6"><span class="bg-black text-white px-4 py-1 rounded font-bold">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
                <div class="space-y-4">${docs.filter(d => d.year == y).map(d => `
                    <div class="bg-white border-l-4 border-[#1e3a2c] p-6 shadow-sm flex justify-between items-center group">
                        <div class="flex-grow pr-8">
                            <h4 class="font-bold text-[15px] text-[#1e3a2c] leading-normal uppercase">${d.title}</h4> <p class="text-[10px] text-gray-500 font-bold mt-2 italic">${d.authors || ''}</p>
                        </div>
                        <a href="${d.link}" target="_blank" class="text-[#1e3a2c] text-3xl hover:scale-110 transition flex-shrink-0"><i class="fa-solid fa-file-pdf"></i></a>
                    </div>`).join('')}</div></div>`).join('')}</div></div>`;
    }

    // CAPACITAÇÃO (NCNP)
    if (view === 'cnp') {
        const ic = data.ic || { coords:[], docs:[], students:[] };
        const subNav = `<div class="flex justify-center space-x-6 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${app.cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">Orientadores</button>
            <button @click="setCnpSubView('docs')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${app.cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">Documentos</button>
            <button @click="setCnpSubView('students')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${app.cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">Alunos</button>
        </div>`;
        let content = app.cnpSubView === 'coords' ? `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${(ic.coords || []).map(c => renderResearcherCard(c, lang)).join('')}</div>` : 
                      (app.cnpSubView === 'docs' ? renderDocs(ic.docs || [], lang) : `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`);
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-10">${menuLabels[lang].cnp}</h2>${subNav}${content}</div>`;
    }

    return `<div class="p-32 text-center text-gray-400 italic">Sincronizando...</div>`;
}

// Funções de Apoio
function renderResearcherCard(r, l) {
    return `<div class="flex flex-col items-center">
        <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-[12px] leading-tight h-10 flex items-center">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center">${r.role?.[l] || ""}</p>
        <a href="${r.lattes}" target="_blank" class="text-[8px] font-bold border-2 border-[#1e3a2c] px-3 py-1 rounded-full mt-3 uppercase">Lattes CV</a>
    </div>`;
}

function renderDocs(docs, lang) {
    return `<div class="space-y-4 max-w-4xl mx-auto">${docs.map(d => `<div class="bg-white p-4 shadow-sm border-l-4 border-eb-green flex justify-between items-center"><span class="text-xs font-bold uppercase">${d.title}</span><a href="${d.link}" target="_blank" class="text-eb-green"><i class="fa-solid fa-file-pdf"></i></a></div>`).join('')}</div>`;
}

function renderHome(app) {
    const { lang, data, activeSlide, menuLabels } = app;
    const intro = (data.intro && data.intro[lang]) ? data.intro[lang] : "";
    return `<div class="bg-gray-300 h-[450px] relative overflow-hidden">
        ${(data.news || []).map((n, i) => `<div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${activeSlide === i ? 'opacity-100' : 'opacity-0'}" style="background-image: url('${n.image}')"><div class="absolute inset-0 bg-black/50 flex flex-col justify-end p-16 text-white"><h2 class="text-3xl font-bold uppercase">${n.title?.[lang] || ""}</h2></div></div>`).join('')}
    </div><div class="container mx-auto px-6 py-20 max-w-4xl text-center"><h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">${menuLabels[lang].home}</h2><div class="text-gray-700 italic text-lg">${intro}</div></div>`;
}
