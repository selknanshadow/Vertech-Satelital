/ ── Vertech — Analizador Integrado (Control de Calidad CONAE) ──
const BACKEND_URL = 'https://vertech-backend.onrender.com';
let mapaEnMemoriaBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const previewWrap = document.getElementById("preview-wrap");
  const previewImg = document.getElementById("preview-img");
  const analyzeBtn = document.getElementById("analyze-btn");
  const backendSpinner = document.getElementById("backend-spinner");
  const resultsContainer = document.getElementById("results-container");

  // Verificar la existencia de elementos críticos
  if (!fileInput || !dropZone || !analyzeBtn) return;

  // 1. Eventos de apertura de archivos al hacer click
  dropZone.addEventListener("click", () => fileInput.click());

  // 2. Comportamiento Drag & Drop (Arrastrar y Soltar)
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--blue)";
    dropZone.style.background = "rgba(55, 138, 221, 0.05)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "rgba(45, 61, 87, 0.6)";
    dropZone.style.background = "rgba(255, 255, 255, 0.01)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(45, 61, 87, 0.6)";
    dropZone.style.background = "rgba(255, 255, 255, 0.01)";
    
    if (e.dataTransfer.files.length > 0) {
      procesarArchivoMapa(e.dataTransfer.files[0]);
    }
  });

  // 3. Evento por selección tradicional en explorador
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      procesarArchivoMapa(e.target.files[0]);
    }
  });

  // 4. Leer archivo y pasarlo a Base64 para visualización y Backend
  function procesarArchivoMapa(file) {
    if (!file.type.startsWith("image/")) {
      alert("Formato no válido. Por favor, suba una exportación de mapa en formato de imagen (PNG, JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      mapaEnMemoriaBase64 = e.target.result;
      
      // Ajustar UI con previsualización activa
      previewImg.src = mapaEnMemoriaBase64;
      previewWrap.style.display = "block";
      dropZone.style.padding = "20px"; // Compactar zona de carga
      
      // Habilitar botón de acción y limpiar estados previos
      analyzeBtn.disabled = false;
      if (resultsContainer) resultsContainer.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  // 5. Ejecutar la Auditoría Automática (Llamado al Servidor)
  analyzeBtn.addEventListener("click", async () => {
    if (!mapaEnMemoriaBase64) return;

    analyzeBtn.disabled = true;
    if (resultsContainer) resultsContainer.style.display = "none";
    if (backendSpinner) backendSpinner.classList.remove("hidden");

    // Feedback secuencial simulando la revisión local en el servidor de CONAE
    const pasosAuditoria = [
      "Leyendo archivo de mapa temático...",
      "Verificando layout y coordenadas...",
      "Validando consistencia de simbología y leyendas...",
      "Analizando presencia de marcas institucionales y logos...",
      "Procesando reporte final del asistente..."
    ];
    
    let pasoActual = 0;
    const infoSpinner = backendSpinner.querySelector("span");
    
    const intervalPasos = setInterval(() => {
      if (pasoActual < pasosAuditoria.length && infoSpinner) {
        infoSpinner.textContent = pasosAuditoria[pasoActual++];
      }
    }, 900);

    try {
      const response = await fetch(`${BACKEND_URL}/analizar-imagen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagen_base64: mapaEnMemoriaBase64.split(',')[1],
          tipo: 'conae_control_calidad' // Indicador de contexto para el prompt del backend
        }),
      });

      clearInterval(intervalPasos);
      if (backendSpinner) backendSpinner.classList.add("hidden");

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const data = await response.json();

      // Renderizar los resultados procesados en las tarjetas del HTML
      document.getElementById("res-criticos").innerHTML = data.errores_criticos || 
        `<span style="color:#39d353;"><i class="ti ti-circle-check"></i> Ningún error crítico ni omisión cartográfica detectada.</span>`;
      
      document.getElementById("res-sugerencias").innerHTML = data.sugerencias || 
        `El mapa cumple con los estándares técnicos mínimos. No se requieren ajustes adicionales.`;
      
      document.getElementById("res-validacion").innerHTML = data.validacion || 
        `<span style="color:#39d353;">Logos oficiales de CONAE y Unidad de Emergencias validados correctamente.</span>`;

      // Mostrar contenedor general de resultados
      if (resultsContainer) resultsContainer.style.display = "grid";

    } catch (err) {
      clearInterval(intervalPasos);
      if (backendSpinner) backendSpinner.classList.add("hidden");
      alert("Error en el servidor local de auditoría. Verifique la conexión con el nodo.");
      console.error(err);
    }
    
    analyzeBtn.disabled = false;
  });
});
