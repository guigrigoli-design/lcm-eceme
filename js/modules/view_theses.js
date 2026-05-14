/**
 * MODULE: Produção Acadêmica
 * Fonte de Dados: data_theses.json
 */
function renderTheses(app) {
    const { lang, data, menuLabels } = app;
    const docs = data.theses || [];

    return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-12">
                ${menuLabels[lang].theses}
            </h2>
            ${renderDocumentListFull(docs, lang)}
        </div>`;
}
