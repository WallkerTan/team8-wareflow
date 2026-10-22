package com.example.backend.controller;

import com.example.backend.dto.IssueRequest;
import com.example.backend.dto.IssueResponse;
import com.example.backend.dto.PageResponse;
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
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WAREHOUSE_OWNER')")
public class IssueController {

    private final InventoryService inventoryService;

    /** GET /api/issues - list + filter theo status/ngày. */
    @GetMapping
    public ResponseEntity<PageResponse<IssueResponse>> list(
            @RequestParam(required = false) DocumentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(inventoryService.searchIssues(status, fromDate, toDate, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.findIssueById(id));
    }

    /** POST /api/issues - tạo phiếu xuất DRAFT. */
    @PostMapping
    public ResponseEntity<IssueResponse> create(@Valid @RequestBody IssueRequest request,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.createIssue(request, principal.getId()));
    }

    /** PUT /api/issues/{id} - sửa phiếu xuất DRAFT. */
    @PutMapping("/{id}")
    public ResponseEntity<IssueResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody IssueRequest request,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.updateIssue(id, request, principal.getId()));
    }

    /** DELETE /api/issues/{id} - xoá phiếu xuất DRAFT. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/issues/{id}/confirm - transaction trừ stock + validate tồn (W9, W10). */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<IssueResponse> confirm(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.confirmIssue(id, principal.getId()));
    }

    /** POST /api/issues/{id}/cancel - huỷ phiếu xuất DRAFT. */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<IssueResponse> cancel(@PathVariable Long id,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(inventoryService.cancelIssue(id, principal.getId()));
    }
}
