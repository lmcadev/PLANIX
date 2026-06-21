import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../api/authApi";
import { usersApi } from "../api/usersApi";
import { tokenStorage } from "../utils/tokenStorage";
import { AUTH_LOGOUT_EVENT } from "../api/httpClient";
import { hasAnyRole } from "../constants/roles";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    const response = await usersApi.getById(userId);
    setUser(response.data);
    return response.data;
  }, []);

  const bootstrap = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    try {
      const { user_id } = jwtDecode(accessToken);
      await loadProfile(user_id);
    } catch {
      tokenStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [loadProfile]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const handleForcedLogout = () => setUser(null);
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const response = await authApi.login({ email, password });
      tokenStorage.setTokens(response.data.access, response.data.refresh);
      const { user_id } = jwtDecode(response.data.access);
      return loadProfile(user_id);
    },
    [loadProfile],
  );

  const register = useCallback((payload) => authApi.register(payload), []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      tokenStorage.clear();
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  const userHasAnyRole = useCallback((allowedRoles) => hasAnyRole(user?.roles, allowedRoles), [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      userHasAnyRole,
    }),
    [user, isLoading, login, register, logout, userHasAnyRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
