function renderHome(app) {
    const { lang, data } = app;
    const intro = data.intro?.[lang] || "...";
    const news = data.news || [];
    return `
        <div class="bg-gray-200 h-96 relative overflow-hidden">
            ${news.map((n, i) => `<div class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${app.activeSlide === i ? 'opacity-100' : 'opacity-0'}" style="background-image: url('${n.image}')"><div class="absolute inset-0 bg-black/40 p-12 flex flex-col justify-end text-white"><h2 class="text-2xl font-bold uppercase">${n.title?.[lang]}</h2><p class="text-sm italic">${n.desc?.[lang]}</p></div></div>`).join('')}
        </div>
        <div class="container mx-auto px-6 py-20 text-center">
            <h2 class="text-xl font-bold text-[#1e3a2c] uppercase border-b-2 border-[#c5a059] inline-block mb-8">Bem-vindo</h2>
            <div class="text-gray-700 italic text-lg leading-relaxed max-w-4xl mx-auto">${intro}</div>
        </div>`;
}
