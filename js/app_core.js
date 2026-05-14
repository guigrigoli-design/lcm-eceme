/**
 * APP CORE - Versão 58.0 (Arquitetura Modular & Persistência Híbrida)
 * Orquestrador Central do Laboratório de Ciências Militares (LCM - ECEME)
 */

function lcmApp() {
    return {
        // --- ESTADO GLOBAL ---
        view: 'home',
        lang: 'pt',
        loading: true,
        isLoggedIn: false,
        currentUser: null,
        activeSlide: 0,
        cnpSubView: 'coords',
        researcherSubView: 'andamento',
        
        // --- ARMAZENAMENTO DE DADOS ---
        data: {
            news: [],
            researchers: [],
            theses: [],
            publications: [],
            ic: { coords: [], docs: [], students: [] },
            coordinators: [],
            intro: {},
            events: [],
            domains_info: [],
            access: []
        },
        
        // Projetos e Manifestações (Persistência Híbrida)
        projects: [],

        // --- TRADUÇÕES DE INTERFACE (UI) ---
        uiLabels: {
            pt: { researcherArea: "Área do Pesquisador", loading: "Sincronizando...", plenos: "Pesquisadores Plenos (Doutores)", regular: "Pesquisadores", interest: "Manifestar Interesse", creditTitle: "Manifestação CRediT", confirm: "Publicar Pesquisa" },
            en: { researcherArea: "Researcher Area", loading: "Syncing...", plenos: "Senior Researchers (PhD)", regular: "Researchers", interest: "Express Interest", creditTitle: "CRediT Manifestation", confirm: "Publish Research" },
            es: { researcherArea: "Área del Investigador", loading: "Sincronizando...", plenos: "Investigadores Plenos (Doctores)", regular: "Investigadores", interest: "Manifestar Interés", creditTitle: "Manifestación CRediT", confirm: "Publicar Investigación" }
        },

        // --- DICIONÁRIO DE MENUS ---
        menuLabels: {
            pt: { home: 'Início', domains: 'Domínios', leadership: 'Coordenação', all_researchers: 'Integrantes', cnp: 'Capacitação de Novos Pesquisadores', theses: 'Produção Acadêmica', publications: 'Artigos Acadêmicos', events: 'Eventos', contact: 'Contato' },
            en: { home: 'Home', domains: 'Domains', leadership: 'Leadership', all_researchers: 'Members', cnp: 'Training of New Researchers', theses: 'Academic Production', publications: 'Academic Articles', events: 'Events', contact: 'Contact' },
            es: { home: 'Inicio', domains: 'Dominios', leadership: 'Coordinación', all_researchers: 'Integrantes', cnp: 'Capacitación de Nuevos Investigadores', theses: 'Producción Académica', publications: 'Artículos Académicos', events: 'Eventos', contact: 'Contacto' }
        },

        // --- TAXONOMIA CREDIT ---
        creditOptions: ["Conceitualização", "Curadoria de Dados", "Análise Formal", "Obtenção de Financiamento", "Investigação", "Metodologia", "Administração do Projeto", "Recursos", "Programação de Software", "Supervisão", "Validação", "Visualização", "Redação – rascunho original", "Redação – revisão e edição"],

        // --- INICIALIZAÇÃO ---
        async init() {
            try {
                await this.loadAllModules();
                this.loadPersistence();
                this.loading = false;
                
                // Timer do Carrossel (Home)
                setInterval(() => {
                    if (this.data.news && this.data.news.length > 0) {
                        this.activeSlide = (this.activeSlide + 1) % this.data.news.length;
                    }
                }, 8000);
            } catch (error) {
                console.error("Erro crítico na inicialização do LCM Core:", error);
            }
        },

        // --- CARREGAMENTO DE ARQUIVOS JSON (ISOLADOS) ---
        async loadAllModules() {
            const endpoints = [
                ['news', 'data_news.json'], 
                ['researchers', 'data_researchers.json'],
                ['theses', 'data_theses.json'], 
                ['publications', 'data_publications.json'],
                ['ic', 'data_ic.json'], 
                ['coordinators', 'data_coordinators.json'],
                ['intro', 'data_intro.json'], 
                ['events', 'data_events.json'],
                ['domains_info', 'data_domains.json'], 
                ['access', 'data_access.json']
            ];

            await Promise.all(endpoints.map(async ([key, file]) => {
                try {
                    const response = await fetch(`./${file}?v=${Date.now()}`);
                    if (!response.ok) throw new Error(`Status: ${response.status}`);
                    this.data[key] = await response.json();
                } catch (e) {
                    console.warn(`Módulo [${key}] não disponível ou vazio. Usando fallback.`);
                    this.data[key] = (key === 'ic') ? { coords: [], docs: [], students: [] } : [];
                }
            }));
        },

        // --- LÓGICA DE PERSISTÊNCIA HÍBRIDA (LocalStorage) ---
        loadPersistence() {
            const saved = localStorage.getItem('lcm_academic_projects');
            this.projects = saved ? JSON.parse(saved) : [];
        },

        savePersistence() {
            localStorage.setItem('lcm_academic_projects', JSON.stringify(this.projects));
        },

        // --- CONTROLE DE SESSÃO E IDIOMA ---
        setLang(l) { this.lang = l; },

        handleLogin() {
            const user = (this.data.access || []).find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            if (user) { 
                this.isLoggedIn = true; 
                this.currentUser = user.email;
                this.view = 'researcher_area';
                this.loginEmail = ''; this.loginPass = '';
            } else { 
                alert("Falha na autenticação institucional. Verifique suas credenciais."); 
            }
        },

        logout() { 
            this.isLoggedIn = false; 
            this.view = 'home'; 
            this.currentUser = null; 
        },

        // --- GERENCIAMENTO DE PESQUISAS (OPERACIONAL) ---
        confirmPublish() {
            if (!this.newProj.title || !this.newProj.description) {
                alert("Erro: Título e Resumo são obrigatórios para o registro da pesquisa.");
                return;
            }
            const project = { 
                ...this.newProj, 
                id: Date.now(), 
                author: this.currentUser, 
                manifests: [], 
                status: this.researcherSubView 
            };
            this.projects.unshift(project);
            this.savePersistence();
            this.showProjectForm = false;
            // Reset do formulário
            this.newProj = { title: '', link: '', domainId: 1, description: '', status: 'andamento', creditNeeds: [] };
        },

        deleteProject(id) { 
            if (confirm("Deseja remover permanentemente este registro de pesquisa?")) {
                this.projects = this.projects.filter(p => p.id !== id); 
                this.savePersistence();
            }
        },

        submitManifest() {
            const proj = this.projects.find(p => p.id === this.selectedProject);
            if (proj && this.manifestForm.selectedRoles.length > 0) {
                proj.manifests.push({ 
                    author: this.currentUser, 
                    roles: [...this.manifestForm.selectedRoles], 
                    text: this.manifestForm.text, 
                    date: new Date().toLocaleDateString(this.lang === 'en' ? 'en-US' : 'pt-BR') 
                });
                this.savePersistence();
                this.showInterestModal = false;
                this.manifestForm = { text: '', selectedRoles: [] };
            } else {
                alert("Selecione ao menos uma categoria CRediT e preencha a proposta.");
            }
        },

        // --- ROTEADOR DE MÓDULOS (RENDERIZAÇÃO) ---
        renderCurrentView() {
            if (this.loading) return '';
            
            const router = {
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

            try {
                return router[this.view] ? router[this.view]() : '<p class="p-20 text-center">Erro: Módulo de visualização não encontrado.</p>';
            } catch (err) {
                console.error(`Erro ao renderizar a view [${this.view}]:`, err);
                return `<p class="p-20 text-center italic text-red-600">Erro de renderização no módulo ${this.view}. Verifique o console.</p>`;
            }
        },

        setCnpSubView(v) { this.cnpSubView = v; }
    }
}

/**
 * FUNÇÃO AUXILIAR GLOBAL: renderDocumentListFull
 * Garante a exibição integral de títulos acadêmicos e metadados.
 * Utilizada pelos módulos: view_theses.js, view_publications.js e view_cnp.js.
 */
function renderDocumentListFull(docs, lang) {
    if (!docs || docs.length === 0) return '<p class="text-center italic text-gray-400 py-10 uppercase tracking-widest">Nenhum documento registrado neste setor.</p>';

    const years = [...new Set(docs.map(d => d.year))].sort((a, b) => b - a);
    
    return `
        <div class="max-w-5xl mx-auto">
            ${years.map(y => `
                <div class="mb-12">
                    <div class="flex items-center mb-8">
                        <span class="bg-black text-white px-5 py-1.5 rounded shadow-sm font-bold text-xs">${y}</span>
                        <div class="h-px bg-gray-200 flex-grow ml-4"></div>
                    </div>
                    <div class="space-y-6">
                        ${docs.filter(d => d.year == y).map(d => `
                            <div class="bg-white border-l-4 border-[#1e3a2c] p-8 shadow hover:shadow-md transition flex justify-between items-center group">
                                <div class="flex-grow pr-10">
                                    <h4 class="font-bold text-[17px] text-[#1e3a2c] leading-snug uppercase tracking-tight">
                                        ${d.title}
                                    </h4>
                                    <p class="text-[11px] text-gray-500 font-bold mt-3 uppercase italic tracking-wider">
                                        ${d.authors || ''}
                                    </p>
                                </div>
                                <a href="${d.link}" target="_blank" class="text-[#1e3a2c] text-4xl group-hover:scale-110 transition flex-shrink-0" title="Ver Documento">
                                    <i class="fa-solid fa-file-pdf"></i>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
}
