function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, mobileMenuOpen: false,
        isLoggedIn: false, currentUser: null, activeSlide: 0,
        loginEmail: '', loginPass: '', 
        data: {}, 
        
        async init() {
            await this.loadAllData();
            this.loading = false;
            setInterval(() => {
                if(this.data.news && this.data.news.length > 0) {
                    this.activeSlide = (this.activeSlide + 1) % this.data.news.length;
                }
            }, 7000);
        },

        async loadAllData() {
            const files = [
                ['researchers', './data_researchers.json'], ['theses', './data_theses.json'],
                ['publications', './data_publications.json'], ['news', './data_news.json'],
                ['ic', './data_ic.json'], ['coordinators', './data_coordinators.json'],
                ['intro', './data_intro.json'], ['events', './data_events.json'], 
                ['access', './data_access.json']
            ];
            await Promise.all(files.map(async ([key, url]) => {
                try {
                    const r = await fetch(url + '?v=' + Date.now());
                    this.data[key] = await r.json();
                } catch (e) { console.warn(`Falha no carregamento: ${key}`); }
            }));
        },

        handleLogin() {
            if (!this.data.access) { alert("Base de dados inacessível."); return; }
            const user = this.data.access.find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) {
                this.isLoggedIn = true;
                this.view = 'researcher_area';
                this.currentUser = user.email;
                this.loginPass = ''; 
            } else { alert("Acesso Negado: Credenciais inválidas."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        renderCurrentView() {
            if (this.loading) return '';
            if (this.view === 'researcher_area' || this.view === 'researcher_login') {
                return renderResearcherModule(this);
            }
            return renderMenuModule(this);
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Pesquisadores', cnp: 'Capacitação', theses: 'Teses/Dissertações/TCC', publications: 'Produção Acadêmica', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Researchers', cnp: 'Training', theses: 'Theses/TCC', publications: 'Publications', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Investigadores', cnp: 'Capacitación', theses: 'Tesis/TCC', publications: 'Producción', events: 'Eventos', contact: 'Contacto' }
        }
    }
}
