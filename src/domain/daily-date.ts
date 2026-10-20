export function getBrazilDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function formatBrazilDate(date = new Date()): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}