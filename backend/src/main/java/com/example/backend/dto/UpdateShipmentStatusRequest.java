package com.example.backend.dto;

import com.example.backend.enums.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShipmentStatusRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private ShipmentStatus status;

    private String note;

    private String carrierName;

    private String trackingNumber;
}
