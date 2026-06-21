export const SCHEDULE_STATUS_OPTIONS = [
  { value: "available", label: "Disponible" },
  { value: "busy", label: "Ocupado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "completed", label: "Finalizado" },
];

export const OPERATIONAL_STATUS_OPTIONS = [
  { value: "waiting", label: "En espera" },
  { value: "in_progress", label: "En proceso" },
  { value: "completed", label: "Finalizado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "postponed", label: "Aplazado" },
];

export const RECURRENCE_TYPE_OPTIONS = [
  { value: "none", label: "Sin recurrencia" },
  { value: "daily", label: "Diaria" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
];

export const findLabel = (options, value) => {
  const match = options.find((option) => option.value === value);
  return match ? match.label : value;
};
