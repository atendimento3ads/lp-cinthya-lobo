/* =========================================================
   Score de Liderança — motor de regras (sem DOM)

   Implementa, de forma determinística, as regras do PDF:
   pontuação, nível, condicionais, hierarquia, agrupamentos,
   engajamento como sintoma, restrição da remuneração variável
   e prioridades evolutivas para perfis maduros.

   No protótipo ele também redige a leitura individualizada.
   Na versão com IA, a sugestão é manter este motor escolhendo
   nível e prioridades (auditável) e deixar a IA só redigir
   o texto a partir de montarPayload().

   Funciona no navegador (window.ScoreMotor) e no Node
   (module.exports), para permitir testes.
   ========================================================= */

(function (root) {
  'use strict';

  var MAX_PRIORIDADES = 3;

  function calcular(cfg, respostas) {
    var pts = cfg.pontuacao.alternativas;
    var regras = [];
    var dims = {};

    // ---------- 1. Pontuação por dimensão ----------
    var score = 0;
    cfg.questoes.forEach(function (q) {
      var alt = respostas[q.n];
      if (!pts[alt]) throw new Error('Questão ' + q.n + ' sem resposta válida');
      var pontos = pts[alt] * q.peso;
      score += pontos;
      dims[q.dimensao] = {
        chave: q.dimensao,
        questao: q.n,
        alt: alt,
        peso: q.peso,
        pontos: pontos,
        // pontos perdidos em relação à alternativa A = impacto do gargalo
        impacto: (pts.A - pts[alt]) * q.peso,
        hierarquia: cfg.dimensoes[q.dimensao].hierarquia,
        classe: cfg.dimensoes[q.dimensao].classe,
        condicional: q.condicional[alt] || null
      };
    });

    var nivel = cfg.niveis.filter(function (n) { return score >= n.min && score <= n.max; })[0];

    function fraca(k) { return dims[k].alt !== 'A'; }
    function porImpacto(a, b) {
      return dims[b].impacto - dims[a].impacto || dims[a].hierarquia - dims[b].hierarquia;
    }

    // ---------- 2. Gargalos candidatos ----------
    // Engajamento (sintoma) e remuneração (complementar restrita) têm tratamento próprio.
    var candidatos = Object.keys(dims)
      .filter(function (k) { return fraca(k) && k !== 'engajamento' && k !== 'remuneracao'; })
      .sort(porImpacto);

    var cobertas = {};
    var prioridades = [];

    function agrupamentoValido(g) {
      return g.dimensoes.every(function (d) {
        if (!fraca(d) || cobertas[d]) return false;
        return !(g.requer && g.requer[d] && dims[d].alt !== g.requer[d]);
      });
    }

    for (var i = 0; i < candidatos.length && prioridades.length < MAX_PRIORIDADES; i++) {
      var k = candidatos[i];
      if (cobertas[k]) continue;

      var grupo = cfg.agrupamentos.filter(function (g) {
        return g.dimensoes.indexOf(k) !== -1 && agrupamentoValido(g);
      })[0];

      if (grupo) {
        grupo.dimensoes.forEach(function (d) { cobertas[d] = true; });
        prioridades.push({
          texto: grupo.prioridade,
          dimensoes: grupo.dimensoes.slice(),
          tipo: 'agrupamento',
          origem: 'Agrupamento ' + grupo.id + ' (' + grupo.dimensoes.map(rotulo).join(' + ') + ')'
        });
        regras.push('Agrupou ' + grupo.dimensoes.map(rotulo).join(' + ') + ' em uma única prioridade.');
      } else {
        cobertas[k] = true;
        prioridades.push({
          texto: dims[k].condicional.prioridade,
          dimensoes: [k],
          tipo: dims[k].condicional.tipo,
          origem: 'Condicional ' + rotulo(k)
        });
      }
    }

    candidatos.forEach(function (k) {
      if (!cobertas[k]) regras.push(rotulo(k) + ' ficou fora das 3 prioridades (hierarquia/impacto menor).');
    });

    // ---------- 3. Engajamento = sintoma ----------
    var causasEngajamento = [];
    if (fraca('engajamento')) {
      causasEngajamento = cfg.causas_engajamento.filter(fraca);
      if (causasEngajamento.length) {
        var anexado = false;
        cfg.agrupamentos_engajamento.forEach(function (ge) {
          if (anexado) return;
          prioridades.forEach(function (p) {
            if (anexado || !mesmoConjunto(p.dimensoes, ge.base)) return;
            p.texto = ge.prioridade;
            p.dimensoes.push('engajamento');
            p.origem = 'Agrupamento ' + ge.id;
            anexado = true;
            regras.push('Engajamento baixo tratado como sintoma e anexado a ' + ge.base.map(rotulo).join(' + ') + '.');
          });
        });
        if (!anexado) {
          var alvo = prioridades.filter(function (p) {
            return p.dimensoes.some(function (d) { return causasEngajamento.indexOf(d) !== -1; });
          })[0];
          if (alvo) {
            alvo.dimensoes.push('engajamento');
            regras.push('Engajamento baixo associado à prioridade "' + alvo.texto + '" (causa estrutural).');
          } else {
            regras.push('Engajamento baixo citado na leitura; causas estruturais estão fora do top 3.');
          }
        }
      } else if (prioridades.length < MAX_PRIORIDADES) {
        prioridades.push({
          texto: dims.engajamento.condicional.prioridade,
          dimensoes: ['engajamento'],
          tipo: 'sintoma',
          origem: 'Condicional Engajamento (sem causa estrutural identificável)'
        });
      }
      cobertas.engajamento = true;
    }

    // ---------- 4. Remuneração variável (restrita) ----------
    if (fraca('remuneracao')) {
      var fundamentosOk = Object.keys(dims).every(function (k) {
        var c = dims[k].classe;
        if (c === 'critica') return dims[k].alt === 'A';
        if (c === 'estrutural') return dims[k].alt !== 'C';
        return true;
      });
      if (fundamentosOk && prioridades.length < MAX_PRIORIDADES) {
        prioridades.push({
          texto: dims.remuneracao.condicional.prioridade,
          dimensoes: ['remuneracao'],
          tipo: 'complementar',
          origem: 'Condicional Remuneração (fundamentos estruturados)'
        });
        cobertas.remuneracao = true;
      } else {
        regras.push('Remuneração variável não entrou nas prioridades: há gargalos estruturais mais relevantes.');
      }
    }

    // ---------- 5. Perfil maduro: completar com prioridades evolutivas ----------
    if (prioridades.length < MAX_PRIORIDADES) {
      var usadas = {};
      cfg.orientacoes_evolucao.forEach(function (o) {
        if (prioridades.length >= MAX_PRIORIDADES || usadas[o.texto]) return;
        var faz_sentido = o.relacionadas.every(function (d) { return !fraca(d); });
        if (!faz_sentido) return;
        usadas[o.texto] = true;
        prioridades.push({
          texto: o.texto,
          dimensoes: o.relacionadas.slice(),
          tipo: 'evolucao',
          origem: 'Orientação evolutiva (perfil maduro)'
        });
      });
      regras.push('Menos de 3 gargalos: prioridades completadas com orientações de evolução.');
    }

    function rotulo(k) { return cfg.dimensoes[k].nome; }

    return {
      score: score,
      minimo: cfg.pontuacao.minimo,
      maximo: cfg.pontuacao.maximo,
      nivel: nivel,
      dimensoes: dims,
      prioridades: prioridades,
      causasEngajamento: causasEngajamento,
      regras: regras
    };
  }

  // ---------- Leitura individualizada (texto do protótipo) ----------
  function redigirLeitura(cfg, r, desafio) {
    var d = r.dimensoes;
    var D = cfg.dimensoes;
    var ordem = Object.keys(d).sort(function (a, b) { return d[a].hierarquia - d[b].hierarquia; });
    var paragrafos = [];

    var fortes = ordem.filter(function (k) { return d[k].alt === 'A' && k !== 'remuneracao'; }).slice(0, 3);
    var frageis = ordem.filter(function (k) { return d[k].alt === 'C'; })
      .sort(function (a, b) { return d[b].impacto - d[a].impacto || d[a].hierarquia - d[b].hierarquia; })
      .slice(0, 3);
    var parciais = ordem.filter(function (k) { return d[k].alt === 'B'; })
      .sort(function (a, b) { return d[b].impacto - d[a].impacto || d[a].hierarquia - d[b].hierarquia; })
      .slice(0, 3 - Math.min(frageis.length, 2));

    // Pontos fortes
    if (fortes.length) {
      paragrafos.push('Sua liderança já tem bases importantes: ' + lista(fortes.map(function (k) { return D[k].forte; })) + '.');
    } else if (ordem.filter(function (k) { return d[k].alt === 'C'; }).length >= 6) {
      paragrafos.push('Hoje, a condução da equipe ainda acontece sem práticas de gestão estruturadas. O funcionamento da farmácia depende muito de quem está presente no dia.');
    } else {
      paragrafos.push('Várias práticas de gestão já existem na sua farmácia, mas ainda acontecem de forma pontual e dependem bastante da atuação direta do líder.');
    }

    // Fragilidades
    var trechos = frageis.map(function (k) { return D[k].fragil; })
      .concat(parciais.map(function (k) { return D[k].parcial; }));
    if (trechos.length) {
      paragrafos.push((fortes.length ? 'Por outro lado, ' : 'Suas respostas mostram que ') + lista(trechos) + '.');
    }

    // Correlações previstas no PDF
    var corr = [];
    if (d.lideranca.alt === 'B' && d.tempo.alt !== 'A') {
      corr.push('O acúmulo operacional está limitando o exercício da liderança: o líder existe, mas a operação consome o tempo que deveria ir para a gestão da equipe.');
    }
    if (d.delegacao.alt === 'C' && d.autonomia.alt === 'C') {
      corr.push('Centralização e baixa autonomia aparecem juntas e são o mesmo gargalo visto de dois lados: as decisões ficam no gestor e, por isso, a equipe não desenvolve segurança para decidir sozinha.');
    }
    if (d.metas.alt === 'C' && d.acompanhamento.alt === 'C') {
      corr.push('Sem metas estruturadas e sem acompanhamento, a equipe trabalha sem uma referência clara do que é um bom resultado.');
    }
    if (d.engajamento.alt !== 'A' && r.causasEngajamento.length) {
      corr.push('O engajamento da equipe aparece como ponto de atenção, mas ele é consequência, não causa. Suas respostas indicam ligação com ' +
        lista(r.causasEngajamento.slice(0, 3).map(function (k) { return D[k].nome.toLowerCase(); })) + '.');
    }
    if (d.remuneracao.alt === 'C' && r.prioridades.every(function (p) { return p.dimensoes.indexOf('remuneracao') === -1; }) && trechos.length) {
      corr.push('A ausência de remuneração variável, sozinha, não é o que limita sua liderança hoje: há fundamentos anteriores a estruturar.');
    }
    if (corr.length) paragrafos.push(corr.slice(0, 3).join(' '));

    // Maior desafio informado
    var txt = (desafio || '').trim();
    if (txt) {
      var citado = txt.length > 140 ? txt.slice(0, 137).trim() + '…' : txt;
      var k = dimensaoDoDesafio(cfg, txt, d);
      var foco = r.prioridades[0] && r.prioridades[0].tipo !== 'evolucao'
        // engajamento (sintoma) e remuneração (complementar) não são apontados como causa do desafio
        ? r.prioridades[0].dimensoes.filter(function (x) { return x !== 'engajamento' && x !== 'remuneracao'; }).map(function (x) { return D[x].nome.toLowerCase(); })
        : [];
      var frase = 'Você apontou como maior desafio: “' + citado + '”. ';
      if (k && d[k].alt !== 'A') {
        var nasPrioridades = r.prioridades.some(function (p) { return p.dimensoes.indexOf(k) !== -1; });
        frase += nasPrioridades
          ? 'Esse desafio aparece nas suas respostas e se conecta diretamente com ' + D[k].nome.toLowerCase() + ', que está entre as suas prioridades.'
          : 'Ele se relaciona com ' + D[k].nome.toLowerCase() + ', mas suas respostas mostram fundamentos anteriores que sustentam essa melhora. Por isso, eles vêm primeiro.';
      } else if (k && foco.length) {
        frase += 'Suas respostas indicam que ' + D[k].forte + '; o desafio tende a estar mais ligado a questões de ' + lista(foco) + '.';
      } else if (foco.length) {
        frase += 'Cruzando esse relato com suas respostas, o ponto de maior impacto hoje está em ' + lista(foco) + '.';
      } else {
        frase += 'Como a base de gestão já está estruturada, esse desafio tende a ser resolvido pela evolução das práticas que você já tem.';
      }
      paragrafos.push(frase);
    }

    return { paragrafos: paragrafos, fortes: fortes, frageis: frageis, parciais: parciais };
  }

  // Dimensão citada no desafio: prefere as que estão fracas nas respostas,
  // depois mais palavras encontradas, depois a hierarquia.
  function dimensaoDoDesafio(cfg, texto, dims) {
    var t = semAcento(texto.toLowerCase());
    var achadas = Object.keys(cfg.palavras_desafio).map(function (k) {
      var n = cfg.palavras_desafio[k].filter(function (p) { return t.indexOf(p) !== -1; }).length;
      return { k: k, n: n, fraca: dims[k].alt !== 'A' ? 1 : 0 };
    }).filter(function (x) { return x.n > 0; });
    achadas.sort(function (a, b) {
      return b.fraca - a.fraca || b.n - a.n || cfg.dimensoes[a.k].hierarquia - cfg.dimensoes[b.k].hierarquia;
    });
    return achadas.length ? achadas[0].k : null;
  }

  // ---------- Contrato de dados para CRM / IA ----------
  function montarPayload(cfg, respostas, lead, r) {
    return {
      versao_config: cfg.versao,
      gerado_em: new Date().toISOString(),
      lead: lead,
      score: { total: r.score, minimo: r.minimo, maximo: r.maximo, nivel: r.nivel.nome, nivel_id: r.nivel.id },
      respostas: cfg.questoes.map(function (q) {
        var alt = respostas[q.n];
        return {
          questao: q.n,
          dimensao: q.dimensao,
          peso: q.peso,
          alternativa: alt,
          pontos: r.dimensoes[q.dimensao].pontos,
          pergunta: q.pergunta,
          resposta: q.alternativas[alt]
        };
      }),
      prioridades_motor: r.prioridades.map(function (p) {
        return { texto: p.texto, dimensoes: p.dimensoes, tipo: p.tipo };
      }),
      regras_aplicadas: r.regras
    };
  }

  // ---------- utilitários ----------
  function lista(itens) {
    if (itens.length <= 1) return itens.join('');
    // itens com vírgula interna pedem ponto e vírgula para não embaralhar a leitura
    var sep = itens.some(function (i) { return i.indexOf(',') !== -1; }) ? '; ' : ', ';
    return itens.slice(0, -1).join(sep) + (sep === '; ' ? '; e ' : ' e ') + itens[itens.length - 1];
  }
  function mesmoConjunto(a, b) {
    return a.length === b.length && b.every(function (x) { return a.indexOf(x) !== -1; });
  }
  function semAcento(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  var api = { calcular: calcular, redigirLeitura: redigirLeitura, montarPayload: montarPayload };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ScoreMotor = api;
})(typeof window !== 'undefined' ? window : this);
