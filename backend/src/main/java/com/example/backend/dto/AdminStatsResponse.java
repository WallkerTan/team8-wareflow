package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalUsers;
    private long activeUsers;
    private long lockedUsers;
    private long totalSuppliers;
    private long totalCategories;
    private long totalProducts;
    private long lowStockProducts;
    private long draftReceipts;
    private long confirmedReceipts;
    private long draftIssues;
    private long confirmedIssues;
    private long pendingShipments;
}
