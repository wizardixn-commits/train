// ============================================================
// «ТРИ ВИДА» — Stereometric Three-View Spatial Reasoning
// По трём проекциям (спереди/сбоку/сверху) определить 3D-фигуру
// ============================================================

// ── Isometric Renderer (global, shared with other games) ──────────────────

const ISO_TW = 30, ISO_TH = 15, ISO_CH = 20;   // tile width/height, cube height

function isoProject(gx, gy, gz) {
    return { x: (gx - gy) * (ISO_TW / 2), y: (gx + gy) * (ISO_TH / 2) - gz * ISO_CH };
}

// Render array of [x,y,z] cubes as inline SVG (isometric, Minecraft-style)
function isoRenderCubes(cubes, pal) {
    pal = pal || { top: '#60a5fa', left: '#2563eb', right: '#1e40af', stroke: '#172554' };
    if (!cubes || !cubes.length) return '<svg width="40" height="40"></svg>';

    const cubeSet = new Set(cubes.map(([x,y,z]) => `${x},${y},${z}`));
    const has = (x,y,z) => cubeSet.has(`${x},${y},${z}`);

    const sorted = [...cubes].sort((a,b) => {
        const d = (a[0]+a[1]) - (b[0]+b[1]);
        return d !== 0 ? d : a[2] - b[2];
    });

    let xs = [], ys = [];
    cubes.forEach(([cx,cy,cz]) => {
        [[cx,cy,cz],[cx+1,cy,cz],[cx,cy+1,cz],[cx+1,cy+1,cz],
         [cx,cy,cz+1],[cx+1,cy,cz+1],[cx,cy+1,cz+1],[cx+1,cy+1,cz+1]]
        .forEach(([gx,gy,gz]) => { const p = isoProject(gx,gy,gz); xs.push(p.x); ys.push(p.y); });
    });

    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const W = maxX - minX + 4, H = maxY - minY + 4;
    const ox = -minX + 2, oy = -minY + 2;
    const pt = (gx,gy,gz) => { const p = isoProject(gx,gy,gz); return `${p.x+ox},${p.y+oy}`; };

    let svg = '';
    sorted.forEach(([cx,cy,cz]) => {
        const sr = !has(cx+1,cy,cz), sl = !has(cx,cy+1,cz), st2 = !has(cx,cy,cz+1);
        if (sr) svg += `<polygon points="${pt(cx+1,cy,cz)} ${pt(cx+1,cy+1,cz)} ${pt(cx+1,cy+1,cz+1)} ${pt(cx+1,cy,cz+1)}" fill="${pal.right}" stroke="${pal.stroke}" stroke-width="1.2" stroke-linejoin="round"/>`;
        if (sl) svg += `<polygon points="${pt(cx,cy+1,cz)} ${pt(cx+1,cy+1,cz)} ${pt(cx+1,cy+1,cz+1)} ${pt(cx,cy+1,cz+1)}" fill="${pal.left}" stroke="${pal.stroke}" stroke-width="1.2" stroke-linejoin="round"/>`;
        if (st2) svg += `<polygon points="${pt(cx,cy,cz+1)} ${pt(cx+1,cy,cz+1)} ${pt(cx+1,cy+1,cz+1)} ${pt(cx,cy+1,cz+1)}" fill="${pal.top}" stroke="${pal.stroke}" stroke-width="1.2" stroke-linejoin="round"/>`;
    });
    return `<svg width="${Math.ceil(W)}" height="${Math.ceil(H)}" viewBox="0 0 ${Math.ceil(W)} ${Math.ceil(H)}" overflow="visible">${svg}</svg>`;
}

// Compute orthographic projections
function isoProjections(cubes) {
    const front = new Set(), side = new Set(), top = new Set();
    // For side view (YZ plane), Y goes left-down in 3D. 
    // To make it intuitive (origin on right, axis going left), we map y to 3-y (assuming maxH=4).
    cubes.forEach(([x,y,z]) => { front.add(`${x},${z}`); side.add(`${3-y},${z}`); top.add(`${x},${y}`); });
    return { front, side, top };
}

// Render a projection silhouette as SVG grid
function isoGridSVG(cells, maxH, maxV, cs) {
    const W = maxH * cs, H = maxV * cs;
    let r = '';
    for (let v = maxV-1; v >= 0; v--) {
        for (let h = 0; h < maxH; h++) {
            const f = cells.has(`${h},${v}`);
            r += `<rect x="${h*cs}" y="${(maxV-1-v)*cs}" width="${cs}" height="${cs}"
                fill="${f ? '#00e5ff' : 'rgba(255,255,255,0.04)'}"
                stroke="rgba(255,255,255,0.14)" stroke-width="0.5" rx="1"/>`;
        }
    }
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="border-radius:4px">${r}</svg>`;
}

// ── Color palettes ────────────────────────────────────────────────────────
const ISO_PAL_BLUE = { top:'#60a5fa', left:'#2563eb', right:'#1e40af', stroke:'#172554' };

// ── Game Levels ───────────────────────────────────────────────────────────
const P3D_LEVELS = {
    easy:   { label:'Лёгкий',  icon:'🧩', q:4 },
    medium: { label:'Средний', icon:'🔷', q:6 },
    hard:   { label:'Сложный', icon:'🔮', q:8 },
};

// ── Puzzle Data ───────────────────────────────────────────────────────────
const P3D_PUZZLES = [
    // ── Easy ──────────────────────────────────────────────────────────────
    { level:'easy', title:'Линейка',
      correct:[[0,0,0],[1,0,0],[2,0,0]],
      wrongs:[[[0,0,0],[0,1,0],[0,2,0]], [[0,0,0],[0,0,1],[0,0,2]], [[0,0,0],[1,0,0],[1,1,0]]] },

    { level:'easy', title:'Уголок',
      correct:[[0,0,0],[1,0,0],[0,1,0]],
      wrongs:[[[0,0,0],[1,0,0],[1,1,0]], [[0,0,0],[0,1,0],[0,0,1]], [[0,0,0],[1,0,0],[2,0,0]]] },

    { level:'easy', title:'Ступенька',
      correct:[[0,0,0],[1,0,0],[1,0,1]],
      wrongs:[[[0,0,0],[0,0,1],[1,0,1]], [[0,0,0],[1,0,0],[0,0,1]], [[0,0,0],[1,0,0],[2,0,0]]] },

    { level:'easy', title:'Квадрат',
      correct:[[0,0,0],[1,0,0],[0,1,0],[1,1,0]],
      wrongs:[[[0,0,0],[1,0,0],[0,1,0]], [[0,0,0],[1,0,0],[2,0,0],[3,0,0]], [[0,0,0],[1,0,0],[0,1,0],[0,0,1]]] },

    // ── Medium ────────────────────────────────────────────────────────────
    { level:'medium', title:'Т-форма',
      correct:[[0,1,0],[1,0,0],[1,1,0],[1,2,0]],
      wrongs:[
          [[0,0,0],[1,0,0],[1,1,0],[1,2,0]], // L-shape
          [[0,1,0],[1,0,0],[1,1,0],[1,2,0],[1,1,1]], // T with height
          [[0,1,0],[1,0,0],[1,1,0],[1,2,0],[0,1,1]]  // T with height on other block
      ] },

    { level:'medium', title:'Зигзаг',
      correct:[[0,0,0],[1,0,0],[1,1,0],[2,1,0]],
      wrongs:[
          [[0,1,0],[1,1,0],[2,1,0],[1,0,0]], // 2D T-shape
          [[0,0,0],[1,0,0],[1,1,0],[2,1,0],[1,1,1]], // Zigzag with height
          [[0,0,0],[1,0,0],[1,1,0],[2,1,0],[0,0,1]]  // Zigzag with height
      ] },

    { level:'medium', title:'Лесенка',
      correct:[[0,0,0],[1,0,0],[2,0,0],[1,0,1],[2,0,1],[2,0,2]],
      wrongs:[
          [[0,0,0],[0,0,1],[0,0,2],[1,0,1],[1,0,2],[2,0,2]], // Inverted
          [[0,0,0],[1,0,1],[2,0,2]], // Floating blocks
          [[0,0,0],[1,0,0],[2,0,0],[1,0,1],[2,0,2]] // Missing block
      ] },

    { level:'medium', title:'Г-башня',
      correct:[[0,0,0],[1,0,0],[2,0,0],[2,0,1],[2,0,2]],
      wrongs:[[[0,0,0],[1,0,0],[2,0,0],[0,0,1],[0,0,2]], [[0,0,0],[0,0,1],[0,0,2],[1,0,2],[2,0,2]], [[0,0,0],[1,0,0],[2,0,0],[2,0,1]]] },

    // ── Hard ──────────────────────────────────────────────────────────────
    { level:'hard', title:'Крест+кубик',
      correct:[[1,0,0],[0,1,0],[1,1,0],[2,1,0],[1,2,0],[1,1,1]],
      wrongs:[[[1,0,0],[0,1,0],[1,1,0],[2,1,0],[1,2,0]], [[1,0,0],[0,1,0],[1,1,0],[2,1,0],[1,2,0],[0,1,1]], [[1,0,0],[0,1,0],[1,1,0],[2,1,0],[1,1,1]]] },

    { level:'hard', title:'Спираль',
      correct:[[0,0,0],[1,0,0],[2,0,0],[2,1,0],[2,1,1],[1,1,1]],
      wrongs:[
          [[0,0,0],[1,0,0],[2,0,0],[2,1,0],[1,1,0],[0,0,1]], // Base + height at 0,0
          [[0,0,0],[1,0,0],[2,0,0],[2,1,0],[1,1,0],[1,0,1],[2,0,1]], // Base + height at front
          [[0,0,0],[1,0,0],[2,0,0],[2,1,0],[2,1,1],[1,1,1],[1,1,2]]  // Extra height
      ] },
];

// ── State ─────────────────────────────────────────────────────────────────
let puzzle3dState = {
    level:'easy', score:0, question:0, total:0, streak:0,
    isPlaying:false, pool:[], correctIdx:0,
};

// ── Settings Screen ───────────────────────────────────────────────────────
function renderPuzzle3d(container) {
    const st = puzzle3dState;
    st.isPlaying = false;
    const scores = getUserScores();
    const best = scores.puzzle3d || 0;
    const prev = P3D_PUZZLES.find(p => p.level === 'medium') || P3D_PUZZLES[0];
    const proj = isoProjections(prev.correct);

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#e879f9;" class="glow-text">ТРИ ВИДА</h2>
                <span style="font-size:11px;color:var(--text-secondary);">СТЕРЕОМЕТРИЯ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">🏆 ${best}</div>
        </div>

        <div class="glass-card" style="padding:14px;margin-bottom:14px;border-color:rgba(232,121,249,0.25);
             background:radial-gradient(ellipse at 50% 0%,rgba(168,85,247,0.1) 0%,var(--card-bg) 70%);">
            <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
                 color:#a855f7;text-align:center;margin-bottom:10px;">📐 По 3 видам — найди фигуру!</div>
            <div style="display:flex;gap:8px;justify-content:center;align-items:flex-end;flex-wrap:wrap;">
                <div style="text-align:center;"><div style="font-size:9px;color:var(--text-secondary);margin-bottom:3px;">Спереди</div>${isoGridSVG(proj.front,4,3,12)}</div>
                <div style="text-align:center;"><div style="font-size:9px;color:var(--text-secondary);margin-bottom:3px;">Сбоку</div>${isoGridSVG(proj.side,4,3,12)}</div>
                <div style="text-align:center;"><div style="font-size:9px;color:var(--text-secondary);margin-bottom:3px;">Сверху</div>${isoGridSVG(proj.top,4,4,12)}</div>
                <div style="color:var(--text-secondary);font-size:20px;align-self:center;">→</div>
                <div style="background:rgba(0,0,0,0.25);border-radius:10px;padding:8px;">${isoRenderCubes(prev.correct, ISO_PAL_BLUE)}</div>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:10px;line-height:1.4;">
                Изучи три вида (чертежа) и найди 3D-фигуру
            </div>
        </div>

        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Сложность:</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;">
            ${Object.entries(P3D_LEVELS).map(([key,cfg]) => `
                <div class="glass-card" onclick="p3dSelectLevel('${key}')" id="p3d-lv-${key}"
                     style="flex:1;padding:12px 6px;cursor:pointer;text-align:center;
                            border-color:${key===st.level?'rgba(232,121,249,0.55)':'rgba(255,255,255,0.06)'};
                            background:${key===st.level?'rgba(232,121,249,0.12)':'transparent'};">
                    <div style="font-size:20px;margin-bottom:4px;">${cfg.icon}</div>
                    <div style="font-size:11px;font-weight:700;color:${key===st.level?'#e879f9':'var(--text-primary)'};">${cfg.label}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${cfg.q} вопр.</div>
                </div>
            `).join('')}
        </div>
        <button class="btn" onclick="p3dStartGame()" style="width:100%;padding:16px;font-size:17px;font-weight:800;
            background:linear-gradient(135deg,rgba(168,85,247,0.22),rgba(6,182,212,0.12));
            border-color:rgba(168,85,247,0.5);color:#e879f9;">🔮 Начать</button>
    `;
}

function p3dSelectLevel(key) {
    puzzle3dState.level = key;
    document.querySelectorAll('[id^="p3d-lv-"]').forEach(el => {
        const k = el.id.replace('p3d-lv-',''), a = k===key;
        el.style.borderColor = a?'rgba(232,121,249,0.55)':'rgba(255,255,255,0.06)';
        el.style.background  = a?'rgba(232,121,249,0.12)':'transparent';
        el.querySelector('div:nth-child(2)').style.color = a?'#e879f9':'var(--text-primary)';
    });
}

// ── Start Game ────────────────────────────────────────────────────────────
function p3dStartGame() {
    const st = puzzle3dState;
    let pool;
    if (st.level==='easy')   pool = [...P3D_PUZZLES.filter(p=>p.level==='easy'),...P3D_PUZZLES.filter(p=>p.level==='medium')];
    else if (st.level==='hard') pool = [...P3D_PUZZLES.filter(p=>p.level==='hard'),...P3D_PUZZLES.filter(p=>p.level==='medium')];
    else pool = [...P3D_PUZZLES];
    st.pool = pool.sort(()=>Math.random()-0.5);
    st.total = P3D_LEVELS[st.level].q;
    st.score = st.question = st.streak = 0;
    st.isPlaying = true;
    p3dShowQ();
}

// ── Question Screen ───────────────────────────────────────────────────────
function p3dShowQ() {
    const st = puzzle3dState;
    const container = document.getElementById('puzzle3d');
    if (!container) return;
    if (st.question >= st.total) { p3dFinish(); return; }

    const pz = st.pool[st.question % st.pool.length];
    const proj = isoProjections(pz.correct);
    const pct = Math.round((st.question/st.total)*100);

    // Shuffle options and remember correct index
    const opts = [
        {cubes:pz.correct, ok:true},
        ...pz.wrongs.map(w=>({cubes:w, ok:false}))
    ].sort(()=>Math.random()-0.5);
    st.correctIdx = opts.findIndex(o=>o.ok);

    container.innerHTML = `
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-size:12px;color:var(--text-secondary);">${st.question+1}/${st.total}</span>
                <span style="font-size:14px;font-weight:800;color:#e879f9;">⭐ ${st.score}</span>
                ${st.streak>=3?`<span style="color:var(--accent-yellow);font-size:13px;">🔥${st.streak}</span>`:''}
            </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:10px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#a855f7,#06b6d4);border-radius:2px;transition:width 0.4s;"></div>
        </div>

        <div class="glass-card" style="padding:12px;margin-bottom:8px;border-color:rgba(168,85,247,0.2);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a855f7;margin-bottom:8px;text-align:center;">📐 «${pz.title}» — три проекции</div>
            <div style="display:flex;gap:10px;justify-content:center;align-items:flex-end;">
                <div style="text-align:center;"><div style="font-size:8px;color:var(--text-secondary);margin-bottom:3px;">👁 Спереди</div>${isoGridSVG(proj.front,4,3,13)}</div>
                <div style="text-align:center;"><div style="font-size:8px;color:var(--text-secondary);margin-bottom:3px;">👁 Сбоку</div>${isoGridSVG(proj.side,4,3,13)}</div>
                <div style="text-align:center;"><div style="font-size:8px;color:var(--text-secondary);margin-bottom:3px;">👁 Сверху</div>${isoGridSVG(proj.top,4,4,13)}</div>
            </div>
        </div>

        <div style="font-size:10px;color:var(--text-secondary);text-align:center;margin-bottom:8px;">Какая из фигур соответствует этим трём видам?</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" id="p3d-ans">
            ${opts.map((o,i) => `
                <div class="glass-card p3d-opt" id="p3d-opt-${i}" onclick="p3dAnswer(${i})"
                     style="padding:8px;cursor:pointer;text-align:center;min-height:80px;
                            border-color:rgba(255,255,255,0.06);
                            display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
                    ${isoRenderCubes(o.cubes, ISO_PAL_BLUE)}
                </div>
            `).join('')}
        </div>
    `;
}

// ── Answer ────────────────────────────────────────────────────────────────
function p3dAnswer(idx) {
    const st = puzzle3dState;
    const isCorrect = idx === st.correctIdx;
    document.querySelectorAll('.p3d-opt').forEach(el => { el.style.pointerEvents='none'; el.style.opacity='0.4'; });
    const chosen = document.getElementById(`p3d-opt-${idx}`);
    if (chosen) {
        chosen.style.opacity='1';
        if (isCorrect) { chosen.style.borderColor='rgba(0,255,136,0.7)'; chosen.style.background='rgba(0,255,136,0.12)'; }
        else {
            chosen.style.borderColor='rgba(244,63,94,0.6)'; chosen.style.background='rgba(244,63,94,0.08)';
            const ok = document.getElementById(`p3d-opt-${st.correctIdx}`);
            if (ok) { ok.style.opacity='1'; ok.style.borderColor='rgba(0,255,136,0.5)'; }
        }
    }
    if (isCorrect) { st.score++; st.streak++; p3dSound('ok'); } else { st.streak=0; p3dSound('err'); }
    st.question++;
    setTimeout(()=>p3dShowQ(), isCorrect?900:1700);
}

// ── Finish ────────────────────────────────────────────────────────────────
function p3dFinish() {
    const st = puzzle3dState; st.isPlaying=false;
    const ex=document.getElementById('p3dEndOverlay'); if(ex) ex.remove();
    const scores=getUserScores(); const prev=scores.puzzle3d||0;
    if(st.score>prev) saveScore('puzzle3d',st.score);
    const isRec=st.score>prev, pct=Math.round((st.score/st.total)*100);
    const grade=pct>=90?'🏆 Гений!':pct>=70?'🥇 Отлично!':pct>=50?'🥈 Хорошо!':'🥉 Тренируйся!';
    const ov=document.createElement('div'); ov.id='p3dEndOverlay';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    ov.innerHTML=`
        <div style="font-size:60px;margin-bottom:10px;">🔮</div>
        <div style="font-size:22px;font-weight:800;color:#e879f9;margin-bottom:6px;">${grade}</div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">${st.score} из ${st.total}</div>
        ${isRec?'<div style="font-size:13px;color:var(--accent-yellow);margin-bottom:4px;">✨ Рекорд!</div>':''}
        <div style="width:180px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:10px auto 18px;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#a855f7,#06b6d4);border-radius:3px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="p3dBtnAgain" style="padding:14px;font-size:15px;font-weight:700;color:#e879f9;border-color:rgba(168,85,247,0.5);">🔄 Снова</button>
            <button class="btn" id="p3dBtnMenu" style="padding:14px;font-size:15px;color:var(--text-secondary);">⚙️ Меню</button>
        </div>`;
    document.body.appendChild(ov);
    document.getElementById('p3dBtnAgain').onclick=()=>{ov.remove();p3dStartGame();};
    document.getElementById('p3dBtnMenu').onclick=()=>{ov.remove();navigate('puzzle3d');};
}

function p3dSound(t) {
    try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),ts=c.currentTime;
    if(t==='ok'){[523,659,784].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,ts+i*0.07);g.gain.setValueAtTime(0.14,ts+i*0.07);g.gain.exponentialRampToValueAtTime(0.001,ts+i*0.07+0.22);o.connect(g);g.connect(c.destination);o.start(ts+i*0.07);o.stop(ts+i*0.07+0.23);});}
    else{const o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(240,ts);o.frequency.exponentialRampToValueAtTime(90,ts+0.22);g.gain.setValueAtTime(0.17,ts);g.gain.exponentialRampToValueAtTime(0.001,ts+0.22);o.connect(g);g.connect(c.destination);o.start(ts);o.stop(ts+0.23);}
    setTimeout(()=>c.close(),600);}catch(e){}
}
