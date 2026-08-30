// =============================================
// СЧЁТ — Quick Mental Math
// =============================================
let mathState = {
    level: 1,
    score: 0,
    record: 0,
    question: null,
    answer: null,
    timerId: null,
    timeLeft: 0,
    phase: 'idle',
    streak: 0
};

function renderMath(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="stopMath(); goBack('math', false)">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-yellow);" class="glow-text">СЧЁТ</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="mathScore">0</div>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 10px 20px; display: inline-block; margin-bottom: 25px;">
                <div id="mathTimer" style="font-size: 13px; color: var(--text-secondary);">Время</div>
                <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin-top: 6px; width: 200px;">
                    <div id="mathTimerBar" style="height: 100%; width: 100%; background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan)); border-radius: 2px; transition: width 0.2s linear;"></div>
                </div>
            </div>
            
            <div id="mathQuestion" style="font-size: 52px; font-weight: 800; margin: 20px 0 40px; color: var(--text-primary); min-height: 80px; display: flex; align-items: center; justify-content: center;">
                ?
            </div>
            
            <div id="mathAnswers" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 320px; margin: 0 auto 30px;">
            </div>
            
            <div style="display: flex; justify-content: center; gap: 30px; color: var(--text-secondary); font-size: 14px;">
                <div>Серия: <span id="mathStreak" style="color: var(--accent-yellow); font-weight: bold;">0</span></div>
                <div>Рекорд: <span id="mathRecord" style="color: var(--accent-yellow); font-weight: bold;">0</span></div>
            </div>
        </div>
        <div style="position: absolute; bottom: 30px; left: 0; width: 100%; padding: 0 20px;">
            <button class="btn" id="mathStartBtn" onclick="startMath()" style="width: 100%; background: rgba(255,183,3,0.1); border-color: rgba(255,183,3,0.2); color: var(--accent-yellow);">
                ▶ Старт
            </button>
        </div>
    `;
}

function startMath() {
    mathState.phase = 'playing';
    mathState.score = 0;
    mathState.streak = 0;
    const startBtn = document.getElementById('mathStartBtn');
    if (startBtn) startBtn.style.display = 'none';
    nextMathQuestion();
}

function stopMath() {
    clearInterval(mathState.timerId);
    mathState.phase = 'idle';
}

function nextMathQuestion() {
    if (mathState.phase !== 'playing') return;
    clearInterval(mathState.timerId);

    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * (mathState.level < 3 ? 2 : 3))];
    let a, b, answer;
    const max = Math.min(10 + mathState.level * 5, 50);

    if (op === '+') { a = rand(1, max); b = rand(1, max); answer = a + b; }
    else if (op === '-') { a = rand(10, max); b = rand(1, a); answer = a - b; }
    else { a = rand(2, Math.min(12, max / 2)); b = rand(2, Math.min(12, max / 2)); answer = a * b; }

    mathState.question = `${a} ${op} ${b}`;
    mathState.answer = answer;

    // Generate wrong answers
    const wrongs = new Set();
    while (wrongs.size < 3) {
        const delta = Math.floor(Math.random() * 10) - 5;
        const wrong = answer + delta;
        if (wrong !== answer && wrong >= 0) wrongs.add(wrong);
    }

    const options = shuffle([answer, ...wrongs]);

    const qEl = document.getElementById('mathQuestion');
    if (qEl) qEl.innerText = mathState.question;

    const aEl = document.getElementById('mathAnswers');
    if (aEl) aEl.innerHTML = options.map(opt => `
        <button class="btn" onclick="answerMath(${opt})" style="font-size: 24px; font-weight: 700; padding: 20px; background: rgba(255,255,255,0.03);">${opt}</button>
    `).join('');

    // Timer
    const timeLimit = Math.max(6000, 10000 - mathState.score * 100);
    mathState.timeLeft = timeLimit;
    const startTs = Date.now();

    mathState.timerId = setInterval(() => {
        const elapsed = Date.now() - startTs;
        const remaining = Math.max(0, timeLimit - elapsed);
        const pct = (remaining / timeLimit) * 100;
        const bar = document.getElementById('mathTimerBar');
        if (bar) bar.style.width = pct + '%';
        const tEl = document.getElementById('mathTimer');
        if (tEl) tEl.innerText = (remaining / 1000).toFixed(1) + ' с';

        if (remaining <= 0) {
            clearInterval(mathState.timerId);
            handleMathTimeout();
        }
    }, 50);
}

function answerMath(val) {
    clearInterval(mathState.timerId);
    const btns = document.querySelectorAll('#mathAnswers .btn');
    const isCorrect = val === mathState.answer;

    btns.forEach(btn => {
        if (parseInt(btn.textContent) === mathState.answer) {
            btn.style.background = 'rgba(0,255,136,0.2)';
            btn.style.borderColor = 'rgba(0,255,136,0.4)';
        }
        if (parseInt(btn.textContent) === val && !isCorrect) {
            btn.style.background = 'rgba(255,0,110,0.2)';
            btn.style.borderColor = 'rgba(255,0,110,0.4)';
        }
        btn.onclick = null;
    });

    if (isCorrect) {
        mathState.score++;
        mathState.streak++;
        if (mathState.score > mathState.record) {
            mathState.record = mathState.score;
            saveScore('math', mathState.record);
        }
        if (mathState.streak % 5 === 0) mathState.level++;
    } else {
        mathState.streak = 0;
        endMath();
        return;
    }

    updateMathUI();
    setTimeout(nextMathQuestion, 500);
}

function handleMathTimeout() {
    mathState.streak = 0;
    endMath();
}

function endMath() {
    mathState.phase = 'idle';
    const qEl = document.getElementById('mathQuestion');
    if (qEl) qEl.innerHTML = `<span style="font-size: 24px; color: var(--accent-pink);">Игра окончена!<br><span style="color: var(--text-secondary); font-size: 16px;">Счёт: ${mathState.score}</span></span>`;
    const aEl = document.getElementById('mathAnswers');
    if (aEl) aEl.innerHTML = '';
    const startBtn = document.getElementById('mathStartBtn');
    if (startBtn) { startBtn.style.display = 'flex'; startBtn.innerHTML = '↺ Ещё раз'; }
    mathState.level = 1;
    mathState.score = 0;
    updateMathUI();
}

function updateMathUI() {
    const sEl = document.getElementById('mathScore');
    const stEl = document.getElementById('mathStreak');
    const rEl = document.getElementById('mathRecord');
    if (sEl) sEl.innerText = mathState.score;
    if (stEl) stEl.innerText = mathState.streak;
    if (rEl) rEl.innerText = mathState.record;
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }
