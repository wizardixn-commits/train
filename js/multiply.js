// =============================================
// УМНОЖЕНИЕ В КЛЕТКУ — Area Multiplication Game
// =============================================

let multiplyState = {
    levelIndex: 0,
    score: 0,
    record: 0,
    streak: 0,
    phase: 'idle', // idle, playing, success, error
    factorA: 2,
    factorB: 2,
    targetArea: 4,
    gridSize: 4,
    // Drag selection coordinates
    isSelecting: false,
    startR: null,
    startC: null,
    endR: null,
    endC: null,
    // Active selection box
    selectedBox: null, // { minR, maxR, minC, maxC, w, h, area }
    hintActive: false,
    timerId: null,
    audioCtx: null
};

const MULTIPLY_LEVELS = [
    {
        id: 'up16',
        title: 'до 16',
        subtitle: 'от 6 лет',
        gridSize: 4,
        minFactor: 1,
        maxFactor: 4
    },
    {
        id: 'up25',
        title: 'до 25',
        subtitle: 'от 7 лет',
        gridSize: 5,
        minFactor: 2,
        maxFactor: 5
    },
    {
        id: 'up36',
        title: 'до 36',
        subtitle: 'от 8 лет',
        gridSize: 6,
        minFactor: 2,
        maxFactor: 6
    },
    {
        id: 'up64',
        title: 'до 64',
        subtitle: 'от 9 лет',
        gridSize: 8,
        minFactor: 2,
        maxFactor: 8
    },
    {
        id: 'up100',
        title: 'до 100',
        subtitle: 'Вся таблица',
        gridSize: 10,
        minFactor: 2,
        maxFactor: 10
    }
];

function getMultiplyAudio() {
    if (!multiplyState.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) multiplyState.audioCtx = new AudioCtx();
    }
    if (multiplyState.audioCtx && multiplyState.audioCtx.state === 'suspended') {
        multiplyState.audioCtx.resume();
    }
    return multiplyState.audioCtx;
}

function playMultiplySound(type) {
    try {
        const ctx = getMultiplyAudio();
        if (!ctx) return;
        const t = ctx.currentTime;

        if (type === 'correct') {
            // Happy cheerful arpeggio: C5 -> E5 -> G5 -> C6
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + idx * 0.08);
                gain.gain.setValueAtTime(0.2, t + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t + idx * 0.08);
                osc.stop(t + idx * 0.08 + 0.36);
            });
        } else if (type === 'wrong') {
            // Gentle double boop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, t);
            osc.frequency.exponentialRampToValueAtTime(140, t + 0.25);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.26);
        } else if (type === 'click') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.05);
        }
    } catch (e) {
        // Audio playback can fail silently if user hasn't interacted
    }
}

function renderMultiply(container) {
    const scores = getUserScores();
    multiplyState.record = scores.multiply || 0;
    multiplyState.phase = 'playing';
    multiplyState.hintActive = false;

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('multiply', multiplyState.phase === 'playing')" title="Назад">
                ←
            </div>
            <div style="text-align:center;">
                <h2 style="margin:0; color:var(--accent-purple); letter-spacing:1px;" class="glow-text">УМНОЖЕНИЕ</h2>
                <span style="font-size:11px; color:var(--text-secondary); opacity:0.8;">В КЛЕТКУ</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-weight:bold; color:var(--accent-yellow); font-size:17px;" id="mulScoreDisp">
                ⭐ <span id="mulScoreVal">${multiplyState.score}</span>
            </div>
        </div>

        <!-- Levels Selection Tabs -->
        <div style="margin-bottom:18px;">
            <div class="mul-levels-bar" id="mulLevelsBar" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
                ${MULTIPLY_LEVELS.map((lvl, idx) => `
                    <button class="mul-lvl-tab ${idx === multiplyState.levelIndex ? 'active' : ''}" 
                            onclick="setMultiplyLevel(${idx})" 
                            id="mulTab_${idx}"
                            style="flex:1; min-width:68px; padding:8px 6px; border-radius:14px; border:1px solid ${idx === multiplyState.levelIndex ? 'rgba(157,78,221,0.5)' : 'var(--card-border)'}; background:${idx === multiplyState.levelIndex ? 'rgba(157,78,221,0.2)' : 'var(--card-bg)'}; cursor:pointer; text-align:center; transition:all 0.2s; font-family:inherit;">
                        <div style="font-size:13px; font-weight:800; color:${idx === multiplyState.levelIndex ? 'var(--accent-purple)' : 'var(--text-primary)'}; white-space:nowrap;">
                            ${lvl.title}
                        </div>
                        <div style="font-size:10px; color:var(--text-secondary); margin-top:2px; white-space:nowrap;">
                            ${lvl.subtitle}
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- Problem Banner Card -->
        <div class="glass-card" id="mulProblemCard" style="text-align:center; padding:18px 14px; margin-bottom:18px; border-color:rgba(157,78,221,0.25); position:relative; overflow:hidden;">
            <div id="mulProblemBanner" style="font-size:38px; font-weight:900; letter-spacing:2px; color:var(--text-primary); min-height:48px; display:flex; align-items:center; justify-content:center; gap:8px;">
                <span id="mulFactorA">${multiplyState.factorA}</span>
                <span style="color:var(--accent-purple);">×</span>
                <span id="mulFactorB">${multiplyState.factorB}</span>
                <span style="color:var(--text-secondary); font-size:32px;">=</span>
                <span id="mulResult" style="color:var(--accent-yellow); font-size:36px;">?</span>
            </div>
            <div id="mulInstruction" style="font-size:13px; color:var(--text-secondary); margin-top:6px; transition:color 0.2s;">
                Выдели пальцем или мышкой прямоугольник с нужным числом клеток
            </div>
        </div>

        <!-- Grid Container -->
        <div style="position:relative; display:flex; justify-content:center; align-items:center; margin-bottom:20px; user-select:none; -webkit-user-select:none;">
            <div class="mul-grid-wrapper" id="mulGridWrapper" style="position:relative; background:var(--card-bg); padding:10px; border-radius:24px; border:1px solid var(--card-border); box-shadow:var(--shadow-card); touch-action:none;">
                <div id="mulGrid" style="display:grid; gap:4px; position:relative;"></div>
            </div>
        </div>

        <!-- Action Controls -->
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:16px;">
            <button class="btn" onclick="resetMultiplySelection()" style="flex:1; max-width:110px; padding:12px 10px; font-size:13px; background:rgba(255,255,255,0.04); border-color:var(--card-border); color:var(--text-secondary);">
                ↺ Сброс
            </button>
            <button class="btn" id="mulHintBtn" onclick="toggleMultiplyHint()" style="flex:1; max-width:130px; padding:12px 12px; font-size:13px; background:rgba(255,183,3,0.1); border-color:rgba(255,183,3,0.25); color:var(--accent-yellow);">
                💡 Подсказка
            </button>
            <button class="btn" id="mulNextBtn" onclick="nextMultiplyProblem(true)" style="flex:1; max-width:120px; padding:12px 12px; font-size:13px; background:rgba(0,255,136,0.12); border-color:rgba(0,255,136,0.25); color:var(--accent-green);">
                Дальше →
            </button>
        </div>

        <!-- Bottom Stats & Streak -->
        <div style="display:flex; justify-content:space-around; align-items:center; padding:12px 16px; background:rgba(0,0,0,0.15); border-radius:14px; border:1px solid var(--card-border); font-size:13px; color:var(--text-secondary);">
            <div>Правильно: <span id="mulStatsCorrect" style="color:var(--accent-green); font-weight:bold;">${multiplyState.score}</span></div>
            <div>Серия: <span id="mulStatsStreak" style="color:var(--accent-yellow); font-weight:bold;">🔥 ${multiplyState.streak}</span></div>
            <div>Рекорд: <span id="mulStatsRecord" style="color:var(--accent-purple); font-weight:bold;">${multiplyState.record}</span></div>
        </div>
    `;

    initMultiplyLevel(multiplyState.levelIndex);
}

function setMultiplyLevel(index) {
    multiplyState.levelIndex = index;
    // Update tabs styling
    MULTIPLY_LEVELS.forEach((_, idx) => {
        const tab = document.getElementById(`mulTab_${idx}`);
        if (!tab) return;
        const isActive = idx === index;
        tab.classList.toggle('active', isActive);
        tab.style.borderColor = '';
        tab.style.background = '';
        const title = tab.querySelector('div:first-child');
        if (title) title.style.color = isActive ? 'var(--accent-purple)' : 'var(--text-primary)';
    });

    initMultiplyLevel(index);
}

function initMultiplyLevel(index) {
    const lvl = MULTIPLY_LEVELS[index];
    multiplyState.gridSize = lvl.gridSize;
    multiplyState.selectedBox = null;
    multiplyState.isSelecting = false;
    multiplyState.hintActive = false;

    buildMultiplyGrid(lvl.gridSize);
    generateMultiplyProblem();
}

function generateMultiplyProblem() {
    const lvl = MULTIPLY_LEVELS[multiplyState.levelIndex];
    const min = lvl.minFactor;
    const max = lvl.maxFactor;

    // Pick two random factors that fit on the grid
    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;

    // For level 10x10, encourage interesting tables (from 2 up to 10)
    if (lvl.gridSize === 10 && Math.random() < 0.8) {
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * 9) + 2;
    }

    // Occasionally randomize order
    if (Math.random() > 0.5) {
        const temp = a;
        a = b;
        b = temp;
    }

    multiplyState.factorA = a;
    multiplyState.factorB = b;
    multiplyState.targetArea = a * b;
    multiplyState.phase = 'playing';
    multiplyState.selectedBox = null;
    multiplyState.hintActive = false;

    updateProblemUI();
    clearGridHighlights();
}

function updateProblemUI() {
    const elA = document.getElementById('mulFactorA');
    const elB = document.getElementById('mulFactorB');
    const elRes = document.getElementById('mulResult');
    const card = document.getElementById('mulProblemCard');
    const instr = document.getElementById('mulInstruction');

    if (elA) elA.innerText = multiplyState.factorA;
    if (elB) elB.innerText = multiplyState.factorB;
    if (elRes) {
        elRes.innerText = '?';
        elRes.style.color = 'var(--accent-yellow)';
    }
    if (card) {
        card.style.borderColor = 'rgba(157,78,221,0.25)';
        card.style.background = 'var(--card-bg)';
    }
    if (instr) {
        instr.innerHTML = `Выделите область: <b>${multiplyState.factorA} × ${multiplyState.factorB}</b> или любое поле из <b>${multiplyState.targetArea}</b> клеток`;
        instr.style.color = 'var(--text-secondary)';
    }
}

function buildMultiplyGrid(size) {
    const grid = document.getElementById('mulGrid');
    if (!grid) return;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    // Calculate cell dimension so it stays compact and fits nicely on mobile (max ~330px width)
    const availableWidth = Math.min(window.innerWidth - 64, 340);
    const gap = size >= 8 ? 3 : 5;
    const totalGap = (size - 1) * gap;
    const cellSize = Math.floor((availableWidth - totalGap) / size);

    grid.style.gap = `${gap}px`;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'mul-cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.style.cssText = `
                width: ${cellSize}px;
                height: ${cellSize}px;
                border-radius: ${size > 6 ? '5px' : '8px'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${cellSize * 0.38}px;
                font-weight: 700;
                cursor: pointer;
                position: relative;
            `;

            grid.appendChild(cell);
        }
    }

    setupMultiplyPointerEvents();
}

function setupMultiplyPointerEvents() {
    const wrapper = document.getElementById('mulGridWrapper');
    if (!wrapper) return;

    // Remove previous listeners if any
    wrapper.onpointerdown = handlePointerDown;
    wrapper.onpointermove = handlePointerMove;
    wrapper.onpointerup = handlePointerUp;
    wrapper.onpointercancel = handlePointerUp;
}

function getCellFromPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const cell = el.closest('.mul-cell');
    if (!cell) return null;
    return {
        r: parseInt(cell.dataset.r, 10),
        c: parseInt(cell.dataset.c, 10)
    };
}

function handlePointerDown(e) {
    if (multiplyState.phase !== 'playing') return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    getMultiplyAudio(); // Unlock audio context
    playMultiplySound('click');

    multiplyState.isSelecting = true;
    multiplyState.startR = cell.r;
    multiplyState.startC = cell.c;
    multiplyState.endR = cell.r;
    multiplyState.endC = cell.c;

    // Capture pointer
    try {
        if (e.target.setPointerCapture) {
            e.target.setPointerCapture(e.pointerId);
        }
    } catch (err) {}

    updateSelectionBox();
}

function handlePointerMove(e) {
    if (!multiplyState.isSelecting || multiplyState.phase !== 'playing') return;
    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    if (cell.r !== multiplyState.endR || cell.c !== multiplyState.endC) {
        multiplyState.endR = cell.r;
        multiplyState.endC = cell.c;
        updateSelectionBox();
    }
}

function handlePointerUp(e) {
    if (!multiplyState.isSelecting) return;
    multiplyState.isSelecting = false;

    if (multiplyState.selectedBox && multiplyState.phase === 'playing') {
        validateMultiplySelection();
    }
}

function updateSelectionBox() {
    const minR = Math.min(multiplyState.startR, multiplyState.endR);
    const maxR = Math.max(multiplyState.startR, multiplyState.endR);
    const minC = Math.min(multiplyState.startC, multiplyState.endC);
    const maxC = Math.max(multiplyState.startC, multiplyState.endC);

    const h = maxR - minR + 1;
    const w = maxC - minC + 1;
    const area = h * w;

    multiplyState.selectedBox = { minR, maxR, minC, maxC, w, h, area };

    drawSelectionUI('active');
}

function drawSelectionUI(mode) {
    const box = multiplyState.selectedBox;
    if (!box) return;

    const cells = document.querySelectorAll('.mul-cell');
    cells.forEach(c => {
        const r = parseInt(c.dataset.r, 10);
        const col = parseInt(c.dataset.c, 10);
        const inBox = r >= box.minR && r <= box.maxR && col >= box.minC && col <= box.maxC;

        c.classList.remove('is-selected', 'is-correct', 'is-wrong');
        c.style.background = '';
        c.style.borderColor = '';
        c.style.boxShadow = '';
        c.style.transform = '';

        if (inBox) {
            if (mode === 'correct') {
                c.classList.add('is-correct');
                c.style.background = 'linear-gradient(135deg, rgba(0,255,136,0.92), rgba(0,204,106,0.95))';
                c.style.borderColor = '#00ff88';
                c.style.boxShadow = 'inset 0 0 10px rgba(0,255,136,0.35), 0 0 12px rgba(0,255,136,0.4)';
                c.style.transform = 'scale(0.96)';
            } else if (mode === 'wrong') {
                c.classList.add('is-wrong');
                c.style.background = 'linear-gradient(135deg, rgba(255,0,110,0.92), rgba(217,4,41,0.95))';
                c.style.borderColor = '#ff006e';
                c.style.boxShadow = 'inset 0 0 10px rgba(255,0,110,0.35), 0 0 12px rgba(255,0,110,0.4)';
                c.style.transform = 'scale(0.96)';
            } else {
                // Purple active selection
                c.classList.add('is-selected');
                c.style.background = 'linear-gradient(135deg, rgba(157,78,221,0.9), rgba(124,58,237,0.95))';
                c.style.borderColor = '#c084fc';
                c.style.boxShadow = '0 0 12px rgba(157,78,221,0.45)';
                c.style.transform = 'scale(0.95)';
            }
            c.innerText = '';
        } else {
            c.innerText = '';
        }
    });

    // Place badge in the center of selection
    showSelectionBadge(box, mode);
}

function showSelectionBadge(box, mode) {
    let badge = document.getElementById('mulBadge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'mulBadge';
        document.getElementById('mulGridWrapper')?.appendChild(badge);
    }

    const firstCell = document.querySelector(`.mul-cell[data-r="${box.minR}"][data-c="${box.minC}"]`);
    const lastCell = document.querySelector(`.mul-cell[data-r="${box.maxR}"][data-c="${box.maxC}"]`);

    if (!firstCell || !lastCell) return;

    const wrapperRect = document.getElementById('mulGridWrapper').getBoundingClientRect();
    const fRect = firstCell.getBoundingClientRect();
    const lRect = lastCell.getBoundingClientRect();

    const top = fRect.top - wrapperRect.top;
    const left = fRect.left - wrapperRect.left;
    const width = lRect.right - fRect.left;
    const height = lRect.bottom - fRect.top;

    badge.style.cssText = `
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        width: ${width}px;
        height: ${height}px;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        animation: pulseBadge 0.2s ease-out;
    `;

    const isMatch = box.area === multiplyState.targetArea;
    const subLabel = `${box.h} × ${box.w}`;

    badge.innerHTML = `
        <div style="font-size: ${Math.min(width, height) * 0.44}px; font-weight:900; color:#ffffff; line-height:1;">
            ${box.area}
        </div>
        <div style="font-size: ${Math.min(width, height) * 0.22}px; font-weight:700; color:rgba(255,255,255,0.9); margin-top:2px;">
            ${subLabel}
        </div>
    `;
}

function hideSelectionBadge() {
    const badge = document.getElementById('mulBadge');
    if (badge) badge.remove();
}

function validateMultiplySelection() {
    const box = multiplyState.selectedBox;
    if (!box) return;

    const isCorrect = box.area === multiplyState.targetArea;

    if (isCorrect) {
        handleMultiplySuccess(box);
    } else {
        handleMultiplyError(box);
    }
}

function handleMultiplySuccess(box) {
    multiplyState.phase = 'success';
    playMultiplySound('correct');

    drawSelectionUI('correct');

    // Update Problem card to completed green check
    const elRes = document.getElementById('mulResult');
    const card = document.getElementById('mulProblemCard');
    const instr = document.getElementById('mulInstruction');

    if (elRes) {
        elRes.innerHTML = `${multiplyState.targetArea} <span style="color:var(--accent-green);">✓</span>`;
        elRes.style.color = 'var(--accent-green)';
    }

    if (card) {
        card.style.borderColor = 'rgba(0,255,136,0.6)';
        card.style.background = 'rgba(0,255,136,0.06)';
    }

    const isExactDimensions = (box.h === multiplyState.factorA && box.w === multiplyState.factorB) ||
                              (box.h === multiplyState.factorB && box.w === multiplyState.factorA);

    if (instr) {
        instr.innerHTML = isExactDimensions ?
            `<span style="color:var(--accent-green); font-weight:700;">🎉 Идеально! ${box.h} × ${box.w} = ${box.area}!</span>` :
            `<span style="color:var(--accent-green); font-weight:700;">🎉 Верно! Выделено ровно ${box.area} клеток!</span>`;
    }

    // Award points
    multiplyState.score += 10;
    multiplyState.streak += 1;
    if (multiplyState.score > multiplyState.record) {
        multiplyState.record = multiplyState.score;
    }
    saveScore('multiply', multiplyState.record);

    updateStatsUI();

    // Auto proceed to next problem after 1.4s
    clearTimeout(multiplyState.timerId);
    multiplyState.timerId = setTimeout(() => {
        nextMultiplyProblem();
    }, 1400);
}

function handleMultiplyError(box) {
    multiplyState.phase = 'error';
    playMultiplySound('wrong');

    drawSelectionUI('wrong');

    const instr = document.getElementById('mulInstruction');
    const card = document.getElementById('mulProblemCard');

    if (card) {
        card.style.borderColor = 'rgba(255,0,110,0.5)';
        card.style.background = 'rgba(255,0,110,0.06)';
    }

    if (instr) {
        instr.innerHTML = `<span style="color:var(--accent-pink); font-weight:700;">Подумай ещё! Выделено: ${box.area} (${box.h} × ${box.w}), а нужно: ${multiplyState.targetArea}</span>`;
    }

    multiplyState.streak = 0;
    updateStatsUI();

    // Clear error after 1.1s so user can retry immediately
    clearTimeout(multiplyState.timerId);
    multiplyState.timerId = setTimeout(() => {
        multiplyState.phase = 'playing';
        multiplyState.selectedBox = null;
        hideSelectionBadge();
        clearGridHighlights();
        updateProblemUI();
    }, 1100);
}

function clearGridHighlights() {
    const cells = document.querySelectorAll('.mul-cell');
    cells.forEach(c => {
        c.classList.remove('is-selected', 'is-correct', 'is-wrong');
        c.style.background = '';
        c.style.borderColor = '';
        c.style.boxShadow = '';
        c.style.transform = '';
        c.innerText = '';
    });
    hideSelectionBadge();
}

function resetMultiplySelection() {
    multiplyState.selectedBox = null;
    multiplyState.isSelecting = false;
    multiplyState.phase = 'playing';
    clearGridHighlights();
    updateProblemUI();
}

function toggleMultiplyHint() {
    if (multiplyState.phase !== 'playing') return;

    playMultiplySound('click');
    multiplyState.hintActive = !multiplyState.hintActive;

    const btn = document.getElementById('mulHintBtn');
    const instr = document.getElementById('mulInstruction');

    if (multiplyState.hintActive) {
        // Highlight one valid position: factorA rows by factorB cols from top-left
        const a = multiplyState.factorA;
        const b = multiplyState.factorB;
        const g = multiplyState.gridSize;

        let rCount = a <= g ? a : b;
        let cCount = b <= g ? b : a;

        const cells = document.querySelectorAll('.mul-cell');
        cells.forEach(c => {
            const r = parseInt(c.dataset.r, 10);
            const col = parseInt(c.dataset.c, 10);
            if (r < rCount && col < cCount) {
                c.style.borderColor = 'var(--accent-yellow)';
                c.style.background = 'rgba(255, 183, 3, 0.18)';
                c.style.boxShadow = 'inset 0 0 8px rgba(255, 183, 3, 0.4)';
            }
        });

        if (instr) {
            instr.innerHTML = `<span style="color:var(--accent-yellow);">Подсказка: выдели область ${rCount} на ${cCount} клетки!</span>`;
        }
        if (btn) btn.innerText = 'Скрыть';

        // Auto hide hint after 2.5s
        setTimeout(() => {
            if (multiplyState.hintActive) {
                toggleMultiplyHint();
            }
        }, 2500);
    } else {
        clearGridHighlights();
        updateProblemUI();
        if (btn) btn.innerText = '💡 Подсказка';
    }
}

function nextMultiplyProblem(manualClick = false) {
    if (manualClick) {
        playMultiplySound('click');
    }
    clearTimeout(multiplyState.timerId);
    generateMultiplyProblem();
}

function updateStatsUI() {
    const sVal = document.getElementById('mulScoreVal');
    const cor = document.getElementById('mulStatsCorrect');
    const str = document.getElementById('mulStatsStreak');
    const rec = document.getElementById('mulStatsRecord');

    if (sVal) sVal.innerText = multiplyState.score;
    if (cor) cor.innerText = multiplyState.score;
    if (str) str.innerText = `🔥 ${multiplyState.streak}`;
    if (rec) rec.innerText = multiplyState.record;
}
