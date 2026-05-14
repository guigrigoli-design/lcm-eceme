function renderResearchers(app) {
    const { lang, data, uiLabels } = app;
    const getGroup = (isSenior) => (data.researchers || []).filter(r => {
        const role = (r.role?.pt || "").toLowerCase();
        const isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando");
        return isSenior ? isDr : !isDr;
    }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));

    const renderCard = (r) => `<div class="flex flex-col items-center">
        <div class="circle-container"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
        <h4 class="font-bold text-center text-xs h-10 flex items-center">${r.name}</h4>
        <p class="text-[9px] text-[#c5a059] font-bold uppercase mt-1">${r.role[lang]}</p>
        <a href="${r.lattes}" target="_blank" class="text-[8px] font-bold border-2 border-[#1e3a2c] px-3 py-1 rounded-full mt-3">LATTES CV</a>
    </div>`;

    return `<div class="container mx-auto px-6 py-12">
        <h3 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-4 border-[#c5a059] pb-2 mb-10">${uiLabels[lang].plenos}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">${getGroup(true).map(renderCard).join('')}</div>
        <h3 class="text-xl font-bold text-gray-400 uppercase border-b-4 border-gray-100 pb-2 mb-10">${uiLabels[lang].regular}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-12">${getGroup(false).map(renderCard).join('')}</div></div>`;
}
