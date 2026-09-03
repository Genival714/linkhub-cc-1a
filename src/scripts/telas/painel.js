// ============================================================
//  Tela · Painel
//
//  A primeira coisa que se vê. Responde a duas perguntas, nesta
//  ordem: o que eu preciso fazer agora, e o que vem aí que eu não
//  posso deixar passar?
//
//  Abaixo disso, o que se consulta no dia a dia — atalhos, a
//  semana de aula e as monitorias.
// ============================================================

import { TURMA } from "../dados/turma.js";
import { MATERIA_POR_ID } from "../dados/materias.js";
import { AVISOS } from "../dados/avisos.js";
import { limpo, pega, classes, delega } from "../nucleo/dom.js";
import { nota } from "../nucleo/nota.js";
import { tintaDe, nomeDe } from "../nucleo/paleta.js";
import { EVENTOS, valeNota } from "../nucleo/eventos.js";
import { selo, etiqueta } from "../nucleo/pecas.js";
import { marcadas, marca, limpaAntigas } from "../nucleo/conferencia.js";
import {
  hoje, isoDeHoje, leData, distanciaEmDias, MESES, SEMANA_CURTA,
} from "../nucleo/datas.js";

// ============================================================
//  1. Peças compartilhadas
//
//  O aviso e o alerta falam da mesma coisa — a distância até uma
//  data — e precisam falar igual. Estas peças ficam aqui em cima
//  para que uma mudança de linguagem valha para os dois.
// ============================================================

const COPIA = `
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="7.5" y="7.5" width="9" height="9" rx="2"/>
    <path d="M12.5 4.5h-8a2 2 0 00-2 2v8"/>
  </svg>`;

const CHEVRON = `
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 8l5 5 5-5"/>
  </svg>`;

// A urgência é dita por escrito e reforçada pela régua de
// proximidade. A versão anterior usava uma escada de emojis de
// expressão facial; o problema é que emoji de humor não informa
// nada — "😳" não diz se falta um dia ou cinco, e some para quem
// usa leitor de tela.
function grauDe(dias) {
  if (dias <= 0) return "hoje";
  if (dias <= 2) return "iminente";
  if (dias <= 7) return "proximo";
  return "adiante";
}

function comoFalarDoPrazo(dias) {
  if (dias <= 0) return "É hoje";
  if (dias === 1) return "É amanhã";
  return `Faltam ${dias} dias`;
}

/**
 * Régua de proximidade: enche conforme a data se aproxima. Dá a
 * escala num relance, sem precisar comparar números entre cards.
 */
function regua(dias, janela) {
  const cheio = Math.round(Math.max(0, Math.min(1, 1 - dias / janela)) * 100);
  return `
    <div class="alerta-regua" role="presentation">
      <span class="alerta-regua-cheio" style="inline-size:${cheio}%"></span>
    </div>`;
}

// ============================================================
//  2. Avisos — o que precisa ser feito agora
//
//  Um recado com prazo e regras de formato. O alerta logo abaixo
//  diz QUANDO é a entrega; o aviso diz COMO entregar sem tomar
//  zero por causa do nome do arquivo.
//
//  A seção inteira some quando não há aviso válido: o Painel
//  volta a começar por "Não deixe passar", como antes.
// ============================================================

// Três níveis, porque as consequências são três e misturá-las
// esconde a que mais dói: uma coisa é a questão não pontuar,
// outra é a lista inteira ser zerada.
const SIMBOLO_NIVEL = { faca: "✅", zera: "⛔", perde: "⚠️" };
const NOME_NIVEL = {
  faca:  "Faça assim",
  zera:  "Zera a atividade",
  perde: "Não pontua",
};
const ORDEM_NIVEL = ["faca", "zera", "perde"];

// Copiar o nome exigido é o atalho que mais evita zero: o formato
// é literal e um espaço a mais já invalida a entrega.
function blocoDoArquivo(aviso) {
  if (!aviso.arquivo) return "";
  const nome = limpo(aviso.arquivo);

  return `
    <div class="aviso-arquivo">
      <p class="aviso-arquivo-rotulo">Nome do arquivo — exatamente assim</p>
      <div class="aviso-arquivo-linha">
        <code class="aviso-arquivo-nome">${nome}</code>
        <button class="aviso-copia" type="button"
                data-copia="${nome}" data-copia-rotulo="Nome do arquivo"
                aria-label="Copiar o nome do arquivo"
                title="Copiar o nome do arquivo">${COPIA}</button>
      </div>
      ${aviso.arquivoNota ? `<p class="aviso-arquivo-nota">${limpo(aviso.arquivoNota)}</p>` : ""}
    </div>`;
}

// As marcações vêm do aparelho a cada desenho, então redesenhar o
// Painel na virada do dia não apaga o que a pessoa já conferiu.
function checklistDe(aviso) {
  if (!aviso.conferir?.length) return "";

  const jaFeitas = marcadas(aviso.id);
  const feitos = aviso.conferir.filter((i) => jaFeitas.has(i.id)).length;

  const itens = aviso.conferir
    .map((item) => {
      const feito = jaFeitas.has(item.id);
      return `
        <li>
          <label class="${classes("confere-item", feito && "confere-item--feito")}">
            <input type="checkbox" ${feito ? "checked" : ""}
                   data-confere="${limpo(aviso.id)}" data-item="${limpo(item.id)}">
            <span class="confere-texto">${limpo(item.texto)}</span>
          </label>
        </li>`;
    })
    .join("");

  return `
    <div class="confere-caixa">
      <h4 class="aviso-bloco-titulo">
        Antes de enviar, confira
        <span class="aviso-placar" data-placar aria-live="polite"
          >${feitos} de ${aviso.conferir.length}</span>
      </h4>
      <ul class="confere">${itens}</ul>
    </div>`;
}

function regrasDe(aviso) {
  if (!aviso.regras?.length) return "";

  return ORDEM_NIVEL.map((nivel) => {
    const doNivel = aviso.regras.filter((r) => r.nivel === nivel);
    if (!doNivel.length) return "";

    return `
      <section class="aviso-nivel" data-nivel="${nivel}">
        <h4 class="aviso-nivel-titulo">
          <span aria-hidden="true">${SIMBOLO_NIVEL[nivel]}</span>${NOME_NIVEL[nivel]}
        </h4>
        <ul class="aviso-regras">
          ${doNivel.map((r) => `<li>${limpo(r.texto)}</li>`).join("")}
        </ul>
      </section>`;
  }).join("");
}

// O link do Classroom sai de materias.js — cadastrar o endereço
// duas vezes é convite para as duas cópias divergirem.
function acoesDoAviso(aviso) {
  const materia = MATERIA_POR_ID[aviso.disc];
  const botoes = [];

  if (materia?.classroom) {
    botoes.push(
      `<a class="ficha-acao" href="${limpo(materia.classroom)}" target="_blank" rel="noopener">Abrir no Classroom</a>`,
    );
  }

  (aviso.ajuda || []).forEach((link) => {
    botoes.push(
      `<a class="ficha-acao" href="${limpo(link.endereco)}" target="_blank" rel="noopener">${limpo(link.titulo)}</a>`,
    );
  });

  if (!botoes.length) return "";

  return `
    <footer class="aviso-acoes">
      <div class="aviso-botoes">${botoes.join("")}</div>
      ${materia?.classroom ? '<p class="aviso-nota">O Classroom só abre na conta <strong>@cesar.school</strong>.</p>' : ""}
      ${aviso.dica ? `<p class="aviso-nota">${limpo(aviso.dica)}</p>` : ""}
    </footer>`;
}

function cartaoDeAviso(aviso, janela) {
  const data = leData(aviso.prazo);
  const dias = distanciaEmDias(data, hoje());

  // Com a entrega longe, a gaveta fechada mantém o Painel legível.
  // Na semana da entrega ela abre: a essa altura as regras deixam
  // de ser consulta e viram o próprio recado.
  const aberta = dias <= 7;

  return `
    <article class="aviso" data-grau="${grauDe(dias)}" style="${tintaDe(aviso.disc)}">
      <header class="aviso-cabeca">
        <div class="aviso-topo">${selo(aviso.disc)}${etiqueta(aviso.tipo)}</div>
        <span class="aviso-contagem">${comoFalarDoPrazo(dias)}</span>
      </header>

      <h3 class="aviso-titulo">${limpo(aviso.titulo)}</h3>
      <p class="aviso-quando">
        ${aviso.hora ? `<strong>Até ${limpo(aviso.hora)}</strong> · ` : ""}${SEMANA_CURTA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}
      </p>
      ${aviso.resumo ? `<p class="aviso-resumo">${limpo(aviso.resumo)}</p>` : ""}
      ${regua(dias, janela)}

      ${blocoDoArquivo(aviso)}

      <details class="aviso-gaveta"${aberta ? " open" : ""}>
        <summary class="aviso-aba">
          <span class="aviso-aba-texto">Como entregar sem perder ponto</span>
          <span class="aviso-seta">${CHEVRON}</span>
        </summary>

        <div class="aviso-miolo">
          ${checklistDe(aviso)}
          ${regrasDe(aviso)}
          ${aviso.duvidas ? `<p class="aviso-duvidas">${limpo(aviso.duvidas)}</p>` : ""}
        </div>
      </details>

      ${acoesDoAviso(aviso)}
    </article>`;
}

export function montaAvisos() {
  const secao = pega("#secao-avisos");
  const caixa = pega("#avisos-lista");

  // O celular pode estar com um index.html antigo em cache e já ter
  // recebido este módulo novo: o service worker atualiza os arquivos
  // um a um, então HTML e JavaScript podem ficar fora de passo por uma
  // abertura. Sem esta saída, a seção que ainda não existe no HTML
  // derruba o Painel inteiro e, junto com ele, a navegação do site.
  if (!secao || !caixa) return;

  // Vence sozinho: fica o dia inteiro do prazo e some no seguinte.
  const ativos = AVISOS.filter((a) => a.prazo >= isoDeHoje()).sort((a, b) =>
    a.prazo.localeCompare(b.prazo),
  );

  // O que sobrou de aviso vencido não volta a aparecer — não tem
  // por que continuar ocupando o armazenamento do aparelho.
  limpaAntigas(ativos.map((a) => a.id));

  // Sem aviso válido a seção inteira sai, título e tudo. Um bloco
  // vazio dizendo "nenhum aviso" só empurraria o resto para baixo.
  secao.hidden = !ativos.length;
  caixa.innerHTML = ativos
    .map((a) => cartaoDeAviso(a, TURMA.aviso.janelaDias))
    .join("");
}

// Marcar uma caixa não redesenha a seção: isso fecharia a gaveta e
// tiraria o foco de onde o dedo está. Só o placar e a classe da
// linha mudam — o valor já foi para o armazenamento.
delega("change", "[data-confere]", (caixa) => {
  marca(caixa.dataset.confere, caixa.dataset.item, caixa.checked);

  caixa
    .closest(".confere-item")
    ?.classList.toggle("confere-item--feito", caixa.checked);

  const bloco = caixa.closest(".confere-caixa");
  const placar = bloco?.querySelector("[data-placar]");
  if (!placar) return;

  const todas = [...bloco.querySelectorAll("[data-confere]")];
  placar.textContent = `${todas.filter((c) => c.checked).length} de ${todas.length}`;
});

// ============================================================
//  3. Alerta — "não deixe passar"
// ============================================================

function cartaoDeAlerta(evento, posicao, janela) {
  const data = leData(evento.data);
  const dias = distanciaEmDias(data, hoje());
  const grau = grauDe(dias);
  const destaque = posicao === 0;

  const classe = classes("alerta", destaque && "alerta--destaque");

  return `
    <article class="${classe}" data-grau="${grau}" style="${tintaDe(evento.disc)}">
      <div class="alerta-prazo">
        <span class="alerta-dias">${dias <= 0 ? "hoje" : dias}</span>
        ${dias > 0 ? `<span class="alerta-unidade">${dias === 1 ? "dia" : "dias"}</span>` : ""}
      </div>
      <div class="alerta-corpo">
        <div class="alerta-topo">${selo(evento.disc)}${etiqueta(evento.tipo)}</div>
        <h3 class="alerta-titulo">${limpo(evento.titulo)}</h3>
        <p class="alerta-quando">
          <strong>${comoFalarDoPrazo(dias)}</strong>
          · ${SEMANA_CURTA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}
        </p>
        ${regua(dias, janela)}
        ${destaque && evento.obs ? `<p class="alerta-obs">${limpo(evento.obs)}</p>` : ""}
      </div>
    </article>`;
}

export function montaAlerta() {
  const caixa = pega("#alerta-lista");
  const { janelaDias, maximo } = TURMA.aviso;

  // Tudo que ainda vai acontecer, do mais próximo ao mais distante
  const adiante = EVENTOS.filter((ev) => valeNota(ev) && ev.data >= isoDeHoje());

  if (!adiante.length) {
    caixa.innerHTML = `
      <p class="alerta-vazio">
        Nenhuma avaliação futura no calendário. Semestre encerrado — aproveite.
      </p>`;
    return;
  }

  // Só o que cabe na janela entra nos cards. Sem esse corte, um
  // evento a 45 dias ocuparia o espaço e o alerta perderia a força.
  const naJanela = adiante.filter(
    (ev) => distanciaEmDias(leData(ev.data), hoje()) <= janelaDias,
  );
  const mostrados = naJanela.slice(0, maximo);

  // Período calmo: nada na janela, mas há coisa depois. Dizer qual
  // é a próxima data é mais útil que deixar um espaço vazio.
  if (!mostrados.length) {
    const seguinte = adiante[0];
    const dias = distanciaEmDias(leData(seguinte.data), hoje());
    caixa.innerHTML = `
      <p class="alerta-vazio">
        <strong>Nada nos próximos ${janelaDias} dias.</strong> Respire.
        <span class="alerta-vazio-depois">
          Depois disso vem ${selo(seguinte.disc)}
          <b>${limpo(seguinte.titulo)}</b>, em ${dias} dias.
        </span>
      </p>`;
    return;
  }

  let html = mostrados
    .map((ev, i) => cartaoDeAlerta(ev, i, janelaDias))
    .join("");

  // Quantas avaliações ficaram além da janela — para ninguém achar
  // que depois dessas o semestre acabou.
  const restantes = adiante.length - mostrados.length;
  if (restantes > 0) {
    html += `
      <button class="alerta-resto" data-ir="agenda-avaliacoes">
        +${restantes} ${restantes === 1 ? "avaliação" : "avaliações"} depois · ver na agenda
      </button>`;
  }

  caixa.innerHTML = html;
}

// ============================================================
//  4. Atalhos
// ============================================================

const SETA = `
  <svg class="atalho-seta" viewBox="0 0 20 20" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M7 4l6 6-6 6"/>
  </svg>`;

export function montaAtalhos() {
  pega("#atalhos-lista").innerHTML = TURMA.atalhos
    .map((item) => {
      const ehDocumento = item.formato === "documento";
      const miolo = `
        <span class="atalho-marca" aria-hidden="true">${limpo(item.simbolo)}</span>
        <span class="atalho-titulo">${limpo(item.titulo)}</span>
        ${ehDocumento ? '<span class="marcador">PDF</span>' : SETA}`;

      return ehDocumento
        ? `<button class="atalho" data-arquivo="${limpo(item.endereco)}"
             data-arquivo-titulo="${limpo(item.titulo)}"
             data-arquivo-simbolo="${limpo(item.simbolo)}">${miolo}</button>`
        : `<a class="atalho" href="${limpo(item.endereco)}" target="_blank" rel="noopener">${miolo}</a>`;
    })
    .join("");
}

// ============================================================
//  5. Semana de aula
// ============================================================

const CAMERA = `
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2 6.5A2.5 2.5 0 014.5 4h6A2.5 2.5 0 0113 6.5v7A2.5 2.5 0 0110.5 16h-6A2.5 2.5 0 012 13.5v-7zM14.5 8.2l3-2.1a.6.6 0 01.95.5v6.8a.6.6 0 01-.95.5l-3-2.1V8.2z"/>
  </svg>`;

// "A confirmar" nos dois campos faria o card repetir a mesma frase
// em horário e local. Este teste separa o que já está definido.
const pendente = (valor) => !valor || /^A (confirmar|definir)$/i.test(valor);

function blocoDeAula(bloco) {
  const faixa = pendente(bloco.de) ? "" : `${limpo(bloco.de)} – ${limpo(bloco.ate)}`;

  // Janela livre: vale mostrar, é quando dá para estudar. Fica
  // discreta para não competir com as aulas de verdade.
  if (bloco.vago) {
    return `
      <li class="bloco bloco--vago">
        ${faixa ? `<span class="bloco-faixa">${faixa}</span>` : ""}
        <span class="bloco-materia">Livre</span>
      </li>`;
  }

  const materia = MATERIA_POR_ID[bloco.materia];
  const local = pendente(bloco.local) ? "" : limpo(bloco.local);
  const rodape = local || (faixa ? "" : "Horário e sala a confirmar");

  return `
    <li class="bloco" style="${tintaDe(bloco.materia)}">
      ${faixa ? `<span class="bloco-faixa">${faixa}</span>` : ""}
      <span class="bloco-materia">${limpo(materia ? materia.nome : "—")}</span>
      ${rodape ? `<span class="bloco-local">${rodape}</span>` : ""}
    </li>`;
}

export function montaSemana() {
  // A semana é indexada pelo dia como o JavaScript conta, então o
  // "hoje" sai direto da data — sem conversão de índice pelo meio.
  const diaCorrente = hoje().getDay();

  pega("#semana-grade").innerHTML = Object.entries(TURMA.semana)
    .map(([numero, dia]) => {
      const ehHoje = Number(numero) === diaCorrente;

      const chamada = dia.chamada
        ? `<a class="semana-chamada" href="${limpo(dia.chamada)}" target="_blank" rel="noopener">
             ${CAMERA} Entrar na aula
           </a>`
        : "";

      return `
        <article class="${classes("semana-dia", ehHoje && "semana-dia--hoje")}">
          <header class="semana-cabeca">
            <h3 class="semana-titulo">${limpo(dia.titulo)}</h3>
            ${ehHoje ? '<span class="marcador marcador--vivo">hoje</span>' : ""}
            ${dia.selo ? `<span class="marcador"><span aria-hidden="true">${limpo(dia.selo.simbolo)}</span> ${limpo(dia.selo.texto)}</span>` : ""}
          </header>
          <ul class="semana-blocos">${dia.blocos.map(blocoDeAula).join("")}</ul>
          ${chamada}
        </article>`;
    })
    .join("");
}

// ============================================================
//  6. Monitorias
// ============================================================

// Primeira e última inicial: "João Pedro S. Menezes" → "JM". Nome de
// uma palavra só usa as duas primeiras letras, para o disco nunca
// ficar com um caractere solitário no meio.
function iniciaisDe(nome) {
  const partes = String(nome).trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

const MAX_PILHA = 4;   // discos na prévia da aba fechada

// Na lousa, o contato de Slack de alguém pode ser o próprio e-mail.
// Repetir o mesmo endereço duas vezes no cartão não informa nada.
const slackDe = (p) => (p.slack && p.slack !== p.email ? p.slack : "");

// A prévia é o que convence a abrir: fechada, a aba já mostra rostos
// e o número de gente disponível, em vez de uma linha de texto.
function pilhaDe(monitores) {
  // Um "+1" ocuparia o mesmo espaço do disco que ele esconde, então
  // uma pessoa a mais que o limite entra inteira na pilha.
  const cabe = monitores.length <= MAX_PILHA + 1 ? monitores.length : MAX_PILHA;
  const mostra = monitores.slice(0, cabe);
  const resto = monitores.length - mostra.length;

  const discos = mostra
    .map((p) => `<span class="equipe-face">${limpo(iniciaisDe(p.nome))}</span>`)
    .join("");

  const sobra = resto
    ? `<span class="equipe-face equipe-face--resto">+${resto}</span>`
    : "";

  return `<span class="equipe-pilha" aria-hidden="true">${discos}${sobra}</span>`;
}

function cartaoDeMonitor(p, i) {
  const email = limpo(p.email);
  const slack = slackDe(p);

  return `
    <li class="monitor" style="--i:${i}">
      <span class="monitor-face" aria-hidden="true">${limpo(iniciaisDe(p.nome))}</span>

      <div class="monitor-dados">
        <p class="monitor-nome">${limpo(p.nome)}</p>
        ${slack ? `<p class="monitor-slack">${limpo(slack)}</p>` : ""}
      </div>

      <div class="monitor-contato">
        <a class="monitor-mail" href="mailto:${email}">${email}</a>
        <button class="monitor-copia" type="button" data-copia="${email}"
                aria-label="Copiar o e-mail de ${limpo(p.nome)}"
                title="Copiar e-mail">${COPIA}</button>
      </div>
    </li>`;
}

// A lista nasce fechada: onze nomes abertos empurrariam o resto do
// Painel para fora da primeira tela. O campo é opcional — matéria sem
// monitor divulgado continua com o card de uma linha só.
function equipeDe(monitores) {
  if (!monitores?.length) return "";

  const quantos = monitores.length;
  const temSlack = monitores.some(slackDe);

  return `
    <details class="equipe">
      <summary class="equipe-aba">
        ${pilhaDe(monitores)}
        <span class="equipe-rotulo">
          <strong>${quantos} ${quantos === 1 ? "monitor" : "monitores"}</strong>
          <span>${temSlack ? "Slack e e-mail" : "E-mail"} · toque para ver</span>
        </span>
        <span class="equipe-seta">${CHEVRON}</span>
      </summary>

      <ul class="equipe-grade">${monitores.map(cartaoDeMonitor).join("")}</ul>
    </details>`;
}

export function montaMonitorias() {
  pega("#monitorias-lista").innerHTML = TURMA.monitorias
    .map((m) => {
      const semHorario = pendente(m.horario) || !m.dia;
      const quando = semHorario
        ? "Horário a confirmar"
        : `${limpo(m.dia)} · ${limpo(m.horario)}`;

      const onde = [m.local, m.sala].filter((v) => v && !pendente(v)).join(" · ");

      const acao = m.link
        ? `<a class="monitoria-acao" href="${limpo(m.link)}" target="_blank" rel="noopener">Entrar</a>`
        : `<span class="monitoria-acao monitoria-acao--inerte">${semHorario ? "A definir" : "Presencial"}</span>`;

      const equipe = equipeDe(m.monitores);

      return `
        <li class="${classes("monitoria", equipe && "monitoria--com-equipe")}"
            style="${tintaDe(m.materia)}">
          <div class="monitoria-topo">
            <span class="monitoria-pino" aria-hidden="true"></span>
            <div class="monitoria-corpo">
              <p class="monitoria-materia">${limpo(nomeDe(m.materia))}</p>
              <p class="monitoria-quando">${quando}${onde ? ` · ${limpo(onde)}` : ""}</p>
            </div>
            ${acao}
          </div>
          ${equipe}
        </li>`;
    })
    .join("");
}

// Um ouvinte só, no documento, para todos os botões de copiar — os
// cartões são refeitos a cada render e reconectar ouvintes um a um
// seria trabalho perdido. Serve tanto ao e-mail do monitor quanto
// ao nome de arquivo exigido num aviso; o rótulo diz qual é qual.
delega("click", "[data-copia]", async (botao) => {
  const texto = botao.dataset.copia;
  const rotulo = botao.dataset.copiaRotulo || "E-mail";
  try {
    await navigator.clipboard.writeText(texto);
    nota(`${rotulo} copiado`);
  } catch {
    // Sem permissão de área de transferência (acontece em file://):
    // o texto continua à vista e selecionável ao lado do botão.
    nota("Não deu para copiar — o texto está aí ao lado", "atencao");
  }
});

// ============================================================

export function monta() {
  montaAvisos();
  montaAlerta();
  montaAtalhos();
  montaSemana();
  montaMonitorias();
}

/** O que precisa ser refeito quando o dia vira. */
export function refazPorData() {
  montaAvisos();
  montaAlerta();
  montaSemana();
}
