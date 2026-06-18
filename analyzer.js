 ── Vertech TdF — Analizador IA (Control de Calidad CONAE) ──
// Llama directo a la API de Anthropic — sin backend externo
 
let mapaEnMemoriaBase64 = null;
 
function runImageAnalysis() {
  const analyzeBtn     = document.getElementById("analyze-btn");
  const backendSpinner = document.getElementById("backend-spinner");
  const resultsContainer = document.getElementById("results-container");
 
  if (!mapaEnMemoriaBase64) return;
 
  const apiKey = (typeof CONFIG !== 'undefined') ? CONFIG.ANTHROPIC_API_KEY : '';
  if (!apiKey) {
    alert("No se encontró la clave de API de Anthropic.\nIngresala al iniciar la aplicación.");
    return;
  }
 
  if (analyzeBtn)     analyzeBtn.disabled = true;
  if (resultsContainer) resultsContainer.style.display = "none";
  if (backendSpinner) backendSpinner.classList.remove("hidden");
 
  const pasos = [
    "Leyendo mapa temático...",
    "Verificando layout y coordenadas...",
    "Validando simbología y leyendas...",
    "Analizando marcas institucionales y logos...",
    "Generando reporte final..."
  ];
  let pasoActual = 0;
  const infoSpan = backendSpinner ? backendSpinner.querySelector("span") : null;
  const intervalo = setInterval(() => {
    if (pasoActual < pasos.length && infoSpan) {
      infoSpan.textContent = pasos[pasoActual++];
    }
  }, 900);
 
  const base64puro = mapaEnMemoriaBase64.split(',')[1];
  const mediaType  = mapaEnMemoriaBase64.split(';')[0].split(':')[1];
 
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
 
  fetch("https://api.anthropic.com/v1/messages", {
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
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64puro }
          },
          { type: "text", text: prompt }
        ]
      }]
    })
  })
  .then(res => {
    if (!res.ok) return res.json().then(e => { throw new Error(e?.error?.message || `HTTP ${res.status}`); });
    return res.json();
  })
  .then(data => {
    clearInterval(intervalo);
    if (backendSpinner) backendSpinner.classList.add("hidden");
 
    const texto = data.content?.[0]?.text || "";
    const textoLimpio = texto.replace(/```json|```/g, "").trim();
    const resultado = JSON.parse(textoLimpio);
 
    document.getElementById("res-criticos").innerHTML =
      resultado.errores_criticos ||
      '<span style="color:var(--green)"><i class="ti ti-circle-check"></i> Ningún error crítico detectado.</span>';
 
    document.getElementById("res-sugerencias").innerHTML =
      resultado.sugerencias ||
      "El mapa cumple con los estándares técnicos. No se requieren ajustes.";
 
    document.getElementById("res-validacion").innerHTML =
      resultado.validacion ||
      '<span style="color:var(--green)">Elementos institucionales validados correctamente.</span>';
 
    if (resultsContainer) resultsContainer.style.display = "grid";
  })
  .catch(err => {
    clearInterval(intervalo);
    if (backendSpinner) backendSpinner.classList.add("hidden");
    console.error("Error al analizar imagen:", err);
    alert(`Error al ejecutar la auditoría:\n${err.message}\n\nVerificá que tu clave de API sea válida.`);
  })
  .finally(() => {
    if (analyzeBtn) analyzeBtn.disabled = false;
  });
}
 
function showPreview(base64, nombre) {
  const previewWrap = document.getElementById("preview-wrap");
  const previewImg  = document.getElementById("preview-img");
  const dropZone    = document.getElementById("drop-zone");
  const analyzeBtn  = document.getElementById("analyze-btn");
 
  mapaEnMemoriaBase64 = base64;
 
  if (previewImg)  previewImg.src = base64;
  if (previewWrap) previewWrap.style.display = "block";
  if (dropZone)    dropZone.style.padding = "1rem";
  if (analyzeBtn)  analyzeBtn.disabled = false;
 
  const resultsContainer = document.getElementById("results-container");
  if (resultsContainer) resultsContainer.style.display = "none";
}
 
function generateDemoImage(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 300;
  const ctx = canvas.getContext('2d');
 
  if (type === 'campo') {
    ctx.fillStyle = '#0d1f0e'; ctx.fillRect(0, 0, 400, 300);
    const cols = ['#2d7a2d','#8db84e','#c8a838','#a83228'];
    cols.forEach((c, i) => {
      ctx.fillStyle = c + '99';
      ctx.fillRect(i * 100, 0, 100, 300);
    });
    ctx.fillStyle = '#fff'; ctx.font = '13px sans-serif';
    ctx.fillText('NDVI — Demo Campo TdF', 10, 20);
  } else if (type === 'mar') {
    ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, 400, 300);
    const gd = ctx.createRadialGradient(200, 150, 0, 200, 150, 120);
    gd.addColorStop(0, 'rgba(29,158,117,0.6)');
    gd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gd; ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#378add'; ctx.font = '13px sans-serif';
    ctx.fillText('SAR — Demo Mar Argentino', 10, 20);
  } else {
    ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, 400, 300);
    const gd = ctx.createRadialGradient(200, 150, 0, 200, 150, 100);
    gd.addColorStop(0, 'rgba(226,75,74,0.7)');
    gd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gd; ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#ef9f27'; ctx.font = '13px sans-serif';
    ctx.fillText('TROPOMI — Demo CH₄ TdF', 10, 20);
  }
 
  return canvas.toDataURL('image/png');
}
