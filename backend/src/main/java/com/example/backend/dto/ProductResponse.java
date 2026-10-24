package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private Long ownerId;
    private Long supplierId;
    private String supplierName;
    private String sku;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String unit;
    private BigDecimal price;
    private Integer stockQuantity;
    private Integer minStock;
    private Boolean lowStock;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
