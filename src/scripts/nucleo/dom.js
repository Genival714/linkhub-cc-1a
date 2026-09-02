// ============================================================
//  Núcleo · DOM
//
//  Atalhos de seleção, escape de texto e delegação de eventos.
//
//  Sobre o escape: todo texto que entra em innerHTML passa por
//  `limpo`. Os dados são nossos e vêm de arquivos versionados, mas
//  basta alguém colar uma observação com um "<" para o HTML
//  quebrar — e o dia em que um campo vier de fora, a proteção já
//  está no lugar.
// ============================================================

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Texto seguro para interpolar em innerHTML. */
export const limpo = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Primeiro elemento que casa com o seletor. */
export const pega = (seletor, raiz = document) => raiz.querySelector(seletor);

/** Todos os elementos que casam, já como array. */
export const pegaTodos = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

/**
 * Delegação de evento: um só ouvinte no documento atende todos os
 * gatilhos que casam com o seletor, inclusive os criados depois.
 * Evita ter de reconectar ouvintes a cada nova renderização.
 *
 *   delega("click", "[data-arquivo]", (el, ev) => …)
 */
export function delega(evento, seletor, acao, raiz = document) {
  raiz.addEventListener(evento, (ev) => {
    const alvo = ev.target.closest(seletor);
    if (alvo && raiz.contains(alvo)) acao(alvo, ev);
  });
}

/**
 * Junta pedaços de classe descartando os vazios.
 *   classes("celula", ehHoje && "celula--hoje")  →  "celula celula--hoje"
 */
export const classes = (...partes) => partes.filter(Boolean).join(" ");
