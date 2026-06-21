export const ROLE_NAMES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  READONLY: "readonly",
};

export const PERMISSION_CODES = {
  SCHEDULES_WRITE: "schedules:write",
};

export const hasAnyRole = (userRoles, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRoles) return false;
  const normalized = userRoles.map((role) => role.name.toLowerCase());
  return allowedRoles.some((allowed) => normalized.includes(allowed));
};

export const hasAnyPermission = (userRoles, allowedPermissions) => {
  if (!allowedPermissions || allowedPermissions.length === 0) return true;
  if (!userRoles) return false;
  const permissionCodes = userRoles.flatMap((role) =>
    (role.permissions ?? []).map((permission) => permission.code),
  );
  return allowedPermissions.some((allowed) => permissionCodes.includes(allowed));
};
