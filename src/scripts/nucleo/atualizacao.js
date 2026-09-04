// ============================================================
//  Núcleo · Atualização automática
//
//  Faz o site trocar de versão sozinho. Ninguém da turma deveria
//  precisar apertar F5 para ver um aviso novo.
//
//  Em três tempos:
//
//  1. O navegador instala a versão nova em segundo plano e ela
//     FICA ESPERANDO. Não assume no meio da sessão — foi assim que
//     um index.html velho um dia encontrou um painel.js novo e
//     derrubou o site inteiro.
//  2. Esta página escolhe a hora. Acabou de abrir, ou está fora da
//     vista? Troca calada. Alguém está lendo? Oferece o toque.
//  3. A troca vem junto com um recarregamento, então a página nova
//     nunca esbarra em pedaços da versão anterior.
//
//  O ponto delicado é o TEMPO. Quando esta página chega, a
//  instalação da versão nova pode estar em qualquer ponto: já
//  terminada, em curso, ou nem começada. Escutar só o `updatefound`
//  parece bastar e não basta — o navegador dispara esse evento
//  assim que a página carrega, muitas vezes antes de `register()`
//  devolver a promessa, e aí não há ninguém escutando ainda. Era
//  exatamente esse o furo pelo qual a atualização passava batido.
// ============================================================

import { notaFixa } from "./nota.js";
import { algumaAberta } from "./janela.js";

// Recarregar nos primeiros segundos passa despercebido: a pessoa
// ainda está chegando. Depois disso ela já está lendo alguma coisa.
const JANELA_CALADA = 10_000;

// O navegador já limita a frequência por conta própria, mas sem uma
// trava aqui uma troca rápida de abas dispararia uma conferência a
// cada ida e volta.
const ESPERA_ENTRE_CONFERIDAS = 60_000;

// Uma aba esquecida aberta no computador não perde nem recupera o
// foco o dia inteiro. Sem isto ela ficaria parada na versão da manhã.
const INTERVALO_DE_RONDA = 15 * 60 * 1000;

const abertura = Date.now();

// Um mesmo trabalhador chega por mais de uma porta; tratar duas
// vezes mostraria dois avisos na tela.
const tratados = new WeakSet();

let ultimaConferida = 0;
let recarregando = false;
let avisoNaTela = false;

/**
 * A troca só é calada quando ninguém perde nada com ela.
 *
 * Janela aberta é leitura de PDF ou QR na tela: recarregar ali apaga
 * o lugar onde a pessoa estava, e é justamente o momento em que uma
 * interrupção mais irrita.
 */
function podeTrocarCalado() {
  if (algumaAberta()) return false;
  // Fora da vista o recarregamento é invisível por definição.
  if (document.hidden) return true;
  return Date.now() - abertura < JANELA_CALADA;
}

// Falar direto com o trabalhador que acabou de instalar, e não com
// `registro.waiting`: esse campo demora um instante para apontar
// para ele, e a mensagem cairia no vazio sem erro nenhum.
function assume(registro, trabalhador) {
  (trabalhador || registro.waiting)?.postMessage({ tipo: "assumir" });
}

function chegouVersaoNova(registro, trabalhador) {
  if (podeTrocarCalado()) {
    assume(registro, trabalhador);
    return;
  }

  // Um aviso só: a versão nova continua esperando, e insistir a cada
  // conferência viraria perseguição.
  if (avisoNaTela) return;
  avisoNaTela = true;

  notaFixa("Há uma versão nova do site.", {
    rotulo: "Atualizar",
    acao: () => assume(registro, trabalhador),
  });
}

/** Acompanha um trabalhador até ele terminar de instalar. */
function vigiaTrabalhador(registro, trabalhador) {
  if (!trabalhador) return;

  const confere = () => {
    if (trabalhador.state !== "installed") return;
    // Sem controlador é a primeira visita: não há versão anterior
    // para trocar, a pessoa já está vendo esta.
    if (!navigator.serviceWorker.controller) return;
    if (tratados.has(trabalhador)) return;
    tratados.add(trabalhador);
    chegouVersaoNova(registro, trabalhador);
  };

  confere();                                     // pode já estar pronto
  trabalhador.addEventListener("statechange", confere);
}

function vigia(registro) {
  // As três portas de entrada, porque a instalação pode estar em
  // qualquer ponto quando esta página chega:
  //   waiting     terminou antes de a gente abrir
  //   installing  está em curso — e o updatefound provavelmente já
  //               disparou, sem ninguém escutando
  //   updatefound ainda vai começar
  vigiaTrabalhador(registro, registro.waiting);
  vigiaTrabalhador(registro, registro.installing);
  registro.addEventListener("updatefound", () =>
    vigiaTrabalhador(registro, registro.installing),
  );
}

function confereAgora(registro) {
  const agora = Date.now();
  if (agora - ultimaConferida < ESPERA_ENTRE_CONFERIDAS) return;
  ultimaConferida = agora;
  registro.update().catch(() => {
    /* sem rede — na próxima vez que voltar para a frente */
  });
}

export async function instala() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  // Precisa ser lido agora, antes de qualquer espera: na primeira
  // visita não há controlador, e o clients.claim() da instalação
  // dispara um controllerchange que NÃO é troca de versão.
  const tinhaControlador = Boolean(navigator.serviceWorker.controller);

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!tinhaControlador || recarregando) return;
    recarregando = true;
    location.reload();
  });

  let registro;
  try {
    registro = await navigator.serviceWorker.register("sw.js");
  } catch {
    // Sem HTTPS ou sem suporte: o site funciona igual, só não abre
    // offline e não se atualiza sozinho.
    return;
  }

  vigia(registro);

  // Onde o app instalado descobre que saiu versão nova: ele volta do
  // segundo plano sem navegar, então nada o faria olhar o sw.js.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) confereAgora(registro);
  });
  window.addEventListener("focus", () => confereAgora(registro));

  // A ronda cobre a aba que fica aberta e nunca troca de foco.
  setInterval(() => confereAgora(registro), INTERVALO_DE_RONDA);
}
