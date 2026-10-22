package com.example.backend.entity;

import com.example.backend.enums.ShipmentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Shipment gắn 1-1 với một Issue đã CONFIRMED.
 * Không FK chéo schema: issueId chỉ lưu ID, validate ở tầng service.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shipments")
public class Shipment extends BaseEntity {

    @Column(name = "shipment_no", nullable = false, unique = true, length = 50)
    private String shipmentNo;

    @Column(name = "issue_id", nullable = false, unique = true)
    private Long issueId;

    @Column(name = "shipment_date", nullable = false)
    private LocalDate shipmentDate;

    @Column(name = "carrier_name", length = 150)
    private String carrierName;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "receiver_name", length = 150)
    private String receiverName;

    @Column(name = "receiver_address", length = 500)
    private String receiverAddress;

    @Column(name = "receiver_phone", length = 20)
    private String receiverPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.PENDING;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "changed_by")
    private Long changedBy;
}
