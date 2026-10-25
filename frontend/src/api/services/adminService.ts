import { apiClient } from "../client";
import type {
    AdminStatsResponse,
    CreateUserRequest,
    PageResponse,
    Role,
    UpdateUserRequest,
    UserResponse,
    UserStatus,
    ProductRequest,
    ProductResponse,
} from "../../types";

export interface UserFilterParams {
    role?: Role;
    status?: UserStatus;
    keyword?: string;
    page?: number;
    size?: number;
}

export const adminService = {
    getStats: async (): Promise<AdminStatsResponse> => {
        const response = await apiClient.get<AdminStatsResponse>("/api/admin/stats");
        return response.data;
    },

    getUsers: async (params?: UserFilterParams): Promise<PageResponse<UserResponse>> => {
        const response = await apiClient.get<PageResponse<UserResponse>>("/api/users", {
            params,
        });
        return response.data;
    },

    createUser: async (data: CreateUserRequest): Promise<UserResponse> => {
        const response = await apiClient.post<UserResponse>("/api/users", data);
        return response.data;
    },

    updateUser: async (id: number, data: UpdateUserRequest): Promise<UserResponse> => {
        const response = await apiClient.put<UserResponse>(`/api/users/${id}`, data);
        return response.data;
    },

    updateUserStatus: async (id: number, status: UserStatus): Promise<UserResponse> => {
        const response = await apiClient.patch<UserResponse>(`/api/users/${id}/status`, {
            status,
        });
        return response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/users/${id}`);
    },

    createProductForWarehouse: async (data: ProductRequest & { ownerId: number }): Promise<ProductResponse> => {
        const response = await apiClient.post<ProductResponse>("/api/admin/products", data);
        return response.data;
    },
};
