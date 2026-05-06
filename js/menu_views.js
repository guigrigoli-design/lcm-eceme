/**
 * MENU VIEWS - Versão 44.0 (Público)
 */
function renderMenuModule(app) {
    const { view, lang, data, activeSlide, cnpSubView } = app;

    // 1. HOME
    if (view === 'home') return renderHome(app);

    // 2. INTEGRANTES (Público e Sem Acesso Restrito)
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            let role = (r.role.pt || "").toLowerCase();
            let isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return senior ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `
            <div class="container mx-auto px-6 py-12">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${lang === 'pt' ? 'Pesquisadores Plenos' : 'Senior Researchers'}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
                <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${lang === 'pt' ? 'Pesquisadores' : 'Researchers'}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div>
            </div>`;
    }

    // 3. CAPACITAÇÃO (Submenus NCNP Restaurados)
    if (view === 'cnp') {
        const labels = { pt: { s1: 'Coordenadores', s2: 'Documentação', s3: 'Alunos' } };
        const subMenuNav = `<div class="flex justify-center space-x-6 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">${labels.pt.s1}</button>
            <button @click="setCnpSubView('docs')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">${labels.pt.s2}</button>
            <button @click="setCnpSubView('students')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">${labels.pt.s3}</button>
        </div>`;
        
        let subContent = "";
        if (cnpSubView === 'coords') {
            const list = [...(data.ic.coords || [])].sort((a,b) => (a.role.pt || "").toLowerCase().includes("coord") ? -1 : 1);
            subContent = `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${list.map(c => renderResearcherCard(c, lang)).join('')}</div>`;
        } else if (cnpSubView === 'docs') {
            subContent = renderDocumentListRaw(data.ic.docs || [], lang);
        } else {
            subContent = `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(data.ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`;
        }
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-10">Capacitação (NCNP)</h2>${subMenuNav}<div>${subContent}</div></div>`;
    }

    // Outras views públicas mantidas...
    if (view === 'leadership') return `<div class="container mx-auto px-6 py-12 text-center"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">${app.menuLabels[lang].leadership}</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-10">${(data.coordinators || []).map(c => renderResearcherCard(c, lang)).join('')}</div></div>`;
    if (view === 'domains') return renderDomains(app);
    if (view === 'theses') return renderDocumentList(data.theses || [], lang, app.menuLabels[lang].theses, 'black');
    if (view === 'publications') return renderDocumentList(data.publications || [], lang, app.menuLabels[lang].publications, 'gold');
    if (view === 'events') return renderEvents(app);
    if (view === 'contact') return renderContact(app);

    return `<div class="p-20 text-center italic">Conteúdo em processamento...</div>`;
}

// Auxiliar: Cartão de Integrante
function renderResearcherCard(r, lang) {
    return `<div class="flex flex-col items-center">
        <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-sm">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center leading-tight mb-2">${r.role[lang] || ''}</p>
        <a href="${r.lattes}" target="_blank" class="text-[9px] font-bold border-2 border-[#1e3a2c] px-4 py-1 rounded-full mt-3">LATTES CV</a>
    </div>`;
}
// ... (demais funções auxiliares renderHome, renderDocumentListRaw, etc.)
