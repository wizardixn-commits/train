// ============================================================
// МЕНТАЛЬНОЕ ВРАЩЕНИЕ — Mental Rotation Spatial Game
// Две 3D-фигуры: это одна и та же фигура (повёрнутая) или зеркальная?
// ============================================================
// Использует isoRenderCubes() из puzzle3d.js

const MR_PAL_A = { top:'#60a5fa', left:'#2563eb', right:'#1e40af', stroke:'#172554' };
const MR_PAL_B = { top:'#f472b6', left:'#db2777', right:'#9d174d', stroke:'#500724' };

// Puzzle pairs: [A cubes, B cubes, isMirror (true=mirror, false=rotation)]
// false = одинаковые (просто повёрнуты), true = зеркальные
const MR_PUZZLES = [
    // SAME (rotations)
    { a:[[0,0,0],[1,0,0],[2,0,0],[2,1,0]], b:[[0,0,0],[0,1,0],[0,2,0],[1,2,0]], mirror:false },
    { a:[[0,0,0],[1,0,0],[1,0,1]],          b:[[0,0,0],[0,1,0],[0,1,1]],          mirror:false },
    { a:[[0,0,0],[1,0,0],[0,1,0],[0,0,1]],  b:[[1,0,0],[0,0,0],[1,1,0],[1,0,1]],  mirror:false },
    { a:[[0,0,0],[1,0,0],[2,0,0],[1,1,0]], b:[[0,0,0],[0,1,0],[0,2,0],[1,1,0]], mirror:false },
    { a:[[0,0,0],[0,0,1],[0,0,2],[1,0,2]], b:[[0,0,0],[1,0,0],[2,0,0],[2,0,1]], mirror:false },
    { a:[[0,0,0],[1,0,0],[1,1,0],[1,1,1]], b:[[0,0,0],[0,1,0],[1,1,0],[1,1,1]], mirror:false },

    // MIRROR
    { a:[[0,0,0],[1,0,0],[2,0,0],[0,1,0]], b:[[0,0,0],[1,0,0],[2,0,0],[2,1,0]], mirror:true },
    { a:[[0,0,0],[1,0,0],[1,0,1],[1,1,1]], b:[[0,0,0],[1,0,0],[1,0,1],[0,1,1]], mirror:true },
    { a:[[0,0,0],[0,1,0],[0,2,0],[1,0,0]], b:[[0,0,0],[0,1,0],[0,2,0],[1,2,0]], mirror:true },
    { a:[[0,0,0],[1,0,0],[0,1,0],[0,0,1]], b:[[1,0,0],[0,0,0],[1,1,0],[1,0,1]], mirror:false },
    { a:[[0,0,0],[1,0,0],[2,0,0],[0,0,1]], b:[[0,0,0],[1,0,0],[2,0,0],[2,0,1]], mirror:true },
    { a:[[0,0,0],[1,0,0],[1,1,0],[2,1,0]], b:[[0,1,0],[1,1,0],[1,0,0],[2,0,0]], mirror:true },
];

const MR_LEVELS = {
    easy:   { label:'Лёгкий',  icon:'🧩', q:6  },
    medium: { label:'Средний', icon:'🔷', q:9  },
    hard:   { label:'Сложный', icon:'🔮', q:12 },
};

let mrState = {
    level:'easy', score:0, question:0, total:0, streak:0,
    isPlaying:false, pool:[], answered:false,
};

function renderMentalRotation(container) {
    const st = mrState; st.isPlaying = false;
    const scores = getUserScores(), best = scores.mental_rotation || 0;
    const ex = MR_PUZZLES[0];
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#f472b6;" class="glow-text">ВРАЩЕНИЕ</h2>
                <span style="font-size:11px;color:var(--text-secondary);">МЕНТАЛЬНОЕ ВРАЩЕНИЕ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">🏆 ${best}</div>
        </div>
        <div class="glass-card" style="padding:14px;margin-bottom:14px;border-color:rgba(244,114,182,0.25);
             background:radial-gradient(ellipse at 50% 0%,rgba(219,39,119,0.1) 0%,var(--card-bg) 70%);">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#f472b6;text-align:center;margin-bottom:10px;">Две фигуры — одинаковые или зеркальные?</div>
            <div style="display:flex;gap:12px;justify-content:center;align-items:center;">
                <div style="background:rgba(0,0,0,0.25);border-radius:10px;padding:10px;border:2px solid rgba(96,165,250,0.4);">
                    ${isoRenderCubes(ex.a, MR_PAL_A)}
                </div>
                <div style="font-size:22px;color:var(--text-secondary);">vs</div>
                <div style="background:rgba(0,0,0,0.25);border-radius:10px;padding:10px;border:2px solid rgba(244,114,182,0.4);">
                    ${isoRenderCubes(ex.b, MR_PAL_B)}
                </div>
            </div>
            <p style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:10px;line-height:1.5;">
                Покрути фигуры мысленно.<br>Одинаковые — это одна фигура в разных поворотах.<br>Зеркальные — как правая и левая рука.
            </p>
        </div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Сложность:</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;">
            ${Object.entries(MR_LEVELS).map(([k,c]) => `
                <div class="glass-card" onclick="mrSelectLevel('${k}')" id="mr-lv-${k}"
                     style="flex:1;padding:12px 6px;cursor:pointer;text-align:center;
                            border-color:${k===st.level?'rgba(244,114,182,0.55)':'rgba(255,255,255,0.06)'};
                            background:${k===st.level?'rgba(244,114,182,0.12)':'transparent'};">
                    <div style="font-size:20px;margin-bottom:4px;">${c.icon}</div>
                    <div style="font-size:11px;font-weight:700;color:${k===st.level?'#f472b6':'var(--text-primary)'};">${c.label}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${c.q} пар</div>
                </div>
            `).join('')}
        </div>
        <button class="btn" onclick="mrStart()" style="width:100%;padding:16px;font-size:17px;font-weight:800;
            background:linear-gradient(135deg,rgba(219,39,119,0.2),rgba(168,85,247,0.12));
            border-color:rgba(219,39,119,0.5);color:#f472b6;">🔄 Начать</button>
    `;
}

function mrSelectLevel(key) {
    mrState.level = key;
    document.querySelectorAll('[id^="mr-lv-"]').forEach(el => {
        const k=el.id.replace('mr-lv-',''), a=k===key;
        el.style.borderColor=a?'rgba(244,114,182,0.55)':'rgba(255,255,255,0.06)';
        el.style.background=a?'rgba(244,114,182,0.12)':'transparent';
        el.querySelector('div:nth-child(2)').style.color=a?'#f472b6':'var(--text-primary)';
    });
}

function mrStart() {
    const st = mrState;
    st.pool = [...MR_PUZZLES].sort(()=>Math.random()-0.5);
    st.total = MR_LEVELS[st.level].q;
    st.score = st.question = st.streak = 0;
    st.isPlaying = true;
    mrShowQ();
}

function mrShowQ() {
    const st = mrState;
    const container = document.getElementById('mental_rotation');
    if (!container) return;
    if (st.question >= st.total) { mrFinish(); return; }

    const pz = st.pool[st.question % st.pool.length];
    const pct = Math.round((st.question/st.total)*100);

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-size:12px;color:var(--text-secondary);">${st.question+1}/${st.total}</span>
                <span style="font-size:14px;font-weight:800;color:#f472b6;">⭐ ${st.score}</span>
                ${st.streak>=3?`<span style="color:var(--accent-yellow);font-size:13px;">🔥${st.streak}</span>`:''}
            </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:14px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#db2777,#a855f7);border-radius:2px;transition:width 0.4s;"></div>
        </div>

        <div style="font-size:13px;font-weight:700;text-align:center;color:var(--text-primary);margin-bottom:14px;">
            Эти фигуры <b>одинаковые</b> (повёрнуты) или <b>зеркальные</b>?
        </div>

        <div class="glass-card" style="padding:16px;margin-bottom:18px;border-color:rgba(255,255,255,0.08);">
            <div style="display:flex;gap:14px;justify-content:center;align-items:center;">
                <div>
                    <div style="font-size:9px;color:rgba(96,165,250,0.8);text-align:center;margin-bottom:5px;font-weight:700;letter-spacing:1px;">ФИГУРА A</div>
                    <div style="background:rgba(96,165,250,0.06);border:2px solid rgba(96,165,250,0.3);border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;min-height:90px;min-width:80px;">
                        ${isoRenderCubes(pz.a, MR_PAL_A)}
                    </div>
                </div>
                <div style="font-size:26px;color:var(--text-secondary);">↔</div>
                <div>
                    <div style="font-size:9px;color:rgba(244,114,182,0.8);text-align:center;margin-bottom:5px;font-weight:700;letter-spacing:1px;">ФИГУРА B</div>
                    <div style="background:rgba(244,114,182,0.06);border:2px solid rgba(244,114,182,0.3);border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;min-height:90px;min-width:80px;">
                        ${isoRenderCubes(pz.b, MR_PAL_B)}
                    </div>
                </div>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="btn" id="mr-btn-same" onclick="mrAnswer(false)"
                style="padding:16px 8px;font-size:15px;font-weight:800;
                       background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.4);color:#60a5fa;">
                ↻ Одинаковые
            </button>
            <button class="btn" id="mr-btn-mirror" onclick="mrAnswer(true)"
                style="padding:16px 8px;font-size:15px;font-weight:800;
                       background:rgba(244,114,182,0.1);border-color:rgba(244,114,182,0.4);color:#f472b6;">
                🪞 Зеркальные
            </button>
        </div>
        <div style="font-size:10px;color:var(--text-secondary);text-align:center;margin-top:8px;opacity:0.6;">
            Мысленно покрути синюю фигуру — сможешь совместить с розовой?
        </div>
    `;
}

function mrAnswer(guessedMirror) {
    const st = mrState;
    const pz = st.pool[st.question % st.pool.length];
    const isCorrect = guessedMirror === pz.mirror;

    ['mr-btn-same','mr-btn-mirror'].forEach(id => {
        const b = document.getElementById(id); if(b) b.style.pointerEvents='none';
    });

    const clickedId = guessedMirror ? 'mr-btn-mirror' : 'mr-btn-same';
    const btn = document.getElementById(clickedId);
    if (btn) {
        btn.style.background = isCorrect ? 'rgba(0,255,136,0.15)' : 'rgba(244,63,94,0.12)';
        btn.style.borderColor = isCorrect ? 'rgba(0,255,136,0.7)' : 'rgba(244,63,94,0.6)';
        btn.style.color = isCorrect ? '#00ff88' : '#f43f5e';
    }
    if (!isCorrect) {
        const corId = pz.mirror ? 'mr-btn-mirror' : 'mr-btn-same';
        const corBtn = document.getElementById(corId);
        if (corBtn) { corBtn.style.background='rgba(0,255,136,0.1)'; corBtn.style.borderColor='rgba(0,255,136,0.5)'; corBtn.style.color='#00ff88'; }
    }

    if (isCorrect) { st.score++; st.streak++; p3dSound('ok'); } else { st.streak=0; p3dSound('err'); }
    st.question++;
    setTimeout(()=>mrShowQ(), isCorrect?800:1500);
}

function mrFinish() {
    const st = mrState; st.isPlaying=false;
    const ex=document.getElementById('mrEndOverlay'); if(ex)ex.remove();
    const scores=getUserScores(), prev=scores.mental_rotation||0;
    if(st.score>prev) saveScore('mental_rotation',st.score);
    const isRec=st.score>prev, pct=Math.round((st.score/st.total)*100);
    const grade=pct>=90?'🏆 Гений!':pct>=70?'🥇 Отлично!':pct>=50?'🥈 Хорошо!':'🥉 Тренируйся!';
    const ov=document.createElement('div'); ov.id='mrEndOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    ov.innerHTML=`
        <div style="font-size:60px;margin-bottom:10px;">🔄</div>
        <div style="font-size:22px;font-weight:800;color:#f472b6;margin-bottom:6px;">${grade}</div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">${st.score} из ${st.total}</div>
        ${isRec?'<div style="font-size:13px;color:var(--accent-yellow);">✨ Рекорд!</div>':''}
        <div style="width:180px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:12px auto 18px;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#db2777,#a855f7);border-radius:3px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="mrBtnAgain" style="padding:14px;font-size:15px;font-weight:700;color:#f472b6;border-color:rgba(244,114,182,0.5);">🔄 Снова</button>
            <button class="btn" id="mrBtnMenu" style="padding:14px;font-size:15px;color:var(--text-secondary);">⚙️ Меню</button>
        </div>`;
    document.body.appendChild(ov);
    document.getElementById('mrBtnAgain').onclick=()=>{ov.remove();mrStart();};
    document.getElementById('mrBtnMenu').onclick=()=>{ov.remove();navigate('mental_rotation');};
}
