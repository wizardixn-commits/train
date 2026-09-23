// ============================================================
// ТЕНИ — Silhouette / Shadow Spatial Game
// Угадай, какую тень отбрасывает 3D-фигура при освещении
// ============================================================

const SHADOW_PUZZLES = [
    {
        title: 'Уголок: вид сверху',
        dir: 'сверху (XY)',
        emoji: '☀️',
        cubes: [[0,0,0],[1,0,0],[0,1,0]],
        opts: [
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="20" fill="currentColor"/><rect x="0" y="20" width="20" height="20" fill="currentColor"/></svg>`, // correct L-shape
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="10" width="40" height="20" fill="currentColor"/></svg>`,
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="10" y="0" width="20" height="40" fill="currentColor"/></svg>`,
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="0" width="20" height="40" fill="currentColor"/><rect x="20" y="0" width="20" height="20" fill="currentColor"/></svg>`
        ],
        correct: 0
    },
    {
        title: 'Ступенька: вид спереди',
        dir: 'спереди (XZ)',
        emoji: '🔦',
        cubes: [[0,0,0],[1,0,0],[1,0,1]],
        opts: [
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="10" width="40" height="20" fill="currentColor"/></svg>`,
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="20" width="40" height="20" fill="currentColor"/><rect x="20" y="0" width="20" height="20" fill="currentColor"/></svg>`, // correct step up right
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="20" width="40" height="20" fill="currentColor"/><rect x="0" y="0" width="20" height="20" fill="currentColor"/></svg>`,
            `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="40" fill="currentColor"/></svg>`
        ],
        correct: 1
    },
    {
        title: 'Башня с пристройкой: вид сбоку',
        dir: 'сбоку (YZ)',
        emoji: '💡',
        cubes: [[0,0,0],[0,0,1],[0,0,2],[1,0,0]], // tall tower at 0, arm at 1. But side view (YZ)!
        // YZ: y=0 has z=0,1,2. So it's a vertical line. The arm at x=1 has y=0, z=0. It overlaps in YZ view!
        // So shadow is just a 1x3 vertical line.
        opts: [
            `<svg width="40" height="60" viewBox="0 0 40 60"><rect x="0" y="40" width="40" height="20" fill="currentColor"/><rect x="0" y="0" width="20" height="40" fill="currentColor"/></svg>`,
            `<svg width="40" height="60" viewBox="0 0 40 60"><rect x="0" y="40" width="40" height="20" fill="currentColor"/><rect x="20" y="0" width="20" height="40" fill="currentColor"/></svg>`,
            `<svg width="40" height="60" viewBox="0 0 40 60"><rect x="10" y="0" width="20" height="60" fill="currentColor"/></svg>`, // correct (just tower)
            `<svg width="40" height="60" viewBox="0 0 40 60"><rect x="0" y="20" width="40" height="40" fill="currentColor"/></svg>`
        ],
        correct: 2
    },
    {
        title: 'Крест 3D: вид сверху',
        dir: 'сверху (XY)',
        emoji: '☀️',
        cubes: [[1,1,0],[0,1,0],[2,1,0],[1,0,0],[1,2,0],[1,1,1]], // Cross on ground + 1 up
        opts: [
            `<svg width="60" height="60" viewBox="0 0 60 60"><rect x="20" y="0" width="20" height="60" fill="currentColor"/><rect x="0" y="20" width="60" height="20" fill="currentColor"/></svg>`, // correct (cross)
            `<svg width="60" height="60" viewBox="0 0 60 60"><rect x="0" y="0" width="60" height="60" fill="currentColor"/></svg>`,
            `<svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="20" fill="currentColor"/></svg>`,
            `<svg width="60" height="60" viewBox="0 0 60 60"><rect x="20" y="20" width="20" height="20" fill="currentColor"/></svg>`
        ],
        correct: 0
    },
    {
        title: 'Ступеньки: вид спереди',
        dir: 'спереди (XZ)',
        emoji: '🔦',
        cubes: [[0,0,0],[1,0,0],[2,0,0],[1,0,1],[2,0,1],[2,0,2]], // staircase
        opts: [
            `<svg width="60" height="60" viewBox="0 0 60 60"><polygon points="0,60 60,60 60,0 40,0 40,20 20,20 20,40 0,40" fill="currentColor"/></svg>`, // correct (stairs)
            `<svg width="60" height="60" viewBox="0 0 60 60"><polygon points="0,60 60,60 60,0" fill="currentColor"/></svg>`,
            `<svg width="60" height="60" viewBox="0 0 60 60"><rect x="0" y="0" width="60" height="60" fill="currentColor"/></svg>`,
            `<svg width="60" height="60" viewBox="0 0 60 60"><polygon points="0,60 60,60 0,0" fill="currentColor"/></svg>`
        ],
        correct: 0
    }
];

const SH_LEVELS = {
    easy:   { label:'Лёгкий',  icon:'🧩', q:3 },
    medium: { label:'Средний', icon:'🔷', q:4 },
    hard:   { label:'Сложный', icon:'🔮', q:5 },
};

let shState = { level:'easy', score:0, question:0, total:0, streak:0, isPlaying:false, pool:[], corIdx:0 };

function renderShadow3d(container) {
    const st=shState; st.isPlaying=false;
    const scores=getUserScores(),best=scores.shadow3d||0;
    const ex=SHADOW_PUZZLES[1];
    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#94a3b8;" class="glow-text">ТЕНИ</h2>
                <span style="font-size:11px;color:var(--text-secondary);">УГАДАЙ ПО ТЕНИ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">🏆 ${best}</div>
        </div>
        <div class="glass-card" style="padding:14px;margin-bottom:14px;border-color:rgba(148,163,184,0.25);
             background:radial-gradient(ellipse at 50% 0%,rgba(148,163,184,0.1) 0%,var(--card-bg) 70%);">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#cbd5e1;text-align:center;margin-bottom:10px;">🌑 Найди правильную тень!</div>
            
            <div style="display:flex;justify-content:center;align-items:center;gap:20px;">
                <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);">
                    ${isoRenderCubes(ex.cubes, {top:'#60a5fa', left:'#2563eb', right:'#1e40af', stroke:'#172554'})}
                </div>
                <div style="font-size:24px;">→</div>
                <div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:10px;color:#fff;">
                    ${ex.opts[ex.correct]}
                </div>
            </div>
            <p style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:10px;line-height:1.5;">
                Внимательно смотри, с какой стороны светит свет, и выбирай форму тени.
            </p>
        </div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Сложность:</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;">
            ${Object.entries(SH_LEVELS).map(([k,c])=>`
                <div class="glass-card" onclick="shSelectLevel('${k}')" id="sh-lv-${k}"
                     style="flex:1;padding:12px 6px;cursor:pointer;text-align:center;
                            border-color:${k===st.level?'rgba(148,163,184,0.55)':'rgba(255,255,255,0.06)'};
                            background:${k===st.level?'rgba(148,163,184,0.12)':'transparent'};">
                    <div style="font-size:20px;margin-bottom:4px;">${c.icon}</div>
                    <div style="font-size:11px;font-weight:700;color:${k===st.level?'#f8fafc':'var(--text-primary)'};">${c.label}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${c.q} вопр.</div>
                </div>`).join('')}
        </div>
        <button class="btn" onclick="shStart()" style="width:100%;padding:16px;font-size:17px;font-weight:800;
            background:linear-gradient(135deg,rgba(148,163,184,0.2),rgba(51,65,85,0.5));
            border-color:rgba(148,163,184,0.5);color:#f8fafc;">🌑 Начать</button>
    `;
}

function shSelectLevel(key) {
    shState.level=key;
    document.querySelectorAll('[id^="sh-lv-"]').forEach(el=>{
        const k=el.id.replace('sh-lv-',''),a=k===key;
        el.style.borderColor=a?'rgba(148,163,184,0.55)':'rgba(255,255,255,0.06)';
        el.style.background=a?'rgba(148,163,184,0.12)':'transparent';
        el.querySelector('div:nth-child(2)').style.color=a?'#f8fafc':'var(--text-primary)';
    });
}

function shStart() {
    const st=shState;
    st.pool=[...SHADOW_PUZZLES].sort(()=>Math.random()-0.5);
    st.total=SH_LEVELS[st.level].q;
    st.score=st.question=st.streak=0; st.isPlaying=true;
    shShowQ();
}

function shShowQ() {
    const st=shState;
    const container=document.getElementById('shadow3d');
    if(!container) return;
    if(st.question>=st.total){shFinish();return;}
    const pz=st.pool[st.question%st.pool.length];
    const pct=Math.round((st.question/st.total)*100);

    const opts=pz.opts.map((svg,i)=>({svg,isCorrect:i===pz.correct})).sort(()=>Math.random()-0.5);
    st.corIdx=opts.findIndex(o=>o.isCorrect);

    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-size:12px;color:var(--text-secondary);">${st.question+1}/${st.total}</span>
                <span style="font-size:14px;font-weight:800;color:#cbd5e1;">⭐ ${st.score}</span>
                ${st.streak>=3?`<span style="color:var(--accent-yellow);font-size:13px;">🔥${st.streak}</span>`:''}
            </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:10px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#94a3b8,#334155);border-radius:2px;transition:width 0.4s;"></div>
        </div>

        <div class="glass-card" style="padding:12px;margin-bottom:10px;border-color:rgba(148,163,184,0.25);text-align:center;">
            <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#f8fafc;margin-bottom:8px;">
                ${pz.emoji} Освещение: <span style="color:#fbbf24">${pz.dir}</span>
            </div>
            <div style="display:flex;justify-content:center;margin-bottom:8px;">
                <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;">
                    ${isoRenderCubes(pz.cubes, {top:'#60a5fa', left:'#2563eb', right:'#1e40af', stroke:'#172554'})}
                </div>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="sh-opts">
            ${opts.map((o,i)=>`
                <div class="glass-card sh-opt" id="sh-opt-${i}" onclick="shAnswer(${i})"
                     style="padding:16px;cursor:pointer;text-align:center;min-height:80px;
                            border-color:rgba(255,255,255,0.1);color:#fff;
                            display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
                    ${o.svg}
                </div>`).join('')}
        </div>
    `;
}

function shAnswer(idx) {
    const st=shState, isCorrect=idx===st.corIdx;
    document.querySelectorAll('.sh-opt').forEach(el=>{el.style.pointerEvents='none';el.style.opacity='0.4';});
    const c=document.getElementById(`sh-opt-${idx}`);
    if(c){c.style.opacity='1';c.style.borderColor=isCorrect?'rgba(0,255,136,0.7)':'rgba(244,63,94,0.6)';c.style.background=isCorrect?'rgba(0,255,136,0.1)':'rgba(244,63,94,0.07)';}
    if(!isCorrect){const ok=document.getElementById(`sh-opt-${st.corIdx}`);if(ok){ok.style.opacity='1';ok.style.borderColor='rgba(0,255,136,0.5)';}}
    if(isCorrect){st.score++;st.streak++;p3dSound('ok');}else{st.streak=0;p3dSound('err');}
    st.question++;
    setTimeout(()=>shShowQ(),isCorrect?900:1700);
}

function shFinish() {
    const st=shState; st.isPlaying=false;
    const ex=document.getElementById('shEndOv'); if(ex)ex.remove();
    const scores=getUserScores(),prev=scores.shadow3d||0;
    if(st.score>prev)saveScore('shadow3d',st.score);
    const isRec=st.score>prev,pct=Math.round((st.score/st.total)*100);
    const grade=pct>=90?'🏆 Мастер света!':pct>=70?'🥇 Отлично!':pct>=50?'🥈 Хорошо!':'🥉 Тренируйся!';
    const ov=document.createElement('div'); ov.id='shEndOv';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    ov.innerHTML=`<div style="font-size:60px;margin-bottom:10px;">🌑</div>
        <div style="font-size:22px;font-weight:800;color:#cbd5e1;margin-bottom:6px;">${grade}</div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">${st.score} из ${st.total}</div>
        ${isRec?'<div style="font-size:13px;color:var(--accent-yellow);">✨ Рекорд!</div>':''}
        <div style="width:180px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:12px auto 18px;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#94a3b8,#334155);border-radius:3px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="shBtnA" style="padding:14px;font-size:15px;font-weight:700;color:#f8fafc;border-color:rgba(148,163,184,0.5);">🔄 Снова</button>
            <button class="btn" id="shBtnM" style="padding:14px;font-size:15px;color:var(--text-secondary);">⚙️ Меню</button>
        </div>`;
    document.body.appendChild(ov);
    document.getElementById('shBtnA').onclick=()=>{ov.remove();shStart();};
    document.getElementById('shBtnM').onclick=()=>{ov.remove();navigate('shadow3d');};
}
