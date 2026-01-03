/**
 * ATLAS Lite - Demo Workspace
 * Workspace único de demonstração
 */

var AtlasWorkspace = (function() {
    
    var demoWorkspace = {
        id: 'demo',
        name: 'Demo',
        type: 'demo',
        createdAt: new Date().toISOString(),
        color: '#6b9ebe'
    };
    
    function getCurrent() {
        return demoWorkspace;
    }
    
    function list() {
        return [demoWorkspace];
    }
    
    function switchTo(id) {
        // Sempre retorna o workspace demo
        console.log('[Demo] Workspace único - não é possível trocar');
        return demoWorkspace;
    }
    
    function create(name, type) {
        console.log('[Demo] Criação de workspace desabilitada na versão demo');
        return null;
    }
    
    function remove(id) {
        console.log('[Demo] Remoção de workspace desabilitada na versão demo');
        return false;
    }
    
    function update(id, data) {
        console.log('[Demo] Atualização de workspace desabilitada na versão demo');
        return false;
    }
    
    function renderSelector() {
        return '<div class="workspace-selector demo-workspace">' +
            '<div class="workspace-current">' +
            '<span class="workspace-icon" style="background:' + demoWorkspace.color + '">D</span>' +
            '<span class="workspace-name">Demo</span>' +
            '<span class="demo-badge">DEMO</span>' +
            '</div>' +
            '</div>';
    }
    
    function init() {
        console.log('[Demo] Workspace Demo inicializado');
        
        // Renderiza o seletor no header se existir
        var container = document.getElementById('workspaceSelector');
        if (container) {
            container.innerHTML = renderSelector();
        }
    }
    
    return {
        init: init,
        getCurrent: getCurrent,
        list: list,
        switch: switchTo,
        create: create,
        delete: remove,
        update: update,
        renderSelector: renderSelector,
        isDemo: function() { return true; }
    };
})();
