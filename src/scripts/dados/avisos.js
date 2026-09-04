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
//    regras       [{ nivel, texto }] com nivel:
//                   "faca"  → como fazer certo
//                   "zera"  → o que zera a atividade inteira
//                   "perde" → o que faz a questão não pontuar
//    ajuda        [{ titulo, endereco }] — links de apoio
//    dica         uma linha solta de apoio, opcional
//    duvidas      onde tirar dúvida, opcional
//
//  O link do Classroom NÃO se repete aqui: o cartão lê o campo
//  `classroom` da matéria, em materias.js.
// ============================================================

export const AVISOS = [

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
