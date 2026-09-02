// ============================================================
//  Núcleo · Catálogo de eventos
//
//  Junta o cronograma das matérias com o calendário acadêmico
//  numa lista só, ordenada, mais um índice por data para a malha
//  do calendário não varrer o array a cada célula.
// ============================================================

import { CRONOGRAMA } from "../dados/cronograma.js";
import { INSTITUCIONAL } from "../dados/institucional.js";
import { siglaDe } from "./paleta.js";

// ── Tipos de evento ─────────────────────────────────────────
export const SIMBOLO_TIPO = {
  aula: "📖",
  atividade: "✍️",
  prova: "📝",
  av: "🎯",
  entrega: "📤",
  apresentacao: "🎤",
  projeto: "🚀",
  evento: "📌",
  feriado: "🌴",
  prazo: "⏳",
  janela: "🗓️",
  extra: "🎓",
};

export const NOME_TIPO = {
  aula: "Aula",
  atividade: "Atividade avaliativa",
  prova: "Prova",
  av: "Avaliação",
  entrega: "Entrega",
  apresentacao: "Apresentação",
  projeto: "Projeto",
  evento: "Evento",
  feriado: "Feriado",
  prazo: "Prazo",
  janela: "Período",
  extra: "Extra-classe",
};

// Só estes valem nota. São eles que alimentam o alerta da tela
// inicial e o filtro "só avaliações" — aula comum não aparece.
const QUE_VALEM_NOTA = new Set([
  "atividade", "prova", "av", "entrega", "apresentacao", "projeto",
]);

export const valeNota = (evento) => QUE_VALEM_NOTA.has(evento.tipo);

// ── A lista completa ────────────────────────────────────────
// Ordenada por data; empates desempatam pela sigla, para que a
// ordem dentro de um dia seja estável entre renderizações.
export const EVENTOS = [...CRONOGRAMA, ...INSTITUCIONAL].sort(
  (a, b) =>
    a.data.localeCompare(b.data) ||
    siglaDe(a.disc).localeCompare(siglaDe(b.disc)),
);

// ── Índice data → eventos ───────────────────────────────────
export const EVENTOS_DO_DIA = EVENTOS.reduce((mapa, evento) => {
  (mapa[evento.data] ||= []).push(evento);
  return mapa;
}, {});
