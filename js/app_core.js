function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, mobileMenuOpen: false,
        isLoggedIn: false, currentUser: null,
        data: {}, // Todos os conteúdos JSON[cite: 1]
        
        async init() {
            await this.loadAllData();
            this.loading = false; // Só libera a tela após o carregamento completo[cite: 1]
        },

        async loadAllData() {
            const files = [
                ['researchers', './data_researchers.json'],
                ['theses', './data_theses.json'],
                ['publications', './data_publications.json'],
                ['news', './data_news.json'],
                ['cnp', './data_ic.json'], // Capacitação de Novos Pesquisadores[cite: 1]
                ['coordinators', './data_coordinators.json'],
                ['intro', './data_intro.json'],
                ['events', './data_events.json'],
                ['access', './data_access.json']
            ];
            // Executa todos os carregamentos em paralelo para máxima velocidade[cite: 1]
            await Promise.all(files.map(async ([key, url]) => {
                try {
                    const r = await fetch(url + '?v=' + Date.now());
                    this.data[key] = await r.json();
                } catch (e) { console.warn(`Falha no dado: ${key}`); }
            }));
        },

        renderCurrentView() {
            if (this.loading) return '';
            // Delega a renderização para os arquivos específicos de cada funcionalidade[cite: 1]
            if (this.view === 'researcher_area' || this.view === 'researcher_login') {
                return renderResearcherModule(this);
            }
            return renderMenuModule(this);
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Pesquisadores', cnp: 'Capacitação', theses: 'Teses/Dissertações/TCC', publications: 'Produção Acadêmica', events: 'Eventos', contact: 'Contato' }
        }
    }
}
