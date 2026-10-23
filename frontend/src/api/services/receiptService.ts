import { apiClient } from "../client";
import type { DocumentStatus, PageResponse, ReceiptRequest, ReceiptResponse } from "../../types";

export interface ReceiptFilterParams {
    status?: DocumentStatus;
    supplierId?: number;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
}

export const receiptService = {
    getReceipts: async (params?: ReceiptFilterParams): Promise<PageResponse<ReceiptResponse>> => {
        const response = await apiClient.get<PageResponse<ReceiptResponse>>("/api/receipts", {
            params,
        });
        return response.data;
    },

    getReceipt: async (id: number): Promise<ReceiptResponse> => {
        const response = await apiClient.get<ReceiptResponse>(`/api/receipts/${id}`);
        return response.data;
    },

    createReceipt: async (data: ReceiptRequest): Promise<ReceiptResponse> => {
        const response = await apiClient.post<ReceiptResponse>("/api/receipts", data);
        return response.data;
    },

    updateReceipt: async (id: number, data: ReceiptRequest): Promise<ReceiptResponse> => {
        const response = await apiClient.put<ReceiptResponse>(`/api/receipts/${id}`, data);
        return response.data;
    },

    deleteReceipt: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/receipts/${id}`);
    },

    confirmReceipt: async (id: number): Promise<ReceiptResponse> => {
        const response = await apiClient.post<ReceiptResponse>(`/api/receipts/${id}/confirm`);
        return response.data;
    },

    cancelReceipt: async (id: number): Promise<ReceiptResponse> => {
        const response = await apiClient.post<ReceiptResponse>(`/api/receipts/${id}/cancel`);
        return response.data;
    },
};
