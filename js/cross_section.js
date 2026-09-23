// ============================================================
// УГАДАЙ СЕЧЕНИЕ — Cross-Section Spatial Game
// Плоскость разрезает 3D-фигуру — какова форма сечения?
// ============================================================

// Each puzzle: SVG string of the 3D solid + cut line, plus 4 answer choices
// Answers shown as 2D shapes in SVG

const CS_PUZZLES = [
    // ── Куб ──────────────────────────────────────────────────────────────
    { title:'Куб: горизонтальный срез', emoji:'🟦',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="98.1,33.0 60.0,55.0 21.9,33.0 60.0,11.0" fill="#60a5fa" stroke="#3b82f6" stroke-width="1" stroke-linejoin="round" />
        <polygon points="21.9,33.0 60.0,55.0 60.0,99.0 21.9,77.0" fill="#1e40af" stroke="#172554" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,33.0 60.0,55.0 60.0,99.0 98.1,77.0" fill="#2563eb" stroke="#1e40af" stroke-width="1" stroke-linejoin="round" />
        <polygon points="117.2,55.0 60.0,88.0 2.8,55.0 60.0,22.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Треугольник','Шестиугольник','Прямоугольник'], correct:0 },

    { title:'Куб: диагональный срез', emoji:'🟦',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="98.1,33.0 60.0,55.0 21.9,33.0 60.0,11.0" fill="#60a5fa" stroke="#3b82f6" stroke-width="1" stroke-linejoin="round" />
        <polygon points="21.9,33.0 60.0,55.0 60.0,99.0 21.9,77.0" fill="#1e40af" stroke="#172554" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,33.0 60.0,55.0 60.0,99.0 98.1,77.0" fill="#2563eb" stroke="#1e40af" stroke-width="1" stroke-linejoin="round" />
        <polygon points="2.8,88.0 60.0,121.0 117.2,22.0 60.0,-11.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Прямоугольник','Треугольник','Шестиугольник'], correct:1 },

    { title:'Куб: угловой срез через три ребра', emoji:'🟦',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="98.1,33.0 60.0,55.0 21.9,33.0 60.0,11.0" fill="#60a5fa" stroke="#3b82f6" stroke-width="1" stroke-linejoin="round" />
        <polygon points="21.9,33.0 60.0,55.0 60.0,99.0 21.9,77.0" fill="#1e40af" stroke="#172554" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,33.0 60.0,55.0 60.0,99.0 98.1,77.0" fill="#2563eb" stroke="#1e40af" stroke-width="1" stroke-linejoin="round" />
        <polygon points="21.9,33.0 98.1,33.0 60.0,99.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Шестиугольник','Треугольник','Трапеция'], correct:2 },

    // ── Пирамида ──────────────────────────────────────────────────────────
    { title:'Пирамида: горизонтальный срез', emoji:'🔺',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="21.9,77.0 60.0,99.0 60.0,33.0" fill="#7e22ce" stroke="#581c87" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,77.0 60.0,99.0 60.0,33.0" fill="#a855f7" stroke="#7e22ce" stroke-width="1" stroke-linejoin="round" />
        <polygon points="117.2,55.0 60.0,88.0 2.8,55.0 60.0,22.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Треугольник','Квадрат','Трапеция','Круг'], correct:1 },

    { title:'Пирамида: срез через вершину и основание', emoji:'🔺',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="21.9,77.0 60.0,99.0 60.0,33.0" fill="#7e22ce" stroke="#581c87" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,77.0 60.0,99.0 60.0,33.0" fill="#a855f7" stroke="#7e22ce" stroke-width="1" stroke-linejoin="round" />
        <polygon points="31.4,71.5 88.6,104.5 88.6,38.5 31.4,5.5" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Прямоугольник','Треугольник','Трапеция'], correct:2 },

    // ── Цилиндр (из кубиков — восьмиугольник) ────────────────────────────
    { title:'Цилиндр: горизонтальный срез', emoji:'🔵',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <ellipse cx="60" cy="77.0" rx="28.6" ry="16.5" fill="#0891b2" stroke="#164e63" stroke-width="1"/>
        <rect x="31.4" y="33.0" width="57.2" height="44" fill="#06b6d4" stroke="none"/>
        <line x1="31.4" y1="33.0" x2="31.4" y2="77.0" stroke="#164e63" stroke-width="1"/>
        <line x1="88.6" y1="33.0" x2="88.6" y2="77.0" stroke="#164e63" stroke-width="1"/>
        <ellipse cx="60" cy="33.0" rx="28.6" ry="16.5" fill="#22d3ee" stroke="#0891b2" stroke-width="1"/>
        <polygon points="117.2,55.0 60.0,88.0 2.8,55.0 60.0,22.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Эллипс / Круг','Треугольник','Прямоугольник'], correct:1 },

    { title:'Цилиндр: вертикальный срез', emoji:'🔵',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <ellipse cx="60" cy="77.0" rx="28.6" ry="16.5" fill="#0891b2" stroke="#164e63" stroke-width="1"/>
        <rect x="31.4" y="33.0" width="57.2" height="44" fill="#06b6d4" stroke="none"/>
        <line x1="31.4" y1="33.0" x2="31.4" y2="77.0" stroke="#164e63" stroke-width="1"/>
        <line x1="88.6" y1="33.0" x2="88.6" y2="77.0" stroke="#164e63" stroke-width="1"/>
        <ellipse cx="60" cy="33.0" rx="28.6" ry="16.5" fill="#22d3ee" stroke="#0891b2" stroke-width="1"/>
        <polygon points="2.8,88.0 117.2,88.0 117.2,22.0 2.8,22.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Эллипс','Квадрат','Прямоугольник','Трапеция'], correct:2 },

    // ── L-образная призма ─────────────────────────────────────────────────
    { title:'Г-призма: горизонтальный срез', emoji:'📐',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="60.0,22.0 98.1,44.0 79.1,55.0 40.9,33.0" fill="#4ade80" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="40.9,33.0 60.0,44.0 40.9,55.0 21.9,44.0" fill="#4ade80" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="21.9,44.0 40.9,55.0 40.9,77.0 21.9,66.0" fill="#14532d" stroke="#052e16" stroke-width="1" stroke-linejoin="round" />
        <polygon points="60.0,44.0 79.1,55.0 79.1,77.0 60.0,66.0" fill="#14532d" stroke="#052e16" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,44.0 79.1,55.0 79.1,77.0 98.1,66.0" fill="#22c55e" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="60.0,44.0 40.9,55.0 40.9,77.0 60.0,66.0" fill="#22c55e" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="117.2,55.0 60.0,88.0 2.8,55.0 60.0,22.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Г-образник','Прямоугольник','Треугольник'], correct:1 },

    { title:'Г-призма: вертикальный срез', emoji:'📐',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <polygon points="60.0,22.0 98.1,44.0 79.1,55.0 40.9,33.0" fill="#4ade80" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="40.9,33.0 60.0,44.0 40.9,55.0 21.9,44.0" fill="#4ade80" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="21.9,44.0 40.9,55.0 40.9,77.0 21.9,66.0" fill="#14532d" stroke="#052e16" stroke-width="1" stroke-linejoin="round" />
        <polygon points="60.0,44.0 79.1,55.0 79.1,77.0 60.0,66.0" fill="#14532d" stroke="#052e16" stroke-width="1" stroke-linejoin="round" />
        <polygon points="98.1,44.0 79.1,55.0 79.1,77.0 98.1,66.0" fill="#22c55e" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="60.0,44.0 40.9,55.0 40.9,77.0 60.0,66.0" fill="#22c55e" stroke="#16a34a" stroke-width="1" stroke-linejoin="round" />
        <polygon points="79.1,55.0 21.9,88.0 21.9,44.0 79.1,11.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Г-образник','Прямоугольник','Квадрат','Треугольник'], correct:1 },

    // ── Шар ──────────────────────────────────────────────────────────────
    { title:'Шар: любой срез', emoji:'🔮',
      fig: `<svg width="120" height="110" viewBox="0 0 120 110">
        <defs>
          <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fbcfe8" />
            <stop offset="60%" stop-color="#f472b6" />
            <stop offset="100%" stop-color="#be185d" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="55" r="28.6" fill="url(#sphereGrad)" stroke="#9d174d" stroke-width="1"/>
        <polygon points="117.2,55.0 60.0,88.0 2.8,55.0 60.0,22.0" fill="rgba(245,158,11,0.6)" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      </svg>`,
      opts:['Квадрат','Эллипс','Круг','Треугольник'], correct:2 },
];

// 2D shape SVGs for answer buttons
const CS_SHAPES = {
    'Квадрат':         `<svg width="44" height="44" viewBox="0 0 44 44"><rect x="4" y="4" width="36" height="36" fill="currentColor" opacity="0.4" rx="2" stroke="currentColor" stroke-width="2"/></svg>`,
    'Прямоугольник':   `<svg width="56" height="36" viewBox="0 0 56 36"><rect x="3" y="3" width="50" height="30" fill="currentColor" opacity="0.4" rx="2" stroke="currentColor" stroke-width="2"/></svg>`,
    'Треугольник':     `<svg width="52" height="46" viewBox="0 0 52 46"><polygon points="26,3 49,43 3,43" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
    'Трапеция':        `<svg width="60" height="40" viewBox="0 0 60 40"><polygon points="10,3 50,3 57,37 3,37" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
    'Шестиугольник':   `<svg width="50" height="46" viewBox="0 0 50 46"><polygon points="25,2 47,13.5 47,32.5 25,44 3,32.5 3,13.5" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
    'Эллипс / Круг':   `<svg width="54" height="36" viewBox="0 0 54 36"><ellipse cx="27" cy="18" rx="24" ry="15" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
    'Эллипс':          `<svg width="54" height="36" viewBox="0 0 54 36"><ellipse cx="27" cy="18" rx="24" ry="15" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
    'Круг':            `<svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
    'Г-образник':      `<svg width="46" height="46" viewBox="0 0 46 46"><polygon points="3,3 25,3 25,23 43,23 43,43 3,43" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/></svg>`,
};

const CS_LEVELS = {
    easy:   { label:'Лёгкий',  icon:'🧩', q:4 },
    medium: { label:'Средний', icon:'🔷', q:7 },
    hard:   { label:'Сложный', icon:'🔮', q:10 },
};

let csState = { level:'easy', score:0, question:0, total:0, streak:0, isPlaying:false, pool:[] };

function renderCrossSection(container) {
    const st = csState; st.isPlaying=false;
    const scores=getUserScores(), best=scores.cross_section||0;
    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#22c55e;" class="glow-text">СЕЧЕНИЯ</h2>
                <span style="font-size:11px;color:var(--text-secondary);">УГАДАЙ СЕЧЕНИЕ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">🏆 ${best}</div>
        </div>
        <div class="glass-card" style="padding:14px;margin-bottom:14px;border-color:rgba(34,197,94,0.25);
             background:radial-gradient(ellipse at 50% 0%,rgba(34,197,94,0.1) 0%,var(--card-bg) 70%);">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#22c55e;text-align:center;margin-bottom:10px;">✂️ Плоскость режет фигуру — какова форма среза?</div>
            <div style="display:flex;justify-content:center;">${CS_PUZZLES[0].fig}</div>
            <p style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:8px;line-height:1.5;">
                Жёлтая линия — плоскость разреза.<br>Выбери форму, которая получится на срезе.
            </p>
        </div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Сложность:</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;">
            ${Object.entries(CS_LEVELS).map(([k,c])=>`
                <div class="glass-card" onclick="csSelectLevel('${k}')" id="cs-lv-${k}"
                     style="flex:1;padding:12px 6px;cursor:pointer;text-align:center;
                            border-color:${k===st.level?'rgba(34,197,94,0.55)':'rgba(255,255,255,0.06)'};
                            background:${k===st.level?'rgba(34,197,94,0.12)':'transparent'};">
                    <div style="font-size:20px;margin-bottom:4px;">${c.icon}</div>
                    <div style="font-size:11px;font-weight:700;color:${k===st.level?'#22c55e':'var(--text-primary)'};">${c.label}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${c.q} вопр.</div>
                </div>`).join('')}
        </div>
        <button class="btn" onclick="csStart()" style="width:100%;padding:16px;font-size:17px;font-weight:800;
            background:linear-gradient(135deg,rgba(34,197,94,0.2),rgba(6,182,212,0.12));
            border-color:rgba(34,197,94,0.5);color:#22c55e;">✂️ Начать</button>
    `;
}

function csSelectLevel(key) {
    csState.level=key;
    document.querySelectorAll('[id^="cs-lv-"]').forEach(el=>{
        const k=el.id.replace('cs-lv-',''),a=k===key;
        el.style.borderColor=a?'rgba(34,197,94,0.55)':'rgba(255,255,255,0.06)';
        el.style.background=a?'rgba(34,197,94,0.12)':'transparent';
        el.querySelector('div:nth-child(2)').style.color=a?'#22c55e':'var(--text-primary)';
    });
}

function csStart() {
    const st=csState;
    st.pool=[...CS_PUZZLES].sort(()=>Math.random()-0.5);
    st.total=CS_LEVELS[st.level].q;
    st.score=st.question=st.streak=0; st.isPlaying=true;
    csShowQ();
}

function csShowQ() {
    const st=csState;
    const container=document.getElementById('cross_section');
    if(!container) return;
    if(st.question>=st.total){csFinish();return;}
    const pz=st.pool[st.question%st.pool.length];
    const pct=Math.round((st.question/st.total)*100);
    // Shuffle options keeping track of correct
    const opts=pz.opts.map((o,i)=>({label:o,isCorrect:i===pz.correct})).sort(()=>Math.random()-0.5);
    const corIdx=opts.findIndex(o=>o.isCorrect);
    st._corIdx=corIdx;

    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-size:12px;color:var(--text-secondary);">${st.question+1}/${st.total}</span>
                <span style="font-size:14px;font-weight:800;color:#22c55e;">⭐ ${st.score}</span>
                ${st.streak>=3?`<span style="color:var(--accent-yellow);font-size:13px;">🔥${st.streak}</span>`:''}
            </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:10px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#22c55e,#06b6d4);border-radius:2px;transition:width 0.4s;"></div>
        </div>
        <div class="glass-card" style="padding:12px;margin-bottom:8px;border-color:rgba(34,197,94,0.2);text-align:center;">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#22c55e;margin-bottom:8px;">${pz.emoji} ${pz.title}</div>
            <div style="display:flex;justify-content:center;">${pz.fig}</div>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);text-align:center;margin-bottom:8px;">Какую форму даёт жёлтый срез?</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="cs-opts">
            ${opts.map((o,i)=>{
                const svg=CS_SHAPES[o.label]||'';
                return `<button class="btn cs-opt" id="cs-opt-${i}" onclick="csAnswer(${i})"
                    style="padding:12px 6px;font-size:12px;font-weight:700;color:#22c55e;
                           border-color:rgba(34,197,94,0.3);background:rgba(34,197,94,0.05);
                           display:flex;flex-direction:column;align-items:center;gap:6px;min-height:72px;">
                    <span style="color:#22c55e;display:flex;align-items:center;">${svg}</span>
                    <span>${o.label}</span>
                </button>`;
            }).join('')}
        </div>
    `;
}

function csAnswer(idx) {
    const st=csState;
    const isCorrect=idx===st._corIdx;
    document.querySelectorAll('.cs-opt').forEach(b=>{b.style.pointerEvents='none';b.style.opacity='0.4';});
    const c=document.getElementById(`cs-opt-${idx}`);
    if(c){c.style.opacity='1';c.style.borderColor=isCorrect?'rgba(0,255,136,0.7)':'rgba(244,63,94,0.6)';c.style.background=isCorrect?'rgba(0,255,136,0.1)':'rgba(244,63,94,0.08)';c.style.color=isCorrect?'#00ff88':'#f43f5e';}
    if(!isCorrect){const ok=document.getElementById(`cs-opt-${st._corIdx}`);if(ok){ok.style.opacity='1';ok.style.borderColor='rgba(0,255,136,0.5)';ok.style.color='#00ff88';}}
    if(isCorrect){st.score++;st.streak++;p3dSound('ok');}else{st.streak=0;p3dSound('err');}
    st.question++;
    setTimeout(()=>csShowQ(),isCorrect?900:1700);
}

function csFinish() {
    const st=csState; st.isPlaying=false;
    const ex=document.getElementById('csEndOv'); if(ex)ex.remove();
    const scores=getUserScores(),prev=scores.cross_section||0;
    if(st.score>prev)saveScore('cross_section',st.score);
    const isRec=st.score>prev,pct=Math.round((st.score/st.total)*100);
    const grade=pct>=90?'🏆 Гений!':pct>=70?'🥇 Отлично!':pct>=50?'🥈 Хорошо!':'🥉 Тренируйся!';
    const ov=document.createElement('div'); ov.id='csEndOv';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    ov.innerHTML=`<div style="font-size:60px;margin-bottom:10px;">✂️</div>
        <div style="font-size:22px;font-weight:800;color:#22c55e;margin-bottom:6px;">${grade}</div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">${st.score} из ${st.total}</div>
        ${isRec?'<div style="font-size:13px;color:var(--accent-yellow);">✨ Рекорд!</div>':''}
        <div style="width:180px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:12px auto 18px;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#22c55e,#06b6d4);border-radius:3px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="csBtnA" style="padding:14px;font-size:15px;font-weight:700;color:#22c55e;border-color:rgba(34,197,94,0.5);">🔄 Снова</button>
            <button class="btn" id="csBtnM" style="padding:14px;font-size:15px;color:var(--text-secondary);">⚙️ Меню</button>
        </div>`;
    document.body.appendChild(ov);
    document.getElementById('csBtnA').onclick=()=>{ov.remove();csStart();};
    document.getElementById('csBtnM').onclick=()=>{ov.remove();navigate('cross_section');};
}
