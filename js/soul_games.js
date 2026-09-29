// =============================================
// ДЕТСКИЕ ИГРЫ ДУШИ И ЭМОЦИОНАЛЬНОГО ИНТЕЛЛЕКТА (EQ)
// 1. Сад доброты (Дерево добрых дел)
// 2. Эмодзи-театр (Конструктор настроения)
// 3. Мостик дружбы (Истории доброты и эмпатии)
// 4. Банка радости (Ловец светлячков благодарности)
// =============================================

// ─── Sound Synthesizer via Web Audio API ────────────────────────────────────
let soulAudioCtx = null;
function getSoulAudio() {
    if (!soulAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) soulAudioCtx = new AudioCtx();
    }
    if (soulAudioCtx && soulAudioCtx.state === 'suspended') {
        soulAudioCtx.resume();
    }
    return soulAudioCtx;
}

function playSoulSound(type) {
    try {
        const ctx = getSoulAudio();
        if (!ctx) return;
        const t = ctx.currentTime;

        if (type === 'magic') {
            // Magical twinkle (pentatonic chime)
            [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + i * 0.06);
                gain.gain.setValueAtTime(0.2, t + i * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t + i * 0.06);
                osc.stop(t + i * 0.06 + 0.36);
            });
        } else if (type === 'water') {
            // Water droplets
            [800, 1100, 950, 1250].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + i * 0.08);
                osc.frequency.exponentialRampToValueAtTime(freq - 300, t + i * 0.08 + 0.1);
                gain.gain.setValueAtTime(0.18, t + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t + i * 0.08);
                osc.stop(t + i * 0.08 + 0.11);
            });
        } else if (type === 'pop') {
            // Gentle bubble pop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, t);
            osc.frequency.exponentialRampToValueAtTime(900, t + 0.08);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.09);
        } else if (type === 'cheer') {
            // Warm triumph chord (C-E-G-C)
            [523.25, 659.25, 783.99, 1046.5].forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.62);
            });
        } else if (type === 'giggle') {
            // Cute animated sound
            [400, 600, 500, 750].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + i * 0.07);
                gain.gain.setValueAtTime(0.16, t + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t + i * 0.07);
                osc.stop(t + i * 0.07 + 0.13);
            });
        }
    } catch (e) {}
}

function getSoulContainer(viewId) {
    return document.getElementById(viewId) || document.getElementById('soul') || document.querySelector('.view.active');
}

// ============================================================================
// 1. САД ДОБРОТЫ (GARDEN OF KINDNESS)
// ============================================================================

const GOOD_DEEDS_CATALOG = [
    {
        cat: '🏠 Для дома и родных',
        items: [
            { icon: '🧸', text: 'Убрал свои игрушки и вещи на место' },
            { icon: '🫂', text: 'Крепко обнял маму, папу или бабушку' },
            { icon: '🍽️', text: 'Помог накрыть на стол или помыл за собой посуду' },
            { icon: '💬', text: 'Сказал искреннее "спасибо" за заботу' },
            { icon: '🛌', text: 'Сам аккуратно заправил постель' }
        ]
    },
    {
        cat: '🤝 Для друзей и людей',
        items: [
            { icon: '🎁', text: 'Поделился игрушкой или угощением' },
            { icon: '☀️', text: 'Поддержал того, кто грустил, и улыбнулся ему' },
            { icon: '🤝', text: 'Помог помириться или уступил в споре' },
            { icon: '🎨', text: 'Сделал добрый подарок или рисунок своими руками' },
            { icon: '👋', text: 'Вежливо поздоровался с соседом или учителем' }
        ]
    },
    {
        cat: '🐾 Для природы и зверят',
        items: [
            { icon: '🐱', text: 'Ласково погладил и покормил питомца' },
            { icon: '🪴', text: 'Полил домашнее растение или цветок' },
            { icon: '🗑️', text: 'Не бросил мусор мимо урны, убрал за собой' },
            { icon: '🐦', text: 'Насыпал крошек птичкам на улице' }
        ]
    },
    {
        cat: '💛 Для своего сердца',
        items: [
            { icon: '⭐', text: 'Похвалил себя за старание в трудном деле' },
            { icon: '🕊️', text: 'Честно признался в ошибке без обмана' },
            { icon: '🧘', text: 'Глубоко подышал и успокоился без крика' },
            { icon: '📖', text: 'Узнал что-то новое и полезное' }
        ]
    }
];

const TREE_STAGES = [
    { level: 1, name: 'Зёрнышко добра', icon: '🌱', req: 0, desc: 'Первый росточек чистого сердца' },
    { level: 2, name: 'Молодое деревце', icon: '🌿', req: 3, desc: 'Твоя забота помогает расти' },
    { level: 3, name: 'Цветущий сад', icon: '🌸', req: 7, desc: 'Дерево благоухает добрыми делами' },
    { level: 4, name: 'Дерево изобилия', icon: '🍎', req: 14, desc: 'На ветвях созрели плоды тепла' },
    { level: 5, name: 'Волшебный оазис', icon: '🌳✨', req: 25, desc: 'Птицы поют, бабочки танцуют в твоем саду' }
];

function getGardenData() {
    const raw = localStorage.getItem('trainbrain_soul_garden');
    if (!raw) return { totalDeeds: 0, history: [] };
    try { return JSON.parse(raw); } catch (e) { return { totalDeeds: 0, history: [] }; }
}

function saveGardenData(data) {
    localStorage.setItem('trainbrain_soul_garden', JSON.stringify(data));
}

function renderSoulGarden(container) {
    const data = getGardenData();
    const stage = [...TREE_STAGES].reverse().find(s => data.totalDeeds >= s.req) || TREE_STAGES[0];
    const nextStage = TREE_STAGES.find(s => s.req > data.totalDeeds);
    const progressToNext = nextStage ?
        Math.min(Math.round(((data.totalDeeds - stage.req) / (nextStage.req - stage.req)) * 100), 100) : 100;

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')" title="Назад">
                ←
            </div>
            <div style="text-align:center;">
                <h2 style="margin:0; color:#00ff88; letter-spacing:1px;" class="glow-text">САД ДОБРОТЫ</h2>
                <span style="font-size:11px; color:var(--text-secondary);">ДЕРЕВО ТВОЕЙ ДУШИ</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-weight:bold; color:var(--accent-yellow); font-size:16px;">
                ⭐ <span id="gardenDeedsCount">${data.totalDeeds}</span>
            </div>
        </div>

        <!-- Magical Tree Centerpiece Card -->
        <div class="glass-card" style="text-align:center; padding:24px 16px; margin-bottom:18px; border-color:rgba(0,255,136,0.25); background:radial-gradient(ellipse at 50% 30%, rgba(0,255,136,0.08) 0%, var(--card-bg) 75%); position:relative; overflow:hidden;">
            <div style="display:inline-block; font-size:12px; font-weight:700; color:var(--accent-green); background:rgba(0,255,136,0.12); padding:4px 12px; border-radius:20px; margin-bottom:12px; border:1px solid rgba(0,255,136,0.2);">
                Уровень ${stage.level}: ${stage.name}
            </div>

            <!-- Animated Tree Stage -->
            <div id="treeAvatar" style="font-size:82px; line-height:1; margin:15px 0; filter:drop-shadow(0 0 20px rgba(0,255,136,0.3)); transition:transform 0.3s; cursor:pointer;" onclick="pulseTree()">
                ${stage.icon}
            </div>

            <div style="font-size:14px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">
                ${stage.desc}
            </div>

            <div style="font-size:11px; color:var(--text-secondary); margin-bottom:14px;">
                ${nextStage ? `До следующего уровня (${nextStage.name}): ещё ${nextStage.req - data.totalDeeds} добрых дел` : '🎉 Твой сад достиг высшего цветения!'}
            </div>

            <!-- Progress to next stage -->
            <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; max-width:240px; margin:0 auto 18px;">
                <div style="width:${progressToNext}%; height:100%; background:linear-gradient(90deg, #00ff88, #00e5ff); border-radius:3px; transition:width 0.4s;"></div>
            </div>

            <!-- Water Garden Button -->
            <button class="btn" onclick="openGoodDeedsModal()" style="width:100%; max-width:280px; padding:15px 20px; font-size:16px; font-weight:700; background:linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,229,255,0.15)); border-color:rgba(0,255,136,0.4); color:var(--accent-green); box-shadow:0 0 20px rgba(0,255,136,0.15);">
                💧 Полить дерево добрым делом
            </button>
        </div>

        <!-- Recent Deeds History -->
        <div class="glass-card" style="padding:18px 16px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">🌸 Плоды твоего тепла:</div>
                <div style="font-size:11px; color:var(--text-secondary);">Всего: ${data.totalDeeds}</div>
            </div>

            <div id="gardenDeedsList" style="display:flex; flex-direction:column; gap:8px;">
                ${data.history.length === 0 ? `
                    <div style="text-align:center; padding:18px 10px; font-size:12px; color:var(--text-secondary); font-style:italic;">
                        Твой сад пока ждёт первое доброе дело.<br>Нажми кнопку выше, чтобы посадить первый росток! 🌱
                    </div>
                ` : data.history.slice(0, 5).map(item => `
                    <div style="display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.05);">
                        <span style="font-size:20px;">${item.icon}</span>
                        <div style="flex:1; font-size:13px; color:var(--text-primary); font-weight:500;">${item.text}</div>
                        <span style="font-size:10px; color:var(--text-secondary); white-space:nowrap;">${item.date}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Inspiration Quote -->
        <div class="glass-card" style="padding:14px; text-align:center; font-size:12px; color:var(--text-secondary); border-color:rgba(0,255,136,0.15);">
            🌿 <i>«Даже самое маленькое доброе дело согревает весь мир вокруг тебя.»</i>
        </div>
    `;
}

function pulseTree() {
    playSoulSound('magic');
    const el = document.getElementById('treeAvatar');
    if (el) {
        el.style.transform = 'scale(1.25) rotate(5deg)';
        setTimeout(() => el.style.transform = 'scale(1) rotate(0deg)', 280);
    }
}

function openGoodDeedsModal() {
    playSoulSound('magic');
    let modal = document.getElementById('goodDeedsModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'goodDeedsModal';
    modal.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.8); backdrop-filter:blur(8px);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        padding:20px;
    `;

    const contentHtml = GOOD_DEEDS_CATALOG.map(cat => `
        <div style="margin-bottom:14px;">
            <div style="font-size:13px; font-weight:700; color:var(--accent-green); margin-bottom:6px;">${cat.cat}</div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${cat.items.map(it => `
                    <button class="btn" onclick="selectGoodDeed('${it.icon}', '${it.text.replace(/'/g, "\\'")}')"
                        style="justify-content:flex-start; text-align:left; padding:10px 12px; font-size:13px; border-radius:10px; background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.08); gap:10px;">
                        <span style="font-size:18px;">${it.icon}</span>
                        <span style="flex:1;">${it.text}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="glass-card" style="width:100%; max-width:380px; max-height:85vh; display:flex; flex-direction:column; padding:20px; border-color:rgba(0,255,136,0.3); background:var(--bg-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="font-size:17px; font-weight:800; color:var(--accent-green);">💧 Какое добро ты сделал?</div>
                <div onclick="document.getElementById('goodDeedsModal').remove()" style="font-size:20px; cursor:pointer; color:var(--text-secondary); padding:4px;">✕</div>
            </div>

            <div style="flex:1; overflow-y:auto; padding-right:4px; margin-bottom:12px; scrollbar-width:none;">
                ${contentHtml}

                <div style="margin-top:10px; padding:12px; background:rgba(0,255,136,0.05); border-radius:12px; border:1px dashed rgba(0,255,136,0.3);">
                    <div style="font-size:12px; font-weight:700; color:var(--accent-cyan); margin-bottom:6px;">✨ Своё доброе дело:</div>
                    <div style="display:flex; gap:6px;">
                        <input type="text" id="customDeedInput" placeholder="Напиши, что хорошего произошло..." 
                               style="flex:1; padding:8px 12px; font-size:13px; border-radius:8px; outline:none; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.2);">
                        <button class="btn" onclick="submitCustomDeed()" style="padding:8px 14px; font-size:13px; color:var(--accent-green);">
                            +
                        </button>
                    </div>
                </div>
            </div>

            <button class="btn" onclick="document.getElementById('goodDeedsModal').remove()" style="width:100%; padding:10px; font-size:13px; color:var(--text-secondary);">
                Закрыть
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function submitCustomDeed() {
    const inp = document.getElementById('customDeedInput');
    if (!inp || !inp.value.trim()) return;
    selectGoodDeed('🌟', inp.value.trim());
}

function selectGoodDeed(icon, text) {
    document.getElementById('goodDeedsModal')?.remove();
    playSoulSound('water');

    const data = getGardenData();
    data.totalDeeds++;
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    data.history.unshift({ icon, text, date: dateStr });
    saveGardenData(data);

    saveScore('soul_garden', data.totalDeeds);
    showTreeBloomAnimation(icon, text);
}

function showTreeBloomAnimation(icon, text) {
    const animOverlay = document.createElement('div');
    animOverlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.85); backdrop-filter:blur(10px);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        text-align:center; padding:24px;
        animation:fadeIn 0.3s ease;
    `;

    animOverlay.innerHTML = `
        <div style="font-size:64px; margin-bottom:12px; animation:pulseBadge 0.6s infinite alternate;">
            💧✨🌸
        </div>
        <div style="font-size:24px; font-weight:800; color:var(--accent-green); margin-bottom:6px;">
            Дерево полито!
        </div>
        <div style="font-size:16px; color:var(--text-primary); font-weight:600; margin-bottom:8px;">
            ${icon} ${text}
        </div>
        <div style="font-size:13px; color:var(--text-secondary); max-width:280px; line-height:1.4;">
            На ветвях твоего сада распустился новый цветок доброты! +15 XP 🌸
        </div>
    `;

    document.body.appendChild(animOverlay);
    setTimeout(() => playSoulSound('magic'), 400);

    setTimeout(() => {
        animOverlay.remove();
        const container = getSoulContainer('soul_garden');
        if (container) renderSoulGarden(container);
    }, 1800);
}

// ============================================================================
// 2. ЭМОДЗИ-ТЕАТР (FACE MOOD BUILDER)
// ============================================================================

const THEATER_HEROES = [
    { id: 'cat', name: 'Котик', emoji: '🐱' },
    { id: 'fox', name: 'Лисёнок', emoji: '🦊' },
    { id: 'panda', name: 'Пандочка', emoji: '🐼' },
    { id: 'bunny', name: 'Зайчонок', emoji: '🐰' },
    { id: 'bear', name: 'Мишутка', emoji: '🐻' }
];

const THEATER_MOODS = [
    {
        title: 'Радость и восторг!',
        hint: 'Лисёнок нашёл спелую сладкую земляничку! 🍓',
        reqEyes: '😄', reqMouth: '😀',
        desc: 'Широкая улыбка и лучистые глазки!'
    },
    {
        title: 'Большое удивление!',
        hint: 'Перед носом приземлилась светящаяся бабочка! 🦋',
        reqEyes: '😮', reqMouth: '😮',
        desc: 'Круглые распахнутые глазки и ротик буквой «О»!'
    },
    {
        title: 'Спокойствие и нега',
        hint: 'Котик греется на тёплом солнышке после обеда ☀️',
        reqEyes: '😌', reqMouth: '😊',
        desc: 'Мягкий взгляд и спокойная умиротворённая улыбка'
    },
    {
        title: 'Озорство и игра!',
        hint: 'Зайчонок зовёт играть в весёлые прятки! 🎈',
        reqEyes: '😉', reqMouth: '😋',
        desc: 'Задорное подмигивание и озорная улыбка!'
    }
];

let theaterState = {
    heroIdx: 0,
    moodIdx: 0,
    selEyes: '😄',
    selMouth: '😀',
    selAcc: '✨',
    stars: 0
};

const EYE_OPTIONS = ['😄', '😮', '😌', '😉', '🥺', '🤩'];
const MOUTH_OPTIONS = ['😀', '😮', '😊', '😋', '😙', '🥰'];
const ACC_OPTIONS = ['✨', '🌸', '🎈', '💖', '⭐', '🎩', '🕶️', '👑'];

function getTheaterScore() {
    return parseInt(localStorage.getItem('trainbrain_soul_theater') || '0', 10);
}

function renderSoulTheater(container) {
    theaterState.stars = getTheaterScore();
    const hero = THEATER_HEROES[theaterState.heroIdx];
    const task = THEATER_MOODS[theaterState.moodIdx];

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')" title="Назад">
                ←
            </div>
            <div style="text-align:center;">
                <h2 style="margin:0; color:#e879f9; letter-spacing:1px;" class="glow-text">ЭМОДЗИ-ТЕАТР</h2>
                <span style="font-size:11px; color:var(--text-secondary);">КОНСТРУКТОР НАСТРОЕНИЯ</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-weight:bold; color:var(--accent-yellow); font-size:16px;">
                ⭐ <span id="theaterStarsVal">${theaterState.stars}</span>
            </div>
        </div>

        <!-- Hero Selector -->
        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:14px;">
            ${THEATER_HEROES.map((h, i) => `
                <button onclick="setTheaterHero(${i})" class="btn"
                    style="width:48px; height:48px; padding:0; border-radius:14px; font-size:24px; border:2px solid ${i === theaterState.heroIdx ? 'var(--accent-purple)' : 'var(--card-border)'}; background:${i === theaterState.heroIdx ? 'rgba(157,78,221,0.2)' : 'var(--card-bg)'};">
                    ${h.emoji}
                </button>
            `).join('')}
        </div>

        <!-- Task Banner -->
        <div class="glass-card" style="text-align:center; padding:14px; margin-bottom:16px; border-color:rgba(232,121,249,0.25);">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--accent-purple); font-weight:700; margin-bottom:4px;">
                Задание: ${task.title}
            </div>
            <div style="font-size:13px; color:var(--text-primary); font-weight:600;">
                ${task.hint}
            </div>
        </div>

        <!-- Animated Face Display -->
        <div style="position:relative; width:190px; height:190px; margin:0 auto 16px; border-radius:50%; background:radial-gradient(circle at 40% 35%, rgba(232,121,249,0.25) 0%, rgba(157,78,221,0.1) 70%); border:3px solid rgba(232,121,249,0.4); box-shadow:0 0 25px rgba(232,121,249,0.2); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer;"
             id="theaterFace" onclick="animateHeroReaction()">
            <div id="heroBase" style="font-size:84px; line-height:1; transition:transform 0.3s;">
                ${hero.emoji}
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-top:-8px;">
                <span id="faceEyes" style="font-size:26px;">${theaterState.selEyes}</span>
                <span id="faceMouth" style="font-size:26px;">${theaterState.selMouth}</span>
                <span id="faceAcc" style="font-size:24px;">${theaterState.selAcc}</span>
            </div>
        </div>

        <!-- Parts Selectors -->
        <div class="glass-card" style="padding:14px; margin-bottom:14px;">
            <div style="font-size:12px; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">👀 Глазки:</div>
            <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px; margin-bottom:10px;">
                ${EYE_OPTIONS.map(opt => `
                    <button onclick="setTheaterPart('eyes', '${opt}')" class="btn"
                        style="width:42px; height:42px; padding:0; border-radius:10px; font-size:20px; background:${theaterState.selEyes === opt ? 'rgba(232,121,249,0.25)' : 'rgba(255,255,255,0.04)'}; border-color:${theaterState.selEyes === opt ? '#e879f9' : 'transparent'};">
                        ${opt}
                    </button>
                `).join('')}
            </div>

            <div style="font-size:12px; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">👄 Ротик:</div>
            <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px; margin-bottom:10px;">
                ${MOUTH_OPTIONS.map(opt => `
                    <button onclick="setTheaterPart('mouth', '${opt}')" class="btn"
                        style="width:42px; height:42px; padding:0; border-radius:10px; font-size:20px; background:${theaterState.selMouth === opt ? 'rgba(232,121,249,0.25)' : 'rgba(255,255,255,0.04)'}; border-color:${theaterState.selMouth === opt ? '#e879f9' : 'transparent'};">
                        ${opt}
                    </button>
                `).join('')}
            </div>

            <div style="font-size:12px; font-weight:700; color:var(--text-secondary); margin-bottom:6px;">🎀 Украшение:</div>
            <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:6px;">
                ${ACC_OPTIONS.map(opt => `
                    <button onclick="setTheaterPart('acc', '${opt}')" class="btn"
                        style="width:42px; height:42px; padding:0; border-radius:10px; font-size:20px; background:${theaterState.selAcc === opt ? 'rgba(232,121,249,0.25)' : 'rgba(255,255,255,0.04)'}; border-color:${theaterState.selAcc === opt ? '#e879f9' : 'transparent'};">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- Action Button -->
        <button class="btn" onclick="checkTheaterMood()" style="width:100%; padding:15px; font-size:16px; font-weight:700; background:linear-gradient(135deg, rgba(232,121,249,0.25), rgba(157,78,221,0.25)); border-color:rgba(232,121,249,0.5); color:#e879f9; box-shadow:0 0 20px rgba(232,121,249,0.2);">
            ✨ Оживить персонажа!
        </button>
    `;
}

function setTheaterHero(idx) {
    theaterState.heroIdx = idx;
    playSoulSound('pop');
    const container = getSoulContainer('soul_theater');
    if (container) renderSoulTheater(container);
}

function setTheaterPart(part, val) {
    playSoulSound('pop');
    if (part === 'eyes') theaterState.selEyes = val;
    if (part === 'mouth') theaterState.selMouth = val;
    if (part === 'acc') theaterState.selAcc = val;

    const elE = document.getElementById('faceEyes');
    const elM = document.getElementById('faceMouth');
    const elA = document.getElementById('faceAcc');
    if (elE) elE.innerText = theaterState.selEyes;
    if (elM) elM.innerText = theaterState.selMouth;
    if (elA) elA.innerText = theaterState.selAcc;

    const container = getSoulContainer('soul_theater');
    if (container) renderSoulTheater(container);
}

function animateHeroReaction() {
    playSoulSound('giggle');
    const face = document.getElementById('theaterFace');
    if (face) {
        face.style.transform = 'scale(1.15) rotate(6deg)';
        setTimeout(() => face.style.transform = 'scale(1) rotate(0deg)', 280);
    }
}

function checkTheaterMood() {
    animateHeroReaction();
    const task = THEATER_MOODS[theaterState.moodIdx];
    const isMatched = (theaterState.selEyes === task.reqEyes && theaterState.selMouth === task.reqMouth);

    theaterState.stars += 1;
    localStorage.setItem('trainbrain_soul_theater', theaterState.stars.toString());
    saveScore('soul_theater', theaterState.stars);

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.85); backdrop-filter:blur(10px);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        text-align:center; padding:24px; animation:fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
        <div style="font-size:72px; margin-bottom:12px; animation:pulseBadge 0.6s infinite alternate;">
            ${THEATER_HEROES[theaterState.heroIdx].emoji}✨💖
        </div>
        <div style="font-size:24px; font-weight:800; color:#e879f9; margin-bottom:8px;">
            ${isMatched ? '🎉 Точно в точку!' : '✨ Здорово получилось!'}
        </div>
        <div style="font-size:14px; color:var(--text-primary); max-width:280px; line-height:1.4; margin-bottom:12px;">
            Герой ожил и делится своим теплом! Твоя чуткость к эмоциям растёт. +10 ⭐
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => playSoulSound('magic'), 350);

    setTimeout(() => {
        overlay.remove();
        theaterState.moodIdx = (theaterState.moodIdx + 1) % THEATER_MOODS.length;
        const container = getSoulContainer('soul_theater');
        if (container) renderSoulTheater(container);
    }, 1800);
}

// ============================================================================
// 3. МОСТИК ДРУЖБЫ (FRIENDSHIP STORIES & EMPATHY)
// ============================================================================

const FRIENDSHIP_STORIES = [
    {
        hero: '🦔',
        friend: '🐰',
        title: 'Рассыпанные яблочки',
        desc: 'Ежонок споткнулся на тропинке и рассыпал спелые яблочки из корзинки. Он сидит на дорожке и чуть не плачет...',
        kindChoice: {
            icon: '🍎',
            title: 'Помочь собрать яблочки',
            desc: 'Подбежать с улыбкой, помочь бережно сложить урожай в корзинку и сказать: "Всё хорошо, не грусти!"'
        },
        altChoice: {
            icon: '🏃',
            title: 'Быстро пробежать мимо',
            desc: 'Сделать вид, что ничего не произошло, и побежать по своим делам.'
        },
        happyResult: 'Ежонок вытер носик, обнял зайчонка и угостил самым сладким румяным яблочком! 🍎🫂'
    },
    {
        hero: '🐥',
        friend: '🐻',
        title: 'Первый взмах крылышек',
        desc: 'Маленький птенчик сидит на ветке и очень боится сделать свой первый полёт...',
        kindChoice: {
            icon: '💛',
            title: 'Поддержать добрыми словами',
            desc: 'Сказать ласково: "Ты смелый, у тебя всё получится! Я верю в тебя и буду ловить снизу!"'
        },
        altChoice: {
            icon: '📣',
            title: 'Громко крикнуть',
            desc: 'Закричать снизу: "Чего ты там сидишь, прыгай быстрее!"'
        },
        happyResult: 'Птенец расправил крылышки, почувствовал веру друга и легко полетел по воздуху! 🐥✨'
    },
    {
        hero: '🐰',
        friend: '🐱',
        title: 'Новый друг на полянке',
        desc: 'Зайчонок пришёл на новую площадку и робко жмётся к скамейке, стесняясь подойти к зверятам...',
        kindChoice: {
            icon: '🤝',
            title: 'Подойти и позвать в игру',
            desc: 'Подойти, приветливо помахать лапкой: "Привет! Пойдём играть с нами в весёлые прятки!"'
        },
        altChoice: {
            icon: '🙄',
            title: 'Шептаться в сторонке',
            desc: 'Поглядывать издалека и ничего не предлагать.'
        },
        happyResult: 'Зайчонок обрадовался, заулыбался и весело побежал играть со всеми! 🐰🐱🎉'
    },
    {
        hero: '🐶',
        friend: '🦊',
        title: 'Дождливый день',
        desc: 'Щенок загрустил у окошка: на улице льёт дождь, и долгожданная прогулка с мячом отменилась...',
        kindChoice: {
            icon: '🎨',
            title: 'Придумать уютную домашнюю игру',
            desc: 'Построить шалаш из мягких пледов, зажечь фонарик и вместе порисовать яркую радугу!'
        },
        altChoice: {
            icon: '😤',
            title: 'Топать ногами и злиться',
            desc: 'Ворчать на плохую погоду и сидеть в телефоне в одиночестве.'
        },
        happyResult: 'В шалаше было так весело и тепло, что дождик пролетел незаметно! 🐶🦊⛺'
    }
];

let friendshipState = {
    storyIdx: 0,
    bridgesBuilt: 0
};

function getFriendshipScore() {
    return parseInt(localStorage.getItem('trainbrain_soul_friendship') || '0', 10);
}

function renderSoulFriendship(container) {
    friendshipState.bridgesBuilt = getFriendshipScore();
    const story = FRIENDSHIP_STORIES[friendshipState.storyIdx];

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')" title="Назад">
                ←
            </div>
            <div style="text-align:center;">
                <h2 style="margin:0; color:#00e5ff; letter-spacing:1px;" class="glow-text">МОСТИК ДРУЖБЫ</h2>
                <span style="font-size:11px; color:var(--text-secondary);">ИСТОРИИ ДОБРОТЫ</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-weight:bold; color:var(--accent-yellow); font-size:16px;">
                🌈 <span id="bridgesBuiltCount">${friendshipState.bridgesBuilt}</span>
            </div>
        </div>

        <!-- Story Visual Scene -->
        <div class="glass-card" style="text-align:center; padding:20px 16px; margin-bottom:18px; border-color:rgba(0,229,255,0.25); background:radial-gradient(ellipse at 50% 30%, rgba(0,229,255,0.1) 0%, var(--card-bg) 75%);">
            <div style="font-size:68px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; gap:16px;">
                <span>${story.hero}</span>
                <span style="font-size:32px; color:var(--accent-cyan); animation:pulseBadge 0.8s infinite alternate;">...</span>
                <span>${story.friend}</span>
            </div>

            <h3 style="color:var(--accent-cyan); margin-bottom:6px;">${story.title}</h3>
            <p style="font-size:13px; color:var(--text-primary); line-height:1.45; max-width:320px; margin:0 auto;">
                ${story.desc}
            </p>
        </div>

        <div style="font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:10px; text-align:center;">
            Как поступить, чтобы построить Мостик Дружбы?
        </div>

        <!-- Choices -->
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
            <div class="glass-card" onclick="chooseFriendshipAction(true)"
                 style="padding:16px; cursor:pointer; display:flex; align-items:flex-start; gap:14px; border-color:rgba(0,255,136,0.3); background:rgba(0,255,136,0.05); transition:all 0.2s;">
                <div style="font-size:30px;">${story.kindChoice.icon}</div>
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:14px; color:var(--accent-green); margin-bottom:3px;">
                        ${story.kindChoice.title}
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
                        ${story.kindChoice.desc}
                    </div>
                </div>
            </div>

            <div class="glass-card" onclick="chooseFriendshipAction(false)"
                 style="padding:16px; cursor:pointer; display:flex; align-items:flex-start; gap:14px; border-color:rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); transition:all 0.2s;">
                <div style="font-size:30px;">${story.altChoice.icon}</div>
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:14px; color:var(--text-secondary); margin-bottom:3px;">
                        ${story.altChoice.title}
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
                        ${story.altChoice.desc}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function chooseFriendshipAction(isKind) {
    if (!isKind) {
        playSoulSound('pop');
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed; inset:0; z-index:9999;
            background:rgba(0,0,0,0.85); backdrop-filter:blur(10px);
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            text-align:center; padding:24px;
        `;
        overlay.innerHTML = `
            <div style="font-size:54px; margin-bottom:10px;">🥺💔</div>
            <div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:8px;">Ой, другу сейчас так нужна забота...</div>
            <div style="font-size:13px; color:var(--text-secondary); max-width:280px; line-height:1.4; margin-bottom:18px;">
                Попробуй выбрать поступок, от которого на сердце станет тепло и радостно!
            </div>
            <button class="btn" onclick="this.parentElement.remove()" style="padding:12px 24px; font-size:14px; color:var(--accent-cyan);">
                Попробовать ещё раз 💛
            </button>
        `;
        document.body.appendChild(overlay);
        return;
    }

    playSoulSound('cheer');
    const story = FRIENDSHIP_STORIES[friendshipState.storyIdx];
    friendshipState.bridgesBuilt++;
    localStorage.setItem('trainbrain_soul_friendship', friendshipState.bridgesBuilt.toString());
    saveScore('soul_friendship', friendshipState.bridgesBuilt);

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.85); backdrop-filter:blur(10px);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        text-align:center; padding:24px; animation:fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
        <div style="font-size:68px; margin-bottom:8px; animation:pulseBadge 0.6s infinite alternate;">
            🌈🫂✨
        </div>
        <div style="font-size:24px; font-weight:800; color:var(--accent-cyan); margin-bottom:6px;">
            Мостик Дружбы построен!
        </div>
        <div style="font-size:15px; color:var(--text-primary); font-weight:600; margin-bottom:10px; max-width:300px;">
            ${story.happyResult}
        </div>
        <div style="font-size:12px; color:var(--accent-yellow); font-weight:700;">
            💖 Орден «Чуткое сердце» (+15 XP)
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => playSoulSound('magic'), 400);

    setTimeout(() => {
        overlay.remove();
        friendshipState.storyIdx = (friendshipState.storyIdx + 1) % FRIENDSHIP_STORIES.length;
        const container = getSoulContainer('soul_friendship');
        if (container) renderSoulFriendship(container);
    }, 2200);
}

// ============================================================================
// 4. БАНКА РАДОСТИ (JAR OF JOY & GRATITUDE FIREFLIES)
// ============================================================================

const FIREFLIES_CATALOG = [
    { icon: '🥞', text: 'Вкусный завтрак или любимое лакомство' },
    { icon: '🫂', text: 'Тёплые объятия мамы, папы или близких' },
    { icon: '🛴', text: 'Весёлая прогулка на свежем воздухе' },
    { icon: '📚', text: 'Добрая и увлекательная сказка' },
    { icon: '☀️', text: 'Ласковое тёплое солнышко за окном' },
    { icon: '🐱', text: 'Мягкий пушистый котик или пёсик' },
    { icon: '🎨', text: 'Красивый яркий рисунок или поделка' },
    { icon: '🎈', text: 'Звонкий смех и радостная игра с друзьями' }
];

let jarState = {
    collected: [],
    jarsCount: 0
};

function getJarScore() {
    return parseInt(localStorage.getItem('trainbrain_soul_jar') || '0', 10);
}

function renderSoulJar(container) {
    jarState.jarsCount = getJarScore();

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')" title="Назад">
                ←
            </div>
            <div style="text-align:center;">
                <h2 style="margin:0; color:#ffb703; letter-spacing:1px;" class="glow-text">БАНКА РАДОСТИ</h2>
                <span style="font-size:11px; color:var(--text-secondary);">ЛОВЕЦ СВЕТЛЯЧКОВ</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-weight:bold; color:var(--accent-yellow); font-size:16px;">
                🫙 <span id="jarCountVal">${jarState.jarsCount}</span>
            </div>
        </div>

        <!-- Glowing Jar Visual -->
        <div class="glass-card" style="text-align:center; padding:22px 16px; margin-bottom:16px; border-color:rgba(255,183,3,0.3); background:radial-gradient(circle at 50% 40%, rgba(255,183,3,0.18) 0%, var(--card-bg) 75%); position:relative;">
            <div id="magicJarIcon" style="font-size:78px; line-height:1; margin-bottom:10px; filter:drop-shadow(0 0 20px rgba(255,183,3,0.4)); transition:transform 0.3s; cursor:pointer;" onclick="pulseJar()">
                🫙✨
            </div>

            <h3 style="color:var(--accent-yellow); margin-bottom:4px;">Собери светлые моменты дня</h3>
            <p style="font-size:12px; color:var(--text-secondary); max-width:280px; margin:0 auto 12px;">
                Нажимай на светлячков ниже. Они залетают в банку и превращают её в волшебный ночник!
            </p>

            <div style="font-size:12px; font-weight:700; color:var(--accent-yellow);">
                В баночке: ${jarState.collected.length} светлячков тепла
            </div>
        </div>

        <!-- Fireflies Selection Grid -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
            ${FIREFLIES_CATALOG.map(f => {
                const isCaught = jarState.collected.includes(f.text);
                return `
                    <button class="btn" onclick="catchFirefly('${f.icon}', '${f.text.replace(/'/g, "\\'")}')"
                        style="padding:12px 10px; text-align:left; justify-content:flex-start; font-size:12px; border-radius:12px; background:${isCaught ? 'rgba(255,183,3,0.15)' : 'rgba(255,255,255,0.03)'}; border-color:${isCaught ? 'rgba(255,183,3,0.4)' : 'rgba(255,255,255,0.06)'}; gap:8px;">
                        <span style="font-size:20px;">${f.icon}</span>
                        <span style="flex:1; line-height:1.2; color:${isCaught ? 'var(--accent-yellow)' : 'var(--text-primary)'};">${f.text}</span>
                    </button>
                `;
            }).join('')}
        </div>

        ${jarState.collected.length >= 3 ? `
            <button class="btn" onclick="completeJoyJar()"
                    style="width:100%; padding:15px; font-size:16px; font-weight:800; background:linear-gradient(135deg, rgba(255,183,3,0.3), rgba(0,255,136,0.25)); border-color:rgba(255,183,3,0.6); color:var(--accent-yellow); box-shadow:0 0 25px rgba(255,183,3,0.3);">
                🌟 Зажечь волшебный ночник!
            </button>
        ` : `
            <div style="text-align:center; font-size:12px; color:var(--text-secondary); font-style:italic;">
                Поймай ещё ${3 - jarState.collected.length} светлячка, чтобы ночник засиял! ✨
            </div>
        `}
    `;
}

function pulseJar() {
    playSoulSound('magic');
    const el = document.getElementById('magicJarIcon');
    if (el) {
        el.style.transform = 'scale(1.2) rotate(8deg)';
        setTimeout(() => el.style.transform = 'scale(1) rotate(0deg)', 260);
    }
}

function catchFirefly(icon, text) {
    playSoulSound('pop');
    if (!jarState.collected.includes(text)) {
        jarState.collected.push(text);
    }
    const container = getSoulContainer('soul_jar');
    if (container) renderSoulJar(container);
}

function completeJoyJar() {
    playSoulSound('cheer');
    jarState.jarsCount++;
    localStorage.setItem('trainbrain_soul_jar', jarState.jarsCount.toString());
    saveScore('soul_jar', jarState.jarsCount);

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.85); backdrop-filter:blur(10px);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        text-align:center; padding:24px; animation:fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
        <div style="font-size:74px; margin-bottom:12px; filter:drop-shadow(0 0 25px rgba(255,183,3,0.7)); animation:pulseBadge 0.6s infinite alternate;">
            🫙✨🌙
        </div>
        <div style="font-size:24px; font-weight:800; color:var(--accent-yellow); margin-bottom:8px;">
            Твой ночник радости сияет!
        </div>
        <div style="font-size:14px; color:var(--text-primary); max-width:290px; line-height:1.45; margin-bottom:16px;">
            Сегодняшний день был наполнен теплом и добром. Пусть сны будут безмятежными и счастливыми!
        </div>
        <div style="font-size:13px; font-weight:700; color:var(--accent-green);">
            +20 XP к покою и душе 💛
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => playSoulSound('magic'), 450);

    setTimeout(() => {
        overlay.remove();
        jarState.collected = [];
        const container = getSoulContainer('soul_jar');
        if (container) renderSoulJar(container);
    }, 2400);
}
