// ============================================================
//  Núcleo · Notas passageiras
//
//  A confirmação curta que aparece depois de uma ação ("endereço
//  copiado"). Empilha em vez de substituir: duas ações seguidas
//  deixam as duas respostas à vista.
//
//  Quem conta o tempo é o CSS. A animação `nota-vida` faz entrada,
//  espera e saída de uma vez, e a nota se remove no `animationend`
//  — sem cronômetro em JavaScript para cancelar ou vazar.
// ============================================================

const LIMITE = 3;

let caixa = null;

function caixaDeNotas() {
  if (caixa?.isConnected) return caixa;
  caixa = document.createElement("div");
  caixa.className = "notas";
  // role="status" faz o leitor de tela anunciar sem roubar o foco
  // de onde a pessoa estava.
  caixa.setAttribute("role", "status");
  caixa.setAttribute("aria-live", "polite");
  document.body.append(caixa);
  return caixa;
}

/**
 * Mostra uma nota.
 * @param {string} texto      mensagem
 * @param {"ok"|"atencao"} tom
 */
export function nota(texto, tom = "ok") {
  const alvo = caixaDeNotas();

  // Mais que três empilhadas viram parede: a mais antiga sai.
  while (alvo.childElementCount >= LIMITE) alvo.firstElementChild.remove();

  const item = document.createElement("div");
  item.className = `nota nota--${tom}`;
  item.textContent = texto;
  item.addEventListener("animationend", () => item.remove(), { once: true });
  alvo.append(item);
}
