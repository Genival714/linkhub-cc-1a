// ============================================================
//  CESAR School · Linkhub CC 1A · Avisos da turma
//
//  ►► É AQUI que se cadastra um recado com prazo — uma entrega
//     com regras de formato, um trabalho que precisa de nome
//     específico, qualquer coisa que zera a nota se for feita
//     errado.
//
//  O aviso VENCE SOZINHO: fica no alto do Painel o dia inteiro do
//  `prazo` e some no dia seguinte. Ninguém precisa voltar aqui
//  para apagar — se a seção "Avisos" está vazia, ela desaparece e
//  o Painel volta a começar por "Não deixe passar".
//
//  Campos:
//    id           identificador curto e estável (a checklist do
//                 aluno é guardada por este id — não mude depois
//                 de publicar, ou as marcações se perdem)
//    disc         id da disciplina (ver materias.js) — dá a cor,
//                 o selo e o link do Classroom do cartão
//    tipo         tipo do evento (ver eventos.js) — dá a etiqueta
//    titulo       o nome da atividade
//    prazo        "AAAA-MM-DD" — o último dia em que aparece
//    hora         "23:59", opcional
//    resumo       uma frase: o que precisa ser feito
//    arquivo      nome exigido do arquivo, opcional. Vira um bloco
//                 com botão de copiar
//    arquivoNota  a pegadinha do nome, opcional
//    documento    { caminho, titulo, simbolo, resumo, rotulo } — o
//                 arquivo da atividade, opcional. Abre no leitor do
//                 próprio site, com botão de baixar dentro. Fica só
//                 aqui e some junto com o aviso; de propósito não
//                 entra na lista de `arquivos` do turma.js, que é
//                 permanente
//    conferir     [{ id, texto }] — a checklist que o aluno marca
//                 antes de enviar. O `id` também é guardado, então
//                 vale a mesma regra de estabilidade
//    conferirTitulo  título da checklist, opcional. O padrão é
//                 "Antes de enviar, confira"; numa apresentação
//                 faz mais sentido "Antes de apresentar, confira"
//    gaveta       título da gaveta de regras, opcional. O padrão é
//                 "Como entregar sem perder ponto"
//    regras       [{ nivel, texto }] com nivel:
//                   "faca"   → como fazer certo
//                   "avalia" → o que o professor olha ao dar a nota
//                              (critérios de apresentação)
//                   "proibido" → o que o documento proíbe sem dizer
//                              a consequência. Se ele disser que
//                              zera, é "zera"
//                   "zera"   → o que zera a atividade inteira
//                   "perde"  → o que faz a questão não pontuar
//    etapas       [{ data, hora, titulo, texto }] — atividade em mais
//                 de um passo (leitura → entrega → aula). Vira uma
//                 linha do tempo logo abaixo do resumo; o que já passou
//                 fica apagado. O `prazo` do aviso é o ÚLTIMO passo
//    grupos       { titulo, nota, itens: [{ numero, tema, integrantes,
//                 nota, documento }] } — trabalho em grupo: quem está
//                 com quem e qual o tema de cada um. Vira uma gaveta
//                 própria, fechada, antes da gaveta de regras. Cada
//                 item pode ter uma `nota` (a leitura, por exemplo) e
//                 um `documento` próprio, que vira um botão pequeno
//    ajuda        [{ titulo, endereco, forte }] — links de apoio.
//                 `forte: true` põe o link em destaque, como o
//                 enunciado — para o formulário de entrega, por exemplo
//    dica         uma linha solta de apoio, opcional
//    duvidas      onde tirar dúvida, opcional
//
//  O link do Classroom NÃO se repete aqui: o cartão lê o campo
//  `classroom` da matéria, em materias.js.
// ============================================================

export const AVISOS = [

  {
    id: "ic-projeto-no-code",
    disc: "ic",
    tipo: "projeto",
    titulo: "Projeto Avaliativo 1 — Jogo digital No-Code",
    prazo: "2026-10-13",
    resumo: "Em grupos de até 3 pessoas, criem um jogo digital no Bitsy Tuxedo, da ideia à entrega, e apresentem o gameplay na aula de 13/10, com o relatório impresso e assinado. Vale 60% da AV1 — o maior peso da primeira unidade de IC.",

    documento: {
      caminho: "assets/pdfs/ic-template-relatorio-no-code.pdf",
      titulo: "Template do relatório · Projeto No-Code",
      simbolo: "📝",
      resumo: "4 páginas · 135 KB · a estrutura que o relatório do grupo segue, seção por seção.",
      rotulo: "Ver o template do relatório",
    },

    etapas: [
      { data: "2026-09-24", titulo: "Registro do grupo e 1ª aula de desenvolvimento", texto: "O registro é para esta aula: uma pessoa por grupo preenche o formulário (botão “Registrar o grupo”, abaixo), com a conta @cesar.school. Depois: experimentar a ferramenta, definir enredo, público-alvo e objetivo do jogo, e esboçar os visuais, as fases e as mecânicas principais." },
      { data: "2026-10-08", titulo: "Última aula de desenvolvimento", texto: "Depois dela, 09/10 e 12/10 são feriados, e a entrega é na terça, 13/10. Deixem combinado antes quem imprime o relatório e quando todo mundo assina." },
      { data: "2026-10-13", titulo: "Entrega e apresentação, na aula de IC", texto: "O grupo apresenta o jogo mostrando o gameplay e entrega o relatório impresso e assinado. Uma pessoa envia todos os entregáveis pelo formulário de entrega — que é outro, diferente do de registro." },
    ],

    gaveta: "Regras, entregáveis e critérios da nota",
    conferirTitulo: "Antes de entregar, confira",
    conferir: [
      { id: "registro", texto: "Uma pessoa registrou o grupo — até 3 pessoas — no formulário de registro" },
      { id: "jogo",     texto: "O jogo funciona do começo ao fim no Bitsy Tuxedo" },
      { id: "assets",   texto: "Nenhum asset com direitos autorais — e o 3.3 credita o que não é do grupo, ou declara que tudo é original" },
      { id: "template", texto: "O relatório segue o template, sem sobrar campo em destaque — e o 4.3 diz quem fez o quê" },
      { id: "ia",       texto: "O 3.4 declara o uso de IA — ou que não houve" },
      { id: "prints",   texto: "O 5.1 tem pelo menos 3 capturas de tela, cada uma com legenda" },
      { id: "itch",     texto: "O 5.2 tem o link do jogo no itch.io da disciplina" },
      { id: "assinado", texto: "O relatório está impresso e assinado por todos os integrantes" },
      { id: "gameplay", texto: "A apresentação com gameplay está pronta para a aula de 13/10" },
      { id: "entrega",  texto: "Uma pessoa enviou todos os entregáveis pelo formulário de entrega" },
    ],

    regras: [
      { nivel: "faca",     texto: "Grupos de até 3 pessoas. O tema, os requisitos e as mecânicas do jogo são decididos pelo próprio grupo, com a supervisão do professor." },
      { nivel: "faca",     texto: "As 5 aulas de IC entre 24/09 e 08/10 (24/09, 29/09, 01/10, 06/10 e 08/10) são para desenvolver o projeto — e “Acompanhamento” é um dos critérios da nota." },
      { nivel: "faca",     texto: "A ferramenta é o Bitsy Tuxedo, da FORJA, o estúdio de jogos da CESAR School. Roda no navegador (botão “Abrir o Bitsy Tuxedo”, abaixo). Não haverá aula sobre como usá-la: aprender pesquisando em documentação e tutoriais faz parte do projeto." },
      { nivel: "faca",     texto: "Anotem desde o começo os problemas que aparecerem, como resolveram e as limitações que acharem na ferramenta: o relatório pede isso nos itens 4.5 e 6.1." },
      { nivel: "faca",     texto: "O jogo precisa funcionar e ter uma narrativa interativa e/ou uma mecânica de jogo coerente." },
      { nivel: "faca",     texto: "Os entregáveis são três: o jogo feito no Bitsy Tuxedo, a apresentação com gameplay e o relatório de desenvolvimento, impresso e assinado. No dia da entrega, uma pessoa do grupo envia tudo pelo formulário de entrega, e o grupo leva a cópia impressa do relatório." },
      { nivel: "faca",     texto: "O relatório segue o template, seção por seção. Troquem tudo o que está marcado em destaque (semestre, turma, nome do grupo, nomes e e-mails); na capa, cada integrante assina na linha acima do próprio nome." },
      { nivel: "faca",     texto: "Atenção ao 4.3: no template ele repete por engano o título do 4.2 (“Mapa de salas e fluxo de telas”), mas pede outra coisa — quem ficou responsável por quê, uma linha por integrante." },
      { nivel: "faca",     texto: "A tabela do 4.4 é só exemplo — ela mesma avisa: “Tudo isso aqui é exemplo pelamordedeus!”. Preencham com as atividades do grupo: P para planejado, R para realizado, PR quando os dois coincidem." },
      { nivel: "faca",     texto: "Guardem capturas de tela durante o desenvolvimento: o 5.1 pede pelo menos 3, de momentos diferentes (tela inicial, gameplay, transição, vitória/derrota), cada uma com legenda de até 2 linhas." },
      { nivel: "faca",     texto: "O 5.2 pede o link do jogo publicado no itch.io da disciplina. O endereço vem do professor — se ainda não chegou até vocês, perguntem na aula." },
      { nivel: "faca",     texto: "Opcional: se o grupo quiser o jogo exposto no espaço da FORJA no Rec'n Play, o pedido vai no item 6.4 do relatório, com a justificativa." },
      { nivel: "avalia",   texto: "Acompanhamento." },
      { nivel: "avalia",   texto: "Domínio conceitual." },
      { nivel: "avalia",   texto: "Planejamento e estrutura do jogo." },
      { nivel: "avalia",   texto: "Complexidade e criatividade." },
      { nivel: "avalia",   texto: "Implementação técnica e uso da plataforma." },
      { nivel: "avalia",   texto: "Documentação e apresentação." },
      { nivel: "avalia",   texto: "Cumprimento do prazo. Atraso só com autorização prévia do professor, e com redução de 15% do valor (regra do plano de ensino)." },
      { nivel: "proibido", texto: "Usar assets com direitos autorais — sprites, tiles, sons, músicas ou fontes de outras pessoas. O caminho seguro é o grupo criar os próprios. Se forem usar algo de terceiros, confirmem com o professor antes, e creditem no item 3.3 do relatório: origem, autoria e licença." },
    ],

    ajuda: [
      { titulo: "Registrar o grupo", endereco: "https://docs.google.com/forms/d/e/1FAIpQLSdIXOtDTKBoDJiH6Jvn01A05BCIeTzs_99PMx3l00TDH9Q6yg/viewform", forte: true },
      { titulo: "Abrir o Bitsy Tuxedo", endereco: "https://tuxedo.forjagame.com/" },
    ],
    dica: "O projeto corre junto com as provas da AV1 — MC em 30/09, FP1 em 02/10, SD em 05/10 e FP em 06/10. Não deixem o jogo para a última semana.",
    duvidas: "Dúvidas: com o professor Erick, nas aulas de desenvolvimento, ou com os monitores de IC (em Monitorias, aqui no Painel).",
  },

  {
    id: "sd-lista-02",
    disc: "sd",
    tipo: "entrega",
    titulo: "Lista 02 de Sistemas Digitais",
    prazo: "2026-09-16",
    hora: "23:59",
    resumo: "Um PDF único, resolvido à mão, entregue no Classroom. Cobre ASCII, cores em hexadecimal/RGB, números negativos em binário e subtração.",

    arquivo: "Lista 2_Nome Completo",
    arquivoNota: "É “Lista 2”, e não “Lista 02”. Troque “Nome Completo” pelo seu nome.",

    documento: {
      caminho: "assets/pdfs/lista-02-sistemas-digitais.pdf",
      titulo: "Lista 02 · Sistemas Digitais",
      simbolo: "📄",
      resumo: "1 página · 44 KB · leia aqui dentro ou baixe pelo botão da leitura.",
      rotulo: "Ver a lista",
    },

    conferir: [
      { id: "pdf",     texto: "É um PDF ÚNICO — um arquivo só, com todas as questões" },
      { id: "nome",    texto: "O arquivo está nomeado no formato exigido" },
      { id: "calculo", texto: "Toda questão tem o cálculo junto" },
      { id: "mao",     texto: "Nada digitado — tudo resolvido à mão" },
    ],

    regras: [
      { nivel: "faca",  texto: "Envie um PDF ÚNICO, com todas as questões no mesmo arquivo." },
      { nivel: "faca",  texto: "Resolva no tablet e salve em PDF, ou faça no caderno/folha, tire foto e converta para PDF." },
      { nivel: "zera",  texto: "Arquivo com outro nome ou em outro formato: a lista é zerada." },
      { nivel: "zera",  texto: "Envio depois das 23:59 do dia 16/09: não é aceito." },
      { nivel: "perde", texto: "Questão sem o respectivo cálculo: não pontua." },
      { nivel: "perde", texto: "Questão digitada: não pontua." },
    ],

    ajuda: [
      { titulo: "iLovePDF · JPG para PDF", endereco: "https://www.ilovepdf.com/jpg_to_pdf" },
    ],
    dica: "Serve qualquer conversor: procure no Google por “jpg to pdf converter”.",
    duvidas: "Dúvidas sobre a correção: responda ao comentário de feedback da sua monitora ou do seu monitor, no próprio Classroom.",
  },

  {
    id: "ic-atividade-04",
    disc: "ic",
    tipo: "atividade",
    titulo: "Atividade Avaliativa 4 — Profissões em TI",
    prazo: "2026-09-17",
    resumo: "Apresentação em grupo, na aula. Cada grupo pesquisa uma profissão de TI e apresenta em 6 minutos, com um slide. Vale 15% da AV1.",

    grupos: {
      titulo: "Os 10 grupos e as profissões sorteadas",
      nota: "Os temas foram definidos por sorteio. Grupos de até 5 pessoas.",
      itens: [
        { numero: "G01", tema: "Cientista de Dados",                        integrantes: ["Duda Escanoni", "Gabriele Valença", "Laura Carvalho", "Letícia Sato"] },
        { numero: "G02", tema: "Quality Assurance",                         integrantes: ["João Henrique Araujo", "Gabriel Calado", "Raphael Pinheiro", "Bruno Parente"] },
        { numero: "G03", tema: "Engenheiro de Software",                    integrantes: ["Vitor Guilherme", "Rafael Goes", "Pedro Almeida", "Gabriel Pires"] },
        { numero: "G04", tema: "Analista de Segurança da Informação",       integrantes: ["Júlia de Melo", "Marina Cavendish", "Matheus Alexandre", "José Guilherme", "Samuel Lins"] },
        { numero: "G05", tema: "Administrador de Banco de Dados (DBA)",     integrantes: ["João Victor", "Felipe Mendonça", "Matheus Almeida", "Gabriel Ribeiro", "Isaac Gabriel"] },
        { numero: "G06", tema: "Especialista em Cloud Computing",           integrantes: ["Lucas Falk", "João Marcelo Moura", "Heitor Filgueira", "João Felipe Caminha", "Raul Santana"] },
        { numero: "G07", tema: "UX/UI Designer",                            integrantes: ["Genival da Hora", "Lucas Barros", "Lucas Mendes", "Mateus Farias", "Nunno Wakiyama"] },
        { numero: "G08", tema: "Engenheiro DevOps",                         integrantes: ["Marco Antonio P. P. Fortes Neto", "Artur de Carvalho Lyra", "Danilo Queiroz de Barros", "Rennan Luiz do Amaral"] },
        { numero: "G09", tema: "Desenvolvedor de Aplicações Mobile",        integrantes: ["Andressa", "Emmanuel", "Tarcizo"] },
        { numero: "G10", tema: "Analista de Negócios",                      integrantes: ["Gabriela Barradas", "Clara Nunes", "Manoel Carlos", "Beatriz Uchôa"] },
      ],
    },

    gaveta: "Como apresentar sem perder ponto",
    conferirTitulo: "Antes de apresentar, confira",
    conferir: [
      { id: "descricao",   texto: "O slide traz a descrição da profissão" },
      { id: "atividades",  texto: "…as principais atividades realizadas" },
      { id: "habilidades", texto: "…as habilidades técnicas e comportamentais exigidas" },
      { id: "empresas",    texto: "…empresas em Recife que contratam — de preferência do Porto Digital" },
      { id: "salario",     texto: "…a faixa salarial inicial e as oportunidades de carreira" },
      { id: "tempo",       texto: "A apresentação cabe em 6 minutos — ensaiem com cronômetro" },
      { id: "todos",       texto: "Todo mundo do grupo sabe apresentar e responder perguntas" },
    ],

    regras: [
      { nivel: "faca",   texto: "Um slide por grupo, com todas as informações coletadas. A apresentação e a entrega são na própria aula." },
      { nivel: "faca",   texto: "6 minutos de apresentação por grupo." },
      { nivel: "faca",   texto: "Quem apresenta é escolhido na hora — não dá para combinar um porta-voz. O grupo inteiro precisa dominar o conteúdo." },
      { nivel: "avalia", texto: "Clareza da apresentação." },
      { nivel: "avalia", texto: "Qualidade e relevância das informações apresentadas." },
      { nivel: "avalia", texto: "Uso de exemplos locais: empresas do Porto Digital ou de Recife." },
      { nivel: "avalia", texto: "Capacidade de responder às dúvidas dos colegas e do professor." },
      { nivel: "avalia", texto: "Cumprimento do tempo estipulado para a apresentação." },
    ],

    dica: "Vale 15% da AV1 — o mesmo peso da Atividade 3 sobre linguagens de programação.",
    duvidas: "Dúvidas: fale com o professor ou com os monitores de IC, no Classroom ou na monitoria.",
  },

  {
    id: "fp1-desaprender",
    disc: "fp1",
    tipo: "atividade",
    titulo: "Desaprender é competência — leitura, registro e aula-debate",
    prazo: "2026-09-18",
    resumo: "A aula de 18/09 depende de vocês chegarem com a leitura feita. Cada grupo de Projetos lê um trecho do texto de Silvio Meira (7 a 9 min), cada pessoa envia um registro curto até 17/09, e na aula os grupos discutem em salas separadas e apresentam no plenário.",

    etapas: [
      { data: "2026-09-17", hora: "23:59", titulo: "Registro individual de leitura — vale como presença", texto: "Cada integrante responde o formulário (botão “Responder o registro” abaixo), com a conta @cesar.school. De 5 a 8 linhas: uma afirmação do seu bloco que você considera bem sustentada e uma que considera frágil, com o motivo de cada. É individual, não é do grupo." },
      { data: "2026-09-18", titulo: "Aula no Zoom", texto: "Abertura curta → 35 min de discussão na sala do seu bloco → plenário, 2 min por bloco → atividade individual no Wayground (12 questões, 3 abertas)." },
    ],

    grupos: {
      titulo: "Qual é o bloco do seu grupo de Projetos?",
      nota: "Os grupos são os mesmos de Projeto 1. Todo mundo lê a seção 1 (a introdução) e, depois, só a seção do seu bloco. Cada bloco tem um roteiro em PDF com a leitura, os conceitos, as perguntas da discussão e o que apresentar.",
      itens: [
        { numero: "Bloco A", tema: "O dínamo e o redesenho",               integrantes: ["Grupos G1 e G8"],        nota: "Seção 2 — “antes e depois não é figura de linguagem” · ~7 min", documento: { caminho: "assets/pdfs/fp1-bloco-a-dinamo.pdf",               titulo: "Bloco A · O dínamo e o redesenho",               resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco A" } },
        { numero: "Bloco B", tema: "A armadilha da competência",           integrantes: ["Grupos G2 e G9"],        nota: "Seção 3 — “a armadilha da competência” · ~8 min",                documento: { caminho: "assets/pdfs/fp1-bloco-b-fronteira-serrilhada.pdf", titulo: "Bloco B · A armadilha da competência",           resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco B" } },
        { numero: "Bloco C", tema: "Ler Bruce Lee direito",                integrantes: ["Grupos G3 e G10"],       nota: "Seção 4 — “ler bruce lee direito” · ~8 min",                      documento: { caminho: "assets/pdfs/fp1-bloco-c-bruce-lee.pdf",            titulo: "Bloco C · Ler Bruce Lee direito",                resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco C" } },
        { numero: "Bloco D", tema: "O terceiro nível",                     integrantes: ["Grupos G4 e G11"],       nota: "Seção 5 — “o terceiro nível” · ~6 min",                           documento: { caminho: "assets/pdfs/fp1-bloco-d-bateson.pdf",              titulo: "Bloco D · O terceiro nível",                     resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco D" } },
        { numero: "Bloco E", tema: "Não há caminho para o aprendizado",    integrantes: ["Grupos G5 e G12"],       nota: "Seção 6 — “não há caminho para o aprendizado” · ~7 min",          documento: { caminho: "assets/pdfs/fp1-bloco-e-atencao.pdf",              titulo: "Bloco E · Não há caminho para o aprendizado",    resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco E" } },
        { numero: "Bloco F", tema: "A prática, numa segunda-feira",        integrantes: ["Grupos G6 e G13"],       nota: "Seção 7 — “a prática, numa segunda-feira” · ~9 min",              documento: { caminho: "assets/pdfs/fp1-bloco-f-pratica.pdf",              titulo: "Bloco F · A prática, numa segunda-feira",        resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco F" } },
        { numero: "Bloco G", tema: "O que custa, e para quem não vai dar certo", integrantes: ["Grupos G7, G14 e G15"], nota: "Seção 8 — “o que custa, e para quem não vai dar certo” · ~8 min", documento: { caminho: "assets/pdfs/fp1-bloco-g-quem-paga.pdf",            titulo: "Bloco G · O que custa, e para quem não vai dar certo", resumo: "2 páginas · roteiro do bloco", rotulo: "Roteiro do Bloco G" } },
      ],
    },

    gaveta: "Como funciona, passo a passo",
    conferirTitulo: "Antes da aula, confira",
    conferir: [
      { id: "secao1",   texto: "Li a seção 1 do texto (a introdução)" },
      { id: "bloco",    texto: "Li a seção do meu bloco — e sei explicar para quem não leu" },
      { id: "registro", texto: "Enviei o registro individual no formulário até 17/09, 23h59 — logado na conta @cesar.school" },
      { id: "roteiro",  texto: "Abri o roteiro do meu bloco e li as perguntas da discussão" },
      { id: "papeis",   texto: "Já pensei em quem pode ser relator, cronometrista e cético no grupo" },
    ],

    regras: [
      { nivel: "faca", texto: "A leitura não é opcional: cada grupo lê uma parte diferente, e no plenário vocês explicam a sua parte a quem não a leu. Se um grupo chega sem ler, ninguém mais tem acesso àquele pedaço do argumento." },
      { nivel: "faca", texto: "Leia só a seção 1 e a seção do seu bloco — de 6 a 9 minutos. O texto inteiro leva uns 43 minutos e não é para ler tudo." },
      { nivel: "faca", texto: "Registro individual até 17/09, 23h59, no formulário: 5 a 8 linhas, uma afirmação bem sustentada e uma frágil, cada uma com o porquê. Não é resumo, é julgamento — separar o que o autor sustenta com evidência do que ele afirma com convicção. Discordar é bem-vindo, desde que você diga o que estaria faltando." },
      { nivel: "faca", texto: "O formulário só aceita resposta da conta @cesar.school, e cada integrante do grupo responde o seu. O registro vale como presença na atividade." },
      { nivel: "faca", texto: "Na sala do Zoom (35 min): nos 2 primeiros minutos definam os papéis; 15 min nas três perguntas comuns a todos os blocos; 15 min na pergunta do seu bloco; 5 min para o relator fechar o registro no documento colaborativo." },
      { nivel: "faca", texto: "Papéis: relator (registra as respostas e fala no plenário), cronometrista (garante a virada aos 15 min e o fechamento aos 30) e cético (a cada conclusão do grupo pergunta “como sabemos disso?”)." },
      { nivel: "faca", texto: "No plenário são 2 minutos por bloco, cronometrados, e só duas coisas: uma prática profissional que o texto derruba, e com o que substituir. O grupo irmão do mesmo bloco tem direito a uma frase de divergência pelo chat — divergir é esperado." },
      { nivel: "faca", texto: "Depois da aula: atividade individual no Wayground, 12 questões. As 3 últimas são abertas; na 12, apontar que tipo de evidência faltaria ao autor vale mais do que só discordar dele." },
    ],

    ajuda: [
      { titulo: "Responder o registro de leitura", endereco: "https://docs.google.com/forms/d/e/1FAIpQLSfXewiPiUz6XSUNzZcQIPZp_ouJ9sMfeHwHjikpr9KBsI3CKg/viewform", forte: true },
      { titulo: "Ler o texto de Silvio Meira", endereco: "https://silvio.meira.com/o-que-voce-faz-de-melhor-e-o-que-tera-de-desaprender-primeiro/" },
    ],
    dica: "Pergunta para levar na leitura: e se a coisa que vocês estão aprendendo a fazer melhor for exatamente a primeira que terão de largar?",
    duvidas: "Dúvidas: comentário na atividade do Classroom, para a professora Geysa.",
  },

  {
    id: "sd-lista-01",
    disc: "sd",
    tipo: "entrega",
    titulo: "Lista 01 de Sistemas Digitais",
    prazo: "2026-09-09",
    hora: "23:59",
    resumo: "Um PDF único, resolvido à mão, entregue no Classroom.",

    arquivo: "Lista 1_Nome Completo",
    arquivoNota: "É “Lista 1”, e não “Lista 01”. Troque “Nome Completo” pelo seu nome.",

    documento: {
      caminho: "assets/pdfs/lista-01-sistemas-digitais.pdf",
      titulo: "Lista 01 · Sistemas Digitais",
      simbolo: "📄",
      resumo: "1 página · 50 KB · leia aqui dentro ou baixe pelo botão da leitura.",
      rotulo: "Ver a lista",
    },

    conferir: [
      { id: "pdf",     texto: "É um PDF ÚNICO — um arquivo só, com todas as questões" },
      { id: "nome",    texto: "O arquivo está nomeado no formato exigido" },
      { id: "calculo", texto: "Toda questão tem o cálculo junto" },
      { id: "mao",     texto: "Nada digitado — tudo resolvido à mão" },
    ],

    regras: [
      { nivel: "faca",  texto: "Envie um PDF ÚNICO, com todas as questões no mesmo arquivo." },
      { nivel: "faca",  texto: "Resolva no tablet e salve em PDF, ou faça no caderno/folha, tire foto e converta para PDF." },
      { nivel: "zera",  texto: "Arquivo com outro nome ou em outro formato: a lista é zerada." },
      { nivel: "zera",  texto: "Envio depois das 23:59 do dia 09/09: não é aceito." },
      { nivel: "perde", texto: "Questão sem o respectivo cálculo: não pontua." },
      { nivel: "perde", texto: "Questão digitada: não pontua." },
    ],

    ajuda: [
      { titulo: "iLovePDF · JPG para PDF", endereco: "https://www.ilovepdf.com/jpg_to_pdf" },
    ],
    dica: "Serve qualquer conversor: procure no Google por “jpg to pdf converter”.",
    duvidas: "Dúvidas sobre a correção: responda ao comentário de feedback da sua monitora ou do seu monitor, no próprio Classroom.",
  },

];
