/**
 * APP CORE - Versão 57.0
 * Correção: Blindagem de Dicionário e Resiliência de Login.
 */
function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null, 
        activeSlide: 0, loginEmail: '', loginPass: '', cnpSubView: 'coords', 
        researcherSubView: 'andamento', showProjectForm: false, showInterestModal: false, selectedProject: null,
        newProj: { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] },
        manifestForm: { text: '', selectedRoles: [] },
        data: { news: [], researchers: [], theses: [], publications: [], ic: {coords:[], docs:[], students:[]}, coordinators: [], intro: {}, events: [], domains_info: [], access: [] }, 
        projects: [], 

        // Rótulos de Interface com Fallback para evitar 'undefined'
        uiLabels: {
            pt: { researcherArea: "Área do Pesquisador", loading: "Carregando...", plenos: "Pesquisadores Plenos (Doutores)", regular: "Pesquisadores", interest: "Manifestar Interesse", creditTitle: "Manifestação CRediT", confirm: "Confirmar Pesquisa" },
            en: { researcherArea: "Researcher Area", loading: "Loading...", plenos: "Senior Researchers (PhD)", regular: "Researchers", interest: "Express Interest", creditTitle: "CRediT Manifestation", confirm: "Confirm Research" },
            es: { researcherArea: "Área del Investigador", loading: "Cargando...", plenos: "Investigadores Plenos (Doctores)", regular: "Investigadores", interest: "Manifestar Interés", creditTitle: "Manifestación CRediT", confirm: "Confirmar Investigación" }
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação de Novos Pesquisadores', theses: 'Produção Acadêmica', publications: 'Artigos Acadêmicos', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training of New Researchers', theses: 'Academic Production', publications: 'Academic Articles', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación de Nuevos Investigadores', theses: 'Producción Académica', publications: 'Artículos Académicos', events: 'Eventos', contact: 'Contacto' }
        },

        creditOptions: ["Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento", "Investigação", "Metodologia", "Administração do Projeto", "Recursos", "Programação de Software", "Supervisão", "Validação", "Visualização", "Redação – rascunho original", "Redação – revisão e edição"],

        async init() {
            await this.loadAllData();
            this.loading = false;
            setInterval(() => {
                if (this.data.news && this.data.news.length > 0) {
                    this.activeSlide = (this.activeSlide + 1) % this.data.news.length;
                }
            }, 8000);
        },

        async loadAllData() {
            const files = [['researchers', './data_researchers.json'], ['theses', './data_theses.json'], ['publications', './data_publications.json'], ['news', './data_news.json'], ['ic', './data_ic.json'], ['coordinators', './data_coordinators.json'], ['intro', './data_intro.json'], ['events', './data_events.json'], ['access', './data_access.json'], ['domains_info', './data_domains.json']];
            await Promise.all(files.map(async ([key, url]) => { 
                try { 
                    const r = await fetch(url + '?v=' + Date.now()); 
                    this.data[key] = await r.json();
                } catch(e) { console.warn("Erro ao carregar dado:", key); } 
            }));
            if (!this.data.ic?.coords) this.data.ic = { coords:[], docs:[], students:[] };
        },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { 
                this.isLoggedIn = true; 
                this.currentUser = user.email;
                this.view = 'researcher_area';
            } else { alert("Acesso negado: Credenciais incorretas."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        confirmPublish() {
            if (!this.newProj.title) return;
            const project = { ...this.newProj, id: Date.now(), author: this.currentUser, manifests: [], status: this.researcherSubView };
            this.projects.unshift(project);
            this.showProjectForm = false;
            this.newProj = { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] };
        },

        renderCurrentView() {
            if (this.loading) return '';
            const restricted = ['researcher_area', 'researcher_login'];
            return restricted.includes(this.view) ? renderResearcherModule(this) : renderMenuModule(this);
        }
    }
}
