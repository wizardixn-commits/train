const routes = {
    'login': renderLogin,
    'dashboard': renderDashboard,
    'matrix': renderMatrix,
    'flow': renderFlow,
    'flasks': renderFlasks,
    'numbers': renderNumbers,
    'reaction': renderReaction,
    'math': renderMath,
    'schulte': renderSchulte,
    'pairs': renderPairs,
    'stroop': renderStroop,
    'simon': renderSimon,
    'body': renderBody,
    'soul': renderSoul,
    'domino': renderDomino,
    'emoji': renderEmoji,
    'solfeggio': renderSolfeggio
};

let currentView = 'dashboard';

function navigate(viewName) {
    if (!routes[viewName]) return;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    let viewEl = document.getElementById(viewName);
    if (!viewEl) {
        viewEl = document.createElement('div');
        viewEl.id = viewName;
        viewEl.className = 'view';
        document.getElementById('app').appendChild(viewEl);
    }
    viewEl.classList.add('active');
    currentView = viewName;
    routes[viewName](viewEl);
    window.scrollTo(0, 0);
}

/* ── Theme ── */
function initTheme() {
    const saved = localStorage.getItem('trainbrain_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('trainbrain_theme', next);
    // Update toggle icon if visible
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerText = next === 'dark' ? '☀️' : '🌙';
}

function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAuth();
    if (getUser()) {
        navigate('dashboard');
    } else {
        navigate('login');
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => { });
    });
}
