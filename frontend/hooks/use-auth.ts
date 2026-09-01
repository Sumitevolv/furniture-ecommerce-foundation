"use client";

import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services/auth-service";
import { tokenStorage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { LoginPayload, RegisterPayload } from "@/types/user";

export function useAuth() {
  const { user, isAuthenticated, isHydrated, setUser, reset } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const me = await authService.me();
        setUser(me);
      } catch {
        reset();
      } finally {
        setIsBootstrapping(false);
      }
    }
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const session = await authService.login(payload);
      setUser(session.user);
      return session.user;
    },
    [setUser]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const session = await authService.register(payload);
      setUser(session.user);
      return session.user;
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    reset();
  }, [reset]);

  return {
    user,
    isAuthenticated,
    isLoading: isBootstrapping || !isHydrated,
    login,
    register,
    logout,
  };
}
