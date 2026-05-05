function renderMenuModule(app) {
    const { view, lang, data, activeSlide } = app;

    // --- VIEW: HOME (Carrossel e Apresentação) ---
    if (view === 'home') {
        const carousel = data.news ? `
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
                <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">Apresentação</h2>
                <div class="text-gray-700 text-base leading-relaxed italic mb-12">${data.intro ? data.intro[lang] : ''}</div>
                <div class="flex justify-center space-x-8 pt-8 border-t">
                    <a href="https://www.instagram.com/lcmeceme/" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/lcmeceme/" target="_blank" class="text-2xl text-[#1e3a2c] hover:text-[#c5a059]"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="http://dgp.cnpq.br/dgp/espelhogrupo/1550449480693956" target="_blank" class="font-bold border-2 px-2 border-[#1e3a2c] rounded text-[#1e3a2c]">CNPq</a>
                </div>
            </div>`;
    }

    // --- VIEW: COORDENAÇÃO ---
    if (view === 'leadership') {
        return `
            <div class="container mx-auto px-6 py-12 text-center">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">Coordenação do LCM</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    ${(data.coordinators || []).map(c => `
                        <div class="flex flex-col items-center">
                            <div class="circle-container shadow-xl"><img src="${c.photo}" class="circle-img"></div>
                            <h4 class="font-bold text-sm">${c.name}</h4>
                            <p class="text-[9px] text-[#c5a059] font-bold uppercase mb-4">${c.role[lang]}</p>
                            <a href="${c.lattes}" target="_blank" class="text-[10px] bg-[#1e3a2c] text-white px-6 py-1 rounded-full">LATTES CV</a>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // --- VIEW: ACADÊMICO (TESES/TCC) ---
    if (view === 'theses') {
        const years = [...new Set((data.theses || []).map(t => t.year))].sort((a,b) => b-a);
        return `
            <div class="container mx-auto px-6 py-12 max-w-5xl">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">Teses, Dissertações e TCC</h2>
                ${years.map(y => `
                    <div class="mb-10">
                        <div class="flex items-center mb-6"><span class="year-badge bg-black text-white">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
                        <div class="space-y-4">
                            ${data.theses.filter(t => t.year == y).map(t => `
                                <div class="bg-white border-l-4 border-[#1e3a2c] p-5 shadow-sm flex justify-between items-center">
                                    <div><h4 class="font-bold text-sm">${t.title}</h4><p class="text-[10px] italic text-gray-500">${t.researcher}</p></div>
                                    <a href="${t.file_link}" target="_blank" class="text-[#1e3a2c] text-xl"><i class="fa-solid fa-file-pdf"></i></a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>`;
    }

    // --- VIEW: CAPACITAÇÃO (CNP) ---
    if (view === 'cnp') {
        return `
            <div class="container mx-auto px-6 py-12 text-center">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-12">Capacitação de Novos Pesquisadores</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    ${(data.ic.coords || []).map(c => `
                        <div class="flex flex-col items-center">
                            <div class="circle-container"><img src="${c.photo}" class="circle-img"></div>
                            <h4 class="font-bold text-xs">${c.name}</h4>
                            <p class="text-[9px] text-[#c5a059] uppercase font-bold">${c.role[lang]}</p>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    // --- VIEW: CONTATO ---
    if (view === 'contact') {
        return `
            <div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                <div>
                    <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-8">Canais de Contato</h2>
                    <div class="space-y-6 text-sm text-gray-700">
                        <p><i class="fa-solid fa-location-dot text-[#c5a059] mr-3"></i> <strong>ECEME:</strong> Praça Gen. Tibúrcio, 125, Urca, RJ</p>
                        <p><i class="fa-solid fa-envelope text-[#c5a059] mr-3"></i> lcmeceme@gmail.com</p>
                    </div>
                </div>
                <div class="rounded-xl overflow-hidden border shadow-lg">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.562!2d-43.167!3d-22.955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997ff479429599%3A0x66c888371302868c!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1714594245600" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            </div>`;
    }

    return `<div class="p-20 text-center italic text-gray-400">Página em construção para o idioma selecionado.</div>`;
}
