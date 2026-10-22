package com.example.backend.dto;

import com.example.backend.enums.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {

    private Long id;
    private String shipmentNo;
    private Long issueId;
    private String issueNo;
    private LocalDate shipmentDate;
    private String carrierName;
    private String trackingNumber;
    private String receiverName;
    private String receiverAddress;
    private String receiverPhone;
    private ShipmentStatus status;
    private Long createdBy;
    private Long changedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
