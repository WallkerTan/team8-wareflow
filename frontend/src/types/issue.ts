import type { DocumentStatus } from "./receipt";

export interface IssueItemResponse {
    id: number;
    productId: number;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice?: number;
    totalPrice?: number;
}

export interface IssueResponse {
    id: number;
    issueNo: string;
    issueDate?: string;
    receiverName: string;
    receiverAddress?: string;
    receiverPhone?: string;
    note?: string;
    status: DocumentStatus;
    createdBy?: number;
    changedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    items: IssueItemResponse[];
}

export interface IssueItemRequest {
    productId: number;
    quantity: number;
    unitPrice?: number;
}

export interface IssueRequest {
    issueDate?: string;
    receiverName: string;
    receiverAddress?: string;
    receiverPhone?: string;
    note?: string;
    items: IssueItemRequest[];
}
