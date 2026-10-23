export type DocumentStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface ReceiptItemResponse {
    id: number;
    productId: number;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice?: number;
    totalPrice?: number;
}

export interface ReceiptResponse {
    id: number;
    receiptNo: string;
    supplierId: number;
    supplierName: string;
    receiptDate?: string;
    note?: string;
    status: DocumentStatus;
    createdBy?: number;
    changedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    items: ReceiptItemResponse[];
}

export interface ReceiptItemRequest {
    productId: number;
    quantity: number;
    unitPrice?: number;
}

export interface ReceiptRequest {
    supplierId: number;
    receiptDate?: string;
    note?: string;
    items: ReceiptItemRequest[];
}
