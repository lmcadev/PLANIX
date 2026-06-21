import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthTokens, User } from '~/types';
import { decodeJwt } from '~/lib/jwt';

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
  isAuthenticated: boolean;
  /** id extraido del access token, util antes de tener el User completo */
  userId: number | null;
  roleNames: string[];

  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  setAccessToken: (access: string) => void;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,
      isAuthenticated: false,
      userId: null,
      roleNames: [],

      setTokens: (tokens) => {
        const payload = decodeJwt(tokens.access);
        set({
          access: tokens.access,
          refresh: tokens.refresh,
          isAuthenticated: true,
          userId: payload?.user_id ?? null,
        });
      },

      setAccessToken: (access) => {
        const payload = decodeJwt(access);
        set({ access, userId: payload?.user_id ?? get().userId });
      },

      setUser: (user) => {
        set({
          user,
          userId: user.id,
          roleNames: user.roles.map((r) => r.name.toLowerCase()),
        });
      },

      logout: () => {
        set({
          access: null,
          refresh: null,
          user: null,
          isAuthenticated: false,
          userId: null,
          roleNames: [],
        });
      },

      hasRole: (...roles) => {
        const mine = get().roleNames;
        return roles.some((r) => mine.includes(r.toLowerCase()));
      },
    }),
    {
      name: 'planix-auth',
      partialize: (state) => ({
        access: state.access,
        refresh: state.refresh,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        roleNames: state.roleNames,
      }),
    },
  ),
);
