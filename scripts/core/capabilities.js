/**
 * ATLAS Lite - Demo Capabilities
 * Todos os módulos habilitados para demonstração
 */

var AtlasCapabilities = (function() {
    
    // Módulos disponíveis na demo
    var DEMO_MODULES = {
        'dashboard':    { section: 'Principal', label: 'Dashboard', icon: 'dashboard' },
        'finance':      { section: 'Simuladores', label: 'Juros Compostos', icon: 'finance' },
        'fire':         { section: 'Simuladores', label: 'FIRE', icon: 'fire' },
        'compare':      { section: 'Simuladores', label: 'Comparador', icon: 'compare' },
        'simulations':  { section: 'Simuladores', label: 'Simulações', icon: 'simulations' },
        'scenarios':    { section: 'Planejamento', label: 'Cenários', icon: 'scenarios' },
        'goals':        { section: 'Planejamento', label: 'Metas', icon: 'goals' },
        'atlas-index':  { section: 'Análise', label: 'Índice Atlas', icon: 'atlas' }
    };
    
    var initialized = true;
    
    function canAccess(moduleId) {
        return moduleId in DEMO_MODULES;
    }
    
    function getFilteredNavStructure() {
        var sections = [
            { section: 'Principal', items: [] },
            { section: 'Simuladores', items: [] },
            { section: 'Planejamento', items: [] },
            { section: 'Análise', items: [] }
        ];
        
        for (var moduleId in DEMO_MODULES) {
            var module = DEMO_MODULES[moduleId];
            var section = sections.find(function(s) { return s.section === module.section; });
            
            if (section) {
                section.items.push({
                    id: moduleId,
                    icon: module.icon,
                    label: module.label
                });
            }
        }
        
        return sections.filter(function(s) { return s.items.length > 0; });
    }
    
    function init() {
        initialized = true;
        console.log('[Demo] Capabilities inicializado - todos os módulos habilitados');
    }
    
    function getBlockReason(moduleId) {
        if (canAccess(moduleId)) return null;
        return 'Módulo não disponível na versão Demo';
    }
    
    function getCurrentType() {
        return 'demo';
    }
    
    function getTypeLabel(type) {
        return 'Demo';
    }
    
    return {
        init: init,
        canAccess: canAccess,
        getFilteredNavStructure: getFilteredNavStructure,
        getBlockReason: getBlockReason,
        getCurrentType: getCurrentType,
        getTypeLabel: getTypeLabel,
        isInitialized: function() { return initialized; }
    };
})();

// Auto-inicializa
AtlasCapabilities.init();
