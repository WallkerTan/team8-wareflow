export interface CategoryResponse {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryRequest {
    name: string;
    description?: string;
}

export interface SupplierResponse {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface SupplierRequest {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    active?: boolean;
}

export interface ProductResponse {
    id: number;
    ownerId?: number;
    supplierId?: number;
    supplierName?: string;
    sku: string;
    name: string;
    description?: string;
    categoryId?: number;
    categoryName?: string;
    unit?: string;
    price?: number;
    stockQuantity: number;
    minStock: number;
    lowStock?: boolean;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductRequest {
    sku: string;
    name: string;
    description?: string;
    supplierId: number;
    categoryId?: number;
    unit?: string;
    price?: number;
    stockQuantity?: number;
    minStock: number;
    active?: boolean;
}
