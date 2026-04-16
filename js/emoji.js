// =============================================
// СМАЙЛЫ — Visual Emoji Memory
// =============================================
let emojiState = {
    count: 5,
    time: 2000,
    items: [],
    phase: 'setup', // setup, showing, hidden, revealed
    bestScore: 0
};

const EMOJI_LIST = [
    '😀', '🤣', '🤡', '👽', '👻', '🤖', '👾', '🐱', '🐶', '🦊', '🦁', '🐯', '🐼', '🐨', 
    '🐷', '🐸', '🦄', '🐝', '🐙', '🐢', '🦖', '🐉', '🌵', '🎄', '🌈', '🔥', '⚡', '❄️', 
    '🍎', '🍕', '🍔', '🍟', '🍦', '🍩', '⚽', '🏀', '🎮', '🚗', '✈️', '🚀', '🛸', '🎸', 
    '💎', '🧿', '🧬', '🧿', '🎭', '🎨', '🎬', '🧩', '🧸', '🎈', '🎉', '🎁', '💡', '⏰'
];

function renderEmoji(container) {
    const scores = getUserScores();
    emojiState.bestScore = scores.emoji || 0;
    
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <h2 style="margin: 0; color: var(--accent-purple);" class="glow-text">СМАЙЛЫ</h2>
            <div style="font-weight: bold; color: var(--accent-yellow); font-size: 18px;" id="emojiScore">${emojiState.bestScore}</div>
        </div>
        <div id="emojiContent" style="text-align: center; margin-top: 20px;">
            ${renderEmojiSetup()}
        </div>
    `;
}

function renderEmojiSetup() {
    return `
        <div class="glass-card" style="margin-top: 40px; padding: 30px 20px;">
            <h3 style="margin-bottom: 20px; color: var(--accent-purple);">Упражнение для памяти</h3>
            
            <p style="margin-bottom: 15px; font-size: 14px;">Количество смайлов (3–20)</p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 30px;">
                <button class="btn" onclick="adjustEmojiCount(-1)" style="width: 50px; height: 50px; padding: 0;">-</button>
                <div id="emojiCountDisp" style="font-size: 36px; font-weight: 800; color: var(--text-primary); width: 60px;">${emojiState.count}</div>
                <button class="btn" onclick="adjustEmojiCount(1)" style="width: 50px; height: 50px; padding: 0;">+</button>
            </div>

            <h3 style="margin-bottom: 15px; color: var(--accent-cyan); font-size: 14px;">Время показа (мс)</h3>
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 40px;">
                <button class="btn" onclick="adjustEmojiTime(-500)" style="width: 40px; height: 40px; padding: 0; font-size: 14px;">-</button>
                <input type="number" id="emojiTimeInput" value="${emojiState.time}" onchange="updateEmojiTime(this.value)" 
                    style="width: 100px; text-align: center; font-size: 20px; font-weight: 700; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--text-primary); padding: 8px;">
                <button class="btn" onclick="adjustEmojiTime(500)" style="width: 40px; height: 40px; padding: 0; font-size: 14px;">+</button>
            </div>
            
            <button class="btn" onclick="startEmoji()" style="width: 100%; background: rgba(157,78,221,0.1); border-color: rgba(157,78,221,0.3); color: var(--accent-purple);">
                Начать упражнение
            </button>
        </div>
        <p style="margin-top: 30px; font-size: 11px; opacity: 0.6; line-height: 1.5;">Смайлы появятся в разных местах. Запомните их!<br>Учитель откроет их кнопкой после исчезновения.</p>
    `;
}

function adjustEmojiCount(delta) {
    emojiState.count = Math.max(3, Math.min(20, emojiState.count + delta));
    const el = document.getElementById('emojiCountDisp');
    if (el) el.innerText = emojiState.count;
}

function adjustEmojiTime(delta) {
    emojiState.time = Math.max(500, Math.min(60000, emojiState.time + delta));
    const el = document.getElementById('emojiTimeInput');
    if (el) el.value = emojiState.time;
}

function updateEmojiTime(val) {
    let n = parseInt(val);
    if (isNaN(n)) n = 2000;
    emojiState.time = Math.max(100, Math.min(60000, n));
}

function startEmoji() {
    emojiState.phase = 'showing';
    // Generate items
    const shuffled = [...EMOJI_LIST].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, emojiState.count);
    
    // Position scattering
    const items = [];
    const gridRows = 8;
    const gridCols = 6;
    const cells = [];
    for (let r = 0; r < gridRows; r++) for (let c = 0; c < gridCols; c++) cells.push({r, c});
    const shuffledCells = cells.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < selected.length; i++) {
        const cell = shuffledCells[i];
        // randomize within cell
        const offsetX = Math.random() * 10 - 5; 
        const offsetY = Math.random() * 10 - 5;
        items.push({
            emoji: selected[i],
            x: (cell.c / gridCols) * 100 + (100 / gridCols / 2) + offsetX,
            y: (cell.r / gridRows) * 100 + (100 / gridRows / 2) + offsetY
        });
    }
    emojiState.items = items;
    
    renderEmojiBoard(true);
    
    setTimeout(() => {
        emojiState.phase = 'hidden';
        renderEmojiBoard(false);
    }, emojiState.time);
}

function renderEmojiBoard(visible) {
    const content = document.getElementById('emojiContent');
    const boardHtml = emojiState.items.map(item => `
        <div style="position: absolute; left: ${item.x}%; top: ${item.y}%; transform: translate(-50%, -50%); font-size: 40px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: ${visible ? 1 : 0};">
            ${item.emoji}
        </div>
    `).join('');

    content.innerHTML = `
        <div style="position: relative; width: 100%; height: 420px; background: rgba(0,0,0,0.1); border-radius: 20px; border: 1px solid var(--card-border); overflow: hidden; margin-top: 10px;">
            ${boardHtml}
            ${!visible ? `
                <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);">
                    <div style="text-align: center;">
                        <div style="font-size: 60px; margin-bottom: 20px; opacity: 0.3;">🧠</div>
                        <p style="color: #fff; font-weight: 600;">Смайлы скрыты</p>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div style="margin-top: 25px; display: flex; gap: 12px;">
            ${!visible && emojiState.phase === 'hidden' ? `
                <button class="btn" onclick="revealEmojis()" style="flex: 2; background: var(--accent-purple); color: #fff; border: none;">Показать всё</button>
            ` : ''}
            <button class="btn" onclick="startEmoji()" style="flex: 1; border-color: var(--accent-purple); color: var(--accent-purple);">Снова</button>
            <button class="btn" onclick="renderEmoji(document.getElementById('emoji'))" style="flex: 1; font-size: 12px;">Выход</button>
        </div>
    `;
}

function revealEmojis() {
    emojiState.phase = 'revealed';
    renderEmojiBoard(true);
}
