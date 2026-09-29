// =============================================
// ДУША — Emotional Intelligence Exercises
// =============================================

const EMOTION_WHEEL = {
    'Радость': {
        color: '#ffb703', icon: '😄',
        children: ['Восторг', 'Благодарность', 'Воодушевление', 'Счастье', 'Спокойствие', 'Надежда']
    },
    'Грусть': {
        color: '#00e5ff', icon: '😢',
        children: ['Разочарование', 'Одиночество', 'Тоска', 'Уныние', 'Сочувствие', 'Ностальгия']
    },
    'Гнев': {
        color: '#ff006e', icon: '😤',
        children: ['Раздражение', 'Обида', 'Зависть', 'Нетерпение', 'Отвращение', 'Презрение']
    },
    'Страх': {
        color: '#9d4edd', icon: '😨',
        children: ['Тревога', 'Беспокойство', 'Ужас', 'Стеснение', 'Неуверенность', 'Паника']
    },
    'Удивление': {
        color: '#00ff88', icon: '😮',
        children: ['Изумление', 'Замешательство', 'Любопытство', 'Восхищение', 'Трепет', 'Шок']
    },
    'Отвращение': {
        color: '#fb5607', icon: '🤢',
        children: ['Неприязнь', 'Скука', 'Безразличие', 'Осуждение', 'Стыд', 'Неловкость']
    }
};

const AFFIRMATIONS = [
    'Я умею слушать других и слышу не только слова, но и чувства',
    'Мои эмоции — это компас, а не тюрьма',
    'Я принимаю себя таким, какой я есть сейчас',
    'Я способен меняться и расти каждый день',
    'Трудности делают меня сильнее и мудрее',
    'Я достоин любви и уважения',
    'Я умею просить о помощи — это сила, а не слабость',
    'Я позволяю себе отдыхать без чувства вины',
    'Мои чувства важны и заслуживают внимания',
    'Я способен находить смысл даже в трудных ситуациях',
    'Я благодарен за всё, что у меня есть прямо сейчас',
    'Я выбираю реагировать осознанно, а не на автопилоте'
];

const EQ_REFLECTIONS = [
    { q: 'Какую эмоцию ты чаще всего подавляешь?', hint: 'Gнев, грусть, страх... Это нормально — признать её.' },
    { q: 'Что тебя больше всего истощает в общении с людьми?', hint: 'Токсичность, непонимание, ожидания...' },
    { q: 'Когда ты последний раз говорил "нет" и чувствовал себя хорошо?', hint: 'Граница — это забота о себе.' },
    { q: 'Как ты себя ведёшь, когда тебе плохо?', hint: 'Замыкаешься, злишься, уходишь в работу?' },
    { q: 'Что приносит тебе искреннюю радость без усилий?', hint: 'Не "должно", а правда радует.' },
    { q: 'Кому ты за что-то благодарен, но ещё не сказал?', hint: 'Может быть, сейчас время?' },
    { q: 'Что ты принимаешь в себе с трудом?', hint: 'Осознание — первый шаг к принятию.' },
    { q: 'Что значит для тебя "быть собой"?', hint: 'Без ролей, без масок.' }
];

const GRATITUDE_PROMPTS = [
    'Маленькая приятность сегодня...',
    'Человек, которому я рад...',
    'Умение, за которое я себя ценю...',
    'Момент, который я хочу запомнить...',
    'То, что я обычно не замечаю, но оно есть...'
];

const EMOTIONS_TEST = [
    { emoji: '😤', correct: 'Гнев', options: ['Гнев', 'Страх', 'Грусть', 'Удивление'] },
    { emoji: '😢', correct: 'Грусть', options: ['Радость', 'Грусть', 'Отвращение', 'Страх'] },
    { emoji: '😄', correct: 'Радость', options: ['Радость', 'Удивление', 'Спокойствие', 'Гнев'] },
    { emoji: '😨', correct: 'Страх', options: ['Страх', 'Грусть', 'Гнев', 'Удивление'] },
    { emoji: '😮', correct: 'Удивление', options: ['Gнев', 'Удивление', 'Страх', 'Радость'] },
    { emoji: '🤢', correct: 'Отвращение', options: ['Отвращение', 'Грусть', 'Страх', 'Скука'] },
    { emoji: '😏', correct: 'Презрение', options: ['Радость', 'Злость', 'Презрение', 'Гнев'] },
    { emoji: '😔', correct: 'Уныние', options: ['Уныние', 'Страх', 'Скука', 'Усталость'] },
    { emoji: '🥺', correct: 'Уязвимость', options: ['Грусть', 'Страх', 'Уязвимость', 'Нежность'] },
    { emoji: '😌', correct: 'Спокойствие', options: ['Счастье', 'Спокойствие', 'Безразличие', 'Усталость'] },
];

let soulState = {
    section: null,
    gratitude: ['', '', ''],
    eqTestIdx: 0,
    eqScore: 0,
    eqTotal: 0,
    breathPhase: 'idle',
    breathTimer: null,
    affIdx: 0
};

// ─── Main soul view ─────────────────────────────────────────────────────────
function renderSoul(container) {
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">
                ←
            </div>
            <h2 style="margin:0; color:#e879f9;" class="glow-text">ДУША</h2>
            <div style="font-size:22px;">🌸</div>
        </div>

        <p style="text-align:center; margin-bottom:25px; font-size:13px; color:var(--text-secondary);">
            Развивай эмоциональный интеллект через осознанность и рефлексию
        </p>

        <div style="margin-bottom:20px;">
            <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--accent-green); margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                <span>🌟</span> Детские игры души и EQ
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                ${soulCard('soul-garden', '🌳', 'Сад доброты', 'Выращивай волшебное дерево хорошими делами', '#00ff88')}
                ${soulCard('soul-friendship', '🤝', 'Мостик дружбы', 'Добрые истории взаимовыручки и заботы', '#00e5ff')}
                ${soulCard('soul-jar', '🫙', 'Банка радости', 'Лови светлячков благодарности и тепла', '#ffb703')}
            </div>
        </div>

        <div style="margin-bottom:10px;">
            <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#e879f9; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                <span>🧘</span> Практики осознанности
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                ${soulCard('emotion-wheel', '🎡', 'Колесо эмоций', 'Исследуй и называй свои чувства', '#e879f9')}
                ${soulCard('eq-test', '🧪', 'Тест эмоций', 'Распознай эмоцию по выражению лица', '#fb5607')}
                ${soulCard('gratitude', '🙏', 'Благодарность', '3 вещи, за которые благодарен сегодня', '#ffb703')}
                ${soulCard('reflection', '📔', 'Рефлексия', 'Вопросы для самопознания', '#9d4edd')}
                ${soulCard('affirmations', '✨', 'Аффирмации', 'Позитивные установки для ума', '#00ff88')}
                ${soulCard('breathing', '🌬️', 'Осознанное дыхание', 'Успокой ум за 2 минуты', '#00e5ff')}
            </div>
        </div>
    `;
}

function soulCard(section, icon, title, desc, color) {
    return `
        <div class="glass-card" onclick="renderSoulSection('${section}')"
            style="display:flex; align-items:center; gap:15px; padding:18px 20px; cursor:pointer; border-left:3px solid ${color}40;">
            <div style="font-size:30px; min-width:38px; text-align:center;">${icon}</div>
            <div style="flex:1;">
                <div style="font-weight:700; font-size:15px; margin-bottom:3px; color:${color};">${title}</div>
                <div style="font-size:12px; color:var(--text-secondary);">${desc}</div>
            </div>
            ›
        </div>`;
}

function renderSoulSection(section) {
    soulState.section = section;
    const container = document.getElementById('soul');
    if (!container) return;
    switch (section) {
        case 'soul-garden': renderSoulGarden(container); break;
        case 'soul-theater': renderSoulTheater(container); break;
        case 'soul-friendship': renderSoulFriendship(container); break;
        case 'soul-jar': renderSoulJar(container); break;
        case 'emotion-wheel': renderEmotionWheel(container); break;
        case 'eq-test': renderEQTest(container); break;
        case 'gratitude': renderGratitude(container); break;
        case 'reflection': renderReflection(container); break;
        case 'affirmations': renderAffirmations(container); break;
        case 'breathing': renderSoulBreathing(container); break;
    }
    window.scrollTo(0, 0);
}

// ─── Back nav helper ─────────────────────────────────────────────────────────
function soulTopNav(title, color = '#e879f9') {
    return `<div class="top-nav">
        <div class="back-btn" onclick="renderSoul(document.getElementById('soul'))">
            ←
        </div>
        <h2 style="margin:0; color:${color};" class="glow-text">${title}</h2>
        <div style="width:40px;"></div>
    </div>`;
}

// ─── Колесо эмоций ────────────────────────────────────────────────────────────
function renderEmotionWheel(container) {
    container.innerHTML = `
        ${soulTopNav('КОЛЕСО ЭМОЦИЙ', '#e879f9')}
        <p style="text-align:center; margin-bottom:25px; font-size:13px; color:var(--text-secondary);">
            Нажми на основную эмоцию, чтобы увидеть её оттенки
        </p>
        <div id="wheelMain" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:25px;">
            ${Object.entries(EMOTION_WHEEL).map(([name, data]) => `
                <div class="glass-card" onclick="showWheelChildren('${name}')"
                    style="padding:18px 14px; text-align:center; cursor:pointer; border-color:${data.color}33;">
                    <div style="font-size:34px; margin-bottom:8px;">${data.icon}</div>
                    <div style="font-weight:700; color:${data.color};">${name}</div>
                </div>`).join('')}
        </div>

        <div id="wheelChildren" style="display:none;">
            <div id="wheelChildHeader" style="font-size:16px; font-weight:700; margin-bottom:15px; text-align:center;"></div>
            <div id="wheelChildGrid" style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:20px;"></div>
            <div id="wheelSelectedNote" style="background:rgba(255,255,255,0.03); border-radius:14px; padding:16px; font-size:14px; color:var(--text-secondary); display:none; border-left:3px solid #e879f9;">
                <b style="color:var(--text-primary);">Что ты чувствуешь?</b><br><br>
                Это нормально — называть своё чувство. Признать эмоцию — значит начать с ней работать.
            </div>
        </div>
    `;
}

function showWheelChildren(name) {
    const data = EMOTION_WHEEL[name];
    const sec = document.getElementById('wheelChildren');
    const header = document.getElementById('wheelChildHeader');
    const grid = document.getElementById('wheelChildGrid');
    const note = document.getElementById('wheelSelectedNote');
    if (!sec || !header || !grid) return;
    sec.style.display = 'block';
    header.innerHTML = `${data.icon} ${name}: выбери точнее`;
    header.style.color = data.color;
    grid.innerHTML = data.children.map(c => `
        <div class="glass-card" onclick="selectEmotion('${c}', '${name}', '${data.color}')"
            style="padding:12px; text-align:center; cursor:pointer; font-size:14px; font-weight:600; color:${data.color}; border-color:${data.color}33;">
            ${c}
        </div>
    `).join('');
    if (note) note.style.display = 'none';
    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectEmotion(emotion, parent, color) {
    const note = document.getElementById('wheelSelectedNote');
    if (note) {
        note.style.display = 'block';
        note.style.borderColor = color;
        note.innerHTML = `<b style="color:${color}; font-size:16px;">Ты чувствуешь: «${emotion}»</b><br><br>
            Это оттенок ${parent.toLowerCase()}. Называя чувство точно — ты уже управляешь им.<br><br>
            <span style="font-size:12px; color:var(--text-secondary);">Спроси себя: откуда оно? Что за ним стоит? Что тебе нужно прямо сейчас?</span>`;
        note.scrollIntoView({ behavior: 'smooth' });
        saveScore('soul_eq', (getUserScores().soul_eq || 0) + 1);
    }
}

// ─── Тест эмоций ─────────────────────────────────────────────────────────────
function renderEQTest(container) {
    soulState.eqTestIdx = 0;
    soulState.eqScore = 0;
    soulState.eqTotal = EMOTIONS_TEST.length;

    container.innerHTML = `
        ${soulTopNav('ТЕСТ ЭМОЦИЙ', '#fb5607')}
        <p style="text-align:center; margin-bottom:25px; font-size:13px; color:var(--text-secondary);">Выбери правильное название эмоции</p>
        <div id="eqTestContent"></div>
    `;
    showEQQuestion();
}

function showEQQuestion() {
    const el = document.getElementById('eqTestContent');
    if (!el) return;

    if (soulState.eqTestIdx >= soulState.eqTotal) {
        const pct = Math.round(soulState.eqScore / soulState.eqTotal * 100);
        saveScore('soul_eq_test', soulState.eqScore);
        el.innerHTML = `
            <div style="text-align:center; padding:30px 0;">
                <div style="font-size:64px; margin-bottom:15px;">${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '🔄'}</div>
                <h2 style="margin-bottom:10px; color:${pct >= 80 ? 'var(--accent-green)' : pct >= 60 ? 'var(--accent-yellow)' : 'var(--accent-pink)'};">
                    ${soulState.eqScore}/${soulState.eqTotal} — ${pct}%
                </h2>
                <p style="margin-bottom:30px;">${pct >= 80 ? 'Отличное распознавание эмоций!' : pct >= 60 ? 'Хороший результат, есть куда расти' : 'Продолжай практиковать эмпатию'}</p>
                <button class="btn" onclick="renderEQTest(document.getElementById('soul'))" style="background:rgba(251,86,7,0.12); border-color:rgba(251,86,7,0.3); color:#fb5607;">
                    ↺ Пройти снова
                </button>
            </div>`;
        return;
    }

    const q = EMOTIONS_TEST[soulState.eqTestIdx];
    el.innerHTML = `
        <div style="text-align:center; margin-bottom:25px;">
            <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:var(--text-secondary); margin-bottom:10px;">
                ${soulState.eqTestIdx + 1} / ${soulState.eqTotal}
            </div>
            <div style="height:3px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden; margin-bottom:25px;">
                <div style="width:${(soulState.eqTestIdx / soulState.eqTotal) * 100}%; height:100%; background:#fb5607; border-radius:2px;"></div>
            </div>
            <div style="font-size:90px; margin-bottom:20px;">${q.emoji}</div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;" id="eqOptions">
            ${q.options.map(opt => `
                <button class="btn" onclick="answerEQ('${opt}', '${q.correct}')"
                    style="font-size:15px; font-weight:600; padding:18px;">
                    ${opt}
                </button>`).join('')}
        </div>
    `;
}

function answerEQ(selected, correct) {
    const btns = document.querySelectorAll('#eqOptions button');
    btns.forEach(b => {
        b.onclick = null;
        if (b.innerText.trim() === correct) { b.style.background = 'rgba(0,255,136,0.2)'; b.style.borderColor = 'rgba(0,255,136,0.4)'; }
        else if (b.innerText.trim() === selected && selected !== correct) { b.style.background = 'rgba(255,0,110,0.2)'; b.style.borderColor = 'rgba(255,0,110,0.4)'; }
    });
    if (selected === correct) soulState.eqScore++;
    soulState.eqTestIdx++;
    setTimeout(showEQQuestion, 700);
}

// ─── Благодарность ────────────────────────────────────────────────────────────
function renderGratitude(container) {
    const todayKey = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('tb_gratitude') || '{}');
    const today = saved[todayKey] || ['', '', ''];

    const randomPrompts = GRATITUDE_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 3);

    container.innerHTML = `
        ${soulTopNav('БЛАГОДАРНОСТЬ', '#ffb703')}
        <p style="text-align:center; margin-bottom:25px; font-size:13px; color:var(--text-secondary);">
            Запиши 3 вещи, за которые ты благодарен сегодня. Это меняет мозг.
        </p>

        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:25px;">
            ${[0, 1, 2].map(i => `
                <div class="glass-card" style="padding:16px;">
                    <div style="font-size:12px; color:var(--accent-yellow); margin-bottom:8px; font-weight:600;">${['🌟', '✨', '💛'][i]} ${randomPrompts[i]}</div>
                    <textarea id="grat${i}" placeholder="Напиши здесь..." rows="2"
                        style="width:100%; background:transparent; border:none; outline:none; resize:none; font-family:Outfit,sans-serif; font-size:15px; color:var(--text-primary); line-height:1.6; caret-color:var(--accent-yellow);">${today[i]}</textarea>
                </div>`).join('')}
        </div>

        <button class="btn" onclick="saveGratitude()" style="width:100%; background:rgba(255,183,3,0.12); border-color:rgba(255,183,3,0.3); color:var(--accent-yellow); margin-bottom:20px;">
            ♥ Сохранить
        </button>

        <div id="gratMsg" style="text-align:center; font-size:13px; color:var(--accent-green); display:none; padding:15px; background:rgba(0,255,136,0.05); border-radius:12px;">
            Отлично! Благодарность — это мышца. Качай её каждый день 💚
        </div>
    `;
}

function saveGratitude() {
    const todayKey = new Date().toDateString();
    const vals = [0, 1, 2].map(i => (document.getElementById(`grat${i}`)?.value || '').trim());
    const allFilled = vals.some(v => v.length > 0);
    const saved = JSON.parse(localStorage.getItem('tb_gratitude') || '{}');
    saved[todayKey] = vals;
    localStorage.setItem('tb_gratitude', JSON.stringify(saved));
    if (allFilled) saveScore('soul_gratitude', (getUserScores().soul_gratitude || 0) + 1);
    const msg = document.getElementById('gratMsg');
    if (msg) msg.style.display = 'block';
}

// ─── Рефлексия ────────────────────────────────────────────────────────────────
function renderReflection(container) {
    const q = EQ_REFLECTIONS[Math.floor(Math.random() * EQ_REFLECTIONS.length)];

    container.innerHTML = `
        ${soulTopNav('РЕФЛЕКСИЯ', '#9d4edd')}
        <p style="text-align:center; margin-bottom:25px; font-size:13px; color:var(--text-secondary);">
            Один вопрос для глубокого самопознания
        </p>

        <div class="glass-card" style="padding:25px; margin-bottom:20px; border-color:rgba(157,78,221,0.25); text-align:center;">
            <div style="font-size:32px; margin-bottom:15px;">📔</div>
            <div style="font-size:19px; font-weight:700; color:var(--accent-purple); line-height:1.4; margin-bottom:12px;">${q.q}</div>
            <div style="font-size:12px; color:rgba(157,78,221,0.7); font-style:italic;">${q.hint}</div>
        </div>

        <div class="glass-card" style="padding:16px; margin-bottom:20px;">
            <textarea id="reflAnswer" placeholder="Пиши честно, никто кроме тебя не увидит..." rows="6"
                style="width:100%; background:transparent; border:none; outline:none; resize:none; font-family:Outfit,sans-serif; font-size:15px; color:var(--text-primary); line-height:1.6; caret-color:var(--accent-purple);"></textarea>
        </div>

        <div style="display:flex; gap:12px;">
            <button class="btn" onclick="renderReflection(document.getElementById('soul'))" style="flex:1;">
                Другой вопрос
            </button>
            <button class="btn" onclick="saveReflection()" style="flex:1; background:rgba(157,78,221,0.12); border-color:rgba(157,78,221,0.3); color:var(--accent-purple);">
                💾 Сохранить
            </button>
        </div>
        <div id="reflMsg" style="text-align:center; font-size:13px; color:var(--accent-purple); display:none; margin-top:16px; padding:14px; background:rgba(157,78,221,0.06); border-radius:12px;">
            Сохранено 💜 Рефлексия — это путь к себе
        </div>
    `;
}

function saveReflection() {
    const key = new Date().toISOString().slice(0, 10);
    const text = document.getElementById('reflAnswer')?.value || '';
    if (!text.trim()) return;
    const saved = JSON.parse(localStorage.getItem('tb_reflections') || '{}');
    saved[key] = text;
    localStorage.setItem('tb_reflections', JSON.stringify(saved));
    saveScore('soul_reflection', (getUserScores().soul_reflection || 0) + 1);
    const msg = document.getElementById('reflMsg');
    if (msg) msg.style.display = 'block';
}

// ─── Аффирмации ───────────────────────────────────────────────────────────────
function renderAffirmations(container) {
    soulState.affIdx = Math.floor(Math.random() * AFFIRMATIONS.length);

    container.innerHTML = `
        ${soulTopNav('АФФИРМАЦИИ', '#00ff88')}
        <p style="text-align:center; margin-bottom:30px; font-size:13px; color:var(--text-secondary);">
            Прочитай вслух. Медленно. Почувствуй каждое слово.
        </p>

        <div class="glass-card" id="affCard" onclick="nextAffirmation()"
            style="min-height:200px; display:flex; align-items:center; justify-content:center; padding:30px; text-align:center; cursor:pointer; border-color:rgba(0,255,136,0.2); margin-bottom:20px;">
            <div>
                <div style="font-size:28px; margin-bottom:20px;">✨</div>
                <p id="affText" style="font-size:18px; font-weight:600; line-height:1.6; color:var(--text-primary);">
                    ${AFFIRMATIONS[soulState.affIdx]}
                </p>
            </div>
        </div>

        <p style="text-align:center; font-size:12px; color:var(--text-secondary); margin-bottom:25px;">Нажми на карточку для следующей аффирмации</p>

        <div style="display:flex; flex-direction:column; gap:10px;">
            <div class="glass-card" style="padding:16px; border-color:rgba(0,255,136,0.1);">
                <div style="font-size:12px; color:var(--accent-green); margin-bottom:8px; font-weight:600;">📿 Практика</div>
                <p style="font-size:13px; line-height:1.6;">Повтори аффирмацию 3 раза вслух. Положи руку на сердце. Представь, что это уже правда про тебя.</p>
            </div>
        </div>
    `;
}

function nextAffirmation() {
    soulState.affIdx = (soulState.affIdx + 1) % AFFIRMATIONS.length;
    const el = document.getElementById('affText');
    const card = document.getElementById('affCard');
    if (el) {
        el.style.opacity = '0';
        setTimeout(() => {
            el.innerText = AFFIRMATIONS[soulState.affIdx];
            el.style.opacity = '1';
        }, 200);
    }
    if (card) { card.style.transition = 'opacity 0.2s'; }
}

// ─── Осознанное дыхание ────────────────────────────────────────────────────────
const BREATH_PROGRAMS = [
    { name: 'Успокоение', phases: [{ l: 'Вдох', d: 4 }, { l: 'Пауза', d: 2 }, { l: 'Выдох', d: 6 }], color: '#00e5ff', icon: '💧', rounds: 4 },
    { name: 'Баланс', phases: [{ l: 'Вдох', d: 4 }, { l: 'Задержка', d: 4 }, { l: 'Выдох', d: 4 }, { l: 'Пауза', d: 4 }], color: '#9d4edd', icon: '🌀', rounds: 4 },
    { name: 'Энергия', phases: [{ l: 'Быстрый вдох', d: 2 }, { l: 'Выдох', d: 2 }], color: '#00ff88', icon: '⚡', rounds: 8 },
];

let breathState = { timerId: null, phase: 'idle', progIdx: 0, phaseIdx: 0, round: 0, timeLeft: 0 };

function renderSoulBreathing(container) {
    breathState.phase = 'idle';
    clearInterval(breathState.timerId);

    container.innerHTML = `
        ${soulTopNav('ДЫХАНИЕ', '#00e5ff')}

        <div style="display:flex; gap:10px; justify-content:center; margin-bottom:25px;">
            ${BREATH_PROGRAMS.map((p, i) => `
                <button class="btn" id="breathProg${i}" onclick="selectBreathProg(${i})"
                    style="flex:1; font-size:13px; padding:10px 6px; ${i === breathState.progIdx ? 'background:rgba(0,229,255,0.15);border-color:rgba(0,229,255,0.4);color:var(--accent-cyan);' : ''}">
                    ${p.icon} ${p.name}
                </button>`).join('')}
        </div>

        <div style="text-align:center; margin-bottom:30px;">
            <div id="breathCircle" onclick="startSoulBreath()"
                style="width:180px; height:180px; border-radius:50%; margin:0 auto 20px;
                border:3px solid rgba(0,229,255,0.3); background:rgba(0,229,255,0.05);
                display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer;
                transition:all 0.5s ease;">
                <div id="breathPhaseLabel" style="font-size:16px; font-weight:700; color:var(--accent-cyan);">Нажми</div>
                <div id="breathCount"      style="font-size:48px; font-weight:800; margin:4px 0;"></div>
                <div id="breathRoundInfo"  style="font-size:12px; color:var(--text-secondary);"></div>
            </div>
            <p id="breathMsg" style="font-size:13px; color:var(--text-secondary);">
                ${BREATH_PROGRAMS[breathState.progIdx].name} · ${BREATH_PROGRAMS[breathState.progIdx].rounds} раундов
            </p>
        </div>

        <div class="glass-card" style="padding:16px; border-color:rgba(0,229,255,0.1);">
            <div style="font-size:12px; color:var(--accent-cyan); margin-bottom:8px; font-weight:600;">Польза</div>
            <p style="font-size:13px; line-height:1.6;">Осознанное дыхание активирует парасимпатическую нервную систему, снижает кортизол и улучшает концентрацию уже через 2 минуты.</p>
        </div>
    `;
}

function selectBreathProg(idx) {
    clearInterval(breathState.timerId);
    breathState.phase = 'idle';
    breathState.progIdx = idx;
    BREATH_PROGRAMS.forEach((_, i) => {
        const btn = document.getElementById(`breathProg${i}`);
        if (btn) { btn.style.background = i === idx ? 'rgba(0,229,255,0.15)' : ''; btn.style.borderColor = i === idx ? 'rgba(0,229,255,0.4)' : 'var(--card-border)'; btn.style.color = i === idx ? 'var(--accent-cyan)' : 'var(--text-primary)'; }
    });
    const prog = BREATH_PROGRAMS[idx];
    const msg = document.getElementById('breathMsg');
    if (msg) msg.innerText = `${prog.name} · ${prog.rounds} раундов`;
    const label = document.getElementById('breathPhaseLabel');
    if (label) label.innerText = 'Нажми';
    const cnt = document.getElementById('breathCount');
    if (cnt) cnt.innerText = '';
    resetBreathCircle(prog.color);
}

function startSoulBreath() {
    if (breathState.phase === 'running') return;
    breathState.phase = 'running';
    breathState.phaseIdx = 0;
    breathState.round = 0;
    const prog = BREATH_PROGRAMS[breathState.progIdx];
    tickBreath(prog);
}

function tickBreath(prog) {
    if (breathState.phase !== 'running') return;
    const phase = prog.phases[breathState.phaseIdx];
    breathState.timeLeft = phase.d;

    const label = document.getElementById('breathPhaseLabel');
    const cnt = document.getElementById('breathCount');
    const circle = document.getElementById('breathCircle');
    const roundInfo = document.getElementById('breathRoundInfo');
    const msg = document.getElementById('breathMsg');

    if (label) label.innerText = phase.l;
    if (roundInfo) roundInfo.innerText = `раунд ${breathState.round + 1}/${prog.rounds}`;

    const isInhale = phase.l.toLowerCase().includes('вдох');
    const color = prog.color;

    if (circle) {
        circle.style.transform = isInhale ? 'scale(1.2)' : 'scale(0.9)';
        circle.style.boxShadow = isInhale ? `0 0 40px ${color}55` : 'none';
        circle.style.borderColor = color + (isInhale ? 'cc' : '44');
        circle.style.background = color + (isInhale ? '22' : '08');
    }

    clearInterval(breathState.timerId);
    breathState.timerId = setInterval(() => {
        if (cnt) cnt.innerText = breathState.timeLeft;
        breathState.timeLeft--;

        if (breathState.timeLeft < 0) {
            clearInterval(breathState.timerId);
            breathState.phaseIdx++;
            if (breathState.phaseIdx >= prog.phases.length) {
                breathState.phaseIdx = 0;
                breathState.round++;
                if (breathState.round >= prog.rounds) {
                    breathState.phase = 'idle';
                    if (label) { label.innerText = '✓ Готово'; label.style.color = 'var(--accent-green)'; }
                    if (cnt) cnt.innerText = '';
                    if (msg) msg.innerText = 'Отличная сессия! Как ты себя чувствуешь?';
                    saveScore('soul_breath', (getUserScores().soul_breath || 0) + 1);
                    return;
                }
            }
            tickBreath(prog);
        }
    }, 1000);
}

function resetBreathCircle(color = '#00e5ff') {
    const circle = document.getElementById('breathCircle');
    if (circle) {
        circle.style.transform = 'scale(1)';
        circle.style.boxShadow = 'none';
        circle.style.borderColor = color + '33';
        circle.style.background = color + '08';
    }
}
