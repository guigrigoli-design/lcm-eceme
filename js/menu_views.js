/**
 * Módulo de Visualização de Menus - Versão 35.0
 * Integração total de rotas e dados multilingue.
 */
function renderMenuModule(app) {
    const { view, lang, data, activeSlide } = app;

    // 1. VIEW: INÍCIO (Home)
    if (view === 'home') {
        const carousel = data.news && data.news.length > 0 ? `
            <div class="bg-gray-200 h-[380px] relative overflow-hidden">
                ${data.news.map((n, i) => `
                    <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${activeSlide === i ? 'opacity-100' : 'opacity-0'}" style="background-image: url('${n.image}')">
                        <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-12 text-white">
                            <h2 class="text-2xl font-bold uppercase mb-2">${n.title[lang]}</h2>
                            <p class="max-w-2xl text-sm italic opacity-80">${n.desc[lang]}</p>
                        </div>
                    </div>
                `).join('')}
            </div>` : '';

        return `
            ${carousel}
            <div class="container mx-auto px-6 py-16 max-w-4xl text-center">
                <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">${app.menuLabels[lang].home}</h2>
                <div class="text-gray-700 text-base leading-relaxed italic mb-12">${data.intro ? data.intro[lang] : ''}</div>
                <div class="flex justify-center space-x-8 pt-8 border-t">
                    <a href="https://www.instagram.com/lcmeceme/" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/lcmeceme/" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="http://dgp.cnpq.br/dgp/espelhogrupo/1550449480693956" target="_blank" class="font-bold border-2 px-2 border-[#1e3a2c] rounded text-[#1e3a2c]">CNPq</a>
                </div>
            </div>`;
    }

    // 2. VIEW: COORDENAÇÃO
    if (view === 'leadership') {
        return `
            <div class="container mx-auto px-6 py-12 text-center">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">${app.menuLabels[lang].leadership}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    ${(data.coordinators || []).map(c => `
                        <div class="flex flex-col items-center">
                            <div class="circle-container shadow-xl"><img src="${c.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
                            <h4 class="font-bold text-sm">${c.name}</h4>
                            <p class="text-[9px] text-[#c5a059] font-bold uppercase mb-4">${c.role[lang]}</p>
                            <a href="${c.lattes}" target="_blank" class="text-[10px] bg-[#1e3a2c] text-white px-6 py-1 rounded-full hover:bg-[#c5a059] transition">LATTES CV</a>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // 3. VIEW: DOMÍNIOS (Ajustado com Sustentação)
    if (view === 'domains') {
        const domains = [
            { id: 1, title: { pt: "Domínio 1 - Ciência, Tecnologia, Inovação e Sustentação em Defesa", en: "Domain 1 - Defense S&T, Innovation and Sustainment", es: "Dominio 1 - CT&I y Sustentación" } },
            { id: 2, title: { pt: "Domínio 2 - Preparo e Emprego do Poder Militar", en: "Domain 2 - Readiness", es: "Dominio 2 - Preparación" } },
            { id: 3, title: { pt: "Domínio 3 - Análise e Prospecção do Ambiente Estratégico", en: "Domain 3 - Analysis", es: "Dominio 3 - Análisis" } }
        ];
        return `
            <div class="container mx-auto px-6 py-12">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${app.menuLabels[lang].domains}</h2>
                ${domains.map(d => `
                    <div class="mb-16">
                        <h3 class="text-lg font-bold text-[#1e3a2c] uppercase border-l-8 border-[#c5a059] pl-4 mb-8">${d.title[lang]}</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                            ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => renderResearcherCard(r, lang)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>`;
    }

    // 4. VIEW: PESQUISADORES (Plenos e Pesquisadores)
    if (view === 'all_researchers') {
        const getGroup = (cat) => (data.researchers || []).filter(r => {
            let role = (r.role.pt || "").toLowerCase();
            let isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
            return cat === 'pleno' ? isDr : !isDr;
        }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

        return `
            <div class="container mx-auto px-6 py-12">
                <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${app.lang === 'pt' ? 'Pesquisadores Plenos' : 'Senior Researchers'}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    ${getGroup('pleno').map(r => renderResearcherCard(r, lang)).join('')}
                </div>
                <h3 class="text-xl font-bold text-gray-500 uppercase border-b-4 border-gray-300 pb-2 mb-10">${app.lang === 'pt' ? 'Pesquisadores' : 'Researchers'}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    ${getGroup('assistente').map(r => renderResearcherCard(r, lang)).join('')}
                </div>
            </div>`;
    }

    // 5. VIEW: CAPACITAÇÃO (CNP)
    if (view === 'cnp') {
        return `
            <div class="container mx-auto px-6 py-12 text-center">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">Capacitação de Novos Pesquisadores</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    ${(data.ic.coords || []).map(c => `
                        <div class="flex flex-col items-center">
                            <div class="circle-container"><img src="${c.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
                            <h4 class="font-bold text-xs">${c.name}</h4>
                            <p class="text-[9px] text-[#c5a059] uppercase font-bold">${c.role[lang]}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // 6. VIEW: ACADÊMICO (Teses / Dissertações / TCC)
    if (view === 'theses') {
        return renderDocumentList(data.theses || [], lang, app.menuLabels[lang].theses, 'black');
    }

    // 7. VIEW: PRODUÇÃO ACADÊMICA
    if (view === 'publications') {
        return renderDocumentList(data.publications || [], lang, app.menuLabels[lang].publications, 'gold');
    }

    // 8. VIEW: EVENTOS
    if (view === 'events') {
        return `
            <div class="container mx-auto px-6 py-12 max-w-4xl">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${app.menuLabels[lang].events}</h2>
                ${(data.events || []).map(e => `
                    <div class="flex mb-8 bg-white border rounded overflow-hidden shadow-sm">
                        <div class="bg-[#1e3a2c] text-white p-6 w-24 flex flex-col items-center justify-center shrink-0">
                            <span class="text-2xl font-bold">${e.day}</span>
                            <span class="text-[10px] uppercase font-bold">${e.month[lang]}</span>
                        </div>
                        <div class="p-6">
                            <h4 class="font-bold text-[#1e3a2c] uppercase text-sm">${e.title[lang]}</h4>
                            <p class="text-xs text-gray-600 mt-2 italic">${e.desc[lang]}</p>
                            <p class="text-[10px] font-bold text-[#c5a059] mt-4 uppercase"><i class="fa-solid fa-clock mr-1"></i> ${e.time}</p>
                        </div>
                    </div>
                `).join('')}
            </div>`;
    }

    // 9. VIEW: CONTATO
    if (view === 'contact') {
        return `
            <div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                <div class="space-y-8">
                    <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase">${app.menuLabels[lang].contact}</h2>
                    <div class="text-sm text-gray-700 space-y-4">
                        <p><i class="fa-solid fa-location-dot text-[#c5a059] mr-3"></i> <strong>ECEME:</strong> Praça Gen. Tibúrcio, 125, Urca, RJ</p>
                        <p><i class="fa-solid fa-envelope text-[#c5a059] mr-3"></i> lcmeceme@gmail.com</p>
                        <p><i class="fa-solid fa-phone text-[#c5a059] mr-3"></i> +55 (21) 3543-3456</p>
                    </div>
                </div>
                <div class="rounded-xl overflow-hidden border shadow-lg h-64">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            </div>`;
    }

    return `<div class="p-20 text-center italic text-gray-400">Página em construção para o idioma selecionado (${lang}).</div>`;
}

/** 
 * FUNÇÕES AUXILIARES DE RENDERIZAÇÃO PADRONIZADA 
 */

function renderResearcherCard(r, lang) {
    return `
        <div class="flex flex-col items-center">
            <div class="circle-container shadow-md">
                <img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <h4 class="font-bold text-center text-sm">${r.name}</h4>
            <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center">${r.role[lang] || ''}</p>
            <a href="${r.lattes}" target="_blank" class="text-[9px] font-bold border-2 border-[#1e3a2c] px-4 py-1 rounded-full mt-3 hover:bg-[#1e3a2c] hover:text-white transition">LATTES CV</a>
        </div>`;
}

function renderDocumentList(docs, lang, title, theme) {
    const years = [...new Set(docs.map(d => d.year))].sort((a,b) => b-a);
    const badgeClass = theme === 'black' ? 'bg-black text-white' : 'bg-[#c5a059] text-[#1e3a2c]';
    return `
        <div class="container mx-auto px-6 py-12 max-w-5xl">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${title}</h2>
            ${years.map(y => `
                <div class="mb-12">
                    <div class="flex items-center mb-6">
                        <span class="year-badge ${badgeClass}">${y}</span>
                        <div class="h-px bg-gray-200 flex-grow ml-4"></div>
                    </div>
                    <div class="space-y-4">
                        ${docs.filter(d => d.year == y).map(d => `
                            <div class="bg-white border-l-4 border-[#1e3a2c] p-5 shadow-sm flex justify-between items-center transition hover:border-[#c5a059]">
                                <div class="pr-6">
                                    <h4 class="font-bold text-sm text-[#1e3a2c] leading-tight">${d.title}</h4>
                                    <p class="text-[10px] text-gray-500 mt-1 uppercase font-bold">${d.type || d.authors || ''}</p>
                                    <p class="text-[11px] italic text-gray-600 mt-1">${d.researcher || d.journal || ''}</p>
                                </div>
                                <a href="${d.file_link || d.link}" target="_blank" class="text-[#1e3a2c] text-xl hover:text-[#c5a059] transition"><i class="fa-solid fa-file-pdf"></i></a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
}
