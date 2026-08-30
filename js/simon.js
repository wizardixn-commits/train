// =============================================
// СИМОН — Simon Says pattern memory
// =============================================
const SIMON_COLORS = [
    { id: 0, color: '#00ff88', shadow: 'rgba(0,255,136,0.6)' },
    { id: 1, color: '#00e5ff', shadow: 'rgba(0,229,255,0.6)' },
    { id: 2, color: '#ff006e', shadow: 'rgba(255,0,110,0.6)' },
    { id: 3, color: '#ffb703', shadow: 'rgba(255,183,3,0.6)' }
];

let simonState = {
    pattern: [],
    userIdx: 0,
    level: 0,
    record: 0,
    phase: 'idle',
    locked: false
};

function renderSimon(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('simon', simonState.phase === 'playing')">
                ←
            </div>
            <h2 style="margin:0; color:var(--accent-green);" class="glow-text">СИМОН</h2>
            <div id="simonScore" style="font-weight:bold; color:var(--accent-yellow); font-size:18px;">0</div>
        </div>
        <div style="text-align:center; margin-top:30px;">
            <p id="simonMsg" style="font-size:15px; color:var(--text-secondary); margin-bottom:30px;">Запоминай и повторяй последовательность</p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:280px; margin:0 auto 35px;">
                ${SIMON_COLORS.map(c => `
                    <div id="simon${c.id}" onclick="simonTap(${c.id})"
                        style="aspect-ratio:1; border-radius:20px; background:${c.color}22; border:2px solid ${c.color}55;
                        cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center;">
                    </div>
                `).join('')}
            </div>

            <div style="display:flex; justify-content:center; gap:30px; font-size:14px; color:var(--text-secondary);">
                <div>Уровень: <span id="simonLevel" style="color:var(--accent-green); font-weight:bold; font-size:18px;">0</span></div>
                <div>Рекорд: <span id="simonRecord" style="color:var(--accent-yellow); font-weight:bold; font-size:18px;">${simonState.record}</span></div>
            </div>
        </div>
        <div style="position:absolute; bottom:30px; left:0; width:100%; padding:0 20px;">
            <button class="btn" id="simonStartBtn" onclick="startSimon()" style="width:100%; background:rgba(0,255,136,0.1); border-color:rgba(0,255,136,0.3); color:var(--accent-green);">
                ▶ Старт
            </button>
        </div>
    `;
}

function startSimon() {
    simonState.pattern = [];
    simonState.level = 0;
    simonState.userIdx = 0;
    simonState.phase = 'playing';
    const btn = document.getElementById('simonStartBtn');
    if (btn) btn.style.display = 'none';
    simonNextLevel();
}

function simonNextLevel() {
    simonState.level++;
    simonState.userIdx = 0;
    simonState.locked = true;
    simonState.pattern.push(Math.floor(Math.random() * 4));
    const msg = document.getElementById('simonMsg');
    if (msg) { msg.innerText = 'Смотри и запоминай...'; msg.style.color = 'var(--text-secondary)'; }
    updateSimonUI();

    const speed = Math.max(300, 700 - simonState.level * 30);
    let i = 0;
    function next() {
        if (i > 0) simonFlash(simonState.pattern[i - 1], false);
        if (i >= simonState.pattern.length) {
            simonState.locked = false;
            if (msg) { msg.innerText = 'Твоя очередь!'; msg.style.color = 'var(--accent-green)'; }
            return;
        }
        setTimeout(() => {
            simonFlash(simonState.pattern[i], true);
            i++;
            setTimeout(next, speed);
        }, speed / 2);
    }
    setTimeout(next, 600);
}

function simonFlash(id, on) {
    const el = document.getElementById(`simon${id}`);
    const c = SIMON_COLORS[id];
    if (!el) return;
    if (on) {
        el.style.background = c.color;
        el.style.boxShadow = `0 0 30px ${c.shadow}`;
        el.style.borderColor = c.color;
    } else {
        el.style.background = c.color + '22';
        el.style.boxShadow = 'none';
        el.style.borderColor = c.color + '55';
    }
}

function simonTap(id) {
    if (simonState.locked || simonState.phase !== 'playing') return;

    simonFlash(id, true);
    setTimeout(() => simonFlash(id, false), 200);

    if (id === simonState.pattern[simonState.userIdx]) {
        simonState.userIdx++;
        if (simonState.userIdx >= simonState.pattern.length) {
            // Round complete
            if (simonState.level > simonState.record) {
                simonState.record = simonState.level;
                saveScore('simon', simonState.record);
            }
            const msg = document.getElementById('simonMsg');
            if (msg) { msg.innerText = 'Отлично! +1 цвет!'; msg.style.color = 'var(--accent-cyan)'; }
            setTimeout(simonNextLevel, 1000);
        }
    } else {
        // Wrong
        simonState.phase = 'idle';
        simonState.locked = true;
        const msg = document.getElementById('simonMsg');
        if (msg) { msg.innerText = `Ошибка! Уровень ${simonState.level - 1}`; msg.style.color = 'var(--accent-pink)'; }
        // Flash all red
        SIMON_COLORS.forEach(c => {
            const el = document.getElementById(`simon${c.id}`);
            if (el) { el.style.background = '#ff006e33'; el.style.boxShadow = '0 0 15px rgba(255,0,110,0.3)'; }
            setTimeout(() => { if (el) { el.style.background = c.color + '22'; el.style.boxShadow = 'none'; } }, 800);
        });
        const btn = document.getElementById('simonStartBtn');
        if (btn) { btn.style.display = 'flex'; btn.innerHTML = '↺ Заново'; }
    }
    updateSimonUI();
}

function updateSimonUI() {
    const lvl = document.getElementById('simonLevel');
    const rec = document.getElementById('simonRecord');
    const score = document.getElementById('simonScore');
    if (lvl) lvl.innerText = simonState.level;
    if (rec) rec.innerText = simonState.record;
    if (score) score.innerText = simonState.level;
}
