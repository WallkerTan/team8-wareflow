package com.example.backend.service;

import com.example.backend.dto.AdminStatsResponse;
import com.example.backend.enums.DocumentStatus;
import com.example.backend.enums.Role;
import com.example.backend.enums.ShipmentStatus;
import com.example.backend.enums.UserStatus;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.IssueRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReceiptRepository;
import com.example.backend.repository.ShipmentRepository;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReceiptRepository receiptRepository;
    private final IssueRepository issueRepository;
    private final ShipmentRepository shipmentRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long lowStock = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() <= p.getMinStock())
                .count();

        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByStatus(UserStatus.ACTIVE))
                .lockedUsers(userRepository.countByStatus(UserStatus.LOCKED))
                .totalSuppliers(supplierRepository.count())
                .totalCategories(categoryRepository.count())
                .totalProducts(productRepository.count())
                .lowStockProducts(lowStock)
                .draftReceipts(receiptRepository.countByStatus(DocumentStatus.DRAFT))
                .confirmedReceipts(receiptRepository.countByStatus(DocumentStatus.CONFIRMED))
                .draftIssues(issueRepository.countByStatus(DocumentStatus.DRAFT))
                .confirmedIssues(issueRepository.countByStatus(DocumentStatus.CONFIRMED))
                .pendingShipments(shipmentRepository.countByStatus(ShipmentStatus.PENDING))
                .build();
    }
}
