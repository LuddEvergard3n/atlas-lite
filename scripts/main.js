/**
 * ATLAS Lite - Demo Main
 */

var Atlas = {
    version: '5.0.0-demo',
    theme: 'dark',
    
    init: function() {
        Atlas.setTheme('dark');
        Atlas.renderWorkspaceSelector();
        Atlas.renderHeader();
        
        console.log('[Atlas Demo] v' + Atlas.version + ' initialized');
    },
    
    navigate: function(viewId) {
        if (typeof AtlasRouter !== 'undefined') {
            AtlasRouter.navigate(viewId);
        }
    },
    
    setTheme: function(newTheme) {
        Atlas.theme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
    },
    
    toggleTheme: function() {
        Atlas.setTheme(Atlas.theme === 'dark' ? 'light' : 'dark');
    },
    
    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    },
    
    renderWorkspaceSelector: function() {
        var container = document.getElementById('workspaceSelector');
        if (!container || typeof AtlasWorkspace === 'undefined') return;
        container.innerHTML = AtlasWorkspace.renderSelector();
    },
    
    renderHeader: function() {
        var header = document.getElementById('header');
        if (!header) return;
        
        header.innerHTML = '<div class="header-left">' +
            '<button class="icon-btn" onclick="Atlas.toggleSidebar()" title="Menu">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                    '<line x1="3" y1="12" x2="21" y2="12"></line>' +
                    '<line x1="3" y1="6" x2="21" y2="6"></line>' +
                    '<line x1="3" y1="18" x2="21" y2="18"></line>' +
                '</svg>' +
            '</button>' +
            '<span class="header-title" id="headerTitle">Dashboard</span>' +
        '</div>' +
        '<div class="header-center">' +
            '<span class="header-workspace">Demo <span class="demo-badge">DEMO</span></span>' +
        '</div>' +
        '<div class="header-right">' +
            '<button class="icon-btn" onclick="AtlasState.resetDemo(); AtlasRouter.navigate(\'dashboard\'); Atlas.toast(\'Dados resetados!\', \'success\');" title="Resetar Demo">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                    '<polyline points="1 4 1 10 7 10"></polyline>' +
                    '<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>' +
                '</svg>' +
            '</button>' +
            '<button class="icon-btn" onclick="Atlas.toggleTheme()" title="Alternar Tema">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                    '<circle cx="12" cy="12" r="5"></circle>' +
                    '<line x1="12" y1="1" x2="12" y2="3"></line>' +
                    '<line x1="12" y1="21" x2="12" y2="23"></line>' +
                    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>' +
                    '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>' +
                    '<line x1="1" y1="12" x2="3" y2="12"></line>' +
                    '<line x1="21" y1="12" x2="23" y2="12"></line>' +
                    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>' +
                    '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' +
                '</svg>' +
            '</button>' +
            '<button class="icon-btn" onclick="Atlas.toggleFullscreen()" title="Tela Cheia">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">' +
                    '<polyline points="15 3 21 3 21 9"></polyline>' +
                    '<polyline points="9 21 3 21 3 15"></polyline>' +
                    '<line x1="21" y1="3" x2="14" y2="10"></line>' +
                    '<line x1="3" y1="21" x2="10" y2="14"></line>' +
                '</svg>' +
            '</button>' +
        '</div>';
    },
    
    toggleSidebar: function() {
        var sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.toggle('open');
    },
    
    setHeaderTitle: function(title) {
        var el = document.getElementById('headerTitle');
        if (el) el.textContent = title;
    },
    
    formatCurrency: function(value, currency) {
        try {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: currency || 'BRL'
            }).format(value);
        } catch (e) {
            return 'R$ ' + value.toFixed(2);
        }
    },
    
    formatCompact: function(value) {
        if (Math.abs(value) >= 1e9) return (value / 1e9).toFixed(2) + 'B';
        if (Math.abs(value) >= 1e6) return (value / 1e6).toFixed(2) + 'M';
        if (Math.abs(value) >= 1e3) return (value / 1e3).toFixed(1) + 'K';
        return value.toFixed(0);
    },
    
    formatDate: function(date, format) {
        if (!date) return '';
        var d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('pt-BR');
    },
    
    formatPercent: function(value, decimals) {
        decimals = decimals !== undefined ? decimals : 1;
        return value.toFixed(decimals) + '%';
    },
    
    generateId: function(prefix) {
        prefix = prefix || 'id';
        return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    },
    
    debounce: function(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    },
    
    toast: function(message, type) {
        type = type || 'info';
        
        var toast = document.createElement('div');
        toast.className = 'atlas-toast atlas-toast-' + type;
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--bg-tertiary);color:var(--text);padding:12px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10002;opacity:0;transition:opacity 0.3s;';
        
        if (type === 'success') toast.style.borderLeft = '4px solid var(--success)';
        if (type === 'error') toast.style.borderLeft = '4px solid var(--danger)';
        
        document.body.appendChild(toast);
        
        setTimeout(function() { toast.style.opacity = '1'; }, 10);
        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }
};
