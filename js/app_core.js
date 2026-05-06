/**
 * APP CORE - Versão 45.0
 * Núcleo de Gerenciamento de Estado, Dados e Roteamento Blindado.
 */

function lcmApp() {
    return {
        // --- Estados de Navegação e Interface ---
        view: 'home', 
        lang: 'pt', 
        loading: true, 
        mobileMenuOpen: false,
        isLoggedIn: false, 
        currentUser: null, 
        activeSlide: 0,
        
        // --- Estados de Autenticação ---
        loginEmail: '', 
        loginPass: '',
        
        // --- Estados das Sub-abas (Públicas e Restritas) ---
        cnpSubView: 'coords',      // Submenus da aba Capacitação (NCNP)
        researcherSubView: 'andamento', // Submenus da Área do Pesquisador (Andamento/Futuro)
        
        // --- Estados de Modais e Formulários ---
        showProjectForm: false,
        showInterestModal: false,
        selectedProject: null,
        
        // Estrutura para Novos Projetos
        newProj: { 
            title: '', 
            link: '', 
            domainId: 1, 
            description: '', 
            status: 'andamento' 
        },
        
        // Estrutura para Manifestação de Interesse (CRediT)
        manifestForm: { 
            text: '', 
            role: 'Conceitualização' 
        },
        
        // --- Repositório de Dados ---
        data: {}, 
        
        // Projetos Locais (Serão alimentados dinamicamente na rede de colaboração)
        projects: [
            { 
                id: 1, 
                title: 'IA Generativa em Logística Militar', 
                link: 'https://lcm.eb.mil.br/pesquisa-ia', 
                domainId: 1, 
                description: 'Estudo avançado sobre automação de inventários e processos logísticos em ambiente tático.', 
                status: 'andamento', 
                author: 'TC Guilherme Grigoli',
                manifests: [] 
            }
        ],

        // Taxonomia CRediT - 14 Funções Acadêmicas
        creditOptions: [
            "Conceitualização", 
            "Curadoria de Dados", 
            "Análise Formal", 
            "Obtenção de Financiamento",
            "Investigação", 
            "Metodologia", 
            "Administração do Projeto", 
            "Recursos",
            "Programação de Software", 
            "Supervisão", 
            "Validação", 
            "Visualização",
            "Redação – rascunho original", 
            "Redação – revisão e edição"
        ],

        /**
         * Inicialização do Sistema
         */
        async init() {
            await this.loadAllData();
            this.loading = false;
            
            // Controle do Carrossel de Notícias na Home
            setInterval(() => {
                if(this.data.news && this.data.news.length > 0) {
                    this.activeSlide = (this.activeSlide + 1) % this.data.news.length;
                }
            }, 7000);
        },

        /**
         * Carregamento Assíncrono de Dados (Arquivos JSON)
         */
        async loadAllData() {
            const files = [
                ['researchers', './data_researchers.json'], 
                ['theses', './data_theses.json'],
                ['publications', './data_publications.json'], 
                ['news', './data_news.json'],
                ['ic', './data_ic.json'], 
                ['coordinators', './data_coordinators.json'],
                ['intro', './data_intro.json'], 
                ['events', './data_events.json'], 
                ['access', './data_access.json']
            ];

            await Promise.all(files.map(async ([key, url]) => {
                try {
                    const response = await fetch(url + '?v=' + Date.now());
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    this.data[key] = await response.json();
                } catch (e) { 
                    console.warn(`Falha crítica ao carregar base de dados: ${key}`, e); 
                }
            }));
        },

        /**
         * Lógica de Autenticação
         */
        handleLogin() {
            if (!this.data.access) {
                alert("Erro: Base de usuários não carregada.");
                return;
            }
            const user = this.data.access.find(x => x.email === this.loginEmail && x.pass === this.loginPass);
            
            if (user) {
                this.isLoggedIn = true;
                this.view = 'researcher_area';
                this.currentUser = user.email;
                this.loginPass = ''; // Limpeza de segurança
            } else {
                alert("Acesso Negado: Credenciais incorretas.");
            }
        },

        logout() {
            this.isLoggedIn = false;
            this.view = 'home';
            this.currentUser = null;
        },

        /**
         * Gerenciamento de Sub-Abas
         */
        setCnpSubView(sub) {
            this.cnpSubView = sub;
        },

        /**
         * Roteador de Views (Blindagem Integrantes vs Área Restrita)
         */
        renderCurrentView() {
            if (this.loading) return '';

            // Views que exigem o módulo do pesquisador (Login ou Dashboard)
            const restrictedViews = ['researcher_area', 'researcher_login'];
            
            if (restrictedViews.includes(this.view)) {
                return renderResearcherModule(this);
            }

            // Fallback para todas as outras abas públicas do Laboratório
            return renderMenuModule(this);
        },

        /**
         * Dicionário Multilíngue (Labels Institucionais)
         */
        menuLabels: {
            pt: { 
                home: 'Início', 
                domains: 'Domínios', 
                leadership: 'Coordenação', 
                all_researchers: 'Integrantes', 
                cnp: 'Capacitação', 
                theses: 'Acadêmico', 
                publications: 'Produção', 
                events: 'Eventos', 
                contact: 'Contato' 
            },
            en: { 
                home: 'Home', 
                domains: 'Domains', 
                leadership: 'Leadership', 
                all_researchers: 'Members', 
                cnp: 'Training', 
                theses: 'Academic Works', 
                publications: 'Publications', 
                events: 'Events', 
                contact: 'Contact' 
            },
            es: { 
                home: 'Inicio', 
                domains: 'Dominios', 
                leadership: 'Coordinación', 
                all_researchers: 'Integrantes', 
                cnp: 'Capacitación', 
                theses: 'Tesis', 
                publications: 'Producción', 
                events: 'Eventos', 
                contact: 'Contacto' 
            }
        }
    };
}
