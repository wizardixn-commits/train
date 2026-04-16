// =============================================
// AUTH — User profile with localStorage
// =============================================

const AUTH_KEY = 'trainbrain_user';
const SCORES_KEY = 'trainbrain_scores';

let currentUser = null;

function initAuth() {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
        currentUser = JSON.parse(stored);
    }
}

function getUser() { return currentUser; }

function saveUser(name, avatar) {
    currentUser = { name, avatar, joinedAt: currentUser?.joinedAt || Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    navigate('login');
}

// Scores per game: store best values
function saveScore(game, value) {
    if (!currentUser) return;
    const scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '{}');
    const userKey = currentUser.name;
    if (!scores[userKey]) scores[userKey] = {};
    const prev = scores[userKey][game];
    // For most games higher is better, for 'flasks' lower moves is better
    const lowerBetter = ['flasks', 'schulte', 'reaction'];
    if (prev === undefined || (lowerBetter.includes(game) ? value < prev : value > prev)) {
        scores[userKey][game] = value;
    }
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

function getUserScores() {
    if (!currentUser) return {};
    return JSON.parse(localStorage.getItem(SCORES_KEY) || '{}')?.[currentUser.name] || {};
}

function getAllRankings(game) {
    const scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '{}');
    const lowerBetter = ['flasks', 'schulte', 'reaction'];
    return Object.entries(scores)
        .filter(([, s]) => s[game] !== undefined)
        .map(([name, s]) => ({ name, score: s[game] }))
        .sort((a, b) => lowerBetter.includes(game) ? a.score - b.score : b.score - a.score);
}

// =============================================
// LOGIN VIEW
// =============================================
const AVATARS = ['🧠', '🦁', '🐺', '🦊', '🐬', '🦅', '🐉', '🌟', '⚡', '🔥', '🎯', '💎'];

function renderLogin(container) {
    const avatarGrid = AVATARS.map((av, i) => `
        <div class="av-opt" data-av="${av}" onclick="selectAvatar('${av}')"
            style="font-size: 32px; width: 56px; height: 56px; border-radius: 14px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.06); transition: all 0.2s;">
            ${av}
        </div>
    `).join('');

    container.innerHTML = `
        <div style="text-align: center; padding-top: 60px;">
            <h1 style="color: var(--accent-cyan); font-size: 32px; margin-bottom: 8px;" class="glow-text">НЕЙРО СТАРТ</h1>
            <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 50px;">Тренируй мозг и тело</p>

            <div id="loginSelectedAv" style="font-size: 60px; margin-bottom: 20px; cursor:pointer;">🧠</div>

            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; max-width: 380px; margin: 0 auto 30px;">
                ${avatarGrid}
            </div>

            <div style="max-width: 320px; margin: 0 auto 30px;">
                <input id="loginName" type="text" maxlength="18" placeholder="Твоё имя..." autocomplete="off"
                    style="width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px 20px; font-size: 18px; font-family: Outfit, sans-serif; color: #fff; outline: none; text-align: center; caret-color: var(--accent-cyan);">
            </div>

            <button class="btn" onclick="doLogin()" style="width: 100%; max-width: 320px; background: rgba(0,229,255,0.12); border-color: rgba(0,229,255,0.3); color: var(--accent-cyan); font-size: 18px; padding: 18px;">
                → Войти
            </button>

            <p style="margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.2);">Данные хранятся локально на устройстве</p>
        </div>
    `;

    // Select first avatar
    selectAvatar('🧠');

    // Enter key
    document.getElementById('loginName').addEventListener('keydown', e => {
        if (e.key === 'Enter') doLogin();
    });
}

let _selectedAvatar = '🧠';
function selectAvatar(av) {
    _selectedAvatar = av;
    document.querySelectorAll('.av-opt').forEach(el => {
        el.style.borderColor = el.dataset.av === av ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.06)';
        el.style.background = el.dataset.av === av ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.03)';
    });
    const disp = document.getElementById('loginSelectedAv');
    if (disp) disp.innerText = av;
}

function doLogin() {
    const name = (document.getElementById('loginName')?.value || '').trim();
    if (!name) {
        const inp = document.getElementById('loginName');
        if (inp) { inp.style.borderColor = 'rgba(255,0,110,0.5)'; setTimeout(() => inp.style.borderColor = 'rgba(255,255,255,0.1)', 800); }
        return;
    }
    saveUser(name, _selectedAvatar);
    navigate('dashboard');
}
