// ── Vertech TdF — App principal ──

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
  const fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        currentImageData = ev.target.result;
        showPreview(currentImageData, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Drag & Drop ──
  const dropZone = document.getElementById('drop-zone');
  if (dropZone) {
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.background = 'var(--gray-xl)';
      dropZone.style.borderColor = 'var(--gray-m)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.background = 'var(--bg)';
      dropZone.style.borderColor = 'var(--gray-l)';
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.style.background = 'var(--bg)';
      dropZone.style.borderColor = 'var(--gray-l)';
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        currentImageData = ev.target.result;
        showPreview(currentImageData, file.name);
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Botones de demo ──
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.demo;
      // Seleccionar modo correspondiente
      const modeCard = document.querySelector(`.mode-card[data-mode="${type}"]`);
      if (modeCard) {
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        modeCard.classList.add('selected');
        currentImageMode = type;
      }
      currentImageData = generateDemoImage(type);
      showPreview(currentImageData, `Demo — ${type} · TdF`);
    });
  });

  // ── Botón analizar ──
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', runImageAnalysis);
  }

});
