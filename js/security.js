(function () {
    'use strict';

    // 1. Disable Right Click
    document.addEventListener('contextmenu', e => e.preventDefault());

    // 2. Disable Common Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    document.onkeydown = function (e) {
        if (
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
            (e.ctrlKey && e.keyCode === 85) // Ctrl+U
        ) {
            return false;
        }
    };

    // 3. Debugger Loop (Detects if DevTools is open and breaks performance)
    setInterval(function () {
        (function (a) {
            return (function (a) {
                return (Function('Function(arguments[0])(arguments[1])')(a, a));
            })(function (a) {
                if (a === 'bugger') {
                    return function (b) { }.constructor('de' + a).apply('stateObject');
                } else {
                    return function (b) { }(a);
                }
            });
        })('bugger');
    }, 4000); // Increased interval to 4s for better performance

    // Attempt to keep console clean without breaking other scripts
    try {
        const warning = "ListV Security: Developer tools are disabled.";
        const styles = "color: red; font-size: 20px; font-weight: bold;";

        let blockedConsole = {};
        ['log', 'info', 'warn', 'error', 'debug', 'dir', 'table'].forEach(m => {
            blockedConsole[m] = () => { };
        });

        Object.defineProperty(window, 'console', {
            get: function () {
                return blockedConsole;
            },
            set: function (val) {
                // Allow setting but ignore it to prevent "only a getter" errors
            },
            configurable: true
        });
    } catch (e) {
        console.warn("Security check limited.");
    }

})();
