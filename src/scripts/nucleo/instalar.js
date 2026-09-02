// ============================================================
//  Núcleo · Instalar na tela inicial
//
//  A versão anterior explicava a instalação em oito passos escritos
//  ("toque nos três pontinhos…"). Instruções assim envelhecem: o
//  Chrome mudou esse menu de lugar duas vezes.
//
//  Aqui o próprio navegador faz o trabalho. O Android avisa quando
//  a instalação está disponível pelo evento `beforeinstallprompt`;
//  guardamos esse aviso e o disparamos no clique — instalação em um
//  toque, sem instrução nenhuma.
//
//  O iPhone é a exceção: o Safari não implementa o evento e só
//  instala pelo menu de compartilhar. Para ele fica uma nota curta,
//  mostrada apenas em iPhone.
// ============================================================

const ehIPhone = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const jaInstalado = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;

let convite = null;

/**
 * Estado atual da instalação, para a interface decidir o que mostrar.
 * @returns {"instalado"|"pronto"|"manual"|"indisponivel"}
 */
export function situacao() {
  if (jaInstalado()) return "instalado";
  if (convite) return "pronto";
  if (ehIPhone()) return "manual";
  return "indisponivel";
}

/** Dispara o convite do navegador. Só vale quando a situação é "pronto". */
export async function instala() {
  if (!convite) return false;
  convite.prompt();
  const { outcome } = await convite.userChoice;
  // O convite é de uso único: o navegador manda outro se a pessoa
  // recusar agora e voltar depois.
  convite = null;
  atualiza();
  return outcome === "accepted";
}

// Chamado sempre que a disponibilidade muda, para a interface
// se redesenhar sem precisar ficar perguntando.
let aoAtualizar = () => {};
export const observa = (fn) => (aoAtualizar = fn);
const atualiza = () => aoAtualizar(situacao());

export function instalaEscuta() {
  window.addEventListener("beforeinstallprompt", (evento) => {
    // Sem isto o Chrome mostra a própria barra de instalação no
    // rodapé, que tampa o menu inferior do site.
    evento.preventDefault();
    convite = evento;
    atualiza();
  });

  window.addEventListener("appinstalled", () => {
    convite = null;
    atualiza();
  });
}
