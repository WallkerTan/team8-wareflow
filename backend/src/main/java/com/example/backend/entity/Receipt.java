package com.example.backend.entity;

import com.example.backend.enums.DocumentStatus;
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

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "receipts")
public class Receipt extends BaseEntity {

    @Column(name = "receipt_no", nullable = false, unique = true, length = 50)
    private String receiptNo;

    /** ID nhà cung cấp - không FK chéo schema, validate ở tầng service. */
    @Column(name = "supplier_id", nullable = false)
    private Long supplierId;

    @Column(name = "receipt_date", nullable = false)
    private LocalDate receiptDate;

    @Column(length = 500)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "changed_by")
    private Long changedBy;
}
