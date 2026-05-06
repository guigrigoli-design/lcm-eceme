/**
 * MENU VIEWS - Versão 45.0
 * Restauração Total das Abas Públicas
 */
function renderMenuModule(app) {
    const { view, lang, data, activeSlide, cnpSubView } = app;

    // 1. INÍCIO (Carrossel + Intro + Mídias)
    if (view === 'home') {
        const carousel = data.news && data.news.length > 0 ? `
            <div class="bg-gray-200 h-[400px] relative overflow-hidden shadow-inner">
                ${data.news.map((n, i) => `
                    <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${activeSlide === i ? 'opacity-100' : 'opacity-0'}" style="background-image: url('${n.image}')">
                        <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white">
                            <h2 class="text-2xl font-bold uppercase mb-2">${n.title[lang]}</h2>
                            <p class="max-w-2xl text-sm italic opacity-90">${n.desc[lang]}</p>
                        </div>
                    </div>`).join('')}
            </div>` : '';

        return `${carousel}
            <div class="container mx-auto px-6 py-16 max-w-4xl text-center">
                <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">${app.menuLabels[lang].home}</h2>
                <div class="text-gray-700 text-base leading-relaxed italic mb-12">${data.intro ? data.intro[lang] : ''}</div>
                <div class="flex justify-center items-center space-x-10 pt-8 border-t border-gray-100">
                    <a href="https://www.instagram.com/lcmeceme/" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/lcmeceme/" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://www.youtube.com/@Laborat%C3%B3riodeCi%C3%AAnciasMilitares" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-youtube"></i></a>
                    <a href="http://dgp.cnpq.br/dgp/espelhogrupo/1550449480693956" target="_blank" class="hover:scale-110 transition"><img src="https://espelhogrupo.cnpq.br/dgp/img/logo_cnpq.png" class="h-8 grayscale hover:grayscale-0"></a>
                </div>
            </div>`;
    }

    // 2. INTEGRANTES (Público e Circular)
    if (view === 'all_researchers') {
        const getGroup = (senior) => (data.researchers || []).filter(r => {
            let role = (r.role.pt || "").toLowerCase();
            let isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return senior ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `<div class="container mx-auto px-6 py-12">
            <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${lang === 'pt' ? 'Pesquisadores Plenos' : 'Senior Researchers'}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(r => renderResearcherCard(r, lang)).join('')}</div>
            <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-200 pb-2 mb-10">${lang === 'pt' ? 'Pesquisadores' : 'Researchers'}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`;
    }

    // 3. CAPACITAÇÃO (3 Submenus Restaurados)
    if (view === 'cnp') {
        const subMenuNav = `<div class="flex justify-center space-x-6 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">Coordenadores</button>
            <button @click="setCnpSubView('docs')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">Documentação</button>
            <button @click="setCnpSubView('students')" class="pb-2 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">Alunos</button>
        </div>`;
        let subContent = "";
        if (cnpSubView === 'coords') subContent = `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${(data.ic.coords || []).map(c => renderResearcherCard(c, lang)).join('')}</div>`;
        else if (cnpSubView === 'docs') subContent = renderDocumentListRaw(data.ic.docs || [], lang);
        else subContent = `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(data.ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`;
        return `<div class="container mx-auto px-6 py-12"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-10">Capacitação (NCNP)</h2>${subMenuNav}<div>${subContent}</div></div>`;
    }

    // 4. DEMAIS ABAS (Liderança, Domínios, Acadêmico, Produção, Eventos, Contato)
    if (view === 'leadership') return `<div class="container mx-auto px-6 py-12 text-center"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">${app.menuLabels[lang].leadership}</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-10">${(data.coordinators || []).map(c => renderResearcherCard(c, lang)).join('')}</div></div>`;
    
    if (view === 'domains') {
        const doms = [
            { id: 1, title: { pt: "Domínio 1 - Ciência, Tecnologia, Inovação e Sustentação em Defesa" } },
            { id: 2, title: { pt: "Domínio 2 - Preparo e Emprego do Poder Militar" } },
            { id: 3, title: { pt: "Domínio 3 - Análise e Prospecção do Ambiente Estratégico" } }
        ];
        return `<div class="container mx-auto px-6 py-12">${doms.map(d => `
            <div class="mb-16"><h3 class="text-lg font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-4 mb-8">${d.title.pt}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => renderResearcherCard(r, lang)).join('')}</div></div>`).join('')}</div>`;
    }

    if (view === 'theses') return renderDocumentList(data.theses || [], lang, app.menuLabels[lang].theses, 'black');
    if (view === 'publications') return renderDocumentList(data.publications || [], lang, app.menuLabels[lang].publications, 'gold');

    if (view === 'events') {
        return `<div class="container mx-auto px-6 py-12 max-w-4xl">${(data.events || []).map(e => `
            <div class="flex mb-6 bg-white border rounded overflow-hidden shadow-sm">
                <div class="bg-[#1e3a2c] text-white p-6 w-24 flex flex-col items-center justify-center shrink-0"><span class="text-2xl font-bold">${e.day}</span><span class="text-[10px] uppercase font-bold">${e.month[lang]}</span></div>
                <div class="p-6"><h4 class="font-bold text-[#1e3a2c] uppercase text-sm">${e.title[lang]}</h4><p class="text-xs text-gray-700 mt-2 italic">${e.desc[lang]}</p></div></div>`).join('')}</div>`;
    }

    if (view === 'contact') {
        return `<div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
            <div><h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-8">${app.menuLabels[lang].contact}</h2><p class="text-sm text-gray-700"><i class="fa-solid fa-location-dot text-[#c5a059] mr-3"></i> Praça Gen. Tibúrcio, 125, Urca, RJ</p></div>
            <div class="h-64 border rounded shadow-lg overflow-hidden"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="100%" style="border:0;"></iframe></div></div>`;
    }

    return `<div class="p-20 text-center italic">Conteúdo carregando...</div>`;
}

/** HELPERS **/
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
                <div><h4 class="font-bold text-sm text-[#1e3a2c]">${d.title}</h4><p class="text-[10px] text-gray-500 uppercase font-bold">${d.authors || d.type || ''}</p></div>
                <a href="${d.file_link || d.link}" target="_blank" class="text-[#1e3a2c] text-xl"><i class="fa-solid fa-file-pdf"></i></a>
            </div>`).join('')}</div></div>`).join('')}</div>`;
}

function renderDocumentList(docs, lang, title, theme) {
    return `<div class="container mx-auto px-6 py-12 max-w-5xl"><h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${title}</h2>${renderDocumentListRaw(docs, lang)}</div>`;
}
