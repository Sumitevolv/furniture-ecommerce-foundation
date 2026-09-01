import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { publicEnv } from "./env";
import { ApiError, type ApiResponse } from "@/types/api";

const ACCESS_TOKEN_KEY = "furniture_access_token";
const REFRESH_TOKEN_KEY = "furniture_refresh_token";

export const tokenStorage = {
  getAccessToken: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_TOKEN_KEY)),
  getRefreshToken: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_TOKEN_KEY)),
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

/**
 * Single axios instance shared by every service. Handles:
 *  - attaching the JWT access token
 *  - normalising errors into ApiError
 *  - a single-flight refresh-token retry on 401
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: publicEnv.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${publicEnv.apiBaseUrl}/auth/refresh`,
      { refreshToken }
    );
    tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } else {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            } else {
              reject(normaliseError(error));
            }
          });
        });
      }
    }

    return Promise.reject(normaliseError(error));
  }
);

function normaliseError(error: AxiosError<ApiResponse<unknown>>): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;
  const message =
    body?.message ??
    (status === 0
      ? "Unable to reach the server. Check your connection and try again."
      : "Something went wrong. Please try again.");
  return new ApiError(message, status, body?.errors, error.code);
}

/** Unwraps the ApiResponse envelope and returns just the payload. */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;
  return data.data;
}
