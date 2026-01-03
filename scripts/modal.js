/**
 * ATLAS v5.0 - Sistema de Modais
 * Versão simplificada e robusta
 */

var AtlasModal = (function() {
    'use strict';
    
    var pendingCallback = null;
    
    // Fecha qualquer modal aberto
    function close() {
        var overlay = document.getElementById('atlasModalOverlay');
        if (overlay) {
            overlay.remove();
        }
        // Executa callback pendente
        if (pendingCallback) {
            var cb = pendingCallback;
            pendingCallback = null;
            setTimeout(cb, 50);
        }
    }
    
    // Abre modal customizado
    function open(options) {
        close();
        
        var overlay = document.createElement('div');
        overlay.id = 'atlasModalOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:10000;';
        
        // Fecha ao clicar no overlay
        overlay.onclick = function(e) {
            if (e.target === overlay) close();
        };
        
        var sizeWidth = options.size === 'small' ? '380px' : options.size === 'large' ? '640px' : '480px';
        
        var modal = document.createElement('div');
        modal.style.cssText = 'background:var(--bg-secondary,#1e293b);border-radius:12px;width:' + sizeWidth + ';max-width:90vw;max-height:85vh;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.5);';
        
        // Header
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border,#334155);';
        header.innerHTML = '<span style="font-weight:600;font-size:1.1rem;color:var(--text,#fff)">' + (options.title || '') + '</span>';
        
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'background:none;border:none;color:var(--text-muted,#94a3b8);font-size:24px;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;';
        closeBtn.onclick = close;
        header.appendChild(closeBtn);
        
        // Body
        var body = document.createElement('div');
        body.style.cssText = 'padding:20px;color:var(--text,#fff);max-height:60vh;overflow-y:auto;';
        body.innerHTML = options.content || '';
        
        modal.appendChild(header);
        modal.appendChild(body);
        
        // Footer com botões
        if (options.buttons && options.buttons.length > 0) {
            var footer = document.createElement('div');
            footer.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;padding:16px 20px;border-top:1px solid var(--border,#334155);';
            
            options.buttons.forEach(function(btnConfig) {
                var btn = document.createElement('button');
                btn.textContent = btnConfig.text;
                
                var bgColor = btnConfig.variant === 'primary' ? 'var(--accent,#6b9ebe)' :
                              btnConfig.variant === 'danger' ? 'var(--danger,#ef4444)' :
                              'var(--bg-tertiary,#334155)';
                
                btn.style.cssText = 'padding:10px 18px;border:none;border-radius:6px;font-size:0.9rem;font-weight:500;cursor:pointer;background:' + bgColor + ';color:white;';
                
                btn.onclick = function() {
                    if (typeof btnConfig.onClick === 'function') {
                        btnConfig.onClick();
                    }
                };
                
                footer.appendChild(btn);
            });
            
            modal.appendChild(footer);
        }
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Foca primeiro input
        setTimeout(function() {
            var input = modal.querySelector('input,textarea,select');
            if (input) input.focus();
        }, 100);
    }
    
    // Alert simples
    function alert(message, title) {
        open({
            title: title || 'Aviso',
            size: 'small',
            content: '<div style="text-align:center;padding:1rem 0">' +
                '<div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:var(--bg-tertiary,#334155);display:flex;align-items:center;justify-content:center">' +
                '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent,#6b9ebe)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
                '</div>' +
                '<p style="margin:0;font-size:1rem">' + message + '</p>' +
            '</div>',
            buttons: [{ text: 'OK', variant: 'primary', onClick: close }]
        });
    }
    
    // Sucesso com callback opcional
    function success(message, title, callback) {
        if (typeof callback === 'function') {
            pendingCallback = callback;
        }
        open({
            title: title || 'Sucesso',
            size: 'small',
            content: '<div style="text-align:center;padding:1rem 0">' +
                '<div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:rgba(34,197,94,0.15);display:flex;align-items:center;justify-content:center">' +
                '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
                '</div>' +
                '<p style="margin:0;font-size:1rem;color:#22c55e">' + message + '</p>' +
            '</div>',
            buttons: [{ text: 'OK', variant: 'primary', onClick: close }]
        });
    }
    
    // Erro
    function error(message, title) {
        open({
            title: title || 'Erro',
            size: 'small',
            content: '<div style="text-align:center;padding:1rem 0">' +
                '<div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:rgba(239,68,68,0.15);display:flex;align-items:center;justify-content:center">' +
                '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' +
                '</div>' +
                '<p style="margin:0;font-size:1rem;color:#ef4444">' + message + '</p>' +
            '</div>',
            buttons: [{ text: 'OK', variant: 'primary', onClick: close }]
        });
    }
    
    // Confirmação
    function confirm(message, onConfirm, onCancel) {
        open({
            title: 'Confirmar',
            size: 'small',
            content: '<div style="text-align:center;padding:1rem 0">' +
                '<div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:var(--bg-tertiary,#334155);display:flex;align-items:center;justify-content:center">' +
                '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent,#6b9ebe)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
                '</div>' +
                '<p style="margin:0;font-size:1rem">' + message + '</p>' +
            '</div>',
            buttons: [
                { 
                    text: 'Cancelar', 
                    variant: 'secondary', 
                    onClick: function() { 
                        close(); 
                        if (typeof onCancel === 'function') onCancel(); 
                    } 
                },
                { 
                    text: 'Confirmar', 
                    variant: 'primary', 
                    onClick: function() { 
                        close(); 
                        if (typeof onConfirm === 'function') onConfirm(); 
                    } 
                }
            ]
        });
    }
    
    // Confirmação de exclusão
    function confirmDelete(itemName, onConfirm, onCancel) {
        open({
            title: 'Excluir',
            size: 'small',
            content: '<div style="text-align:center;padding:1rem 0">' +
                '<div style="width:56px;height:56px;margin:0 auto 16px;border-radius:50%;background:rgba(239,68,68,0.15);display:flex;align-items:center;justify-content:center">' +
                '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>' +
                '</div>' +
                '<p style="margin:0;font-size:1rem">Deseja excluir <strong>"' + itemName + '"</strong>?</p>' +
                '<p style="margin:8px 0 0;font-size:0.85rem;color:#ef4444">Esta ação não pode ser desfeita.</p>' +
            '</div>',
            buttons: [
                { 
                    text: 'Cancelar', 
                    variant: 'secondary', 
                    onClick: function() { 
                        close(); 
                        if (typeof onCancel === 'function') onCancel(); 
                    } 
                },
                { 
                    text: 'Excluir', 
                    variant: 'danger', 
                    onClick: function() { 
                        close(); 
                        if (typeof onConfirm === 'function') onConfirm(); 
                    } 
                }
            ]
        });
    }
    
    return {
        open: open,
        close: close,
        alert: alert,
        success: success,
        error: error,
        confirm: confirm,
        confirmDelete: confirmDelete
    };
})();
