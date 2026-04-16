// =============================================
// ДОМИНО — Memory Sum Calculation
// =============================================
let dominoState = {
    count: 5,
    tiles: [],
    totalSum: 0,
    startTime: 0,
    phase: 'setup', // setup, showing, input, result
    input: '',
    bestScore: 0,
    showTime: 1500 // Default 1.5s
};

const DOMINO_SET = [];
for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
        DOMINO_SET.push([i, j]);
    }
}

const DOT_MAP = {
    0: [],
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 3, 6, 2, 5, 8]
};

function renderDomino(container) {
    const scores = getUserScores();
    dominoState.bestScore = scores.domino || 0;
    
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <h2 style="margin: 0; color: var(--accent-green);" class="glow-text">ДОМИНО</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="domScore">${dominoState.bestScore}</div>
        </div>
        <div id="dominoContent" style="text-align: center; margin-top: 20px;">
            ${renderSetupPhase()}
        </div>
    `;
}

function renderSetupPhase() {
    return `
        <div class="glass-card" style="margin-top: 40px; padding: 30px 20px;">
            <h3 style="margin-bottom: 20px; color: var(--accent-green);">Сложность</h3>
            <p style="margin-bottom: 30px;">Выберите количество домино (1–28)</p>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 25px;">
                <button class="btn" onclick="adjustCount(-1)" style="width: 50px; height: 50px; padding: 0;">-</button>
                <div id="domCount" style="font-size: 42px; font-weight: 800; color: var(--text-primary); width: 60px;">${dominoState.count}</div>
                <button class="btn" onclick="adjustCount(1)" style="width: 50px; height: 50px; padding: 0;">+</button>
            </div>

            <h3 style="margin-bottom: 15px; color: var(--accent-cyan); font-size: 14px;">Время показа (мс)</h3>
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 40px;">
                <button class="btn" onclick="adjustTime(-100)" style="width: 40px; height: 40px; padding: 0; font-size: 14px;">-</button>
                <input type="number" id="domTimeInput" value="${dominoState.showTime}" onchange="updateTime(this.value)" 
                    style="width: 100px; text-align: center; font-size: 20px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--text-primary); padding: 8px;">
                <button class="btn" onclick="adjustTime(100)" style="width: 40px; height: 40px; padding: 0; font-size: 14px;">+</button>
            </div>
            
            <button class="btn" onclick="startDomino()" style="width: 100%; background: rgba(0,255,136,0.1); border-color: rgba(0,255,136,0.2); color: var(--accent-green);">
                Начать игру
            </button>
        </div>
        <p style="margin-top: 30px; font-size: 11px; opacity: 0.6;">Запомните домино и посчитайте сумму всех точек</p>
    `;
}

function adjustCount(delta) {
    dominoState.count = Math.max(1, Math.min(28, dominoState.count + delta));
    const el = document.getElementById('domCount');
    if (el) el.innerText = dominoState.count;
}

function adjustTime(delta) {
    dominoState.showTime = Math.max(100, Math.min(30000, dominoState.showTime + delta));
    const el = document.getElementById('domTimeInput');
    if (el) el.value = dominoState.showTime;
}

function updateTime(val) {
    let n = parseInt(val);
    if (isNaN(n)) n = 1500;
    dominoState.showTime = Math.max(50, Math.min(60000, n));
    const el = document.getElementById('domTimeInput');
    if (el) el.value = dominoState.showTime;
}

function startDomino() {
    // Pick random tiles
    const shuffled = [...DOMINO_SET].sort(() => Math.random() - 0.5);
    dominoState.tiles = shuffled.slice(0, dominoState.count);
    dominoState.totalSum = dominoState.tiles.reduce((acc, tile) => acc + tile[0] + tile[1], 0);
    dominoState.phase = 'showing';
    dominoState.input = '';

    const content = document.getElementById('dominoContent');
    content.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 20px; color: var(--accent-green);">Запоминай и считай!</p>
        <div class="domino-container" id="tileBox">
            ${dominoState.tiles.map(tile => renderTile(tile[0], tile[1])).join('')}
        </div>
    `;

    // Dynamic timer: 1s base + 0.1s per additional tile, max 5s? 
    // User requested "for a second". Let's do 1.5s as a reasonable base.
    setTimeout(() => {
        showInputPhase();
    }, dominoState.showTime);
}

function renderTile(v1, v2) {
    return `
        <div class="domino">
            <div class="domino-half">
                ${renderDots(v1)}
            </div>
            <div class="domino-divider"></div>
            <div class="domino-half">
                ${renderDots(v2)}
            </div>
        </div>
    `;
}

function renderDots(value) {
    const dots = DOT_MAP[value];
    let html = '';
    for (let i = 0; i < 9; i++) {
        if (dots.includes(i)) {
            html += '<div class="dot"></div>';
        } else {
            html += '<div></div>';
        }
    }
    return html;
}

function showInputPhase() {
    dominoState.phase = 'input';
    const content = document.getElementById('dominoContent');
    content.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 20px; color: var(--accent-cyan);">Какая общая сумма?</p>
        
        <div id="domInput" style="font-size: 42px; font-weight: 800; letter-spacing: 4px; color: var(--text-primary); min-height: 60px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 30px; display: flex; align-items: center; justify-content: center;">
            &nbsp;
        </div>
        
        <div id="domKeypad" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 280px; margin: 0 auto;">
            ${[   '1', '2', '3', 
                  '4', '5', '6', 
                  '7', '8', '9', 
                  '⌫', '0', '✓' ].map(k => `
                <button class="btn" onclick="handleDomKey('${k}')" style="font-size: 22px; font-weight: 700; padding: 18px; ${k === '✓' ? 'color: var(--accent-green); border-color: rgba(0,255,136,0.2);' : k === '⌫' ? 'color: var(--accent-pink); border-color: rgba(255,0,110,0.2);' : ''}">${k}</button>
            `).join('')}
        </div>
    `;
}

function handleDomKey(key) {
    if (dominoState.phase !== 'input') return;
    
    if (key === '⌫') {
        dominoState.input = dominoState.input.slice(0, -1);
    } else if (key === '✓') {
        if (dominoState.input.length > 0) checkDomino();
        return;
    } else {
        if (dominoState.input.length >= 4) return;
        dominoState.input += key;
    }
    
    const inp = document.getElementById('domInput');
    if (inp) inp.innerText = dominoState.input || '\u00A0';
}

function checkDomino() {
    const userSum = parseInt(dominoState.input);
    const win = userSum === dominoState.totalSum;
    dominoState.phase = 'result';
    
    const content = document.getElementById('dominoContent');
    
    if (win) {
        // Calculate dynamic XP/Score: count * 10
        const gain = dominoState.count * 10;
        if (gain > dominoState.bestScore) {
            dominoState.bestScore = gain;
            saveScore('domino', gain);
            const scoreEl = document.getElementById('domScore');
            if (scoreEl) scoreEl.innerText = gain;
        }
        
        content.innerHTML = `
            <div style="margin-top: 40px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: var(--accent-green); margin-bottom: 10px;">ПРАВИЛЬНО!</h2>
                <p style="margin-bottom: 30px;">Сумма: <b>${dominoState.totalSum}</b></p>
                <p style="font-size: 12px; opacity: 0.6;">Продолжаем через 2 сек...</p>
            </div>
        `;
        setTimeout(() => startDomino(), 2000);
    } else {
        content.innerHTML = `
            <div style="margin-top: 40px;">
                <div style="font-size: 60px; margin-bottom: 20px;">❌</div>
                <h2 style="color: var(--accent-pink); margin-bottom: 10px;">ОШИБКА</h2>
                <p style="margin-bottom: 10px;">Ваш ответ: <b>${userSum}</b></p>
                <p style="margin-bottom: 30px;">Правильный ответ: <b style="color: var(--accent-green); font-size: 20px;">${dominoState.totalSum}</b></p>
                <p style="font-size: 12px; opacity: 0.6;">Продолжаем через 2 сек...</p>
            </div>
        `;
        setTimeout(() => startDomino(), 3000); // Give slightly more time for error review
    }
}
