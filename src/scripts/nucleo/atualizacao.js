// ============================================================
//  Núcleo · Atualização automática
//
//  Faz o site trocar de versão sozinho. Ninguém da turma deveria
//  precisar recarregar a página na mão para ver um aviso novo.
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
//  O app instalado é o caso que mais precisa disto: ele passa dias
//  em segundo plano sem navegar para lugar nenhum e, sem uma
//  conferência explícita, nem chega a olhar o sw.js.
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

const abertura = Date.now();
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

function assume(registro) {
  registro.waiting?.postMessage({ tipo: "assumir" });
}

function chegouVersaoNova(registro) {
  if (podeTrocarCalado()) {
    assume(registro);
    return;
  }

  // Uma só: a versão nova continua esperando, e insistir a cada
  // conferência viraria perseguição.
  if (avisoNaTela) return;
  avisoNaTela = true;

  notaFixa("Há uma versão nova do site.", {
    rotulo: "Atualizar",
    acao: () => assume(registro),
  });
}

function vigia(registro) {
  // Já havia uma esperando quando esta página abriu — acontece com
  // duas abas do site abertas, ou quando o aviso anterior foi
  // ignorado.
  if (registro.waiting && navigator.serviceWorker.controller) {
    chegouVersaoNova(registro);
  }

  registro.addEventListener("updatefound", () => {
    const nova = registro.installing;
    if (!nova) return;

    nova.addEventListener("statechange", () => {
      // Sem controlador é a primeira visita: não há versão anterior
      // para trocar, a pessoa já está vendo esta.
      if (nova.state === "installed" && navigator.serviceWorker.controller) {
        chegouVersaoNova(registro);
      }
    });
  });
}

function confere(registro) {
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
    if (!document.hidden) confere(registro);
  });
  window.addEventListener("focus", () => confere(registro));
}
