import { useEffect, useState } from 'react';
import { useAuthStore } from '~/store/authStore';
import { usersApi } from '~/api/users';

/**
 * El JWT solo trae el user_id (claim por defecto de SimpleJWT).
 * Este hook completa el perfil (nombre, email, roles) pidiendolo una vez
 * a /api/users/{id}/ y lo guarda en el store para toda la sesion.
 */
export function useBootstrapUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.userId);
  const user = useAuthStore((s) => s.user);

  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const [isLoading, setIsLoading] = useState(!user && isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !userId || user) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    usersApi
      .get(userId)
      .then(({ data }) => {
        if (!cancelled) {
          setUser(data);
        }
      })
      .catch(() => {
        console.debug('Failed to fetch user profile, logging out');
        if (!cancelled) {
          logout();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, userId, user, setUser, logout]);

  return { isLoading };
}
