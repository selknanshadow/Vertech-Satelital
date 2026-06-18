// ── Vertech TdF — Analizador IA (Control de Calidad CONAE) ──
// Llama directo a la API de Anthropic — sin backend externo

let mapaEnMemoriaBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
  const dropZone       = document.getElementById("drop-zone");
  const fileInput      = document.getElementById("file-input");
  const previewWrap    = document.getElementById("preview-wrap");
  const previewImg     = document.getElementById("preview-img");
  const analyzeBtn     = document.getElementById("analyze-btn");
  const backendSpinner = document.getElementById("backend-spinner");
  const resultsContainer = document.getElementById("results-container");

  if (!fileInput || !dropZone || !analyzeBtn) return;

  // ── 1. Abrir explorador al hacer click en la zona ──
  dropZone.addEventListener("click", () => fileInput.click());

  // ── 2. Drag & Drop ──
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--blue)";
    dropZone.style.background  = "rgba(55, 138, 221, 0.08)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "rgba(45, 61, 87, 0.6)";
    dropZone.style.background  = "rgba(255, 255, 255, 0.01)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(45, 61, 87, 0.6)";
    dropZone.style.background  = "rgba(255, 255, 255, 0.01)";
    if (e.dataTransfer.files.length > 0) {
      procesarArchivo(e.dataTransfer.files[0]);
    }
  });

  // ── 3. Selección tradicional ──
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) procesarArchivo(e.target.files[0]);
  });

  // ── 4. Leer archivo → Base64 ──
  function procesarArchivo(file) {
    if (!file.type.startsWith("image/")) {
      alert("Formato no válido. Subí una imagen del mapa (PNG o JPEG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      mapaEnMemoriaBase64 = e.target.result;
      previewImg.src           = mapaEnMemoriaBase64;
      previewWrap.style.display = "block";
      dropZone.style.padding   = "1rem";
      analyzeBtn.disabled      = false;
      if (resultsContainer) resultsContainer.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  // ── 5. Ejecutar Auditoría → Claude Vision directo ──
  analyzeBtn.addEventListener("click", async () => {
    if (!mapaEnMemoriaBase64) return;

    // Verificar que haya API key en sessionStorage
    const apiKey = CONFIG.ANTHROPIC_API_KEY;
    if (!apiKey) {
      alert("No se encontró la clave de API de Anthropic.\nIngresala en el campo de configuración al iniciar la aplicación.");
      return;
    }

    analyzeBtn.disabled = true;
    if (resultsContainer) resultsContainer.style.display = "none";
    if (backendSpinner)   backendSpinner.classList.remove("hidden");

    // Feedback secuencial mientras procesa
    const pasos = [
      "Leyendo mapa temático...",
      "Verificando layout y coordenadas...",
      "Validando simbología y leyendas...",
      "Analizando marcas institucionales y logos...",
      "Generando reporte final..."
    ];
    let pasoActual = 0;
    const infoSpan = backendSpinner.querySelector("span");
    const intervalo = setInterval(() => {
      if (pasoActual < pasos.length && infoSpan) {
        infoSpan.textContent = pasos[pasoActual++];
      }
    }, 900);

    // Solo el base64 puro (sin el prefijo data:image/...;base64,)
    const base64puro = mapaEnMemoriaBase64.split(',')[1];
    const mediaType  = mapaEnMemoriaBase64.split(';')[0].split(':')[1]; // image/png, image/jpeg, etc.

    const prompt = `Sos un experto en cartografía técnica e institucional argentina.
Analizá esta imagen de mapa temático y devolvé ÚNICAMENTE un objeto JSON válido, sin texto adicional, sin bloques de código, sin explicaciones.

El JSON debe tener exactamente estas tres claves:
{
  "errores_criticos": "...",
  "sugerencias": "...",
  "validacion": "..."
}

Criterios de evaluación:
- errores_criticos: Listá omisiones graves: falta de escala gráfica o numérica, falta de flecha de norte, ausencia de coordenadas o grilla, leyenda incompleta o ausente, logos institucionales faltantes (CONAE, provincia, organismo autor). Si no hay errores, escribí "Ningún error crítico detectado."
- sugerencias: Mejoras recomendadas sobre tipografía, jerarquía visual, contraste de colores, legibilidad de rótulos, densidad de información. Si no hay sugerencias, escribí "El mapa cumple con los estándares técnicos. No se requieren ajustes."
- validacion: Confirmá qué elementos están correctamente presentes: logos validados, metadatos completos, proyección cartográfica indicada, fuentes de datos citadas.

Respondé solo con el JSON, nada más.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-calls": "true"
        },
        body: JSON.stringify({
          model: CONFIG.MODEL,
          max_tokens: CONFIG.MAX_TOKENS,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType,
                    data: base64puro
                  }
                },
                {
                  type: "text",
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      clearInterval(intervalo);
      if (backendSpinner) backendSpinner.classList.add("hidden");

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const texto = data.content?.[0]?.text || "";

      // Limpiar posibles bloques ```json que el modelo agregue igual
      const textoLimpio = texto.replace(/```json|```/g, "").trim();
      const resultado = JSON.parse(textoLimpio);

      document.getElementById("res-criticos").innerHTML =
        resultado.errores_criticos || '<span style="color:var(--green)"><i class="ti ti-circle-check"></i> Ningún error crítico detectado.</span>';

      document.getElementById("res-sugerencias").innerHTML =
        resultado.sugerencias || "El mapa cumple con los estándares técnicos. No se requieren ajustes.";

      document.getElementById("res-validacion").innerHTML =
        resultado.validacion || '<span style="color:var(--green)">Elementos institucionales validados correctamente.</span>';

      if (resultsContainer) resultsContainer.style.display = "grid";

    } catch (err) {
      clearInterval(intervalo);
      if (backendSpinner) backendSpinner.classList.add("hidden");

      // Mostrar el error real en consola y un mensaje claro al usuario
      console.error("Error al analizar imagen:", err);
      alert(`Error al ejecutar la auditoría:\n${err.message}\n\nVerificá que tu clave de API de Anthropic sea válida.`);
    }

    analyzeBtn.disabled = false;
  });
});
