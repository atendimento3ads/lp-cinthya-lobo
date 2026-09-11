# Score de Liderança: configuração da IA (rascunho)

Rascunho para a fase de integração. O protótipo **ainda não chama IA**: a leitura individualizada é montada por regras em [`assets/motor.js`](../assets/motor.js).

## Arquitetura recomendada

```
Formulário ─▶ Motor de regras (determinístico) ─▶ IA (só redação) ─▶ Resultado na tela
                 │                                   │
                 └──── payload ──▶ CRM / webhook ◀───┘ (lead + score + devolutiva)
```

- **O motor decide** o score, o nível e as 3 prioridades. É auditável, instantâneo e não "alucina" prioridade.
- **A IA só redige** o bloco 2 (leitura individualizada) e ajusta a redação das prioridades, sem mudar o conteúdo.
- **Fallback:** se a IA falhar ou demorar, a tela mostra a leitura do motor, que já funciona hoje.
- A chamada à IA precisa sair de um **backend**, porque a chave da API não pode ficar no front. O GitHub Pages é só estático, então na integração entra uma função serverless (Cloudflare Workers, Vercel, Netlify, n8n/Make etc.).

## Entrada da IA

O objeto gerado por `ScoreMotor.montarPayload()` (dá para ver no **Painel de validação** do protótipo):

```json
{
  "lead": { "nome": "...", "empresa": "...", "colaboradores": "11 a 20", "desafio": "..." },
  "score": { "total": 45, "minimo": 25, "maximo": 75, "nivel": "Liderança Técnica" },
  "respostas": [
    { "questao": 1, "dimensao": "lideranca", "peso": 3, "alternativa": "A", "pontos": 9,
      "pergunta": "...", "resposta": "..." }
  ],
  "prioridades_motor": [
    { "texto": "Estruturar a gestão por metas, indicadores e acompanhamento de resultados.",
      "dimensoes": ["metas", "acompanhamento"], "tipo": "agrupamento" }
  ],
  "regras_aplicadas": ["Agrupou Metas + Acompanhamento de resultados em uma única prioridade."]
}
```

E-mail e WhatsApp **não** vão para a IA. Mande só o necessário para a redação.

## Prompt de sistema (rascunho)

```
Você redige a devolutiva do "Score de Liderança da Farmácia", diagnóstico da
Cinthya Lobo (Método Wolf Farma) para donos e gestores de farmácia.

Você recebe: o nível já calculado, as 12 respostas, o maior desafio informado
pelo gestor e as 3 prioridades já definidas pelo motor de regras.

Sua tarefa:
1. NÍVEL ATUAL — uma frase de abertura sobre o nível (use a descrição oficial
   do nível, adaptada para a segunda pessoa).
2. LEITURA INDIVIDUALIZADA — 2 a 3 parágrafos curtos que cruzem:
   - os pontos fortes (respostas A em dimensões de maior peso);
   - as fragilidades (respostas C, depois B, por peso);
   - correlações entre respostas (ex.: líder B + tempo C = o acúmulo
     operacional limita a liderança; delegação C + autonomia C = um único
     gargalo; engajamento baixo = sintoma, sempre ligado à causa estrutural);
   - o maior desafio informado, conectado às respostas.
   Mostre que interpretou o conjunto, e não que só calculou uma nota.
3. PRIORIDADES — reescreva as 3 prioridades recebidas em linguagem natural,
   SEM mudar o conteúdo, a ordem ou a quantidade.

Limites obrigatórios:
- Diga O QUE precisa ser desenvolvido, nunca COMO: sem passo a passo,
  ferramentas, modelos, frequências ou instruções de implementação.
- Não crie prioridades novas nem inverta a ordem.
- Não trate a ausência de remuneração variável como problema central.
- Não recomende "aumentar o engajamento" de forma genérica.
- Se o perfil for maduro (maioria A), fale em evolução, sem inventar problema.
- Tom: direto, respeitoso, de quem conhece a rotina de farmácia. Segunda
  pessoa ("você"). Sem jargão de RH, sem exageros, sem emojis.
- Português do Brasil. Máximo de ~180 palavras na leitura.

Responda apenas em JSON:
{ "abertura": "...", "leitura": ["parágrafo 1", "parágrafo 2"], "prioridades": ["...", "...", "..."] }
```

## Checklist da integração

- [ ] Endpoint serverless: recebe o payload, grava o lead e chama a IA.
- [ ] CRM/planilha: destino do lead (RD Station, HubSpot, Google Sheets, Kommo…).
- [ ] Validação da resposta da IA: JSON válido, exatamente 3 prioridades e nenhum "como fazer" (lista de termos proibidos).
- [ ] Timeout (~8 s) com fallback para o texto do motor.
- [ ] Rastreamento: instalar GTM/Pixel/GA4. Os eventos já são empilhados no `dataLayer` (veja o README).
- [ ] Envio da devolutiva por e-mail/WhatsApp (opcional).
- [ ] Link da política de privacidade no consentimento.
