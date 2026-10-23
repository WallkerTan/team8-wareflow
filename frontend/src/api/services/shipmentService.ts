import { apiClient } from "../client";
import type {
    CreateShipmentRequest,
    PageResponse,
    ShipmentLogResponse,
    ShipmentResponse,
    ShipmentStatus,
    UpdateShipmentStatusRequest,
} from "../../types";

export interface ShipmentFilterParams {
    status?: ShipmentStatus;
    issueId?: number;
    page?: number;
    size?: number;
}

export const shipmentService = {
    getShipments: async (params?: ShipmentFilterParams): Promise<PageResponse<ShipmentResponse>> => {
        const response = await apiClient.get<PageResponse<ShipmentResponse>>("/api/shipments", {
            params,
        });
        return response.data;
    },

    getShipment: async (id: number): Promise<ShipmentResponse> => {
        const response = await apiClient.get<ShipmentResponse>(`/api/shipments/${id}`);
        return response.data;
    },

    createShipment: async (data: CreateShipmentRequest): Promise<ShipmentResponse> => {
        const response = await apiClient.post<ShipmentResponse>("/api/shipments", data);
        return response.data;
    },

    updateShipmentStatus: async (
        id: number,
        data: UpdateShipmentStatusRequest
    ): Promise<ShipmentResponse> => {
        const response = await apiClient.patch<ShipmentResponse>(`/api/shipments/${id}/status`, data);
        return response.data;
    },

    getShipmentLogs: async (id: number): Promise<ShipmentLogResponse[]> => {
        const response = await apiClient.get<ShipmentLogResponse[]>(`/api/shipments/${id}/logs`);
        return response.data;
    },
};
