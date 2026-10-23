import { apiClient } from "../client";
import type { AuthResponse, ChangePasswordRequest, LoginRequest, UpdateProfileRequest, UserResponse } from "../../types";

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
        return response.data;
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            `/api/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`
        );
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post("/api/auth/logout");
    },

    getMe: async (): Promise<UserResponse> => {
        const response = await apiClient.get<UserResponse>("/api/me");
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
        const response = await apiClient.put<UserResponse>("/api/me", data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await apiClient.patch("/api/me/password", data);
    },
};
