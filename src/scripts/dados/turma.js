// ============================================================
//  CESAR School · Linkhub CC 1A · Dados da turma
//
//  ►► É AQUI que você edita o site. Nada de mexer no HTML.
//
//  Tudo que estiver como "A confirmar" ainda precisa ser
//  preenchido — o site funciona normalmente até lá, só mostra
//  o aviso no lugar da informação.
// ============================================================

export const TURMA = {

  // ── Identidade ──────────────────────────────────────────
  nome: "CC 1A",
  semestre: "2026.2",
  periodo: "1º Período",
  codigo: "COMP20262_1A",

  // Endereço público do site — usado no QR Code e ao compartilhar.
  //
  // Precisa estar preenchido: vazio, o site usa o endereço da aba
  // aberta, e rodando na sua máquina isso vira "http://localhost:8000/",
  // que não abre em celular nenhum além do seu.
  endereco: "https://genival714.github.io/linkhub-cc-1a/",

  // ← preencher: link de convite do grupo da turma
  grupoWhatsapp: "",

  // ── Régua do alerta da tela inicial ─────────────────────
  aviso: {
    // De quantos dias antes um evento passa a aparecer. Aumente
    // para enxergar mais longe, diminua para só ver o iminente.
    janelaDias: 20,
    // Quantos eventos o alerta mostra de uma vez.
    maximo: 3,
  },

  // ── Rodapé ──────────────────────────────────────────────
  responsavel: {
    nome: "Genival Hora",
    papel: "da Turma 1A de Ciência da Computação",
    github: "https://github.com/Genival714",
    linkedin: "",              // ← preencher: https://linkedin.com/in/...
  },

  // ── Atalhos institucionais ──────────────────────────────
  // formato: "externo" abre em nova aba · "documento" abre o leitor
  atalhos: [
    {
      titulo: "Portal do Aluno (Lyceum)",
      endereco: "https://cesar.lyceum.com.br/AOnline3/#/home/avisos",
      simbolo: "🎓",
      formato: "externo",
    },
    {
      titulo: "Site de Projetos",
      endereco: "https://sites.google.com/cesar.school/projeto1ccdsg261/",
      simbolo: "📝",
      formato: "externo",
    },
    {
      titulo: "Zoom · Aula de FP1 (sexta)",
      endereco: "https://cesar.zoom.us/j/87136650510",
      simbolo: "🎥",
      formato: "externo",
    },
    {
      titulo: "Comunidade CESAR School",
      endereco: "https://a.cesar.school/ConviteCC",
      simbolo: "👥",
      formato: "externo",
    },
    {
      titulo: "Portal de Carreiras · Workalove",
      endereco: "https://workability.worka.love/#/",
      simbolo: "💼",
      formato: "externo",
    },
    {
      titulo: "Grade de Horários da Turma",
      endereco: "assets/pdfs/horarios-cc-1a-2026-2.pdf",
      simbolo: "🕗",
      formato: "documento",
    },
    {
      titulo: "Manual do Estudante",
      endereco: "assets/pdfs/manual-do-estudante-2026-2.pdf",
      simbolo: "📖",
      formato: "documento",
    },
    {
      titulo: "Calendário Acadêmico 2026.2",
      endereco: "assets/pdfs/calendario-academico-2026-2.pdf",
      simbolo: "📅",
      formato: "documento",
    },
  ],

  // ── Semana de aula ──────────────────────────────────────
  // Transcrita de "CC 1º Período A - Horários 2026.2.pdf".
  // Tudo presencial acontece na SALA 205 · BRUM.
  //
  // A turma foi remanejada depois: o PDF de horários ainda traz a
  // SALA 109. Quem comparar o site com o documento vai ver a
  // diferença — a sala válida é a 205.
  //
  // A chave é o dia da semana como o JavaScript conta em
  // Date.getDay(): 1 = segunda … 5 = sexta. Guardar assim faz o
  // "hoje" sair direto da data, sem conversão de índice pelo meio.
  //
  // materia: id da matéria (ver materias.js) — é o que dá a cor ao
  // bloco. vago: true marca janela sem aula.
  semana: {
    1: {
      titulo: "Segunda",
      blocos: [
        { materia: "sd", de: "08:15", ate: "10:15", local: "Sala 205 · Brum" },
        { materia: "mc", de: "10:30", ate: "12:30", local: "Sala 205 · Brum" },
        { vago: true, de: "13:30", ate: "14:30" },
      ],
    },
    2: {
      titulo: "Terça",
      blocos: [
        { materia: "fp", de: "08:15", ate: "10:15", local: "Sala 205 · Brum" },
        { materia: "ic", de: "10:30", ate: "12:30", local: "Sala 205 · Brum" },
        { materia: "p1", de: "13:30", ate: "14:30", local: "Presencial" },
      ],
    },
    3: {
      titulo: "Quarta",
      blocos: [
        { materia: "sd", de: "08:15", ate: "10:15", local: "Sala 205 · Brum" },
        { materia: "mc", de: "10:30", ate: "12:30", local: "Sala 205 · Brum" },
        { materia: "p1", de: "13:30", ate: "14:30", local: "Presencial" },
      ],
    },
    4: {
      titulo: "Quinta",
      blocos: [
        { materia: "fp", de: "08:15", ate: "10:15", local: "Sala 205 · Brum" },
        { materia: "ic", de: "10:30", ate: "12:30", local: "Sala 205 · Brum" },
        { materia: "p1", de: "13:30", ate: "14:30", local: "Presencial" },
      ],
    },
    5: {
      titulo: "Sexta",
      selo: { simbolo: "🛋️", texto: "em casa" },
      chamada: "https://cesar.zoom.us/j/87136650510",
      blocos: [
        { materia: "fp1", de: "08:15", ate: "11:30", local: "Online", remoto: true },
        { vago: true, de: "11:30", ate: "12:30" },
        { vago: true, de: "13:30", ate: "14:30" },
      ],
    },
  },

  // ── Monitorias ──────────────────────────────────────────
  // Uma entrada por horário. Para vários horários da mesma
  // matéria, repita a matéria em entradas separadas.
  monitorias: [
    { materia: "ic",  dia: "", horario: "", local: "A confirmar", sala: "" },
    { materia: "mc",  dia: "", horario: "", local: "A confirmar", sala: "" },
    { materia: "sd",  dia: "", horario: "", local: "A confirmar", sala: "" },
    { materia: "fp",  dia: "", horario: "", local: "A confirmar", sala: "" },
    { materia: "fp1", dia: "", horario: "", local: "A confirmar", sala: "" },
    { materia: "p1",  dia: "", horario: "", local: "A confirmar", sala: "" },
  ],

  // ── Arquivos ────────────────────────────────────────────
  // Aparecem na tela Arquivos, com leitura embutida e download.
  arquivos: [
    {
      titulo: "Manual do Estudante 2026.2",
      caminho: "assets/pdfs/manual-do-estudante-2026-2.pdf",
      peso: "3,7 MB",
      simbolo: "📖",
      resumo: "Regras, direitos, deveres e todos os processos acadêmicos da CESAR School.",
      secao: "Institucional",
    },
    {
      titulo: "Calendário Acadêmico 2026.2",
      caminho: "assets/pdfs/calendario-academico-2026-2.pdf",
      peso: "476 KB",
      simbolo: "📅",
      resumo: "Datas oficiais do semestre: feriados, janelas de AV1 e AV2, Status Reports e provas finais.",
      secao: "Institucional",
    },
    {
      titulo: "Grade de Horários · CC 1º Período A",
      caminho: "assets/pdfs/horarios-cc-1a-2026-2.pdf",
      peso: "156 KB",
      simbolo: "🕗",
      resumo: "A grade oficial da turma, com horários, salas e os blocos livres.",
      secao: "Institucional",
    },
    {
      titulo: "Uso de IA nas Disciplinas de Projetos",
      caminho: "assets/pdfs/uso-ia-disciplinas-projetos.pdf",
      peso: "328 KB",
      simbolo: "🤖",
      resumo: "O que é permitido, o que exige declaração e o que é proibido ao usar IA nos projetos.",
      secao: "Institucional",
    },
    {
      titulo: "Plano de Ensino · Introdução à Computação",
      caminho: "assets/pdfs/plano-introducao-computacao.pdf",
      peso: "192 KB",
      simbolo: "📘",
      resumo: "Ementa, metodologia de avaliação e conteúdo programático completo.",
      secao: "Planos de Ensino",
      materia: "ic",
    },
    {
      titulo: "Plano de Ensino · Matemática para Computação",
      caminho: "assets/pdfs/plano-matematica-computacao.pdf",
      peso: "276 KB",
      simbolo: "📘",
      resumo: "Ementa, metodologia de avaliação e conteúdo programático completo.",
      secao: "Planos de Ensino",
      materia: "mc",
    },
    {
      titulo: "Plano de Ensino · Sistemas Digitais",
      caminho: "assets/pdfs/plano-sistemas-digitais.pdf",
      peso: "208 KB",
      simbolo: "📘",
      resumo: "Ementa, metodologia de avaliação e conteúdo programático completo.",
      secao: "Planos de Ensino",
      materia: "sd",
    },
    {
      titulo: "Plano de Ensino · Fundamentos de Programação",
      caminho: "assets/pdfs/plano-fundamentos-programacao.pdf",
      peso: "180 KB",
      simbolo: "📘",
      resumo: "Ementa, metodologia de avaliação e conteúdo programático completo.",
      secao: "Planos de Ensino",
      materia: "fp",
    },
    {
      titulo: "Plano de Ensino · FP1: Gestão de Pessoas",
      caminho: "assets/pdfs/plano-fp1-gestao-de-pessoas.pdf",
      peso: "180 KB",
      simbolo: "📘",
      resumo: "Ementa, metodologia de avaliação e conteúdo programático completo.",
      secao: "Planos de Ensino",
      materia: "fp1",
    },
  ],

};
