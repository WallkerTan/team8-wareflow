package com.example.backend.repository;

import com.example.backend.entity.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, Long> {

    List<ReceiptItem> findByReceiptIdOrderById(Long receiptId);

    void deleteByReceiptId(Long receiptId);
}
