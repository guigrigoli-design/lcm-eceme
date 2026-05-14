/**
 * MODULE: Leadership/Coordenação
 * Fonte de Dados: data_coordinators.json
 */
function renderLeadership(app) {
    const { lang, data, menuLabels } = app;
    const coords = data.coordinators || [];

    return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12 border-b-2 border-[#c5a059] inline-block pb-1">
                ${menuLabels[lang]?.leadership || "Coordenação"}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
                ${coords.length > 0 ? coords.map(c => renderResearcherCard(c, lang)).join('') : 
                '<p class="col-span-3 text-center italic text-gray-400">Dados da coordenação em processo de sincronização...</p>'}
            </div>
        </div>`;
}
