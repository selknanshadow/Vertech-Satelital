// ── Vertech TdF — Configuración ──
// Reemplazá con tu clave de API de Anthropic
// Obtené una gratis en: https://console.anthropic.com

const CONFIG = {
  ANTHROPIC_API_KEY: sessionStorage.getItem('vertech_api_key') || '',
  MODEL: 'claude-sonnet-4-6',
  MAX_TOKENS: 1000,
};
