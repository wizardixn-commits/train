// =============================================
// ТАБЛИЦА ШУЛЬТЕ — Schulte Attention Table
// =============================================
let schulteState = {
    size: 5,
    numbers: [],
    current: 1,
    startTime: 0,
    phase: 'idle',
    bestTime: 0,
    level: 1
};

function renderSchulte(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="stopSchulte(); goBack('schulte', false)">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-purple);" class="glow-text">ШУЛЬТЕ</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 16px;" id="schulteTimer">—</div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <p id="schulteMsg" style="font-size: 15px; font-weight: bold; margin-bottom: 25px; color: var(--text-secondary);">Найди числа от 1 до 25 по порядку</p>

            <div id="schulteGrid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; max-width: 340px; margin: 0 auto; margin-bottom: 25px;">
            </div>
            
            <div style="display: flex; justify-content: center; gap: 30px; color: var(--text-secondary); font-size: 14px; margin-bottom: 30px;">
                <div>Следующее: <span id="schulteNext" style="color: var(--accent-purple); font-weight: bold; font-size: 20px;">—</span></div>
                <div>Лучшее: <span id="schulteBest" style="color: var(--accent-yellow); font-weight: bold;">—</span></div>
            </div>
        </div>
        <div style="position: absolute; bottom: 30px; left: 0; width: 100%; padding: 0 20px;">
            <button class="btn" id="schulteStartBtn" onclick="startSchulte()" style="width: 100%; background: rgba(157,78,221,0.1); border-color: rgba(157,78,221,0.2); color: var(--accent-purple);">
                ▶ Старт
            </button>
        </div>
    `;
}

function startSchulte() {
    schulteState.numbers = shuffle25();
    schulteState.current = 1;
    schulteState.phase = 'playing';
    schulteState.startTime = Date.now();

    const startBtn = document.getElementById('schulteStartBtn');
    if (startBtn) startBtn.style.display = 'none';
    const msg = document.getElementById('schulteMsg');
    if (msg) { msg.innerText = 'Найди числа от 1 до 25 по порядку!'; msg.style.color = 'var(--text-primary)'; }

    renderSchulteGrid();
    updateSchulteNext();
    startSchulteTimer();
}

function shuffle25() {
    const arr = Array.from({ length: 25 }, (_, i) => i + 1);
    return arr.sort(() => Math.random() - 0.5);
}

function renderSchulteGrid() {
    const grid = document.getElementById('schulteGrid');
    if (!grid) return;
    grid.innerHTML = '';
    schulteState.numbers.forEach((num) => {
        const cell = document.createElement('div');
        cell.className = 'schulte-cell';
        cell.dataset.num = num;
        cell.innerText = num;
        cell.style.cssText = `
            aspect-ratio: 1;
            background: rgba(20, 20, 35, 0.8);
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.04);
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; font-weight: 700; cursor: pointer;
            transition: all 0.15s;
        `;
        cell.onclick = () => handleSchulteClick(num, cell);
        grid.appendChild(cell);
    });
}

let schulteTimerId;
function startSchulteTimer() {
    clearInterval(schulteTimerId);
    schulteTimerId = setInterval(() => {
        if (schulteState.phase !== 'playing') { clearInterval(schulteTimerId); return; }
        const elapsed = ((Date.now() - schulteState.startTime) / 1000).toFixed(1);
        const tEl = document.getElementById('schulteTimer');
        if (tEl) tEl.innerText = `${elapsed}с`;
    }, 100);
}

function handleSchulteClick(num, cell) {
    if (schulteState.phase !== 'playing') return;

    if (num === schulteState.current) {
        // Correct
        cell.style.background = 'rgba(0,255,136,0.15)';
        cell.style.borderColor = 'rgba(0,255,136,0.4)';
        cell.style.color = 'var(--accent-green)';
        cell.onclick = null;
        cell.style.cursor = 'default';
        schulteState.current++;

        if (schulteState.current > 25) {
            // Win!
            clearInterval(schulteTimerId);
            schulteState.phase = 'idle';
            const elapsed = ((Date.now() - schulteState.startTime) / 1000).toFixed(1);
            if (schulteState.bestTime === 0 || parseFloat(elapsed) < schulteState.bestTime) {
                schulteState.bestTime = parseFloat(elapsed);
                saveScore('schulte', parseFloat(elapsed));
                const bEl = document.getElementById('schulteBest');
                if (bEl) bEl.innerText = `${elapsed}с`;
            }
            const tEl = document.getElementById('schulteTimer');
            if (tEl) { tEl.innerText = `${elapsed}с`; tEl.style.color = 'var(--accent-green)'; }
            const msg = document.getElementById('schulteMsg');
            if (msg) { msg.innerText = `Отлично! ${elapsed} секунд!`; msg.style.color = 'var(--accent-green)'; }
            const startBtn = document.getElementById('schulteStartBtn');
            if (startBtn) { startBtn.style.display = 'flex'; startBtn.innerHTML = '↺ Ещё раз'; }
            const nextEl = document.getElementById('schulteNext');
            if (nextEl) nextEl.innerText = '✓';
        } else {
            updateSchulteNext();
        }
    } else {
        // Wrong
        cell.style.background = 'rgba(255,0,110,0.12)';
        cell.style.borderColor = 'rgba(255,0,110,0.4)';
        cell.style.color = 'var(--accent-pink)';
        setTimeout(() => {
            cell.style.background = 'rgba(20, 20, 35, 0.8)';
            cell.style.borderColor = 'rgba(255,255,255,0.04)';
            cell.style.color = 'var(--text-primary)';
        }, 400);
    }
}

function updateSchulteNext() {
    const el = document.getElementById('schulteNext');
    if (el && schulteState.current <= 25) el.innerText = schulteState.current;
}

function stopSchulte() {
    clearInterval(schulteTimerId);
    schulteState.phase = 'idle';
}
