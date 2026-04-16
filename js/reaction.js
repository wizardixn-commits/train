// =============================================
// РЕАКЦИЯ — Tap the target as fast as possible
// =============================================
let reactionState = {
    phase: 'idle',
    fastest: 0,
    attempts: [],
    timerId: null,
    startTime: 0,
    round: 0,
    maxRounds: 5
};

function renderReaction(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="stopReaction(); navigate('dashboard')">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-green);" class="glow-text">РЕАКЦИЯ</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="reactionBest">—</div>
        </div>
        <p style="text-align: center; font-size: 14px; color: var(--text-secondary); margin-bottom: 30px;">Жми как только загорится зелёный!</p>
        
        <div id="reactionArea" onclick="handleReactionTap()" 
            style="width: 100%; height: 300px; border-radius: 24px; background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.05); 
            display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; 
            transition: background 0.2s, border-color 0.2s; margin-bottom: 30px; user-select: none;">
            <div style="font-size: 64px; margin-bottom: 10px;">🎯</div>
            <div id="reactionText" style="font-size: 20px; font-weight: 700; color: var(--text-secondary);">Нажми чтобы начать</div>
            <div id="reactionTime" style="font-size: 36px; font-weight: 800; color: var(--accent-green); margin-top: 10px;"></div>
        </div>
        
        <div id="reactionResults" style="display: flex; flex-direction: column; gap: 8px;"></div>
        
        <div style="display: flex; justify-content: center; gap: 30px; color: var(--text-secondary); font-size: 14px; margin-top: 30px;">
            <div>Попытка: <span id="reactionRound" style="color: var(--accent-green); font-weight: bold;">0</span>/5</div>
            <div>Лучшее: <span id="reactionBestMs" style="color: var(--accent-yellow); font-weight: bold;">—</span></div>
        </div>
    `;
}

function handleReactionTap() {
    const area = document.getElementById('reactionArea');
    const text = document.getElementById('reactionText');

    if (reactionState.phase === 'idle') {
        // Start waiting
        reactionState.phase = 'waiting';
        reactionState.round = 0;
        reactionState.attempts = [];
        reactionState.fastest = Infinity;
        if (area) { area.style.background = 'rgba(255,183,3,0.08)'; area.style.borderColor = 'rgba(255,183,3,0.3)'; }
        if (text) { text.innerText = 'Приготовься...'; text.style.color = 'var(--accent-yellow)'; }
        updateReactionResults();
        scheduleReactionGo();
    } else if (reactionState.phase === 'waiting') {
        // Too early!
        clearTimeout(reactionState.timerId);
        if (area) { area.style.background = 'rgba(255,0,110,0.12)'; area.style.borderColor = 'rgba(255,0,110,0.5)'; }
        if (text) { text.style.color = 'var(--accent-pink)'; text.innerText = 'Слишком рано! Жди зелёного...'; }
        setTimeout(() => {
            if (area) { area.style.background = 'rgba(255,183,3,0.08)'; area.style.borderColor = 'rgba(255,183,3,0.3)'; }
            if (text) { text.innerText = 'Приготовься...'; text.style.color = 'var(--accent-yellow)'; }
            scheduleReactionGo();
        }, 1200);
    } else if (reactionState.phase === 'go') {
        // Valid tap
        const elapsed = Date.now() - reactionState.startTime;
        reactionState.phase = 'waiting';
        reactionState.round++;
        reactionState.attempts.push(elapsed);
        if (elapsed < reactionState.fastest) reactionState.fastest = elapsed;

        if (area) { area.style.background = 'rgba(0,229,255,0.06)'; area.style.borderColor = 'rgba(0,229,255,0.2)'; }
        if (text) { text.innerText = `${elapsed} мс!`; text.style.color = 'var(--accent-cyan)'; }
        const tEl = document.getElementById('reactionTime');
        if (tEl) tEl.innerText = '';

        updateReactionResults();

        if (reactionState.round >= reactionState.maxRounds) {
            // Session done
            reactionState.phase = 'done';
            const avg = Math.round(reactionState.attempts.reduce((a, b) => a + b, 0) / reactionState.attempts.length);
            if (area) { area.style.background = 'rgba(0,255,136,0.06)'; area.style.borderColor = 'rgba(0,255,136,0.3)'; }
            if (text) { text.innerText = `Среднее: ${avg} мс. Нажми заново!`; text.style.color = 'var(--accent-green)'; }
            reactionState.phase = 'idle';
            updateReactionBest();
        } else {
            if (area) { area.style.background = 'rgba(255,183,3,0.08)'; area.style.borderColor = 'rgba(255,183,3,0.3)'; }
            if (text) { text.innerText = 'Приготовься...'; text.style.color = 'var(--accent-yellow)'; }
            scheduleReactionGo();
        }
    } else if (reactionState.phase === 'done') {
        reactionState.phase = 'idle';
        const area = document.getElementById('reactionArea');
        const text = document.getElementById('reactionText');
        if (area) { area.style.background = 'rgba(255,255,255,0.03)'; area.style.borderColor = 'rgba(255,255,255,0.05)'; }
        if (text) { text.innerText = 'Нажми чтобы начать'; text.style.color = 'var(--text-secondary)'; }
    }
}

function scheduleReactionGo() {
    const delay = 1500 + Math.random() * 3000;
    reactionState.timerId = setTimeout(() => {
        reactionState.phase = 'go';
        reactionState.startTime = Date.now();
        const area = document.getElementById('reactionArea');
        const text = document.getElementById('reactionText');
        if (area) { area.style.background = 'rgba(0,255,136,0.15)'; area.style.borderColor = 'rgba(0,255,136,0.7)'; }
        if (text) { text.innerText = 'ЖМИ!'; text.style.color = 'var(--accent-green)'; text.style.fontSize = '32px'; }
    }, delay);
}

function stopReaction() {
    clearTimeout(reactionState.timerId);
    reactionState.phase = 'idle';
}

function updateReactionResults() {
    const el = document.getElementById('reactionResults');
    const roundEl = document.getElementById('reactionRound');
    if (roundEl) roundEl.innerText = reactionState.round;
    if (!el) return;
    el.innerHTML = reactionState.attempts.map((ms, i) => {
        const color = ms < 250 ? 'var(--accent-green)' : ms < 350 ? 'var(--accent-yellow)' : 'var(--accent-pink)';
        return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; background: rgba(255,255,255,0.03); border-radius: 10px;">
            <span style="color: var(--text-secondary);">Попытка ${i + 1}</span>
            <span style="font-weight: bold; color: ${color};">${ms} мс</span>
        </div>`;
    }).join('');
}

function updateReactionBest() {
    const bEl = document.getElementById('reactionBestMs');
    const bEl2 = document.getElementById('reactionBest');
    if (reactionState.fastest !== Infinity) {
        if (bEl) bEl.innerText = `${reactionState.fastest} мс`;
        if (bEl2) bEl2.innerText = `${reactionState.fastest}мс`;
    }
}
