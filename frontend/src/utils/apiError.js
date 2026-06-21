export const extractFieldErrors = (error) => {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return {};
  const fieldErrors = {};
  Object.entries(data).forEach(([key, value]) => {
    fieldErrors[key] = Array.isArray(value) ? value.join(" ") : String(value);
  });
  return fieldErrors;
};

export const extractErrorMessage = (error) => {
  const data = error?.response?.data;
  if (!data) return "Ocurrio un error inesperado. Intenta nuevamente.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (!firstKey) return "Ocurrio un error inesperado. Intenta nuevamente.";
  const value = data[firstKey];
  return Array.isArray(value) ? value[0] : String(value);
};
