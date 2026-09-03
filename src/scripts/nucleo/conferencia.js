// ============================================================
//  Núcleo · Conferência dos avisos
//
//  A checklist que o aluno marca antes de enviar uma entrega.
//  Fica no aparelho dele, no localStorage — é lembrete pessoal,
//  não dado da turma, e ninguém mais precisa ver.
//
//  Mora fora de estado.js de propósito: aquele arquivo é o estado
//  da agenda, com ouvintes que redesenham a tela a cada mudança.
//  Aqui não há redesenho — marcar uma caixa não pode fechar a
//  gaveta nem tirar o foco de onde o dedo está.
//
//  Toda leitura e escrita é protegida: modo privado, armazenamento
//  bloqueado ou cota estourada não podem derrubar a página. O pior
//  que acontece é a marcação não sobreviver ao recarregamento.
// ============================================================

const CHAVE = "linkhub:conferencias";

/** { "sd-lista-01": ["pdf", "nome"] } */
function leTudo() {
  let bruto;
  try {
    bruto = localStorage.getItem(CHAVE);
  } catch {
    return {};
  }
  if (!bruto) return {};

  try {
    const salvo = JSON.parse(bruto);
    // Um dado corrompido à mão não pode virar exceção lá na frente
    return salvo && typeof salvo === "object" && !Array.isArray(salvo) ? salvo : {};
  } catch {
    return {};
  }
}

function gravaTudo(mapa) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(mapa));
  } catch {
    /* sem espaço ou sem permissão — segue sem guardar */
  }
}

/** Os itens já marcados de um aviso. */
export function marcadas(avisoId) {
  const lista = leTudo()[avisoId];
  return new Set(Array.isArray(lista) ? lista : []);
}

/** Marca ou desmarca um item. */
export function marca(avisoId, itemId, ligado) {
  const mapa = leTudo();
  const atual = marcadas(avisoId);

  if (ligado) atual.add(itemId);
  else atual.delete(itemId);

  // Aviso sem nenhum item marcado não precisa ocupar espaço
  if (atual.size) mapa[avisoId] = [...atual];
  else delete mapa[avisoId];

  gravaTudo(mapa);
}

/**
 * Descarta o que sobrou de avisos que já venceram. Sem isto o
 * armazenamento acumularia a checklist de todas as entregas do
 * semestre, e nenhuma delas volta a ser exibida.
 */
export function limpaAntigas(idsAtivos) {
  const mapa = leTudo();
  const vivos = new Set(idsAtivos);

  let mudou = false;
  for (const id of Object.keys(mapa)) {
    if (!vivos.has(id)) {
      delete mapa[id];
      mudou = true;
    }
  }

  if (mudou) gravaTudo(mapa);
}
