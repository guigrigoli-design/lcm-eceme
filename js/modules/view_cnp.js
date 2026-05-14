/**
 * MODULE: Capacitação de Novos Pesquisadores
 * Fonte de Dados: data_ic.json
 */
function renderCNP(app) {
    const { lang, data, cnpSubView, menuLabels } = app;
    const ic = data.ic || { coords: [], docs: [], students: [] };

    // Rótulos internos traduzidos
    const labels = {
        pt: { s1: 'Orientadores', s2: 'Documentação', s3: 'Pesquisadores (Alunos)' },
        en: { s1: 'Advisors', s2: 'Documentation', s3: 'Researchers (Students)' },
        es: { s1: 'Orientadores', s2: 'Documentación', s3: 'Investigadores (Alumnos)' }
    };

    const subNav = `
        <div class="flex justify-center space-x-8 mb-12 border-b">
            <button @click="setCnpSubView('coords')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'coords' ? 'tab-active' : 'text-gray-400'}">
                ${labels[lang].s1}
            </button>
            <button @click="setCnpSubView('docs')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'docs' ? 'tab-active' : 'text-gray-400'}">
                ${labels[lang].s2}
            </button>
            <button @click="setCnpSubView('students')" class="pb-3 text-[10px] uppercase font-bold tracking-widest ${cnpSubView === 'students' ? 'tab-active' : 'text-gray-400'}">
                ${labels[lang].s3}
            </button>
        </div>`;

    let content = "";
    if (cnpSubView === 'coords') {
        content = `<div class="grid grid-cols-1 md:grid-cols-4 gap-8">${(ic.coords || []).map(c => renderResearcherCard(c, lang)).join('')}</div>`;
    } else if (cnpSubView === 'docs') {
        content = renderDocumentListFull(ic.docs || [], lang);
    } else {
        content = `<div class="grid grid-cols-2 md:grid-cols-4 gap-8">${(ic.students || []).map(s => renderResearcherCard(s, lang)).join('')}</div>`;
    }

    return `
        <div class="container mx-auto px-6 py-12">
            <h2 class="text-2xl font-bold text-[#1e3a2c] uppercase text-center mb-10">${menuLabels[lang].cnp}</h2>
            ${subNav}
            <div class="mt-8">${content}</div>
        </div>`;
}
