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
    }, 1000);

    // 4. Console Clearing & Notification
    const warning = "ListV Security: Developer tools are disabled for security reasons.";
    const styles = "color: red; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 0px black;";

    // Attempt to keep console clean
    Object.defineProperty(window, 'console', {
        get: function () {
            if (window._console_blocked) return window._console_blocked;
            const block = {};
            ['log', 'info', 'warn', 'error', 'debug', 'dir', 'table'].forEach(m => {
                block[m] = () => {
                    // Optional: alert or redirect if they try to log
                };
            });
            window._console_blocked = block;
            console.log("%c" + warning, styles);
            return block;
        }
    });

})();
