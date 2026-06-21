export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  SCHEDULES: "/schedules",
  SCHEDULE_NEW: "/schedules/new",
  SCHEDULE_EDIT: "/schedules/:id/edit",
  USERS: "/users",
  USER_NEW: "/users/new",
  USER_EDIT: "/users/:id/edit",
  ROLES: "/roles",
  ROLE_NEW: "/roles/new",
  ROLE_EDIT: "/roles/:id/edit",
  PERMISSIONS: "/permissions",
  NOTIFICATIONS: "/notifications",
};

export const buildRoute = (template, params) => {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    template,
  );
};
