/ ── Vertech TdF — App principal ──
 
document.addEventListener('DOMContentLoaded', () => {
 
  // ── Navegación por tabs ──
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });
 
  // ── Inicializar mapas ──
  initMaps();
 
  // ── Botones IA — Mar y Metano ──
  document.querySelectorAll('.ia-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      const isMetano = prompt.startsWith('ch4');
      const stId  = isMetano ? 'st-metano' : 'st-mar';
      const resId = isMetano ? 'res-metano' : 'res-mar';
      runTextIA(prompt, stId, resId);
    });
  });
 
  // ── Selector de modo en analizador ──
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentImageMode = card.dataset.mode;
    });
  });
 
  // ── Zonas de metano ──
  document.querySelectorAll('.zone-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.zone-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
 
  // ── Upload de archivo ──
  // NOTA: el listener de file-input y drop-zone vive en analyzer.js (showPreview / procesarArchivo)
  // No duplicar listeners acá — app.js delega al analyzer
 
  // ── Botones de demo ──
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.demo;
      const modeCard = document.querySelector(`.mode-card[data-mode="${type}"]`);
      if (modeCard) {
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        modeCard.classList.add('selected');
        currentImageMode = type;
      }
      const demoData = generateDemoImage(type);
      showPreview(demoData, `Demo — ${type} · TdF`);
    });
  });
 
  // ── Botón analizar → delega a analyzer.js ──
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', runImageAnalysis);
  }
 
});
 
