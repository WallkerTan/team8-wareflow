import { apiClient } from "../client";
import type { SupplierRequest, SupplierResponse } from "../../types";

export const supplierService = {
    getSuppliers: async (): Promise<SupplierResponse[]> => {
        const response = await apiClient.get<SupplierResponse[]>("/api/suppliers");
        return response.data;
    },

    getSupplier: async (id: number): Promise<SupplierResponse> => {
        const response = await apiClient.get<SupplierResponse>(`/api/suppliers/${id}`);
        return response.data;
    },

    createSupplier: async (data: SupplierRequest): Promise<SupplierResponse> => {
        const response = await apiClient.post<SupplierResponse>("/api/suppliers", data);
        return response.data;
    },

    updateSupplier: async (id: number, data: SupplierRequest): Promise<SupplierResponse> => {
        const response = await apiClient.put<SupplierResponse>(`/api/suppliers/${id}`, data);
        return response.data;
    },

    deleteSupplier: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/suppliers/${id}`);
    },
};
