package com.example.backend.enums;

/**
 * Role của user trong hệ thống.
 * ADMIN: quản trị hệ thống (users, suppliers, categories). ADMIN bị chặn /warehouse.
 * WAREHOUSE_OWNER: quản lý kho (products, receipts, issues, shipments). OWNER bị chặn /admin.
 */
public enum Role {
    ADMIN,
    WAREHOUSE_OWNER
}
