// ── Vertech TdF — App principal ──

document.addEventListener('DOMContentLoaded', () => {

  // ── Función de navegación compartida ──
  function activateTab(tab) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    document.querySelectorAll(`.nav-btn[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
    document.querySelectorAll(`.tab-btn[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));

    const panel = document.getElementById(`tab-${tab}`);
    if (panel) panel.classList.add('active');
  }

  // ── Sidebar (iconos) ──
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // ── Tab nav horizontal ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
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

  // ── Botones de demo ──
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.demo;
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
