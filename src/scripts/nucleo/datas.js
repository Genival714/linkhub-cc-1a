// ============================================================
//  Núcleo · Datas
//
//  Um lugar só para tudo que envolve calendário: leitura de datas
//  ISO, distância em dias, nomes em português e a virada da
//  meia-noite.
// ============================================================

export const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export const MESES_CURTOS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

// Indexados por Date.getDay(): 0 = domingo
export const SEMANA_CURTA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export const SEMANA_LONGA = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];

// "2026-10-06" → Date ao meio-dia local. O meio-dia evita que o
// fuso horário empurre a data para o dia anterior.
export const leData = (iso) => new Date(`${iso}T12:00:00`);

// Date → "2026-10-06"
export const emIso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Só a primeira letra em maiúscula. O `text-transform: capitalize`
// do CSS erraria em português — viraria "Outubro De 2026" e
// "Terça-Feira".
export const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Distância em dias inteiros entre duas datas. Zera a hora dos dois
// lados antes de subtrair: as datas dos eventos ficam ao meio-dia e
// a de hoje à meia-noite, então a subtração crua daria 0,5 dia e o
// arredondamento jogaria um evento de hoje para "amanhã".
export function distanciaEmDias(alvo, origem) {
  const zera = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((zera(alvo) - zera(origem)) / 86_400_000);
}

// Data de referência do app. Aceita ?hoje=2026-10-05 na URL para
// testar os alertas sem mexer no relógio do sistema.
function referencia() {
  const informada = new URLSearchParams(location.search).get("hoje");
  const d = informada && /^\d{4}-\d{2}-\d{2}$/.test(informada)
    ? leData(informada)
    : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── O dia corrente ──────────────────────────────────────────
// Não é constante porque o dia vira: o site fica instalado no
// celular e pode passar da meia-noite aberto. Sem isto, a data
// congelaria no momento em que a página foi carregada e o alerta
// continuaria dizendo "é hoje" para o evento de ontem.

let _hoje = referencia();
let _iso = emIso(_hoje);
const ouvintes = new Set();

export const hoje = () => _hoje;
export const isoDeHoje = () => _iso;

/** Registra uma função para rodar quando o dia virar. */
export function aoVirarODia(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

function confere() {
  const agora = referencia();
  if (emIso(agora) === _iso) return;
  _hoje = agora;
  _iso = emIso(agora);
  ouvintes.forEach((fn) => fn());
}

/**
 * Liga a vigilância da virada do dia.
 *
 * Voltar do segundo plano é quando a maioria das viradas é
 * percebida; o intervalo é a rede de segurança para quem deixa a
 * aba aberta e visível a noite inteira.
 */
export function vigiaAVirada() {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) confere();
  });
  window.addEventListener("focus", confere);
  setInterval(confere, 10 * 60 * 1000);
}
