package com.example.backend.dto;

import com.example.backend.enums.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentLogResponse {

    private Long id;
    private Long shipmentId;
    private ShipmentStatus fromStatus;
    private ShipmentStatus toStatus;
    private String note;
    private Long changedBy;
    private LocalDateTime createdAt;
}
