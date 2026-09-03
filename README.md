# Linkhub · Turma CC 1A · CESAR School

Site da turma 1A de Ciência da Computação, semestre 2026.2, 1º período. Fiz pra
juntar num lugar só o que hoje tá espalhado em nove PDFs diferentes: o
cronograma das cinco matérias, como cada nota é composta, a semana de aula, os
links institucionais e os documentos com leitura embutida.

A tela inicial já abre mostrando o que precisa ser feito agora e os próximos
eventos avaliativos, pra ninguém ser pego de surpresa por uma prova no meio da
rotina.

## Como o site é organizado

Quatro telas, sempre ao alcance: no computador ficam numa coluna à esquerda; no
celular, num menu no rodapé, onde o polegar chega.

| Tela | O que tem |
|---|---|
| **Painel** | Os avisos com prazo, o alerta "não deixe passar", atalhos institucionais, a semana de aula e as monitorias |
| **Agenda** | Os 200 eventos do semestre, em malha do mês ou em lista, com filtro por matéria |
| **Matérias** | Uma ficha por matéria: docentes, composição da AV1 e da AV2, regras de atraso e de uso de IA |
| **Arquivos** | Os nove documentos, com leitura dentro do site e download |

## Os avisos

O alerta abaixo diz **quando** é a entrega. O aviso diz **como** entregar — e
existe porque o alerta não dava conta do caso da Lista 01 de Sistemas Digitais:
lá, o nome do arquivo errado zera a lista inteira, por mais certas que estejam as
questões. Isso não cabe numa linha de observação.

Cadastra-se em `src/scripts/dados/avisos.js`, e o cartão monta sozinho: selo e cor
da matéria, contagem regressiva, o link do Classroom (lido de `materias.js`, não
duplicado aqui) e as regras.

As regras vão em três níveis, porque as consequências são três e misturá-las
esconde a que mais dói:

| nível | quer dizer |
|---|---|
| `faca` | como fazer certo |
| `zera` | o que zera a atividade inteira |
| `perde` | o que faz aquela questão não pontuar |

Duas coisas que valem destacar:

- **O aviso vence sozinho.** Ele fica no ar o dia inteiro do `prazo` e some no dia
  seguinte. Quando não sobra nenhum, a seção inteira desaparece — título e tudo —
  e o Painel volta a começar por "não deixe passar". Ninguém precisa voltar lá pra
  apagar.
- **A checklist é do aluno.** As caixas de "antes de enviar, confira" ficam no
  `localStorage` do aparelho de quem marcou, na chave `linkhub:conferencias`. É
  lembrete pessoal: a escola não vê, e o site também não manda nada pra lugar
  nenhum. Marcar uma caixa não redesenha a seção (isso fecharia a gaveta e tiraria
  o foco de onde o dedo está) — só o placar muda. O que sobra de aviso vencido é
  descartado no desenho seguinte.

O `id` do aviso e o `id` de cada item da checklist são a chave desse
armazenamento: mudar um deles depois de publicado apaga as marcações de quem já
tinha conferido.

## O alerta "não deixe passar"

A lista se atualiza sozinha — a cada carregamento ela recalcula em cima da data
de hoje, então quando um evento passa ele sai da lista e o próximo entra no
lugar. Não precisa editar nada manualmente.

Só entram eventos que valem nota (prova, AV, atividade avaliativa, entrega,
apresentação, projeto). Aula comum não aparece aqui.

A janela é de 20 dias: um evento só aparece quando faltam 20 dias ou menos. Sem
esse corte, numa semana tranquila o alerta ia mostrar uma prova a 45 dias de
distância e perder toda a força. Dá pra mudar em `src/scripts/dados/turma.js`:

```js
aviso: {
  janelaDias: 20,   // de quantos dias antes o evento aparece
  maximo: 3,        // quantos cartões de uma vez
},
```

O alerta tem três estados: se tem avaliação na janela, mostra até 3 cartões (o
primeiro em destaque, com um botão "+N avaliações depois" que leva pra agenda);
se não tem nada nos próximos 20 dias mas tem coisa depois, mostra "Nada nos
próximos 20 dias" já dizendo qual é a próxima; e se acabou tudo, mostra
"Semestre encerrado". No semestre 2026.2 o maior intervalo entre avaliações é de
15 dias, então o estado do meio nem chega a aparecer com a janela padrão — deixei
ele pronto pra quando alguém diminuir a janela ou mexer nas datas.

A urgência é dita por escrito ("É hoje", "É amanhã", "Faltam 9 dias") e
reforçada por uma régua que enche conforme a data se aproxima, dando a escala num
relance. Nada de emoji de expressão facial: "😳" não informa se falta um dia ou
cinco, e some para quem usa leitor de tela.

Também cuidei da virada da meia-noite: como o site fica instalado no celular e
pode ficar dias aberto, se a data fosse lida só uma vez ele ia travar no dia em
que foi aberto e continuar dizendo "É hoje!" pro evento de ontem. Por isso a data
é reconferida quando o app volta do segundo plano, quando a janela recebe foco, e
a cada 10 minutos como rede de segurança.

## A leitura de PDF

Clicar num documento abre ele dentro do site, com botão de baixar e de abrir em
nova aba. Tem dois motores por baixo e a escolha entre eles é automática: no
computador uso o `<iframe>` com o leitor do próprio navegador (vem com busca,
seleção de texto e impressão de graça); no celular uso o pdf.js desenhando num
`<canvas>`, porque nem o Chrome do Android nem o Safari do iPhone têm leitor de
PDF embutido.

Esse foi o ponto que mais me pegou de surpresa: no celular, um `<iframe>`
apontando pra um PDF simplesmente não mostra nada — devolve um retângulo em
branco ou baixa o arquivo direto. Como a turma abre esse site quase todo pelo
telefone, a leitura precisava funcionar justamente aí, e a única saída é o site
desenhar as páginas por conta própria.

A biblioteca (Mozilla pdf.js) fica em `assets/vendor/pdfjs/` — tem um `LEIAME.md`
lá com a versão e como atualizar. São 1,8 MB, então só baixa quando alguém abre o
primeiro documento; depois disso o service worker guarda em cache e a leitura
passa a funcionar offline.

Alguns detalhes que ficaram no código e não são óbvios de primeira:

- Só o que está à vista (mais uma tela pra cada lado) vira imagem — o resto é
  descartado. Sem isso as 39 páginas do manual do estudante estouram a memória de
  um celular mais fraco. Medido: com o manual aberto, fica 1 página desenhada de
  39.
- O arquivo é baixado inteiro, de uma vez. O pdf.js por padrão pede pedaços com
  cabeçalho `Range`, só que a resposta `206` que volta não dá pra gravar no Cache
  API — o documento nunca ficaria disponível offline. Por isso `disableRange:
  true`, com uma barra de progresso pro manual, que tem 3,7 MB.
- Depois de mudar a ampliação é preciso mandar redesenhar na mão. O
  `IntersectionObserver` só avisa quando o cruzamento muda, e ao ampliar as
  páginas que já estavam à vista continuam à vista — nenhum aviso chegaria e a
  tela ficaria vazia.
- A altura de cada página é calculada em JavaScript, não com `aspect-ratio`,
  porque isso só existe do Safari 15 pra frente, e um iPhone velho é exatamente o
  aparelho que mais precisa dessa leitura.
- O texto da página vai junto do `<canvas>`, só que invisível — um canvas é
  imagem pura, então sem isso leitor de tela não acharia nem uma palavra, e não
  daria pra copiar um trecho.

Se a leitura falhar nos dois motores, aparece a capa do documento com os botões
de baixar e abrir, então ninguém fica sem acesso ao arquivo.

## O QR Code é gerado aqui dentro

O código do site é desenhado num `<canvas>` pelo próprio navegador, sem pedir a
imagem pra nenhum serviço na internet. Três razões: funciona offline (que é
justamente quando alguém quer mostrar a tela pra um colega em sala), não entrega
o endereço da turma pra um terceiro, e não quebra no dia em que um serviço
gratuito sair do ar. A biblioteca tem 21 KB e só baixa quando alguém abre o QR
pela primeira vez — veja `assets/vendor/qr/LEIAME.md`.

## Rodando na sua máquina

**Dá dois cliques no `abrir.cmd`.** Ele sobe o servidor e abre o navegador
sozinho. Pra desligar, fecha a janela preta que aparece.

> ⚠️ **Não abra o `index.html` com dois cliques.** A página abre, mas fica com
> todos os espaços em branco — logo, menu e títulos aparecem, e nada mais.
>
> O motivo: o site é feito de módulos ES, e o navegador se recusa a carregar
> módulo vindo de `file://` por política de origem. Não é erro no código; é
> regra do navegador, e vale pra qualquer site feito assim. Servido por HTTP,
> mesmo que seja o servidor do seu próprio computador, funciona.

Quem preferir fazer na mão, ou estiver em Mac/Linux:

```bash
cd linkhub-cc-1a
python -m http.server 8000
```

Depois é só abrir <http://localhost:8000>.

No VS Code também dá: instala a extensão **Live Server** e clica em *Go Live* no
canto inferior direito.

Dica pra testar: dá pra acrescentar `?hoje=2026-10-13` na URL pra fazer o site
fingir que hoje é outro dia. Ajuda a conferir se o alerta dos próximos eventos e
o destaque na agenda estão certos sem precisar mexer no relógio do computador.

## O que ainda falta preencher

Tudo que aparece como "A confirmar" no site vem de `src/scripts/dados/turma.js`.
O site funciona normal com esses campos vazios, só mostra o aviso no lugar da
informação. Procure por `← preencher` no arquivo:

- `grupoWhatsapp` — link de convite do grupo da turma. Enquanto vazio, o botão
  fica escondido.
- `responsavel` — nome, GitHub e LinkedIn, vão pro rodapé.
- `endereco` — endereço final do site, usado no QR Code. Vazio usa o endereço
  atual.
- `monitorias` — dia, horário, sala e link, quando forem divulgados. Cada entrada
  aceita também `monitores: [{ nome, slack, email }]`, que vira uma gaveta de
  contatos dentro do card (`slack` é opcional). Sistemas Digitais, Matemática para
  Computação e Introdução à Computação já estão preenchidas; as outras três ainda
  não têm monitor divulgado.
- **Os nomes dos monitores de IC.** De `blgv@`, `grl2@` e `pvcb@` só saiu o
  e-mail, então o cartão mostra o início do endereço no lugar do nome. O de
  `tgab@` ("Thony") veio da lista de SD, onde a mesma pessoa também é monitora.

Os seis links do Google Classroom já estão em `src/scripts/dados/materias.js`. Eles
só abrem numa sessão logada na conta **@cesar.school** — em outra conta o Google
não encontra a turma, e é isso que a nota no alto da tela Matérias avisa.

A semana de aula já está completa, transcrita de "CC 1º Período A - Horários
2026.2.pdf":

| | SEGUNDA | TERÇA | QUARTA | QUINTA | SEXTA |
|---|---|---|---|---|---|
| **08:15–10:15** | Sistemas Digitais | Fund. de Programação | Sistemas Digitais | Fund. de Programação | FP1 · online |
| **10:30–12:30** | Matemática | Introdução à Comp. | Matemática | Introdução à Comp. | livre |
| **13:30–14:30** | livre | Projeto 1 | Projeto 1 | Projeto 1 | livre |

Tudo presencial acontece na Sala 205 · Brum.

Não mexe no `index.html` direto — todo o conteúdo é gerado a partir dos arquivos
de dados.

## Estrutura

```
linkhub-cc-1a/
├── abrir.cmd                  ◄── dois cliques aqui pra ver o site
├── index.html                 A casca da página (4 telas)
├── manifest.webmanifest       Configuração do app instalável
├── sw.js                      Service worker — faz o site abrir offline
├── robots.txt
├── assets/
│   ├── pdfs/                  Os 9 documentos
│   ├── img/                   Logo
│   └── vendor/
│       ├── pdfjs/             Desenha o PDF no celular
│       └── qr/                Gera o QR Code sem internet
└── src/
    ├── estilos/
    │   ├── base.css           Reset, variáveis, tipografia
    │   ├── casca.css          Lateral, trilha, janelas, rodapé
    │   └── componentes.css    As peças de cada tela
    └── scripts/
        ├── main.js            Boot e navegação entre telas
        ├── leitor-pdf.js      Os dois motores de leitura
        ├── dados/
        │   ├── turma.js       ◄── edita aqui (atalhos, semana, monitorias)
        │   ├── materias.js    Docentes, ementa, Classroom e composição das notas
        │   ├── avisos.js      ◄── edita aqui (recados com prazo e regras)
        │   ├── cronograma.js  160 eventos dos conteúdos programáticos
        │   └── institucional.js  40 datas do Calendário Acadêmico
        ├── nucleo/
        │   ├── datas.js       Leitura de datas e virada do dia
        │   ├── dom.js         Escape, seleção, delegação de eventos
        │   ├── estado.js      Filtros, modo e persistência
        │   ├── eventos.js     Catálogo unificado e tipos
        │   ├── conferencia.js Checklist dos avisos, guardada no aparelho
        │   ├── paleta.js      Cores por matéria
        │   ├── pecas.js       Selo, etiqueta e linha de evento
        │   ├── nota.js        Confirmações passageiras
        │   ├── janela.js      Janelas com foco preso
        │   ├── tema.js        Claro, escuro e sistema
        │   ├── qr.js          QR Code gerado no navegador
        │   ├── compartilhar.js
        │   └── instalar.js
        └── telas/
            ├── painel.js
            ├── agenda.js
            ├── materias.js
            └── arquivos.js
```

## Cores

A casca do site é neutra de propósito — tinta sobre papel. A única cor saturada
da página pertence às matérias, e é isso que faz uma prova de Sistemas Digitais
se distinguir de uma entrega de Projeto 1 num relance. Um acento colorido na
interface competiria com essas sete cores e embaralharia o sinal.

As cores das matérias ficam em `src/estilos/base.css`, no bloco "Cores das
matérias". Cada uma tem dois valores: `--c-<id>` é a matiz cheia, usada em pinos,
bordas e faixas; `--c-<id>-txt` é uma variante mais escura, usada só em texto
pequeno. A separação existe porque a matiz cheia sozinha não alcança o contraste
4,5:1 que a WCAG AA exige pra texto pequeno no tema claro — se for trocar uma
cor, troca as duas. O tema escuro redefine os mesmos valores com matizes mais
claras, por isso o JavaScript nunca escreve hexadecimal direto no HTML, sempre
`var(--c-ic)` e afins.

## Como levantei as datas

Todos os eventos saíram dos Planos de Ensino oficiais e do Calendário Acadêmico
2026.2, extraídos com:

```bash
pdftotext -raw -enc UTF-8 "plano.pdf" saida.txt
```

A flag `-raw` é obrigatória — nos modos `-layout` e `-table` as células de duas
linhas fazem o rótulo Aula/Data flutuar e o conteúdo cola na aula errada (em
`-layout` o Rec'n Play de FP caía em 20/10 em vez de 12/11). O `-raw` respeita a
ordem do fluxo de conteúdo e acerta.

Encontrei quatro pontos em que os documentos oficiais se contradizem entre si.
Todos estão marcados com uma observação no próprio evento, visível no site:

| Item | O que foi encontrado | O que usei |
|---|---|---|
| Matemática, aulas 14 e 15 | O plano traz 28/10 e 30/10, entre aulas de 23/09 e 05/10 | 28/09 e 30/09 — bate com os dias da semana e com a janela oficial de AV1 (30/9 a 6/10) |
| Status Report 1 | Calendário Acadêmico diz 25/09; planos de SD, IC e FP1 dizem 24/09 | 24/09, que é o que três planos concordam |
| Sistemas Digitais, 24/11 | Cai numa terça, fora dos dias da matéria (seg/qua) | Mantive como está no plano |
| Grade de horários, quinta 10:30 | O código `00003` (Sistemas Digitais) aparece com o nome "Introdução à Computação" | Corrigi pra Introdução à Computação — o código certo dela é `00001`, e os planos confirmam IC às ter/qui e SD às seg/qua |

O plano de FP1 também traz `COMP20252_1A` e `Semestre 2026.1` no cabeçalho, o que
é erro do próprio documento, já que todas as datas são de 2026.2.

Vale lembrar que os professores podem alterar o cronograma durante o semestre —
na dúvida, confirma em sala.

## Publicando

Qualquer hospedagem de site estático serve. As três mais simples:

- **Vercel** — instala a CLI, roda `vercel` na pasta e segue as perguntas.
- **Netlify** — arrasta a pasta inteira pra <https://app.netlify.com/drop>.
- **GitHub Pages** — sobe a pasta pra um repositório, e em *Settings → Pages*
  escolhe a branch `main` e a raiz `/`.

Depois de publicar, coloca o endereço em `endereco` no `turma.js` pra o QR Code
apontar pro lugar certo.

Quando for publicar uma correção, sobe o número da `VERSAO` no topo do `sw.js`:

```js
const VERSAO = "v1";   // → "v2"
```

É isso que faz os celulares da turma descartarem o cache antigo — sem trocar a
versão, quem já abriu o site continua vendo a versão anterior. As bibliotecas e
os PDFs ficam num cache separado, sem versão: eles não mudam, e baixá-los de novo
a cada correção de data gastaria os dados de quem está no 4G.

## Acessibilidade

Todo texto colorido passa em WCAG AA nos dois temas (medido: as sete matérias
ficam entre 4,7:1 e 7,9:1 no tema claro), e a cor nunca é o único sinal — todo
evento traz também a sigla da matéria e um símbolo do tipo. Na agenda, eventos
avaliativos aparecem como anel e aulas comuns como bolinha cheia, então dá pra
distinguir sem enxergar cor.

A trilha navega pelas setas do teclado, `Esc` fecha qualquer janela, e as janelas
prendem o foco enquanto estão abertas e o devolvem ao botão que as abriu. Os
títulos de cada tela existem para leitor de tela mesmo sem aparecer na página.
`prefers-reduced-motion` desliga as animações — menos as confirmações passageiras,
que perdem o movimento mas mantêm a duração, senão sumiriam antes de dar pra ler.
Na leitura de PDF do celular, o texto de cada página acompanha a imagem de forma
invisível, pra leitor de tela e pra dar pra copiar.

O tema tem três posições em vez de duas: claro, escuro e sistema. A terceira é a
que costuma faltar — quem deixa o computador trocar de tema sozinho ao anoitecer
quer que o site acompanhe, e num interruptor de duas posições não existe como
pedir isso.
