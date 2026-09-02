// ============================================================
//  Tela · Painel
//
//  A primeira coisa que se vê. Responde a uma pergunta só: o que
//  vem aí que eu não posso deixar passar?
//
//  Abaixo do alerta, o que se consulta no dia a dia — atalhos,
//  a semana de aula e as monitorias.
// ============================================================

import { TURMA } from "../dados/turma.js";
import { MATERIA_POR_ID } from "../dados/materias.js";
import { limpo, pega, classes, delega } from "../nucleo/dom.js";
import { nota } from "../nucleo/nota.js";
import { tintaDe, nomeDe } from "../nucleo/paleta.js";
import { EVENTOS, valeNota } from "../nucleo/eventos.js";
import { selo, etiqueta } from "../nucleo/pecas.js";
import {
  hoje, isoDeHoje, leData, distanciaEmDias, MESES, SEMANA_CURTA,
} from "../nucleo/datas.js";

// ============================================================
//  1. Alerta — "não deixe passar"
// ============================================================

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
//  2. Atalhos
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
//  3. Semana de aula
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
//  4. Monitorias
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
// seria trabalho perdido.
delega("click", "[data-copia]", async (botao) => {
  const email = botao.dataset.copia;
  try {
    await navigator.clipboard.writeText(email);
    nota("E-mail copiado");
  } catch {
    // Sem permissão de área de transferência (acontece em file://):
    // o endereço continua à vista e clicável ao lado do botão.
    nota("Não deu para copiar — toque no endereço ao lado", "atencao");
  }
});

// ============================================================

export function monta() {
  montaAlerta();
  montaAtalhos();
  montaSemana();
  montaMonitorias();
}

/** O que precisa ser refeito quando o dia vira. */
export function refazPorData() {
  montaAlerta();
  montaSemana();
}
