// ============================================================
// ПОЙМАЙ КРУГ — Circle Catch Reflex Game
// ============================================================

let catchCircleState = {
    isPlaying: false,
    score: 0,
    misses: 0,
    maxMisses: 3,
    speed: 2.2,           // px per frame
    circleR: 36,
    x: 0, y: 0,
    dx: 0, dy: 0,
    animId: null,
    startTime: 0,
    elapsed: 0,
    canvas: null,
    ctx: null,
    level: 'normal',
    trail: [],
    trailLen: 10,
    hue: 180
};

const CC_LEVELS = {
    easy:   { speed: 1.6, label: 'Лёгкий',   icon: '🐢', r: 42 },
    normal: { speed: 2.2, label: 'Обычный',   icon: '🐇', r: 36 },
    hard:   { speed: 3.4, label: 'Сложный',   icon: '🐆', r: 28 },
    pro:    { speed: 5.0, label: 'Про',        icon: '🚀', r: 22 }
};

function renderCatchCircle(container) {
    const st = catchCircleState;
    if (st.animId) { cancelAnimationFrame(st.animId); st.animId = null; }
    st.isPlaying = false;

    const scores = getUserScores();
    const best = scores.catch_circle || 0;

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('catch_circle', catchCircleState.isPlaying)">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#00e5ff;" class="glow-text">ПОЙМАЙ КРУГ</h2>
                <span style="font-size:11px;color:var(--text-secondary);">СКОРОСТЬ РЕАКЦИИ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">⭐ ${best}</div>
        </div>

        <div class="glass-card" style="text-align:center;padding:20px 16px;margin-bottom:16px;border-color:rgba(0,229,255,0.25);background:radial-gradient(circle at 50% 30%,rgba(0,229,255,0.08) 0%,var(--card-bg) 70%);">
            <div style="font-size:52px;margin-bottom:8px;">🎯</div>
            <h3 style="color:var(--accent-cyan);margin-bottom:6px;">Поймай убегающий круг!</h3>
            <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;max-width:300px;margin:0 auto;">
                Нажимай на круг как можно быстрее. После каждого попадания он ускоряется!<br>
                <b style="color:var(--accent-green);">3 промаха</b> — игра заканчивается.
            </p>
        </div>

        <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Выбери уровень:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px;">
            ${Object.entries(CC_LEVELS).map(([key, cfg]) => `
                <div class="glass-card" onclick="ccSelectLevel('${key}')" id="cc-lv-${key}"
                     style="padding:12px;cursor:pointer;text-align:center;border-color:${key === st.level ? 'rgba(0,229,255,0.5)' : 'rgba(255,255,255,0.06)'};background:${key === st.level ? 'rgba(0,229,255,0.1)' : 'transparent'};">
                    <div style="font-size:22px;margin-bottom:4px;">${cfg.icon}</div>
                    <div style="font-size:13px;font-weight:700;color:${key === st.level ? 'var(--accent-cyan)' : 'var(--text-primary)'};">${cfg.label}</div>
                </div>
            `).join('')}
        </div>

        <button class="btn" id="ccStartBtn" onclick="ccStartGame()"
                style="width:100%;padding:16px;font-size:17px;font-weight:800;background:linear-gradient(135deg,rgba(0,229,255,0.2),rgba(0,255,136,0.15));border-color:rgba(0,229,255,0.4);color:var(--accent-cyan);box-shadow:0 0 20px rgba(0,229,255,0.15);">
            🎯 Начать игру
        </button>
    `;
}

function ccSelectLevel(key) {
    catchCircleState.level = key;
    document.querySelectorAll('[id^="cc-lv-"]').forEach(el => {
        const k = el.id.replace('cc-lv-', '');
        const active = k === key;
        el.style.borderColor = active ? 'rgba(0,229,255,0.5)' : 'rgba(255,255,255,0.06)';
        el.style.background = active ? 'rgba(0,229,255,0.1)' : 'transparent';
        el.querySelector('div:last-child').style.color = active ? 'var(--accent-cyan)' : 'var(--text-primary)';
    });
}

function ccStartGame() {
    const st = catchCircleState;
    const lvCfg = CC_LEVELS[st.level];
    st.score = 0;
    st.misses = 0;
    st.speed = lvCfg.speed;
    st.circleR = lvCfg.r;
    st.trail = [];
    st.hue = 180;
    st.isPlaying = true;

    const container = document.getElementById('catch_circle');
    if (!container) return;

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('catch_circle', catchCircleState.isPlaying)">←</div>
            <div style="display:flex;gap:16px;align-items:center;">
                <span style="font-size:14px;font-weight:800;color:var(--accent-cyan);">⭐ <span id="cc-score">0</span></span>
                <span style="font-size:14px;font-weight:800;color:var(--accent-green);">💨 <span id="cc-speed">${lvCfg.speed.toFixed(1)}</span></span>
                <span id="cc-misses" style="font-size:14px;font-weight:800;color:#f43f5e;">❤️ ${st.maxMisses}</span>
            </div>
        </div>
        <div id="cc-arena" style="position:relative;width:100%;overflow:hidden;border-radius:16px;border:2px solid rgba(0,229,255,0.2);touch-action:none;user-select:none;background:radial-gradient(circle at 50% 50%,rgba(0,10,20,0.9) 0%,rgba(0,0,0,0.97) 100%);">
            <canvas id="cc-canvas" style="display:block;width:100%;"></canvas>
        </div>
        <div style="text-align:center;font-size:11px;color:var(--text-secondary);margin-top:8px;opacity:0.6;">
            Нажимай на круг — после каждого попадания он ускоряется!
        </div>
    `;

    const arena = document.getElementById('cc-arena');
    const canvas = document.getElementById('cc-canvas');
    const W = arena.clientWidth;
    const H = Math.min(window.innerHeight * 0.62, 460);
    arena.style.height = H + 'px';
    canvas.width = W;
    canvas.height = H;
    st.canvas = canvas;
    st.ctx = canvas.getContext('2d');

    // spawn circle
    st.x = W / 2;
    st.y = H / 2;
    const angle = Math.random() * Math.PI * 2;
    st.dx = Math.cos(angle) * st.speed;
    st.dy = Math.sin(angle) * st.speed;

    // Events
    canvas.addEventListener('pointerdown', ccHandleClick);

    st.animId = requestAnimationFrame(ccLoop);
}

function ccLoop() {
    const st = catchCircleState;
    if (!st.isPlaying || !st.canvas) return;
    const canvas = st.canvas;
    const ctx = st.ctx;
    const W = canvas.width;
    const H = canvas.height;
    const r = st.circleR;

    // Move
    st.x += st.dx;
    st.y += st.dy;

    // Bounce walls
    let missed = false;
    if (st.x - r < 0) { st.dx = Math.abs(st.dx); }
    if (st.x + r > W) { st.dx = -Math.abs(st.dx); }
    if (st.y - r < 0) { st.dy = Math.abs(st.dy); }
    if (st.y + r > H) { st.dy = -Math.abs(st.dy); }

    // Trail
    st.trail.push({ x: st.x, y: st.y });
    if (st.trail.length > st.trailLen) st.trail.shift();

    // Cycle hue slowly
    st.hue = (st.hue + 0.5) % 360;

    // Draw
    ctx.clearRect(0, 0, W, H);

    // Draw trail
    st.trail.forEach((pt, i) => {
        const alpha = (i / st.trail.length) * 0.25;
        const tr = r * (i / st.trail.length) * 0.8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(tr, 4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${st.hue}, 100%, 70%, ${alpha})`;
        ctx.fill();
    });

    // Outer glow ring
    const grad = ctx.createRadialGradient(st.x, st.y, r * 0.5, st.x, st.y, r * 1.6);
    grad.addColorStop(0, `hsla(${st.hue}, 100%, 70%, 0.15)`);
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(st.x, st.y, r * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Main circle
    const mainGrad = ctx.createRadialGradient(st.x - r * 0.3, st.y - r * 0.3, r * 0.05, st.x, st.y, r);
    mainGrad.addColorStop(0, `hsl(${st.hue}, 100%, 90%)`);
    mainGrad.addColorStop(0.6, `hsl(${st.hue}, 90%, 60%)`);
    mainGrad.addColorStop(1, `hsl(${(st.hue + 60) % 360}, 80%, 40%)`);
    ctx.beginPath();
    ctx.arc(st.x, st.y, r, 0, Math.PI * 2);
    ctx.fillStyle = mainGrad;
    ctx.fill();

    // Shine
    ctx.beginPath();
    ctx.arc(st.x - r * 0.28, st.y - r * 0.28, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fill();

    // Speed indicator inside
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.font = `bold ${Math.round(r * 0.42)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('×' + st.score, st.x, st.y + r * 0.08);

    st.animId = requestAnimationFrame(ccLoop);
}

function ccHandleClick(e) {
    const st = catchCircleState;
    if (!st.isPlaying || !st.canvas) return;

    const rect = st.canvas.getBoundingClientRect();
    const scaleX = st.canvas.width / rect.width;
    const scaleY = st.canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const dx = px - st.x;
    const dy = py - st.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= st.circleR + 12) {
        // Hit!
        st.score++;
        st.speed += 0.22;            // faster after each catch
        if (st.circleR > 16) st.circleR -= 0.5; // slightly shrinks

        // Update speed vector magnitude
        const angle = Math.atan2(st.dy, st.dx);
        st.dx = Math.cos(angle) * st.speed;
        st.dy = Math.sin(angle) * st.speed;

        // Bounce away from click
        const escAngle = Math.atan2(st.y - py, st.x - px) + (Math.random() - 0.5) * 0.6;
        st.dx = Math.cos(escAngle) * st.speed;
        st.dy = Math.sin(escAngle) * st.speed;

        // Update UI
        const scoreEl = document.getElementById('cc-score');
        if (scoreEl) scoreEl.textContent = st.score;
        const speedEl = document.getElementById('cc-speed');
        if (speedEl) speedEl.textContent = st.speed.toFixed(1);

        // Flash
        ccFlash('#00ff88');

        // Sound
        ccPlaySound('catch');

    } else {
        // Miss!
        st.misses++;
        ccFlash('#f43f5e');
        ccPlaySound('miss');

        const missEl = document.getElementById('cc-misses');
        const lives = Math.max(0, st.maxMisses - st.misses);
        if (missEl) missEl.textContent = '❤️ '.repeat(lives) || '💔';

        if (st.misses >= st.maxMisses) {
            ccEndGame();
        }
    }
}

function ccFlash(color) {
    const canvas = catchCircleState.canvas;
    if (!canvas) return;
    const ctx = catchCircleState.ctx;
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = color + '22';
    ctx.fillRect(0, 0, W, H);
}

function ccPlaySound(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const t = ctx.currentTime;
        if (type === 'catch') {
            [600, 900, 1200].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t + i * 0.05);
                gain.gain.setValueAtTime(0.18, t + i * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.15);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(t + i * 0.05); osc.stop(t + i * 0.05 + 0.16);
            });
        } else {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, t);
            osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t); osc.stop(t + 0.2);
        }
        setTimeout(() => ctx.close(), 500);
    } catch (e) {}
}

function ccEndGame() {
    const st = catchCircleState;
    st.isPlaying = false;
    if (st.animId) { cancelAnimationFrame(st.animId); st.animId = null; }
    if (st.canvas) st.canvas.removeEventListener('pointerdown', ccHandleClick);

    // Remove any existing overlay
    const existing = document.getElementById('ccEndOverlay');
    if (existing) existing.remove();

    // Save best score
    const scores = getUserScores();
    const prev = scores.catch_circle || 0;
    if (st.score > prev) saveScore('catch_circle', st.score);

    const isRecord = st.score > prev;

    const overlay = document.createElement('div');
    overlay.id = 'ccEndOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(12px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    overlay.innerHTML = `
        <div style="font-size:64px;margin-bottom:12px;">${isRecord ? '🏆' : '🎯'}</div>
        <div style="font-size:26px;font-weight:800;color:${isRecord ? 'var(--accent-yellow)' : 'var(--accent-cyan)'};margin-bottom:6px;">
            ${isRecord ? 'Новый рекорд!' : 'Игра окончена!'}
        </div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">Поймано: <b style="color:var(--accent-cyan);">${st.score}</b></div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:18px;">Скорость: <b>${st.speed.toFixed(1)}</b> · Уровень: <b>${CC_LEVELS[st.level].label}</b></div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="ccBtnPlayAgain"
                style="padding:14px;font-size:15px;font-weight:700;color:var(--accent-cyan);border-color:rgba(0,229,255,0.4);">
                🔄 Играть снова
            </button>
            <button class="btn" id="ccBtnSettings"
                style="padding:14px;font-size:15px;color:var(--text-secondary);">
                ⚙️ Сменить уровень
            </button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('ccBtnPlayAgain').onclick = () => {
        overlay.remove();
        ccStartGame();
    };
    document.getElementById('ccBtnSettings').onclick = () => {
        overlay.remove();
        navigate('catch_circle');
    };
}
