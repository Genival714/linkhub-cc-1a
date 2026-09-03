// ============================================================
//  CESAR School · Linkhub CC 1A · Cronograma das matérias
//
//  Um registro por linha do CONTEÚDO PROGRAMÁTICO de cada
//  Plano de Ensino oficial (turma COMP20262_1A, semestre 2026.2).
//
//  Campos:
//    data   "AAAA-MM-DD"
//    disc   id da disciplina (ver materias.js)
//    aula   número da aula no plano (null = sem numeração)
//    tipo   aula | atividade | prova | av | entrega |
//           apresentacao | projeto | evento | feriado | extra
//    titulo texto exibido
//    obs    observação opcional (divergências, avisos)
//
//  Só atividade, prova, av, entrega, apresentacao e projeto
//  contam como IMPORTANTES — são esses que alimentam o alerta
//  dos próximos eventos e o filtro "só avaliações".
//
//  Eventos institucionais (feriados, Rec'n Play, Status Reports,
//  Mostra TechDesign) NÃO se repetem aqui: ficam uma única vez
//  em institucional.js, senão o calendário mostraria o mesmo
//  feriado cinco vezes.
// ============================================================

export const CRONOGRAMA = [

  // ══ IC · Introdução à Computação ═══════════════════════════
  { data: "2026-08-04", disc: "ic", aula: 1,  tipo: "aula", titulo: "Onboarding | Institucional" },
  { data: "2026-08-06", disc: "ic", aula: 2,  tipo: "aula", titulo: "Onboarding | Institucional" },
  { data: "2026-08-11", disc: "ic", aula: 3,  tipo: "aula", titulo: "Apresentação da Disciplina / Ecossistema do Porto Digital" },
  { data: "2026-08-13", disc: "ic", aula: null, tipo: "aula", titulo: "Mapeamento Diagnóstico" },
  { data: "2026-08-18", disc: "ic", aula: 4,  tipo: "atividade", titulo: "Atividade Avaliativa 1 — Gerações de Computadores", obs: "Em grupo, durante a aula. Vale 5% da AV1." },
  { data: "2026-08-20", disc: "ic", aula: 5,  tipo: "atividade", titulo: "Atividade Avaliativa 2 — Gargalo de von Neumann", obs: "Individual e assíncrona. Vale 5% da AV1. Aula: Componentes Básicos de um Computador." },
  { data: "2026-08-25", disc: "ic", aula: 6,  tipo: "aula", titulo: "Software e Linguagens de Programação" },
  { data: "2026-08-27", disc: "ic", aula: 7,  tipo: "aula", titulo: "Características de Linguagens de Programação" },
  { data: "2026-09-01", disc: "ic", aula: 8,  tipo: "atividade", titulo: "Atividade Avaliativa 3 — Linguagens de Programação", obs: "Em grupo, apresentação de pesquisa. Vale 15% da AV1." },
  { data: "2026-09-03", disc: "ic", aula: 9,  tipo: "aula", titulo: "Introdução aos Sistemas Operacionais" },
  { data: "2026-09-08", disc: "ic", aula: 10, tipo: "aula", titulo: "Conversa com Profissionais de TI" },
  { data: "2026-09-10", disc: "ic", aula: 11, tipo: "aula", titulo: "Principais áreas de atuação em TI" },
  { data: "2026-09-15", disc: "ic", aula: 12, tipo: "aula", titulo: "Noções de Front End e Back End" },
  { data: "2026-09-17", disc: "ic", aula: 13, tipo: "atividade", titulo: "Atividade Avaliativa 4 — Profissões de TI", obs: "Em grupo, apresentação de pesquisa. Vale 15% da AV1." },
  { data: "2026-09-22", disc: "ic", aula: 14, tipo: "aula", titulo: "Low-Code e No-Code" },
  { data: "2026-09-29", disc: "ic", aula: null, tipo: "aula", titulo: "Desenvolvimento de Projeto No-Code" },
  { data: "2026-10-01", disc: "ic", aula: null, tipo: "aula", titulo: "Desenvolvimento de Projeto No-Code" },
  { data: "2026-10-06", disc: "ic", aula: 15, tipo: "aula", titulo: "Desenvolvimento de Projeto No-Code" },
  { data: "2026-10-08", disc: "ic", aula: 16, tipo: "aula", titulo: "Desenvolvimento de Projeto No-Code" },
  { data: "2026-10-13", disc: "ic", aula: 17, tipo: "projeto", titulo: "Projeto Avaliativo 1 — Entrega e apresentação do jogo No-Code", obs: "Vale 60% da AV1 — é o maior peso da primeira unidade." },
  { data: "2026-10-15", disc: "ic", aula: 18, tipo: "aula", titulo: "WWW e Redes de Computadores" },
  { data: "2026-10-20", disc: "ic", aula: 19, tipo: "aula", titulo: "Introdução ao HTML" },
  { data: "2026-10-22", disc: "ic", aula: 20, tipo: "aula", titulo: "Introdução ao HTML" },
  { data: "2026-10-27", disc: "ic", aula: 21, tipo: "aula", titulo: "Introdução ao CSS" },
  { data: "2026-10-29", disc: "ic", aula: 22, tipo: "aula", titulo: "Introdução ao CSS" },
  { data: "2026-11-03", disc: "ic", aula: 23, tipo: "aula", titulo: "Introdução ao JavaScript" },
  { data: "2026-11-05", disc: "ic", aula: 24, tipo: "aula", titulo: "Introdução ao JavaScript" },
  { data: "2026-11-10", disc: "ic", aula: 25, tipo: "aula", titulo: "Introdução ao Controle de Versão com Git" },
  { data: "2026-11-12", disc: "ic", aula: 26, tipo: "aula", titulo: "Introdução ao Controle de Versão com Git" },
  { data: "2026-11-17", disc: "ic", aula: null, tipo: "aula", titulo: "Markdown | Rec'n Play" },
  { data: "2026-11-19", disc: "ic", aula: 27, tipo: "aula", titulo: "Bate-papo sobre carreira" },
  { data: "2026-11-24", disc: "ic", aula: 28, tipo: "aula", titulo: "Perfil profissional no LinkedIn" },
  { data: "2026-11-26", disc: "ic", aula: 29, tipo: "aula", titulo: "Desenvolvimento do Portfólio com HTML, CSS e JavaScript" },
  { data: "2026-12-01", disc: "ic", aula: 30, tipo: "aula", titulo: "Desenvolvimento do Portfólio com HTML, CSS e JavaScript" },
  { data: "2026-12-03", disc: "ic", aula: 31, tipo: "projeto", titulo: "Projeto Avaliativo 2 — Entrega do Portfólio Profissional Pessoal", obs: "Vale 30% da AV2." },
  { data: "2026-12-22", disc: "ic", aula: null, tipo: "prova", titulo: "Prova Final" },

  // ══ MC · Matemática para Computação ════════════════════════
  { data: "2026-08-03", disc: "mc", aula: null, tipo: "aula", titulo: "Início das aulas: Onboarding" },
  { data: "2026-08-05", disc: "mc", aula: null, tipo: "aula", titulo: "Início das aulas: Onboarding" },
  { data: "2026-08-10", disc: "mc", aula: 1,  tipo: "aula", titulo: "Apresentação do plano de ensino; Diagnose da turma" },
  { data: "2026-08-12", disc: "mc", aula: 2,  tipo: "aula", titulo: "Funções Reais: domínio, imagem, raízes, gráficos e inversa" },
  { data: "2026-08-17", disc: "mc", aula: 3,  tipo: "aula", titulo: "Zero de funções reais: Teorema de Bolzano e método da bisseção" },
  { data: "2026-08-19", disc: "mc", aula: 4,  tipo: "atividade", titulo: "1ª atividade avaliativa", obs: "Compõe os 30% de participação e listas da AV1." },
  { data: "2026-08-24", disc: "mc", aula: 5,  tipo: "aula", titulo: "Noções de cálculo: Limite de funções reais" },
  { data: "2026-08-26", disc: "mc", aula: 6,  tipo: "aula", titulo: "Noções de cálculo: Limite de funções reais + exercícios" },
  { data: "2026-08-31", disc: "mc", aula: 7,  tipo: "aula", titulo: "Noções de cálculo: Derivada" },
  { data: "2026-09-02", disc: "mc", aula: 8,  tipo: "aula", titulo: "Noções de cálculo: Derivada" },
  { data: "2026-09-09", disc: "mc", aula: 9,  tipo: "atividade", titulo: "2ª atividade avaliativa", obs: "Compõe os 30% de participação e listas da AV1." },
  { data: "2026-09-14", disc: "mc", aula: 10, tipo: "aula", titulo: "Aplicações de derivada: máximos e mínimos" },
  { data: "2026-09-16", disc: "mc", aula: 11, tipo: "aula", titulo: "Exercícios gerais" },
  { data: "2026-09-21", disc: "mc", aula: 12, tipo: "aula", titulo: "Aplicações de derivada: método de Newton para zero de funções" },
  { data: "2026-09-23", disc: "mc", aula: 13, tipo: "aula", titulo: "Exercícios gerais" },
  { data: "2026-09-28", disc: "mc", aula: 14, tipo: "aula", titulo: "Revisão para a AV1", obs: "O plano de ensino traz 28/10, mas a sequência das aulas e a janela de AV1 (30/9 a 6/10) indicam 28/09. Confirme com o professor." },
  { data: "2026-09-30", disc: "mc", aula: 15, tipo: "av", titulo: "Primeira Avaliação (AV1)", obs: "O plano de ensino traz 30/10, mas a sequência das aulas e a janela de AV1 (30/9 a 6/10) indicam 30/09. Confirme com o professor." },
  { data: "2026-10-05", disc: "mc", aula: 16, tipo: "aula", titulo: "Comentários e correção sobre a AV1" },
  { data: "2026-10-07", disc: "mc", aula: 17, tipo: "aula", titulo: "Noções de cálculo: primitiva de uma função e a integral indefinida" },
  { data: "2026-10-14", disc: "mc", aula: 18, tipo: "aula", titulo: "Integral definida e o teorema fundamental do cálculo" },
  { data: "2026-10-19", disc: "mc", aula: 19, tipo: "aula", titulo: "Aplicações de integral: área entre curvas e volume de sólidos de revolução" },
  { data: "2026-10-21", disc: "mc", aula: 20, tipo: "atividade", titulo: "3ª atividade avaliativa", obs: "Compõe os 30% de participação e listas da AV2." },
  { data: "2026-10-26", disc: "mc", aula: 21, tipo: "aula", titulo: "Integração numérica: método dos trapézios e método de Simpson" },
  { data: "2026-10-28", disc: "mc", aula: 22, tipo: "aula", titulo: "Exercícios gerais" },
  { data: "2026-11-04", disc: "mc", aula: 23, tipo: "aula", titulo: "Interpolação numérica: polinômio interpolador de Lagrange" },
  { data: "2026-11-09", disc: "mc", aula: 24, tipo: "aula", titulo: "Noções de álgebra linear: matrizes e operações" },
  { data: "2026-11-11", disc: "mc", aula: 25, tipo: "aula", titulo: "Rec'n Play" },
  { data: "2026-11-16", disc: "mc", aula: 26, tipo: "aula", titulo: "Aplicação de matrizes: criptografia" },
  { data: "2026-11-18", disc: "mc", aula: 27, tipo: "aula", titulo: "Noções de álgebra linear: sistemas lineares" },
  { data: "2026-11-23", disc: "mc", aula: 28, tipo: "aula", titulo: "Noções de álgebra linear: método de escalonamento (eliminação gaussiana)" },
  { data: "2026-11-25", disc: "mc", aula: 29, tipo: "atividade", titulo: "4ª atividade avaliativa", obs: "Compõe os 30% de participação e listas da AV2." },
  { data: "2026-11-30", disc: "mc", aula: 30, tipo: "aula", titulo: "Revisão para a AV2" },
  { data: "2026-12-02", disc: "mc", aula: 31, tipo: "av", titulo: "Segunda Avaliação (AV2)" },
  { data: "2026-12-09", disc: "mc", aula: 32, tipo: "aula", titulo: "Comentários e correção sobre a AV2. Entrega das notas" },
  { data: "2026-12-14", disc: "mc", aula: 33, tipo: "prova", titulo: "Segunda chamada" },
  { data: "2026-12-21", disc: "mc", aula: null, tipo: "prova", titulo: "Prova Final" },

  // ══ SD · Sistemas Digitais ═════════════════════════════════
  { data: "2026-08-03", disc: "sd", aula: 1,  tipo: "aula", titulo: "Início das aulas / Onboarding" },
  { data: "2026-08-05", disc: "sd", aula: 2,  tipo: "aula", titulo: "Onboarding" },
  { data: "2026-08-10", disc: "sd", aula: 3,  tipo: "aula", titulo: "Apresentação dos professores e da disciplina" },
  { data: "2026-08-12", disc: "sd", aula: 4,  tipo: "aula", titulo: "Computação Física e Sistemas Digitais · Sistema de numeração binário (conversão binário-decimal)" },
  { data: "2026-08-17", disc: "sd", aula: 5,  tipo: "aula", titulo: "Sistema de numeração binário (conversão binário-decimal)" },
  { data: "2026-08-19", disc: "sd", aula: 6,  tipo: "aula", titulo: "Conversão decimal-binário · Sistema de numeração hexadecimal" },
  { data: "2026-08-24", disc: "sd", aula: 7,  tipo: "aula", titulo: "Sistemas de codificação · Adição em binário" },
  { data: "2026-08-26", disc: "sd", aula: 8,  tipo: "aula", titulo: "Representação de números negativos em binário · Subtração em binário" },
  { data: "2026-08-31", disc: "sd", aula: 9,  tipo: "aula", titulo: "Representação de números negativos em binário · Subtração em binário" },
  { data: "2026-09-02", disc: "sd", aula: 10, tipo: "aula", titulo: "Álgebra booleana (leis do pensamento e funções lógicas básicas)" },
  { data: "2026-09-09", disc: "sd", aula: 11, tipo: "aula", titulo: "Álgebra booleana (outras funções lógicas) · Circuitos combinacionais (expressões booleanas)" },
  { data: "2026-09-09", disc: "sd", aula: null, tipo: "entrega", titulo: "Lista 01 — entrega até 23:59", obs: "Vale 10% da AV1 (uma das 4 listas). PDF ÚNICO, nomeado \"Lista 1_Nome Completo\". As regras completas estão no aviso do Painel." },
  { data: "2026-09-14", disc: "sd", aula: 12, tipo: "aula", titulo: "Circuitos combinacionais (representação)" },
  { data: "2026-09-16", disc: "sd", aula: 13, tipo: "aula", titulo: "Aula Quântica" },
  { data: "2026-09-21", disc: "sd", aula: 14, tipo: "aula", titulo: "Aula Quântica" },
  { data: "2026-09-23", disc: "sd", aula: 15, tipo: "aula", titulo: "Mapa de Karnaugh" },
  { data: "2026-09-28", disc: "sd", aula: 16, tipo: "aula", titulo: "Mapa de Karnaugh" },
  { data: "2026-09-30", disc: "sd", aula: 17, tipo: "aula", titulo: "Período de avaliações (AV1)" },
  { data: "2026-10-05", disc: "sd", aula: 18, tipo: "av", titulo: "AV1", obs: "A prova vale 60% da AV1; os outros 40% vêm das 4 listas de exercícios." },
  { data: "2026-10-07", disc: "sd", aula: 19, tipo: "aula", titulo: "Introdução à eletrônica básica" },
  { data: "2026-10-14", disc: "sd", aula: 20, tipo: "aula", titulo: "Introdução ao Arduino" },
  { data: "2026-10-19", disc: "sd", aula: 21, tipo: "aula", titulo: "Arduino: saídas digitais" },
  { data: "2026-10-21", disc: "sd", aula: 22, tipo: "aula", titulo: "Arduino: entrada digital e variáveis" },
  { data: "2026-10-26", disc: "sd", aula: 23, tipo: "aula", titulo: "Arduino: entrada digital e variáveis" },
  { data: "2026-10-28", disc: "sd", aula: 24, tipo: "atividade", titulo: "Exercício Avaliativo 1 — I/O Digital", obs: "Vale 20% da AV2." },
  { data: "2026-11-04", disc: "sd", aula: 25, tipo: "aula", titulo: "Arduino: entrada analógica" },
  { data: "2026-11-09", disc: "sd", aula: 26, tipo: "aula", titulo: "Arduino: saída analógica" },
  { data: "2026-11-11", disc: "sd", aula: 27, tipo: "aula", titulo: "Arduino: saída analógica / Rec'n Play" },
  { data: "2026-11-16", disc: "sd", aula: 28, tipo: "atividade", titulo: "Exercício Avaliativo 2", obs: "Vale 20% da AV2." },
  { data: "2026-11-18", disc: "sd", aula: 29, tipo: "aula", titulo: "Arduino: comunicação serial" },
  { data: "2026-11-24", disc: "sd", aula: 30, tipo: "aula", titulo: "Arduino: comunicação SoftwareSerial e PySerial", obs: "Terça-feira — fora dos dias normais da disciplina (seg/qua), conforme o plano de ensino." },
  { data: "2026-11-25", disc: "sd", aula: 31, tipo: "aula", titulo: "Arduino: outros sensores" },
  { data: "2026-11-30", disc: "sd", aula: 32, tipo: "atividade", titulo: "Exercício Avaliativo 3 — Escrita Analógica e PySerial", obs: "Vale 20% da AV2." },
  { data: "2026-12-14", disc: "sd", aula: null, tipo: "prova", titulo: "Segunda Chamada" },
  { data: "2026-12-21", disc: "sd", aula: null, tipo: "prova", titulo: "Prova Final" },

  // ══ FP · Fundamentos de Programação ════════════════════════
  { data: "2026-08-04", disc: "fp", aula: null, tipo: "aula", titulo: "Semana de Imersão" },
  { data: "2026-08-06", disc: "fp", aula: null, tipo: "aula", titulo: "Semana de Imersão" },
  { data: "2026-08-11", disc: "fp", aula: 1,  tipo: "aula", titulo: "Apresentação da disciplina e conceitos iniciais de programação" },
  { data: "2026-08-13", disc: "fp", aula: 2,  tipo: "aula", titulo: "Operadores" },
  { data: "2026-08-18", disc: "fp", aula: 3,  tipo: "aula", titulo: "Estruturas condicionais" },
  { data: "2026-08-20", disc: "fp", aula: 4,  tipo: "aula", titulo: "Estruturas condicionais e estruturas de repetição" },
  { data: "2026-08-25", disc: "fp", aula: 5,  tipo: "aula", titulo: "Estruturas de repetição" },
  { data: "2026-08-27", disc: "fp", aula: 6,  tipo: "atividade", titulo: "Atividade prática valendo parte da nota (no papel)", obs: "Uma das duas atividades práticas que somam 40% da AV1." },
  { data: "2026-09-01", disc: "fp", aula: 7,  tipo: "aula", titulo: "Introdução a Python" },
  { data: "2026-09-03", disc: "fp", aula: 8,  tipo: "aula", titulo: "Estruturas condicionais" },
  { data: "2026-09-08", disc: "fp", aula: 9,  tipo: "aula", titulo: "Estruturas de repetição" },
  { data: "2026-09-10", disc: "fp", aula: 10, tipo: "aula", titulo: "Estruturas de repetição" },
  { data: "2026-09-15", disc: "fp", aula: 11, tipo: "atividade", titulo: "Atividade prática valendo parte da nota (no papel)", obs: "Uma das duas atividades práticas que somam 40% da AV1." },
  { data: "2026-09-17", disc: "fp", aula: 12, tipo: "aula", titulo: "Vetores" },
  { data: "2026-09-22", disc: "fp", aula: 13, tipo: "aula", titulo: "Vetores e matrizes" },
  { data: "2026-09-24", disc: "fp", aula: 14, tipo: "aula", titulo: "Matrizes" },
  { data: "2026-09-29", disc: "fp", aula: 15, tipo: "aula", titulo: "Lista de exercícios extra (iniciada em sala)", obs: "Vale pontuação extra." },
  { data: "2026-10-01", disc: "fp", aula: 16, tipo: "aula", titulo: "Dúvidas para a prova · Planejamento do projeto da Unidade 2 · Tópicos sobre IA" },
  { data: "2026-10-06", disc: "fp", aula: 17, tipo: "prova", titulo: "Prova do Módulo 01 (no computador)", obs: "Vale 60% da AV1. Prova no laboratório." },
  { data: "2026-10-08", disc: "fp", aula: 18, tipo: "aula", titulo: "Strings" },
  { data: "2026-10-13", disc: "fp", aula: 19, tipo: "aula", titulo: "Tuplas e dicionários" },
  { data: "2026-10-15", disc: "fp", aula: 20, tipo: "aula", titulo: "Funções" },
  { data: "2026-10-20", disc: "fp", aula: 21, tipo: "aula", titulo: "Funções" },
  { data: "2026-10-22", disc: "fp", aula: 22, tipo: "atividade", titulo: "Atividade prática valendo parte da nota (no papel)", obs: "Vale 20% da AV2." },
  { data: "2026-10-27", disc: "fp", aula: 23, tipo: "aula", titulo: "Acompanhamento dos projetos" },
  { data: "2026-10-29", disc: "fp", aula: 24, tipo: "aula", titulo: "Manipulação de arquivos" },
  { data: "2026-11-03", disc: "fp", aula: 25, tipo: "aula", titulo: "Manipulação de arquivos" },
  { data: "2026-11-05", disc: "fp", aula: 26, tipo: "entrega", titulo: "Entrega parcial dos projetos", obs: "O projeto vale 30% da AV2." },
  { data: "2026-11-10", disc: "fp", aula: 27, tipo: "aula", titulo: "Integração do projeto com agente de IA" },
  { data: "2026-11-12", disc: "fp", aula: 28, tipo: "aula", titulo: "Rec'n Play (sem aula)" },
  { data: "2026-11-17", disc: "fp", aula: 29, tipo: "aula", titulo: "Lista de exercícios extra (iniciada em sala)", obs: "Vale pontuação extra." },
  { data: "2026-11-19", disc: "fp", aula: 30, tipo: "apresentacao", titulo: "Apresentação dos projetos", obs: "O projeto vale 30% da AV2. Entregue também o histórico de prompts de IA." },
  { data: "2026-11-24", disc: "fp", aula: 31, tipo: "apresentacao", titulo: "Apresentação dos projetos", obs: "O projeto vale 30% da AV2. Entregue também o histórico de prompts de IA." },
  { data: "2026-11-26", disc: "fp", aula: 32, tipo: "prova", titulo: "Prova do Módulo 02 (no computador)", obs: "Vale 50% da AV2." },
  { data: "2026-12-15", disc: "fp", aula: null, tipo: "prova", titulo: "Segunda Chamada" },
  { data: "2026-12-22", disc: "fp", aula: null, tipo: "prova", titulo: "Prova Final" },

  // ══ FP1 · Gestão de Pessoas (sexta, online) ════════════════
  { data: "2026-08-07", disc: "fp1", aula: 1,  tipo: "aula", titulo: "Onboarding" },
  { data: "2026-08-14", disc: "fp1", aula: 2,  tipo: "aula", titulo: "Apresentação da disciplina. Orientações do semestre" },
  { data: "2026-08-21", disc: "fp1", aula: 3,  tipo: "aula", titulo: "Trabalho em rede: formação e desenvolvimento de equipes" },
  { data: "2026-08-28", disc: "fp1", aula: 4,  tipo: "aula", titulo: "Conceito de projeto, papéis e etapas de um projeto" },
  { data: "2026-09-04", disc: "fp1", aula: 5,  tipo: "aula", titulo: "Ferramentas para gestão de projetos; gestão de pessoas por competências" },
  { data: "2026-09-11", disc: "fp1", aula: 6,  tipo: "aula", titulo: "Comunicação não violenta" },
  { data: "2026-09-18", disc: "fp1", aula: 7,  tipo: "aula", titulo: "Gerenciamento de conflitos — estratégias construtivas" },
  { data: "2026-09-25", disc: "fp1", aula: 8,  tipo: "aula", titulo: "Revisão para a AV1" },
  { data: "2026-10-02", disc: "fp1", aula: 9,  tipo: "av", titulo: "AV1 — Avaliação Presencial", obs: "Presencial, apesar de a disciplina ser EAD." },
  { data: "2026-10-16", disc: "fp1", aula: 10, tipo: "aula", titulo: "Resolução colaborativa de problemas" },
  { data: "2026-10-23", disc: "fp1", aula: 11, tipo: "aula", titulo: "Processos decisórios colaborativos" },
  { data: "2026-10-30", disc: "fp1", aula: 12, tipo: "aula", titulo: "Conceitos e papel da liderança através de abordagens contemporâneas" },
  { data: "2026-11-06", disc: "fp1", aula: 13, tipo: "aula", titulo: "Management 3.0" },
  { data: "2026-11-13", disc: "fp1", aula: 14, tipo: "aula", titulo: "Diversidade e inclusão no ambiente de trabalho" },
  { data: "2026-11-27", disc: "fp1", aula: 15, tipo: "av", titulo: "AV2 — Avaliação Presencial", obs: "Presencial, apesar de a disciplina ser EAD." },
  { data: "2026-12-15", disc: "fp1", aula: null, tipo: "prova", titulo: "Segunda Chamada — avaliação presencial" },
  { data: "2026-12-21", disc: "fp1", aula: null, tipo: "prova", titulo: "Prova Final — avaliação presencial" },

];

// ── Atividades extra-classe (sem data marcada) ───────────────
// Valem nota e são fáceis de esquecer porque não caem no calendário.
export const EXTRA_CLASSE = [
  { disc: "ic",  titulo: "Curso CISCO: Fundamentos do Hardware do Computador" },
  { disc: "ic",  titulo: "Curso CISCO: JavaScript Essentials 1", obs: "Vale 20% da AV2." },
  { disc: "mc",  titulo: "Atividade sobre cálculo numérico: código do método do trapézio" },
  { disc: "mc",  titulo: "Atividade sobre álgebra linear: código para operações com matrizes" },
  { disc: "sd",  titulo: "Cisco: Introdução à IoT e à Transformação Digital" },
  { disc: "sd",  titulo: "Codeiot: Eletrônica — conceitos e componentes básicos" },
  { disc: "fp",  titulo: "Curso CISCO — Fundamentos de Python 1" },
  { disc: "fp",  titulo: "Curso CISCO — Fundamentos de Python 2" },
  { disc: "fp1", titulo: "Curso EaD Orango: Gestão ágil de projetos com Scrum e Kanban (12h)" },
];
