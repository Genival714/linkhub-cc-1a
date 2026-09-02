// ============================================================
//  Núcleo · Paleta das matérias
//
//  A casca do site é neutra de propósito: tinta, papel e grafite.
//  A única cor saturada da página pertence às matérias, e é isto
//  que faz uma prova de Sistemas Digitais se distinguir de uma
//  entrega de Projeto 1 num relance.
//
//  ►► Estas funções devolvem REFERÊNCIAS a variáveis CSS, nunca
//     hexadecimal literal. Só assim os valores redefinidos em
//     [data-tema="escuro"] entram em ação — com hex fixo no
//     atributo style, o tema escuro exibiria as cores do claro.
//
//  A cor NUNCA é o único sinal: todo evento carrega também a
//  sigla da matéria e um símbolo do tipo.
// ============================================================

import { MATERIA_POR_ID } from "../dados/materias.js";

// Sem matéria (ou matéria desconhecida) cai no institucional
const GERAL = "inst";

const resolve = (id) => (id && MATERIA_POR_ID[id] ? id : GERAL);

/**
 * Par de variáveis para o atributo style de um elemento colorido.
 *   --c      matiz cheia — bolinhas, bordas, faixas, fundos
 *   --c-txt  variante legível, usada só em texto pequeno
 */
export const tintaDe = (id) => {
  const chave = resolve(id);
  return `--c:var(--c-${chave});--c-txt:var(--c-${chave}-txt)`;
};

export const siglaDe = (id) =>
  id && id !== GERAL && MATERIA_POR_ID[id] ? MATERIA_POR_ID[id].sigla : "GERAL";

export const nomeDe = (id) =>
  id && id !== GERAL && MATERIA_POR_ID[id] ? MATERIA_POR_ID[id].nome : "Institucional";
