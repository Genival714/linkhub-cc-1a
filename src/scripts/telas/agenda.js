// ============================================================
//  Tela · Agenda
//
//  Todos os eventos do semestre — os das matérias e os do
//  calendário acadêmico — em duas leituras:
//
//  malha  a grade do mês, boa para enxergar semanas cheias e vazias
//  lista  tudo em fila cronológica, que lê melhor em tela estreita
//
//  Os filtros por matéria e o "só avaliações" valem nas duas, e
//  ficam guardados entre visitas.
// ============================================================

import { MATERIAS } from "../dados/materias.js";
import { EXTRA_CLASSE } from "../dados/cronograma.js";
import { limpo, pega, classes } from "../nucleo/dom.js";
import { tintaDe } from "../nucleo/paleta.js";
import { EVENTOS, EVENTOS_DO_DIA, valeNota } from "../nucleo/eventos.js";
import { selo, linha } from "../nucleo/pecas.js";
import { estado, ajusta, visivel, IDS_MATERIA } from "../nucleo/estado.js";
import { nota } from "../nucleo/nota.js";
import {
  hoje, isoDeHoje, leData, maiuscula, MESES, SEMANA_CURTA, SEMANA_LONGA,
} from "../nucleo/datas.js";

// ── Filtros ─────────────────────────────────────────────────

export function montaFiltros() {
  const itens = [
    ...MATERIAS.map((m) => ({ id: m.id, rotulo: m.sigla, ajuda: m.nome })),
    { id: "inst", rotulo: "Geral", ajuda: "Calendário acadêmico institucional" },
  ];

  pega("#agenda-filtros").innerHTML = itens
    .map(
      (item) => `
      <button class="peneira" data-materia="${limpo(item.id)}" style="${tintaDe(item.id)}"
              aria-pressed="${estado.filtros.has(item.id)}" title="${limpo(item.ajuda)}">
        <span class="peneira-pino" aria-hidden="true"></span>${limpo(item.rotulo)}
      </button>`,
    )
    .join("");

  pega("#agenda-so-notas").setAttribute("aria-pressed", String(estado.soAvaliacoes));
}

function alternaMateria(id) {
  const filtros = new Set(estado.filtros);
  if (filtros.has(id)) {
    // Nunca deixa a turma sem nenhum filtro: a tela ficaria vazia
    // e ninguém entenderia por quê.
    if (filtros.size === 1) {
      nota("Deixe ao menos uma matéria visível", "atencao");
      return;
    }
    filtros.delete(id);
  } else {
    filtros.add(id);
  }
  ajusta({ filtros, diaAberto: null });
}

// ── Malha do mês ────────────────────────────────────────────

const MAX_PINOS = 4;

function montaMalha() {
  const { ano, mes } = estado;
  pega("#agenda-mes").textContent = `${maiuscula(MESES[mes])} de ${ano}`;

  let html = SEMANA_CURTA.map((d) => `<div class="malha-dow">${d}</div>`).join("");

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();

  // Células vazias antes do dia 1, para alinhar a primeira semana
  for (let i = 0; i < primeiroDia; i++) {
    html += '<div class="celula celula--fora" aria-hidden="true"></div>';
  }

  for (let dia = 1; dia <= total; dia++) {
    const iso = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const todos = EVENTOS_DO_DIA[iso] || [];
    const mostrados = todos.filter(visivel);
    const semana = new Date(ano, mes, dia).getDay();

    const classe = classes(
      "celula",
      iso === isoDeHoje() && "celula--hoje",
      iso === estado.diaAberto && "celula--aberta",
      todos.some((e) => e.tipo === "feriado") && "celula--feriado",
      (semana === 0 || semana === 6) && "celula--fds",
      !mostrados.length && "celula--calma",
    );

    const pinos = mostrados
      .slice(0, MAX_PINOS)
      .map(
        (e) =>
          `<span class="${classes("pino", valeNota(e) && "pino--nota")}" style="${tintaDe(e.disc)}"></span>`,
      )
      .join("");

    const excedente =
      mostrados.length > MAX_PINOS
        ? `<span class="celula-mais">+${mostrados.length - MAX_PINOS}</span>`
        : "";

    const descricao = mostrados.length
      ? `${dia} de ${MESES[mes]}, ${mostrados.length} evento${mostrados.length > 1 ? "s" : ""}`
      : `${dia} de ${MESES[mes]}, sem eventos`;

    html += `
      <div class="${classe}" role="gridcell" data-dia="${iso}"
           ${mostrados.length ? 'tabindex="0"' : ""} aria-label="${limpo(descricao)}">
        <span class="celula-numero">${dia}</span>
        <span class="celula-pinos">${pinos}${excedente}</span>
      </div>`;
  }

  pega("#agenda-malha").innerHTML = html;
}

// ── Dia aberto ──────────────────────────────────────────────

function montaDiaAberto() {
  const painel = pega("#agenda-dia");
  const iso = estado.diaAberto;

  if (!iso) {
    painel.hidden = true;
    painel.replaceChildren();
    return;
  }

  const eventos = (EVENTOS_DO_DIA[iso] || []).filter(visivel);
  if (!eventos.length) {
    painel.hidden = true;
    painel.replaceChildren();
    return;
  }

  const data = leData(iso);
  painel.innerHTML = `
    <header class="dia-cabeca">
      <h3 class="dia-titulo">
        ${SEMANA_LONGA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}
      </h3>
      <button class="dia-fechar" data-fecha-dia aria-label="Fechar os detalhes do dia">✕</button>
    </header>
    ${eventos.map(linha).join("")}`;
  painel.hidden = false;
}

function abreDia(iso) {
  const eventos = (EVENTOS_DO_DIA[iso] || []).filter(visivel);
  if (!eventos.length) return;
  ajusta({ diaAberto: iso }, { guarda: false });
  pega("#agenda-dia").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── Lista cronológica ───────────────────────────────────────

function montaLista() {
  const caixa = pega("#agenda-lista");
  const eventos = EVENTOS.filter(visivel);

  if (!eventos.length) {
    caixa.innerHTML = '<p class="agenda-vazia">Nenhum evento com os filtros de agora.</p>';
    return;
  }

  const porDia = eventos.reduce((mapa, ev) => {
    (mapa[ev.data] ||= []).push(ev);
    return mapa;
  }, {});

  let html = "";
  let mesEmCurso = "";

  Object.keys(porDia)
    .sort()
    .forEach((iso) => {
      const data = leData(iso);
      const chaveMes = `${data.getFullYear()}-${data.getMonth()}`;

      if (chaveMes !== mesEmCurso) {
        mesEmCurso = chaveMes;
        html += `<h3 class="lista-mes">${maiuscula(MESES[data.getMonth()])} de ${data.getFullYear()}</h3>`;
      }

      html += `
        <div class="${classes("lista-dia", iso === isoDeHoje() && "lista-dia--hoje")}">
          <div class="lista-data">
            <span class="lista-numero">${data.getDate()}</span>
            <span class="lista-dow">${SEMANA_CURTA[data.getDay()]}</span>
          </div>
          <div class="lista-eventos">${porDia[iso].map(linha).join("")}</div>
        </div>`;
    });

  caixa.innerHTML = html;
}

// ── Atividades sem data ─────────────────────────────────────

export function montaExtras() {
  pega("#extras-lista").innerHTML = EXTRA_CLASSE.map(
    (item) => `
      <li class="extra" style="${tintaDe(item.disc)}">
        <div class="extra-topo">${selo(item.disc)}</div>
        <p class="extra-titulo">${limpo(item.titulo)}</p>
        ${item.obs ? `<p class="extra-obs">${limpo(item.obs)}</p>` : ""}
      </li>`,
  ).join("");
}

// ── Orquestra o modo em uso ─────────────────────────────────

export function monta() {
  const ehMalha = estado.modo === "malha";

  pega("#agenda-navegacao").hidden = !ehMalha;
  pega("#agenda-malha-caixa").hidden = !ehMalha;
  pega("#agenda-lista").hidden = ehMalha;

  pega("#agenda-modo-malha").setAttribute("aria-pressed", String(ehMalha));
  pega("#agenda-modo-lista").setAttribute("aria-pressed", String(!ehMalha));

  if (ehMalha) {
    montaMalha();
    montaDiaAberto();
  } else {
    pega("#agenda-dia").hidden = true;
    montaLista();
  }
}

/** Abre a agenda já filtrada só nas avaliações de todas as matérias. */
export function mostraSoAvaliacoes() {
  ajusta({
    filtros: new Set(IDS_MATERIA),
    soAvaliacoes: true,
    diaAberto: null,
  });
  montaFiltros();
}

/** Abre a agenda filtrada numa matéria só. */
export function mostraMateria(id) {
  ajusta({ filtros: new Set([id]), soAvaliacoes: false, diaAberto: null });
  montaFiltros();
}

export function instala() {
  const raiz = pega("#tela-agenda");

  raiz.addEventListener("click", (ev) => {
    const peneira = ev.target.closest("[data-materia]");
    if (peneira) {
      alternaMateria(peneira.dataset.materia);
      montaFiltros();
      return;
    }

    const celula = ev.target.closest(".celula[data-dia]");
    if (celula) {
      // Clicar de novo no dia aberto fecha, como uma gaveta.
      if (celula.dataset.dia === estado.diaAberto) {
        ajusta({ diaAberto: null }, { guarda: false });
      } else {
        abreDia(celula.dataset.dia);
      }
      return;
    }

    if (ev.target.closest("[data-fecha-dia]")) {
      ajusta({ diaAberto: null }, { guarda: false });
    }
  });

  // Enter e espaço abrem o dia, como o clique
  raiz.addEventListener("keydown", (ev) => {
    const celula = ev.target.closest(".celula[data-dia]");
    if (!celula || (ev.key !== "Enter" && ev.key !== " ")) return;
    ev.preventDefault();
    abreDia(celula.dataset.dia);
  });

  pega("#agenda-anterior").addEventListener("click", () => {
    const mes = estado.mes - 1;
    ajusta(
      mes < 0 ? { mes: 11, ano: estado.ano - 1, diaAberto: null } : { mes, diaAberto: null },
      { guarda: false },
    );
  });

  pega("#agenda-proximo").addEventListener("click", () => {
    const mes = estado.mes + 1;
    ajusta(
      mes > 11 ? { mes: 0, ano: estado.ano + 1, diaAberto: null } : { mes, diaAberto: null },
      { guarda: false },
    );
  });

  pega("#agenda-hoje").addEventListener("click", () => {
    const agora = hoje();
    ajusta(
      { mes: agora.getMonth(), ano: agora.getFullYear(), diaAberto: isoDeHoje() },
      { guarda: false },
    );
  });

  pega("#agenda-modo-malha").addEventListener("click", () => {
    if (estado.modo !== "malha") ajusta({ modo: "malha" });
  });
  pega("#agenda-modo-lista").addEventListener("click", () => {
    if (estado.modo !== "lista") ajusta({ modo: "lista", diaAberto: null });
  });

  pega("#agenda-so-notas").addEventListener("click", () => {
    const soAvaliacoes = !estado.soAvaliacoes;
    ajusta({ soAvaliacoes, diaAberto: null });
    pega("#agenda-so-notas").setAttribute("aria-pressed", String(soAvaliacoes));
  });
}
