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
//                   "zera"   → o que zera a atividade inteira
//                   "perde"  → o que faz a questão não pontuar
//    grupos       { titulo, nota, itens: [{ numero, tema, integrantes }] }
//                 — trabalho em grupo: quem está com quem e qual o
//                 tema de cada um. Vira uma gaveta própria, fechada,
//                 antes da gaveta de regras
//    ajuda        [{ titulo, endereco }] — links de apoio
//    dica         uma linha solta de apoio, opcional
//    duvidas      onde tirar dúvida, opcional
//
//  O link do Classroom NÃO se repete aqui: o cartão lê o campo
//  `classroom` da matéria, em materias.js.
// ============================================================

export const AVISOS = [

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
