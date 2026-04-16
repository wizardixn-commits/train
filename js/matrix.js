let matrixState = {
    level: 1,
    record: 0,
    pattern: [],
    userClicks: [],
    phase: 'idle', // idle, memory, playing, wait
    gridSize: 16
};

function renderMatrix(container) {
    // Basic structure
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-green);" class="glow-text">МАТРИЦА</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="matrixScore">0</div>
        </div>
        <div style="text-align: center; margin-top: 50px;">
            <p id="matrixMessage" style="font-size: 18px; font-weight: bold; margin-bottom: 40px; color: var(--text-secondary); height: 24px;">Нажми Старт</p>
            <div class="matrix-grid" id="matrixGrid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 340px; margin: 0 auto;">
            </div>
            <div style="margin-top: 40px; display: flex; justify-content: center; gap: 30px; color: var(--text-secondary); font-size: 14px;">
                <div>Уровень: <span id="matrixLevel" style="color: var(--accent-green); font-weight: bold; font-size: 16px;">1</span></div>
                <div>Рекорд: <span id="matrixRecord" style="color: var(--accent-green); font-weight: bold; font-size: 16px;">0</span></div>
            </div>
        </div>
        <div class="controls" style="position: absolute; bottom: 30px; left: 0; width: 100%; display: flex; justify-content: center; gap: 15px; padding: 0 20px;">
            <button class="btn" id="matrixStartBtn" onclick="startMatrixLevel()" style="flex: 1; background: rgba(0,255,136,0.1); border-color: rgba(0,255,136,0.2); color: var(--accent-green);">
                ▶ Старт
            </button>
        </div>
    `;

    // Create grid
    const grid = document.getElementById('matrixGrid');
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.dataset.index = i;
        cell.style.cssText = `
            aspect-ratio: 1;
            background: rgba(20, 20, 35, 0.8);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.02);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transition: all 0.2s;
            cursor: pointer;
        `;
        cell.onclick = () => handleMatrixClick(i);
        grid.appendChild(cell);
    }

    updateMatrixUI();
}

function startMatrixLevel() {
    if (matrixState.phase === 'memory' || matrixState.phase === 'playing') return;

    matrixState.userClicks = [];
    matrixState.phase = 'wait';

    const maxSquares = Math.min(3 + Math.floor(matrixState.level / 2), 10);
    matrixState.pattern = [];
    while (matrixState.pattern.length < maxSquares) {
        let r = Math.floor(Math.random() * 16);
        if (!matrixState.pattern.includes(r)) {
            matrixState.pattern.push(r);
        }
    }

    const startBtn = document.getElementById('matrixStartBtn');
    if (startBtn) startBtn.style.display = 'none';

    const msg = document.getElementById('matrixMessage');
    if (msg) {
        msg.innerText = 'Внимание...';
        msg.style.color = 'var(--text-secondary)';
    }

    // Reset grid
    document.querySelectorAll('.matrix-cell').forEach(c => {
        c.style.borderColor = 'rgba(255,255,255,0.02)';
        c.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        c.style.background = 'rgba(20, 20, 35, 0.8)';
    });

    setTimeout(() => {
        matrixState.phase = 'memory';
        const msg = document.getElementById('matrixMessage');
        if (msg) {
            msg.innerText = 'Запомни!';
            msg.style.color = 'var(--text-primary)';
        }

        matrixState.pattern.forEach(index => {
            const cell = document.querySelector(`.matrix-cell[data-index="${index}"]`);
            if (cell) {
                cell.style.borderColor = 'var(--accent-green)';
                cell.style.boxShadow = 'inset 0 0 20px rgba(0,255,136,0.15), 0 0 10px rgba(0,255,136,0.1)';
                cell.style.background = 'rgba(0, 255, 136, 0.1)';
            }
        });

        setTimeout(() => {
            matrixState.phase = 'playing';
            const msg = document.getElementById('matrixMessage');
            if (msg) msg.innerText = 'Повтори!';

            // Hide pattern
            document.querySelectorAll('.matrix-cell').forEach(c => {
                c.style.borderColor = 'rgba(255,255,255,0.02)';
                c.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                c.style.background = 'rgba(20, 20, 35, 0.8)';
            });
        }, Math.max(800, 2000 - matrixState.level * 100)); // Gets slightly faster

    }, 800);
}

function handleMatrixClick(index) {
    if (matrixState.phase !== 'playing') return;
    if (matrixState.userClicks.includes(index)) return; // Already clicked

    const cell = document.querySelector(`.matrix-cell[data-index="${index}"]`);
    if (!cell) return;

    matrixState.userClicks.push(index);

    if (matrixState.pattern.includes(index)) {
        // Correct click
        cell.style.borderColor = 'var(--accent-green)';
        cell.style.boxShadow = 'inset 0 0 20px rgba(0,255,136,0.15), 0 0 10px rgba(0,255,136,0.1)';
        cell.style.background = 'rgba(0, 255, 136, 0.1)';

        if (matrixState.userClicks.length === matrixState.pattern.length) {
            // Level complete
            matrixState.phase = 'wait';
            matrixState.level++;
            if (matrixState.level > matrixState.record) matrixState.record = matrixState.level;

            const msg = document.getElementById('matrixMessage');
            if (msg) {
                msg.innerText = 'Отлично!';
                msg.style.color = 'var(--accent-green)';
            }
            updateMatrixUI();

            setTimeout(() => {
                startMatrixLevel();
            }, 1000);
        }
    } else {
        // Wrong click
        matrixState.phase = 'wait';
        cell.style.borderColor = 'var(--accent-pink)';
        cell.style.boxShadow = 'inset 0 0 20px rgba(255,0,110,0.15), 0 0 10px rgba(255,0,110,0.1)';
        cell.style.background = 'rgba(255, 0, 110, 0.1)';

        // Show the rest of pattern
        matrixState.pattern.forEach(pIndex => {
            if (!matrixState.userClicks.includes(pIndex)) {
                const pCell = document.querySelector(`.matrix-cell[data-index="${pIndex}"]`);
                if (pCell) {
                    pCell.style.borderColor = 'var(--accent-green)';
                    pCell.style.background = 'rgba(0, 255, 136, 0.05)';
                }
            }
        });

        const msg = document.getElementById('matrixMessage');
        if (msg) {
            msg.innerText = 'Ошибка!';
            msg.style.color = 'var(--accent-pink)';
        }

        setTimeout(() => {
            matrixState.level = 1;
            matrixState.phase = 'idle';
            updateMatrixUI();

            const startBtn = document.getElementById('matrixStartBtn');
            if (startBtn) {
                startBtn.style.display = 'flex';
                startBtn.innerHTML = '↺ Заново';
            }
            const msg = document.getElementById('matrixMessage');
            if (msg) {
                msg.innerText = 'Попробуй еще раз';
                msg.style.color = 'var(--text-secondary)';
            }

            document.querySelectorAll('.matrix-cell').forEach(c => {
                c.style.borderColor = 'rgba(255,255,255,0.02)';
                c.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                c.style.background = 'rgba(20, 20, 35, 0.8)';
            });
        }, 2000);
    }
}

function updateMatrixUI() {
    const lvlEl = document.getElementById('matrixLevel');
    const recEl = document.getElementById('matrixRecord');
    const scoreEl = document.getElementById('matrixScore');
    if (lvlEl) lvlEl.innerText = matrixState.level;
    if (recEl) recEl.innerText = matrixState.record;
    if (scoreEl) scoreEl.innerText = (matrixState.level - 1) * 10;
}
