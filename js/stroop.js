// =============================================
// СТРОП — Stroop Interference Test
// =============================================
const STROOP_COLORS = [
    { name: 'КРАСНЫЙ', hex: '#ff006e' },
    { name: 'СИНИЙ', hex: '#00e5ff' },
    { name: 'ЗЕЛЁНЫЙ', hex: '#00ff88' },
    { name: 'ЖЁЛТЫЙ', hex: '#ffb703' }
];

let stroopState = {
    phase: 'idle',
    score: 0,
    errors: 0,
    record: 0,
    timerId: null,
    roundTimer: null,
    current: null,
    timeLeft: 60,
    round: 0
};

function renderStroop(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="stopStroop(); goBack('stroop', false)">
                ←
            </div>
            <h2 style="margin:0; color:var(--accent-pink);" class="glow-text">СТРОП</h2>
            <div style="font-weight:bold; color:var(--accent-yellow); font-size:18px;" id="stroopScore">0</div>
        </div>
        <div style="text-align:center; margin-top:25px;">
            <p style="font-size:13px; color:var(--text-secondary); margin-bottom:10px; line-height:1.5;">
                Нажимай кнопку с цветом <b style="color:var(--text-primary);">чернил</b>,<br>а не что написано!
            </p>

            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); border-radius:12px; padding:10px 20px; margin-bottom:20px;">
                <div style="font-size:13px; color:var(--text-secondary);">Правильно: <span id="stroopRight" style="color:var(--accent-green); font-weight:bold;">0</span></div>
                <div id="stroopTimerDisp" style="font-size:28px; font-weight:800; color:var(--text-primary);">60</div>
                <div style="font-size:13px; color:var(--text-secondary);">Ошибок: <span id="stroopErrors" style="color:var(--accent-pink); font-weight:bold;">0</span></div>
            </div>

            <div id="stroopWord" style="font-size:60px; font-weight:900; min-height:80px; display:flex; align-items:center; justify-content:center; margin-bottom:30px; letter-spacing:2px; transition:all 0.15s; text-shadow:0 0 30px currentColor;">
                ?
            </div>

            <div id="stroopBtns" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:320px; margin:0 auto 30px;"></div>

            <div style="display:flex; justify-content:center; gap:25px; font-size:14px; color:var(--text-secondary);">
                <div>Раунд: <span id="stroopRound" style="font-weight:bold; color:var(--text-primary);">0</span></div>
                <div>Рекорд: <span id="stroopRecord" style="font-weight:bold; color:var(--accent-yellow);">${stroopState.record}</span></div>
            </div>
        </div>
        <div style="position:absolute; bottom:30px; left:0; width:100%; padding:0 20px;">
            <button class="btn" id="stroopStartBtn" onclick="startStroop()" style="width:100%; background:rgba(255,0,110,0.1); border-color:rgba(255,0,110,0.3); color:var(--accent-pink);">
                ▶ Начать (60 секунд)
            </button>
        </div>
    `;
    buildStroopButtons();
}

function buildStroopButtons() {
    const btns = document.getElementById('stroopBtns');
    if (!btns) return;
    btns.innerHTML = STROOP_COLORS.map(c => `
        <button class="btn" onclick="stroopAnswer('${c.hex}')" id="sb_${c.hex.slice(1)}"
            style="font-size:15px; font-weight:700; padding:18px 10px; color:${c.hex}; border-color:${c.hex}33; background:${c.hex}11; pointer-events:none; opacity:0.4;">
            ${c.name}
        </button>
    `).join('');
}

function startStroop() {
    stroopState.phase = 'playing';
    stroopState.score = 0;
    stroopState.errors = 0;
    stroopState.round = 0;
    stroopState.timeLeft = 60;
    const startBtn = document.getElementById('stroopStartBtn');
    if (startBtn) startBtn.style.display = 'none';

    // Enable buttons
    document.querySelectorAll('#stroopBtns button').forEach(b => {
        b.style.pointerEvents = 'auto';
        b.style.opacity = '1';
    });

    stroopState.timerId = setInterval(() => {
        stroopState.timeLeft--;
        const tEl = document.getElementById('stroopTimerDisp');
        if (tEl) {
            tEl.innerText = stroopState.timeLeft;
            tEl.style.color = stroopState.timeLeft <= 10 ? 'var(--accent-pink)' : 'var(--text-primary)';
        }
        if (stroopState.timeLeft <= 0) {
            clearInterval(stroopState.timerId);
            endStroop();
        }
    }, 1000);

    nextStroopRound();
}

function nextStroopRound() {
    if (stroopState.phase !== 'playing') return;
    stroopState.round++;

    // Pick a random word and a DIFFERENT random ink color
    const wordIdx = Math.floor(Math.random() * STROOP_COLORS.length);
    let inkIdx = Math.floor(Math.random() * STROOP_COLORS.length);
    // For variety: 50% chance of mismatch
    if (Math.random() > 0.5) {
        while (inkIdx === wordIdx) inkIdx = Math.floor(Math.random() * STROOP_COLORS.length);
    }

    stroopState.current = { word: STROOP_COLORS[wordIdx].name, inkHex: STROOP_COLORS[inkIdx].hex };

    const wordEl = document.getElementById('stroopWord');
    if (wordEl) {
        wordEl.innerText = stroopState.current.word;
        wordEl.style.color = stroopState.current.inkHex;
    }
    const rEl = document.getElementById('stroopRound');
    if (rEl) rEl.innerText = stroopState.round;
}

function stroopAnswer(hex) {
    if (stroopState.phase !== 'playing' || !stroopState.current) return;

    const correct = hex === stroopState.current.inkHex;
    if (correct) {
        stroopState.score++;
        if (stroopState.score > stroopState.record) {
            stroopState.record = stroopState.score;
            saveScore('stroop', stroopState.score);
        }
        flashWord('var(--accent-green)');
    } else {
        stroopState.errors++;
        flashWord('var(--accent-pink)');
    }

    const sEl = document.getElementById('stroopScore');
    const rEl = document.getElementById('stroopRight');
    const eEl = document.getElementById('stroopErrors');
    const recEl = document.getElementById('stroopRecord');
    if (sEl) sEl.innerText = stroopState.score;
    if (rEl) rEl.innerText = stroopState.score;
    if (eEl) eEl.innerText = stroopState.errors;
    if (recEl) recEl.innerText = stroopState.record;

    setTimeout(nextStroopRound, 150);
}

function flashWord(color) {
    const el = document.getElementById('stroopWord');
    if (!el) return;
    const orig = el.style.color;
    el.style.background = color + '22';
    el.style.borderRadius = '12px';
    setTimeout(() => { el.style.background = 'transparent'; }, 150);
}

function endStroop() {
    stroopState.phase = 'idle';
    const wordEl = document.getElementById('stroopWord');
    if (wordEl) { wordEl.style.color = 'var(--accent-cyan)'; wordEl.innerText = `${stroopState.score} ✓`; }
    document.querySelectorAll('#stroopBtns button').forEach(b => { b.style.pointerEvents = 'none'; b.style.opacity = '0.4'; });
    const startBtn = document.getElementById('stroopStartBtn');
    if (startBtn) { startBtn.style.display = 'flex'; startBtn.innerHTML = '↺ Ещё раз'; }
}

function stopStroop() {
    clearInterval(stroopState.timerId);
    stroopState.phase = 'idle';
}
