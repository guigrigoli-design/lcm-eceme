function appData() {
    return {
        lang: 'pt', view: 'home', activeSlide: 0, mobileMenuOpen: false, 
        isLoggedIn: false, loginEmail: '', loginPass: '', currentUser: '',
        showProjectForm: false, showInterestModal: false, selectedProject: null,
        ncnpTab: 'coords', cnpTab: 'coords',
        allResearchers: [], news: [], ic: {}, coordinators: [], introText: {}, events: [], theses: [], publications: [], accessData: [],
        
        // Formulários
        newProj: { title: '', link: '', domainId: 1, description: '', roles: [] },
        interestForm: { text: '', role: 'Conceitualização' },

        // Banco de Dados Local
        projects: [
            { 
                id: 1, 
                title: 'IA e Sustentação em Defesa', 
                link: 'http://lcm.eb.mil.br/ia-sustentacao',
                author: 'TC Grigoli', 
                domainId: 1, 
                description: 'Estudo sobre integração de IA na cadeia de suprimentos militar.', 
                roles: ['Metodologia', 'Análise Formal'],
                interests: [
                    { id: 101, author: 'Cap Silva', text: 'Tenho experiência em análise estatística para dados de logística.', role: 'Análise Formal' }
                ]
            }
        ],

        creditFunctions: [
            {id:1,name:'Conceitualização'}, {id:2,name:'Curadoria de Dados'}, {id:3,name:'Análise Formal'},
            {id:4,name:'Obtenção de Financiamento'}, {id:5,name:'Investigação'}, {id:6,name:'Metodologia'},
            {id:7,name:'Administração do Projeto'}, {id:8,name:'Recursos'}, {id:9,name:'Programação de Software'},
            {id:10,name:'Supervisão'}, {id:11,name:'Validação'}, {id:12,name:'Visualização'},
            {id:13,name:'Redação – rascunho original'}, {id:14,name:'Redação – revisão e edição'}
        ],

        domains: [
            { id: 1, title: { pt: "Domínio 1 - Ciência, Tecnologia, Inovação e Sustentação em Defesa" } },
            { id: 2, title: { pt: "Domínio 2 - Preparo e Emprego do Poder Militar" } },
            { id: 3, title: { pt: "Domínio 3 - Análise e Prospecção do Ambiente Estratégico" } }
        ],

        t: { pt: { cat_plenos: 'Pesquisadores Plenos', cat_researchers: 'Pesquisadores', menu: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Pesquisadores', cnp: 'Capacitação', theses: 'Teses/Dissertações/TCC', publications: 'Produção Acadêmica', events: 'Eventos', contact: 'Contato' } } },

        async initApp() { 
            await this.loadAll(); 
            setInterval(() => { this.activeSlide = (this.activeSlide + 1) % (this.news.length || 1); }, 7000); 
        },

        async loadAll() {
            const endpoints = [['allResearchers', './data_researchers.json'],['theses', './data_theses.json'],['publications', './data_publications.json'],['news', './data_news.json'],['ic', './data_ic.json'],['coordinators', './data_coordinators.json'],['introText', './data_intro.json'],['events', './data_events.json'],['accessData','./data_access.json']];
            for(let [key, url] of endpoints) { try { const r = await fetch(url + '?v=' + Date.now()); this[key] = await r.json(); } catch(e) {} }
        },

        // --- Lógica de Área do Pesquisador ---
        handleLogin() { 
            const u = this.accessData.find(x => x.email === this.loginEmail && x.pass === this.loginPass); 
            if(u) { this.isLoggedIn = true; this.view = 'researcher_area'; this.currentUser = u.email; } else { alert('Acesso negado.'); } 
        },

        logout() { this.isLoggedIn = false; this.view = 'home'; this.currentUser = ''; },

        getDomainColor(id) {
            if(id == 1) return 'bg-domain-1';
            if(id == 2) return 'bg-domain-2';
            if(id == 3) return 'bg-domain-3';
            return 'bg-white';
        },

        submitProject() { 
            if(this.newProj.title) { 
                this.projects.push({...this.newProj, id: Date.now(), author: this.currentUser, interests: []}); 
                this.newProj = { title: '', link: '', domainId: 1, description: '', roles: [] }; 
                this.showProjectForm = false; 
            } 
        },

        openInterestModal(p) { this.selectedProject = p; this.showInterestModal = true; },

        submitInterest() {
            if(this.interestForm.text && this.selectedProject) {
                this.selectedProject.interests.push({
                    id: Date.now(),
                    author: this.currentUser,
                    text: this.interestForm.text,
                    role: this.interestForm.role
                });
                this.interestForm = { text: '', role: 'Conceitualização' };
                this.showInterestModal = false;
                alert('Manifestação de interesse registrada com sucesso!');
            }
        },

        getDomainTitle(id) { const d = this.domains.find(x => x.id == id); return d ? d.title.pt : ''; },
        getSortedResearchers(cat) { return this.allResearchers.filter(r => { let role = (r.role.pt || "").toLowerCase(); let isDr = (role.includes("doutor") || role.includes("phd")) && !role.includes("doutorando"); return cat === 'pleno' ? isDr : !isDr; }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR')); },
        getResearchersByDomain(id) { return this.allResearchers.filter(r => r.domain_id === id).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR')); },
        getStructuredPubs() { const years = [...new Set(this.publications.map(p => p.year))].sort((a,b) => b - a); return years.map(y => ({ year: y, docs: this.publications.filter(p => p.year === y) })); },
        getStructuredTheses() { const years = [...new Set(this.theses.map(t => t.year))].sort((a,b) => b - a); return years.map(y => ({ year: y, docs: this.theses.filter(t => t.year === y) })); },
        getStructuredIcStudents() { if(!this.ic.students) return []; const years = [...new Set(this.ic.students.map(s => s.year))].sort((a,b) => b - a); return years.map(y => ({ year: y, students: this.ic.students.filter(s => s.year === y) })); },
        getInitials(n) { return n.split(' ').map(x => x[0]).join('').substring(0,2).toUpperCase(); }
    }
}
