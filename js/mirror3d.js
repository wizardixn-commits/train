// ============================================================
// ЗЕРКАЛО — Mirror Reflection Spatial Game
// Покажи зеркальное отражение 3D-фигуры из 4 вариантов
// ============================================================

const MIR_PAL_REF  = { top:'#fbbf24', left:'#d97706', right:'#92400e', stroke:'#451a03' };
const MIR_PAL_OPT  = { top:'#60a5fa', left:'#2563eb', right:'#1e40af', stroke:'#172554' };
const MIR_PAL_OK   = { top:'#4ade80', left:'#16a34a', right:'#14532d', stroke:'#052e16' };
const MIR_PAL_FAIL = { top:'#f87171', left:'#dc2626', right:'#7f1d1d', stroke:'#450a0a' };

// Each puzzle: reference shape + 4 options (mirror = index of correct mirror)
// Wrong options must be visually CLEARLY different from each other and from the mirror.
// Mirror axis: X (left-right flip), meaning x → (maxX - 1 - x)
const MIR_PUZZLES = [
    // ── PUZZLE 1: simple L-shape ──────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[2,0,0],[2,1,0]],
        opts:[
            [[0,0,0],[1,0,0],[2,0,0],[0,1,0]],  // ✓ mirror
            [[0,0,0],[0,1,0],[0,2,0],[1,2,0]],  
            [[0,0,0],[1,0,0],[2,0,0],[1,1,0]],  
            [[0,0,0],[1,0,0],[2,0,0],[2,0,1]],  
        ], mirror:0
    },
    // ── PUZZLE 2: step shape ──────────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[1,0,1]],
        opts:[
            [[0,0,0],[1,0,0],[2,0,0]],          
            [[0,0,0],[0,0,1],[1,0,0]],          // ✓ mirror (left height 2, right height 1)
            [[0,0,0],[0,0,1],[0,0,2]],          
            [[0,0,0],[1,0,0],[1,0,1],[1,0,2]],  
        ], mirror:1
    },
    // ── PUZZLE 3: tower ───────────────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[1,0,1],[1,0,2]], // base of 2, right goes to height 3
        opts:[
            [[0,0,0],[1,0,0],[2,0,0],[1,0,1]],  
            [[0,0,0],[1,0,0],[1,1,0],[1,2,0]],  
            [[0,0,0],[1,0,0],[0,0,1],[1,0,1]],  
            [[0,0,0],[1,0,0],[0,0,1],[0,0,2]],  // ✓ mirror (left goes to height 3)
        ], mirror:3
    },
    // ── PUZZLE 4: 2x2 with arm ────────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[1,2,0]],
        opts:[
            [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,2,0]], // ✓ mirror
            [[0,0,0],[1,0,0],[0,1,0],[1,1,0]],         
            [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,2,0],[1,2,0]], 
            [[0,0,0],[1,0,0],[2,0,0],[1,1,0],[1,2,0]], 
        ], mirror:0
    },
    // ── PUZZLE 5: Z-shape ─────────────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[1,1,0],[2,1,0]],
        opts:[
            [[0,1,0],[1,1,0],[1,0,0],[2,0,0]],  // ✓ mirror
            [[0,0,0],[1,0,0],[2,0,0],[1,1,0]],  
            [[0,0,0],[0,1,0],[1,1,0],[1,2,0]],  
            [[0,0,0],[1,0,0],[0,1,0],[0,2,0]],  
        ], mirror:0
    },
    // ── PUZZLE 6: 3D corner ───────────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[0,1,0],[0,0,1]], // Corner extending along x,y,z
        opts:[
            [[1,0,0],[0,0,0],[1,1,0],[1,0,1]],  // ✓ mirror
            [[0,0,0],[1,0,0],[2,0,0],[0,1,0]],  
            [[0,0,0],[0,0,1],[0,0,2],[1,0,0]],  
            [[0,0,0],[1,0,0],[1,1,0],[1,0,1]],  
        ], mirror:0
    },
    // ── PUZZLE 7: Spiral steps ────────────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[1,1,0],[1,1,1]], // Right, back, up
        opts:[
            [[0,0,0],[1,0,0],[0,1,0],[0,1,1]],  
            [[1,0,0],[0,0,0],[0,1,0],[0,1,1]],  // ✓ mirror
            [[0,0,0],[1,0,0],[1,0,1],[1,1,1]],  
            [[0,0,0],[0,0,1],[0,1,1],[1,1,1]],  
        ], mirror:1
    },
    // ── PUZZLE 8: Asymmetric T-tower ──────────────────────────────────────
    {
        ref: [[0,0,0],[1,0,0],[2,0,0],[1,0,1],[1,0,2],[0,1,0]],
        opts:[
            [[0,0,0],[1,0,0],[2,0,0],[1,0,1],[1,0,2],[2,1,0]],  // ✓ mirror
            [[0,0,0],[1,0,0],[2,0,0],[1,0,1],[1,0,2],[1,1,0]],  
            [[0,0,0],[1,0,0],[2,0,0],[1,0,1],[0,1,0]],  
            [[0,0,0],[1,0,0],[2,0,0],[1,1,0],[2,1,0]],  
        ], mirror:0
    },
];

const MIR_LEVELS = {
    easy:   { label:'Лёгкий',  icon:'🧩', q:4 },
    medium: { label:'Средний', icon:'🔷', q:6 },
    hard:   { label:'Сложный', icon:'🔮', q:8 },
};

let mirState = { level:'easy', score:0, question:0, total:0, streak:0, isPlaying:false, pool:[], corIdx:0 };

function renderMirror3d(container) {
    const st=mirState; st.isPlaying=false;
    const scores=getUserScores(),best=scores.mirror3d||0;
    const ex=MIR_PUZZLES[0];
    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#fbbf24;" class="glow-text">ЗЕРКАЛО</h2>
                <span style="font-size:11px;color:var(--text-secondary);">ЗЕРКАЛЬНЫЙ БЛИЗНЕЦ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">🏆 ${best}</div>
        </div>
        <div class="glass-card" style="padding:14px;margin-bottom:14px;border-color:rgba(251,191,36,0.25);
             background:radial-gradient(ellipse at 50% 0%,rgba(217,119,6,0.1) 0%,var(--card-bg) 70%);">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#fbbf24;text-align:center;margin-bottom:10px;">🪞 Найди зеркальный близнец!</div>
            <div style="display:flex;justify-content:center;gap:14px;align-items:center;flex-wrap:wrap;">
                <div>
                    <div style="font-size:9px;color:rgba(251,191,36,0.8);text-align:center;margin-bottom:4px;font-weight:700;letter-spacing:1px;">ИСХОДНАЯ</div>
                    <div style="background:rgba(0,0,0,0.25);border:2px solid rgba(251,191,36,0.4);border-radius:10px;padding:10px;">
                        ${isoRenderCubes(ex.ref, MIR_PAL_REF)}
                    </div>
                </div>
                <div style="font-size:28px;">🪞</div>
                <div>
                    <div style="font-size:9px;color:rgba(96,165,250,0.8);text-align:center;margin-bottom:4px;font-weight:700;letter-spacing:1px;">ЗЕРКАЛЬНАЯ?</div>
                    <div style="background:rgba(0,0,0,0.25);border:2px solid rgba(96,165,250,0.4);border-radius:10px;padding:10px;">
                        ${isoRenderCubes(ex.opts[ex.mirror], MIR_PAL_OPT)}
                    </div>
                </div>
            </div>
            <p style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:10px;line-height:1.5;">
                Выбери фигуру, которая является зеркальным отражением золотой!
            </p>
        </div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Сложность:</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;">
            ${Object.entries(MIR_LEVELS).map(([k,c])=>`
                <div class="glass-card" onclick="mirSelectLevel('${k}')" id="mir-lv-${k}"
                     style="flex:1;padding:12px 6px;cursor:pointer;text-align:center;
                            border-color:${k===st.level?'rgba(251,191,36,0.55)':'rgba(255,255,255,0.06)'};
                            background:${k===st.level?'rgba(251,191,36,0.1)':'transparent'};">
                    <div style="font-size:20px;margin-bottom:4px;">${c.icon}</div>
                    <div style="font-size:11px;font-weight:700;color:${k===st.level?'#fbbf24':'var(--text-primary)'};">${c.label}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${c.q} вопр.</div>
                </div>`).join('')}
        </div>
        <button class="btn" onclick="mirStart()" style="width:100%;padding:16px;font-size:17px;font-weight:800;
            background:linear-gradient(135deg,rgba(217,119,6,0.2),rgba(168,85,247,0.12));
            border-color:rgba(217,119,6,0.5);color:#fbbf24;">🪞 Начать</button>
    `;
}

function mirSelectLevel(key) {
    mirState.level=key;
    document.querySelectorAll('[id^="mir-lv-"]').forEach(el=>{
        const k=el.id.replace('mir-lv-',''),a=k===key;
        el.style.borderColor=a?'rgba(251,191,36,0.55)':'rgba(255,255,255,0.06)';
        el.style.background=a?'rgba(251,191,36,0.1)':'transparent';
        el.querySelector('div:nth-child(2)').style.color=a?'#fbbf24':'var(--text-primary)';
    });
}

function mirStart() {
    const st=mirState;
    st.pool=[...MIR_PUZZLES].sort(()=>Math.random()-0.5);
    st.total=MIR_LEVELS[st.level].q;
    st.score=st.question=st.streak=0; st.isPlaying=true;
    mirShowQ();
}

function mirShowQ() {
    const st=mirState;
    const container=document.getElementById('mirror3d');
    if(!container) return;
    if(st.question>=st.total){mirFinish();return;}
    const pz=st.pool[st.question%st.pool.length];
    const pct=Math.round((st.question/st.total)*100);

    // Shuffle answer options keeping correct index
    const opts=pz.opts.map((o,i)=>({cubes:o,isCorrect:i===pz.mirror})).sort(()=>Math.random()-0.5);
    st.corIdx=opts.findIndex(o=>o.isCorrect);

    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-size:12px;color:var(--text-secondary);">${st.question+1}/${st.total}</span>
                <span style="font-size:14px;font-weight:800;color:#fbbf24;">⭐ ${st.score}</span>
                ${st.streak>=3?`<span style="color:var(--accent-yellow);font-size:13px;">🔥${st.streak}</span>`:''}
            </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:10px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#d97706,#a855f7);border-radius:2px;transition:width 0.4s;"></div>
        </div>

        <div class="glass-card" style="padding:12px;margin-bottom:10px;border-color:rgba(251,191,36,0.25);text-align:center;">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#fbbf24;margin-bottom:8px;">🪞 Найди зеркальное отражение</div>
            <div style="display:flex;justify-content:center;">
                <div style="background:rgba(0,0,0,0.25);border:2px solid rgba(251,191,36,0.5);border-radius:10px;padding:12px;">
                    ${isoRenderCubes(pz.ref, MIR_PAL_REF)}
                </div>
            </div>
        </div>

        <div style="font-size:10px;color:var(--text-secondary);text-align:center;margin-bottom:8px;">Какая фигура является зеркальным отражением золотой?</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="mir-opts">
            ${opts.map((o,i)=>`
                <div class="glass-card mir-opt" id="mir-opt-${i}" onclick="mirAnswer(${i})"
                     style="padding:8px;cursor:pointer;text-align:center;min-height:80px;
                            border-color:rgba(96,165,250,0.2);
                            display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
                    ${isoRenderCubes(o.cubes, MIR_PAL_OPT)}
                </div>`).join('')}
        </div>
    `;
}

function mirAnswer(idx) {
    const st=mirState, isCorrect=idx===st.corIdx;
    document.querySelectorAll('.mir-opt').forEach(el=>{el.style.pointerEvents='none';el.style.opacity='0.4';});
    const c=document.getElementById(`mir-opt-${idx}`);
    if(c){c.style.opacity='1';c.style.borderColor=isCorrect?'rgba(0,255,136,0.7)':'rgba(244,63,94,0.6)';c.style.background=isCorrect?'rgba(0,255,136,0.1)':'rgba(244,63,94,0.07)';}
    if(!isCorrect){const ok=document.getElementById(`mir-opt-${st.corIdx}`);if(ok){ok.style.opacity='1';ok.style.borderColor='rgba(0,255,136,0.5)';}}
    if(isCorrect){st.score++;st.streak++;p3dSound('ok');}else{st.streak=0;p3dSound('err');}
    st.question++;
    setTimeout(()=>mirShowQ(),isCorrect?900:1700);
}

function mirFinish() {
    const st=mirState; st.isPlaying=false;
    const ex=document.getElementById('mirEndOv'); if(ex)ex.remove();
    const scores=getUserScores(),prev=scores.mirror3d||0;
    if(st.score>prev)saveScore('mirror3d',st.score);
    const isRec=st.score>prev,pct=Math.round((st.score/st.total)*100);
    const grade=pct>=90?'🏆 Гений!':pct>=70?'🥇 Отлично!':pct>=50?'🥈 Хорошо!':'🥉 Тренируйся!';
    const ov=document.createElement('div'); ov.id='mirEndOv';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    ov.innerHTML=`<div style="font-size:60px;margin-bottom:10px;">🪞</div>
        <div style="font-size:22px;font-weight:800;color:#fbbf24;margin-bottom:6px;">${grade}</div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">${st.score} из ${st.total}</div>
        ${isRec?'<div style="font-size:13px;color:var(--accent-yellow);">✨ Рекорд!</div>':''}
        <div style="width:180px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:12px auto 18px;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#d97706,#a855f7);border-radius:3px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="mirBtnA" style="padding:14px;font-size:15px;font-weight:700;color:#fbbf24;border-color:rgba(217,119,6,0.5);">🔄 Снова</button>
            <button class="btn" id="mirBtnM" style="padding:14px;font-size:15px;color:var(--text-secondary);">⚙️ Меню</button>
        </div>`;
    document.body.appendChild(ov);
    document.getElementById('mirBtnA').onclick=()=>{ov.remove();mirStart();};
    document.getElementById('mirBtnM').onclick=()=>{ov.remove();navigate('mirror3d');};
}
