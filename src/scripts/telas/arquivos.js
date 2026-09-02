// ============================================================
//  Tela · Arquivos
//
//  Os nove documentos da turma, agrupados por seção. Clicar abre
//  a leitura dentro do site; o botão de baixar fica dentro dela.
// ============================================================

import { TURMA } from "../dados/turma.js";
import { limpo, pega } from "../nucleo/dom.js";
import { tintaDe } from "../nucleo/paleta.js";

function pasta(arquivo) {
  return `
    <button class="pasta" style="${tintaDe(arquivo.materia)}"
            data-arquivo="${limpo(arquivo.caminho)}"
            data-arquivo-titulo="${limpo(arquivo.titulo)}"
            data-arquivo-simbolo="${limpo(arquivo.simbolo)}"
            data-arquivo-resumo="${limpo(arquivo.resumo || "")}">
      <span class="pasta-marca" aria-hidden="true">${limpo(arquivo.simbolo)}</span>
      <span class="pasta-corpo">
        <span class="pasta-titulo">${limpo(arquivo.titulo)}</span>
        ${arquivo.resumo ? `<span class="pasta-resumo">${limpo(arquivo.resumo)}</span>` : ""}
      </span>
      <span class="pasta-meta">
        <span class="marcador">PDF</span>
        ${arquivo.peso ? `<span class="pasta-peso">${limpo(arquivo.peso)}</span>` : ""}
      </span>
    </button>`;
}

export function monta() {
  // Agrupa por seção mantendo a ordem em que aparecem no turma.js
  const secoes = new Map();
  TURMA.arquivos.forEach((arquivo) => {
    const chave = arquivo.secao || "Outros";
    if (!secoes.has(chave)) secoes.set(chave, []);
    secoes.get(chave).push(arquivo);
  });

  pega("#arquivos-lista").innerHTML = [...secoes]
    .map(
      ([titulo, itens]) => `
      <section class="arquivos-secao">
        <h3 class="arquivos-secao-titulo">${limpo(titulo)}</h3>
        <div class="arquivos-grade">${itens.map(pasta).join("")}</div>
      </section>`,
    )
    .join("");
}
