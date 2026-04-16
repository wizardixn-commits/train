// =============================================
// ТЕЛО — Physical Body Exercises (expanded)
// =============================================
const bodyExercises = [
    { id: 'pushups', name: 'Отжимания', icon: '💪', color: '#ff006e', duration: 30, reps: '10-15 раз', description: 'Грудь, плечи, трицепс', instructions: 'Ляг лицом вниз. Руки чуть шире плеч. Опускайся к полу и отжимайся.', tip: 'Держи тело прямым, не роняй бёдра' },
    { id: 'squats', name: 'Приседания', icon: '🏋️', color: '#ffb703', duration: 40, reps: '15-20 раз', description: 'Ноги, ягодицы, кор', instructions: 'Ноги на ширине плеч. Приседай как на стул. Спина прямая.', tip: 'Колени не выходят за носки' },
    { id: 'plank', name: 'Планка', icon: '🧘', color: '#00e5ff', duration: 60, reps: '30-60 с', description: 'Кор и стабильность', instructions: 'Упор на предплечьях или прямых руках. Тело — прямая линия.', tip: 'Не задерживай дыхание!' },
    { id: 'jumping_jacks', name: 'Прыжки «Звезда»', icon: '⭐', color: '#00ff88', duration: 30, reps: '20-30 раз', description: 'Кардио и координация', instructions: 'Прыгай с руками вверх, ноги врозь, затем возвращайся в исходное.', tip: 'Дыши ритмично, двигайся в темпе' },
    { id: 'neck_roll', name: 'Разминка шеи', icon: '🔄', color: '#9d4edd', duration: 20, reps: '5 кругов', description: 'Снимает напряжение с шеи', instructions: 'Медленно наклоняй голову вперёд, в сторону, назад и в другую сторону.', tip: 'Движения медленные и плавные, без резких поворотов' },
    { id: 'breathing', name: 'Дыхание 4-7-8', icon: '🌬️', color: '#00e5ff', duration: 90, reps: '4 цикла', description: 'Снижает стресс, улучшает фокус', instructions: 'Вдох 4 сек → задержи дыхание 7 сек → медленный выдох 8 сек.', tip: 'Расслабь плечи и закрой глаза' },
    { id: 'eye_focus', name: 'Фокус для глаз', icon: '👁️', color: '#ffb703', duration: 30, reps: '10 раз', description: 'Снимает усталость от экрана', instructions: 'Поставь палец в 20 см от носа. Чередуй взгляд: на палец → на дальний объект.', tip: 'Смотри вдаль не менее 20 секунд' },
    { id: 'lunges', name: 'Выпады', icon: '🦵', color: '#ff006e', duration: 40, reps: '10 каждой', description: 'Укрепляет ноги и баланс', instructions: 'Шагни вперёд одной ногой, опуская колено другой к полу. Чередуй ноги.', tip: 'Корпус держи прямо, не наклоняй вперёд' },
    { id: 'side_plank', name: 'Боковая планка', icon: '🏄', color: '#9d4edd', duration: 30, reps: '30 с × 2', description: 'Боковые мышцы кора', instructions: 'Ляг на бок, упор на предплечье. Подними бёдра. Тело — прямая линия.', tip: 'Держи 30 с на каждую сторону' },
    { id: 'high_knees', name: 'Бег с высоким коленом', icon: '🏃', color: '#fb5607', duration: 30, reps: '30 с', description: 'Интенсивное кардио', instructions: 'Бег на месте, поднимая колени как можно выше. Руки работают в ритм.', tip: 'Держи темп — 1-2 секунды на шаг' },
    { id: 'shoulder_roll', name: 'Разминка плеч', icon: '🙆', color: '#00ff88', duration: 20, reps: '10 кругов', description: 'Снимает зажим в плечах', instructions: 'Медленно вращай плечами вперёд, потом назад по 10 раз.', tip: 'Идеально после долгого сидения за столом' },
    { id: 'wall_sit', name: 'Стул у стены', icon: '💺', color: '#ffb703', duration: 45, reps: '45 с', description: 'Статика для квадрицепсов', instructions: 'Встань спиной к стене и опустись в позу стула (90°). Держи!', tip: 'Следи, чтобы колени были над пятками' },
    { id: 'supine_twist', name: 'Скрутка лёжа', icon: '🌀', color: '#9d4edd', duration: 40, reps: '3 × 2 бока', description: 'Расслабляет поясницу', instructions: 'Лягте на спину. Согни ноги, опусти в сторону до упора. Руки в стороны. Смотри в противоположную сторону.', tip: 'Дыши ровно, расслабь спину' },
    { id: 'meditation', name: 'Медитация', icon: '🧘‍♂️', color: '#00e5ff', duration: 120, reps: '2 минуты', description: 'Снижает кортизол, улучшает мозг', instructions: 'Закрой глаза. Следи только за дыханием. Мысли приходят — замечай и отпускай.', tip: 'Самое полезное упражнение для мозга' },
    { id: 'wrist_stretch', name: 'Разминка запястий', icon: '🖐️', color: '#ff006e', duration: 20, reps: '10 кругов', description: 'Защита от туннельного синдрома', instructions: 'Складывай руки в молитву и разворачивай. Вращай запястьями по кругу.', tip: 'Обязательно для тех, кто много печатает' },
    { id: 'cobra_stretch', name: 'Кобра (спина)', icon: '🐍', color: '#fb5607', duration: 30, reps: '3 раза', description: 'Растяжка позвоночника', instructions: 'Лягте на живот. Упри ладони под плечи. Медленно выпрямляй руки, поднимая голову и грудь.', tip: 'Не перенапрягай поясницу, локти слегка согнуты' },
];

let bodyState = {
    currentExercise: null,
    timerId: null,
    timeLeft: 0,
    phase: 'idle',
    completedToday: new Set()
};

function renderBody(container) {
    const done = bodyState.completedToday.size;
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="stopBodyExercise(); navigate('dashboard')">
                ←
            </div>
            <h2 style="margin: 0; color: var(--accent-pink);" class="glow-text">ТЕЛО</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 14px;" id="bodyDone">${done}/${bodyExercises.length}</div>
        </div>

        <p style="text-align:center; font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">Выбери упражнение и начни тренировку</p>

        <div id="bodyExerciseView" style="display: none;"></div>
        <div id="bodyList" style="display: flex; flex-direction: column; gap: 10px;">
            ${bodyExercises.map(ex => {
        const done = bodyState.completedToday.has(ex.id);
        return `
                <div onclick="startBodyExercise('${ex.id}')" class="glass-card" style="display:flex; align-items:center; gap:14px; padding:14px 18px; cursor:pointer; opacity:${done ? 0.5 : 1}; border-color:${done ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.04)'};"
                    data-excard="${ex.id}">
                    <div style="font-size:28px; width:40px; text-align:center; flex-shrink:0;">${ex.icon}</div>
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:700; font-size:15px; margin-bottom:2px;">${done ? '✓ ' : ''}${ex.name}</div>
                        <div style="font-size:12px; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${ex.description}</div>
                    </div>
                    <div style="text-align:right; font-size:12px; color:${ex.color}; font-weight:600; flex-shrink:0;">${ex.reps}<br><span style="opacity:0.6;">${ex.duration}с</span></div>
                </div>`;
    }).join('')}
        </div>
    `;
}

function startBodyExercise(id) {
    const ex = bodyExercises.find(e => e.id === id);
    if (!ex) return;
    bodyState.currentExercise = ex;
    bodyState.phase = 'ready';
    bodyState.timeLeft = ex.duration;

    const listEl = document.getElementById('bodyList');
    const viewEl = document.getElementById('bodyExerciseView');
    if (listEl) listEl.style.display = 'none';
    if (viewEl) {
        viewEl.style.display = 'block';
        viewEl.innerHTML = `
            <div style="text-align:center; animation:fadeIn 0.3s ease;">
                <div style="font-size:72px; margin-bottom:12px;">${ex.icon}</div>
                <h2 style="color:${ex.color}; font-size:24px; margin-bottom:8px;">${ex.name}</h2>
                <p style="font-size:14px; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">${ex.instructions}</p>
                <div style="background:rgba(255,255,255,0.03); border-radius:16px; padding:20px; margin-bottom:20px;">
                    <div id="bodyTimerNum" style="font-size:72px; font-weight:800; color:${ex.color}; margin-bottom:10px; font-variant-numeric:tabular-nums;">${ex.duration}</div>
                    <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
                        <div id="bodyTimerBar" style="height:100%; width:100%; background:${ex.color}; border-radius:3px; transition:width 0.5s linear;"></div>
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.02); border-radius:12px; padding:14px; margin-bottom:20px; font-size:13px; color:rgba(255,255,255,0.45); font-style:italic; border-left:3px solid ${ex.color}; text-align:left;">
                    💡 ${ex.tip}
                </div>
                <div style="display:flex; gap:12px;">
                    <button class="btn" onclick="stopBodyExercise()" style="flex:1;">
                        ← Назад
                    </button>
                    <button class="btn" id="bodyStartBtn" onclick="runBodyTimer()" style="flex:2; background:rgba(255,20,100,0.1); border-color:rgba(255,20,100,0.2); color:${ex.color};">
                        ▶ Начать
                    </button>
                </div>
            </div>
        `;
    }
}

function runBodyTimer() {
    if (bodyState.phase === 'running') return;
    bodyState.phase = 'running';
    const ex = bodyState.currentExercise;
    const startBtn = document.getElementById('bodyStartBtn');
    if (startBtn) startBtn.style.display = 'none';
    const totalTime = ex.duration;

    bodyState.timerId = setInterval(() => {
        bodyState.timeLeft--;
        const tEl = document.getElementById('bodyTimerNum');
        const bar = document.getElementById('bodyTimerBar');
        if (tEl) tEl.innerText = bodyState.timeLeft;
        if (bar) bar.style.width = `${(bodyState.timeLeft / totalTime) * 100}%`;

        if (bodyState.timeLeft <= 0) {
            clearInterval(bodyState.timerId);
            bodyState.phase = 'done';
            bodyState.completedToday.add(ex.id);
            saveScore('body', bodyState.completedToday.size);

            const tEl2 = document.getElementById('bodyTimerNum');
            if (tEl2) { tEl2.innerText = '✓'; tEl2.style.color = 'var(--accent-green)'; }
            const doneBtnEl = document.getElementById('bodyStartBtn');
            if (doneBtnEl) {
                doneBtnEl.style.display = 'flex';
                doneBtnEl.innerHTML = '✓ Готово!';
                doneBtnEl.style.color = 'var(--accent-green)';
                doneBtnEl.style.borderColor = 'rgba(0,255,136,0.4)';
                doneBtnEl.onclick = stopBodyExercise;
            }
        }
    }, 1000);
}

function stopBodyExercise() {
    clearInterval(bodyState.timerId);
    bodyState.phase = 'idle';
    bodyState.currentExercise = null;
    const container = document.getElementById('body');
    if (container) renderBody(container);
}
