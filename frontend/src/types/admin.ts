import type { Role, UserStatus } from "./auth";

export interface AdminStatsResponse {
    totalUsers: number;
    activeUsers: number;
    lockedUsers: number;
    totalSuppliers: number;
    totalCategories: number;
    totalProducts: number;
    lowStockProducts: number;
    draftReceipts: number;
    confirmedReceipts: number;
    draftIssues: number;
    confirmedIssues: number;
    pendingShipments: number;
}

export interface CreateUserRequest {
    email: string;
    fullName: string;
    password: string;
    role: Role;
    status?: UserStatus;
    phone?: string;
    address?: string;
}

export interface UpdateUserRequest {
    email?: string;
    fullName: string;
    role?: Role;
    phone?: string;
    address?: string;
}

export interface UpdateUserStatusRequest {
    status: UserStatus;
}
