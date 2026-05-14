function renderPublications(app) {
    const { lang, data, menuLabels } = app;
    const docs = data.publications || [];
    const years = [...new Set(docs.map(d => d.year))].sort((a,b) => b-a);
    return `<div class="container mx-auto px-6 py-12">
        <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${menuLabels[lang].publications}</h2>
        <div class="max-w-5xl mx-auto">${years.map(y => `
            <div class="mb-12"><div class="flex items-center mb-6"><span class="bg-black text-white px-4 py-1 rounded font-bold text-xs">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
            <div class="space-y-4">${docs.filter(d => d.year == y).map(d => `
                <div class="bg-white border-l-4 border-[#1e3a2c] p-6 shadow-sm flex justify-between items-center group">
                    <div><h4 class="font-bold text-sm text-[#1e3a2c] leading-snug uppercase">${d.title}</h4><p class="text-[10px] text-gray-500 font-bold mt-2 italic">${d.authors || ''}</p></div>
                    <a href="${d.link}" target="_blank" class="text-[#1e3a2c] text-3xl ml-6 hover:scale-110 transition"><i class="fa-solid fa-file-pdf"></i></a>
                </div>`).join('')}</div></div>`).join('')}</div></div>`;
}
