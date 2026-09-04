// ============================================================
//  Linkhub · CC 1A · CESAR School
//  Ponto de entrada: liga os módulos e desenha a primeira tela.
// ============================================================

import { TURMA } from "./dados/turma.js";
import { limpo, pega, pegaTodos } from "./nucleo/dom.js";
import { vigiaAVirada, aoVirarODia } from "./nucleo/datas.js";
import { recupera, aoMudar } from "./nucleo/estado.js";
import { nota } from "./nucleo/nota.js";
import * as janela from "./nucleo/janela.js";
import * as tema from "./nucleo/tema.js";
import * as atualizacao from "./nucleo/atualizacao.js";
import * as instalar from "./nucleo/instalar.js";
import { compartilha, enderecoDoSite } from "./nucleo/compartilhar.js";
import * as qr from "./nucleo/qr.js";
import * as leitor from "./leitor-pdf.js";

import * as painel from "./telas/painel.js";
import * as agenda from "./telas/agenda.js";
import * as materias from "./telas/materias.js";
import * as arquivos from "./telas/arquivos.js";

// ============================================================
//  Navegação entre telas
// ============================================================

const TELAS = ["painel", "agenda", "materias", "arquivos"];

function vaiPara(nome, { gravaHistorico = true } = {}) {
  const alvo = TELAS.includes(nome) ? nome : "painel";

  pegaTodos("[data-tela]").forEach((item) => {
    const ativo = item.dataset.tela === alvo;
    item.classList.toggle("trilha-item--ativo", ativo);
    item.setAttribute("aria-current", ativo ? "page" : "false");
  });

  pegaTodos(".tela").forEach((tela) => {
    const ativa = tela.id === `tela-${alvo}`;
    tela.classList.toggle("tela--ativa", ativa);
    tela.hidden = !ativa;
  });

  if (gravaHistorico) history.replaceState(null, "", `#${alvo}`);

  // Trocar de tela sem voltar ao topo deixa a pessoa no meio do
  // conteúdo novo, sem entender o que aconteceu.
  window.scrollTo({ top: 0, behavior: "instant" });
}

function ligaNavegacao() {
  const itens = pegaTodos("[data-tela]");

  itens.forEach((item, indice) => {
    item.addEventListener("click", (ev) => {
      ev.preventDefault();
      vaiPara(item.dataset.tela);
    });

    // Setas percorrem a trilha, como manda o padrão de navegação
    item.addEventListener("keydown", (ev) => {
      const passo =
        ev.key === "ArrowRight" || ev.key === "ArrowDown" ? 1
        : ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? -1
        : 0;
      if (!passo) return;
      ev.preventDefault();
      const seguinte = itens[(indice + passo + itens.length) % itens.length];
      seguinte.focus();
      vaiPara(seguinte.dataset.tela);
    });
  });

  window.addEventListener("hashchange", () =>
    vaiPara(location.hash.slice(1) || "painel", { gravaHistorico: false }),
  );

  // Atalhos que saem de uma tela e chegam noutra já filtrada
  document.addEventListener("click", (ev) => {
    const gatilho = ev.target.closest("[data-ir]");
    if (!gatilho) return;

    if (gatilho.dataset.ir === "agenda-avaliacoes") {
      agenda.mostraSoAvaliacoes();
      vaiPara("agenda");
    } else if (gatilho.dataset.ir === "agenda-materia") {
      agenda.mostraMateria(gatilho.dataset.materia);
      vaiPara("agenda");
    }
  });
}

// ============================================================
//  Identidade — cabeçalho e rodapé
// ============================================================

function montaIdentidade() {
  pega("#marca-turma").textContent = TURMA.nome;
  pega("#marca-periodo").textContent = `${TURMA.semestre} · ${TURMA.periodo}`;
  document.title = `Linkhub · Turma ${TURMA.nome} · CESAR School`;

  // Sem link de grupo cadastrado o botão some, em vez de levar a
  // lugar nenhum.
  const grupo = pega("#acao-grupo");
  if (TURMA.grupoWhatsapp) grupo.href = TURMA.grupoWhatsapp;
  else grupo.hidden = true;

  const { nome, papel, github, linkedin } = TURMA.responsavel;
  pega("#rodape-credito").textContent = nome
    ? `Feito por ${nome}, ${papel} — ${TURMA.semestre}.`
    : `Feito para a Turma ${TURMA.nome} de Ciência da Computação · CESAR School`;

  pega("#rodape-links").innerHTML = [
    github && `<a href="${limpo(github)}" target="_blank" rel="noopener">GitHub</a>`,
    linkedin && `<a href="${limpo(linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
  ]
    .filter(Boolean)
    .join("");
}

// ============================================================
//  Ações da barra: compartilhar, QR, instalar
// ============================================================

async function abreQr() {
  const endereco = enderecoDoSite();
  const alvo = pega("#qr-alvo");

  pega("#qr-endereco").textContent = endereco;
  janela.abre("janela-qr");

  alvo.innerHTML = '<span class="qr-espera">Gerando…</span>';
  try {
    alvo.replaceChildren(await qr.desenha(endereco, 240));
  } catch (erro) {
    console.error("não deu para gerar o QR:", erro);
    // Dizer o motivo provável poupa o próximo a caçar o problema:
    // sem rede, o que falha é o download da biblioteca de desenho.
    const semRede = !navigator.onLine;
    alvo.innerHTML = `<p class="qr-falha">
      ${semRede
        ? "Sem conexão para desenhar o código agora."
        : "Não deu para desenhar o código."}
      O endereço abaixo leva ao mesmo lugar — dá para copiar e mandar.
    </p>`;
  }
}

async function baixaQr() {
  try {
    const arquivo = await qr.comoArquivo(enderecoDoSite(), 640);
    const endereco = URL.createObjectURL(arquivo);
    const ancora = document.createElement("a");
    ancora.href = endereco;
    ancora.download = `qr-linkhub-${TURMA.nome.toLowerCase().replace(/\s+/g, "-")}.png`;
    ancora.click();
    URL.revokeObjectURL(endereco);
    nota("Imagem salva");
  } catch {
    nota("Não deu para salvar — toque no código e segure para copiar", "atencao");
  }
}

/** O botão de instalar muda de texto conforme o que o aparelho permite. */
function pintaInstalar(situacao) {
  const botao = pega("#acao-instalar");
  botao.hidden = situacao === "instalado" || situacao === "indisponivel";
  botao.querySelector(".acao-texto").textContent =
    situacao === "pronto" ? "Instalar" : "Instalar";
}

function ligaAcoes() {
  pega("#acao-compartilhar").addEventListener("click", () => compartilha());
  pega("#acao-qr").addEventListener("click", abreQr);
  pega("#qr-baixar").addEventListener("click", baixaQr);

  pega("#acao-instalar").addEventListener("click", async () => {
    if (instalar.situacao() === "pronto") {
      await instalar.instala();
    } else {
      // iPhone: o Safari não oferece o convite, só o menu de
      // compartilhar. A janela explica em duas linhas.
      janela.abre("janela-instalar");
    }
  });

  instalar.observa(pintaInstalar);
  instalar.instalaEscuta();
  pintaInstalar(instalar.situacao());
}

// ============================================================
//  Botão "ao topo"
// ============================================================

// Uma sentinela invisível no topo da página: enquanto ela estiver
// à vista, não há por que oferecer o botão. Sai mais barato que
// escutar cada evento de rolagem.
function ligaAoTopo() {
  const botao = pega("#ao-topo");
  const sentinela = pega("#sentinela-topo");

  botao.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  new IntersectionObserver(
    ([entrada]) => botao.classList.toggle("ao-topo--visivel", !entrada.isIntersecting),
    { threshold: 0 },
  ).observe(sentinela);
}

// ============================================================
//  Partida
// ============================================================

function partida() {
  recupera();

  montaIdentidade();
  painel.monta();
  agenda.montaFiltros();
  agenda.monta();
  agenda.montaExtras();
  materias.monta();
  arquivos.monta();

  ligaNavegacao();
  ligaAcoes();
  ligaAoTopo();
  agenda.instala();
  janela.instala();
  leitor.instala();

  // Redesenha a agenda sempre que filtros, mês ou modo mudarem
  aoMudar(agenda.monta);

  // O dia vira com o site aberto: o alerta, a semana e a agenda
  // precisam acompanhar, senão continuam dizendo "é hoje" para o
  // evento de ontem.
  aoVirarODia(() => {
    painel.refazPorData();
    materias.monta();
    agenda.monta();
  });
  vigiaAVirada();

  vaiPara(location.hash.slice(1) || "painel", { gravaHistorico: false });
}

tema.instala();
partida();

// ============================================================
//  Service worker — abre offline e se atualiza sozinho
//
//  O registro mora em nucleo/atualizacao.js junto com a vigilância
//  da versão nova: registrar sem escutar a atualização deixava a
//  turma presa na versão da primeira visita.
// ============================================================

// Se o load já passou — módulo avaliado tarde, volta do bfcache — o
// ouvinte nunca dispararia e o site ficaria sem se atualizar.
if (document.readyState === "complete") {
  atualizacao.instala();
} else {
  window.addEventListener("load", () => atualizacao.instala(), { once: true });
}
