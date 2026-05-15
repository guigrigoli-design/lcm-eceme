/**
 * MODULE: Produção Acadêmica (v65.0)
 * Resolve o erro 'undefined' vinculando corretamente aos dados de data_theses.json.
 */
function renderTheses(app) {
    const { lang, data, menuLabels } = app;
    
    // Fallback: Se os dados ainda não carregaram, mostra carregamento em vez de undefined
    const docs = data.theses || [];

    return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase text-center mb-12 border-b-2 border-[#c5a059] inline-block pb-2">
                ${menuLabels[lang]?.theses || "Produção Acadêmica"}
            </h2>
            <div class="mt-8">
                ${renderDocumentListFull(docs, lang)}
            </div>
        </div>`;
}
