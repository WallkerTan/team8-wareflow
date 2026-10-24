package com.example.backend.controller;

import com.example.backend.dto.PageResponse;
import com.example.backend.dto.ReceiptRequest;
import com.example.backend.dto.ReceiptResponse;
import com.example.backend.enums.DocumentStatus;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WAREHOUSE_OWNER')")
public class ReceiptController {

    private final InventoryService inventoryService;

    /** GET /api/receipts - list + filter theo status/ngày của kho hiện tại. */
    @GetMapping
    public ResponseEntity<PageResponse<ReceiptResponse>> list(
            @RequestParam(required = false) DocumentStatus status,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.searchReceipts(principal.getId(), status, supplierId, fromDate, toDate, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceiptResponse> get(@PathVariable Long id,
                                               @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.findReceiptById(id, principal.getId()));
    }

    /** POST /api/receipts - tạo phiếu nhập DRAFT. */
    @PostMapping
    public ResponseEntity<ReceiptResponse> create(@Valid @RequestBody ReceiptRequest request,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.createReceipt(request, principal.getId()));
    }

    /** PUT /api/receipts/{id} - sửa phiếu nhập DRAFT. */
    @PutMapping("/{id}")
    public ResponseEntity<ReceiptResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody ReceiptRequest request,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.updateReceipt(id, request, principal.getId()));
    }

    /** DELETE /api/receipts/{id} - xoá phiếu nhập DRAFT. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        inventoryService.deleteReceipt(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    /** POST /api/receipts/{id}/confirm - transaction cộng stock (W6). */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<ReceiptResponse> confirm(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.confirmReceipt(id, principal.getId()));
    }

    /** POST /api/receipts/{id}/cancel - huỷ phiếu nhập DRAFT. */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ReceiptResponse> cancel(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.cancelReceipt(id, principal.getId()));
    }
}
