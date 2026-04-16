// =============================================
// ФЛОУ — Flow Puzzle (multiple levels)
// =============================================

// Level format: { size, pairs: { colorName: [startIdx, endIdx] } }
// Indices are row*size + col (0-based)
const FLOW_LEVELS = [
    // --- 4×4 (easy) ---
    { size: 4, label: '4×4', pairs: { green: [0, 11], pink: [1, 14], yellow: [4, 9], cyan: [6, 13] } },
    { size: 4, label: '4×4', pairs: { green: [0, 15], cyan: [1, 8], pink: [5, 14], yellow: [3, 12] } },
    { size: 4, label: '4×4', pairs: { green: [0, 5], cyan: [1, 10], pink: [6, 15], yellow: [9, 14], red: [3, 12] } },

    // --- 5×5 (medium) ---
    { size: 5, label: '5×5', pairs: { green: [4, 9], cyan: [6, 11], pink: [14, 18], yellow: [15, 20] } },
    { size: 5, label: '5×5', pairs: { green: [0, 24], cyan: [1, 21], pink: [3, 22], yellow: [10, 14], red: [5, 19] } },
    { size: 5, label: '5×5', pairs: { green: [0, 12], cyan: [2, 17], pink: [4, 20], yellow: [6, 18], red: [8, 22], purple: [10, 24] } },
    { size: 5, label: '5×5', pairs: { green: [0, 6], cyan: [1, 11], pink: [3, 21], yellow: [4, 24], red: [13, 19] } },
    { size: 5, label: '5×5', pairs: { green: [2, 22], cyan: [4, 20], pink: [7, 17], yellow: [0, 24], red: [10, 14] } },
    { size: 5, label: '5×5', pairs: { green: [0, 4], cyan: [5, 9], pink: [10, 14], yellow: [15, 19], red: [20, 24] } },

    // --- 6×6 (hard) ---
    { size: 6, label: '6×6', pairs: { green: [0, 35], cyan: [1, 31], pink: [5, 30], yellow: [6, 29], red: [7, 22], purple: [14, 21] } },
    { size: 6, label: '6×6', pairs: { green: [0, 7], cyan: [1, 32], pink: [4, 34], yellow: [11, 24], red: [13, 26], purple: [17, 22] } },
    { size: 6, label: '6×6', pairs: { green: [0, 5], cyan: [6, 11], pink: [12, 17], yellow: [18, 23], red: [24, 29], purple: [30, 35] } },
    { size: 6, label: '6×6', pairs: { green: [2, 33], cyan: [3, 32], pink: [8, 27], yellow: [14, 21], red: [0, 35], purple: [5, 30], orange: [10, 25] } },
    { size: 6, label: '6×6', pairs: { green: [0, 10], cyan: [5, 31], pink: [7, 28], yellow: [12, 23], red: [17, 18], purple: [1, 34] } },

    // --- 7×7 (expert) ---
    { size: 7, label: '7×7', pairs: { green: [0, 48], cyan: [6, 42], pink: [7, 41], yellow: [14, 34], red: [21, 27], purple: [8, 40], orange: [13, 35] } },
    { size: 7, label: '7×7', pairs: { green: [0, 6], cyan: [7, 13], pink: [28, 34], yellow: [42, 48], red: [3, 45], purple: [21, 27], orange: [14, 36] } },
];

const FLOW_COLORS = {
    green: { fill: '#00ff88', rgb: '0,255,136' },
    cyan: { fill: '#00e5ff', rgb: '0,229,255' },
    pink: { fill: '#ff006e', rgb: '255,0,110' },
    yellow: { fill: '#ffb703', rgb: '255,183,3' },
    red: { fill: '#ff4444', rgb: '255,68,68' },
    purple: { fill: '#9d4edd', rgb: '157,78,221' },
    orange: { fill: '#fb5607', rgb: '251,86,7' },
};

let flowState = {
    levelIndex: 0,
    size: 5,
    pairs: {},
    paths: {},
    moves: 0,
    activeColor: null,
    solved: false
};
let flowIsDrawing = false;

function renderFlow(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <h2 style="margin:0; color:var(--accent-cyan);" class="glow-text">ФЛОУ</h2>
            <div style="font-weight:bold; color:var(--accent-yellow); font-size:15px;" id="flowMoves">0 ходов</div>
        </div>

        <!-- Level selector -->
        <div style="margin-bottom:18px;">
            ${[
            { label: '🟢 Новичок', color: '#00ff88', from: 0, to: 3 },
            { label: '🔵 Средний', color: '#00e5ff', from: 3, to: 9 },
            { label: '🟣 Сложный', color: '#9d4edd', from: 9, to: 14 },
            { label: '🔴 Эксперт', color: '#ff006e', from: 14, to: 17 },
        ].map(tier => `
                <div style="margin-bottom:10px;">
                    <div style="font-size:11px; font-weight:700; color:${tier.color}; letter-spacing:1px; margin-bottom:6px; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
                        ${tier.label}
                        <div style="flex:1; height:1px; background:${tier.color}22;"></div>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                        ${FLOW_LEVELS.slice(tier.from, tier.to).map((l, j) => {
            const i = tier.from + j;
            const active = i === flowState.levelIndex;
            return `<button onclick="loadFlowLevel(${i})" id="flvl${i}"
                                style="width:38px; height:38px; border-radius:10px; font-size:13px; font-weight:700;
                                cursor:pointer; border:1.5px solid ${active ? tier.color : 'var(--card-border)'};
                                background:${active ? tier.color + '22' : 'var(--card-bg)'};
                                color:${active ? tier.color : 'var(--text-secondary)'};
                                box-shadow:${active ? '0 0 10px ' + tier.color + '44' : 'none'};
                                transition:all 0.15s;">
                                ${i + 1}
                            </button>`;
        }).join('')}
                    </div>
                </div>`).join('')}
        </div>

        <div style="text-align:center;">
            <p id="flowMessage" style="font-size:14px; color:var(--text-secondary); margin-bottom:14px; height:18px;">Соедини точки одного цвета</p>
            <div id="flowGrid" style="display:grid; gap:2px; margin:0 auto; background:rgba(255,255,255,0.04); padding:3px; border-radius:10px; touch-action:none; width:min(340px,90vw);"></div>
            <div style="margin-top:18px; display:flex; justify-content:center; gap:28px; font-size:13px; color:var(--text-secondary);">
                <div>Уровень <span style="color:var(--accent-cyan); font-weight:700;" id="flowLevelNum">${flowState.levelIndex + 1}/${FLOW_LEVELS.length}</span></div>
                <div>Пар: <span style="color:var(--accent-cyan); font-weight:700;" id="flowPairs">0/?</span></div>
            </div>
        </div>

        <div style="position:absolute; bottom:26px; left:0; width:100%; display:flex; justify-content:center; gap:12px; padding:0 20px;">
            <button class="btn" onclick="resetFlow()" style="flex:1; background:rgba(255,255,255,0.03);">↺ Заново</button>
            <button class="btn" onclick="loadFlowLevel(${Math.min(flowState.levelIndex + 1, FLOW_LEVELS.length - 1)})" style="flex:1; background:rgba(0,229,255,0.07); color:var(--accent-cyan); border-color:rgba(0,229,255,0.2);">Следующий →</button>
        </div>
    `;
    loadFlowLevel(flowState.levelIndex);
}

function loadFlowLevel(idx) {
    flowState.levelIndex = idx;
    const lvl = FLOW_LEVELS[idx];
    flowState.size = lvl.size;
    flowState.pairs = lvl.pairs;
    flowState.paths = {};
    Object.keys(lvl.pairs).forEach(c => { flowState.paths[c] = []; });
    flowState.moves = 0;
    flowState.solved = false;
    flowState.activeColor = null;
    flowIsDrawing = false;

    // Rebuild level picker highlights with tier colours
    const tiers = [
        { color: '#00ff88', from: 0, to: 3 },
        { color: '#00e5ff', from: 3, to: 9 },
        { color: '#9d4edd', from: 9, to: 14 },
        { color: '#ff006e', from: 14, to: 17 },
    ];
    tiers.forEach(tier => {
        for (let i = tier.from; i < tier.to; i++) {
            const btn = document.getElementById(`flvl${i}`);
            if (!btn) continue;
            const active = i === idx;
            btn.style.background = active ? tier.color + '22' : 'var(--card-bg)';
            btn.style.borderColor = active ? tier.color : 'var(--card-border)';
            btn.style.color = active ? tier.color : 'var(--text-secondary)';
            btn.style.boxShadow = active ? `0 0 10px ${tier.color}44` : 'none';
        }
    });

    const msg = document.getElementById('flowMessage');
    if (msg) { msg.innerText = 'Соедини точки одного цвета'; msg.style.color = 'var(--text-secondary)'; }

    const lvlEl = document.getElementById('flowLevelNum');
    if (lvlEl) lvlEl.innerText = `${idx + 1}/${FLOW_LEVELS.length}`;

    buildFlowGrid();
    updateFlowUI();
}

function buildFlowGrid() {
    const grid = document.getElementById('flowGrid');
    if (!grid) return;
    const size = flowState.size;
    const cellPx = Math.floor(Math.min(340, window.innerWidth * 0.9 - 10) / size);

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.innerHTML = '';

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'flow-cell';
        cell.dataset.index = i;
        cell.style.cssText = `
            width:${cellPx}px; height:${cellPx}px;
            background:var(--bg-color); display:flex;
            align-items:center; justify-content:center;
            position:relative; border-radius:4px;
        `;
        cell.addEventListener('mousedown', () => handleFlowPointerDown(i));
        cell.addEventListener('mouseenter', () => handleFlowPointerEnter(i));
        cell.addEventListener('touchstart', (e) => { e.preventDefault(); handleFlowPointerDown(i); }, { passive: false });
        grid.appendChild(cell);
    }

    grid.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.dataset.index !== undefined) handleFlowPointerEnter(+el.dataset.index);
    }, { passive: false });

    document.addEventListener('mouseup', handleFlowPointerUp);
    document.addEventListener('touchend', handleFlowPointerUp);
}

function resetFlow() {
    Object.keys(flowState.paths).forEach(c => { flowState.paths[c] = []; });
    flowState.moves = 0;
    flowState.solved = false;
    const msg = document.getElementById('flowMessage');
    if (msg) { msg.innerText = 'Соедини точки одного цвета'; msg.style.color = 'var(--text-secondary)'; }
    updateFlowUI();
}

function handleFlowPointerDown(index) {
    if (flowState.solved) return;
    let color = null;
    for (const [c, pos] of Object.entries(flowState.pairs)) {
        if (pos.includes(index)) { color = c; break; }
    }
    if (!color) {
        for (const [c, path] of Object.entries(flowState.paths)) {
            if (path.includes(index)) { color = c; break; }
        }
    }
    if (!color) return;

    flowIsDrawing = true;
    flowState.activeColor = color;
    if (flowState.pairs[color].includes(index)) {
        flowState.paths[color] = [index];
        flowState.moves++;
    } else {
        const pIdx = flowState.paths[color].indexOf(index);
        flowState.paths[color] = flowState.paths[color].slice(0, pIdx + 1);
        flowState.moves++;
    }
    updateFlowUI();
}

function handleFlowPointerEnter(index) {
    if (!flowIsDrawing || !flowState.activeColor || flowState.solved) return;
    const color = flowState.activeColor;
    const path = flowState.paths[color];
    const last = path[path.length - 1];
    const size = flowState.size;

    const adjacent =
        (Math.abs(last - index) === 1 && Math.floor(last / size) === Math.floor(index / size)) ||
        Math.abs(last - index) === size;

    if (!adjacent) return;

    // Block crossing other endpoint dots
    for (const [c, pos] of Object.entries(flowState.pairs)) {
        if (c !== color && pos.includes(index)) return;
    }

    // Backtrack
    if (path.length > 1 && path[path.length - 2] === index) {
        path.pop(); updateFlowUI(); return;
    }

    // Loop on self
    if (path.includes(index)) {
        flowState.paths[color] = path.slice(0, path.indexOf(index) + 1);
        updateFlowUI(); return;
    }

    // Cut crossing paths
    for (const [c, p] of Object.entries(flowState.paths)) {
        if (c !== color && p.includes(index)) {
            flowState.paths[c] = p.slice(0, p.indexOf(index));
        }
    }

    path.push(index);

    // Snap complete
    if (flowState.pairs[color].includes(index) && index !== path[0]) {
        flowIsDrawing = false;
    }
    updateFlowUI();
}

function handleFlowPointerUp() {
    flowIsDrawing = false;
    flowState.activeColor = null;
    checkFlowWin();
}

function updateFlowUI() {
    const cells = document.querySelectorAll('.flow-cell');
    if (!cells.length) return;
    const totalPairs = Object.keys(flowState.pairs).length;

    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.style.background = 'var(--bg-color)';
    });

    let complete = 0;

    // Draw paths
    for (const [color, path] of Object.entries(flowState.paths)) {
        const c = FLOW_COLORS[color];
        if (!c) continue;
        const filled = path.length > 1 &&
            flowState.pairs[color].includes(path[0]) &&
            flowState.pairs[color].includes(path[path.length - 1]);
        if (filled) complete++;

        path.forEach(idx => {
            cells[idx].style.background = `rgba(${c.rgb},0.2)`;
            const dot = document.createElement('div');
            dot.style.cssText = `width:38%;height:38%;border-radius:50%;background:${c.fill};`;
            cells[idx].appendChild(dot);
        });
    }

    // Draw endpoint dots (on top)
    for (const [color, [a, b]] of Object.entries(flowState.pairs)) {
        const c = FLOW_COLORS[color];
        if (!c) continue;
        [a, b].forEach(idx => {
            cells[idx].innerHTML = '';
            const inPath = flowState.paths[color].includes(idx);
            cells[idx].style.background = inPath ? `rgba(${c.rgb},0.25)` : 'var(--bg-color)';
            const dot = document.createElement('div');
            dot.style.cssText = `width:62%;height:62%;border-radius:50%;background:${c.fill};box-shadow:0 0 12px ${c.fill};`;
            cells[idx].appendChild(dot);
        });
    }

    const mEl = document.getElementById('flowMoves');
    if (mEl) mEl.innerText = `${flowState.moves} ходов`;
    const pEl = document.getElementById('flowPairs');
    if (pEl) pEl.innerText = `${complete}/${totalPairs}`;
}

function checkFlowWin() {
    const totalPairs = Object.keys(flowState.pairs).length;
    let complete = 0;
    for (const [color, path] of Object.entries(flowState.paths)) {
        if (path.length > 1 &&
            flowState.pairs[color].includes(path[0]) &&
            flowState.pairs[color].includes(path[path.length - 1])) {
            complete++;
        }
    }
    if (complete < totalPairs) return;

    flowState.solved = true;
    saveScore('flow', flowState.levelIndex + 1);

    const msg = document.getElementById('flowMessage');
    if (msg) {
        msg.innerText = flowState.levelIndex < FLOW_LEVELS.length - 1 ? '✓ Уровень пройден! →' : '🏆 Все уровни пройдены!';
        msg.style.color = 'var(--accent-green)';
    }

    // Auto-advance to next level after 1.2s
    if (flowState.levelIndex < FLOW_LEVELS.length - 1) {
        setTimeout(() => loadFlowLevel(flowState.levelIndex + 1), 1200);
    }
}
