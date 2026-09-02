# pdf.js

Biblioteca da Mozilla que desenha PDF numa página web.
Versão **4.10.38**, build `legacy` (a de compatibilidade mais ampla).
Licença Apache 2.0 — veja LICENSE.

Os dois arquivos vieram do pacote oficial `pdfjs-dist`, sem alteração:

| Arquivo | De onde |
|---|---|
| `pdf.min.mjs` | `pdfjs-dist/legacy/build/pdf.min.mjs` |
| `pdf.worker.min.mjs` | `pdfjs-dist/legacy/build/pdf.worker.min.mjs` |

## Por que estão aqui, e não num CDN

O site tem de abrir offline. Um `<script src="https://cdn...">`
quebraria a pré-visualização justamente no cenário em que ela mais
serve — sem sinal, no corredor da faculdade. Com os arquivos no
repo, o service worker os guarda como qualquer outro recurso.

## Por que a biblioteca existe no projeto

Nem o Chrome do Android nem o Safari do iPhone têm leitor de PDF
embutido. Num `<iframe>` eles mostram um retângulo em branco ou
baixam o arquivo. Como a turma abre este site quase todo pelo
celular, o `src/scripts/leitor-pdf.js` desenha o PDF por conta
própria nesses casos.
No computador, onde o navegador tem leitor, ele continua sendo
usado — tem busca e seleção de texto de graça.

## São 1,8 MB. Isso pesa?

Uns 530 KB comprimidos, e **só baixam quando alguém abre o primeiro
documento** (`import()` dinâmico em `src/scripts/leitor-pdf.js`). Quem nunca toca num
PDF não paga nada por eles.

As pastas `standard_fonts` e `cmaps` do pacote (mais 2,3 MB) **não**
foram incluídas: os nove PDFs da turma trazem as fontes embutidas, e
foi conferido que o pdf.js não reclama de nenhuma delas. Se um dia
entrar um documento que apareça com texto faltando ou com caixas no
lugar das letras, é aí que essas pastas passam a ser necessárias.

## Atualizando

```bash
npm pack pdfjs-dist@<versão>
tar -xzf pdfjs-dist-<versão>.tgz
cp package/legacy/build/pdf.min.mjs package/legacy/build/pdf.worker.min.mjs \n   assets/vendor/pdfjs/
```

Os dois arquivos têm de vir do **mesmo** pacote: a biblioteca recusa
um worker de versão diferente.

Depois, suba a `VERSAO` no `sw.js`.
