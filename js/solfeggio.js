// =============================================
// СОЛЬФЕДЖИО — Определение нот на слух
// =============================================
let solfeggioState = {
    audioContext: null,
    currentNote: null,
    phase: 'setup', // setup, playing, input, result
    bestScore: 0,
    streak: 0,
    instrument: 'sine', // sine, square, triangle, piano
    difficulty: 'medium', // easy (3), medium (7), hard (12)
    recentNotes: []
};

const ALL_NOTES = [
    { name: 'До', freq: 261.63, color: '#ff006e', type: 'natural' },
    { name: 'До#', freq: 277.18, color: '#d90429', type: 'accidental' },
    { name: 'Ре', freq: 293.66, color: '#fb5607', type: 'natural' },
    { name: 'Ре#', freq: 311.13, color: '#f77f00', type: 'accidental' },
    { name: 'Ми', freq: 329.63, color: '#ffbe0b', type: 'natural' },
    { name: 'Фа', freq: 349.23, color: '#00ff88', type: 'natural' },
    { name: 'Фа#', freq: 369.99, color: '#00b4d8', type: 'accidental' },
    { name: 'Соль', freq: 392.00, color: '#00e5ff', type: 'natural' },
    { name: 'Соль#', freq: 415.30, color: '#0077b6', type: 'accidental' },
    { name: 'Ля', freq: 440.00, color: '#8338ec', type: 'natural' },
    { name: 'Ля#', freq: 466.16, color: '#5a189a', type: 'accidental' },
    { name: 'Си', freq: 493.88, color: '#e879f9', type: 'natural' }
];

function getActiveNotes() {
    if (solfeggioState.difficulty === 'easy') {
        return ALL_NOTES.filter(n => ['До', 'Ми', 'Соль'].includes(n.name));
    } else if (solfeggioState.difficulty === 'medium') {
        return ALL_NOTES.filter(n => n.type === 'natural');
    } else {
        return ALL_NOTES;
    }
}

function initAudio() {
    if (!solfeggioState.audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        solfeggioState.audioContext = new AudioContext();
    }
    if (solfeggioState.audioContext.state === 'suspended') {
        solfeggioState.audioContext.resume();
    }
}

function playNote(freq, duration = 1000, forceType = null) {
    initAudio();
    const ctx = solfeggioState.audioContext;
    const t = ctx.currentTime;
    const type = forceType || solfeggioState.instrument;

    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    if (type === 'piano') {
        // Имитация пианино (быстрая атака, экспоненциальное затухание)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, t);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, t); // Обертон для яркости
        
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.value = 0.3; // Обертон тише
        
        osc1.connect(gainNode);
        osc2.connect(osc2Gain);
        osc2Gain.connect(gainNode);

        // Огибающая пианино (молоток бьет по струне и звук плавно затухает)
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(1, t + 0.02); // Быстрая атака (удар)
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + Math.max(duration / 1000, 1.5)); // Долгое затухание
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + Math.max(duration / 1000, 1.5));
        osc2.stop(t + Math.max(duration / 1000, 1.5));
    } else {
        // Стандартный электронный звук (камертон, флейта, 8-бит)
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.5, t + 0.1);
        gainNode.gain.setValueAtTime(0.5, t + (duration / 1000) - 0.2);
        gainNode.gain.linearRampToValueAtTime(0, t + (duration / 1000));
        
        osc.connect(gainNode);
        osc.start(t);
        osc.stop(t + (duration / 1000));
    }
}

function renderSolfeggio(container) {
    const scores = getUserScores();
    solfeggioState.bestScore = scores.solfeggio || 0;
    
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="goBack('solfeggio', solfeggioState.phase === 'playing' || solfeggioState.phase === 'input')">←</div>
            <h2 style="margin: 0; color: var(--accent-cyan);" class="glow-text">СОЛЬФЕДЖИО</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="solfeggioScore">${solfeggioState.bestScore}</div>
        </div>
        <div id="solfeggioContent" style="text-align: center; margin-top: 20px;">
            ${renderSolfeggioSetup()}
        </div>
    `;
}

function renderSolfeggioSetup() {
    solfeggioState.streak = 0; // Сбрасываем серию побед при новом старте
    return `
        <div class="glass-card" style="margin-top: 40px; padding: 30px 20px;">
            <div style="font-size: 60px; margin-bottom: 10px;">🎵</div>
            <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">Абсолютный слух</h3>
            <p style="margin-bottom: 20px; font-size: 13px; opacity: 0.8;">Тренируй распознавание нот на слух.</p>
            
            <div style="margin-bottom: 25px; text-align: left;">
                <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Инструмент</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button class="btn ${solfeggioState.instrument === 'sine' ? 'active-btn' : ''}" onclick="setSolfeggioInst('sine')" style="font-size: 13px; padding: 10px;">Камертон</button>
                    <button class="btn ${solfeggioState.instrument === 'triangle' ? 'active-btn' : ''}" onclick="setSolfeggioInst('triangle')" style="font-size: 13px; padding: 10px;">Флейта</button>
                    <button class="btn ${solfeggioState.instrument === 'piano' ? 'active-btn' : ''}" onclick="setSolfeggioInst('piano')" style="font-size: 13px; padding: 10px;">Пианино</button>
                    <button class="btn ${solfeggioState.instrument === 'square' ? 'active-btn' : ''}" onclick="setSolfeggioInst('square')" style="font-size: 13px; padding: 10px;">8-Бит</button>
                </div>
            </div>

            <div style="margin-bottom: 30px; text-align: left;">
                <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Сложность</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <button class="btn ${solfeggioState.difficulty === 'easy' ? 'active-btn' : ''}" onclick="setSolfeggioDiff('easy')" style="font-size: 13px; padding: 10px;">Легко<br><span style="font-size:10px;opacity:0.6;">3 ноты</span></button>
                    <button class="btn ${solfeggioState.difficulty === 'medium' ? 'active-btn' : ''}" onclick="setSolfeggioDiff('medium')" style="font-size: 13px; padding: 10px;">Средне<br><span style="font-size:10px;opacity:0.6;">7 нот</span></button>
                    <button class="btn ${solfeggioState.difficulty === 'hard' ? 'active-btn' : ''}" onclick="setSolfeggioDiff('hard')" style="font-size: 13px; padding: 10px;">Сложно<br><span style="font-size:10px;opacity:0.6;">12 нот</span></button>
                </div>
            </div>

            <div style="margin-bottom: 30px; text-align: left;">
                <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Послушать ноты</label>
                <div style="display: grid; grid-template-columns: repeat(${solfeggioState.difficulty === 'hard' ? 4 : 3}, 1fr); gap: 6px;">
                    ${getActiveNotes().map(note => `
                        <button class="btn" onclick="playNote(${note.freq}, 1000)" style="font-size: 12px; padding: 8px; border-color: ${note.color}40; color: ${note.color};">
                            ${note.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <button class="btn" onclick="startSolfeggioRound()" style="width: 100%; background: rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.2); color: var(--accent-cyan);">
                Начать тренировку
            </button>
        </div>
        <style>
            .active-btn {
                background: rgba(0,255,136,0.2) !important;
                border-color: var(--accent-green) !important;
                color: var(--accent-green) !important;
            }
        </style>
    `;
}

function setSolfeggioInst(inst) {
    solfeggioState.instrument = inst;
    playNote(440, 500); // Play A4 to demo the sound
    const content = document.getElementById('solfeggioContent');
    if (content) content.innerHTML = renderSolfeggioSetup();
}

function setSolfeggioDiff(diff) {
    solfeggioState.difficulty = diff;
    const content = document.getElementById('solfeggioContent');
    if (content) content.innerHTML = renderSolfeggioSetup();
}

function startSolfeggioRound() {
    const notes = getActiveNotes();
    let randIdx;
    let selectedNote;
    
    // Защита от слишком частого повторения одной и той же ноты (не более 3 раз подряд)
    do {
        randIdx = Math.floor(Math.random() * notes.length);
        selectedNote = notes[randIdx];
    } while (
        notes.length > 1 && 
        solfeggioState.recentNotes.length >= 3 &&
        solfeggioState.recentNotes.every(n => n === selectedNote.name)
    );

    solfeggioState.recentNotes.push(selectedNote.name);
    if (solfeggioState.recentNotes.length > 3) {
        solfeggioState.recentNotes.shift(); // Храним только 3 последние ноты
    }

    solfeggioState.currentNote = selectedNote;
    solfeggioState.phase = 'playing';

    const content = document.getElementById('solfeggioContent');
    content.innerHTML = `
        <div style="margin-top: 40px;">
            <p style="font-weight: bold; margin-bottom: 20px; color: var(--accent-green);">Слушай внимательно...</p>
            
            <div id="noteVisual" style="width: 120px; height: 120px; margin: 0 auto 30px; border-radius: 50%; background: rgba(0,255,136,0.1); border: 2px solid var(--accent-green); display: flex; align-items: center; justify-content: center; font-size: 50px; animation: pulse 1s infinite alternate; box-shadow: 0 0 20px var(--accent-green);">
                🎶
            </div>

            <button class="btn" onclick="repeatNote()" style="margin-bottom: 30px; background: rgba(255,255,255,0.05); font-size: 12px; padding: 10px 15px;">
                Повторить звук 🔁
            </button>
            
            <div id="solfeggioOptions" style="display: none; grid-template-columns: repeat(${solfeggioState.difficulty === 'hard' ? 4 : 3}, 1fr); gap: 10px; max-width: 100%; margin: 0 auto; padding-bottom: 30px;">
                ${notes.map(note => `
                    <button class="btn" onclick="checkSolfeggioAnswer('${note.name}')" style="font-size: 14px; font-weight: 700; padding: 15px 5px; border-color: ${note.color}40; color: ${note.color};">
                        ${note.name}
                    </button>
                `).join('')}
                <div style="grid-column: span ${solfeggioState.difficulty === 'hard' ? 4 : 3}; opacity: 0;">&nbsp;</div>
            </div>
        </div>
    `;

    // Играем ноту и показываем варианты
    playNote(solfeggioState.currentNote.freq, 1500);

    setTimeout(() => {
        const visual = document.getElementById('noteVisual');
        if (visual) {
            visual.style.animation = 'none';
            visual.style.opacity = '0.5';
        }
        const options = document.getElementById('solfeggioOptions');
        if (options) {
            options.style.display = 'grid';
            solfeggioState.phase = 'input';
        }
    }, 1500);
}

function repeatNote() {
    if (solfeggioState.currentNote) {
        playNote(solfeggioState.currentNote.freq, 1000);
    }
}

function checkSolfeggioAnswer(answer) {
    if (solfeggioState.phase !== 'input') return;
    solfeggioState.phase = 'result';

    const isCorrect = (answer === solfeggioState.currentNote.name);
    const content = document.getElementById('solfeggioContent');
    const multiplier = solfeggioState.difficulty === 'hard' ? 3 : (solfeggioState.difficulty === 'medium' ? 1.5 : 1);

    if (isCorrect) {
        solfeggioState.streak++;
        const gain = Math.round(solfeggioState.streak * 5 * multiplier);
        
        if (gain > solfeggioState.bestScore) {
            solfeggioState.bestScore = gain;
            saveScore('solfeggio', gain);
            const scoreEl = document.getElementById('solfeggioScore');
            if (scoreEl) scoreEl.innerText = gain;
        }

        playNote(solfeggioState.currentNote.freq, 500); 

        content.innerHTML = `
            <div style="margin-top: 40px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: var(--accent-green); margin-bottom: 10px;">ПРАВИЛЬНО!</h2>
                <p style="margin-bottom: 5px;">Это нота <b style="color: ${solfeggioState.currentNote.color}; font-size: 20px;">${solfeggioState.currentNote.name}</b></p>
                <p style="margin-bottom: 30px; font-size: 14px; color: var(--accent-yellow);">Серия правильных: ${solfeggioState.streak}</p>
                <p style="font-size: 12px; opacity: 0.6;">Следующая нота через 2 сек...</p>
            </div>
        `;
        setTimeout(() => startSolfeggioRound(), 2000);
    } else {
        solfeggioState.streak = 0;

        content.innerHTML = `
            <div style="margin-top: 40px;">
                <div style="font-size: 60px; margin-bottom: 20px;">❌</div>
                <h2 style="color: var(--accent-pink); margin-bottom: 10px;">ОШИБКА</h2>
                <p style="margin-bottom: 10px;">Ваш ответ: <b>${answer}</b></p>
                <p style="margin-bottom: 20px;">Правильный ответ: <b style="color: ${solfeggioState.currentNote.color}; font-size: 20px;">${solfeggioState.currentNote.name}</b></p>
                
                <button class="btn" onclick="playNote(${solfeggioState.currentNote.freq}, 1000)" style="margin-bottom: 30px; font-size: 12px; background: rgba(255,255,255,0.05);">
                    Послушать правильную 🎵
                </button>
                
                <p style="font-size: 12px; opacity: 0.6;">Продолжаем через 3 сек...</p>
            </div>
        `;
        setTimeout(() => startSolfeggioRound(), 3500);
    }
}
