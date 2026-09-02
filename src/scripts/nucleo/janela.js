// ============================================================
//  Núcleo · Janelas sobrepostas
//
//  Uma janela é um <dialog>-like feito à mão: fundo escurecido,
//  painel no centro, e três compromissos de acessibilidade que
//  costumam ficar de fora:
//
//  1. O foco entra na janela ao abrir e volta para o botão que a
//     abriu ao fechar — quem navega por teclado não é largado no
//     começo da página.
//  2. Tab circula dentro da janela. Sem isso o foco escapa para os
//     links atrás do fundo escuro, que ninguém está vendo.
//  3. A página atrás para de rolar enquanto a janela está aberta.
//
//  Usamos elemento comum em vez de <dialog> porque o modal nativo
//  do Safari só chegou na versão 15.4, e iPhone velho é justamente
//  o aparelho que mais abre este site.
// ============================================================

import { pegaTodos } from "./dom.js";

const FOCAVEIS = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])",
].join(",");

// id da janela → elemento que tinha o foco antes de abrir
const origemDoFoco = new Map();

const aberta = (el) => el?.classList.contains("janela--aberta");

/** Há alguma janela aberta agora? */
export const algumaAberta = () =>
  document.querySelector(".janela--aberta") !== null;

export function abre(id) {
  const janela = document.getElementById(id);
  if (!janela || aberta(janela)) return;

  origemDoFoco.set(id, document.activeElement);
  janela.classList.add("janela--aberta");
  janela.removeAttribute("aria-hidden");
  document.documentElement.classList.add("sem-rolagem");

  const primeiro = janela.querySelector(FOCAVEIS);
  primeiro?.focus();
}

export function fecha(id) {
  const janela = document.getElementById(id);
  if (!janela || !aberta(janela)) return;

  janela.classList.remove("janela--aberta");
  janela.setAttribute("aria-hidden", "true");

  if (!algumaAberta()) document.documentElement.classList.remove("sem-rolagem");

  // Devolve o foco a quem abriu, se ainda estiver na página
  const origem = origemDoFoco.get(id);
  origemDoFoco.delete(id);
  if (origem?.isConnected) origem.focus();
}

export function fechaTodas() {
  pegaTodos(".janela--aberta").forEach((j) => fecha(j.id));
}

/** Prende o Tab dentro da janela aberta. */
function circulaFoco(ev) {
  const janela = document.querySelector(".janela--aberta");
  if (!janela) return;

  const alvos = pegaTodos(FOCAVEIS, janela).filter((el) => el.offsetParent !== null);
  if (!alvos.length) return;

  const primeiro = alvos[0];
  const ultimo = alvos[alvos.length - 1];
  const atual = document.activeElement;

  if (ev.shiftKey && (atual === primeiro || !janela.contains(atual))) {
    ev.preventDefault();
    ultimo.focus();
  } else if (!ev.shiftKey && atual === ultimo) {
    ev.preventDefault();
    primeiro.focus();
  }
}

/** Liga o comportamento comum a todas as janelas da página. */
export function instala() {
  // Clique no fundo escurecido fecha; clique no painel não.
  document.addEventListener("click", (ev) => {
    const janela = ev.target.closest(".janela");
    if (janela && ev.target === janela) fecha(janela.id);

    const botao = ev.target.closest("[data-fecha-janela]");
    if (botao) fecha(botao.closest(".janela").id);
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && algumaAberta()) {
      ev.preventDefault();
      fechaTodas();
    } else if (ev.key === "Tab") {
      circulaFoco(ev);
    }
  });
}
