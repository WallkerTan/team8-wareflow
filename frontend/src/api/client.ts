import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse, ErrorResponse } from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// ─── Store Injection ──────────────────────────────────────────────────────────
// We use a lazy store reference to avoid circular imports between client.ts and Store.ts.
// The store is injected once at app startup via injectStore().
type StoreType = {
    getState: () => {
        auth: {
            accessToken: string | null;
            refreshToken: string | null;
        };
    };
    dispatch: (action: unknown) => void;
};

let _store: StoreType | null = null;

export const injectStore = (store: StoreType) => {
    _store = store;
};

const getAccessToken = (): string | null => {
    if (_store) return _store.getState().auth.accessToken;
    // Fallback to sessionStorage if store not injected yet (e.g. during hydration)
    return sessionStorage.getItem("wf_access");
};

const getRefreshToken = (): string | null => {
    if (_store) return _store.getState().auth.refreshToken;
    return sessionStorage.getItem("wf_refresh");
};

const dispatchUpdateTokens = (accessToken: string, refreshToken?: string) => {
    if (_store) {
        // Dynamic import avoids circular dependency
        import("../store/slice/authSlice").then(({ updateTokens }) => {
            _store!.dispatch(updateTokens({ accessToken, refreshToken }));
        });
    }
    // Always sync sessionStorage as backup
    sessionStorage.setItem("wf_access", accessToken);
    if (refreshToken) sessionStorage.setItem("wf_refresh", refreshToken);
};

const dispatchClearCredentials = () => {
    if (_store) {
        import("../store/slice/authSlice").then(({ clearCredentials }) => {
            _store!.dispatch(clearCredentials());
        });
    }
    sessionStorage.removeItem("wf_access");
    sessionStorage.removeItem("wf_refresh");
    sessionStorage.removeItem("wf_user");
};

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor: 401 Auto-Refresh ───────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!error.response || error.response.status !== 401 || !originalRequest) {
            return Promise.reject(error);
        }

        // Avoid infinite loop on login / refresh endpoint
        if (
            originalRequest.url?.includes("/api/auth/login") ||
            originalRequest.url?.includes("/api/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            dispatchClearCredentials();
            if (window.location.pathname !== "/login" && !window.location.pathname.startsWith("/auth")) {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axios.post<AuthResponse>(
                `${API_BASE_URL}/api/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`,
                null,
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;
            dispatchUpdateTokens(data.accessToken, data.refreshToken || refreshToken);

            processQueue(null, data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            dispatchClearCredentials();
            if (window.location.pathname !== "/login" && !window.location.pathname.startsWith("/auth")) {
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

/**
 * Extract user-friendly error message from backend ErrorResponse.
 */
export const getErrorMessage = (error: unknown, defaultMessage = "Đã xảy ra lỗi, vui lòng thử lại"): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ErrorResponse | undefined;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
        if (typeof error.response?.data === "string") return error.response.data;
        if (error.message) return error.message;
    }
    if (error instanceof Error) return error.message;
    return defaultMessage;
};
