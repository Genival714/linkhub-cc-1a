// ============================================================
//  Núcleo · Tema
//
//  Três posições em vez de duas: claro, escuro e sistema.
//
//  A terceira é a que faltava. Quem deixa o computador trocar de
//  tema sozinho ao anoitecer quer que o site acompanhe, e num
//  interruptor de duas posições não existe como pedir isso — a
//  primeira escolha manual congela o site naquele tema para sempre.
//
//  Aqui o "sistema" é uma opção de verdade: fica ouvindo o
//  prefers-color-scheme e vira junto, com o site aberto.
// ============================================================

const CHAVE = "linkhub:tema";
const MODOS = ["claro", "escuro", "sistema"];

const sensor = window.matchMedia("(prefers-color-scheme: dark)");

// Estas duas cores pintam a barra de status do celular quando o
// site roda instalado. Precisam bater com --papel de cada tema.
const BARRA = { claro: "#f7f6f3", escuro: "#14161a" };

function lePreferencia() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return MODOS.includes(salvo) ? salvo : "sistema";
  } catch {
    return "sistema";
  }
}

let preferencia = lePreferencia();

const resolvido = () =>
  preferencia === "sistema" ? (sensor.matches ? "escuro" : "claro") : preferencia;

function pinta() {
  const tema = resolvido();
  document.documentElement.dataset.tema = tema;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", BARRA[tema]);

  // O controle mostra qual das três posições está escolhida — a
  // preferência, não o tema resolvido: quem escolheu "sistema"
  // precisa ver "sistema" marcado, mesmo estando escuro agora.
  document.querySelectorAll("[data-tema-opcao]").forEach((botao) => {
    botao.setAttribute(
      "aria-checked",
      String(botao.dataset.temaOpcao === preferencia),
    );
  });
}

export function defineTema(modo) {
  if (!MODOS.includes(modo)) return;
  preferencia = modo;
  try {
    localStorage.setItem(CHAVE, modo);
  } catch {
    /* armazenamento bloqueado — vale só para esta sessão */
  }
  pinta();
}

export function instala() {
  // O sistema operacional mudou de tema com o site aberto.
  sensor.addEventListener("change", () => {
    if (preferencia === "sistema") pinta();
  });

  document.addEventListener("click", (ev) => {
    const botao = ev.target.closest("[data-tema-opcao]");
    if (botao) defineTema(botao.dataset.temaOpcao);
  });

  pinta();
}
