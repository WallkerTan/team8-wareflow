package com.example.backend.repository;

import com.example.backend.entity.ShipmentLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentLogRepository extends JpaRepository<ShipmentLog, Long> {

    List<ShipmentLog> findByShipmentIdOrderByIdAsc(Long shipmentId);
}
