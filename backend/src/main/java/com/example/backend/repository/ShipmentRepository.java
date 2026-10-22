package com.example.backend.repository;

import com.example.backend.entity.Shipment;
import com.example.backend.enums.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByIssueId(Long issueId);

    Optional<Shipment> findByShipmentNo(String shipmentNo);

    boolean existsByShipmentNo(String shipmentNo);

    @Query("""
            SELECT s FROM Shipment s
            WHERE (:status IS NULL OR s.status = :status)
              AND (:issueId IS NULL OR s.issueId = :issueId)
            """)
    Page<Shipment> search(@Param("status") ShipmentStatus status,
                          @Param("issueId") Long issueId,
                          Pageable pageable);

    long countByStatus(ShipmentStatus status);
}
