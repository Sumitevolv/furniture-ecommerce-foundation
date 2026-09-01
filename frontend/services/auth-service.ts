import { apiClient, tokenStorage, unwrap } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { AuthSession, LoginPayload, RegisterPayload, User } from "@/types/user";

export const authService = {
  login: async (payload: LoginPayload) => {
    const session = await unwrap(apiClient.post<ApiResponse<AuthSession>>("/auth/login", payload));
    tokenStorage.setTokens(session.tokens.accessToken, session.tokens.refreshToken);
    return session;
  },

  register: async (payload: RegisterPayload) => {
    const session = await unwrap(apiClient.post<ApiResponse<AuthSession>>("/auth/register", payload));
    tokenStorage.setTokens(session.tokens.accessToken, session.tokens.refreshToken);
    return session;
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },

  me: () => unwrap(apiClient.get<ApiResponse<User>>("/auth/me")),

  requestPasswordReset: (email: string) =>
    apiClient.post<ApiResponse<null>>("/auth/forgot-password", { email }),

  resetPassword: (payload: { token: string; newPassword: string }) =>
    apiClient.post<ApiResponse<null>>("/auth/reset-password", payload),
};
