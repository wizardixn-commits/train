// =============================================
// ЧИСЛА — Sequence Digit Memory
// =============================================
let numbersState = {
    level: 1,
    record: 0,
    sequence: [],
    phase: 'idle',
    moves: 0,
    input: ''
};

function renderNumbers(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-cyan);" class="glow-text">ЧИСЛА</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="numScore">0</div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
            <p id="numMessage" style="font-size: 16px; font-weight: bold; margin-bottom: 30px; color: var(--text-secondary); height: 22px;">Запомни последовательность цифр</p>
            
            <div id="numDisplay" style="min-height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px;">
                <span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: var(--accent-cyan); text-shadow: 0 0 20px rgba(0,229,255,0.5);"></span>
            </div>
            
            <div id="numInput" style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: var(--text-primary); min-height: 50px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
                &nbsp;
            </div>
            
            <div id="numKeypad" style="display: none; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 280px; margin: 0 auto;">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '✓', 0, '⌫'].map(k => `
                    <button class="btn" onclick="handleNumberKey('${k}')" style="font-size: 22px; font-weight: 700; padding: 18px; ${k === '✓' ? 'color: var(--accent-green); border-color: rgba(0,255,136,0.2);' : k === '⌫' ? 'color: var(--accent-pink); border-color: rgba(255,0,110,0.2);' : ''}">${k}</button>
                `).join('')}
            </div>
            
            <div style="margin-top: 30px; display: flex; justify-content: center; gap: 30px; color: var(--text-secondary); font-size: 14px;">
                <div>Уровень: <span id="numLevel" style="color: var(--accent-cyan); font-weight: bold; font-size: 16px;">1</span></div>
                <div>Рекорд: <span id="numRecord" style="color: var(--accent-cyan); font-weight: bold; font-size: 16px;">0</span></div>
            </div>
        </div>
        <div style="position: absolute; bottom: 30px; left: 0; width: 100%; display: flex; justify-content: center; padding: 0 20px;">
            <button class="btn" id="numStartBtn" onclick="startNumbers()" style="flex: 1; background: rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.2); color: var(--accent-cyan);">
                ▶ Старт
            </button>
        </div>
    `;
}

function startNumbers() {
    const len = Math.min(3 + numbersState.level, 12);
    numbersState.sequence = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    numbersState.phase = 'memory';
    numbersState.input = '';

    const startBtn = document.getElementById('numStartBtn');
    if (startBtn) startBtn.style.display = 'none';
    const keypad = document.getElementById('numKeypad');
    if (keypad) keypad.style.display = 'none';

    const display = document.getElementById('numDisplay');
    const msg = document.getElementById('numMessage');

    if (msg) { msg.innerText = 'Запоминай!'; msg.style.color = 'var(--text-primary)'; }
    if (display) display.innerHTML = `<span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: var(--accent-cyan); text-shadow: 0 0 20px rgba(0,229,255,0.5);">${numbersState.sequence.join(' ')}</span>`;

    const shownFor = Math.max(1000, numbersState.sequence.length * 700);

    setTimeout(() => {
        if (display) display.innerHTML = `<span style="font-size: 64px; color: rgba(255,255,255,0.2);">?</span>`;
        if (msg) { msg.innerText = 'Введи последовательность!'; msg.style.color = 'var(--accent-cyan)'; }
        const inp = document.getElementById('numInput');
        if (inp) inp.innerText = '';
        if (keypad) keypad.style.display = 'grid';
        numbersState.phase = 'playing';
    }, shownFor);
}

function handleNumberKey(key) {
    if (numbersState.phase !== 'playing') return;
    if (key === '⌫') {
        numbersState.input = numbersState.input.slice(0, -1);
    } else if (key === '✓') {
        checkNumbers();
        return;
    } else {
        if (numbersState.input.length >= numbersState.sequence.length) return;
        numbersState.input += key;
    }
    const inp = document.getElementById('numInput');
    if (inp) inp.innerText = numbersState.input || '';
}

function checkNumbers() {
    const correct = numbersState.sequence.join('');
    const win = numbersState.input === correct;
    const msg = document.getElementById('numMessage');
    numbersState.phase = 'wait';
    const display = document.getElementById('numDisplay');
    if (display) display.innerHTML = `<span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: var(--accent-cyan);">${correct}</span>`;
    const keypad = document.getElementById('numKeypad');
    if (keypad) keypad.style.display = 'none';

    if (win) {
        if (msg) { msg.innerText = 'Отлично!'; msg.style.color = 'var(--accent-green)'; }
        numbersState.level++;
        if (numbersState.level > numbersState.record) numbersState.record = numbersState.level;
        updateNumbersUI();
        setTimeout(() => startNumbers(), 1500);
    } else {
        if (msg) { msg.innerText = 'Ошибка!'; msg.style.color = 'var(--accent-pink)'; }
        setTimeout(() => {
            numbersState.level = 1;
            numbersState.phase = 'idle';
            updateNumbersUI();
            const startBtn = document.getElementById('numStartBtn');
            if (startBtn) { startBtn.style.display = 'flex'; startBtn.innerHTML = '↺ Заново'; }
            if (msg) { msg.innerText = 'Попробуй ещё раз'; msg.style.color = 'var(--text-secondary)'; }
            if (display) display.innerHTML = '<span style="font-size: 48px; color: rgba(255,255,255,0.2);">?</span>';
        }, 2000);
    }
}

function updateNumbersUI() {
    const lvl = document.getElementById('numLevel');
    const rec = document.getElementById('numRecord');
    const score = document.getElementById('numScore');
    if (lvl) lvl.innerText = numbersState.level;
    if (rec) rec.innerText = numbersState.record;
    if (score) score.innerText = (numbersState.level - 1) * 15;
}
