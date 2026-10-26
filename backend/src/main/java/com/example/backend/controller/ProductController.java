package com.example.backend.controller;

import com.example.backend.dto.PageResponse;
import com.example.backend.dto.ProductRequest;
import com.example.backend.dto.ProductResponse;
import com.example.backend.security.UserPrincipal;
import com.example.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_OWNER')")
public class ProductController {

    private final ProductService productService;

    /** GET /api/products - list + filter supplier/category/keyword/lowStock theo kho hiện tại (WAREHOUSE_OWNER). */
    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> list(
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "false") boolean lowStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(productService.search(principal.getId(), supplierId, categoryId, keyword, lowStock, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id,
                                               @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(productService.findById(id, principal.getId()));
    }

    /**
     * GET /api/products/by-supplier/{supplierId}
     * Lấy tất cả sản phẩm thuộc một nhà cung cấp. Cả ADMIN và WAREHOUSE_OWNER đều được xem.
     */
    @GetMapping("/by-supplier/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_OWNER')")
    public ResponseEntity<List<ProductResponse>> listBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(productService.findBySupplier(supplierId));
    }

    /**
     * POST /api/products - Chỉ ADMIN được tạo sản phẩm cho Nhà cung cấp.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request, request.getOwnerId()));
    }

    /**
     * PUT /api/products/{id} - Chỉ ADMIN được sửa sản phẩm.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody ProductRequest request,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(productService.update(id, request, request.getOwnerId()));
    }

    /**
     * DELETE /api/products/{id} - Chỉ ADMIN được xóa sản phẩm.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
