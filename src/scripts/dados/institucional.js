// ============================================================
//  CESAR School · Linkhub CC 1A · Calendário acadêmico 2026.2
//
//  Transcrito do "Calendário Acadêmico 2026.2 — ADM, Design e
//  CC" (última atualização 08/06/26). Vale para todas as
//  disciplinas, por isso fica aqui uma vez só em vez de se
//  repetir em cada matéria.
//
//  disc: "inst" marca evento institucional — recebe cor neutra
//  no calendário, feriado recebe vermelho.
// ============================================================

export const INSTITUCIONAL = [

  // ── Agosto ────────────────────────────────────────────────
  { data: "2026-08-03", disc: "inst", tipo: "evento",  titulo: "Início das aulas" },
  { data: "2026-08-14", disc: "inst", tipo: "evento",  titulo: "Lançamento do Edital de Monitoria" },
  { data: "2026-08-24", disc: "inst", tipo: "prazo",   titulo: "Fim do prazo de solicitação de dispensa de disciplinas" },
  { data: "2026-08-28", disc: "inst", tipo: "evento",  titulo: "Divulgação do resultado da Seleção de Monitores" },

  // ── Setembro ──────────────────────────────────────────────
  { data: "2026-09-03", disc: "inst", tipo: "prazo",   titulo: "Fim do prazo para trancamento de curso e alteração de matrícula" },
  { data: "2026-09-07", disc: "inst", tipo: "feriado", titulo: "Feriado — Independência" },
  { data: "2026-09-24", disc: "inst", tipo: "evento",  titulo: "Status Report 1", obs: "Os planos de SD, IC e FP1 marcam 24/09 (quinta). O Calendário Acadêmico traz 25/09 — confirme com a coordenação." },
  { data: "2026-09-30", disc: "inst", tipo: "janela",  titulo: "Início do período de avaliações (AV1)", obs: "A janela de AV1 vai de 30/09 a 06/10." },

  // ── Outubro ───────────────────────────────────────────────
  { data: "2026-10-06", disc: "inst", tipo: "janela",  titulo: "Fim do período de avaliações (AV1)" },
  { data: "2026-10-09", disc: "inst", tipo: "feriado", titulo: "Feriado — Antecipação do Dia dos Professores" },
  { data: "2026-10-12", disc: "inst", tipo: "feriado", titulo: "Feriado — Nossa Senhora Aparecida" },
  { data: "2026-10-14", disc: "inst", tipo: "evento",  titulo: "1º Conselho de Classe (Avaliação Global dos Discentes)" },
  { data: "2026-10-15", disc: "inst", tipo: "evento",  titulo: "1º Conselho de Classe (Avaliação Global dos Discentes)" },
  { data: "2026-10-16", disc: "inst", tipo: "evento",  titulo: "Notas da AV1 publicadas no Portal Acadêmico" },
  { data: "2026-10-31", disc: "inst", tipo: "evento",  titulo: "Imprensado" },

  // ── Novembro ──────────────────────────────────────────────
  { data: "2026-11-02", disc: "inst", tipo: "feriado", titulo: "Feriado — Dia de Finados" },
  { data: "2026-11-11", disc: "inst", tipo: "evento",  titulo: "Rec'n Play" },
  { data: "2026-11-12", disc: "inst", tipo: "evento",  titulo: "Rec'n Play" },
  { data: "2026-11-14", disc: "inst", tipo: "evento",  titulo: "Imprensado" },
  { data: "2026-11-15", disc: "inst", tipo: "feriado", titulo: "Feriado — Proclamação da República" },
  { data: "2026-11-20", disc: "inst", tipo: "feriado", titulo: "Feriado — Dia da Consciência Negra" },
  { data: "2026-11-27", disc: "inst", tipo: "janela",  titulo: "Início do período de avaliações (AV2)", obs: "A janela de AV2 vai de 27/11 a 03/12." },

  // ── Dezembro ──────────────────────────────────────────────
  { data: "2026-12-03", disc: "inst", tipo: "janela",  titulo: "Fim do período de avaliações (AV2)" },
  { data: "2026-12-04", disc: "inst", tipo: "evento",  titulo: "Dia CESAR (Expediente Administrativo)" },
  { data: "2026-12-07", disc: "inst", tipo: "evento",  titulo: "Imprensado" },
  { data: "2026-12-08", disc: "inst", tipo: "feriado", titulo: "Feriado — Nossa Senhora da Conceição" },
  { data: "2026-12-10", disc: "inst", tipo: "evento",  titulo: "2º Conselho de Classe (Avaliação Global dos Discentes)" },
  { data: "2026-12-11", disc: "inst", tipo: "evento",  titulo: "Status Report 2 · Último dia de aula" },
  { data: "2026-12-12", disc: "inst", tipo: "evento",  titulo: "Mostra TechDesign", obs: "Sábado. Divulgação dos trabalhos desenvolvidos pelos estudantes." },
  { data: "2026-12-14", disc: "inst", tipo: "evento",  titulo: "Notas da AV2 publicadas no Portal Acadêmico" },
  { data: "2026-12-14", disc: "inst", tipo: "janela",  titulo: "Início do período de Segunda Chamada", obs: "De 14/12 a 16/12." },
  { data: "2026-12-16", disc: "inst", tipo: "janela",  titulo: "Fim do período de Segunda Chamada" },
  { data: "2026-12-17", disc: "inst", tipo: "evento",  titulo: "Notas da Segunda Chamada publicadas no Portal Acadêmico" },
  { data: "2026-12-21", disc: "inst", tipo: "janela",  titulo: "Prova Final", obs: "21 e 22/12." },
  { data: "2026-12-22", disc: "inst", tipo: "janela",  titulo: "Prova Final" },
  { data: "2026-12-23", disc: "inst", tipo: "prazo",   titulo: "Prazo final para lançamento das notas das provas finais e encerramento do semestre" },
  { data: "2026-12-24", disc: "inst", tipo: "feriado", titulo: "Feriado — Véspera de Natal" },
  { data: "2026-12-25", disc: "inst", tipo: "feriado", titulo: "Feriado — Natal" },
  { data: "2026-12-30", disc: "inst", tipo: "evento",  titulo: "Encerramento do período letivo" },
  { data: "2026-12-31", disc: "inst", tipo: "feriado", titulo: "Feriado — Véspera de Ano Novo" },

];
