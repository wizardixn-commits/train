// =============================================
// КОЛБЫ — Water Sort Puzzle (fully functional)
// =============================================
const TUBE_CAPACITY = 4;
const FLASK_COLORS = {
    'pink': '#ff006e',
    'green': '#00ff88',
    'cyan': '#00e5ff',
    'yellow': '#ffb703',
    'purple': '#9d4edd',
    'orange': '#fb5607'
};

// Level definitions: each tube is bottom→top
const FLASK_LEVELS = [
    {   // Level 1 — 3 colors, 4 tubes (1 empty)
        tubes: [
            ['pink', 'green', 'yellow', 'pink'],
            ['green', 'yellow', 'pink', 'green'],
            ['yellow', 'pink', 'green', 'yellow'],
            []
        ]
    },
    {   // Level 2 — 4 colors, 5 tubes (1 empty)
        tubes: [
            ['pink', 'cyan', 'green', 'yellow'],
            ['green', 'pink', 'yellow', 'cyan'],
            ['yellow', 'green', 'cyan', 'pink'],
            ['cyan', 'yellow', 'pink', 'green'],
            []
        ]
    },
    {   // Level 3 — 5 colors, 6 tubes (1 empty)
        tubes: [
            ['pink', 'cyan', 'green', 'yellow'],
            ['purple', 'pink', 'yellow', 'cyan'],
            ['yellow', 'purple', 'cyan', 'pink'],
            ['cyan', 'yellow', 'pink', 'purple'],
            ['green', 'purple', 'green', 'green'],
            []
        ]
    }
];

let flasksState = {
    level: 0,
    tubes: [],
    selectedTube: null,
    moves: 0,
    history: [],
    bestMoves: {}
};

function renderFlasks(container) {
    flasksState.selectedTube = null;
    flasksState.history = [];
    flasksState.moves = 0;
    flasksState.tubes = JSON.parse(JSON.stringify(FLASK_LEVELS[flasksState.level].tubes));

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('flasks', flasksState.moves > 0)">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-yellow);" class="glow-text">КОЛБЫ</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 16px;" id="flasksMoves">Ходов: 0</div>
        </div>
        <div style="text-align: center; margin-top: 25px;">
            <p id="flasksMessage" style="font-size: 15px; margin-bottom: 25px; color: var(--text-secondary); min-height: 20px;">Перелей цвета — один цвет на колбу</p>

            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
                ${FLASK_LEVELS.map((_, i) => `
                    <button onclick="setFlaskLevel(${i})" id="flaskLvlBtn${i}" class="btn" style="padding: 8px 16px; font-size: 13px; ${i === flasksState.level ? 'background:rgba(255,183,3,0.15); border-color:rgba(255,183,3,0.4); color:var(--accent-yellow);' : ''}">Ур. ${i + 1}</button>
                `).join('')}
            </div>

            <div id="flasksContainer" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 30px;">
            </div>

            <div style="display: flex; justify-content: center; gap: 12px;">
                <button class="btn" onclick="undoFlasksMove()" style="flex: 1; max-width: 150px;">
                    ↩ Отменить
                </button>
                <button class="btn" onclick="resetFlasks()" style="flex: 1; max-width: 150px;">
                    ↺ Заново
                </button>
            </div>
        </div>
    `;

    drawFlasks();
}

function setFlaskLevel(idx) {
    flasksState.level = idx;
    const container = document.getElementById('flasks');
    if (container) renderFlasks(container);
}

function drawFlasks() {
    const container = document.getElementById('flasksContainer');
    if (!container) return;
    container.innerHTML = '';

    const TUBE_H = 160;
    const BALL_SIZE = Math.floor((TUBE_H - 12) / TUBE_CAPACITY);

    flasksState.tubes.forEach((tube, i) => {
        const isSelected = flasksState.selectedTube === i;
        const tubeEl = document.createElement('div');

        const borderColor = isSelected ? '#00ff88' : 'rgba(255,255,255,0.12)';
        const bgColor = isSelected ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.02)';
        const shadow = isSelected ? '0 0 18px rgba(0,255,136,0.25)' : 'none';

        tubeEl.style.cssText = [
            'display:flex',
            'flex-direction:column',
            'justify-content:flex-end',
            'align-items:center',
            'gap:3px',
            'cursor:pointer',
            'border-radius:0 0 30px 30px',
            'border-top:none',
            'padding:5px 5px',
            'transition:all 0.2s',
            `width:${BALL_SIZE + 14}px`,
            `height:${TUBE_H}px`,
            `background:${bgColor}`,
            `border:2px solid ${borderColor}`,
            `border-top:none`,
            `box-shadow:${shadow}`,
            `transform:${isSelected ? 'translateY(-10px)' : 'translateY(0)'}`
        ].join(';');

        tubeEl.onclick = () => handleTubeClick(i);

        // empty placeholders
        const empty = TUBE_CAPACITY - tube.length;
        for (let e = 0; e < empty; e++) {
            const ph = document.createElement('div');
            ph.style.cssText = `width:${BALL_SIZE}px;height:${BALL_SIZE}px;border-radius:50%;background:transparent;`;
            tubeEl.appendChild(ph);
        }

        // draw balls bottom→top (reversed for DOM top→bottom)
        [...tube].reverse().forEach((color, ballIdx) => {
            const ball = document.createElement('div');
            const isTop = ballIdx === 0;
            const hex = FLASK_COLORS[color] || '#888';
            ball.style.cssText = [
                `width:${BALL_SIZE}px`,
                `height:${BALL_SIZE}px`,
                'border-radius:50%',
                `background:${hex}`,
                'box-shadow:inset -3px -4px 8px rgba(0,0,0,0.35),inset 2px 2px 5px rgba(255,255,255,0.45),0 2px 6px rgba(0,0,0,0.4)',
                `transform:${isSelected && isTop ? 'translateY(-12px)' : 'none'}`,
                'transition:transform 0.2s'
            ].join(';');
            tubeEl.appendChild(ball);
        });

        container.appendChild(tubeEl);
    });

    const movesEl = document.getElementById('flasksMoves');
    if (movesEl) movesEl.innerText = `Ходов: ${flasksState.moves}`;
}

function handleTubeClick(index) {
    const sel = flasksState.selectedTube;

    if (sel === null) {
        if (flasksState.tubes[index].length === 0) return;
        flasksState.selectedTube = index;
        drawFlasks();
        return;
    }

    if (sel === index) {
        flasksState.selectedTube = null;
        drawFlasks();
        return;
    }

    // Try to pour
    const from = flasksState.tubes[sel];
    const to = flasksState.tubes[index];

    const topFrom = from[from.length - 1];
    const topTo = to.length > 0 ? to[to.length - 1] : null;
    const canPour = from.length > 0 && to.length < TUBE_CAPACITY && (!topTo || topTo === topFrom);

    if (canPour) {
        // Count how many matching balls we can pour at once
        let count = 1;
        for (let k = from.length - 2; k >= 0; k--) {
            if (from[k] === topFrom && to.length + count < TUBE_CAPACITY) count++;
            else break;
        }
        flasksState.history.push(JSON.parse(JSON.stringify(flasksState.tubes)));
        for (let k = 0; k < count; k++) {
            to.push(from.pop());
        }
        flasksState.moves++;
        saveScore('flasks', flasksState.moves);
    }

    flasksState.selectedTube = null;
    drawFlasks();
    checkFlasksWin();
}

function undoFlasksMove() {
    if (flasksState.history.length > 0) {
        flasksState.tubes = flasksState.history.pop();
        flasksState.moves = Math.max(0, flasksState.moves - 1);
        flasksState.selectedTube = null;
        drawFlasks();
    }
}

function resetFlasks() {
    flasksState.tubes = JSON.parse(JSON.stringify(FLASK_LEVELS[flasksState.level].tubes));
    flasksState.history = [];
    flasksState.selectedTube = null;
    flasksState.moves = 0;
    const msg = document.getElementById('flasksMessage');
    if (msg) { msg.innerText = 'Перелей цвета — один цвет на колбу'; msg.style.color = 'var(--text-secondary)'; }
    drawFlasks();
}

function checkFlasksWin() {
    const done = flasksState.tubes.every(tube =>
        tube.length === 0 || (tube.length === TUBE_CAPACITY && tube.every(c => c === tube[0]))
    );
    if (done) {
        const msg = document.getElementById('flasksMessage');
        if (msg) { msg.innerText = `🎉 Уровень ${flasksState.level + 1} пройден за ${flasksState.moves} ходов!`; msg.style.color = 'var(--accent-yellow)'; }
        if (flasksState.level < FLASK_LEVELS.length - 1) {
            setTimeout(() => {
                flasksState.level++;
                const c = document.getElementById('flasks');
                if (c) renderFlasks(c);
            }, 2000);
        }
    }
}
