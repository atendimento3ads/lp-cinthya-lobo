/*
 * Integrações opcionais da LP.
 *
 * - O GA4 e o Google Ads devem ser configurados dentro do contêiner do GTM.
 * - Nunca coloque tokens, senhas ou segredos neste arquivo público.
 * - Ao definir webhookUrl, inclua a origem exata também no connect-src da CSP
 *   em .htaccess. O endpoint precisa aceitar POST JSON e CORS deste domínio.
 */
window.SCORE_INTEGRACOES = {
  gtmId: '',
  webhookUrl: ''
};
