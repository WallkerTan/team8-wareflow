package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products", uniqueConstraints = {
        @UniqueConstraint(name = "uk_products_owner_sku", columnNames = {"owner_id", "sku"})
})
public class Product extends BaseEntity {

    /** ID của chủ kho (Warehouse Owner) sở hữu sản phẩm này. */
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    /** ID của Nhà cung cấp cung ứng sản phẩm này. */
    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    /** ID của danh mục - không FK chéo schema, validate ở tầng service. */
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "unit", length = 30)
    private String unit;

    @Column(name = "price", precision = 19, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    @Builder.Default
    private Integer stockQuantity = 0;

    /** Ngưỡng cảnh báo tồn thấp: stock_quantity <= min_stock. */
    @Column(name = "min_stock", nullable = false)
    @Builder.Default
    private Integer minStock = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean active = true;
}
