function lcmApp() {
    return {
        view: 'home',
        lang: 'pt',
        isLoggedIn: false,
        currentUser: null,
        mobileMenuOpen: false,
        data: {}, // Armazena dados de todos os JSONs

        async init() {
            await this.loadAllData();
            // Inicia o carrossel da Home se necessário
        },

        async loadAllData() {
            const files = [
                ['researchers', './data_researchers.json'],
                ['theses', './data_theses.json'],
                ['publications', './data_publications.json'],
                ['news', './data_news.json'],
                ['cnp', './data_ic.json'],
                ['coordinators', './data_coordinators.json'],
                ['intro', './data_intro.json'],
                ['events', './data_events.json'],
                ['access', './data_access.json']
            ];
            for (let [key, url] of files) {
                try {
                    const r = await fetch(url + '?v=' + Date.now());
                    this.data[key] = await r.json();
                } catch (e) { console.error(`Erro ao carregar ${key}`); }
            }
        },

        setView(newView) {
            this.view = newView;
            window.scrollTo(0, 0);
        },

        renderView() {
            // Conecta o index aos arquivos de funcionalidade (views.js e researcher_area.js)
            if (this.view === 'researcher_area' || this.view === 'researcher_login') {
                return renderResearcherArea(this);
            }
            return renderStaticView(this);
        },

        handleResearcherAreaAccess() {
            this.view = this.isLoggedIn ? 'researcher_area' : 'researcher_login';
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Pesquisadores', cnp: 'Capacitação', theses: 'Teses/Dissertações/TCC', publications: 'Produção Acadêmica', events: 'Eventos', contact: 'Contato' }
        }
    }
}
