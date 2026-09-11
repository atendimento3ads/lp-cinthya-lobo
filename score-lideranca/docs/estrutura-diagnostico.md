# Score de Liderança da Farmácia: estrutura do diagnóstico

Versão organizada do documento *"Estrutura de diagnóstico para ferramenta de IA"* (Cinthya Lobo + 3ADS, ago/set 2026).
É a referência para quem vai configurar a ferramenta. A versão que o código lê é [`config/diagnostico.js`](../config/diagnostico.js). Se mudar algo aqui, mude lá também.

---

## 1. Objetivo

- Mostrar ao gestor ou líder o **nível de maturidade da liderança**, para que ele perceba a necessidade de avançar ao próximo nível.
- Entregar **o que** ele deve desenvolver, **sem mostrar como** fazer. O "como" é o trabalho da Cinthya (Método Wolf Farma).
- **Gerar e qualificar leads.**

### Dados coletados

| Campo | Observação |
|---|---|
| Nome | |
| E-mail | |
| WhatsApp | máscara (00) 00000-0000 |
| Nome da farmácia/empresa | |
| Quantidade de colaboradores | faixas: 1–5 · 6–10 · 11–20 · 21–50 · 50+ *(faixas propostas pela 3ADS, validar)* |
| Qual é hoje o seu maior desafio na liderança da equipe? | texto livre, cruzado com as respostas na leitura individualizada |

---

## 2. Pontuação

| Alternativa | Pontos |
|---|---|
| A | 3 × peso |
| B | 2 × peso |
| C | 1 × peso |

Os pesos vão de 1 a 3, conforme a relevância da dimensão para a maturidade da liderança. A soma dos pesos é 25, então o score varia de **25 (tudo C) a 75 (tudo A)**.

---

## 3. Questões, pesos e condicionais

| # | Dimensão | Peso | Pergunta |
|---|---|:-:|---|
| 1 | Liderança definida | **3** | Existe hoje um líder ou gerente claramente responsável pela condução da equipe? |
| 2 | Metas | **3** | A equipe trabalha com metas claras de vendas e desempenho? |
| 3 | Acompanhamento | **3** | Os resultados e principais indicadores da equipe são acompanhados com uma frequência definida? |
| 4 | Remuneração variável | 1 | Existe programa de remuneração variável, campanhas ou premiação vinculada aos resultados? |
| 5 | Feedback | 2 | Os colaboradores recebem feedback individual sobre seu desempenho? |
| 6 | Clareza de responsabilidades | 2 | As responsabilidades de cada função estão claramente definidas e são conhecidas pela equipe? |
| 7 | Delegação | **3** | Como funciona hoje a delegação de responsabilidades na farmácia? |
| 8 | Autonomia | 2 | Quando o gestor não está presente, a equipe consegue tomar as decisões rotineiras sem depender constantemente dele? |
| 9 | Engajamento | 1 | Como você avalia o engajamento da equipe com as metas e os resultados da farmácia? |
| 10 | Gestão de desempenho | 2 | Quando um colaborador apresenta desempenho abaixo do esperado, existe um processo para acompanhar sua evolução? |
| 11 | Rotinas de liderança | 2 | Existem rotinas de gestão definidas para o líder? *(Considere reuniões, acompanhamento de indicadores, conversas com a equipe e acompanhamento das prioridades.)* |
| 12 | Tempo estratégico | 1 | O líder consegue dedicar parte do seu tempo à gestão e ao desenvolvimento da equipe, além das atividades operacionais? |

O texto completo das alternativas A/B/C de cada questão está em [`config/diagnostico.js`](../config/diagnostico.js).

### Condicionais para a IA

| # | Se **C** | Se **B** |
|---|---|---|
| 1 | **Obrigatório:** "Definir e desenvolver uma liderança responsável pela condução da equipe." | Considerar: "Fortalecer o papel do líder e ampliar sua capacidade de exercer a gestão da equipe." |
| 2 | **Obrigatório:** "Estruturar metas claras de vendas e desempenho para a equipe." | Considerar: "Aprimorar a comunicação e o acompanhamento das metas." |
| 3 | **Obrigatório:** "Implantar uma rotina de acompanhamento dos resultados e indicadores." | Considerar: "Dar consistência e frequência ao acompanhamento dos resultados." |
| 4 | **Não** entra automaticamente no top 3. Só se os fundamentos estiverem estruturados: "Avaliar estratégias de reconhecimento e incentivo vinculadas aos resultados." A ausência de remuneração variável, sozinha, **não** caracteriza baixa maturidade. | *(não definido no PDF; protótipo aplica a mesma restrição do C)* |
| 5 | Incluir, respeitando a hierarquia: "Implantar uma rotina de feedback e desenvolvimento individual." | "Dar maior consistência ao processo de feedback." |
| 6 | "Definir e comunicar claramente as responsabilidades de cada função." | "Aprimorar a distribuição e clareza das responsabilidades." |
| 7 | **Obrigatório considerar:** "Estruturar a delegação e reduzir a centralização da gestão." | "Evoluir a delegação para ampliar a responsabilização da equipe." |
| 8 | "Desenvolver autonomia da equipe para decisões e situações rotineiras." Se Q7 também for C → **um único gargalo** (centralização + baixa autonomia). | *(não definido no PDF; protótipo usa "Ampliar a autonomia dos colaboradores dentro de suas responsabilidades.")* |
| 9 | Identificar baixo engajamento, mas **analisar as causas** antes de virar prioridade. Nunca recomendar só "aumentar o engajamento": apontar a dimensão estrutural (metas, acompanhamento, feedback, clareza, delegação). | *(não definido no PDF; protótipo aplica a mesma lógica do C)* |
| 10 | "Estruturar o acompanhamento e desenvolvimento de colaboradores com desempenho abaixo do esperado." | "Dar continuidade e acompanhamento às ações de desenvolvimento." |
| 11 | "Estruturar uma rotina de gestão para tornar a liderança mais preventiva e menos reativa." | "Dar consistência às rotinas de liderança já existentes." |
| 12 | Identificar excesso operacional: "Criar condições para ampliar o tempo dedicado à liderança e ao desenvolvimento da equipe." Se Q1 = B → correlacionar: **o acúmulo operacional está limitando o exercício da liderança.** | *(não definido no PDF; protótipo usa "Equilibrar as responsabilidades operacionais e de liderança.")* |

---

## 4. Níveis do score

| Faixa | Nível | Significado |
|---|---|---|
| 25–39 | 🔴 **Liderança Informal** | A liderança ainda depende principalmente da presença, experiência e intervenção direta do gestor. Existem poucos processos estruturados e o funcionamento da equipe tende a depender de pessoas específicas. |
| 40–54 | 🟡 **Liderança Técnica** | Já existem práticas importantes de gestão, porém elas ainda acontecem de maneira pouco sistematizada ou dependem bastante da atuação direta do líder. O próximo estágio exige transformar boas iniciativas em processos consistentes. |
| 55–66 | 🔵 **Liderança Avançada** | A liderança já possui processos definidos para direcionar, acompanhar e desenvolver a equipe. O desafio passa a ser aumentar consistência, autonomia e capacidade de desenvolvimento das pessoas. |
| 67–75 | 🟢 **Liderança Evolutiva** | A liderança funciona de maneira estruturada, com direção, acompanhamento, desenvolvimento e autonomia. O líder consegue atuar menos como solucionador de problemas cotidianos e mais como responsável pela evolução das pessoas e dos resultados. |

---

## 5. Regras para gerar o diagnóstico

- **A pontuação define o nível. As respostas individuais definem os gargalos e as prioridades.** O diagnóstico nunca sai só da nota total.
- A devolutiva tem estes blocos:
  1. **Nível atual:** o nível e uma breve explicação do que ele significa.
  2. **Leitura individualizada:** cruza as respostas, o maior desafio informado, os pontos fortes e as fragilidades. Precisa mostrar que interpretou o conjunto, e não que só calculou uma nota.
  3. **Três prioridades:** no máximo três, ordenadas por impacto (pontuação, peso, condicionais e correlação entre respostas).
  4. **Próximo passo (CTA):** ⚠️ *o PDF diz "quatro blocos", mas lista só três. O protótipo usa um CTA como 4º bloco. Confirmar com a Cinthya.*

### Os quatro limites da redação
1. No máximo **três** prioridades.
2. **Agrupar** gargalos relacionados em uma única prioridade.
3. Priorizar **causas estruturais**, não sintomas.
4. Dizer **o que** desenvolver, sem passo a passo, ferramentas, modelos, frequência detalhada ou instruções de implementação.

As frases de orientação (seção 7) são **alternativas de redação**. Não precisam ser reproduzidas ao pé da letra.

---

## 6. Hierarquia das prioridades

Quando há vários gargalos ao mesmo tempo, vem primeiro o que sustenta o sistema de liderança:

| Ordem | Dimensão | Classe |
|:-:|---|---|
| 1 | Liderança definida | **Crítica** (peso 3) |
| 2 | Metas | **Crítica** |
| 3 | Acompanhamento | **Crítica** |
| 4 | Delegação | **Crítica** |
| 5 | Feedback | Estrutural (peso 2) |
| 6 | Clareza de responsabilidades | Estrutural |
| 7 | Autonomia | Estrutural |
| 8 | Gestão de desempenho | Estrutural |
| 9 | Rotinas de liderança | Estrutural |
| 10 | Remuneração variável | Complementar (peso 1) |
| 11 | Engajamento | Complementar |
| 12 | Tempo estratégico | Complementar |

### Agrupamentos explícitos do PDF
| Combinação | Vira uma prioridade sobre |
|---|---|
| Delegação C + Autonomia C | descentralização / autonomia |
| Líder B + Tempo estratégico C | fortalecimento do papel de liderança e redução da absorção operacional |
| Metas C + Acompanhamento C | estruturação da gestão por metas e resultados *(libera espaço para uma 3ª prioridade diferente)* |
| Feedback C + Gestão de desempenho C | desenvolvimento e acompanhamento individual da equipe |

### Como o protótipo interpretou "ordenar por impacto"
> Interpretação da 3ADS, validar com a Cinthya.

- **Impacto** de cada gargalo = pontos perdidos em relação à alternativa A = `(3 − pontos da alternativa) × peso`.
  C em peso 3 = 6 · C em peso 2 = 4 · B em peso 3 = 3 · C em peso 1 = 2 · B em peso 2 = 2 · B em peso 1 = 1.
- Em caso de empate, vale a hierarquia acima.
- Percorrendo os gargalos nessa ordem, cada um tenta primeiro formar um agrupamento com outro gargalo ainda livre. Os explícitos têm precedência, depois vêm as orientações combinadas. Se não houver agrupamento, entra a condicional da questão.
- **Q1 = C nunca é agrupada.** Sem líder definido, a prioridade é justamente defini-lo. Agrupamentos com "Liderança" só valem quando Q1 = B.
- **Engajamento** é sintoma: quando fraco, é anexado à prioridade da sua causa (metas + acompanhamento → "gestão de resultados que dê direção e aumente o envolvimento"; metas → "direcionamento e conexão com os resultados"; feedback → "proximidade da liderança"). Só vira prioridade própria quando não há causa estrutural fraca.
- **Remuneração variável** só entra se as 4 dimensões críticas forem A e nenhuma estrutural for C.
- Com menos de 3 gargalos (perfil maduro), o motor completa com **prioridades evolutivas** ligadas a dimensões fortes, para não inventar problema.
- Validado em todas as 531.441 combinações possíveis de resposta: sempre de 1 a 3 prioridades, sem repetição, e todo C em questão de peso 3 aparece nas prioridades.

---

## 7. Banco de orientações (alternativas de redação)

**Liderança e papel do líder**
- Definir claramente quem é responsável pela liderança da equipe.
- Fortalecer o papel do líder na condução e desenvolvimento da equipe.
- Desenvolver a liderança responsável pela condução da equipe.
- Reduzir a dependência do proprietário na gestão cotidiana da equipe.
- Ampliar a atuação do líder na gestão de pessoas e resultados.
- Equilibrar as responsabilidades operacionais e de liderança.
- Ampliar o tempo dedicado à liderança e ao desenvolvimento da equipe.
- Reduzir a sobrecarga operacional que limita a atuação do líder.

**Metas e direcionamento**
- Estruturar metas claras de vendas e desempenho para a equipe.
- Dar maior clareza aos resultados esperados de cada colaborador.
- Melhorar a comunicação das metas para toda a equipe.
- Transformar as metas da farmácia em direcionadores para a atuação da equipe.
- Aprimorar o desdobramento das metas para os colaboradores.
- Fortalecer a orientação da equipe para resultados.

**Acompanhamento de resultados**
- Estruturar uma rotina de acompanhamento de metas e indicadores.
- Dar consistência ao acompanhamento dos resultados da equipe.
- Aumentar a frequência de acompanhamento dos principais indicadores.
- Fortalecer a gestão baseada em resultados e indicadores.
- Tornar o acompanhamento de resultados mais sistemático e menos reativo.
- Aproximar o acompanhamento da equipe dos resultados esperados.

**Feedback**
- Implantar uma rotina consistente de feedback individual.
- Dar maior frequência e consistência aos feedbacks.
- Fortalecer o feedback como ferramenta de desenvolvimento da equipe.
- Ampliar o acompanhamento individual do desempenho dos colaboradores.
- Transformar feedbacks pontuais em uma prática contínua de liderança.

**Responsabilidades e organização da equipe**
- Definir com clareza as responsabilidades de cada função.
- Melhorar a distribuição das responsabilidades entre os membros da equipe.
- Reduzir dúvidas e sobreposições nas responsabilidades da equipe.
- Fortalecer a responsabilização individual pelas atividades e resultados.
- Dar maior clareza sobre o que se espera de cada colaborador.
- Organizar melhor a distribuição das responsabilidades operacionais.

**Delegação**
- Estruturar a delegação de responsabilidades.
- Reduzir a centralização das decisões e tarefas no gestor.
- Ampliar gradualmente a delegação para a equipe.
- Fortalecer a responsabilização dos colaboradores pelas atividades delegadas.
- Evoluir de uma gestão centralizadora para uma liderança mais distribuída.
- Ampliar a capacidade da equipe de assumir responsabilidades.

**Autonomia**
- Desenvolver maior autonomia da equipe nas decisões rotineiras.
- Reduzir a dependência constante da presença do gestor.
- Fortalecer a capacidade da equipe de resolver situações do dia a dia.
- Ampliar a autonomia dos colaboradores dentro de suas responsabilidades.
- Criar maior independência da operação em relação ao gestor.
- Desenvolver uma equipe capaz de atuar com mais segurança e autonomia.

**Engajamento**
- Fortalecer o envolvimento da equipe com metas e resultados.
- Aumentar a participação da equipe na busca pelos resultados.
- Desenvolver maior iniciativa e comprometimento com o desempenho da farmácia.
- Reduzir a dependência de cobrança constante para geração de resultados.
- Fortalecer a conexão da equipe com os objetivos da farmácia.
- Desenvolver uma cultura de maior responsabilização pelos resultados.

**Gestão de desempenho**
- Estruturar o acompanhamento dos colaboradores com desempenho abaixo do esperado.
- Dar continuidade às ações de desenvolvimento após os feedbacks.
- Fortalecer o acompanhamento individual da evolução dos colaboradores.
- Tornar a gestão do desempenho mais preventiva e menos corretiva.
- Desenvolver maior consistência no acompanhamento da performance individual.
- Fortalecer a atuação do líder no desenvolvimento de colaboradores com baixo desempenho.

**Rotinas de liderança**
- Estruturar uma rotina de gestão para o líder.
- Dar maior consistência às rotinas de liderança já existentes.
- Transformar atividades pontuais de gestão em práticas recorrentes.
- Tornar a liderança mais preventiva e menos reativa.
- Fortalecer a disciplina de acompanhamento da equipe.
- Organizar as principais rotinas de gestão de pessoas e resultados.

**Reconhecimento, campanhas e remuneração variável**
- Avaliar estratégias de reconhecimento vinculadas aos resultados.
- Estruturar melhor as campanhas e premiações já realizadas.
- Dar maior clareza aos critérios de reconhecimento e premiação.
- Fortalecer a relação entre desempenho, reconhecimento e resultado.
- Evoluir as iniciativas pontuais de incentivo para uma estratégia mais estruturada.

> Regra: a ausência de remuneração variável, isoladamente, não deve aparecer entre as três prioridades se existirem gargalos estruturais mais relevantes.

### Orientações combinadas

| Combinação | Frases |
|---|---|
| Metas + acompanhamento | Estruturar a gestão por metas, indicadores e acompanhamento de resultados. · Fortalecer o direcionamento e acompanhamento da equipe para resultados. |
| Feedback + gestão de desempenho | Estruturar o acompanhamento e desenvolvimento individual da equipe. · Fortalecer a gestão de desempenho por meio de acompanhamento contínuo dos colaboradores. |
| Delegação + autonomia | Reduzir a centralização e ampliar a autonomia da equipe. · Desenvolver delegação, responsabilização e autonomia dos colaboradores. |
| Liderança definida + tempo estratégico | Fortalecer o papel do líder e ampliar sua atuação na gestão da equipe. · Reduzir a absorção operacional para fortalecer a atuação da liderança. |
| Liderança + delegação + autonomia | Desenvolver uma estrutura de liderança menos dependente da atuação direta do gestor. · Fortalecer a liderança e reduzir a dependência da equipe em relação ao gestor. |
| Responsabilidades + delegação | Clarificar responsabilidades e fortalecer a delegação dentro da equipe. · Organizar a distribuição de responsabilidades e ampliar a responsabilização dos colaboradores. |
| Metas + engajamento | Fortalecer o direcionamento da equipe e sua conexão com os resultados esperados. · Dar maior clareza às metas para aumentar o envolvimento da equipe com os resultados. |
| Metas + acompanhamento + engajamento | Estruturar uma gestão de resultados que dê direção e aumente o envolvimento da equipe. |
| Rotinas + acompanhamento | Estruturar uma rotina de liderança orientada ao acompanhamento dos resultados. · Dar consistência às rotinas de gestão e acompanhamento da equipe. |
| Feedback + engajamento | Fortalecer a proximidade da liderança com a equipe por meio do acompanhamento do desempenho. |
| Responsabilidades + autonomia | Dar clareza às responsabilidades para ampliar a autonomia da equipe. |
| Liderança + rotinas | Fortalecer o papel do líder por meio de uma atuação de gestão mais estruturada e consistente. |
| Liderança + metas + acompanhamento | Estruturar a atuação da liderança com maior foco em direção, metas e acompanhamento dos resultados. |
| Delegação + tempo operacional | Reduzir a centralização para liberar o líder para atividades de gestão e desenvolvimento da equipe. |

### Orientações para resultados mais maduros
Para quem marcou predominantemente A, as prioridades assumem caráter de evolução, para não inventar problema:
- Aprimorar os processos de liderança já implantados.
- Aumentar a consistência das práticas de gestão existentes.
- Ampliar ainda mais a autonomia e responsabilização da equipe.
- Evoluir o desenvolvimento individual dos colaboradores.
- Refinar o acompanhamento de metas e indicadores.
- Fortalecer a formação de novas lideranças dentro da equipe.
- Consolidar as práticas de liderança para reduzir a dependência de pessoas específicas.
- Elevar o nível de maturidade da gestão por meio do desenvolvimento contínuo da equipe.
- Fortalecer uma cultura de responsabilização, autonomia e resultados.
- Consolidar a atuação estratégica do líder.

---

## 8. Exemplo de entrega (do PDF)

> **Seu nível atual é Liderança Técnica.**
>
> Você já possui elementos importantes de gestão, mas seu resultado indica que a liderança ainda depende bastante da atuação direta do gestor. Seu maior potencial de evolução está na estruturação das metas e do acompanhamento dos resultados. Ao mesmo tempo, a baixa autonomia identificada indica que parte das decisões ainda retorna para a liderança, aumentando a dependência e a carga operacional.
>
> **Suas três prioridades agora são:**
> 1. Estruturar a gestão por metas e resultados.
> 2. Desenvolver delegação e autonomia da equipe.
> 3. Dar consistência às rotinas de liderança.

---

## 9. Pontos em aberto (validar com a Cinthya)

1. **4º bloco da devolutiva:** o PDF cita quatro blocos e lista três. Proposta: CTA de próximo passo.
2. **Destino do CTA:** WhatsApp da equipe, página de mentoria ou agenda? (hoje é um placeholder em `config.cta.url`).
3. **Condicionais B que faltam** para Q4, Q8, Q9 e Q12. O protótipo usa frases do banco de orientações (ver seção 3).
4. **Faixas de "quantidade de colaboradores"** (proposta: 1–5, 6–10, 11–20, 21–50, 50+).
5. **Fórmula de "impacto"** usada para ordenar as prioridades (seção 6).
6. **Textos de apoio da leitura** (trechos "forte / parcial / frágil" de cada dimensão, em `config.dimensoes`): redação da 3ADS.
7. **Política de privacidade (LGPD):** o formulário tem checkbox de consentimento, mas falta o link da política.
8. **Ordem das alternativas:** hoje A (mais madura) aparece sempre primeiro. Avaliar se vale embaralhar para reduzir o viés de resposta.
