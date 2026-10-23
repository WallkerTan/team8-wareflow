export type ShipmentStatus = "PENDING" | "SHIPPING" | "COMPLETED" | "CANCELLED";

export interface ShipmentResponse {
    id: number;
    shipmentNo: string;
    issueId: number;
    issueNo: string;
    shipmentDate?: string;
    carrierName?: string;
    trackingNumber?: string;
    receiverName?: string;
    receiverAddress?: string;
    receiverPhone?: string;
    status: ShipmentStatus;
    createdBy?: number;
    changedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateShipmentRequest {
    issueId: number;
    shipmentDate?: string;
    carrierName?: string;
    trackingNumber?: string;
}

export interface UpdateShipmentStatusRequest {
    status: ShipmentStatus;
    note?: string;
    carrierName?: string;
    trackingNumber?: string;
}

export interface ShipmentLogResponse {
    id: number;
    shipmentId: number;
    fromStatus?: ShipmentStatus;
    toStatus: ShipmentStatus;
    note?: string;
    changedBy?: number;
    createdAt?: string;
}
