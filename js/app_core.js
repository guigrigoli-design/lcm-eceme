/**
 * APP CORE - Versão 60.0
 * Orquestrador de Pesquisa: CRediT Taxonomy, Migração e Persistência Híbrida.
 */
function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null,
        activeSlide: 0, cnpSubView: 'coords', researcherSubView: 'andamento',
        loginEmail: '', loginPass: '',
        
        // Dados Estruturais
        data: { news: [], researchers: [], theses: [], publications: [], ic: { coords: [], docs: [], students: [] }, coordinators: [], intro: {}, events: [], domains_info: [], access: [] },
        
        // Persistência Híbrida (Pesquisas e Projetos)
        projects: [], 

        // Formulários Reativos
        newProj: { title: '', link: '', domainId: 1, description: '', needsCredit: [] },
        manifestForm: { text: '', selectedRoles: [] },
        showProjectForm: false, 
        showInterestModal: false, 
        selectedProject: null,

        uiLabels: {
            pt: { researcherArea: "Área do Pesquisador", loading: "Sincronizando...", plenos: "Pesquisadores Plenos (Doutores)", regular: "Pesquisadores", interest: "Manifestar Interesse", creditTitle: "Taxonomia CRediT", confirm: "Confirmar Publicação" },
            en: { researcherArea: "Researcher Area", loading: "Syncing...", plenos: "Senior Researchers (PhD)", regular: "Researchers", interest: "Express Interest", creditTitle: "CRediT Taxonomy", confirm: "Confirm Publication" },
            es: { researcherArea: "Área del Investigador", loading: "Sincronizando...", plenos: "Investigadores Plenos (Doctores)", regular: "Investigadores", interest: "Manifestar Interés", creditTitle: "Taxonomía CRediT", confirm: "Confirmar Publicación" }
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação de Novos Pesquisadores', theses: 'Produção Acadêmica', publications: 'Artigos Acadêmicos', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training of New Researchers', theses: 'Academic Production', publications: 'Academic Articles', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación de Nuevos Investigadores', theses: 'Producción Académica', publications: 'Artículos Académicos', events: 'Eventos', contact: 'Contacto' }
        },

        // As 14 Funções da Taxonomia CRediT
        creditOptions: ["Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento", "Investigação", "Metodologia", "Administração do Projeto", "Recursos", "Software", "Supervisão", "Validação", "Visualização", "Redação – rascunho original", "Redação – revisão e edição"],

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
                } catch(e) { this.data[key] = (key === 'ic') ? { coords: [], docs: [], students: [] } : []; }
            }));
        },

        loadPersistence() {
            const saved = localStorage.getItem('lcm_academic_hub');
            this.projects = saved ? JSON.parse(saved) : [];
        },

        savePersistence() { localStorage.setItem('lcm_academic_hub', JSON.stringify(this.projects)); },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { this.isLoggedIn = true; this.currentUser = user.email; this.view = 'researcher_area'; } 
            else { alert("Acesso Negado."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        // --- GESTÃO DE PESQUISA (CORREÇÕES v60.0) ---

        confirmPublish() {
            if (!this.newProj.title) return alert("Insira o título da pesquisa.");
            
            const project = { 
                ...this.newProj, 
                id: Date.now(), 
                author: this.currentUser, 
                manifests: [], 
                status: this.researcherSubView, // Define se é 'andamento' ou 'futuro'
                needsCredit: [...this.newProj.needsCredit] // Coleta as seleções de CRediT necessárias
            };
            
            this.projects.unshift(project);
            this.savePersistence();
            this.showProjectForm = false;
            this.newProj = { title: '', link: '', domainId: 1, description: '', needsCredit: [] };
        },

        deleteProject(id) {
            const p = this.projects.find(x => x.id === id);
            if (p && p.author === this.currentUser) {
                if (confirm("Deseja excluir permanentemente esta publicação?")) {
                    this.projects = this.projects.filter(x => x.id !== id);
                    this.savePersistence();
                }
            }
        },

        // MIGRAR: Futuro -> Andamento (Mantendo Manifestações)
        migrateToOngoing(id) {
            const p = this.projects.find(x => x.id === id);
            if (p && p.author === this.currentUser) {
                p.status = 'andamento';
                this.savePersistence();
                alert("Projeto migrado com sucesso para Pesquisas em Andamento.");
            }
        },

        submitManifest() {
            const proj = this.projects.find(p => p.id === this.selectedProject);
            if (proj && this.manifestForm.selectedRoles.length > 0) {
                proj.manifests.push({ 
                    id: Date.now(),
                    author: this.currentUser, 
                    roles: [...this.manifestForm.selectedRoles], 
                    text: this.manifestForm.text, 
                    date: new Date().toLocaleDateString() 
                });
                this.savePersistence();
                this.showInterestModal = false;
                this.manifestForm = { text: '', selectedRoles: [] };
            }
        },

        deleteManifest(projectId, manifestId) {
            const proj = this.projects.find(p => p.id === projectId);
            if (proj) {
                const manifest = proj.manifests.find(m => m.id === manifestId);
                if (manifest && manifest.author === this.currentUser) {
                    proj.manifests = proj.manifests.filter(m => m.id !== manifestId);
                    this.savePersistence();
                }
            }
        },

        renderCurrentView() {
            if (this.loading) return '';
            const router = {
                'home': () => renderHome(this), 'domains': () => renderDomains(this), 'leadership': () => renderLeadership(this),
                'all_researchers': () => renderResearchers(this), 'cnp': () => renderCNP(this), 'theses': () => renderTheses(this),
                'publications': () => renderPublications(this), 'events': () => renderEvents(this), 'contact': () => renderContact(this),
                'researcher_login': () => renderResearcherLogin(this), 'researcher_area': () => renderResearcherArea(this)
            };
            return router[this.view]();
        },
        setCnpSubView(v) { this.cnpSubView = v; }
    }
}
