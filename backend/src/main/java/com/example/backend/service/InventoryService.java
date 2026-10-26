package com.example.backend.service;

import com.example.backend.dto.IssueRequest;
import com.example.backend.dto.IssueResponse;
import com.example.backend.dto.PageResponse;
import com.example.backend.dto.ReceiptRequest;
import com.example.backend.dto.ReceiptResponse;
import com.example.backend.entity.Issue;
import com.example.backend.entity.IssueItem;
import com.example.backend.entity.Product;
import com.example.backend.entity.Receipt;
import com.example.backend.entity.ReceiptItem;
import com.example.backend.entity.Supplier;
import com.example.backend.enums.DocumentStatus;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.IssueItemRepository;
import com.example.backend.repository.IssueRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReceiptItemRepository;
import com.example.backend.repository.ReceiptRepository;
import com.example.backend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Inventory Service - nghiệp vụ kho.
 *
 * Quy tắc quan trọng:
 * - W6 (cộng tồn) và W10 (trừ tồn) chạy trong 1 transaction -> tránh lệch kho.
 * - W9: validate quantity &lt;= stock_quantity trước khi confirm phiếu xuất.
 * - Không FK chéo schema: created_by / changed_by / supplier_id / product_id chỉ lưu ID,
 *   validate tồn tại ở tầng service.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptItemRepository receiptItemRepository;
    private final IssueRepository issueRepository;
    private final IssueItemRepository issueItemRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    // ------------------------------------------------------------------
    // RECEIPT - PHIẾU NHẬP
    // ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<ReceiptResponse> searchReceipts(Long userId, DocumentStatus status, Long supplierId,
                                                        LocalDate fromDate, LocalDate toDate,
                                                        int page, int size) {
        Page<Receipt> result = receiptRepository.search(userId, status, supplierId, fromDate, toDate,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
        return PageResponse.of(result.map(this::toReceiptResponse));
    }

    @Transactional(readOnly = true)
    public ReceiptResponse findReceiptById(Long id, Long userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu nhập", id));
        validateReceiptOwner(receipt, userId);
        return toReceiptResponse(receipt);
    }

    @Transactional
    public ReceiptResponse createReceipt(ReceiptRequest request, Long userId) {
        if (!supplierRepository.existsById(request.getSupplierId())) {
            throw new BusinessException("Nhà cung cấp với id = " + request.getSupplierId() + " không tồn tại");
        }
        Map<Long, Integer> quantities = new HashMap<>();
        for (ReceiptRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm với id = " + item.getProductId() + " không tồn tại"));
            if (!request.getSupplierId().equals(product.getSupplierId())) {
                throw new BusinessException("Sản phẩm '" + product.getName() + "' không thuộc nhà cung cấp đã chọn");
            }
            quantities.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }

        Receipt receipt = Receipt.builder()
                .receiptNo(generateReceiptNo())
                .supplierId(request.getSupplierId())
                .receiptDate(request.getReceiptDate() == null ? LocalDate.now() : request.getReceiptDate())
                .note(request.getNote())
                .status(DocumentStatus.DRAFT)
                .createdBy(userId)
                .build();
        receipt = receiptRepository.save(receipt);

        for (ReceiptRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow();
            BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice()
                    : (product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            receiptItemRepository.save(ReceiptItem.builder()
                    .receiptId(receipt.getId())
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .build());
        }
        return toReceiptResponse(receiptRepository.findById(receipt.getId()).orElseThrow());
    }

    @Transactional
    public ReceiptResponse updateReceipt(Long id, ReceiptRequest request, Long userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu nhập", id));
        validateReceiptOwner(receipt, userId);
        requireDraft(receipt.getStatus(), "phiếu nhập");

        Long targetSupplierId = request.getSupplierId() != null ? request.getSupplierId() : receipt.getSupplierId();
        if (!supplierRepository.existsById(targetSupplierId)) {
            throw new BusinessException("Nhà cung cấp với id = " + targetSupplierId + " không tồn tại");
        }
        for (ReceiptRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm với id = " + item.getProductId() + " không tồn tại"));
            if (!targetSupplierId.equals(product.getSupplierId())) {
                throw new BusinessException("Sản phẩm '" + product.getName() + "' không thuộc nhà cung cấp đã chọn");
            }
        }

        if (request.getSupplierId() != null) {
            receipt.setSupplierId(request.getSupplierId());
        }
        if (request.getReceiptDate() != null) {
            receipt.setReceiptDate(request.getReceiptDate());
        }
        if (request.getNote() != null) {
            receipt.setNote(request.getNote());
        }
        receipt.setChangedBy(userId);
        receiptRepository.save(receipt);

        receiptItemRepository.deleteByReceiptId(receipt.getId());
        receiptItemRepository.flush();
        for (ReceiptRequest.Item item : request.getItems()) {
            Product product = productRepository.findByIdAndOwnerId(item.getProductId(), userId).orElseThrow();
            BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice()
                    : (product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            receiptItemRepository.save(ReceiptItem.builder()
                    .receiptId(receipt.getId())
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .build());
        }
        return toReceiptResponse(receiptRepository.findById(receipt.getId()).orElseThrow());
    }

    @Transactional
    public void deleteReceipt(Long id, Long userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu nhập", id));
        validateReceiptOwner(receipt, userId);
        requireDraft(receipt.getStatus(), "phiếu nhập");

        receiptItemRepository.deleteByReceiptId(id);
        receiptItemRepository.flush();
        receiptRepository.delete(receipt);
    }

    /**
     * W6 - Xác nhận phiếu nhập: cộng stock vào kho của chủ kho hiện tại. Toàn bộ nằm trong 1 transaction.
     */
    @Transactional
    public ReceiptResponse confirmReceipt(Long id, Long userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu nhập", id));
        validateReceiptOwner(receipt, userId);
        requireDraft(receipt.getStatus(), "phiếu nhập");

        List<ReceiptItem> items = receiptItemRepository.findByReceiptIdOrderById(id);
        if (items.isEmpty()) {
            throw new BusinessException("Phiếu nhập không có sản phẩm nào để xác nhận");
        }

        // Khoá theo thứ tự ID tăng dần để tránh deadlock khi 2 phiếu nhập
        // cùng chạm vào nhiều sản phẩm theo thứ tự khác nhau.
        List<Long> productIds = items.stream()
                .map(ReceiptItem::getProductId)
                .distinct()
                .sorted()
                .toList();

        for (Long productId : productIds) {
            Product product = productRepository.findByIdForUpdate(productId)
                    .orElseThrow(() -> new BusinessException("Sản phẩm với id = " + productId + " không tồn tại"));
            int quantity = items.stream()
                    .filter(i -> i.getProductId().equals(productId))
                    .mapToInt(ReceiptItem::getQuantity)
                    .sum();
            product.setStockQuantity(product.getStockQuantity() + quantity);
            productRepository.save(product);
        }

        receipt.setStatus(DocumentStatus.CONFIRMED);
        receipt.setChangedBy(userId);
        receiptRepository.save(receipt);

        return toReceiptResponse(receipt);
    }

    @Transactional
    public ReceiptResponse cancelReceipt(Long id, Long userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu nhập", id));
        validateReceiptOwner(receipt, userId);
        requireDraft(receipt.getStatus(), "phiếu nhập");

        receipt.setStatus(DocumentStatus.CANCELLED);
        receipt.setChangedBy(userId);
        receiptRepository.save(receipt);
        return toReceiptResponse(receipt);
    }

    // ------------------------------------------------------------------
    // ISSUE - PHIẾU XUẤT
    // ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<IssueResponse> searchIssues(Long userId, DocumentStatus status, Long supplierId,
                                                    LocalDate fromDate, LocalDate toDate, int page, int size) {
        Page<Issue> result = issueRepository.search(userId, status, supplierId, fromDate, toDate,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
        return PageResponse.of(result.map(this::toIssueResponse));
    }

    @Transactional(readOnly = true)
    public IssueResponse findIssueById(Long id, Long userId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu xuất", id));
        validateIssueOwner(issue, userId);
        return toIssueResponse(issue);
    }

    @Transactional
    public IssueResponse createIssue(IssueRequest request, Long userId) {
        if (!supplierRepository.existsById(request.getSupplierId())) {
            throw new BusinessException("Nhà cung cấp với id = " + request.getSupplierId() + " không tồn tại");
        }
        for (IssueRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm với id = " + item.getProductId() + " không tồn tại"));
            if (!request.getSupplierId().equals(product.getSupplierId())) {
                throw new BusinessException("Sản phẩm '" + product.getName() + "' không thuộc nhà cung cấp đã chọn");
            }
        }

        Issue issue = Issue.builder()
                .issueNo(generateIssueNo())
                .supplierId(request.getSupplierId())
                .issueDate(request.getIssueDate() == null ? LocalDate.now() : request.getIssueDate())
                .receiverName(request.getReceiverName().trim())
                .receiverAddress(request.getReceiverAddress())
                .receiverPhone(request.getReceiverPhone())
                .note(request.getNote())
                .status(DocumentStatus.DRAFT)
                .createdBy(userId)
                .build();
        issue = issueRepository.save(issue);

        for (IssueRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow();
            BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice()
                    : (product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            issueItemRepository.save(IssueItem.builder()
                    .issueId(issue.getId())
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .build());
        }
        return toIssueResponse(issueRepository.findById(issue.getId()).orElseThrow());
    }

    @Transactional
    public IssueResponse updateIssue(Long id, IssueRequest request, Long userId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu xuất", id));
        validateIssueOwner(issue, userId);
        requireDraft(issue.getStatus(), "phiếu xuất");

        Long targetSupplierId = request.getSupplierId() != null ? request.getSupplierId() : issue.getSupplierId();
        if (!supplierRepository.existsById(targetSupplierId)) {
            throw new BusinessException("Nhà cung cấp với id = " + targetSupplierId + " không tồn tại");
        }
        for (IssueRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm với id = " + item.getProductId() + " không tồn tại"));
            if (!targetSupplierId.equals(product.getSupplierId())) {
                throw new BusinessException("Sản phẩm '" + product.getName() + "' không thuộc nhà cung cấp đã chọn");
            }
        }

        if (request.getSupplierId() != null) {
            issue.setSupplierId(request.getSupplierId());
        }
        if (request.getIssueDate() != null) {
            issue.setIssueDate(request.getIssueDate());
        }
        if (request.getReceiverName() != null && !request.getReceiverName().isBlank()) {
            issue.setReceiverName(request.getReceiverName().trim());
        }
        if (request.getReceiverAddress() != null) {
            issue.setReceiverAddress(request.getReceiverAddress());
        }
        if (request.getReceiverPhone() != null) {
            issue.setReceiverPhone(request.getReceiverPhone());
        }
        if (request.getNote() != null) {
            issue.setNote(request.getNote());
        }
        issue.setChangedBy(userId);
        issueRepository.save(issue);

        issueItemRepository.deleteByIssueId(issue.getId());
        issueItemRepository.flush();
        for (IssueRequest.Item item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow();
            BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice()
                    : (product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO);
            issueItemRepository.save(IssueItem.builder()
                    .issueId(issue.getId())
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .unitPrice(unitPrice)
                    .build());
        }
        return toIssueResponse(issueRepository.findById(issue.getId()).orElseThrow());
    }

    @Transactional
    public void deleteIssue(Long id, Long userId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu xuất", id));
        validateIssueOwner(issue, userId);
        requireDraft(issue.getStatus(), "phiếu xuất");

        issueItemRepository.deleteByIssueId(id);
        issueItemRepository.flush();
        issueRepository.delete(issue);
    }

    /**
     * W10 - Xác nhận phiếu xuất: trừ stock của kho hiện tại. W9 - validate quantity &lt;= stock_quantity.
     * Toàn bộ nằm trong 1 transaction: nếu có bất kỳ lỗi nào thì rollback toàn bộ.
     */
    @Transactional
    public IssueResponse confirmIssue(Long id, Long userId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu xuất", id));
        validateIssueOwner(issue, userId);
        requireDraft(issue.getStatus(), "phiếu xuất");

        List<IssueItem> items = issueItemRepository.findByIssueIdOrderById(id);
        if (items.isEmpty()) {
            throw new BusinessException("Phiếu xuất không có sản phẩm nào để xác nhận");
        }

        // Gom theo product để trừ tổng hợp (tránh trừ nhiều lần cho cùng 1 SKU).
        Map<Long, Integer> required = new HashMap<>();
        for (IssueItem item : items) {
            required.merge(item.getProductId(), item.getQuantity(), Integer::sum);
        }

        // Khoá theo thứ tự ID tăng dần để tránh deadlock khi 2 phiếu xuất
        // cùng chạm vào nhiều sản phẩm theo thứ tự khác nhau.
        List<Long> productIds = required.keySet().stream().sorted().toList();

        // W9: kiểm tra tồn trước khi trừ (đọc đã khoá => không có lost update).
        for (Long productId : productIds) {
            Product product = productRepository.findByIdForUpdate(productId)
                    .orElseThrow(() -> new BusinessException("Sản phẩm với id = " + productId + " không tồn tại"));
            if (product.getStockQuantity() < required.get(productId)) {
                throw new BusinessException(
                        "Sản phẩm '" + product.getName() + "' chỉ còn " + product.getStockQuantity()
                                + " trong kho, không đủ để xuất " + required.get(productId));
            }
        }

        for (Long productId : productIds) {
            Product product = productRepository.findById(productId).orElseThrow();
            product.setStockQuantity(product.getStockQuantity() - required.get(productId));
            productRepository.save(product);
        }

        issue.setStatus(DocumentStatus.CONFIRMED);
        issue.setChangedBy(userId);
        issueRepository.save(issue);

        return toIssueResponse(issue);
    }

    @Transactional
    public IssueResponse cancelIssue(Long id, Long userId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu xuất", id));
        validateIssueOwner(issue, userId);
        requireDraft(issue.getStatus(), "phiếu xuất");

        issue.setStatus(DocumentStatus.CANCELLED);
        issue.setChangedBy(userId);
        issueRepository.save(issue);
        return toIssueResponse(issue);
    }

    // ------------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------------

    private void validateReceiptOwner(Receipt receipt, Long userId) {
        if (receipt.getCreatedBy() != null && !receipt.getCreatedBy().equals(userId)) {
            throw new BusinessException("Bạn không có quyền truy cập phiếu nhập của kho khác");
        }
    }

    private void validateIssueOwner(Issue issue, Long userId) {
        if (issue.getCreatedBy() != null && !issue.getCreatedBy().equals(userId)) {
            throw new BusinessException("Bạn không có quyền truy cập phiếu xuất của kho khác");
        }
    }

    private void requireDraft(DocumentStatus status, String name) {
        if (status != DocumentStatus.DRAFT) {
            throw new BusinessException("Chỉ được thao tác trên " + name + " ở trạng thái DRAFT");
        }
    }

    private ReceiptResponse toReceiptResponse(Receipt receipt) {
        String supplierName = supplierRepository.findById(receipt.getSupplierId())
                .map(Supplier::getName)
                .orElse(null);

        List<ReceiptResponse.Item> items = receiptItemRepository.findByReceiptIdOrderById(receipt.getId()).stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    BigDecimal unitPrice = item.getUnitPrice() == null ? BigDecimal.ZERO : item.getUnitPrice();
                    return ReceiptResponse.Item.builder()
                            .id(item.getId())
                            .productId(item.getProductId())
                            .productName(product == null ? null : product.getName())
                            .sku(product == null ? null : product.getSku())
                            .quantity(item.getQuantity())
                            .unitPrice(unitPrice)
                            .totalPrice(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                            .build();
                })
                .toList();

        return ReceiptResponse.builder()
                .id(receipt.getId())
                .receiptNo(receipt.getReceiptNo())
                .supplierId(receipt.getSupplierId())
                .supplierName(supplierName)
                .receiptDate(receipt.getReceiptDate())
                .note(receipt.getNote())
                .status(receipt.getStatus().name())
                .createdBy(receipt.getCreatedBy())
                .changedBy(receipt.getChangedBy())
                .createdAt(receipt.getCreatedAt())
                .updatedAt(receipt.getUpdatedAt())
                .items(items)
                .build();
    }

    private IssueResponse toIssueResponse(Issue issue) {
        String supplierName = issue.getSupplierId() != null
                ? supplierRepository.findById(issue.getSupplierId()).map(Supplier::getName).orElse(null)
                : null;

        List<IssueResponse.Item> items = issueItemRepository.findByIssueIdOrderById(issue.getId()).stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    BigDecimal unitPrice = item.getUnitPrice() == null ? BigDecimal.ZERO : item.getUnitPrice();
                    return IssueResponse.Item.builder()
                            .id(item.getId())
                            .productId(item.getProductId())
                            .productName(product == null ? null : product.getName())
                            .sku(product == null ? null : product.getSku())
                            .quantity(item.getQuantity())
                            .unitPrice(unitPrice)
                            .totalPrice(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                            .build();
                })
                .toList();

        return IssueResponse.builder()
                .id(issue.getId())
                .issueNo(issue.getIssueNo())
                .supplierId(issue.getSupplierId())
                .supplierName(supplierName)
                .issueDate(issue.getIssueDate())
                .receiverName(issue.getReceiverName())
                .receiverAddress(issue.getReceiverAddress())
                .receiverPhone(issue.getReceiverPhone())
                .note(issue.getNote())
                .status(issue.getStatus().name())
                .createdBy(issue.getCreatedBy())
                .changedBy(issue.getChangedBy())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .items(items)
                .build();
    }

    private String generateReceiptNo() {
        return "RC" + System.currentTimeMillis() + randomSuffix();
    }

    private String generateIssueNo() {
        return "IS" + System.currentTimeMillis() + randomSuffix();
    }

    private String randomSuffix() {
        return String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
    }
}
