// ── Vertech — Analizador ──
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
    [{ x:0,y:0,w:200,h:140,c:'#2d7a2d',t:'NDVI Alto' },
     { x:200,y:0,w:200,h:140,c:'#8db84e',t:'NDVI Medio' },
     { x:0,y:140,w:130,h:140,c:'#a83228',t:'Estres hidrico' },
     { x:130,y:140,w:270,h:140,c:'#c8a838',t:'NDVI Bajo' }
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
    ctx.fillText('Alta clorofila',150,145);
    ctx.fillText('Anomalia detec.',45,215);
  } else {
    const g2 = ctx.createLinearGradient(0,0,400,280);
    g2.addColorStop(0,'#0a1628'); g2.addColorStop(.5,'#ef9f27'); g2.addColorStop(1,'#a83228');
    ctx.fillStyle = g2; ctx.fillRect(0,0,400,280);
    ctx.fillStyle = 'rgba(226,75,74,.55)'; ctx.beginPath(); ctx.arc(290,100,70,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Anomalia CH4',230,100);
    ctx.font = '11px sans-serif';
    ctx.fillText('Zona critica detectada',200,118);
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
    'Extrayendo indices con IA...',
    'Generando diagnostico...',
    'Planificando misiones...',
  ];
  let si = 0;
  const iv = setInterval(() => {
    if (si < steps.length) stEl.innerHTML = `<span class="loader"></span> ${steps[si++]}`;
  }, 800);

  const priColor = { alta:'#e24b4a', media:'#ef9f27', baja:'#1d9e75' };

  // Leer contexto del formulario
  const lugar  = document.getElementById('ctx-lugar')?.value.trim() || 'zona no especificada';
  const fecha  = document.getElementById('ctx-fecha')?.value || 'fecha no especificada';
  const fuente = document.getElementById('ctx-fuente')?.value || 'fuente desconocida';
  const tipo   = document.getElementById('ctx-tipo')?.value || currentImageMode;

  try {
    const r = await fetch(`${BACKEND_URL}/analizar-imagen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imagen_base64: currentImageData.split(',')[1],
        tipo: tipo,
        lugar: lugar,
        fecha: fecha,
        fuente: fuente,
      }),
    });
    clearInterval(iv);
    if (!r.ok) throw new Error(`Error ${r.status}`);
    const parsed = await r.json();

    stEl.innerHTML = '<i class="ti ti-check" style="color:#1d9e75"></i> Analisis completado';

    // Métricas
    document.getElementById('rm-grid').innerHTML = (parsed.indices || []).map(i =>
      `<div class="res-metric">
        <div class="rm-lbl">${i.label}</div>
        <div class="rm-val">${i.value}</div>
        <div class="rm-sub">${i.sub}</div>
      </div>`
    ).join('');
    document.getElementById('rc-metrics').classList.add('show');

    // Diagnóstico
    document.getElementById('rd-text').innerHTML = (parsed.diagnostico || '').replace(/\n/g,'<br>');
    document.getElementById('rc-diag').classList.add('show');

    // Misiones — integra flota si existe
    const flotaActual = JSON.parse(localStorage.getItem('vertech_flota') || '[]');
    const flotaInfo = flotaActual.length > 0
      ? `Flota disponible: ${flotaActual.map(d => `${d.nombre} (${d.tipo})`).join(', ')}.`
      : '';

    document.getElementById('rm-list').innerHTML = (parsed.misiones || []).map(m =>
      `<div class="mission-item">
        <div class="mission-dot" style="background:${priColor[m.prioridad]||'#888'}"></div>
        <div class="mission-text"><strong>${m.zona}</strong> — ${m.tarea}</div>
        <span class="mission-pri pri-${m.prioridad}">${m.prioridad}</span>
      </div>`
    ).join('');

    if (flotaInfo) {
      document.getElementById('rm-list').innerHTML +=
        `<div style="font-size:11px;color:#5f5e5a;margin-top:8px;padding:8px;background:#f1efe8;border-radius:6px;">
          <i class="ti ti-drone"></i> ${flotaInfo}
        </div>`;
    }

    document.getElementById('rc-missions').classList.add('show');
    document.getElementById('roadmap-note').classList.add('show');

  } catch (err) {
    clearInterval(iv);
    stEl.innerHTML = '<i class="ti ti-x" style="color:#e24b4a"></i> Error al analizar. Intentá de nuevo.';
    console.error(err);
  }
  btn.disabled = false;
}
