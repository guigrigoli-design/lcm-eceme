/**
 * APP CORE - Versão 59.0
 * Orquestrador com Persistência Híbrida e Componentes Globais Blindados.
 */
function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null,
        activeSlide: 0, cnpSubView: 'coords', researcherSubView: 'andamento',
        loginEmail: '', loginPass: '', // Variáveis de Login (Essencial para evitar undefined)
        data: { news: [], researchers: [], theses: [], publications: [], ic: { coords: [], docs: [], students: [] }, coordinators: [], intro: {}, events: [], domains_info: [], access: [] },
        projects: [], 

        uiLabels: {
            pt: { researcherArea: "Área do Pesquisador", loading: "Sincronizando...", plenos: "Pesquisadores Plenos (Doutores)", regular: "Pesquisadores", interest: "Apoiar", creditTitle: "Manifestação CRediT", confirm: "Publicar" },
            en: { researcherArea: "Researcher Area", loading: "Syncing...", plenos: "Senior Researchers (PhD)", regular: "Researchers", interest: "Support", creditTitle: "CRediT Manifestation", confirm: "Publish" },
            es: { researcherArea: "Área del Investigador", loading: "Sincronizando...", plenos: "Investigadores Plenos (Doctores)", regular: "Investigadores", interest: "Apoyar", creditTitle: "Manifestación CRediT", confirm: "Publish" }
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação de Novos Pesquisadores', theses: 'Produção Acadêmica', publications: 'Artigos Acadêmicos', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training of New Researchers', theses: 'Academic Production', publications: 'Academic Articles', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación de Nuevos Investigadores', theses: 'Producción Académica', publications: 'Artículos Académicos', events: 'Eventos', contact: 'Contacto' }
        },

        creditOptions: ["Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento", "Investigação", "Metodologia", "Administração do Projeto", "Recursos", "Programação de Software", "Supervisão", "Validação", "Visualização", "Redação – rascunho original", "Redação – revisão e edição"],

        async init() {
            await this.loadAllModules();
            this.loadPersistence();
            this.loading = false;
            setInterval(() => { if (this.data.news?.length > 0) this.activeSlide = (this.activeSlide + 1) % this.data.news.length; }, 8000);
        },

        async loadAllModules() {
            const endpoints = [['news', 'data_news.json'], ['researchers', 'data_researchers.json'], ['theses', 'data_theses.json'], ['publications', 'data_publications.json'], ['ic', 'data_ic.json'], ['coordinators', 'data_coordinators.json'], ['intro', 'data_intro.json'], ['events', 'data_events.json'], ['domains_info', 'data_domains.json'], ['access', 'data_access.json']];
            await Promise.all(endpoints.map(async ([key, file]) => {
                try {
                    const r = await fetch(`./${file}?v=${Date.now()}`);
                    this.data[key] = await r.json();
                } catch(e) { this.data[key] = (key === 'ic') ? { coords: [], docs: [], students: [] } : []; }
            }));
        },

        loadPersistence() {
            const saved = localStorage.getItem('lcm_academic_projects');
            this.projects = saved ? JSON.parse(saved) : [];
        },

        savePersistence() { localStorage.setItem('lcm_academic_projects', JSON.stringify(this.projects)); },

        setLang(l) { this.lang = l; },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { 
                this.isLoggedIn = true; this.currentUser = user.email; this.view = 'researcher_area';
                this.loginEmail = ''; this.loginPass = '';
            } else { alert("Acesso Negado. Verifique suas credenciais."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        confirmPublish() {
            if (!this.newProj.title) return;
            const project = { ...this.newProj, id: Date.now(), author: this.currentUser, manifests: [], status: this.researcherSubView };
            this.projects.unshift(project);
            this.savePersistence();
            this.showProjectForm = false;
            this.newProj = { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] };
        },

        deleteProject(id) { 
            if (confirm("Excluir pesquisa?")) { this.projects = this.projects.filter(p => p.id !== id); this.savePersistence(); }
        },

        submitManifest() {
            const proj = this.projects.find(p => p.id === this.selectedProject);
            if (proj && this.manifestForm.selectedRoles.length > 0) {
                proj.manifests.push({ author: this.currentUser, roles: [...this.manifestForm.selectedRoles], text: this.manifestForm.text, date: new Date().toLocaleDateString() });
                this.savePersistence();
                this.showInterestModal = false;
                this.manifestForm = { text: '', selectedRoles: [] };
            }
        },

        renderCurrentView() {
            if (this.loading) return '';
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
            return router[this.view] ? router[this.view]() : '<p class="p-20 text-center italic">Módulo não encontrado.</p>';
        },

        setCnpSubView(v) { this.cnpSubView = v; }
    }
}

// --- COMPONENTES GLOBAIS REESTRUTURADOS ---

function renderResearcherCard(r, lang) {
    if (!r) return "";
    return `
        <div class="flex flex-col items-center">
            <div class="circle-container shadow-md"><img src="${r.photo}" class="circle-img" onerror="this.src='https://via.placeholder.com/150'"></div>
            <h4 class="font-bold text-center text-[12px] leading-tight h-10 flex items-center">${r.name}</h4>
            <p class="text-[9px] text-[#c5a059] font-bold uppercase text-center mt-2">${r.role?.[lang] || ""}</p>
            <a href="${r.lattes}" target="_blank" class="text-[8px] font-bold border-2 border-[#1e3a2c] px-3 py-1 rounded-full mt-3 hover:bg-[#1e3a2c] hover:text-white transition uppercase">Lattes CV</a>
        </div>`;
}

/**
 * CORREÇÃO 3: Renderização Integral de Documentos com Tipo e Download.
 */
function renderDocumentListFull(docs, lang) {
    if (!docs || docs.length === 0) return '<p class="text-center italic py-10 uppercase tracking-widest text-gray-400">Nenhum registro encontrado.</p>';
    const years = [...new Set(docs.map(d => d.year))].sort((a, b) => b - a);
    return `
        <div class="max-w-5xl mx-auto">
            ${years.map(y => `
                <div class="mb-10">
                    <div class="flex items-center mb-6"><span class="bg-black text-white px-4 py-1 rounded font-bold text-xs">${y}</span><div class="h-px bg-gray-200 flex-grow ml-4"></div></div>
                    <div class="space-y-4">
                        ${docs.filter(d => d.year == y).map(d => `
                            <div class="bg-white border-l-4 border-[#1e3a2c] p-6 shadow-sm flex justify-between items-center hover:border-[#c5a059] transition">
                                <div class="pr-8">
                                    <h4 class="font-bold text-sm text-[#1e3a2c] leading-snug uppercase">${d.title}</h4> <p class="text-[10px] text-[#c5a059] font-bold uppercase mt-1">${d.type?.[lang] || d.type || ""}</p> <p class="text-[10px] text-gray-400 font-bold mt-1 italic">${d.authors || ''}</p>
                                </div>
                                <a href="${d.link}" target="_blank" download class="text-[#1e3a2c] text-3xl hover:scale-110 transition flex-shrink-0" title="Download">
                                    <i class="fa-solid fa-file-pdf"></i>
                                </a>
                            </div>`).join('')}
                    </div>
                </div>`).join('')}
        </div>`;
}
