/**
 * MODULE: Domains (Versão 67.0)
 * Correção Crítica: Eliminação do loop de renderização de imagem e blindagem anti-erro.
 */
function renderDomains(app) {
    const { lang, data } = app;
    return `
        <div class="container mx-auto px-6 py-12">
            ${(data.domains_info || []).map(d => {
                // Determina o caminho seguro da imagem sem parâmetros dinâmicos que quebrem o ciclo do AlpineJS
                const safeImg = d.image.startsWith('http') ? d.image : `./${d.image}`;
                return `
                <div class="mb-20 bg-white rounded-xl shadow-xl overflow-hidden border-t-8 border-[#c5a059]">
                    <div class="w-full h-85 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                        <img src="${safeImg}" 
                             class="w-full h-full object-cover" 
                             alt="${d.title?.[lang] || ''}"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=LCM+Laborat%C3%B3rio'">
                    </div>
                    <div class="p-10">
                        <h3 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-4">${d.title?.[lang] || ""}</h3>
                        <p class="text-gray-700 italic border-l-4 border-eb-gold pl-6 mb-10 text-lg leading-relaxed">${d.description?.[lang] || ""}</p>
                        <h4 class="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-widest border-b pb-2">Pesquisadores Vinculados</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                                <div class="flex flex-col border-b border-gray-100 pb-2">
                                    <span class="font-bold text-sm text-[#1e3a2c]">${r.name}</span>
                                    <span class="text-[10px] text-[#c5a059] uppercase font-bold tracking-tight">${r.role?.[lang] || ""}</span>
                                </div>`).join('')}
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;
}
