# Score de Liderança da Farmácia · protótipo

Diagnóstico inteligente da Cinthya Lobo: landing page, 12 perguntas, captura do lead e resultado (nível, leitura individualizada e 3 prioridades).

**Status:** protótipo para validação. Sem IA, sem CRM e sem rastreamento instalado (os eventos já vão para o `dataLayer`).
**URL:** https://atendimento3ads.github.io/lp-cinthya-lobo/score-lideranca/ (fora dos buscadores, com `noindex`).

## Pasta autocontida

Nada aqui depende do site principal: CSS, logo e scripts são próprios. Para levar a outro repositório ou stack, basta copiar a pasta `score-lideranca/` inteira.

```
score-lideranca/
├── index.html                  # LP + questionário + captura + resultado
├── config/
│   └── diagnostico.js          # ★ fonte única: perguntas, pesos, condicionais, níveis,
│                               #   hierarquia, agrupamentos, orientações, CTA
├── assets/
│   ├── motor.js                # regras do diagnóstico (sem DOM; roda no navegador e no Node)
│   ├── app.js                  # fluxo da interface, validação, dataLayer
│   ├── score.css               # estilos (tokens do site Cinthya Lobo replicados)
│   └── logo.svg
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

## Onde ficam os dados no protótipo

Cada envio é salvo só no navegador (`localStorage`, chave `score-lideranca:leads`). Nada sai da máquina.

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

## Próximas etapas

Veja o checklist em [`docs/prompt-ia.md`](docs/prompt-ia.md) e os pontos a validar com a Cinthya em [`docs/estrutura-diagnostico.md`](docs/estrutura-diagnostico.md#9-pontos-em-aberto-validar-com-a-cinthya).
