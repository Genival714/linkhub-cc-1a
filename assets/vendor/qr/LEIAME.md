# qrcode-generator

Biblioteca de Kazuhiko Arase que codifica um texto em QR Code.
Versão **1.4.4**. Licença MIT — veja LICENSE.

| Arquivo | De onde |
|---|---|
| `qrcode.min.mjs` | `qrcode-generator@1.4.4/qrcode.min.js` |

## A única alteração feita no arquivo

O original é UMD: declara `var qrcode = …` e no rodapé detecta AMD
ou CommonJS. Num módulo ES nenhum dos dois existe, então aquele
rodapé não faz nada e o `qrcode` ficaria preso no escopo do módulo,
inacessível de fora. Duas mudanças resolvem:

1. Removida a linha `//# sourceMappingURL=…`, que apontava para um
   arquivo de mapa que não trouxemos e daria 404 no console.
2. Acrescentado `export default qrcode;` no final.

O corpo da biblioteca está intacto. Ao atualizar, refaça os dois
passos:

```bash
curl -L -o qrcode.min.mjs \
  https://cdn.jsdelivr.net/npm/qrcode-generator@<versão>/qrcode.min.js
sed -i '/sourceMappingURL/d' qrcode.min.mjs
printf '\nexport default qrcode;\n' >> qrcode.min.mjs
```

Depois, suba a `VERSAO` no `sw.js`.

## Por que gerar o QR aqui, e não pedir a um serviço

A versão anterior do site montava uma URL de um gerador online e
usava a resposta como `<img src>`. Funcionava, mas trazia três
problemas:

- **Não funcionava offline.** O QR serve justamente para mostrar a
  tela do celular a alguém em sala, que é onde o wi-fi cai.
- **Entregava o endereço do site a um terceiro.** Cada abertura do
  QR contava para o serviço qual é a URL da turma.
- **Dependia de um serviço gratuito continuar existindo.** No dia
  em que saísse do ar, o site quebraria sem ninguém ter mexido nele.

## 21 KB pesam?

Uns 7 KB comprimidos, e **só baixam quando alguém abre o QR pela
primeira vez** (`import()` dinâmico em `src/scripts/nucleo/qr.js`) —
mesmo tratamento dado ao pdf.js. Quem nunca abre o QR não paga nada
por ela.
