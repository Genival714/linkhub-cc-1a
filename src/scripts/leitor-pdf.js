// ============================================================
//  Leitor de documentos
//
//  Abre o PDF dentro do site, com botão de baixar — o
//  comportamento que as pessoas já conhecem do Google Drive.
//
//  São dois motores, e a escolha entre eles é automática:
//
//  1. <iframe> com o leitor do próprio navegador. É o melhor
//     quando existe: traz busca, seleção de texto e impressão de
//     graça. No computador é o que roda.
//
//  2. pdf.js desenhando página por página num <canvas>. É o que
//     salva o celular. Nem o Chrome do Android nem o Safari do
//     iPhone têm leitor de PDF embutido: num <iframe> devolvem um
//     retângulo em branco, ou baixam o arquivo. Como a turma abre
//     este site quase todo pelo telefone, a leitura tem de
//     funcionar aí.
// ============================================================

import { limpo, pega } from "./nucleo/dom.js";
import * as janela from "./nucleo/janela.js";

// ── Motor 1 existe neste aparelho? ──────────────────────────
// Na dúvida dizemos que não e caímos no motor 2: desenhar o PDF
// nós mesmos sempre funciona, enquanto um <iframe> vazio parece
// site quebrado.
const NAVEGADOR_LE_PDF = (() => {
  const ehIPhone =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (ehIPhone) return false;

  // Chrome 94+, Firefox 91+, Safari 16.4+
  if (typeof navigator.pdfViewerEnabled === "boolean") {
    return navigator.pdfViewerEnabled;
  }

  // Navegadores anteriores a essa API
  return Boolean(navigator.mimeTypes?.["application/pdf"]);
})();

// ── Motor 2: o pdf.js ───────────────────────────────────────
// A biblioteca vive em assets/vendor/pdfjs/ (veja o LEIAME de lá).
// São 1,8 MB, então só é baixada quando alguém abre o primeiro
// documento — quem nunca toca num PDF não paga por ela. Depois o
// service worker guarda, e a leitura passa a funcionar offline.

// Dois níveis acima: este módulo mora em src/scripts/, e a pasta
// assets/ fica na raiz do site.
const CAMINHO_LIB = "../../assets/vendor/pdfjs/pdf.min.mjs";
const CAMINHO_WORKER = "../../assets/vendor/pdfjs/pdf.worker.min.mjs";

let pdfjs = null;
let carregandoLib = null;

function carregaPdfjs() {
  if (pdfjs) return Promise.resolve(pdfjs);
  if (!carregandoLib) {
    // Endereços resolvidos contra o deste módulo: o site pode morar
    // numa subpasta (usuario.github.io/linkhub-cc-1a/) e um caminho
    // absoluto apontaria para a raiz do domínio, que não é nossa.
    carregandoLib = import(new URL(CAMINHO_LIB, import.meta.url).href)
      .then((mod) => {
        mod.GlobalWorkerOptions.workerSrc = new URL(
          CAMINHO_WORKER,
          import.meta.url,
        ).href;
        pdfjs = mod;
        return mod;
      })
      .catch((erro) => {
        carregandoLib = null;
        throw erro;
      });
  }
  return carregandoLib;
}

// ── Estado do leitor ────────────────────────────────────────
// Existe um de cada vez — só há uma janela de documento.
const leitor = {
  documento: null,
  paginas: [],           // os <div> de cada página, na ordem
  desenhos: new Map(),   // página → renderização em curso (para cancelar)
  vigia: null,           // IntersectionObserver
  ampliacao: 1,          // multiplicador sobre a largura que cabe na tela
  sessao: 0,             // muda a cada abertura; descarta o que veio tarde
  remedir: 0,            // timer de redimensionamento
};

const AMPLIACOES = [1, 1.5, 2, 3];

const corpo = () => document.getElementById("arquivo-corpo");

async function desenhaComPdfjs(endereco, titulo) {
  const area = corpo();
  const { sessao } = leitor;

  area.innerHTML = `
    <div class="leitor-espera">
      <span class="leitor-roda" aria-hidden="true"></span>
      <p>Abrindo o documento…</p>
    </div>`;

  let lib;
  let documento;

  try {
    lib = await carregaPdfjs();
    if (sessao !== leitor.sessao) return;

    // Baixar o arquivo inteiro de uma vez, em vez de por faixas.
    // Por padrão o pdf.js pede pedaços com cabeçalho Range, e a
    // resposta 206 que volta NÃO pode ser gravada no Cache API — o
    // service worker daria erro e o documento nunca ficaria
    // disponível offline. Uma requisição normal resolve os dois.
    const tarefa = lib.getDocument({
      url: endereco,
      disableRange: true,
      disableStream: true,
    });

    // O manual do estudante tem 3,7 MB. Sem sinal de progresso, a
    // espera parece travada no 3G do campus.
    const legenda = area.querySelector(".leitor-espera p");
    tarefa.onProgress = ({ loaded, total }) => {
      if (!legenda || sessao !== leitor.sessao) return;
      const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : null;
      legenda.textContent =
        pct === null ? "Abrindo o documento…" : `Abrindo o documento… ${pct}%`;
    };

    documento = await tarefa.promise;
  } catch (erro) {
    console.error("pdf.js não conseguiu abrir o documento:", erro);
    if (sessao === leitor.sessao) mostraFalha();
    return;
  }

  // Fechou a janela enquanto o arquivo baixava.
  if (sessao !== leitor.sessao) {
    documento.destroy();
    return;
  }
  leitor.documento = documento;

  // Mede todas as páginas antes de desenhar qualquer uma. Com as
  // alturas conhecidas, a barra de rolagem já nasce do tamanho
  // certo e o documento não "pula" enquanto as páginas aparecem —
  // e o manual, de 39 páginas, não precisa ser desenhado inteiro
  // para começar a ser lido.
  const medidas = [];
  for (let n = 1; n <= documento.numPages; n++) {
    const { width, height } = (await documento.getPage(n)).getViewport({ scale: 1 });
    medidas.push(width / height);
  }
  if (sessao !== leitor.sessao) return;

  area.innerHTML = `
    <div class="leitor-rolo" id="leitor-rolo" tabindex="0"
         aria-label="Páginas de ${limpo(titulo || "documento")}">
      ${medidas
        .map((proporcao, i) => `<div class="leitor-pagina" data-pagina="${i + 1}" data-proporcao="${proporcao}"></div>`)
        .join("")}
    </div>
    <div class="leitor-barra">
      <button class="leitor-passo" data-ampliar="menos" aria-label="Diminuir">−</button>
      <span class="leitor-contador" id="leitor-contador" aria-live="polite"
            aria-label="Página">1 / ${documento.numPages}</span>
      <button class="leitor-passo" data-ampliar="mais" aria-label="Aumentar">+</button>
    </div>`;

  leitor.paginas = [...area.querySelectorAll(".leitor-pagina")];
  leitor.ampliacao = 1;
  ajustaLargura();
  ajustaBotoes();

  // Desenha o que está à vista e uma tela para cada lado; ao sair
  // desse raio, o canvas é jogado fora. Sem isso, 39 páginas em
  // alta resolução estouram a memória de um celular modesto — na
  // prática ficam de 2 a 4 páginas desenhadas por vez.
  leitor.vigia = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) desenhaPagina(entrada.target, sessao);
        else descartaPagina(entrada.target);
      });
    },
    { root: area, rootMargin: "100% 0px" },
  );
  leitor.paginas.forEach((p) => leitor.vigia.observe(p));

  area
    .querySelector(".leitor-rolo")
    .addEventListener("scroll", atualizaContador, { passive: true });
}

// Largura em pixels de cada página. Ampliação 1 = largura da tela.
function ajustaLargura() {
  const area = corpo();
  if (!area) return;

  const base = Math.max(240, area.clientWidth - 24);
  const largura = Math.round(base * leitor.ampliacao);

  leitor.paginas.forEach((p) => {
    p.style.width = `${largura}px`;
    // A altura é calculada aqui, e não com `aspect-ratio` no CSS,
    // porque essa propriedade só existe do Safari 15 para frente —
    // e um iPhone velho é exatamente o aparelho que mais precisa
    // deste leitor. A4 em pé (0,707) é o palpite se a proporção
    // vier estranha.
    const proporcao = Number(p.dataset.proporcao) || 0.707;
    p.style.height = `${Math.round(largura / proporcao)}px`;
  });

  // A grade de horários é uma única página deitada: no ajuste de
  // largura ela ocupa só o topo e deixa metade da área vazia.
  // Quando o documento inteiro cabe sem rolar, vai para o meio.
  // Só nesse caso — havendo rolagem, centralizar cortaria o topo.
  const rolo = document.getElementById("leitor-rolo");
  if (!rolo) return;
  requestAnimationFrame(() => {
    rolo.classList.toggle("leitor-rolo--centrado", rolo.scrollHeight <= rolo.clientHeight + 1);
  });
}

async function desenhaPagina(divisao, sessao) {
  if (divisao.dataset.pronta === "1" || leitor.desenhos.has(divisao)) return;
  if (!leitor.documento || sessao !== leitor.sessao) return;

  const numero = Number(divisao.dataset.pagina);
  const pagina = await leitor.documento.getPage(numero);
  if (sessao !== leitor.sessao) return;

  // Um celular desenha 2 a 3 pontos físicos por ponto CSS; sem
  // levar isso em conta, a tabela do plano de ensino sai borrada.
  // Mas o canvas guarda 4 bytes por pixel: na ampliação 3× a conta
  // chegaria a dezenas de MB por página. O teto segura as duas
  // pontas — nítido em 1×, ainda legível e leve em 3×.
  const TETO = 2200;
  const nitidez = Math.min(window.devicePixelRatio || 1, 3);
  const larguraCanvas = Math.min(divisao.clientWidth * nitidez, TETO);
  const escala = larguraCanvas / pagina.getViewport({ scale: 1 }).width;
  const vista = pagina.getViewport({ scale: escala });

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(vista.width);
  canvas.height = Math.floor(vista.height);
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  const tarefa = pagina.render({
    canvasContext: canvas.getContext("2d"),
    viewport: vista,
  });
  leitor.desenhos.set(divisao, tarefa);

  try {
    await tarefa.promise;
  } catch (erro) {
    // Cancelamento (rolou para longe, mudou a ampliação) não é erro.
    if (erro?.name !== "RenderingCancelledException") console.error(erro);
    leitor.desenhos.delete(divisao);
    return;
  }
  leitor.desenhos.delete(divisao);
  if (sessao !== leitor.sessao) return;

  divisao.replaceChildren(canvas);

  // Um <canvas> é uma imagem: leitor de tela não enxerga nada
  // dentro. O texto da página vai junto, fora da vista, para que
  // quem usa leitor de tela e quem quer copiar um trecho não
  // fiquem de fora. `display:none` não serviria — esconderia do
  // leitor de tela também.
  try {
    const conteudo = (await pagina.getTextContent()).items
      .map((item) => item.str)
      .join(" ")
      .trim();
    // Capa em imagem (a do manual, por exemplo) não tem texto
    // nenhum: aí não vale a pena inserir um elemento vazio.
    if (conteudo) {
      const transcricao = document.createElement("div");
      transcricao.className = "leitor-transcricao";
      transcricao.textContent = conteudo;
      divisao.append(transcricao);
    }
  } catch {
    /* sem texto extraível — segue só a imagem */
  }

  divisao.dataset.pronta = "1";
}

function descartaPagina(divisao) {
  const tarefa = leitor.desenhos.get(divisao);
  if (tarefa) {
    tarefa.cancel();
    leitor.desenhos.delete(divisao);
  }
  if (divisao.dataset.pronta === "1") {
    divisao.replaceChildren();
    delete divisao.dataset.pronta;
  }
}

function atualizaContador() {
  const rolo = document.getElementById("leitor-rolo");
  const contador = document.getElementById("leitor-contador");
  if (!rolo || !contador) return;

  // A página "atual" é a que está no meio da área visível.
  const meio = rolo.scrollTop + rolo.clientHeight / 2;
  let atual = 1;
  for (const pagina of leitor.paginas) {
    if (pagina.offsetTop <= meio) atual = Number(pagina.dataset.pagina);
    else break;
  }
  contador.textContent = `${atual} / ${leitor.paginas.length}`;
}

function amplia(direcao) {
  const indice = AMPLIACOES.indexOf(leitor.ampliacao);
  const passo = direcao === "mais" ? 1 : -1;
  const nova = AMPLIACOES[Math.min(AMPLIACOES.length - 1, Math.max(0, indice + passo))];
  if (nova === leitor.ampliacao) return;

  const rolo = document.getElementById("leitor-rolo");
  const proporcaoRolada = rolo ? rolo.scrollTop / (rolo.scrollHeight || 1) : 0;

  leitor.ampliacao = nova;
  leitor.paginas.forEach(descartaPagina); // a resolução antiga não serve mais
  ajustaLargura();

  // Segura o leitor no mesmo ponto do documento depois do redesenho.
  if (rolo) rolo.scrollTop = proporcaoRolada * rolo.scrollHeight;

  reavaliaVisiveis();
  ajustaBotoes();
}

function ajustaBotoes() {
  document.querySelectorAll("[data-ampliar]").forEach((botao) => {
    botao.disabled =
      botao.dataset.ampliar === "mais"
        ? leitor.ampliacao === AMPLIACOES.at(-1)
        : leitor.ampliacao === AMPLIACOES[0];
  });
}

// O IntersectionObserver só avisa quando o cruzamento MUDA. Depois
// de ampliar (ou de girar o telefone), as páginas que estavam à
// vista continuam à vista: nenhum aviso chega, nada é redesenhado
// e a pessoa fica olhando para o vazio. Reobservar força o aviso.
function reavaliaVisiveis() {
  if (!leitor.vigia) return;
  leitor.paginas.forEach((p) => leitor.vigia.unobserve(p));
  leitor.paginas.forEach((p) => leitor.vigia.observe(p));
}

// Última linha de defesa: falhou o leitor do navegador E o pdf.js.
function mostraFalha() {
  const area = corpo();
  if (!area) return;
  area.innerHTML = `
    <div class="leitor-falha">
      <span class="leitor-falha-marca" aria-hidden="true">📄</span>
      <p>Não deu para abrir o documento aqui dentro.
         Use os botões abaixo para ver ou baixar o arquivo.</p>
    </div>`;
}

function esvazia() {
  leitor.sessao++; // invalida tudo que ainda estiver a caminho
  leitor.desenhos.forEach((tarefa) => tarefa.cancel());
  leitor.desenhos.clear();
  leitor.vigia?.disconnect();
  leitor.vigia = null;
  leitor.documento?.destroy();
  leitor.documento = null;
  leitor.paginas = [];
  leitor.ampliacao = 1;
}

// ── Abrir e fechar ──────────────────────────────────────────

export function abre({ endereco, titulo, simbolo, resumo }) {
  esvazia();

  pega("#arquivo-titulo").textContent = titulo || "Documento";
  pega("#arquivo-resumo").textContent = resumo || "";
  pega("#arquivo-marca").textContent = simbolo || "📄";
  pega("#arquivo-baixar").href = endereco;
  pega("#arquivo-nova-aba").href = endereco;

  janela.abre("janela-arquivo");

  if (NAVEGADOR_LE_PDF) {
    corpo().innerHTML = `<iframe src="${limpo(endereco)}#toolbar=0&navpanes=0"
      title="Documento: ${limpo(titulo || "sem título")}"></iframe>`;
  } else {
    desenhaComPdfjs(endereco, titulo);
  }
}

export function fecha() {
  esvazia();
  // Espera a animação de saída: esvaziar na hora faz a janela
  // sumir do meio da tela em vez de deslizar.
  setTimeout(() => {
    const area = corpo();
    if (area && !document.getElementById("janela-arquivo")?.classList.contains("janela--aberta")) {
      area.replaceChildren();
    }
  }, 320);
}

/** Liga os gatilhos globais do leitor. */
export function instala() {
  // Um ouvinte só atende todos os gatilhos de documento da página,
  // inclusive os criados depois.
  document.addEventListener("click", (evento) => {
    const gatilho = evento.target.closest("[data-arquivo]");
    if (!gatilho) return;
    evento.preventDefault();
    abre({
      endereco: gatilho.dataset.arquivo,
      titulo: gatilho.dataset.arquivoTitulo,
      simbolo: gatilho.dataset.arquivoSimbolo,
      resumo: gatilho.dataset.arquivoResumo,
    });
  });

  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-ampliar]");
    if (botao) amplia(botao.dataset.ampliar);
  });

  // A janela pode ser fechada pelo Esc, pelo X ou pelo fundo — em
  // qualquer caso o documento precisa ser descarregado.
  document
    .getElementById("janela-arquivo")
    ?.addEventListener("transitionend", (evento) => {
      if (evento.target.id === "janela-arquivo" && !evento.target.classList.contains("janela--aberta")) {
        fecha();
      }
    });

  // Girar o celular muda a largura disponível: as páginas precisam
  // ser remedidas, senão ficam com a largura da orientação anterior.
  window.addEventListener("resize", () => {
    if (!leitor.documento || !leitor.paginas.length) return;
    clearTimeout(leitor.remedir);
    leitor.remedir = setTimeout(() => {
      leitor.paginas.forEach(descartaPagina);
      ajustaLargura();
      reavaliaVisiveis();
    }, 200);
  });
}
