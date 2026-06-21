import { Navigate, Outlet, useLoaderData } from 'react-router';
import { useAuthStore } from '~/store/authStore';

/** Restringe acceso a usuarios con alguno de los roles indicados (ej. admin, coordinator). */
export default function RoleRoute() {
  const hasRole = useAuthStore((s) => s.hasRole);

  const permissions: Record<string, string[]> = {
    '/users': ['admin'],
    '/roles': ['admin'],
  };

  const allow = permissions[location.pathname] ?? [];

  console.log('RoleRoute', allow, hasRole(...allow));
  if (!hasRole(...allow)) {
    console.debug('RoleRoute: user does not have required role, redirecting to /');
    return <Navigate to='/' replace />;
  }

  console.debug('RoleRoute: user has required role, rendering outlet');
  return <Outlet />;
}
