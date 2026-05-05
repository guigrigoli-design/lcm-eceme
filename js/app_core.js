function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, mobileMenuOpen: false,
        isLoggedIn: false, currentUser: null, activeSlide: 0,
        data: {}, 
        
        async init() {
            await this.loadAllData();
            this.loading = false;
            // Inicia o Carrossel se houver notícias
            setInterval(() => {
                if(this.data.news && this.data.news.length > 0) {
                    this.activeSlide = (this.activeSlide + 1) % this.data.news.length;
                }
            }, 6000);
        },

        async loadAllData() {
            const files = [
                ['researchers', './data_researchers.json'], ['theses', './data_theses.json'],
                ['publications', './data_publications.json'], ['news', './data_news.json'],
                ['ic', './data_ic.json'], ['coordinators', './data_coordinators.json'],
                ['intro', './data_intro.json'], ['events', './data_events.json'], ['access', './data_access.json']
            ];
            await Promise.all(files.map(async ([key, url]) => {
                try {
                    const r = await fetch(url + '?v=' + Date.now());
                    this.data[key] = await r.json();
                } catch (e) { console.warn(`Falha: ${key}`); }
            }));
        },

        renderCurrentView() {
            if (this.loading) return '';
            if (this.view === 'researcher_area' || this.view === 'researcher_login') {
                return renderResearcherModule(this);
            }
            return renderMenuModule(this);
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Pesquisadores', cnp: 'Capacitação', theses: 'Teses/Dissertações/TCC', publications: 'Produção Acadêmica', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Researchers', cnp: 'Training', theses: 'Theses/TCC', publications: 'Academic Production', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Investigadores', cnp: 'Capacitación', theses: 'Tesis/TCC', publications: 'Producción Académica', events: 'Eventos', contact: 'Contacto' }
        }
    }
}
