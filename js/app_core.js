/**
 * APP CORE - Versão 47.0
 * Núcleo de Dados com suporte a Multiseleção CRediT e Registro Cronológico.
 */
function lcmApp() {
    return {
        view: 'home', lang: 'pt', loading: true, isLoggedIn: false, currentUser: null, 
        activeSlide: 0, loginEmail: '', loginPass: '', cnpSubView: 'coords', 
        researcherSubView: 'andamento', showProjectForm: false, showInterestModal: false, selectedProject: null,
        
        newProj: { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] },
        
        // Estrutura atualizada para suportar múltiplas seleções
        manifestForm: { text: '', selectedRoles: [] },
        
        data: {}, 
        projects: [
            { 
                id: 1, 
                title: 'Geopolítica e Tecnologia Militar', 
                link: 'https://lcm.eb.mil.br', 
                domainId: 1, 
                description: 'Exemplo de projeto estruturado com log de colaboração.', 
                status: 'andamento', 
                author: 'lcm@eb.mil.br', 
                manifests: [
                    { author: 'TC Guilherme', roles: ['Metodologia', 'Investigação'], date: '10/05/2026', text: 'Tenho interesse em apoiar a coleta de dados.' }
                ], 
                creditNeeds: ['Metodologia', 'Análise Formal'] 
            }
        ],

        // As 14 Categorias Oficiais CRediT
        creditOptions: [
            "Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento",
            "Investigação", "Metodologia", "Administração do Projeto", "Recursos",
            "Programação de Software", "Supervisão", "Validação", "Visualização",
            "Redação – rascunho original", "Redação – revisão e edição"
        ],

        async init() {
            await this.loadAllData();
            this.loading = false;
        },

        async loadAllData() {
            const files = [['researchers', './data_researchers.json'], ['theses', './data_theses.json'], ['publications', './data_publications.json'], ['news', './data_news.json'], ['ic', './data_ic.json'], ['coordinators', './data_coordinators.json'], ['intro', './data_intro.json'], ['events', './data_events.json'], ['access', './data_access.json']];
            await Promise.all(files.map(async ([key, url]) => { try { const r = await fetch(url + '?v=' + Date.now()); this.data[key] = await r.json(); } catch(e){} }));
        },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { this.isLoggedIn = true; this.view = 'researcher_area'; this.currentUser = user.email; this.loginPass = ''; } 
            else { alert("Credenciais inválidas."); }
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
                status: this.researcherSubView 
            };
            this.projects.unshift(project);
            this.showProjectForm = false;
            this.newProj = { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] };
        },

        deleteProject(id) {
            if (confirm("Deseja excluir esta pesquisa permanentemente?")) {
                this.projects = this.projects.filter(p => p.id !== id);
            }
        },

        migrateToCurrent(id) {
            const project = this.projects.find(p => p.id === id);
            if (project) { project.status = 'andamento'; alert("Pesquisa migrada com sucesso."); }
        },

        // --- NOVA LÓGICA DE MANIFESTAÇÃO (Substituição Solicitada) ---
        submitManifest() {
            const proj = this.projects.find(p => p.id === this.selectedProject);
            if (proj && this.manifestForm.text && this.manifestForm.selectedRoles.length > 0) {
                proj.manifests.push({
                    author: this.currentUser,
                    roles: [...this.manifestForm.selectedRoles],
                    text: this.manifestForm.text,
                    date: new Date().toLocaleDateString('pt-BR') // Registro automático da data
                });
                this.showInterestModal = false;
                this.manifestForm = { text: '', selectedRoles: [] }; // Reset
            } else {
                alert("Por favor, selecione ao menos uma área CRediT e escreva sua mensagem.");
            }
        },

        renderCurrentView() {
            if (this.loading) return '';
            const restricted = ['researcher_area', 'researcher_login'];
            if (restricted.includes(this.view)) return renderResearcherModule(this);
            return renderMenuModule(this);
        }
    }
}
