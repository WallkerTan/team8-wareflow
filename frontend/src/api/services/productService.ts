import { apiClient } from "../client";
import type { PageResponse, ProductRequest, ProductResponse } from "../../types";

export interface ProductFilterParams {
    categoryId?: number;
    keyword?: string;
    lowStock?: boolean;
    page?: number;
    size?: number;
}

export const productService = {
    getProducts: async (params?: ProductFilterParams): Promise<PageResponse<ProductResponse>> => {
        const response = await apiClient.get<PageResponse<ProductResponse>>("/api/products", {
            params,
        });
        return response.data;
    },

    getProduct: async (id: number): Promise<ProductResponse> => {
        const response = await apiClient.get<ProductResponse>(`/api/products/${id}`);
        return response.data;
    },

    createProduct: async (data: ProductRequest): Promise<ProductResponse> => {
        const response = await apiClient.post<ProductResponse>("/api/products", data);
        return response.data;
    },

    updateProduct: async (id: number, data: ProductRequest): Promise<ProductResponse> => {
        const response = await apiClient.put<ProductResponse>(`/api/products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/products/${id}`);
    },
};
