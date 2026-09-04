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

  // Mais que três empilhadas viram parede: a mais antiga sai. As
  // fixas ficam — elas esperam uma decisão, não o relógio.
  while (alvo.childElementCount >= LIMITE) {
    const velha = alvo.querySelector(".nota:not(.nota--fixa)");
    if (!velha) break;
    velha.remove();
  }

  const item = document.createElement("div");
  item.className = `nota nota--${tom}`;
  item.textContent = texto;
  item.addEventListener("animationend", () => item.remove(), { once: true });
  alvo.append(item);
}

/**
 * Nota que fica até a pessoa resolver, com um botão de ação.
 *
 * Para o que não pode sumir sozinho — o convite a atualizar o site,
 * que se apagasse em três segundos não serviria de nada.
 *
 * @param {string} texto
 * @param {{rotulo?: string, acao?: () => void}} botao
 * @returns {() => void} tira a nota da tela
 */
export function notaFixa(texto, { rotulo, acao } = {}) {
  const alvo = caixaDeNotas();

  const item = document.createElement("div");
  item.className = "nota nota--fixa";

  const frase = document.createElement("span");
  frase.textContent = texto;
  item.append(frase);

  if (rotulo) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "nota-botao";
    botao.textContent = rotulo;
    botao.addEventListener("click", () => {
      item.remove();
      acao?.();
    });
    item.append(botao);
  }

  alvo.append(item);
  return () => item.remove();
}
