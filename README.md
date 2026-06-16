# Vertech TdF — Plataforma de Inteligencia Satelital

**Innovatón Space 2025 · Tierra del Fuego, Argentina**

Plataforma web de análisis satelital con IA que integra tres módulos:
- 🌿 **AgroTech** — NDVI, estrés hídrico y misiones de drones para campos patagónicos
- 🌊 **Economía Azul** — Temperatura, clorofila y monitoreo del Mar Argentino
- 🔥 **Metano** — Detección de anomalías CH₄ en la Cuenca Austral

---

## Cómo ejecutar

### Opción 1 — Vercel (recomendado, un clic)

1. Hacé fork de este repositorio en tu cuenta de GitHub
2. Entrá a [vercel.com](https://vercel.com) y conectá tu cuenta de GitHub
3. Importá el repositorio → Deploy automático
4. Listo: tu app queda en `https://vertech-tdf.vercel.app`

### Opción 2 — GitHub Pages

1. En tu repositorio de GitHub: **Settings → Pages**
2. Source: `Deploy from a branch` → rama `main` → carpeta `/ (root)`
3. Tu app queda en `https://tuusuario.github.io/vertech-tdf`

### Opción 3 — Local (sin servidor)

Simplemente abrí `index.html` en tu navegador. No requiere instalación ni servidor.

---

## Configurar la API Key

1. Obtené tu clave gratuita en [console.anthropic.com](https://console.anthropic.com)
2. Abrí el archivo `js/config.js`
3. Reemplazá `TU_API_KEY_AQUI` con tu clave:

```js
const CONFIG = {
  ANTHROPIC_API_KEY: 'sk-ant-api03-...',
  MODEL: 'claude-sonnet-4-6',
  MAX_TOKENS: 1000,
};
```

> **Nota:** Para el Innovatón podés usar la API key directamente en el cliente. Para producción, usá un backend proxy.

---

## Estructura del proyecto

```
vertech-tdf/
├── index.html          ← App principal
├── css/
│   └── styles.css      ← Estilos completos
├── js/
│   ├── config.js       ← API key y configuración
│   ├── maps.js         ← Mapas en canvas
│   ├── prompts.js      ← Prompts de IA
│   ├── analyzer.js     ← Lógica del analizador
│   └── app.js          ← Navegación y eventos
└── README.md
```

---

## Funcionalidades

| Módulo | Funcionalidad |
|--------|--------------|
| AgroTech | Mapa NDVI por zona, flota de drones, alertas de campo |
| Economía Azul | Mapa oceanográfico, 4 análisis IA activos |
| Metano | Mapa CH₄, selector de zonas, 4 análisis IA |
| Analizador | Subí cualquier imagen satelital → IA devuelve índices + diagnóstico + misiones |

---

## Fuentes de datos satelitales (gratuitas)

| Fuente | Dato | Link |
|--------|------|------|
| Sentinel-2 (ESA) | NDVI, cobertura vegetal | [scihub.copernicus.eu](https://scihub.copernicus.eu) |
| Sentinel-5P TROPOMI | Concentración CH₄ | [s5phub.copernicus.eu](https://s5phub.copernicus.eu) |
| Sentinel-3 OLCI | Clorofila-a marina | [s3hub.copernicus.eu](https://s3hub.copernicus.eu) |
| MODIS (NASA) | Temperatura superficial del mar | [earthdata.nasa.gov](https://earthdata.nasa.gov) |
| Copernicus Marine | Oceanografía en tiempo real | [marine.copernicus.eu](https://marine.copernicus.eu) |

---

## Roadmap

- **Opción A (actual):** Claude Vision analiza imágenes visualmente
- **Opción B (próximo):** Pipeline Python con `rasterio + GDAL` para cálculo de índices espectrales por banda
- **Fase 3:** Conexión API Copernicus para imágenes automáticas en tiempo real
- **Fase 4:** Despacho de misiones a drones vía API telemetría

---

## Tecnologías

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- [Claude API](https://anthropic.com) — análisis IA con visión
- Canvas API — visualización de mapas
- Tabler Icons — iconografía

---

## Equipo

**Vertech TdF** · Tierra del Fuego, Argentina  
Innovatón Space 2025 · Datos satelitales + IA + impacto real
