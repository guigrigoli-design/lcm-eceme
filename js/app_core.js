function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null, 
        activeSlide: 0, loginEmail: '', loginPass: '', cnpSubView: 'coords', 
        researcherSubView: 'andamento', showProjectForm: false, showInterestModal: false, selectedProject: null,
        
        newProj: { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] },
        manifestForm: { text: '', selectedRoles: [] },
        
        data: {}, 
        projects: [
            { id: 1, title: 'Geopolítica e Tecnologia', link: 'https://lcm.eb.mil.br', domainId: 1, description: 'Exemplo de pesquisa.', status: 'andamento', author: 'lcm@eb.mil.br', manifests: [], creditNeeds: ['Metodologia'] }
        ],

        creditOptions: ["Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento", "Investigação", "Metodologia", "Administração do Projeto", "Recursos", "Programação de Software", "Supervisão", "Validação", "Visualização", "Redação – rascunho original", "Redação – revisão e edição"],

        async init() {
            await this.loadAllData();
            this.loading = false;
            setInterval(() => { if(this.data.news) this.activeSlide = (this.activeSlide + 1) % this.data.news.length; }, 7000);
        },

        async loadAllData() {
            const files = [['researchers', './data_researchers.json'], ['theses', './data_theses.json'], ['publications', './data_publications.json'], ['news', './data_news.json'], ['ic', './data_ic.json'], ['coordinators', './data_coordinators.json'], ['intro', './data_intro.json'], ['events', './data_events.json'], ['access', './data_access.json']];
            await Promise.all(files.map(async ([key, url]) => { try { const r = await fetch(url + '?v=' + Date.now()); this.data[key] = await r.json(); } catch(e){} }));
        },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { this.isLoggedIn = true; this.view = 'researcher_area'; this.currentUser = user.email; } 
            else { alert("Acesso Negado."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        confirmPublish() {
            if (!this.newProj.title) return;
            const project = { ...this.newProj, id: Date.now(), author: this.currentUser, manifests: [], status: this.researcherSubView };
            this.projects.unshift(project);
            this.showProjectForm = false;
            this.newProj = { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] };
        },

        deleteProject(id) {
            if (confirm("Excluir esta pesquisa?")) this.projects = this.projects.filter(p => p.id !== id);
        },

        migrateToCurrent(id) {
            const p = this.projects.find(x => x.id === id);
            if (p) { p.status = 'andamento'; alert("Migrado!"); }
        },

        submitManifest() {
            const proj = this.projects.find(p => p.id === this.selectedProject);
            if (proj && this.manifestForm.selectedRoles.length > 0) {
                proj.manifests.push({
                    author: this.currentUser,
                    roles: [...this.manifestForm.selectedRoles],
                    text: this.manifestForm.text,
                    date: new Date().toLocaleDateString('pt-BR')
                });
                this.showInterestModal = false;
                this.manifestForm = { text: '', selectedRoles: [] };
            }
        },

        // CORREÇÃO: Roteamento Integrado
        renderCurrentView() {
            if (this.loading) return '';
            const restricted = ['researcher_area', 'researcher_login'];
            if (restricted.includes(this.view)) return renderResearcherModule(this);
            return renderMenuModule(this);
        },

        setCnpSubView(sub) { this.cnpSubView = sub; },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação', theses: 'Acadêmico', publications: 'Produção', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training', theses: 'Theses', publications: 'Publications', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación', theses: 'Tesis', publications: 'Producción', events: 'Eventos', contact: 'Contacto' }
        }
    }
}
