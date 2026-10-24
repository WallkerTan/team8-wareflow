package com.example.backend.controller;

import com.example.backend.dto.CreateShipmentRequest;
import com.example.backend.dto.PageResponse;
import com.example.backend.dto.ShipmentLogResponse;
import com.example.backend.dto.ShipmentResponse;
import com.example.backend.dto.UpdateShipmentStatusRequest;
import com.example.backend.enums.ShipmentStatus;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WAREHOUSE_OWNER')")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<PageResponse<ShipmentResponse>> list(
            @RequestParam(required = false) ShipmentStatus status,
            @RequestParam(required = false) Long issueId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(shipmentService.search(principal.getId(), status, issueId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentResponse> get(@PathVariable Long id,
                                               @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(shipmentService.findById(id, principal.getId()));
    }

    /** POST /api/shipments - tạo shipment từ issue CONFIRMED (quan hệ 1-1). */
    @PostMapping
    public ResponseEntity<ShipmentResponse> create(@Valid @RequestBody CreateShipmentRequest request,
                                                   @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shipmentService.create(request, principal.getId()));
    }

    /** PATCH /api/shipments/{id}/status - cập nhật trạng thái + ghi log. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ShipmentResponse> updateStatus(@PathVariable Long id,
                                                         @Valid @RequestBody UpdateShipmentStatusRequest request,
                                                         @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(shipmentService.updateStatus(id, request, principal.getId()));
    }

    /** GET /api/shipments/{id}/logs - timeline lịch sử trạng thái. */
    @GetMapping("/{id}/logs")
    public ResponseEntity<List<ShipmentLogResponse>> logs(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(shipmentService.getLogs(id, principal.getId()));
    }
}
