function renderDomains(app) {
    const { lang, data } = app;
    return `<div class="container mx-auto px-6 py-12">${(data.domains_info || []).map(d => `
        <div class="mb-20 bg-white rounded-xl shadow-xl overflow-hidden border-t-8 border-[#c5a059]">
            <img src="${d.image}" class="w-full h-80 object-cover" onerror="this.src='https://via.placeholder.com/800x300'">
            <div class="p-10">
                <h3 class="text-2xl font-bold text-[#1e3a2c] uppercase mb-4">${d.title[lang]}</h3>
                <p class="text-gray-700 italic border-l-4 border-gray-200 pl-4 mb-10">${d.description[lang]}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                    ${(data.researchers || []).filter(r => r.domain_id == d.id).map(r => `
                        <div class="text-xs font-bold text-[#1e3a2c] uppercase border-b border-gray-50 pb-1">${r.name} - <span class="text-[#c5a059]">${r.role[lang]}</span></div>
                    `).join('')}
                </div>
            </div>
        </div>`).join('')}</div>`;
}
