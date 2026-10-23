import { apiClient } from "../client";
import type { CategoryRequest, CategoryResponse } from "../../types";

export const categoryService = {
    getCategories: async (): Promise<CategoryResponse[]> => {
        const response = await apiClient.get<CategoryResponse[]>("/api/categories");
        return response.data;
    },

    getCategory: async (id: number): Promise<CategoryResponse> => {
        const response = await apiClient.get<CategoryResponse>(`/api/categories/${id}`);
        return response.data;
    },

    createCategory: async (data: CategoryRequest): Promise<CategoryResponse> => {
        const response = await apiClient.post<CategoryResponse>("/api/categories", data);
        return response.data;
    },

    updateCategory: async (id: number, data: CategoryRequest): Promise<CategoryResponse> => {
        const response = await apiClient.put<CategoryResponse>(`/api/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/categories/${id}`);
    },
};
