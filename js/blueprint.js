// ============================================================
// СТРОЙКА — Blueprint Builder Spatial Game
// По двум проекциям (вид сверху + спереди) расставь кубики в 3D
// ============================================================

// Target puzzles: front projection (xz), top projection (xy), and 3D answer
const BP_PUZZLES = [
    { title:'Линейка',
      front:[[0,0],[1,0],[2,0]], top:[[0,0],[1,0],[2,0]],
      maxX:3,maxY:1,maxZ:1,
      solution:[[0,0,0],[1,0,0],[2,0,0]] },

    { title:'Уголок',
      front:[[0,0],[1,0]], top:[[0,0],[1,0],[0,1]],
      maxX:2,maxY:2,maxZ:1,
      solution:[[0,0,0],[1,0,0],[0,1,0]] },

    { title:'Ступенька',
      front:[[0,0],[1,0],[1,1]], top:[[0,0],[1,0]],
      maxX:2,maxY:1,maxZ:2,
      solution:[[0,0,0],[1,0,0],[1,0,1]] },

    { title:'Квадрат',
      front:[[0,0],[1,0]], top:[[0,0],[1,0],[0,1],[1,1]],
      maxX:2,maxY:2,maxZ:1,
      solution:[[0,0,0],[1,0,0],[0,1,0],[1,1,0]] },

    { title:'Г-форма',
      front:[[0,0],[1,0],[2,0]], top:[[0,0],[1,0],[2,0],[0,1]],
      maxX:3,maxY:2,maxZ:1,
      solution:[[0,0,0],[1,0,0],[2,0,0],[0,1,0]] },

    { title:'Башня',
      front:[[0,0],[1,0],[0,1],[0,2]], top:[[0,0],[1,0]],
      maxX:2,maxY:1,maxZ:3,
      solution:[[0,0,0],[1,0,0],[0,0,1],[0,0,2]] },

    { title:'Зигзаг',
      front:[[0,0],[1,0],[2,0]], top:[[0,0],[1,0],[1,1],[2,1]],
      maxX:3,maxY:2,maxZ:1,
      solution:[[0,0,0],[1,0,0],[1,1,0],[2,1,0]] },

    { title:'Лесенка 3D',
      front:[[0,0],[1,0],[1,1],[2,0],[2,1],[2,2]], top:[[0,0],[1,0],[2,0]],
      maxX:3,maxY:1,maxZ:3,
      solution:[[0,0,0],[1,0,0],[1,0,1],[2,0,0],[2,0,1],[2,0,2]] },
      
    { title:'Арка',
      front:[[0,0],[0,1],[0,2],[1,2],[2,2],[2,1],[2,0]], top:[[0,0],[1,0],[2,0]],
      maxX:3,maxY:1,maxZ:3,
      solution:[[0,0,0],[0,0,1],[0,0,2],[1,0,2],[2,0,2],[2,0,1],[2,0,0]] },
      
    { title:'Пирамидка',
      front:[[0,0],[1,0],[2,0],[1,1]], top:[[0,0],[1,0],[2,0],[1,1]],
      maxX:3,maxY:2,maxZ:2,
      solution:[[0,0,0],[1,0,0],[2,0,0],[1,1,0],[1,0,1]] },
];

const BP_CELL = 22;   // grid cell size px
const BP_PAL_PLACED  = { top:'#60a5fa', left:'#2563eb', right:'#1e40af', stroke:'#172554' };
const BP_PAL_TARGET  = { top:'#4ade80', left:'#16a34a', right:'#14532d', stroke:'#052e16' };

const BP_LEVELS = {
    easy:   { label:'Лёгкий',  icon:'🧩', q:3 },
    medium: { label:'Средний', icon:'🔷', q:5 },
    hard:   { label:'Сложный', icon:'🔮', q:7 },
};

let bpState = {
    level:'easy', score:0, question:0, total:0, streak:0,
    isPlaying:false, pool:[], placed:new Set(),
    pz:null, verified:false,
};

function renderBlueprint(container) {
    const st=bpState; st.isPlaying=false;
    const scores=getUserScores(),best=scores.blueprint||0;
    const ex=BP_PUZZLES[0];
    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="text-align:center;">
                <h2 style="margin:0;color:#06b6d4;" class="glow-text">СТРОЙКА</h2>
                <span style="font-size:11px;color:var(--text-secondary);">СТРОЙ ПО ЧЕРТЕЖУ</span>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--accent-yellow);">🏆 ${best}</div>
        </div>
        <div class="glass-card" style="padding:14px;margin-bottom:14px;border-color:rgba(6,182,212,0.25);
             background:radial-gradient(ellipse at 50% 0%,rgba(6,182,212,0.1) 0%,var(--card-bg) 70%);">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#06b6d4;text-align:center;margin-bottom:10px;">🏗️ По чертежу расставь кубики в 3D!</div>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;align-items:flex-start;margin-bottom:10px;">
                <div style="text-align:center;">
                    <div style="font-size:9px;color:var(--text-secondary);margin-bottom:4px;">Чертёж сверху</div>
                    ${bpGridSVG(ex.top, ex.maxX, ex.maxY, false)}
                </div>
                <div style="text-align:center;">
                    <div style="font-size:9px;color:var(--text-secondary);margin-bottom:4px;">Чертёж спереди</div>
                    ${bpGridSVG(ex.front, ex.maxX, ex.maxZ, true)}
                </div>
                <div style="font-size:22px;align-self:center;">→</div>
                <div style="text-align:center;">
                    <div style="font-size:9px;color:var(--text-secondary);margin-bottom:4px;">Результат</div>
                    ${isoRenderCubes(ex.solution, BP_PAL_TARGET)}
                </div>
            </div>
            <p style="font-size:11px;color:var(--text-secondary);text-align:center;line-height:1.5;margin:0;">
                Нажимай на клетки в 3D-сетке, чтобы ставить/убирать кубики.<br>Затем нажми «Проверить»!
            </p>
        </div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">Сложность:</div>
        <div style="display:flex;gap:8px;margin-bottom:18px;">
            ${Object.entries(BP_LEVELS).map(([k,c])=>`
                <div class="glass-card" onclick="bpSelectLevel('${k}')" id="bp-lv-${k}"
                     style="flex:1;padding:12px 6px;cursor:pointer;text-align:center;
                            border-color:${k===st.level?'rgba(6,182,212,0.55)':'rgba(255,255,255,0.06)'};
                            background:${k===st.level?'rgba(6,182,212,0.12)':'transparent'};">
                    <div style="font-size:20px;margin-bottom:4px;">${c.icon}</div>
                    <div style="font-size:11px;font-weight:700;color:${k===st.level?'#06b6d4':'var(--text-primary)'};">${c.label}</div>
                    <div style="font-size:10px;color:var(--text-secondary);margin-top:2px;">${c.q} задачи</div>
                </div>`).join('')}
        </div>
        <button class="btn" onclick="bpStart()" style="width:100%;padding:16px;font-size:17px;font-weight:800;
            background:linear-gradient(135deg,rgba(6,182,212,0.2),rgba(168,85,247,0.12));
            border-color:rgba(6,182,212,0.5);color:#06b6d4;">🏗️ Начать</button>
    `;
}

function bpGridSVG(cells, maxH, maxV, flipY=true) {
    const cs=BP_CELL, W=maxH*cs, H=maxV*cs;
    const cellSet=new Set(cells.map(([h,v])=>`${h},${v}`));
    let r='';
    for(let v=maxV-1;v>=0;v--) for(let h=0;h<maxH;h++) {
        const f=cellSet.has(`${h},${v}`);
        const screenY = flipY ? (maxV-1-v)*cs : v*cs;
        r+=`<rect x="${h*cs}" y="${screenY}" width="${cs}" height="${cs}"
            fill="${f?'#06b6d4':'rgba(255,255,255,0.04)'}" opacity="${f?0.85:1}"
            stroke="rgba(255,255,255,0.15)" stroke-width="0.5" rx="2"/>`;
    }
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="border-radius:4px">${r}</svg>`;
}

function bpSelectLevel(key) {
    bpState.level=key;
    document.querySelectorAll('[id^="bp-lv-"]').forEach(el=>{
        const k=el.id.replace('bp-lv-',''),a=k===key;
        el.style.borderColor=a?'rgba(6,182,212,0.55)':'rgba(255,255,255,0.06)';
        el.style.background=a?'rgba(6,182,212,0.12)':'transparent';
        el.querySelector('div:nth-child(2)').style.color=a?'#06b6d4':'var(--text-primary)';
    });
}

function bpStart() {
    const st=bpState;
    st.pool=[...BP_PUZZLES].sort(()=>Math.random()-0.5);
    st.total=BP_LEVELS[st.level].q;
    st.score=st.question=st.streak=0; st.isPlaying=true;
    bpShowQ();
}

function bpShowQ() {
    const st=bpState;
    const container=document.getElementById('blueprint');
    if(!container) return;
    if(st.question>=st.total){bpFinish();return;}
    const pz=st.pool[st.question%st.pool.length];
    st.pz=pz; st.placed=new Set(); st.verified=false;
    const pct=Math.round((st.question/st.total)*100);
    bpRenderGame(container, pz, pct);
}

function bpRenderGame(container, pz, pct) {
    const st=bpState;
    // Build interactive grid: view from top-right isometric, click cells
    // We show a flat 2D top-view grid as the interactive surface
    // Then also show front view blueprint
    // User clicks cells in top-view + selects height to place cubes

    const cells=[];
    for(let y=0;y<pz.maxY;y++) for(let x=0;x<pz.maxX;x++) cells.push([x,y]);

    container.innerHTML=`
        <div class="top-nav">
            <div class="back-btn" onclick="navigate('dashboard')">←</div>
            <div style="display:flex;gap:12px;align-items:center;">
                <span style="font-size:12px;color:var(--text-secondary);">${st.question+1}/${st.total}</span>
                <span style="font-size:14px;font-weight:800;color:#06b6d4;">⭐ ${st.score}</span>
                ${st.streak>=3?`<span style="color:var(--accent-yellow);font-size:13px;">🔥${st.streak}</span>`:''}
            </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-bottom:10px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#06b6d4,#a855f7);border-radius:2px;transition:width 0.4s;"></div>
        </div>

        <!-- Blueprints -->
        <div class="glass-card" style="padding:10px;margin-bottom:8px;border-color:rgba(6,182,212,0.2);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#06b6d4;text-align:center;margin-bottom:8px;">📐 «${pz.title}» — чертежи</div>
            <div style="display:flex;gap:12px;justify-content:center;align-items:flex-end;flex-wrap:wrap;">
                <div style="text-align:center;"><div style="font-size:8px;color:var(--text-secondary);margin-bottom:3px;">Сверху</div>${bpGridSVG(pz.top,pz.maxX,pz.maxY,false)}</div>
                <div style="text-align:center;"><div style="font-size:8px;color:var(--text-secondary);margin-bottom:3px;">Спереди</div>${bpGridSVG(pz.front,pz.maxX,pz.maxZ,true)}</div>
            </div>
        </div>

        <!-- Interactive top-view grid -->
        <div class="glass-card" style="padding:10px;margin-bottom:8px;border-color:rgba(6,182,212,0.15);">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#06b6d4;margin-bottom:6px;text-align:center;">Нажимай на клетки — ставь кубики (высота: <span id="bp-h-label">1</span>)</div>
            <div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-bottom:8px;">
                <span style="font-size:11px;color:var(--text-secondary);">Высота:</span>
                ${Array.from({length:pz.maxZ},(_,i)=>`
                    <button onclick="bpSetH(${i+1})" id="bp-h-${i+1}"
                        style="width:30px;height:30px;border-radius:6px;border:2px solid ${i===0?'rgba(6,182,212,0.8)':'rgba(255,255,255,0.15)'};
                               background:${i===0?'rgba(6,182,212,0.2)':'rgba(255,255,255,0.03)'};
                               color:${i===0?'#06b6d4':'var(--text-secondary)'};font-size:13px;font-weight:700;cursor:pointer;">
                        ${i+1}
                    </button>`).join('')}
            </div>
            <div id="bp-grid" style="display:grid;grid-template-columns:repeat(${pz.maxX},${BP_CELL}px);gap:3px;justify-content:center;">
                ${cells.map(([x,y])=>`
                    <div id="bp-cell-${x}-${y}" onclick="bpToggleCell(${x},${y})"
                         style="width:${BP_CELL}px;height:${BP_CELL}px;background:rgba(255,255,255,0.04);
                                border:1px solid rgba(255,255,255,0.12);border-radius:4px;cursor:pointer;
                                display:flex;align-items:center;justify-content:center;font-size:9px;
                                transition:all 0.15s;color:var(--text-secondary);">
                    </div>`).join('')}
            </div>
        </div>

        <!-- Preview + Check -->
        <div style="display:flex;gap:8px;align-items:center;">
            <div class="glass-card" style="flex:1;padding:10px;border-color:rgba(255,255,255,0.06);min-height:60px;
                 display:flex;align-items:center;justify-content:center;" id="bp-preview">
                <span style="font-size:11px;color:var(--text-secondary);">Поставь кубики →</span>
            </div>
            <button class="btn" onclick="bpCheck()" style="padding:14px 18px;font-size:14px;font-weight:800;
                color:#06b6d4;border-color:rgba(6,182,212,0.5);white-space:nowrap;">✅ Проверить</button>
        </div>
    `;
    bpState._curH = 1;
}

function bpSetH(h) {
    bpState._curH = h;
    document.getElementById('bp-h-label').textContent = h;
    for(let i=1;i<=bpState.pz.maxZ;i++){
        const b=document.getElementById(`bp-h-${i}`);
        if(b){b.style.borderColor=i===h?'rgba(6,182,212,0.8)':'rgba(255,255,255,0.15)';b.style.background=i===h?'rgba(6,182,212,0.2)':'rgba(255,255,255,0.03)';b.style.color=i===h?'#06b6d4':'var(--text-secondary)';}
    }
}

function bpToggleCell(x,y) {
    const st=bpState, h=st._curH||1, key=`${x},${y},${h-1}`;
    if(st.placed.has(key)) st.placed.delete(key); else st.placed.add(key);
    const cell=document.getElementById(`bp-cell-${x}-${y}`);
    const cubesHere=[...st.placed].filter(k=>k.startsWith(`${x},${y},`));
    if(cell){
        cell.style.background=cubesHere.length?'rgba(6,182,212,0.35)':'rgba(255,255,255,0.04)';
        cell.style.borderColor=cubesHere.length?'rgba(6,182,212,0.7)':'rgba(255,255,255,0.12)';
        cell.textContent=cubesHere.length?cubesHere.length:'';
        cell.style.color='rgba(6,182,212,0.9)';
    }
    // Update preview
    const placed=bpGetPlaced();
    const prev=document.getElementById('bp-preview');
    if(prev) prev.innerHTML=placed.length?isoRenderCubes(placed,BP_PAL_PLACED):'<span style="font-size:11px;color:var(--text-secondary);">Поставь кубики →</span>';
}

function bpGetPlaced() {
    return [...bpState.placed].map(k=>{const[x,y,z]=k.split(',').map(Number);return[x,y,z];});
}

function bpCheck() {
    const st=bpState;
    if(st.verified) return;
    const placed=bpGetPlaced();
    const pz=st.pz;

    // Check if projections match
    const placedF=new Set(placed.map(([x,y,z])=>`${x},${z}`));
    const placedT=new Set(placed.map(([x,y,z])=>`${x},${y}`));
    const targetF=new Set(pz.front.map(([h,v])=>`${h},${v}`));
    const targetT=new Set(pz.top.map(([h,v])=>`${h},${v}`));

    const frontOk = [...targetF].every(c=>placedF.has(c)) && [...placedF].every(c=>targetF.has(c));
    const topOk   = [...targetT].every(c=>placedT.has(c)) && [...placedT].every(c=>targetT.has(c));
    const isCorrect = frontOk && topOk && placed.length > 0;

    st.verified = true;

    // Show result
    const container=document.getElementById('blueprint');
    if(!container) return;
    const resultDiv=document.createElement('div');
    resultDiv.style.cssText='position:fixed;left:0;right:0;bottom:0;padding:14px 18px;z-index:100;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(10px);';
    resultDiv.style.background=isCorrect?'rgba(0,255,136,0.1)':'rgba(244,63,94,0.1)';
    resultDiv.innerHTML=`
        <div>
            <div style="font-size:16px;font-weight:800;color:${isCorrect?'#00ff88':'#f43f5e'}">${isCorrect?'✅ Верно!':'❌ Не совпадает'}</div>
            <div style="font-size:11px;color:var(--text-secondary);">${isCorrect?'Оба вида совпадают':'Проверь проекции ещё раз'}</div>
        </div>
        <button class="btn" onclick="bpNext()" style="padding:10px 16px;font-size:14px;font-weight:700;color:#06b6d4;border-color:rgba(6,182,212,0.5);">→ Далее</button>
    `;
    container.appendChild(resultDiv);

    if(isCorrect){st.score++;st.streak++;p3dSound('ok');}else{st.streak=0;p3dSound('err');}
}

function bpNext() {
    bpState.question++;
    bpShowQ();
}

function bpFinish() {
    const st=bpState; st.isPlaying=false;
    const ex=document.getElementById('bpEndOv'); if(ex)ex.remove();
    const scores=getUserScores(),prev=scores.blueprint||0;
    if(st.score>prev)saveScore('blueprint',st.score);
    const isRec=st.score>prev,pct=Math.round((st.score/st.total)*100);
    const grade=pct>=90?'🏆 Архитектор!':pct>=70?'🥇 Строитель!':pct>=50?'🥈 Хорошо!':'🥉 Практикуйся!';
    const ov=document.createElement('div'); ov.id='bpEndOv';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;';
    ov.innerHTML=`<div style="font-size:60px;margin-bottom:10px;">🏗️</div>
        <div style="font-size:22px;font-weight:800;color:#06b6d4;margin-bottom:6px;">${grade}</div>
        <div style="font-size:17px;color:var(--text-primary);margin-bottom:4px;">${st.score} из ${st.total}</div>
        ${isRec?'<div style="font-size:13px;color:var(--accent-yellow);">✨ Рекорд!</div>':''}
        <div style="width:180px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin:12px auto 18px;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#06b6d4,#a855f7);border-radius:3px;"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px;">
            <button class="btn" id="bpBtnA" style="padding:14px;font-size:15px;font-weight:700;color:#06b6d4;border-color:rgba(6,182,212,0.5);">🔄 Снова</button>
            <button class="btn" id="bpBtnM" style="padding:14px;font-size:15px;color:var(--text-secondary);">⚙️ Меню</button>
        </div>`;
    document.body.appendChild(ov);
    document.getElementById('bpBtnA').onclick=()=>{ov.remove();bpStart();};
    document.getElementById('bpBtnM').onclick=()=>{ov.remove();navigate('blueprint');};
}
