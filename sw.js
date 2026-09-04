/* ================================================================
   Service Worker — Linkhub CC 1A

   Faz o site abrir offline depois da primeira visita.

   Quatro estratégias, uma por tipo de recurso:

   documento  o index.html: rede primeiro, cache se estiver offline.
              É o HTML que decide quais elementos existem, e os
              módulos contam com eles. Servir um index.html velho
              junto de um painel.js novo derruba a página inteira —
              foi o que aconteceu ao publicar a seção de avisos.
   casca      CSS e os módulos: responde do cache na hora e busca a
              versão nova em segundo plano. Abre instantâneo e uma
              correção de data chega na visita seguinte.
   biblioteca pdf.js e o gerador de QR: cache primeiro. São grandes,
              versionados na pasta e praticamente nunca mudam.
   documentos PDFs: cache primeiro, guardados à parte para não
              serem descartados junto com a casca a cada versão.

   ►► Ao publicar uma alteração, suba o número da VERSAO.
      É isso que descarta o cache antigo dos celulares da turma.

   A versão nova NÃO assume sozinha. Ela instala, fica esperando, e
   só toma o lugar quando a página manda — e a página recarrega
   junto. Sem isso, a troca acontece por baixo de uma página já
   rodando, que foi como um index.html velho um dia encontrou um
   painel.js novo e derrubou o site inteiro.
================================================================ */

const VERSAO = "v6";

const CACHE_CASCA = `linkhub-casca-${VERSAO}`;
const CACHE_LIB = "linkhub-biblioteca";   // sem versão: os arquivos já são versionados
const CACHE_DOCS = "linkhub-documentos";

const CASCA = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/img/school_laranja.png",

  "./src/estilos/base.css",
  "./src/estilos/casca.css",
  "./src/estilos/componentes.css",

  "./src/scripts/main.js",
  "./src/scripts/leitor-pdf.js",

  "./src/scripts/dados/turma.js",
  "./src/scripts/dados/materias.js",
  "./src/scripts/dados/cronograma.js",
  "./src/scripts/dados/institucional.js",
  "./src/scripts/dados/avisos.js",

  "./src/scripts/nucleo/datas.js",
  "./src/scripts/nucleo/dom.js",
  "./src/scripts/nucleo/estado.js",
  "./src/scripts/nucleo/eventos.js",
  "./src/scripts/nucleo/conferencia.js",
  "./src/scripts/nucleo/atualizacao.js",
  "./src/scripts/nucleo/paleta.js",
  "./src/scripts/nucleo/pecas.js",
  "./src/scripts/nucleo/nota.js",
  "./src/scripts/nucleo/janela.js",
  "./src/scripts/nucleo/tema.js",
  "./src/scripts/nucleo/qr.js",
  "./src/scripts/nucleo/compartilhar.js",
  "./src/scripts/nucleo/instalar.js",

  "./src/scripts/telas/painel.js",
  "./src/scripts/telas/agenda.js",
  "./src/scripts/telas/materias.js",
  "./src/scripts/telas/arquivos.js",

  // A biblioteca do QR entra aqui, e não no carregamento tardio como
  // o pdf.js. São 21 KB — o custo de guardar de saída é irrisório, e
  // sem isso o QR só funciona enquanto houver rede: quem abre o site,
  // fecha o servidor local (ou sai do wi-fi) e depois clica no QR
  // recebe uma falha, porque o arquivo só seria baixado nesse clique.
  // Justamente o momento em que o QR mais serve: mostrar a tela para
  // um colega em sala.
  "./assets/vendor/qr/qrcode.min.mjs",
];

const ehBiblioteca = (caminho) => caminho.includes("/assets/vendor/");
const ehDocumento = (caminho) => caminho.endsWith(".pdf");

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_CASCA)
      // addAll desiste de tudo se um único arquivo faltar. Um a um,
      // um recurso ausente não impede a instalação — o site ainda
      // abre offline, só sem aquele pedaço.
      .then((cache) => Promise.allSettled(CASCA.map((alvo) => cache.add(alvo)))),
  );
  // Sem skipWaiting aqui de propósito: quem decide a hora de trocar
  // é a página, que sabe se alguém está no meio de uma leitura.
});

// O único jeito de esta versão assumir antes de todas as abas
// fecharem. Quem manda é nucleo/atualizacao.js.
self.addEventListener("message", (evento) => {
  if (evento.data?.tipo === "assumir") self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) =>
        Promise.all(
          nomes
            // Só as cascas de versões anteriores saem. As bibliotecas
            // e os documentos ficam: baixá-los de novo a cada correção
            // de data gastaria os dados de quem está no 4G.
            .filter((nome) => nome.startsWith("linkhub-casca-") && nome !== CACHE_CASCA)
            .map((nome) => caches.delete(nome)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** Cache primeiro; só busca na rede o que ainda não estiver guardado. */
async function doCacheOuDaRede(requisicao, nomeDoCache) {
  const guardado = await caches.match(requisicao);
  if (guardado) return guardado;

  const resposta = await fetch(requisicao);
  if (resposta.ok) {
    const copia = resposta.clone();
    caches.open(nomeDoCache).then((cache) => cache.put(requisicao, copia));
  }
  return resposta;
}

/**
 * Rede primeiro, cache como rede de segurança. Só para o documento.
 *
 * Uma ida à rede por abertura custa pouco e é o que mantém o HTML e
 * os módulos em passo: sem isso o navegador pode juntar um index.html
 * de uma versão com um script de outra, e a página morre inteira.
 */
async function daRedeOuDoCache(requisicao) {
  try {
    const resposta = await fetch(requisicao);
    if (resposta.ok) {
      const copia = resposta.clone();
      caches.open(CACHE_CASCA).then((cache) => cache.put(requisicao, copia));
    }
    return resposta;
  } catch {
    // Offline: o que estiver guardado é o que há.
    return (await caches.match(requisicao)) || caches.match("./index.html");
  }
}

/** Responde do cache e atualiza em segundo plano. */
async function doCacheEnquantoAtualiza(requisicao) {
  const guardado = await caches.match(requisicao);

  const daRede = fetch(requisicao)
    .then((resposta) => {
      if (resposta.ok) {
        const copia = resposta.clone();
        caches.open(CACHE_CASCA).then((cache) => cache.put(requisicao, copia));
      }
      return resposta;
    })
    .catch(() => guardado);

  return guardado || daRede;
}

self.addEventListener("fetch", (evento) => {
  const requisicao = evento.request;
  if (requisicao.method !== "GET") return;

  const endereco = new URL(requisicao.url);

  // Fontes do Google e qualquer outro domínio vão direto para a rede.
  if (endereco.origin !== self.location.origin) return;

  // O documento vem da rede sempre que houver rede.
  if (requisicao.mode === "navigate") {
    evento.respondWith(daRedeOuDoCache(requisicao));
  } else if (ehDocumento(endereco.pathname)) {
    evento.respondWith(doCacheOuDaRede(requisicao, CACHE_DOCS));
  } else if (ehBiblioteca(endereco.pathname)) {
    evento.respondWith(doCacheOuDaRede(requisicao, CACHE_LIB));
  } else {
    evento.respondWith(doCacheEnquantoAtualiza(requisicao));
  }
});
