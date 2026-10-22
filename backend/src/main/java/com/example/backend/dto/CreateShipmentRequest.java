package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateShipmentRequest {

    /** Id của phiếu xuất đã CONFIRMED. Shipment tạo 1-1 với issue. */
    @NotNull(message = "Phiếu xuất không được để trống")
    private Long issueId;

    private LocalDate shipmentDate;

    private String carrierName;

    private String trackingNumber;
}
