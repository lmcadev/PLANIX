/** ISO string (con Z u offset) -> valor para <input type="datetime-local"> (sin timezone). */
export function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Valor de <input type="datetime-local"> -> ISO string en UTC para enviar al backend. */
export function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
