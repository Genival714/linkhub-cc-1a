// ============================================================
//  CESAR School · Linkhub CC 1A · Matérias 2026.2
//
//  Dados extraídos dos Planos de Ensino oficiais da turma
//  COMP20262_1A.
//
//  ►► As CORES de cada matéria não ficam aqui: moram no bloco
//     "Cores das matérias" de src/estilos/base.css, como tokens
//     --c-<id> e --c-<id>-txt. Elas precisam mudar junto com o tema
//     claro/escuro, coisa que só o CSS consegue fazer.
//
//  A cor NUNCA é o único sinal: todo evento também carrega a
//  sigla da matéria e um ícone do tipo, para quem não
//  distingue as matizes.
// ============================================================

export const MATERIAS = [

  {
    id: "ic",
    sigla: "IC",
    nome: "Introdução à Computação",
    codigo: "00001",
    cargaHoraria: "60h",
    dias: ["ter", "qui"],
    docentes: [
      { nome: "Erick Simões de Matos", email: "esm@cesar.school" },
    ],
    classroom: "https://classroom.google.com/c/ODcxNjkzMjYyNDcz",
    plano: "assets/pdfs/plano-introducao-computacao.pdf",
    ementa: "Contexto histórico e local da computação; Boas práticas do uso de IA; Princípios da Computação; Linguagens de Programação; Introdução a Sistemas Operacionais; Noções de Front End e Back End; Low-Code e No-Code; HTML, CSS e JavaScript; Markdown; Git e GitHub; Perfil profissional no LinkedIn.",
    avaliacao: {
      av1: [
        "5% · Atividade Avaliativa 1 — em grupo, Gerações de Computadores",
        "5% · Atividade Avaliativa 2 — individual e assíncrona, Gargalo de von Neumann",
        "15% · Atividade Avaliativa 3 — em grupo, pesquisa sobre linguagens de programação",
        "15% · Atividade Avaliativa 4 — em grupo, pesquisa sobre profissões em TI",
        "60% · Projeto Avaliativo 1 — jogo digital No-Code",
      ],
      av2: [
        "20% · Conclusão do curso JavaScript Essentials 1 (CISCO)",
        "20% · Perfil no GitHub completo e atualizado",
        "30% · Portfólio profissional pessoal em tecnologias web",
        "30% · Perfil no LinkedIn completo e com postagens recentes",
      ],
      atraso: "Trabalhos entregues fora do prazo têm redução de 15% do valor (quando o envio com atraso for previamente autorizado).",
      formula: "Média Final = (AV1 + AV2) ÷ 2",
    },
    // Atividades que valem nota mas acontecem fora da sala — passam despercebidas
    extras: [
      "Curso CISCO: Fundamentos do Hardware do Computador",
      "Curso CISCO: JavaScript Essentials 1 — vale 20% da AV2",
    ],
  },

  {
    id: "mc",
    sigla: "MC",
    nome: "Matemática para Computação",
    codigo: "00002",
    cargaHoraria: "60h",
    dias: ["seg", "qua"],
    docentes: [
      { nome: "Felipe Fernando Á. Barreto", email: "ffab@cesar.school" },
    ],
    classroom: "https://classroom.google.com/c/ODcyMDk2MTY3Njcy",
    plano: "assets/pdfs/plano-matematica-computacao.pdf",
    ementa: "Funções, Limites, Derivadas, Integrais, Matrizes, Sistemas Lineares, Métodos Numéricos.",
    avaliacao: {
      av1: [
        "30% · Participação, presença, listas de exercícios e seminários",
        "70% · Prova da disciplina",
      ],
      av2: [
        "30% · Participação, presença, listas de exercícios e seminários",
        "70% · Prova da disciplina",
      ],
      atraso: "Será atribuída nota ZERO aos trabalhos e atividades entregues fora do prazo.",
      formula: "Média Final = (AV1 + AV2) ÷ 2",
    },
    ia: {
      permitido: "Estudo dos conteúdos, revisão de conceitos, esclarecimento de dúvidas, explicação de teoremas e interpretações geométricas.",
      declarado: "Listas de exercícios, projetos e trabalhos práticos.",
      proibido: "Avaliações em sala, provas práticas e atividades expressamente individuais.",
    },
    extras: [
      "Atividade extra-classe: código sobre o método do trapézio",
      "Atividade extra-classe: código para operações com matrizes",
    ],
  },

  {
    id: "sd",
    sigla: "SD",
    nome: "Sistemas Digitais",
    codigo: "00003",
    cargaHoraria: "60h",
    dias: ["seg", "qua"],
    docentes: [
      { nome: "Henrique Foresti", email: "hbf@cesar.school" },
      { nome: "Izabella Nunes", email: "inv@cesar.school" },
    ],
    classroom: "https://classroom.google.com/c/ODcyMDI1NDI3NzU2",
    plano: "assets/pdfs/plano-sistemas-digitais.pdf",
    ementa: "Eletricidade e eletrônica básica. Prototipação com Arduino. Sistemas de numeração e codificação. Conversões binário-decimal e decimal-binário. Octal e hexadecimal. Portas lógicas e álgebra booleana. Tabelas-verdade. Circuitos combinacionais. Mapa de Karnaugh.",
    avaliacao: {
      av1: [
        "40% · 4 listas de exercícios (10% cada)",
        "60% · Prova",
      ],
      av2: [
        "60% · 3 exercícios avaliativos (20% cada)",
        "40% · Nota da disciplina de Projeto 1",
      ],
      atraso: "Listas entregues após o prazo têm penalidade de 50% na nota. Listas fora do padrão solicitado não são aceitas.",
      formula: "Média Final = (AV1 + AV2) ÷ 2",
    },
    // Cruzamento entre disciplinas que costuma pegar a turma de surpresa
    alerta: "40% da sua AV2 em Sistemas Digitais vem da nota de Projeto 1. As duas disciplinas estão amarradas.",
    extras: [
      "Cisco: Introdução à IoT e à Transformação Digital",
      "Codeiot: Eletrônica — conceitos e componentes básicos",
    ],
  },

  {
    id: "fp",
    sigla: "FP",
    nome: "Fundamentos de Programação",
    codigo: "00004",
    cargaHoraria: "60h",
    dias: ["ter", "qui"],
    docentes: [
      { nome: "Carol Melo", email: "accm4@cesar.school" },
      { nome: "Victor Costa", email: "vflc@cesar.school" },
    ],
    classroom: "https://classroom.google.com/c/ODcxNDQzMDEyMTM0",
    plano: "assets/pdfs/plano-fundamentos-programacao.pdf",
    ementa: "Conceituação e aplicação de algoritmos. Desenvolvimento da lógica de programação. Expressão de soluções em termos de algoritmos estruturados. Estruturas básicas para estruturação da informação. Aplicação dos algoritmos usando Python.",
    avaliacao: {
      av1: [
        "40% · Duas atividades práticas em sala de aula",
        "60% · Prova no laboratório",
      ],
      av2: [
        "20% · Atividade prática em sala de aula",
        "30% · Projeto",
        "50% · Prova",
      ],
      atraso: "Atividades entregues após o prazo têm penalidade de 50% na nota.",
      formula: "Média Final = (AV1 + AV2) ÷ 2",
      bonus: "Há atividades ao longo do semestre que dão pontuação extra.",
    },
    ia: {
      permitido: "Compreensão de conceitos, identificação de erros, depuração de código e geração de exemplos práticos.",
      declarado: "Claude, ChatGPT ou GitHub Copilot em listas e projetos — cada entrega precisa vir com comentários explicando as decisões tomadas.",
      proibido: "No projeto final, é obrigatório entregar o histórico de prompts trocados com a ferramenta.",
    },
    extras: [
      "Curso CISCO — Fundamentos de Python 1",
      "Curso CISCO — Fundamentos de Python 2",
    ],
  },

  {
    id: "fp1",
    sigla: "FP1",
    nome: "FP1: Gestão de Pessoas",
    nomeCompleto: "Fundamentos de Projetos 1: Gestão de Pessoas",
    codigo: "00101",
    cargaHoraria: "45h",
    dias: ["sex"],
    online: true,
    docentes: [
      { nome: "Geysa Barlavento", email: "gpb2@cesar.school" },
    ],
    classroom: "https://classroom.google.com/c/ODcxODAxODI4MjQw",
    plano: "assets/pdfs/plano-fp1-gestao-de-pessoas.pdf",
    ementa: "Dimensão humana em projetos. Papéis e responsabilidades. Perfis comportamentais e desenvolvimento de equipes. Liderança em projetos e liderança inclusiva. Gestão de pessoas por competências: soft e hard skills.",
    avaliacao: {
      av1: [
        "50% · Atividades síncronas e assíncronas (individuais)",
        "50% · Estudo de caso presencial (em grupo)",
      ],
      av2: [
        "50% · Atividades síncronas e assíncronas (individuais)",
        "50% · Estudo de caso presencial (em grupo)",
      ],
      atraso: "Trabalhos entregues fora do prazo têm a avaliação iniciada em 8.",
      formula: "Média Final = (AV1 + AV2) ÷ 2",
    },
    extras: [
      "Curso EaD Orango: Gestão ágil de projetos com Scrum e Kanban (12h)",
    ],
  },

  {
    id: "p1",
    sigla: "P1",
    nome: "Projeto 1",
    codigo: "00005",
    cargaHoraria: "",
    dias: ["ter", "qua", "qui"],
    docentes: [],
    classroom: "https://classroom.google.com/c/ODcyMDczMzAyNTI1",
    site: "https://sites.google.com/cesar.school/projeto1ccdsg261/",
    plano: "",
    ementa: "Disciplina de projeto integrador. O site da disciplina concentra briefings, entregas e o material de apoio.",
    obs: "Presencial, terça a quinta, das 13:30 às 14:30.",
    avaliacao: {
      formula: "Consulte o site da disciplina",
    },
    alerta: "A nota de Projeto 1 vale 40% da AV2 de Sistemas Digitais.",
    extras: [],
  },

];

// Índice por id — evita varrer o array a cada consulta
export const MATERIA_POR_ID = Object.fromEntries(MATERIAS.map(m => [m.id, m]));
