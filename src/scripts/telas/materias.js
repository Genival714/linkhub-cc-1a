// ============================================================
//  Tela · Matérias
//
//  Uma ficha por matéria, com a pergunta que mais aparece no
//  grupo da turma respondida logo de cara: como essa nota é
//  composta, exatamente?
//
//  Tudo vem dos Planos de Ensino oficiais, incluindo as regras de
//  entrega em atraso e o que cada professor permite de IA.
// ============================================================

import { MATERIAS } from "../dados/materias.js";
import { limpo, pega } from "../nucleo/dom.js";
import { tintaDe } from "../nucleo/paleta.js";
import { EVENTOS, valeNota } from "../nucleo/eventos.js";
import { linha } from "../nucleo/pecas.js";
import { isoDeHoje } from "../nucleo/datas.js";

const MAX_PROXIMAS = 3;

/** Bloco de lista com título, ou nada se a lista estiver vazia. */
function listaDe(titulo, itens) {
  if (!itens?.length) return "";
  return `
    <section class="ficha-bloco">
      <h4 class="ficha-bloco-titulo">${titulo}</h4>
      <ul class="ficha-itens">
        ${itens.map((i) => `<li>${limpo(i)}</li>`).join("")}
      </ul>
    </section>`;
}

function docentesDe(materia) {
  if (!materia.docentes.length) return "Docente a confirmar";
  return materia.docentes
    .map(
      (p) =>
        `${limpo(p.nome)} · <a href="mailto:${limpo(p.email)}">${limpo(p.email)}</a>`,
    )
    .join(" · ");
}

function fichaTecnicaDe(materia) {
  return [
    materia.codigo && `Código ${limpo(materia.codigo)}`,
    materia.cargaHoraria && limpo(materia.cargaHoraria),
    materia.dias.length && materia.dias.join(" · "),
    materia.online && "online",
  ]
    .filter(Boolean)
    .join(" · ");
}

function blocoDeIa(ia) {
  if (!ia) return "";
  const itens = [
    ia.permitido && `<li><strong>Permitido:</strong> ${limpo(ia.permitido)}</li>`,
    ia.declarado && `<li><strong>Com declaração:</strong> ${limpo(ia.declarado)}</li>`,
    ia.proibido && `<li><strong>Atenção:</strong> ${limpo(ia.proibido)}</li>`,
  ].filter(Boolean);

  if (!itens.length) return "";
  return `
    <section class="ficha-bloco">
      <h4 class="ficha-bloco-titulo">Uso de IA</h4>
      <ul class="ficha-itens">${itens.join("")}</ul>
    </section>`;
}

function acoesDe(materia) {
  const botoes = [];

  botoes.push(
    materia.classroom
      ? `<a class="ficha-acao" href="${limpo(materia.classroom)}" target="_blank" rel="noopener">Classroom</a>`
      : '<span class="ficha-acao ficha-acao--inerte">Classroom a confirmar</span>',
  );

  if (materia.site) {
    botoes.push(
      `<a class="ficha-acao" href="${limpo(materia.site)}" target="_blank" rel="noopener">Site da matéria</a>`,
    );
  }

  if (materia.plano) {
    botoes.push(
      `<button class="ficha-acao" data-arquivo="${limpo(materia.plano)}"
         data-arquivo-titulo="Plano de Ensino · ${limpo(materia.nome)}"
         data-arquivo-simbolo="📘">Plano de Ensino</button>`,
    );
  }

  botoes.push(
    `<button class="ficha-acao" data-ir="agenda-materia" data-materia="${limpo(materia.id)}">Ver na agenda</button>`,
  );

  return botoes.join("");
}

function ficha(materia) {
  const avaliacao = materia.avaliacao || {};

  const proximas = EVENTOS.filter(
    (ev) => ev.disc === materia.id && valeNota(ev) && ev.data >= isoDeHoje(),
  ).slice(0, MAX_PROXIMAS);

  const blocoProximas = proximas.length
    ? `<section class="ficha-bloco">
         <h4 class="ficha-bloco-titulo">Próximas avaliações</h4>
         <div class="ficha-proximas">${proximas.map(linha).join("")}</div>
       </section>`
    : "";

  const tecnica = fichaTecnicaDe(materia);

  return `
    <article class="ficha" style="${tintaDe(materia.id)}">
      <header class="ficha-cabeca">
        <span class="ficha-selo" aria-hidden="true">${limpo(materia.sigla)}</span>
        <div class="ficha-identidade">
          <h3 class="ficha-nome">${limpo(materia.nomeCompleto || materia.nome)}</h3>
          <p class="ficha-linha">${docentesDe(materia)}</p>
          ${tecnica ? `<p class="ficha-linha">${tecnica}</p>` : ""}
          ${materia.obs ? `<p class="ficha-linha">${limpo(materia.obs)}</p>` : ""}
        </div>
      </header>

      ${materia.alerta ? `<p class="ficha-alerta">${limpo(materia.alerta)}</p>` : ""}

      <div class="ficha-corpo">
        ${listaDe("Como é composta a AV1", avaliacao.av1)}
        ${listaDe("Como é composta a AV2", avaliacao.av2)}
        ${avaliacao.atraso ? `<p class="ficha-regra"><strong>Entrega em atraso:</strong> ${limpo(avaliacao.atraso)}</p>` : ""}
        ${avaliacao.bonus ? `<p class="ficha-regra ficha-regra--bonus"><strong>Pontuação extra:</strong> ${limpo(avaliacao.bonus)}</p>` : ""}
        ${avaliacao.formula ? `<p class="ficha-formula">${limpo(avaliacao.formula)}</p>` : ""}
        ${listaDe("Atividades extra-classe", materia.extras)}
        ${blocoDeIa(materia.ia)}
        ${blocoProximas}
      </div>

      <footer class="ficha-acoes">${acoesDe(materia)}</footer>
    </article>`;
}

export function monta() {
  pega("#materias-lista").innerHTML = MATERIAS.map(ficha).join("");
}
