/**
 * ATLAS Lite - Demo Router
 * Navegação SPA simplificada
 */

var AtlasRouter = (function() {
    'use strict';
    
    var currentView = 'dashboard';
    var modules = {};
    
    // Traduções básicas
    var translations = {
        'save': 'Salvar',
        'cancel': 'Cancelar',
        'delete': 'Excluir',
        'edit': 'Editar',
        'loading': 'Carregando...',
        'add': 'Adicionar',
        'value': 'Valor'
    };
    
    function t(key) {
        return translations[key] || key;
    }
    
    // ============================================
    // ÍCONES SVG
    // ============================================
    
    var ICONS = {
        dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        finance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        fire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"/></svg>',
        compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        simulations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
        scenarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
        goals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        atlas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        blocked: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
    };
    
    // ============================================
    // NAVEGAÇÃO
    // ============================================
    
    function renderNav() {
        var nav = document.getElementById('nav');
        if (!nav) return;
        
        var structure = AtlasCapabilities.getFilteredNavStructure();
        
        var html = '';
        structure.forEach(function(section) {
            html += '<div class="nav-section">' + section.section + '</div>';
            section.items.forEach(function(item) {
                var isActive = currentView === item.id;
                var icon = ICONS[item.icon] || ICONS[item.id] || '';
                
                html += '<a class="nav-item' + (isActive ? ' active' : '') + '" onclick="AtlasRouter.navigate(\'' + item.id + '\')">';
                html += '<span class="nav-icon">' + icon + '</span>';
                html += '<span class="nav-label">' + item.label + '</span>';
                html += '</a>';
            });
        });
        
        nav.innerHTML = html;
    }
    
    function navigate(viewId) {
        if (!AtlasCapabilities.canAccess(viewId)) {
            console.log('[Demo] Módulo não disponível:', viewId);
            return;
        }
        
        currentView = viewId;
        var content = document.getElementById('content');
        var module = modules[viewId];
        
        if (module && module.render) {
            content.innerHTML = module.render();
            if (module.init) module.init();
        } else {
            content.innerHTML = '<div class="panel"><div class="panel-body"><p>Módulo não encontrado: ' + viewId + '</p></div></div>';
        }
        
        renderNav();
        
        // Atualiza título
        document.title = 'ATLAS Demo - ' + (viewId.charAt(0).toUpperCase() + viewId.slice(1));
        
        // Fecha sidebar mobile
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
    }
    
    function register(id, module) {
        modules[id] = module;
    }
    
    function getCurrentView() {
        return currentView;
    }
    
    function init() {
        renderNav();
        navigate('dashboard');
    }
    
    return {
        navigate: navigate,
        register: register,
        getCurrentView: getCurrentView,
        renderNav: renderNav,
        init: init,
        t: t,
        ICONS: ICONS
    };
})();
