export const ROLE_NAMES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  READONLY: "readonly",
};

export const hasAnyRole = (userRoles, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRoles) return false;
  const normalized = userRoles.map((role) => role.name.toLowerCase());
  return allowedRoles.some((allowed) => normalized.includes(allowed));
};
