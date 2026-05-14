function renderDomains(app) {
    const { lang, data } = app;
    return `
        <div class="container mx-auto px-6 py-12">
            ${(data.domains_info || []).map(d => `
                <div class="mb-20 bg-white rounded-xl shadow-xl overflow-hidden border-t-8 border-[#c5a059]">
                    <div class="w-full h-96 bg-slate-200 overflow-hidden">
                        <img src="${d.image}" 
                             class="w-full h-full object-cover" 
                             onerror="this.src='https://via.placeholder.com/1200x500?text=Laborat%C3%B3rio+de+Ci%C3%AAncias+Militares'">
                    </div>
                    <div class="p-10">
                        <h3 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-6">${d.title[lang]}</h3>
                        <p class="text-gray-700 italic border-l-4 border-eb-gold pl-6 mb-10 text-xl leading-relaxed">${d.description[lang]}</p>
                        <h4 class="text-[10px] font-bold uppercase text-gray-400 mb-6 tracking-widest border-b pb-2">Pesquisadores do Domínio</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                                <div class="flex flex-col border-b border-gray-50 pb-2">
                                    <span class="font-bold text-sm text-[#1e3a2c]">${r.name}</span>
                                    <span class="text-[10px] text-[#c5a059] uppercase font-bold tracking-tighter">${r.role?.[lang] || ""}</span>
                                </div>`).join('')}
                        </div>
                    </div>
                </div>`).join('')}
        </div>`;
}
