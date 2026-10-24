package com.example.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueRequest {

    @NotNull(message = "Nhà cung cấp không được để trống")
    private Long supplierId;

    private LocalDate issueDate;

    @NotBlank(message = "Tên người nhận không được để trống")
    private String receiverName;

    private String receiverAddress;

    private String receiverPhone;

    private String note;

    @Valid
    @NotEmpty(message = "Phiếu xuất phải có ít nhất 1 sản phẩm")
    private List<Item> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {

        @NotNull(message = "Sản phẩm không được để trống")
        private Long productId;

        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
        private Integer quantity;

        private BigDecimal unitPrice;
    }
}
