export const formatDateTime = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatDate = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("es-CO", {
    dateStyle: "medium",
  });
};

export const toDateTimeInputValue = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};
