// ── Vertech — Prompts genéricos ──

const SYSTEM_PROMPT = `Sos el sistema de análisis satelital Vertech. Analizás imágenes satelitales de cualquier zona del mundo y respondés en español, de forma técnica, concisa y orientada a la acción.`;

const IA_PROMPTS = {
  pesquero: `Analizá las condiciones oceánicas actuales de la zona seleccionada y generá un informe ejecutivo de 5 oraciones sobre la situación pesquera: productividad biológica, temperatura superficial, corrientes, y recomendaciones para la actividad pesquera.`,

  termico: `Evaluá el estado térmico de la zona marina seleccionada en 5 oraciones. ¿Qué implica para el ecosistema marino, la distribución de especies y la actividad pesquera?`,

  productividad: `Analizá la productividad marina de la zona seleccionada en 5 oraciones: biomasa fitoplanctónica, condiciones para la pesca, y tendencias estacionales esperadas.`,

  economia: `Estimá el impacto económico de las condiciones oceanográficas actuales de la zona en 5 oraciones. Incluí implicancias para la industria pesquera y la economía azul regional.`,

  ch4riesgo: `Evaluá el nivel de riesgo de emisiones de metano (CH₄) en la zona analizada en 5 oraciones. Clasificá el riesgo, identificá las áreas críticas y justificá las acciones urgentes.`,

  ch4fuente: `Identificá las fuentes más probables de emisión de CH₄ en la zona analizada en 5 oraciones. Considerá: sector energético, ganadería, humedales, agricultura y actividad industrial.`,

  ch4tendencia: `Analizá la tendencia de CH₄ en la zona analizada en 5 oraciones. ¿Qué proyección es posible y qué umbrales de alarma deberían activarse?`,

  ch4accion: `Generá un plan de acción concreto ante las emisiones de CH₄ detectadas en la zona analizada. Formato: 4 acciones numeradas, específicas, operativas y priorizadas para autoridades ambientales y sector energético.`,
};

const IMAGE_PROMPTS = {
  campo: `Analizás una imagen satelital de un campo o zona de vegetación. El usuario indicó que es de: {lugar} ({fuente}, {fecha}).
Respondé SOLO en JSON puro sin backticks:
{"indices":[{"label":"NDVI promedio","value":"0.XX","sub":"estado vegetal"},{"label":"Humedad estimada","value":"XX%","sub":"condición hídrica"},{"label":"Cobertura vegetal","value":"XX%","sub":"densidad"},{"label":"Zonas críticas","value":"X","sub":"requieren acción"}],
"diagnostico":"5-6 oraciones técnicas sobre el estado del campo, zonas de estrés, cobertura vegetal y recomendaciones agronómicas específicas para la zona.",
"misiones":[{"tarea":"descripción concisa","prioridad":"alta","zona":"zona específica"},{"tarea":"descripción","prioridad":"media","zona":"zona"},{"tarea":"descripción","prioridad":"baja","zona":"zona"}]}`,

  mar: `Analizás una imagen satelital del mar o zona oceánica. El usuario indicó que es de: {lugar} ({fuente}, {fecha}).
Respondé SOLO en JSON puro sin backticks:
{"indices":[{"label":"Temperatura sup.","value":"X.X°C","sub":"estimación visual"},{"label":"Productividad","value":"Alta/Media/Baja","sub":"biomasa fitoplanctónica"},{"label":"Turbidez","value":"XX NTU","sub":"claridad del agua"},{"label":"Alertas","value":"X","sub":"zonas de riesgo"}],
"diagnostico":"5-6 oraciones sobre el estado oceanográfico, productividad marina, y condiciones para la actividad pesquera en la zona.",
"misiones":[{"tarea":"acción de monitoreo","prioridad":"alta","zona":"sector"},{"tarea":"descripción","prioridad":"media","zona":"sector"},{"tarea":"descripción","prioridad":"baja","zona":"sector"}]}`,

  metano: `Analizás una imagen satelital de concentración de CH₄. El usuario indicó que es de: {lugar} ({fuente}, {fecha}).
Respondé SOLO en JSON puro sin backticks:
{"indices":[{"label":"CH₄ estimado","value":"XXXX ppb","sub":"zona general"},{"label":"Pico detectado","value":"XXXX ppb","sub":"zona más crítica"},{"label":"Anomalías","value":"X zonas","sub":"sobre umbral normal"},{"label":"Riesgo","value":"Alto/Medio/Bajo","sub":"clasificación IA"}],
"diagnostico":"5-6 oraciones sobre nivel de riesgo, fuentes probables de emisión, tendencia y recomendaciones urgentes para la zona.",
"misiones":[{"tarea":"acción urgente","prioridad":"alta","zona":"zona"},{"tarea":"descripción","prioridad":"media","zona":"zona"},{"tarea":"descripción","prioridad":"baja","zona":"zona"}]}`,
};
