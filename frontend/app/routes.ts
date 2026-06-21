import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/layouts/AuthLayout.tsx', [
    route('login', 'routes/LoginPage.tsx'),
    route('register', 'routes/RegisterPage.tsx'),
  ]),
  layout('routes/layouts/ProtectedRoute.tsx', [
    layout('routes/layouts/AppLayout.tsx', [
      index('routes/DashBoardPage.tsx'),
      route('schedules', 'routes/SchedulesPage.tsx'),
      route('notifications', 'routes/NotificationsPage.tsx'),
      layout('routes/layouts/RoleLayout.tsx', [
        route('users', 'routes/UsersPage.tsx'),
        route('roles', 'routes/RolesPage.tsx'),
      ]),
    ]),
  ]),
  route('*', 'routes/NotFoundPage.tsx'),
] satisfies RouteConfig;
