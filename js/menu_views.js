/**
 * MENU VIEWS - Versão 42.0
 * Restauração da Aba Pesquisadores e Submenus da Capacitação
 */
function renderMenuModule(app) {
    const { view, lang, data, activeSlide, cnpSubView } = app;

    // 1. HOME
    if (view === 'home') return renderHome(app);

    // 2. PESQUISADORES (Visual Circular Restaurado - Sem Login)
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            let role = (r.role.pt || "").toLowerCase();
            let isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return senior ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `<div class="container mx-auto px-6 py-12">
            <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${lang === 'pt' ? 'Pesquisadores Plenos' : 'Senior Researchers'}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
            <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${lang === 'pt' ? 'Pesquisadores' : 'Researchers'}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`;
    }

    // 3. CAPACITAÇÃO (3 Submenus Restaurados)
    if (view === 'cnp') {
        const labels = { pt: { sub1: 'Coordenadores', sub2: 'Documentação', sub3: 'Pesquisadores (Alunos)' } };
        const subMenuNav = `<div class="flex justify-center space-x-6 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">${labels.pt.sub1}</button>
            <button @click="setCnpSubView('docs')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">${labels.pt.sub2}</button>
            <button @click="setCnpSubView('students')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">${labels.pt.sub3}</button>
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

    // 4. COORDENAÇÃO LCM, DOMÍNIOS, ACADÊMICO, PRODUÇÃO, EVENTOS, CONTATO
    if (view === 'leadership') return `<div class="container mx-auto px-6 py-12 text-center"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">${app.menuLabels[lang].leadership}</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-10">${(data.coordinators || []).map(c => renderResearcherCard(c, lang)).join('')}</div></div>`;
    if (view === 'domains') return renderDomains(app);
    if (view === 'theses') return renderDocumentList(data.theses || [], lang, app.menuLabels[lang].theses, 'black');
    if (view === 'publications') return renderDocumentList(data.publications || [], lang, app.menuLabels[lang].publications, 'gold');
    if (view === 'events') return renderEvents(app);
    if (view === 'contact') return renderContact(app);

    return `<div class="p-20 text-center italic">Carregando conteúdo...</div>`;
}

function renderResearcherCard(r, lang) {
    return `<div class="flex flex-col items-center">
        <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-sm">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center leading-tight mb-2">${r.role[lang] || ''}</p>
        <a href="${r.lattes}" target="_blank" class="text-[9px] font-bold border-2 border-[#1e3a2c] px-4 py-1 rounded-full mt-3">LATTES CV</a>
    </div>`;
}

function renderDocumentListRaw(docs, lang) {
    const years = [...new Set((docs || []).map(d => d.year))].sort((a,b) => b-a);
    return `<div class="max-w-4xl mx-auto">${years.map(y => `
        <div class="mb-10"><div class="flex items-center mb-6"><span class="year-badge bg-black text-white">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
        <div class="space-y-3">${docs.filter(d => d.year == y).map(d => `
            <div class="bg-white border-l-4 border-[#1e3a2c] p-4 shadow-sm flex justify-between items-center hover:border-[#c5a059] transition">
                <div><h4 class="font-bold text-sm text-[#1e3a2c]">${d.title}</h4><p class="text-[10px] text-gray-500 uppercase font-bold">${d.authors || ''}</p></div>
                <a href="${d.file_link || d.link}" target="_blank" class="text-[#1e3a2c] text-xl transition hover:text-[#c5a059]"><i class="fa-solid fa-file-pdf"></i></a>
            </div>`).join('')}</div></div>`).join('')}</div>`;
}

function renderHome(app) {
    const { lang, data, activeSlide } = app;
    return `<div class="bg-gray-200 h-[400px] relative overflow-hidden">
        ${(data.news || []).map((n, i) => `<div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${activeSlide === i ? 'opacity-100' : 'opacity-0'}" style="background-image: url('${n.image}')">
            <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white"><h2 class="text-2xl font-bold uppercase mb-2">${n.title[lang]}</h2><p class="max-w-2xl text-sm italic">${n.desc[lang]}</p></div></div>`).join('')}
    </div><div class="container mx-auto px-6 py-16 text-center">
        <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">${app.menuLabels[lang].home}</h2>
        <div class="text-gray-700 italic mb-12">${data.intro ? data.intro[lang] : ''}</div>
        <div class="flex justify-center items-center space-x-10 pt-8 border-t">
            <a href="#" class="text-2xl text-[#1e3a2c]"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="text-2xl text-[#1e3a2c]"><i class="fa-brands fa-linkedin"></i></a>
            <a href="#" class="text-2xl text-[#1e3a2c]"><i class="fa-brands fa-youtube"></i></a>
            <img src="https://espelhogrupo.cnpq.br/dgp/img/logo_cnpq.png" class="h-8 grayscale hover:grayscale-0">
        </div></div>`;
}

function renderDocumentList(docs, lang, title, theme) {
    return `<div class="container mx-auto px-6 py-12 max-w-5xl"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${title}</h2>${renderDocumentListRaw(docs, lang)}</div>`;
}

function renderEvents(app) {
    return `<div class="container mx-auto px-6 py-12 max-w-4xl">${(app.data.events || []).map(e => `
        <div class="flex mb-6 bg-white border rounded overflow-hidden shadow-sm">
            <div class="bg-[#1e3a2c] text-white p-6 w-24 flex flex-col items-center justify-center shrink-0"><span class="text-2xl font-bold">${e.day}</span><span class="text-[10px] uppercase font-bold">${e.month[app.lang]}</span></div>
            <div class="p-6"><h4 class="font-bold text-[#1e3a2c] uppercase text-sm">${e.title[app.lang]}</h4><p class="text-xs text-gray-700 mt-2 italic">${e.desc[app.lang]}</p></div></div>`).join('')}</div>`;
}

function renderContact(app) {
    return `<div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div><h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-8">${app.menuLabels[app.lang].contact}</h2><p class="text-sm text-gray-700"><i class="fa-solid fa-location-dot text-[#c5a059] mr-3"></i> Praça Gen. Tibúrcio, 125, Urca, RJ</p></div>
        <div class="h-64 border rounded shadow-lg overflow-hidden"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="100%" style="border:0;"></iframe></div></div>`;
}

function renderDomains(app) {
    const domains = [
        { id: 1, title: { pt: "Domínio 1 - Ciência, Tecnologia, Inovação e Sustentação em Defesa" } },
        { id: 2, title: { pt: "Domínio 2 - Preparo e Emprego do Poder Militar" } },
        { id: 3, title: { pt: "Domínio 3 - Análise e Prospecção do Ambiente Estratégico" } }
    ];
    return `<div class="container mx-auto px-6 py-12">${domains.map(d => `
        <div class="mb-16"><h3 class="text-lg font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-4 mb-8">${d.title.pt}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            ${(app.data.researchers || []).filter(r => r.domain_id == d.id).map(r => renderResearcherCard(r, app.lang)).join('')}
        </div></div>`).join('')}</div>`;
}
