function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null, 
        activeSlide: 0, loginEmail: '', loginPass: '', cnpSubView: 'coords', 
        researcherSubView: 'andamento', showProjectForm: false, showInterestModal: false, selectedProject: null,
        
        newProj: { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] },
        manifestForm: { text: '', role: 'Conceitualização' },
        
        data: {}, 
        projects: [
            { id: 1, title: 'Geopolítica do Atlântico Sul', link: 'https://lcm.eb.mil.br', domainId: 1, description: 'Exemplo de pesquisa estratégica em andamento.', status: 'andamento', author: 'lcm@eb.mil.br', manifests: [], creditNeeds: ['Metodologia', 'Investigação'] }
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
            if (user) { this.isLoggedIn = true; this.view = 'researcher_area'; this.currentUser = user.email; this.loginPass = ''; } 
            else { alert("Acesso Negado: Verifique suas credenciais."); }
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = null; },

        // --- GESTÃO DE PESQUISAS ---
        confirmPublish() {
            if (!this.newProj.title || !this.newProj.description) { alert("Título e Descrição são obrigatórios."); return; }
            const project = { 
                ...this.newProj, 
                id: Date.now(), 
                author: this.currentUser, 
                manifests: [],
                status: this.researcherSubView // Insere na aba que o usuário está visualizando
            };
            this.projects.unshift(project);
            this.showProjectForm = false;
            this.newProj = { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] };
        },

        deleteProject(id) {
            if (confirm("Tem certeza que deseja excluir esta pesquisa permanentemente?")) {
                this.projects = this.projects.filter(p => p.id !== id);
            }
        },

        migrateToCurrent(id) {
            const project = this.projects.find(p => p.id === id);
            if (project) {
                project.status = 'andamento';
                alert("Pesquisa migrada para 'Em Curso' com sucesso.");
            }
        },

        setCnpSubView(sub) { this.cnpSubView = sub; },

        renderCurrentView() {
            if (this.loading) return '';
            const restricted = ['researcher_area', 'researcher_login'];
            if (restricted.includes(this.view)) return renderResearcherModule(this);
            return renderMenuModule(this);
        },

        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação', theses: 'Acadêmico', publications: 'Produção', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training', theses: 'Academic', publications: 'Publications', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación', theses: 'Tesis', publications: 'Producción', events: 'Eventos', contact: 'Contacto' }
        }
    }
}
