function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false,
        currentUser: null, activeSlide: 0, loginEmail: '', loginPass: '',
        
        // Estados da Área do Pesquisador
        researcherSubView: 'andamento', 
        showProjectForm: false,
        showInterestModal: false,
        selectedProject: null,
        
        // Formulários
        newProj: { title: '', link: '', domainId: 1, description: '', status: 'andamento' },
        manifestForm: { text: '', role: 'Conceitualização' },
        
        // Banco de Dados Local de Projetos (Exemplo Inicial)
        projects: [
            { 
                id: 1, title: 'IA Generativa em Logística Militar', link: 'https://lcm.eb.mil.br/resumo-ia', 
                domainId: 1, description: 'Estudo sobre automação de inventários táticos.', 
                status: 'andamento', author: 'TC Guilherme Grigoli',
                manifests: [] 
            }
        ],

        // Taxonomia CRediT (14 Opções)
        creditOptions: [
            "Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento",
            "Investigação", "Metodologia", "Administração do Projeto", "Recursos",
            "Programação de Software", "Supervisão", "Validação", "Visualização",
            "Redação – rascunho original", "Redação – revisão e edição"
        ],

        data: {}, 
        
        async init() {
            await this.loadAllData();
            this.loading = false;
        },

        async loadAllData() {
            const files = [
                ['researchers', './data_researchers.json'], ['ic', './data_ic.json'],
                ['coordinators', './data_coordinators.json'], ['intro', './data_intro.json'],
                ['access', './data_access.json'], ['news', './data_news.json'],
                ['theses', './data_theses.json'], ['publications', './data_publications.json'],
                ['events', './data_events.json']
            ];
            await Promise.all(files.map(async ([key, url]) => {
                try {
                    const r = await fetch(url + '?v=' + Date.now());
                    this.data[key] = await r.json();
                } catch (e) { console.warn(`Falha: ${key}`); }
            }));
        },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) {
                this.isLoggedIn = true; this.view = 'researcher_area'; this.currentUser = user.email;
            } else { alert("Credenciais Inválidas."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        renderCurrentView() {
            if (this.loading) return '';
            if (this.view.includes('researcher')) return renderResearcherModule(this);
            return renderMenuModule(this);
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Pesquisadores', cnp: 'Capacitação', theses: 'Acadêmico', publications: 'Produção', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Researchers', cnp: 'Training', theses: 'Theses', publications: 'Publications', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Investigadores', cnp: 'Capacitación', theses: 'Tesis', publications: 'Producción', events: 'Eventos', contact: 'Contacto' }
        }
    }
}
