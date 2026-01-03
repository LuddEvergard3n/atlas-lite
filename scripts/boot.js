/**
 * ATLAS Lite - Demo Boot Sequence
 * Inicialização simplificada para demonstração
 */

var AtlasBoot = (function() {
    'use strict';

    var BOOT_DURATION = 1500; // ms

    function start() {
        console.log('[Boot] Iniciando ATLAS Demo...');
        
        showBootScreen();
        
        // Animação de progresso
        var progress = document.querySelector('.boot-progress');
        var bootText = document.querySelector('.boot-text');
        
        if (progress) {
            progress.style.width = '0%';
        }
        
        var steps = [
            { progress: 30, text: 'Carregando módulos...' },
            { progress: 60, text: 'Preparando dados demo...' },
            { progress: 90, text: 'Inicializando interface...' },
            { progress: 100, text: 'Pronto!' }
        ];
        
        var stepDuration = BOOT_DURATION / steps.length;
        
        steps.forEach(function(step, index) {
            setTimeout(function() {
                if (progress) progress.style.width = step.progress + '%';
                if (bootText) bootText.textContent = step.text;
                
                if (index === steps.length - 1) {
                    // Último step - inicializa app
                    setTimeout(function() {
                        initializeApp();
                    }, 300);
                }
            }, stepDuration * index);
        });
    }
    
    function showBootScreen() {
        var bootScreen = document.getElementById('bootScreen');
        var app = document.getElementById('app');
        
        if (bootScreen) bootScreen.style.display = 'flex';
        if (app) app.style.display = 'none';
    }
    
    function hideBootScreen() {
        var bootScreen = document.getElementById('bootScreen');
        var app = document.getElementById('app');
        
        if (bootScreen) {
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                bootScreen.style.display = 'none';
            }, 300);
        }
        
        if (app) {
            app.style.display = 'flex';
            app.style.opacity = '0';
            setTimeout(function() {
                app.style.opacity = '1';
                app.style.transition = 'opacity 0.3s ease';
            }, 50);
        }
    }
    
    function initializeApp() {
        console.log('[Boot] Inicializando aplicação...');
        
        // Inicializa workspace
        if (typeof AtlasWorkspace !== 'undefined') {
            AtlasWorkspace.init();
        }
        
        // Inicializa Atlas
        if (typeof Atlas !== 'undefined') {
            Atlas.init();
        }
        
        // Inicializa Router
        if (typeof AtlasRouter !== 'undefined') {
            AtlasRouter.init();
        }
        
        // Esconde boot screen
        hideBootScreen();
        
        console.log('[Boot] ATLAS Demo pronto!');
    }

    // Auto-start quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    return {
        start: start
    };
})();
