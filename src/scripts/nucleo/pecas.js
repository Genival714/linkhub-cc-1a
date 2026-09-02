// ============================================================
//  Núcleo · Peças reaproveitadas
//
//  Os pedaços de marcação que aparecem em mais de uma tela: o selo
//  da matéria, a etiqueta do tipo e a linha de evento.
//
//  Ficam num lugar só para que a agenda, a tela inicial e a lista
//  de matérias mostrem a mesma prova exatamente igual — se o selo
//  mudar de forma, muda nos três de uma vez.
// ============================================================

import { limpo, classes } from "./dom.js";
import { tintaDe, siglaDe } from "./paleta.js";
import { SIMBOLO_TIPO, NOME_TIPO, valeNota } from "./eventos.js";

/** Selo com a sigla da matéria, na cor dela. */
export const selo = (materiaId) =>
  `<span class="selo" style="${tintaDe(materiaId)}">${limpo(siglaDe(materiaId))}</span>`;

/** Etiqueta com o tipo do evento — símbolo mais nome por extenso. */
export const etiqueta = (tipo) =>
  `<span class="etiqueta"><span aria-hidden="true">${SIMBOLO_TIPO[tipo] || "📌"}</span>${limpo(NOME_TIPO[tipo] || tipo)}</span>`;

/**
 * Linha de evento — usada na agenda, no dia aberto e na ficha da
 * matéria. Eventos que valem nota ganham peso e borda mais forte.
 */
export function linha(evento) {
  const marcado = valeNota(evento);
  const classe = classes(
    "linha",
    marcado && "linha--nota",
    evento.tipo === "feriado" && "linha--feriado",
  );

  return `
    <div class="${classe}" style="${tintaDe(evento.disc)}">
      <span class="linha-marca" aria-hidden="true">${SIMBOLO_TIPO[evento.tipo] || "📌"}</span>
      <div class="linha-corpo">
        <div class="linha-topo">
          ${selo(evento.disc)}
          ${etiqueta(evento.tipo)}
          ${evento.aula ? `<span class="linha-aula">Aula ${limpo(evento.aula)}</span>` : ""}
        </div>
        <p class="linha-titulo">${limpo(evento.titulo)}</p>
        ${evento.obs ? `<p class="linha-obs">${limpo(evento.obs)}</p>` : ""}
      </div>
    </div>`;
}
