/**
 * MODULE: Pesquisadores Eméritos (Versão 75.0)
 * Renderização em ordem alfabética com biografia detalhada e responsividade.
 */
function renderEmeriti(app) {
    const { lang, data, menuLabels } = app;
    
    // Acoplamento seguro do bucket e ordenação alfabética estrita pelo nome
    const list = (data.emeriti || []).slice().sort((a, b) => {
        return (a.name || '').localeCompare(b.name || '', lang);
    });

    if (list.length === 0) {
        return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase text-center mb-12 border-b-2 border-eb-gold inline-block pb-2">
                ${menuLabels[lang]?.emeriti || "Pesquisadores Eméritos"}
            </h2>
            <p class="text-center italic py-20 text-gray-400">Nenhum pesquisador emérito cadastrado no momento.</p>
        </div>`;
    }

    return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase text-center mb-12 border-b-2 border-eb-gold inline-block pb-2">
                ${menuLabels[lang]?.emeriti || "Pesquisadores Eméritos"}
            </h2>
            
            <div class="max-w-5xl mx-auto space-y-12 mt-8">
                ${list.map(e => {
                    const biographicalText = e.bio?.[lang] || e.bio?.['pt'] || "";
                    return `
                    <div class="bg-white rounded-lg shadow-md border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 hover:shadow-lg transition-all">
                        <div class="flex flex-col items-center flex-shrink-0 w-44">
                            <div class="circle-container shadow-md border-2 border-[#1e3a2c]">
                                <img src="${e.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'">
                            </div>
                            <h3 class="font-bold text-center text-[14px] text-[#1e3a2c] mt-4 leading-tight tracking-tight h-10 flex items-center justify-center">
                                ${e.name}
                            </h3>
                            <a href="${e.lattes}" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               class="text-[9px] font-bold border-2 border-[#1e3a2c] hover:border-[#c5a059] hover:text-[#c5a059] px-4 py-1.5 rounded-full mt-4 transition-all uppercase tracking-wider">
                                Currículo Lattes
                            </a>
                        </div>
                        
                        <div class="flex-grow flex flex-col justify-between h-full pt-2">
                            <div>
                                <div class="text-[#c5a059] text-xs font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">
                                    Distinção Acadêmica // LCM
                                </div>
                                <p class="text-gray-600 text-sm leading-relaxed text-justify whitespace-pre-line">
                                    ${biographicalText}
                                </p>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
}
