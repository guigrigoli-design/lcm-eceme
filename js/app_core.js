/**
 * APP CORE - Versão 58.0 (Arquitetura Modular)
 * Orquestra a carga de múltiplos JSONs e gerencia LocalStorage.
 */
function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null,
        activeSlide: 0, cnpSubView: 'coords', researcherSubView: 'andamento',
        data: {}, 
        projects: [], // Projetos persistentes

        uiLabels: {
            pt: { researcherArea: "Área do Pesquisador", loading: "Sincronizando...", plenos: "Pesquisadores Plenos (Doutores)", regular: "Pesquisadores", interest: "Apoiar", confirm: "Publicar" },
            en: { researcherArea: "Researcher Area", loading: "Syncing...", plenos: "Senior Researchers (PhD)", regular: "Researchers", interest: "Support", confirm: "Publish" },
            es: { researcherArea: "Área del Investigador", loading: "Sincronizando...", plenos: "Investigadores Plenos (Doctores)", regular: "Investigadores", interest: "Apoyar", confirm: "Publicar" }
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação de Novos Pesquisadores', theses: 'Produção Acadêmica', publications: 'Artigos Acadêmicos', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training of New Researchers', theses: 'Academic Production', publications: 'Academic Articles', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación de Nuevos Investigadores', theses: 'Producción Académica', publications: 'Artículos Académicos', events: 'Eventos', contact: 'Contacto' }
        },

        async init() {
            await this.loadAllModules();
            this.loadPersistence();
            this.loading = false;
        },

        async loadAllModules() {
            const endpoints = [
                ['news', 'data_news.json'], ['researchers', 'data_researchers.json'],
                ['theses', 'data_theses.json'], ['publications', 'data_publications.json'],
                ['ic', 'data_ic.json'], ['coordinators', 'data_coordinators.json'],
                ['intro', 'data_intro.json'], ['events', 'data_events.json'],
                ['domains_info', 'data_domains.json'], ['access', 'data_access.json']
            ];
            await Promise.all(endpoints.map(async ([key, file]) => {
                try {
                    const r = await fetch(`./${file}?v=${Date.now()}`);
                    this.data[key] = await r.json();
                } catch(e) { this.data[key] = []; }
            }));
        },

        // --- LÓGICA DE PERSISTÊNCIA HÍBRIDA ---
        loadPersistence() {
            const saved = localStorage.getItem('lcm_projects');
            this.projects = saved ? JSON.parse(saved) : [];
        },

        savePersistence() {
            localStorage.setItem('lcm_projects', JSON.stringify(this.projects));
        },

        setLang(l) { this.lang = l; },

        renderCurrentView() {
            if (this.loading) return '';
            const map = {
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
            return map[this.view] ? map[this.view]() : 'Módulo não encontrado.';
        }
    }
}
