# Score de Liderança da Farmácia

Diagnóstico inteligente da Cinthya Lobo: landing page, 12 perguntas, captura do lead e resultado (nível, leitura individualizada e 3 prioridades).

**Status:** preparada para produção. GTM e webhook ficam desativados até seus valores serem definidos em `config/integracoes.js`.
**URL:** https://diagnostico.wolffarma.com.br/

## Pasta autocontida

Nada aqui depende do site principal: CSS, logo e scripts são próprios. Para levar a outro repositório ou stack, basta copiar a pasta `score-lideranca/` inteira.

```
score-lideranca/
├── index.html                  # LP + questionário + captura + resultado
├── config/
│   ├── integracoes.js          # GTM e webhook, sem segredos no front-end
│   └── diagnostico.js          # ★ fonte única: perguntas, pesos, condicionais, níveis,
│                               #   hierarquia, agrupamentos, orientações, CTA
├── assets/
│   ├── motor.js                # regras do diagnóstico (sem DOM; roda no navegador e no Node)
│   ├── app.js                  # fluxo da interface, validação, dataLayer
│   ├── score.css               # estilos (tokens do site Cinthya Lobo replicados)
│   └── logo.svg
├── .htaccess                   # CSP, HTTPS, cache, compressão e cabeçalhos de segurança
├── robots.txt                  # rastreamento dos buscadores e endereço do sitemap
├── sitemap.xml                 # URL canônica indexável
├── llm.txt                     # contexto conciso para mecanismos de IA
├── llms.txt                    # variante adotada por crawlers que usam o nome no plural
└── docs/
    ├── estrutura-diagnostico.md  # o PDF organizado + pontos em aberto
    └── prompt-ia.md              # arquitetura e rascunho do prompt para a fase com IA
```

Para mudar uma pergunta, peso, faixa de nível ou texto de prioridade, edite **só** `config/diagnostico.js`. O objeto é JSON válido: tirando o `window.SCORE_DIAGNOSTICO =`, vira um `.json`.

## Rodar localmente

Abra `index.html` direto no navegador, ou sirva a raiz do repositório:

```
npx serve .
```

## Modo de teste

`?teste=1` mostra uma barra com cenários prontos (Tudo A, Tudo B, Tudo C, Exemplo do PDF, Aleatório…), que pulam direto para o resultado com um lead fictício.

- `?teste=1&respostas=ACCBBBBCBBBB`: link direto para o resultado de uma combinação (12 letras, na ordem das questões)
- `?teste=1&tela=quiz` ou `?teste=1&tela=lead`: abre direto numa tela

No fim do resultado há um **Painel de validação** com a pontuação por questão, as regras que o motor aplicou e o payload que seria enviado ao CRM/IA.

Os arquivos `.min.css` e `.min.js` são as versões carregadas em produção. Sempre regenere os minificados após editar os respectivos arquivos-fonte.

## Onde ficam os dados

Sem um webhook configurado, cada envio é salvo somente no navegador (`localStorage`, chave `score-lideranca:leads`). Com `webhookUrl` definido, o payload é enviado por `POST` JSON; se a chamada falhar, o fallback local é preservado. A origem HTTPS exata do webhook também precisa ser adicionada ao `connect-src` da CSP no `.htaccess`.

O GA4 e o Google Ads devem ser configurados dentro do contêiner informado em `gtmId`. Não coloque tokens, senhas ou segredos nos arquivos públicos.

## Eventos de rastreamento (`window.dataLayer`)

| Evento | Quando | Parâmetros |
|---|---|---|
| `score_landing_vista` | página carregada | |
| `score_inicio` | clicou em começar | |
| `score_resposta` | respondeu uma questão | `questao`, `dimensao`, `alternativa` |
| `score_questionario_concluido` | respondeu a 12ª | |
| `score_lead_enviado` | enviou o formulário | `score`, `nivel`, `colaboradores` |
| `score_resultado_visto` | viu o resultado | `score`, `nivel` |
| `score_cta_clique` | clicou no CTA final | |
| `score_webhook_sucesso` | webhook confirmou o recebimento | |
| `score_webhook_erro` | URL inválida ou falha de rede | `motivo` |

## Próximas etapas

Veja o checklist em [`docs/prompt-ia.md`](docs/prompt-ia.md) e os pontos a validar com a Cinthya em [`docs/estrutura-diagnostico.md`](docs/estrutura-diagnostico.md#9-pontos-em-aberto-validar-com-a-cinthya).
