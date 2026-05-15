/**
 * APP CORE - Versão 65.0
 * Orquestrador Central com Blindagem de Links Externos e Sincronização de Menus.
 */
function lcmApp() {
    return {
        // --- ESTADO INICIAL ---
        view: 'home', 
        lang: 'pt', 
        loading: true, 
        isLoggedIn: false, 
        currentUser: null,
        activeSlide: 0, 
        cnpSubView: 'coords', 
        researcherSubView: 'andamento',
        loginEmail: '', 
        loginPass: '',
        
        // --- DATA BUCKETS ---
        data: { news: [], researchers: [], theses: [], publications: [], ic: { coords: [], docs: [], students: [] }, coordinators: [], intro: {}, events: [], domains_info: [], access: [] },
        projects: [], 

        // --- DICIONÁRIOS ---
        uiLabels: {
            pt: { researcherArea: "Área do Pesquisador", loading: "Sincronizando...", plenos: "Pesquisadores Plenos (Doutores)", regular: "Pesquisadores", interest: "Apoiar", creditTitle: "CRediT", confirm: "Publicar" },
            en: { researcherArea: "Researcher Area", loading: "Syncing...", plenos: "PhD Researchers", regular: "Researchers", interest: "Support", creditTitle: "CRediT", confirm: "Publish" },
            es: { researcherArea: "Área del Investigador", loading: "Sincronizando...", plenos: "Investigadores Plenos (Doctores)", regular: "Investigadores", interest: "Apoyar", creditTitle: "CRediT", confirm: "Publicar" }
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação de Novos Pesquisadores', theses: 'Produção Acadêmica', publications: 'Artigos Acadêmicos', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training of New Researchers', theses: 'Academic Production', publications: 'Academic Articles', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación de Novos Investigadores', theses: 'Producción Acadêmica', publications: 'Artículos Académicos', events: 'Eventos', contact: 'Contacto' }
        },

        creditOptions: ["Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento", "Investigação", "Metodologia", "Administração do Projeto", "Recursos", "Software", "Supervisão", "Validação", "Visualização", "Redação – rascunho original", "Redação – revisão e edição"],

        // --- MÉTODOS DE CICLO DE VIDA ---
        async init() {
            await this.loadAllModules();
            this.loadPersistence();
            this.loading = false;
        },

        async loadAllModules() {
            const endpoints = [['news', 'data_news.json'], ['researchers', 'data_researchers.json'], ['theses', 'data_theses.json'], ['publications', 'data_publications.json'], ['ic', 'data_ic.json'], ['coordinators', 'data_coordinators.json'], ['intro', 'data_intro.json'], ['events', 'data_events.json'], ['domains_info', 'data_domains.json'], ['access', 'data_access.json']];
            await Promise.all(endpoints.map(async ([key, file]) => {
                try {
                    const r = await fetch(`./${file}?v=${Date.now()}`);
                    this.data[key] = await r.json();
                } catch(e) { 
                    this.data[key] = (key === 'ic') ? { coords: [], docs: [], students: [] } : (key === 'intro' ? {} : []);
                }
            }));
        },

        // --- PERSISTÊNCIA HÍBRIDA ---
        loadPersistence() {
            const saved = localStorage.getItem('lcm_academic_hub');
            this.projects = saved ? JSON.parse(saved) : [];
        },

        savePersistence() { localStorage.setItem('lcm_academic_hub', JSON.stringify(this.projects)); },

        // --- TRADUÇÃO REATIVA ---
        setLang(l) { 
            this.lang = l; 
            const current = this.view;
            this.view = ''; 
            setTimeout(() => { this.view = current; }, 50);
        },

        // --- AUTENTICAÇÃO ---
        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { this.isLoggedIn = true; this.currentUser = user.email; this.view = 'researcher_area'; } 
            else { alert("Falha na autenticação institucional."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        // --- ROTEADOR (ESTABILIDADE MODULAR) ---
        renderCurrentView() {
            if (this.loading || !this.view) return '';
            const router = {
                'home': () => renderHome(this),
                'domains': () => renderDomains(this),
                'leadership': () => renderLeadership(this),
                'all_researchers': () => renderResearchers(this),
                'cnp': () => renderCNP(this),
                'theses': () => renderTheses(this),
                'publications': () => renderPublications(this),
                'events': () => renderEvents(this),
                'contact': () => renderContact(this),
                'researcher_login': () => renderResearcherLogin(this),
                'researcher_area': () => renderResearcherArea(this)
            };
            return router[this.view] ? router[this.view]() : '<p class="p-20 text-center italic">Processando módulo...</p>';
        },
        setCnpSubView(v) { this.cnpSubView = v; }
    }
}

/**
 * COMPONENTE GLOBAL: renderDocumentListFull
 * Resolve o Erro 404 e restaura metadados de data_theses.json.
 */
function renderDocumentListFull(docs, lang) {
    if (!docs || docs.length === 0) return '<p class="text-center italic py-20 text-gray-400">Sem registros.</p>';
    const years = [...new Set(docs.map(d => d.year))].sort((a, b) => b - a);
    return `
        <div class="max-w-5xl mx-auto">
            ${years.map(y => `
                <div class="mb-12">
                    <div class="flex items-center mb-6"><span class="bg-black text-white px-5 py-1.5 rounded font-bold text-xs">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
                    <div class="space-y-6">
                        ${docs.filter(d => d.year == y).map(d => `
                            <div class="bg-white border-l-8 border-[#1e3a2c] p-8 shadow-md flex justify-between items-center group hover:border-[#c5a059] transition-all">
                                <div class="flex-grow pr-10">
                                    <h4 class="font-bold text-[17px] text-[#1e3a2c] leading-snug uppercase">${d.title}</h4>
                                    <div class="flex items-center mt-3 space-x-4">
                                        <span class="text-[10px] bg-[#c5a059]/10 text-[#c5a059] px-2 py-0.5 rounded font-bold uppercase border border-[#c5a059]/20">
                                            ${d.type?.[lang] || d.type || "Doc"}
                                        </span>
                                        <span class="text-[10px] text-gray-400 font-bold uppercase italic">${d.authors || ''}</span>
                                    </div>
                                </div>
                                <a href="${d.link}" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   class="text-[#1e3a2c] text-4xl group-hover:scale-110 group-hover:text-[#c5a059] transition-all flex-shrink-0">
                                    <i class="fa-solid fa-file-pdf"></i>
                                </a>
                            </div>`).join('')}
                    </div>
                </div>`).join('')}
        </div>`;
}

/**
 * COMPONENTE GLOBAL: renderResearcherCard
 * Utilizado por Leadership, CNP e AllResearchers.
 */
function renderResearcherCard(r, lang) {
    if (!r) return "";
    return `
        <div class="flex flex-col items-center">
            <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
            <h4 class="font-bold text-center text-[12px] h-10 flex items-center tracking-tighter">${r.name}</h4>
            <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center mt-2">${r.role?.[lang] || ""}</p>
            <a href="${r.lattes}" target="_blank" class="text-[8px] font-bold border-2 border-[#1e3a2c] px-3 py-1 rounded-full mt-3 hover:bg-[#1e3a2c] hover:text-white transition">LATTES CV</a>
        </div>`;
}
