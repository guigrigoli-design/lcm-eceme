/**
 * MODULE: Eventos
 * Fonte de Dados: data_events.json
 */
function renderEvents(app) {
    const { lang, data, menuLabels } = app;
    const events = data.events || [];

    return `
        <div class="container mx-auto px-6 py-12 max-w-4xl">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">${menuLabels[lang].events}</h2>
            ${events.length > 0 ? events.map(e => `
                <div class="flex mb-8 bg-white border rounded shadow-md overflow-hidden hover:shadow-lg transition">
                    <div class="bg-[#1e3a2c] text-white p-8 w-28 flex flex-col items-center justify-center shrink-0">
                        <span class="text-3xl font-bold">${e.day || ""}</span>
                        <span class="text-[10px] uppercase font-bold mt-1">${e.month?.[lang] || ""}</span>
                    </div>
                    <div class="p-8">
                        <h4 class="font-bold text-[#1e3a2c] uppercase text-lg">${e.title?.[lang] || ""}</h4>
                        <p class="text-sm text-gray-600 mt-3 italic leading-relaxed">${e.desc?.[lang] || ""}</p>
                    </div>
                </div>`).join('') : 
                '<p class="text-center italic text-gray-400 py-20 uppercase tracking-widest">Sem eventos programados no calendário institucional.</p>'}
        </div>`;
}
