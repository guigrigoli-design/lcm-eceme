function renderStaticView(app) {
    const lang = app.lang;
    const view = app.view;
    const data = app.data;

    if (view === 'home') {
        return `
            <div class="container mx-auto px-6 py-16 max-w-4xl text-center">
                <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block pb-1 mb-8">Apresentação</h2>
                <div class="text-gray-700 italic">${data.intro ? data.intro[lang] : ''}</div>
                <div class="flex justify-center space-x-6 mt-12 pt-8 border-t">
                    <a href="#" class="text-2xl text-[#1e3a2c]"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" class="text-2xl text-[#1e3a2c]"><i class="fa-brands fa-linkedin"></i></a>
                </div>
            </div>`;
    }

    if (view === 'all_researchers') {
        // Lógica padronizada de pesquisadores circulares
        return `
            <div class="container mx-auto px-6 py-12">
                <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] mb-12">Corpo Docente e Pesquisadores</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                    ${(data.researchers || []).map(r => `
                        <div class="flex flex-col items-center">
                            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-[#c5a059] mb-4 shadow-lg">
                                <img src="${r.photo}" class="w-full h-full object-cover">
                            </div>
                            <h4 class="font-bold text-center text-sm">${r.name}</h4>
                            <a href="${r.lattes}" target="_blank" class="text-[10px] font-bold border px-4 py-1 rounded-full mt-2">LATTES CV</a>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }
    
    // Adicionar aqui as lógicas para 'theses', 'publications', 'events', 'contact', 'leadership'
    return `<div class="p-20 text-center">Carregando conteúdo de ${view}...</div>`;
}
