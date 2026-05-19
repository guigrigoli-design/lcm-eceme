/**
 * MODULE: Theses (Versão 73.0)
 * Canalização estrita de dados acadêmicos para o componente global blindado contra erros 404 e loops.
 */
function renderTheses(app) {
    const { lang, data, menuLabels } = app;
    const docs = data.theses || [];

    return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase text-center mb-12 border-b-2 border-eb-gold inline-block pb-2">
                ${menuLabels[lang]?.theses || "Produção Acadêmica"}
            </h2>
            <div class="mt-8">
                ${renderDocumentListFull(docs, lang)}
            </div>
        </div>`;
}
