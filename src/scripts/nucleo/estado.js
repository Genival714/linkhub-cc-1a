// ============================================================
//  Núcleo · Estado da agenda
//
//  Mês em foco, modo de leitura, filtros por matéria e o dia
//  aberto. Quem muda o estado chama `ajusta`; quem desenha se
//  inscreve em `aoMudar` e não precisa saber quem mexeu.
//
//  As preferências ficam no localStorage: quem só acompanha duas
//  matérias não deveria remarcar os filtros a cada visita.
// ============================================================

import { MATERIAS } from "../dados/materias.js";
import { hoje } from "./datas.js";
import { valeNota } from "./eventos.js";

const CHAVE = "linkhub:preferencias";

export const IDS_MATERIA = [...MATERIAS.map((m) => m.id), "inst"];

const inicial = () => {
  const agora = hoje();
  return {
    // O semestre começa em agosto; se hoje cair em 2026, abre no
    // mês corrente em vez de mandar a pessoa navegar até ele.
    mes: agora.getFullYear() === 2026 ? agora.getMonth() : 7,
    ano: 2026,
    // Em tela estreita a lista lê melhor que a malha de 7 colunas.
    modo: window.matchMedia("(max-width: 640px)").matches ? "lista" : "malha",
    filtros: new Set(IDS_MATERIA),
    soAvaliacoes: false,
    diaAberto: null,
  };
};

export const estado = inicial();

const ouvintes = new Set();

/** Registra um desenhador. Devolve a função que o desinscreve. */
export function aoMudar(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

/**
 * Aplica mudanças e avisa quem desenha.
 * `guarda: false` pula a gravação — útil para o dia aberto, que é
 * navegação passageira e não preferência.
 */
export function ajusta(mudancas, { guarda = true } = {}) {
  Object.assign(estado, mudancas);
  if (guarda) grava();
  ouvintes.forEach((fn) => fn());
}

// ── Persistência ────────────────────────────────────────────

function grava() {
  try {
    localStorage.setItem(
      CHAVE,
      JSON.stringify({
        filtros: [...estado.filtros],
        soAvaliacoes: estado.soAvaliacoes,
        modo: estado.modo,
      }),
    );
  } catch {
    /* modo privado ou armazenamento bloqueado — segue sem guardar */
  }
}

export function recupera() {
  let bruto;
  try {
    bruto = localStorage.getItem(CHAVE);
  } catch {
    return;
  }
  if (!bruto) return;

  try {
    const salvo = JSON.parse(bruto);

    // Ignora ids que não existem mais: uma matéria pode sair da
    // grade entre um semestre e outro.
    if (Array.isArray(salvo.filtros)) {
      const validos = salvo.filtros.filter((id) => IDS_MATERIA.includes(id));
      if (validos.length) estado.filtros = new Set(validos);
    }
    if (typeof salvo.soAvaliacoes === "boolean") {
      estado.soAvaliacoes = salvo.soAvaliacoes;
    }
    if (salvo.modo === "malha" || salvo.modo === "lista") {
      estado.modo = salvo.modo;
    }
  } catch {
    /* dado corrompido — segue com o padrão */
  }
}

// ── Filtro ──────────────────────────────────────────────────

/** Um evento passa pelos filtros ativos? */
export const visivel = (evento) =>
  estado.filtros.has(evento.disc) &&
  (!estado.soAvaliacoes || valeNota(evento));
