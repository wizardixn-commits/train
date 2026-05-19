function renderDashboard(container) {
    const user = getUser();
    const scores = getUserScores();

    container.innerHTML = `
        <!-- User header with theme toggle -->
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; margin-top:6px;">
            <div style="font-size:42px; line-height:1;">${user ? user.avatar : '🧠'}</div>
            <div style="flex:1; min-width:0;">
                <div style="font-size:19px; font-weight:800; color:var(--accent-cyan);">${user ? user.name : 'Гость'}</div>
                <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">🔥 7 дней · Ур.11 · 2069 XP</div>
            </div>
            <div class="theme-toggle" id="themeToggleBtn" onclick="toggleTheme()" title="Сменить тему">
                ${(localStorage.getItem('trainbrain_theme') || 'dark') === 'dark' ? '☀️' : '🌙'}
            </div>
            <button class="btn" onclick="logoutUser()" style="padding:9px 12px; font-size:12px; background:transparent; border-color:var(--card-border);" title="Выйти">
                ⇥
            </button>
        </div>

        <div style="text-align:center; margin-bottom:22px;">
            <h1 style="color:var(--accent-cyan); font-size:25px;" class="glow-text">НЕЙРО СТАРТ</h1>
            <p style="letter-spacing:2px; font-size:10px; text-transform:uppercase; margin-top:4px; color:var(--text-secondary); opacity:0.6;">Тренируй мозг и тело</p>
        </div>

        <!-- Random break -->
        <div class="glass-card" onclick="randomGame()" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer; border-color:rgba(0,255,136,0.25); margin-bottom:20px;">
            <div>
                <h3 style="margin-bottom:4px;">Случайный перерыв</h3>
                <p style="font-size:12px;">Игра или упражнение — на удачу</p>
            </div>
            <div style="width:40px;height:40px;border-radius:10px;background:rgba(0,255,136,0.1);display:flex;align-items:center;justify-content:center;color:var(--accent-green); font-size:22px;">
                🎲
            </div>
        </div>

        <!-- Tabs -->
        <div style="display:flex; background:rgba(0,0,0,0.15); border-radius:12px; padding:4px; margin-bottom:18px; border:1px solid var(--card-border);">
            <div id="tabBrain" onclick="switchTab('brain')" style="flex:1;text-align:center;padding:10px 4px;background:var(--card-bg);border-radius:10px;color:var(--accent-green);font-weight:700;cursor:pointer;transition:all 0.2s;font-size:14px;">🧠 Мозг</div>
            <div id="tabBody"  onclick="switchTab('body')"  style="flex:1;text-align:center;padding:10px 4px;color:var(--text-secondary);cursor:pointer;transition:all 0.2s;font-size:14px;">💪 Тело</div>
            <div id="tabSoul"  onclick="switchTab('soul')"  style="flex:1;text-align:center;padding:10px 4px;color:var(--text-secondary);cursor:pointer;transition:all 0.2s;font-size:14px;">🌸 Душа</div>
        </div>

        <!-- Brain games -->
        <div id="brainGames">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
                ${gc('matrix', 'ПАМЯТЬ', 'Матрица', 'Зрительная память', '🔲', scores.matrix)}
                ${gc('numbers', 'ПАМЯТЬ', 'Числа', 'Числовая память', '🔢', scores.numbers)}
                ${gc('pairs', 'ПАМЯТЬ', 'Пары', 'Перевёртыши — найди пары', '🃏', scores.pairs ? scores.pairs + 'х' : null)}
                ${gc('simon', 'ПАМЯТЬ', 'Симон', 'Паттерн цветов', '🟢', scores.simon)}
                ${gc('domino', 'ПАМЯТЬ', 'Домино', 'Сумма точек домино', '🁫', scores.domino)}
                ${gc('emoji', 'ПАМЯТЬ', 'Смайлы', 'Память на положение', '🎭', scores.emoji)}
                ${gc('solfeggio', 'СЛУХ', 'Ноты', 'Угадай ноту на слух', '🎵', scores.solfeggio)}
                ${gc('schulte', 'ВНИМАНИЕ', 'Шульте', 'Таблица концентрации', '🔍', scores.schulte ? scores.schulte + 'с' : null)}
                ${gc('reaction', 'ВНИМАНИЕ', 'Реакция', 'Скорость реакции', '⚡', scores.reaction ? scores.reaction + 'мс' : null)}
                ${gc('stroop', 'КОГНИЦИЯ', 'Строп', 'Тест цвета и слова', '🎨', scores.stroop)}
                ${gc('math', 'ИНТЕЛЛЕКТ', 'Счёт', 'Быстрый устный счёт', '🧮', scores.math)}
                ${gc('flow', 'ПРОСТРАНСТВО', 'Флоу', 'Соедини точки', '〰️', null)}
                ${gc('flasks', 'МОТОРИКА', 'Колбы', 'Логика и стратегия', '🧪', scores.flasks ? scores.flasks + 'х' : null)}
            </div>
        </div>

        <!-- Soul tab content -->
        <div id="soulBtn" style="display:none;">
            <div class="glass-card" onclick="navigate('soul')" style="display:flex;align-items:center;gap:15px;padding:20px;cursor:pointer;border-color:rgba(232,121,249,0.2);margin-bottom:15px;">
                <div style="font-size:36px;">🌸</div>
                <div style="flex:1;">
                    <h3 style="margin-bottom:5px;color:#e879f9;">Эмоциональный интеллект</h3>
                    <p style="font-size:12px;">6 практик для развития EQ</p>
                </div>
                ›
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                ${[['🎡', 'Колесо эмоций'], ['🧪', 'Тест эмоций'], ['🙏', 'Благодарность'], ['✨', 'Аффирмации']].map(([ic, nm]) =>
        `<div class="glass-card" onclick="navigate('soul')" style="padding:16px;cursor:pointer;text-align:center;border-color:rgba(232,121,249,0.1);">
                        <div style="font-size:28px;margin-bottom:8px;">${ic}</div>
                        <div style="font-size:13px;font-weight:600;">${nm}</div>
                    </div>`
    ).join('')}
            </div>
        </div>

        <!-- Body tab content -->
        <div id="bodyBtn" style="display:none;">
            <div class="glass-card" onclick="navigate('body')" style="display:flex;align-items:center;gap:15px;padding:20px;cursor:pointer;border-color:rgba(255,0,110,0.2);margin-bottom:15px;">
                <div style="font-size:36px;">💪</div>
                <div style="flex:1;">
                    <h3 style="margin-bottom:5px;color:var(--accent-pink);">Физические упражнения</h3>
                    <p style="font-size:12px;">16 упражнений для тела и ума</p>
                </div>
                ›
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                ${[['🧘', 'Планка', '60с'], ['🌬️', 'Дыхание', '90с'], ['💪', 'Отжимания', '30с'], ['🧘‍♂️', 'Медитация', '2м']].map(([ic, nm, dur]) =>
        `<div class="glass-card" onclick="navigate('body')" style="padding:16px;cursor:pointer;text-align:center;border-color:rgba(255,183,3,0.1);">
                        <div style="font-size:28px;margin-bottom:8px;">${ic}</div>
                        <div style="font-size:14px;font-weight:600;">${nm}</div>
                        <div style="font-size:11px;color:var(--text-secondary);">${dur}</div>
                    </div>`
    ).join('')}
            </div>
        </div>

        <!-- XP bar -->
        <div class="glass-card" style="display:flex;align-items:center;gap:14px;padding:14px 18px;margin-top:22px;margin-bottom:22px;">
            <div style="background:rgba(0,255,136,0.12);padding:5px 13px;border-radius:20px;font-weight:bold;color:var(--accent-green);font-size:13px;">Ур. 11</div>
            <div style="flex:1;height:5px;background:rgba(0,0,0,0.1);border-radius:3px;overflow:hidden;">
                <div style="width:40%;height:100%;background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan));border-radius:3px;"></div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:11px;color:var(--text-secondary);margin-bottom:1px;">2069 XP</div>
                <div style="font-size:12px;font-weight:bold;color:var(--accent-yellow);">🔥 7 дней</div>
            </div>
        </div>

        <button class="btn" id="progressBtn" onclick="toggleProgress()" style="width:100%;margin-bottom:25px;">Мой прогресс</button>

        <div id="progressSection" style="display:none;">
            <div style="text-align:center;margin-bottom:25px;">
                <canvas id="statsChart" width="300" height="300" style="margin:0 auto;max-width:100%;"></canvas>
            </div>
            <div class="stats-list" style="margin-bottom:25px;">
                ${statBar('Память', 'var(--accent-green)', Math.min((scores.matrix || 0) + (scores.numbers || 0) + (scores.pairs || 0), 100), 100)}
                ${statBar('Внимание', 'var(--accent-cyan)', scores.schulte ? Math.max(200 - scores.schulte, 0) : 0, 200)}
                ${statBar('Когниция', 'var(--accent-purple)', scores.stroop || 0, 60)}
                ${statBar('Интеллект', 'var(--accent-yellow)', scores.math || 0, 30)}
                ${statBar('Тело', 'var(--accent-pink)', (scores.body || 0) * 6.25, 100)}
            </div>
        </div>

        <div class="glass-card" style="padding:14px;text-align:center;font-size:12px;color:var(--text-secondary);font-style:italic;opacity:0.7;">
            20 секунд отдыха каждые 7.5 минут стабилизируют когнитивную производительность
        </div>
    `;
}

/* ── Game card helper ── */
function gc(route, cat, title, desc, emoji, best) {
    const bestStr = (best !== undefined && best !== null) ? `<div style="position:absolute;top:8px;right:10px;font-size:10px;color:var(--accent-yellow);font-weight:700;background:rgba(255,183,3,0.1);padding:2px 7px;border-radius:8px;">↑${best}</div>` : '';
    return `
        <div class="glass-card game-card" onclick="navigate('${route}')" style="padding:15px 13px;display:flex;flex-direction:column;justify-content:space-between;min-height:110px;cursor:pointer;position:relative;">
            ${bestStr}
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7px;">
                <span style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);">${cat}</span>
                <span style="font-size:18px;">${emoji}</span>
            </div>
            <div>
                <div style="font-weight:700;font-size:15px;margin-bottom:3px;">${title}</div>
                <div style="font-size:10px;color:var(--text-secondary);line-height:1.4;">${desc}</div>
            </div>
        </div>`;
}

/* ── Tab switch ── */
function switchTab(tab) {
    const brain = document.getElementById('brainGames');
    const body = document.getElementById('bodyBtn');
    const soul = document.getElementById('soulBtn');
    const tB = document.getElementById('tabBrain');
    const tO = document.getElementById('tabBody');
    const tS = document.getElementById('tabSoul');
    [brain, body, soul].forEach(el => { if (el) el.style.display = 'none'; });
    [tB, tO, tS].forEach(el => { if (el) { el.style.background = 'transparent'; el.style.color = 'var(--text-secondary)'; el.style.borderRadius = ''; } });
    if (tab === 'brain') {
        if (brain) brain.style.display = 'block';
        if (tB) { tB.style.background = 'var(--card-bg)'; tB.style.color = 'var(--accent-green)'; tB.style.borderRadius = '10px'; }
    } else if (tab === 'body') {
        if (body) body.style.display = 'block';
        if (tO) { tO.style.background = 'var(--card-bg)'; tO.style.color = 'var(--accent-pink)'; tO.style.borderRadius = '10px'; }
    } else {
        if (soul) soul.style.display = 'block';
        if (tS) { tS.style.background = 'var(--card-bg)'; tS.style.color = '#e879f9'; tS.style.borderRadius = '10px'; }
    }
}

/* ── Progress section toggle ── */
function toggleProgress() {
    const s = document.getElementById('progressSection');
    const b = document.getElementById('progressBtn');
    if (!s) return;
    const show = s.style.display === 'none' || !s.style.display;
    s.style.display = show ? 'block' : 'none';
    if (b) b.innerText = show ? 'Скрыть прогресс ▲' : 'Мой прогресс';
    if (show) setTimeout(initChart, 80);
}

/* ── Random game ── */
function randomGame() {
    const all = ['matrix', 'numbers', 'pairs', 'simon', 'domino', 'emoji', 'solfeggio', 'schulte', 'reaction', 'stroop', 'math', 'flow', 'flasks', 'body', 'soul'];
    navigate(all[Math.floor(Math.random() * all.length)]);
}

/* ── Stat bar ── */
function statBar(name, color, value, max) {
    const pct = Math.min(Math.round((value / max) * 100), 100);
    return `
        <div style="display:flex;align-items:center;margin-bottom:14px;font-size:13px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${color};margin-right:10px;flex-shrink:0;box-shadow:0 0 6px ${color};"></div>
            <div style="width:85px;color:var(--text-secondary);flex-shrink:0;">${name}</div>
            <div style="flex:1;height:4px;background:rgba(0,0,0,0.1);border-radius:2px;margin:0 10px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:${color};border-radius:2px;box-shadow:0 0 6px ${color};"></div>
            </div>
            <div style="font-weight:bold;color:${color};min-width:28px;text-align:right;">${value}</div>
        </div>`;
}

/* ── Radar chart ── */
function initChart() {
    const ctx = document.getElementById('statsChart');
    if (!ctx) return;
    if (ctx._chartInstance) { ctx._chartInstance.destroy(); ctx._chartInstance = null; }
    const scores = getUserScores();
    const isDark = (localStorage.getItem('trainbrain_theme') || 'dark') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const labelColors = ['#00ff88', '#00e5ff', '#9d4edd', '#ffb703', '#ff006e'];
    Chart.defaults.font.family = 'Outfit';
    ctx._chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Память', 'Внимание', 'Когниция', 'Интеллект', 'Тело'],
            datasets: [{
                data: [
                    Math.min((scores.matrix || 0) + (scores.numbers || 0) + (scores.pairs || 0), 100),
                    scores.schulte ? Math.min(Math.max(200 - scores.schulte, 0) / 200 * 100, 100) : 0,
                    Math.min((scores.stroop || 0) / 60 * 100, 100),
                    Math.min((scores.math || 0) / 30 * 100, 100),
                    Math.min((scores.body || 0) / 16 * 100, 100)
                ],
                backgroundColor: 'rgba(0,255,136,0.07)',
                borderColor: 'rgba(0,255,136,0.5)',
                borderWidth: 2,
                pointBackgroundColor: labelColors,
                pointBorderColor: 'transparent',
                pointRadius: 5, pointHoverRadius: 7
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0, max: 100,
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: {
                        color: labelColors,
                        font: { size: 12, weight: '700' }
                    },
                    ticks: { display: false }
                }
            },
            plugins: { legend: { display: false } },
            animation: { duration: 600 }
        }
    });
}
