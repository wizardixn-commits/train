const routes = {
    'login': renderLogin,
    'dashboard': renderDashboard,
    'matrix': renderMatrix,
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

/* ── Back from game: show overlay so user can go to settings or main menu ── */
function goBack(gameName, isPlaying) {
    if (!isPlaying) {
        navigate('dashboard');
        return;
    }
    // Show pause overlay
    let overlay = document.getElementById('backOverlay');
    if (overlay) { overlay.remove(); return; }
    overlay = document.createElement('div');
    overlay.id = 'backOverlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'background:rgba(0,0,0,0.78)', 'backdrop-filter:blur(10px)',
        'display:flex', 'flex-direction:column',
        'align-items:center', 'justify-content:center',
        'gap:14px', 'padding:32px'
    ].join(';');
    overlay.innerHTML = `
        <div style="font-size:32px;margin-bottom:4px;">⏸️</div>
        <div style="font-size:19px;font-weight:800;color:#fff;margin-bottom:2px;">Игра на паузе</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:16px;text-align:center;">Куда хочешь перейти?</div>
        <button class="btn" id="backToSettings"
            style="width:100%;max-width:280px;background:rgba(0,255,136,0.12);border-color:rgba(0,255,136,0.3);color:var(--accent-green);font-size:15px;padding:14px;">
            ↩ К настройкам игры
        </button>
        <button class="btn" id="backToDash"
            style="width:100%;max-width:280px;background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);color:var(--text-secondary);font-size:15px;padding:14px;">
            🏠 На главный экран
        </button>
        <button onclick="document.getElementById('backOverlay').remove()"
            style="margin-top:6px;background:none;border:none;color:rgba(255,255,255,0.3);font-size:13px;cursor:pointer;font-family:inherit;padding:8px 20px;">
            ← Продолжить игру
        </button>
    `;
    document.body.appendChild(overlay);
    document.getElementById('backToSettings').onclick = () => {
        overlay.remove();
        navigate(gameName);
    };
    document.getElementById('backToDash').onclick = () => {
        overlay.remove();
        navigate('dashboard');
    };
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
