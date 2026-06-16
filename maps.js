// ── Vertech TdF — Mapas canvas ──

function drawAgroMap() {
  const canvas = document.getElementById('canvas-agro');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;

  ctx.fillStyle = '#0d1f0e';
  ctx.fillRect(0, 0, w, h);

  const zones = [
    { x: 0, y: 0,    W: .40, H: .55, col: '#2d7a2d', lbl: 'Norte 0.73' },
    { x: .40, y: 0,  W: .35, H: .55, col: '#8db84e', lbl: 'Centro 0.61' },
    { x: .75, y: 0,  W: .25, H: .65, col: '#c8a838', lbl: 'Sur 0.48' },
    { x: 0, y: .55,  W: .32, H: .45, col: '#a83228', lbl: 'Este 0.22 ⚠' },
    { x: .32, y: .60, W: .68, H: .40, col: '#8db84e', lbl: 'Oeste 0.55' },
  ];

  zones.forEach(z => {
    ctx.fillStyle = z.col + '88';
    ctx.fillRect(z.x * w, z.y * h, z.W * w, z.H * h);
    ctx.strokeStyle = z.col;
    ctx.lineWidth = 1;
    ctx.strokeRect(z.x * w, z.y * h, z.W * w, z.H * h);
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText(z.lbl, z.x * w + 5, z.y * h + 14);
  });

  ctx.fillStyle = '#e24b4a';
  ctx.beginPath(); ctx.arc(w * .16, h * .77, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(226,75,74,.5)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(w * .16, h * .77, 13, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#1d9e75'; ctx.font = '10px sans-serif';
  ctx.fillText('✦ A-01', w * .16 - 12, h * .77 + 24);
}

function drawMarMap() {
  const canvas = document.getElementById('canvas-mar');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;

  ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 35) {
    ctx.strokeStyle = 'rgba(55,138,221,.07)'; ctx.lineWidth = .5;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 35) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  [[.30,.40,.18,'rgba(29,158,117,.35)','#1d9e75'],
   [.55,.25,.14,'rgba(29,158,117,.22)','#1d9e75'],
   [.70,.55,.12,'rgba(226,75,74,.30)','#e24b4a']].forEach(([x,y,r,col,b]) => {
    const gd = ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,r*w);
    gd.addColorStop(0, col.replace(/[\d.]+\)/, '.6)'));
    gd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(x*w,y*h,r*w,0,Math.PI*2); ctx.fill();
  });

  [[.28,.16],[.45,.50],[.65,.20],[.80,.38],[.18,.60],[.88,.18],[.55,.72]].forEach(([x,y]) => {
    ctx.fillStyle = '#378add'; ctx.beginPath(); ctx.arc(x*w,y*h,2.5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(55,138,221,.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x*w,y*h,6,0,Math.PI*2); ctx.stroke();
  });

  ctx.fillStyle = '#e24b4a'; ctx.beginPath(); ctx.arc(.70*w,.55*h,5,0,Math.PI*2); ctx.fill();
}

function drawMetanoMap() {
  const canvas = document.getElementById('canvas-metano');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;

  ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, w, h);

  [[.45,.35,.22,'rgba(226,75,74,.5)','#e24b4a'],
   [.22,.60,.14,'rgba(239,159,39,.4)','#ef9f27'],
   [.72,.65,.10,'rgba(239,159,39,.3)','#ef9f27'],
   [.15,.25,.08,'rgba(55,138,221,.3)','#378add']].forEach(([x,y,r,col,b]) => {
    const gd = ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,r*w);
    gd.addColorStop(0, col.replace(/[\d.]+\)/, '.7)'));
    gd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(x*w,y*h,r*w,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = b; ctx.lineWidth = 1; ctx.globalAlpha = .5;
    ctx.beginPath(); ctx.arc(x*w,y*h,r*w,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif';
  ctx.fillText('Cuenca Austral · 2340 ppb', w*.45 - 55, h*.35 - 14);
}

function initMaps() {
  setTimeout(() => {
    drawAgroMap();
    drawMarMap();
    drawMetanoMap();
  }, 100);
}

window.addEventListener('resize', () => {
  drawAgroMap(); drawMarMap(); drawMetanoMap();
});
