// ── Vertech TdF — Analizador ──
const BACKEND_URL = 'https://vertech-backend.onrender.com';
let currentImageData = null;
let currentImageMode = 'campo';

// ── Análisis de texto (Mar / Metano) ──
async function runTextIA(promptKey, statusId, resultId) {
  const stEl = document.getElementById(statusId);
  const resEl = document.getElementById(resultId);
  resEl.classList.remove('show');
  stEl.innerHTML = '<span class="loader"></span> Analizando con IA...';
  try {
    const r = await fetch(`${BACKEND_URL}/analizar-texto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_key: promptKey }),
    });
    if (!r.ok) throw new Error(`Error ${r.status}`);
    const data = await r.json();
    stEl.innerHTML = '<i class="ti ti-check" style="color:#1d9e75"></i> Análisis completado';
    resEl.innerHTML = (data.texto || '').replace(/\n/g, '<br>');
    resEl.classList.add('show');
  } catch (err) {
    stEl.innerHTML = '<i class="ti ti-x" style="color:#e24b4a"></i> Error al conectar con el servidor.';
    console.error(err);
  }
}

// ── Generación de imágenes de demo ──
function generateDemoImage(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 280;
  const ctx = canvas.getContext('2d');
  if (type === 'campo') {
    [{ x:0,y:0,w:200,h:140,c:'#2d7a2d',t:'NDVI Alto · 0.73' },
     { x:200,y:0,w:200,h:140,c:'#8db84e',t:'NDVI Medio · 0.61' },
     { x:0,y:140,w:130,h:140,c:'#a83228',t:'Estrés · 0.22' },
     { x:130,y:140,w:270,h:140,c:'#c8a838',t:'NDVI Bajo · 0.48' }
    ].forEach(z => {
      ctx.fillStyle = z.c; ctx.fillRect(z.x,z.y,z.w,z.h);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText(z.t, z.x+6, z.y+18);
    });
  } else if (type === 'mar') {
    const g = ctx.createRadialGradient(200,140,10,200,140,180);
    g.addColorStop(0,'#1d9e75'); g.addColorStop(.5,'#185fa5'); g.addColorStop(1,'#0a1628');
    ctx.fillStyle = g; ctx.fillRect(0,0,400,280);
    ctx.fillStyle = 'rgba(29,158,117,.6)'; ctx.beginPath(); ctx.arc(200,140,60,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e24b4a'; ctx.beginPath(); ctx.arc(80,210,20,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif';
    ctx.fillText('Alta clorofila-a',150,145); ctx.fillText('Anomalía · 3 emb.',45,215);
  } else {
    const g2 = ctx.createLinearGradient(0,0,400,280);
    g2.addColorStop(0,'#0a1628'); g2.addColorStop(.5,'#ef9f27'); g2.addColorStop(1,'#a83228');
    ctx.fillStyle = g2; ctx.fillRect(0,0,400,280);
    ctx.fillStyle = 'rgba(226,75,74,.55)'; ctx.beginPath(); ctx.arc(290,100,70,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('Anomalía CH₄',230,100);
    ctx.font = '11px sans-serif'; ctx.fillText('2340 ppb — Cuenca Austral',210,118);
  }
  return canvas.toDataURL('image/png');
}

// ── Mostrar preview ──
function showPreview(src, label) {
  document.getElementById('preview-img').src = src;
  document.getElementById('preview-tag').textContent = label || 'Imagen cargada';
  document.getElementById('preview-wrap').style.display = 'block';
  document.getElementById('analyze-btn').disabled = false;
  clearImageResults();
}

function clearImageResults() {
  ['rc-metrics','rc-diag','rc-missions'].forEach(id => {
    document.getElementById(id).classList.remove('show');
  });
  const rn = document.getElementById('roadmap-note');
  if (rn) rn.classList.remove('show');
  document.getElementById('st-img').innerHTML = '';
}

// ── Análisis de imagen con backend ──
async function runImageAnalysis() {
  if (!currentImageData) return;
  const btn  = document.getElementById('analyze-btn');
  const stEl = document.getElementById('st-img');
  btn.disabled = true;
  clearImageResults();

  const steps = [
    'Leyendo imagen satelital...',
    'Detectando patrones espectrales...',
    'Extrayendo índices con IA...',
    'Generando diagnóstico...',
    'Planificando misiones...',
  ];
  let si = 0;
  const iv = setInterval(() => {
    if (si < steps.length) stEl.innerHTML = `<span class="loader"></span> ${steps[si++]}`;
  }, 800);

  const priColor = { alta:'#e24b4a', media:'#ef9f27', baja:'#1d9e75' };

  try {
    const r = await fetch(`${BACKEND_URL}/analizar-imagen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imagen_base64: currentImageData.split(',')[1],
        tipo: currentImageMode,
      }),
    });
    clearInterval(iv);
    if (!r.ok) throw new Error(`Error ${r.status}`);
    const parsed = await r.json();

    stEl.innerHTML = '<i class="ti ti-check" style="color:#1d9e75"></i> Análisis completado';

    document.getElementById('rm-grid').innerHTML = (parsed.indices || []).map(i =>
      `<div class="res-metric">
        <div class="rm-lbl">${i.label}</div>
        <div class="rm-val">${i.value}</div>
        <div class="rm-sub">${i.sub}</div>
      </div>`
    ).join('');
    document.getElementById('rc-metrics').classList.add('show');
    document.getElementById('rd-text').innerHTML = (parsed.diagnostico || '').replace(/\n/g,'<br>');
    document.getElementById('rc-diag').classList.add('show');
    document.getElementById('rm-list').innerHTML = (parsed.misiones || []).map(m =>
      `<div class="mission-item">
        <div class="mission-dot" style="background:${priColor[m.prioridad]||'#888'}"></div>
        <div class="mission-text"><strong>${m.zona}</strong> — ${m.tarea}</div>
        <span class="mission-pri pri-${m.prioridad}">${m.prioridad}</span>
      </div>`
    ).join('');
    document.getElementById('rc-missions').classList.add('show');
    document.getElementById('roadmap-note').classList.add('show');

  } catch (err) {
    clearInterval(iv);
    stEl.innerHTML = '<i class="ti ti-x" style="color:#e24b4a"></i> Error al analizar. Intentá de nuevo.';
    console.error(err);
  }
  btn.disabled = false;
}
