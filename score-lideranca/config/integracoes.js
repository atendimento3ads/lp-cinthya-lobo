/*
 * Integrações opcionais da LP.
 *
 * - O GA4 e o Google Ads devem ser configurados dentro do contêiner do GTM.
 * - Nunca coloque tokens, senhas ou segredos neste arquivo público.
 * - O webhook abaixo é um aplicativo Web do Google Apps Script. A URL é pública
 *   por necessidade técnica, portanto nunca inclua tokens ou segredos no payload.
 */
window.SCORE_INTEGRACOES = {
  gtmId: '',
  webhookUrl: 'https://script.google.com/macros/s/AKfycbx0g73v7GKN9uklx9DKRTI50a8SI_Tnkz2Y0dECw0beS-_-C1l7EeT3u4yGazo59SQ44Q/exec'
};
