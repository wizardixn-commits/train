// =============================================
// ПАРЫ — Memory Card Match
// =============================================
const PAIRS_EMOJIS = [
    '🧠', '🦁', '🐬', '🔥', '⚡', '💎', '🌟', '🎯',
    '🚀', '🌈', '🎸', '🏆', '🦋', '🌺', '🎨', '🔮'
];

let pairsState = {
    cards: [],
    flipped: [],
    matched: new Set(),
    moves: 0,
    level: 1,
    record: Infinity,
    phase: 'idle',
    lockBoard: false
};

function renderPairs(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('pairs', pairsState.phase === 'playing')">
                ←
            </div>
            <h2 style="margin:0; color:var(--accent-cyan);" class="glow-text">ПАРЫ</h2>
            <div style="font-weight:bold; color:var(--accent-yellow); font-size:16px;" id="pairsMoves">0 ходов</div>
        </div>
        <div style="text-align:center; margin-top:20px;">
            <p id="pairsMsg" style="font-size:15px; color:var(--text-secondary); margin-bottom:20px;">Найди все пары карточек</p>

            <div style="display:flex; justify-content:center; gap:8px; margin-bottom:20px;">
                ${[1, 2, 3].map(l => `
                    <button class="btn" onclick="startPairs(${l})" style="padding:8px 16px; font-size:13px;
                        ${l === pairsState.level ? 'background:rgba(0,229,255,0.15);border-color:rgba(0,229,255,0.4);color:var(--accent-cyan);' : ''}">
                        ${l === 1 ? '4×4' : l === 2 ? '4×5' : '4×6'}
                    </button>`).join('')}
            </div>

            <div id="pairsGrid" style="display:grid; gap:8px; max-width:340px; margin:0 auto 25px;"></div>

            <div style="display:flex; justify-content:center; gap:30px; color:var(--text-secondary); font-size:14px;">
                <div>Найдено: <span id="pairsFound" style="color:var(--accent-cyan); font-weight:bold;">0</span></div>
                <div>Рекорд: <span id="pairsRecord" style="color:var(--accent-yellow); font-weight:bold;">${pairsState.record === Infinity ? '—' : pairsState.record}</span></div>
            </div>
        </div>
    `;
    startPairs(pairsState.level);
}

function startPairs(level) {
    pairsState.level = level;
    pairsState.moves = 0;
    pairsState.flipped = [];
    pairsState.matched = new Set();
    pairsState.lockBoard = false;
    pairsState.phase = 'playing';

    const cols = 4;
    const pairs = level === 1 ? 8 : level === 2 ? 10 : 12;
    const emojis = PAIRS_EMOJIS.slice(0, pairs);
    pairsState.cards = shuffle([...emojis, ...emojis]).map((emoji, i) => ({ id: i, emoji, matched: false }));

    const grid = document.getElementById('pairsGrid');
    if (grid) {
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.innerHTML = '';
        pairsState.cards.forEach((card) => {
            const el = document.createElement('div');
            el.id = `pc${card.id}`;
            el.style.cssText = `
                aspect-ratio:1; border-radius:12px; cursor:pointer;
                background:var(--card-bg); border:1px solid var(--card-border);
                display:flex; align-items:center; justify-content:center;
                font-size:${level === 3 ? 20 : 24}px;
                transition:all 0.25s; user-select:none;
                backface-visibility:hidden;
            `;
            el.innerText = '?';
            el.onclick = () => flipPairCard(card.id);
            grid.appendChild(el);
        });
    }
    updatePairsUI();
}

function flipPairCard(id) {
    if (pairsState.lockBoard || pairsState.phase !== 'playing') return;
    if (pairsState.flipped.includes(id)) return;
    if (pairsState.matched.has(id)) return;

    pairsState.flipped.push(id);
    const card = pairsState.cards[id];
    const el = document.getElementById(`pc${id}`);
    if (el) {
        el.innerText = card.emoji;
        el.style.background = 'rgba(0,229,255,0.1)';
        el.style.borderColor = 'rgba(0,229,255,0.4)';
    }

    if (pairsState.flipped.length === 2) {
        pairsState.moves++;
        pairsState.lockBoard = true;
        const [a, b] = pairsState.flipped;
        const cardA = pairsState.cards[a];
        const cardB = pairsState.cards[b];

        if (cardA.emoji === cardB.emoji) {
            // Match
            pairsState.matched.add(a);
            pairsState.matched.add(b);
            [a, b].forEach(i => {
                const e = document.getElementById(`pc${i}`);
                if (e) { e.style.background = 'rgba(0,255,136,0.15)'; e.style.borderColor = 'rgba(0,255,136,0.4)'; e.onclick = null; }
            });
            pairsState.flipped = [];
            pairsState.lockBoard = false;

            if (pairsState.matched.size === pairsState.cards.length) {
                // Win
                if (pairsState.moves < (pairsState.record === Infinity ? 9999 : pairsState.record)) {
                    pairsState.record = pairsState.moves;
                    saveScore('pairs', pairsState.moves);
                }
                const msg = document.getElementById('pairsMsg');
                if (msg) { msg.innerText = `🎉 Все пары найдены за ${pairsState.moves} ходов!`; msg.style.color = 'var(--accent-green)'; }
            }
        } else {
            // No match
            [a, b].forEach(i => {
                const e = document.getElementById(`pc${i}`);
                if (e) { e.style.background = 'rgba(255,0,110,0.08)'; e.style.borderColor = 'rgba(255,0,110,0.3)'; }
            });
            setTimeout(() => {
                [a, b].forEach(i => {
                    const e = document.getElementById(`pc${i}`);
                    if (e) { e.innerText = '?'; e.style.background = 'var(--card-bg)'; e.style.borderColor = 'var(--card-border)'; }
                });
                pairsState.flipped = [];
                pairsState.lockBoard = false;
            }, 900);
        }
        updatePairsUI();
    }
}

function updatePairsUI() {
    const mEl = document.getElementById('pairsMoves');
    const fEl = document.getElementById('pairsFound');
    const rEl = document.getElementById('pairsRecord');
    if (mEl) mEl.innerText = `${pairsState.moves} ходов`;
    if (fEl) fEl.innerText = pairsState.matched.size / 2;
    if (rEl) rEl.innerText = pairsState.record === Infinity ? '—' : pairsState.record;
}
