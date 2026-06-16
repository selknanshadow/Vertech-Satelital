// ── Vertech TdF — Prompts de IA ──

const SYSTEM_PROMPT = `Sos el sistema de análisis satelital de Vertech TdF, plataforma de inteligencia
ambiental con IA para Tierra del Fuego, Argentina. Analizás datos del Mar Argentino,
campos patagónicos y emisiones de metano. Respondés en español, de forma técnica,
concisa y orientada a la acción operativa.`;

const IA_PROMPTS = {
  // Mar Argentino
  pesquero: `Analizá estos datos del Mar Argentino zona TdF y generá un informe ejecutivo de 5 oraciones sobre la situación pesquera:
- Temperatura superficial: 7.3°C (+2.1°C sobre media histórica)
- Clorofila-a: 2.8 mg/m³ (alta productividad, bloom activo)
- Embarcaciones detectadas: 47 (3 en zona restringida)
- ZEE Argentina activa
Incluí implicancias para la economía azul y recomendaciones operativas.`,

  termico: `Evaluá la anomalía térmica en el Mar Argentino zona TdF en 5 oraciones:
- Temperatura sup.: 7.3°C (+2.1°C sobre media histórica)
- Sin precipitaciones significativas hace 21 días
- Bloom de fitoplancton activo
¿Qué implica para el ecosistema marino y la pesca patagónica?`,

  productividad: `Analizá la productividad marina del Mar Argentino zona TdF en 5 oraciones:
- Clorofila-a: 2.8 mg/m³ (bloom activo, alta productividad)
- Temperatura: 7.3°C (condiciones subantárticas)
- 47 embarcaciones pesqueras activas
¿Qué oportunidades y riesgos presenta para la economía azul argentina?`,

  economia: `Estimá el impacto económico de las condiciones actuales del Mar Argentino (TdF) en 5 oraciones:
- Alta productividad biológica (clorofila 2.8 mg/m³)
- 47 embarcaciones activas en ZEE
- 3 embarcaciones en zona de veda (riesgo legal)
Incluí cifras estimadas y recomendaciones para el sector pesquero.`,

  // Metano
  ch4riesgo: `Evaluá el nivel de riesgo de emisiones de metano en TdF en 5 oraciones:
- Concentración CH₄ promedio: 1847 ppb
- Pico Cuenca Austral: 2340 ppb (umbral crítico: 2300 ppb)
- Variación semanal: +12%
- Tendencia ascendente sostenida 72h
Clasificá el riesgo y justificá las acciones urgentes.`,

  ch4fuente: `Identificá las fuentes más probables de emisión de CH₄ en TdF (2340 ppb en Cuenca Austral) en 5 oraciones:
Considerá: sector hidrocarburífero, ganadería ovina extensiva, turba/humedales subantárticos, degradación de permafrost.
Analizá cuál es la fuente dominante y cómo confirmarlo.`,

  ch4tendencia: `Proyectá la tendencia de CH₄ en TdF para los próximos 7 días en 5 oraciones:
- Dato actual: 2340 ppb (Cuenca Austral)
- Variación: +12% semanal
- Tendencia: ascendente 72h continuas
¿Qué umbrales de alarma deberían activarse y cuándo?`,

  ch4accion: `Generá un plan de acción concreto ante la anomalía CH₄ (2340 ppb) en Cuenca Austral TdF.
Formato: 4 acciones numeradas, específicas, operativas y priorizadas para el sector energético, autoridades ambientales y organismos de monitoreo.`,
};

const IMAGE_PROMPTS = {
  campo: `Analizás imágenes satelitales de campos en Tierra del Fuego (ovinos, forestal, pasturas en clima subantártico).
Respondé SOLO en JSON puro, sin backticks, sin texto adicional:
{
  "indices": [
    {"label": "NDVI promedio", "value": "0.XX", "sub": "estado general"},
    {"label": "Humedad suelo", "value": "XX%", "sub": "condición hídrica"},
    {"label": "Cobertura vegetal", "value": "XX%", "sub": "densidad"},
    {"label": "Zonas críticas", "value": "X", "sub": "requieren acción"}
  ],
  "diagnostico": "5-6 oraciones técnicas sobre estado del campo, zonas de estrés, impacto en majada ovina, urgencias para TdF.",
  "misiones": [
    {"tarea": "descripción concisa de la misión", "prioridad": "alta", "zona": "zona específica"},
    {"tarea": "descripción concisa", "prioridad": "media", "zona": "zona"},
    {"tarea": "descripción concisa", "prioridad": "baja", "zona": "zona"}
  ]
}`,

  mar: `Analizás imágenes satelitales del Mar Argentino zona TdF y Patagonia.
Respondé SOLO en JSON puro, sin backticks, sin texto adicional:
{
  "indices": [
    {"label": "Temperatura sup.", "value": "X.X°C", "sub": "vs media histórica"},
    {"label": "Clorofila-a", "value": "X.X mg/m³", "sub": "productividad"},
    {"label": "Embarcaciones", "value": "XX", "sub": "detectadas en zona"},
    {"label": "Alertas", "value": "X", "sub": "zonas de riesgo"}
  ],
  "diagnostico": "5-6 oraciones sobre estado oceanográfico, productividad marina, actividad pesquera y economía azul argentina.",
  "misiones": [
    {"tarea": "acción de alerta u operación", "prioridad": "alta", "zona": "sector del mar"},
    {"tarea": "descripción concisa", "prioridad": "media", "zona": "sector"},
    {"tarea": "descripción concisa", "prioridad": "baja", "zona": "sector"}
  ]
}`,

  metano: `Analizás imágenes satelitales de concentración de CH₄ en TdF y Patagonia.
Respondé SOLO en JSON puro, sin backticks, sin texto adicional:
{
  "indices": [
    {"label": "CH₄ promedio", "value": "XXXX ppb", "sub": "zona general"},
    {"label": "Pico detectado", "value": "XXXX ppb", "sub": "zona crítica"},
    {"label": "Anomalías", "value": "X zonas", "sub": "sobre umbral 2300 ppb"},
    {"label": "Variación", "value": "+X%", "sub": "vs. semana anterior"}
  ],
  "diagnostico": "5-6 oraciones sobre nivel de riesgo, fuentes probables, tendencia y recomendaciones urgentes.",
  "misiones": [
    {"tarea": "acción urgente de monitoreo", "prioridad": "alta", "zona": "zona específica"},
    {"tarea": "descripción concisa", "prioridad": "media", "zona": "zona"},
    {"tarea": "descripción concisa", "prioridad": "baja", "zona": "zona"}
  ]
}`,
};
