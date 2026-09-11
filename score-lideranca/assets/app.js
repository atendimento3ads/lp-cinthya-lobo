/* =========================================================
   Score de Liderança — fluxo da interface
   landing → 12 perguntas → captura do lead → resultado

   Pontos de integração futuros estão marcados com [INTEGRAÇÃO].
   ========================================================= */

(function () {
  'use strict';

  var CFG = window.SCORE_DIAGNOSTICO;
  var M = window.ScoreMotor;
  var CHAVE_LEADS = 'score-lideranca:leads';

  var estado = { respostas: {}, atual: 0 };
  var $ = function (sel) { return document.querySelector(sel); };

  // ---------- Rastreamento [INTEGRAÇÃO: GTM / Meta Pixel / GA4] ----------
  // Por enquanto só empilha no dataLayer; o GTM lê daqui quando for instalado.
  function track(evento, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: evento }, params || {}));
  }

  // ---------- Navegação entre telas ----------
  function mostrar(nome) {
    document.querySelectorAll('.tela').forEach(function (t) { t.hidden = t.dataset.tela !== nome; });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // ---------- Landing ----------
  function renderNiveis() {
    $('#listaNiveis').innerHTML = CFG.niveis.map(function (n) {
      return '<article class="nivel-card" style="--c:' + n.cor + '">' +
        '<span class="faixa">' + n.min + ' a ' + n.max + ' pontos</span>' +
        '<h3>' + n.nome + '</h3><p>' + n.descricao + '</p></article>';
    }).join('');
  }

  // ---------- Questionário ----------
  function iniciar() {
    estado = { respostas: {}, atual: 0 };
    track('score_inicio');
    mostrar('quiz');
    renderPergunta();
  }

  function renderPergunta() {
    var q = CFG.questoes[estado.atual];
    var total = CFG.questoes.length;
    var card = $('#quizCard');
    card.classList.remove('troca'); void card.offsetWidth; card.classList.add('troca');

    $('#quizContador').textContent = 'Pergunta ' + (estado.atual + 1) + ' de ' + total;
    $('#quizBarra').style.width = (estado.atual / total * 100) + '%';
    $('#quizProgresso').setAttribute('aria-valuenow', estado.atual);
    $('#quizDimensao').textContent = CFG.dimensoes[q.dimensao].nome;
    $('#quizPergunta').textContent = q.pergunta;
    $('#quizApoio').hidden = !q.apoio;
    $('#quizApoio').textContent = q.apoio || '';

    var marcada = estado.respostas[q.n];
    $('#quizOpcoes').innerHTML = ['A', 'B', 'C'].map(function (alt, i) {
      return '<button type="button" class="opcao" role="radio" data-alt="' + alt + '" aria-checked="' + (marcada === alt) + '">' +
        '<span class="marca">' + (i + 1) + '</span><span>' + q.alternativas[alt] + '</span></button>';
    }).join('');
    $('#quizPergunta').focus({ preventScroll: true });
  }

  var avancando = false;
  function escolher(alt) {
    if (avancando) return;
    var q = CFG.questoes[estado.atual];
    estado.respostas[q.n] = alt;
    document.querySelectorAll('.opcao').forEach(function (b) { b.setAttribute('aria-checked', b.dataset.alt === alt); });
    track('score_resposta', { questao: q.n, dimensao: q.dimensao, alternativa: alt });

    avancando = true;
    setTimeout(function () {
      avancando = false;
      if (estado.atual < CFG.questoes.length - 1) {
        estado.atual++;
        renderPergunta();
      } else {
        $('#quizBarra').style.width = '100%';
        track('score_questionario_concluido');
        mostrar('lead');
        $('#f-nome').focus({ preventScroll: true });
      }
    }, 320);
  }

  function voltar() {
    if (estado.atual === 0) { mostrar('intro'); return; }
    estado.atual--;
    renderPergunta();
  }

  // ---------- Captura do lead ----------
  function preencherFaixas() {
    $('#f-colaboradores').insertAdjacentHTML('beforeend', CFG.lead.faixas_colaboradores.map(function (f) {
      return '<option>' + f + '</option>';
    }).join(''));
  }

  function mascaraWhats(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var validadores = {
    nome: function (v) { return v.trim().length >= 2 || 'Informe seu nome.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Informe um e-mail válido.'; },
    whatsapp: function (v) { return v.replace(/\D/g, '').length >= 10 || 'Informe um WhatsApp com DDD.'; },
    empresa: function (v) { return v.trim().length >= 2 || 'Informe o nome da farmácia ou empresa.'; },
    colaboradores: function (v) { return !!v || 'Selecione a quantidade de colaboradores.'; },
    desafio: function (v) { return v.trim().length >= 5 || 'Conte, em poucas palavras, o seu maior desafio.'; }
  };

  function validar(form) {
    var ok = true, primeiro = null;
    Object.keys(validadores).forEach(function (nome) {
      var el = form.elements[nome];
      var res = validadores[nome](el.value);
      var campo = el.closest('.campo');
      campo.classList.toggle('invalido', res !== true);
      campo.querySelector('.erro').textContent = res === true ? '' : res;
      if (res !== true) { ok = false; primeiro = primeiro || el; }
    });
    var consent = form.elements.consentimento;
    form.querySelector('.erro-consent').textContent = consent.checked ? '' : 'É preciso concordar para receber o diagnóstico.';
    if (!consent.checked) { ok = false; primeiro = primeiro || consent; }
    if (primeiro) primeiro.focus();
    return ok;
  }

  function enviarLead(e) {
    e.preventDefault();
    var form = e.target;
    if (!validar(form)) return;
    var lead = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      whatsapp: form.elements.whatsapp.value.trim(),
      empresa: form.elements.empresa.value.trim(),
      colaboradores: form.elements.colaboradores.value,
      desafio: form.elements.desafio.value.trim()
    };
    concluir(lead);
  }

  function concluir(lead) {
    var r = M.calcular(CFG, estado.respostas);
    var leitura = M.redigirLeitura(CFG, r, lead.desafio);
    var payload = M.montarPayload(CFG, estado.respostas, lead, r);

    // [INTEGRAÇÃO] Aqui entra o envio para o CRM/webhook e a chamada à IA
    // que redige a leitura. No protótipo, o payload fica só no navegador.
    salvarLocal(payload);
    track('score_lead_enviado', { score: r.score, nivel: r.nivel.id, colaboradores: lead.colaboradores });

    renderResultado(r, leitura, lead, payload);
    mostrar('resultado');
    animarScore(r);
    track('score_resultado_visto', { score: r.score, nivel: r.nivel.id });
  }

  function salvarLocal(payload) {
    try {
      var lista = JSON.parse(localStorage.getItem(CHAVE_LEADS) || '[]');
      lista.push(payload);
      localStorage.setItem(CHAVE_LEADS, JSON.stringify(lista));
    } catch (err) { /* navegador sem storage: segue sem salvar */ }
  }

  // ---------- Resultado ----------
  function renderResultado(r, leitura, lead, payload) {
    var tela = $('#tela-resultado');
    tela.style.setProperty('--nivel', r.nivel.cor);
    tela.style.setProperty('--nivel-claro', r.nivel.cor_destaque);

    var primeiroNome = lead.nome.split(/\s+/)[0];
    $('#resSaudacao').textContent = primeiroNome + ', este é o seu resultado';
    $('#resNivel').textContent = r.nivel.nome;
    $('#resNivelDesc').textContent = r.nivel.descricao;
    $('#resScore').textContent = r.minimo;

    var total = r.maximo - r.minimo + 1;
    $('#resEscala').innerHTML = CFG.niveis.map(function (n) {
      return '<span style="--c:' + n.cor + '; flex:' + (n.max - n.min + 1) + '"></span>';
    }).join('') + '<i class="escala-marker" style="left:0%"></i>';
    $('#resLegenda').innerHTML = CFG.niveis.map(function (n) {
      return '<span style="flex:' + (n.max - n.min + 1) + '">' + n.nome.replace('Liderança ', '') + '</span>';
    }).join('');
    tela.dataset.marcador = ((r.score - r.minimo + 0.5) / total * 100).toFixed(2);

    $('#resLeitura').innerHTML = leitura.paragrafos.map(function (p) {
      var cls = p.indexOf('Você apontou como maior desafio') === 0 ? ' class="desafio"' : '';
      return '<p' + cls + '>' + esc(p) + '</p>';
    }).join('');

    $('#resPrioridades').innerHTML = r.prioridades.map(function (p) {
      return '<li>' + esc(p.texto) + '</li>';
    }).join('');

    var cta = CFG.cta;
    $('#ctaTitulo').textContent = cta.titulo;
    $('#ctaTexto').textContent = cta.texto;
    var botao = $('#ctaBotao');
    botao.innerHTML = esc(cta.botao) + ' <span aria-hidden="true">→</span>';
    botao.href = cta.url;
    botao.title = cta.url === '#' ? 'Destino a definir' : '';

    renderPainel(r, payload);
  }

  function animarScore(r) {
    var el = $('#resScore');
    var marker = document.querySelector('#resEscala .escala-marker');
    var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var destino = $('#tela-resultado').dataset.marcador + '%';
    if (reduzido) { el.textContent = r.score; marker.style.left = destino; return; }
    requestAnimationFrame(function () { marker.style.left = destino; });
    var inicio = null, de = r.minimo, ate = r.score, dur = 1400;
    function passo(t) {
      if (!inicio) inicio = t;
      var k = Math.min((t - inicio) / dur, 1);
      el.textContent = Math.round(de + (ate - de) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    // garante o valor final mesmo se a aba estiver em segundo plano (rAF pausado)
    setTimeout(function () { el.textContent = r.score; marker.style.left = destino; }, dur + 300);
  }

  function renderPainel(r, payload) {
    var linhas = CFG.questoes.map(function (q) {
      var d = r.dimensoes[q.dimensao];
      return '<tr class="alt-' + d.alt + '"><td>Q' + q.n + '</td><td>' + CFG.dimensoes[q.dimensao].nome +
        '</td><td class="num">' + q.peso + '</td><td>' + d.alt + '</td><td class="num">' + d.pontos +
        '</td><td class="num">' + (d.impacto ? '−' + d.impacto : '—') + '</td></tr>';
    }).join('');
    $('#painelTabela').innerHTML =
      '<thead><tr><th>Questão</th><th>Dimensão</th><th class="num">Peso</th><th>Resp.</th><th class="num">Pontos</th><th class="num">Impacto</th></tr></thead>' +
      '<tbody>' + linhas + '<tr><td></td><td><strong>Total</strong></td><td></td><td></td><td class="num"><strong>' + r.score + '</strong></td><td></td></tr></tbody>';

    var regras = r.prioridades.map(function (p, i) { return 'Prioridade ' + (i + 1) + ' ← ' + p.origem; }).concat(r.regras);
    $('#painelRegras').innerHTML = regras.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    $('#painelPayload').textContent = JSON.stringify(payload, null, 2);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- Barra de teste (?teste=1) ----------
  // Atalhos para a equipe validar cenários com a Cinthya sem responder tudo.
  function barraTeste() {
    if (!/[?&]teste=1\b/.test(location.search)) return;
    var cenarios = {
      'Aleatório': null,
      'Tudo A': 'AAAAAAAAAAAA',
      'Tudo B': 'BBBBBBBBBBBB',
      'Tudo C': 'CCCCCCCCCCCC',
      'Exemplo PDF': 'ACCBBBBCBBBB',
      'Líder B + tempo C': 'BAABAAAAAABC'
    };
    function rodar(s) {
      estado.respostas = {};
      CFG.questoes.forEach(function (q, i) {
        estado.respostas[q.n] = s ? s[i] : 'ABC'[Math.floor(Math.random() * 3)];
      });
      concluir({
        nome: 'Teste Protótipo', email: 'teste@exemplo.com', whatsapp: '(11) 90000-0000',
        empresa: 'Farmácia Teste', colaboradores: '11 a 20',
        desafio: 'A equipe depende de mim para tudo e não bate as metas'
      });
    }
    var barra = document.createElement('div');
    barra.className = 'barra-teste';
    Object.keys(cenarios).forEach(function (nome) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = nome;
      b.addEventListener('click', function () { rodar(cenarios[nome]); });
      barra.appendChild(b);
    });
    document.body.appendChild(barra);

    // Links diretos: ?teste=1&respostas=ACCBBBBCBBBB  ou  ?teste=1&tela=quiz|lead
    var p = new URLSearchParams(location.search);
    if (/^[ABC]{12}$/.test(p.get('respostas') || '')) rodar(p.get('respostas'));
    else if (p.get('tela') === 'quiz') iniciar();
    else if (p.get('tela') === 'lead') mostrar('lead');
  }

  // ---------- Eventos ----------
  document.addEventListener('click', function (e) {
    var alvo = e.target.closest('[data-acao], .opcao, #ctaBotao');
    if (!alvo) return;
    if (alvo.classList.contains('opcao')) { escolher(alvo.dataset.alt); return; }
    if (alvo.id === 'ctaBotao') {
      track('score_cta_clique');
      if (alvo.getAttribute('href') === '#') e.preventDefault();
      return;
    }
    var acao = alvo.dataset.acao;
    if (acao === 'iniciar' || acao === 'refazer') iniciar();
    else if (acao === 'voltar') voltar();
    else if (acao === 'revisar') { estado.atual = CFG.questoes.length - 1; mostrar('quiz'); renderPergunta(); }
  });

  document.addEventListener('keydown', function (e) {
    if ($('#tela-quiz').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    var mapa = { '1': 'A', '2': 'B', '3': 'C' };
    if (mapa[e.key]) escolher(mapa[e.key]);
    else if (e.key === 'Backspace' || e.key === 'ArrowLeft') voltar();
  });

  $('#formLead').addEventListener('submit', enviarLead);
  $('#f-whatsapp').addEventListener('input', function (e) { e.target.value = mascaraWhats(e.target.value); });
  $('#formLead').addEventListener('input', function (e) {
    var campo = e.target.closest('.campo');
    if (campo && campo.classList.contains('invalido')) {
      var res = validadores[e.target.name] ? validadores[e.target.name](e.target.value) : true;
      if (res === true) { campo.classList.remove('invalido'); campo.querySelector('.erro').textContent = ''; }
    }
  });

  renderNiveis();
  preencherFaixas();
  barraTeste();
  track('score_landing_vista');
})();
