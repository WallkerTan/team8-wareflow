package com.example.backend.repository;

import com.example.backend.entity.Receipt;
import com.example.backend.enums.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    Optional<Receipt> findByReceiptNo(String receiptNo);

    boolean existsByReceiptNo(String receiptNo);

    @Query("""
            SELECT r FROM Receipt r
            WHERE (:userId IS NULL OR r.createdBy = :userId)
              AND (:status IS NULL OR r.status = :status)
              AND (:supplierId IS NULL OR r.supplierId = :supplierId)
              AND (:fromDate IS NULL OR r.receiptDate >= :fromDate)
              AND (:toDate IS NULL OR r.receiptDate <= :toDate)
            """)
    Page<Receipt> search(@Param("userId") Long userId,
                         @Param("status") DocumentStatus status,
                         @Param("supplierId") Long supplierId,
                         @Param("fromDate") LocalDate fromDate,
                         @Param("toDate") LocalDate toDate,
                         Pageable pageable);

    long countByStatus(DocumentStatus status);
}
