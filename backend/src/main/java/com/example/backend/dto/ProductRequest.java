package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "SKU không được để trống")
    @Size(max = 100, message = "SKU tối đa 100 ký tự")
    private String sku;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 200, message = "Tên sản phẩm tối đa 200 ký tự")
    private String name;

    @Size(max = 1000, message = "Mô tả tối đa 1000 ký tự")
    private String description;

    private Long categoryId;

    @NotNull(message = "Nhà cung cấp không được để trống")
    private Long supplierId;

    private String unit;

    private BigDecimal price;

    @Min(value = 0, message = "Tồn kho không được âm")
    private Integer stockQuantity;

    @NotNull(message = "Ngưỡng tồn thấp không được để trống")
    @Min(value = 0, message = "Ngưỡng tồn thấp không được âm")
    private Integer minStock;

    private Boolean active;
}
