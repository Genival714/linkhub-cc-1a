// ============================================================
//  Núcleo · Compartilhar
//
//  A turma passa este site adiante pelo grupo da turma, no
//  celular. Por isso a primeira tentativa é a folha nativa de
//  compartilhamento do aparelho (Web Share API): um toque e o
//  WhatsApp já está aberto com o link, sem passar pela área de
//  transferência.
//
//  No computador, onde essa folha não existe, cai na área de
//  transferência. E se nem isso for permitido — página sem HTTPS,
//  permissão negada —, a janela do QR mostra o endereço por
//  extenso para copiar à mão, em vez de falhar em silêncio.
// ============================================================

import { TURMA } from "../dados/turma.js";
import { nota } from "./nota.js";

/** O endereço público do site. Sem `endereco` no turma.js, usa o atual. */
export const enderecoDoSite = () =>
  TURMA.endereco || location.href.split("#")[0];

const podeCompartilhar = () => typeof navigator.share === "function";

/**
 * Compartilha o endereço do site.
 * @returns {Promise<boolean>} false quando nada foi possível — aí
 *          quem chamou decide o que mostrar no lugar.
 */
export async function compartilha() {
  const endereco = enderecoDoSite();

  if (podeCompartilhar()) {
    try {
      await navigator.share({
        title: `Linkhub · Turma ${TURMA.nome}`,
        text: `Calendário, matérias e documentos da turma ${TURMA.nome} — ${TURMA.semestre}.`,
        url: endereco,
      });
      return true;
    } catch (erro) {
      // Fechar a folha de compartilhamento cancela a promessa. Isso
      // é a pessoa desistindo, não um erro: sai calado.
      if (erro?.name === "AbortError") return true;
      // Qualquer outra falha ainda pode ser resolvida copiando.
    }
  }

  return copia(endereco);
}

/** Só copia, sem abrir a folha nativa. */
export async function copia(texto = enderecoDoSite()) {
  try {
    await navigator.clipboard.writeText(texto);
    nota("Endereço copiado");
    return true;
  } catch {
    nota("Não deu para copiar — o endereço está no QR", "atencao");
    return false;
  }
}
