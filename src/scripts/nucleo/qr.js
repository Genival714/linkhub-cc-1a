// ============================================================
//  Núcleo · QR Code
//
//  O código é gerado aqui dentro, num <canvas>, em vez de vir
//  pronto de um serviço na internet. Três razões:
//
//  1. Funciona offline. O QR serve justamente para mostrar a tela
//     do celular para alguém em sala — onde o wi-fi cai.
//  2. Ninguém de fora precisa saber o endereço do site. Pedir a
//     imagem a um terceiro entrega a URL da turma junto.
//  3. Um serviço gratuito pode sair do ar ou passar a cobrar, e o
//     site quebraria sem ninguém mexer nele.
//
//  A biblioteca (21 KB) só é baixada quando alguém abre o QR pela
//  primeira vez — mesmo tratamento dado ao pdf.js.
// ============================================================

let biblioteca = null;
let carregando = null;

function carrega() {
  if (biblioteca) return Promise.resolve(biblioteca);
  if (!carregando) {
    // O endereço é resolvido contra o da página: o site pode morar
    // numa subpasta (usuario.github.io/linkhub-cc-1a/), e um caminho
    // absoluto apontaria para a raiz do domínio, que não é nossa.
    const alvo = new URL("../../../assets/vendor/qr/qrcode.min.mjs", import.meta.url);
    carregando = import(alvo.href)
      .then((mod) => (biblioteca = mod.default))
      .catch((erro) => {
        carregando = null;
        throw erro;
      });
  }
  return carregando;
}

/**
 * Desenha o QR num canvas.
 *
 * Preto sobre branco nos dois temas, de propósito: leitor de QR
 * espera módulos escuros sobre fundo claro, e inverter derruba a
 * taxa de leitura em vários aparelhos. O canvas fica com moldura
 * branca própria, então não destoa dentro da janela escura.
 *
 * @param {string} texto     conteúdo codificado
 * @param {number} lado      lado do canvas em pixels de CSS
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function desenha(texto, lado = 240) {
  const qrcode = await carrega();

  // 0 = a biblioteca escolhe a menor versão que couber.
  // "M" corrige até 15% de sujeira ou reflexo — o equilíbrio usual
  // para um código que vai ser lido de uma tela.
  const codigo = qrcode(0, "M");
  codigo.addData(texto);
  codigo.make();

  const modulos = codigo.getModuleCount();
  const MARGEM = 4; // "zona quieta" mínima que a norma exige

  // Cada módulo tem de cair num número inteiro de pixels, senão o
  // arredondamento deixa fileiras com um pixel a mais e o leitor
  // perde a grade.
  const escala = Math.max(1, Math.floor(lado / (modulos + MARGEM * 2)));
  const pixels = (modulos + MARGEM * 2) * escala;

  const canvas = document.createElement("canvas");
  const nitidez = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = pixels * nitidez;
  canvas.height = pixels * nitidez;
  canvas.style.width = `${pixels}px`;
  canvas.style.height = `${pixels}px`;

  const tela = canvas.getContext("2d");
  tela.scale(nitidez, nitidez);
  tela.fillStyle = "#ffffff";
  tela.fillRect(0, 0, pixels, pixels);
  tela.fillStyle = "#000000";

  for (let linha = 0; linha < modulos; linha++) {
    for (let coluna = 0; coluna < modulos; coluna++) {
      if (!codigo.isDark(linha, coluna)) continue;
      tela.fillRect(
        (coluna + MARGEM) * escala,
        (linha + MARGEM) * escala,
        escala,
        escala,
      );
    }
  }

  return canvas;
}

/** O mesmo código, em PNG, pronto para salvar. */
export async function comoArquivo(texto, lado = 640) {
  const canvas = await desenha(texto, lado);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas vazio"))),
      "image/png",
    );
  });
}
