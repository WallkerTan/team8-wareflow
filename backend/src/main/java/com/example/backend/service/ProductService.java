package com.example.backend.service;

import com.example.backend.dto.PageResponse;
import com.example.backend.dto.ProductRequest;
import com.example.backend.dto.ProductResponse;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.entity.Supplier;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> search(Long userId, Long supplierId, Long categoryId, String keyword, boolean lowStock, int page, int size) {
        Page<Product> result = productRepository.search(
                userId,
                supplierId,
                categoryId,
                StringUtils.hasText(keyword) ? keyword.trim() : null,
                lowStock,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        );
        return PageResponse.of(result.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id, Long userId) {
        return productRepository.findByIdAndOwnerId(id, userId)
                .map(this::toResponse)
                .orElseThrow(() -> ResourceNotFoundException.of("sản phẩm", id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request, Long userId) {
        if (productRepository.existsByOwnerIdAndSkuIgnoreCase(userId, request.getSku().trim())) {
            throw new BusinessException("Mã SKU đã tồn tại trong kho của bạn");
        }
        validateCategory(request.getCategoryId());
        validateSupplier(request.getSupplierId());

        Product product = Product.builder()
                .ownerId(userId)
                .supplierId(request.getSupplierId())
                .sku(request.getSku().trim().toUpperCase())
                .name(request.getName().trim())
                .description(request.getDescription())
                .categoryId(request.getCategoryId())
                .unit(request.getUnit())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity() == null ? 0 : request.getStockQuantity())
                .minStock(request.getMinStock() == null ? 0 : request.getMinStock())
                .active(request.getActive() == null ? Boolean.TRUE : request.getActive())
                .build();
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request, Long userId) {
        Product product = productRepository.findByIdAndOwnerId(id, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("sản phẩm", id));

        if (StringUtils.hasText(request.getSku())
                && !request.getSku().equalsIgnoreCase(product.getSku())
                && productRepository.existsByOwnerIdAndSkuIgnoreCase(userId, request.getSku().trim())) {
            throw new BusinessException("Mã SKU đã tồn tại trong kho của bạn");
        }
        validateCategory(request.getCategoryId());
        if (request.getSupplierId() != null) {
            validateSupplier(request.getSupplierId());
            product.setSupplierId(request.getSupplierId());
        }

        if (StringUtils.hasText(request.getSku())) {
            product.setSku(request.getSku().trim().toUpperCase());
        }
        if (StringUtils.hasText(request.getName())) {
            product.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getCategoryId() != null) {
            product.setCategoryId(request.getCategoryId());
        }
        if (request.getUnit() != null) {
            product.setUnit(request.getUnit());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getMinStock() != null) {
            product.setMinStock(request.getMinStock());
        }
        if (request.getActive() != null) {
            product.setActive(request.getActive());
        }
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Product product = productRepository.findByIdAndOwnerId(id, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("sản phẩm", id));
        productRepository.delete(product);
    }

    private void validateCategory(Long categoryId) {
        if (categoryId == null) {
            return;
        }
        if (!categoryRepository.existsById(categoryId)) {
            throw new BusinessException("Danh mục với id = " + categoryId + " không tồn tại");
        }
    }

    private void validateSupplier(Long supplierId) {
        if (supplierId == null) {
            throw new BusinessException("Vui lòng chọn nhà cung cấp cho sản phẩm");
        }
        if (!supplierRepository.existsById(supplierId)) {
            throw new BusinessException("Nhà cung cấp với id = " + supplierId + " không tồn tại");
        }
    }

    public ProductResponse toResponse(Product product) {
        String categoryName = null;
        if (product.getCategoryId() != null) {
            categoryName = categoryRepository.findById(product.getCategoryId())
                    .map(Category::getName)
                    .orElse(null);
        }
        String supplierName = null;
        if (product.getSupplierId() != null) {
            supplierName = supplierRepository.findById(product.getSupplierId())
                    .map(Supplier::getName)
                    .orElse(null);
        }
        return ProductResponse.builder()
                .id(product.getId())
                .ownerId(product.getOwnerId())
                .supplierId(product.getSupplierId())
                .supplierName(supplierName)
                .sku(product.getSku())
                .name(product.getName())
                .description(product.getDescription())
                .categoryId(product.getCategoryId())
                .categoryName(categoryName)
                .unit(product.getUnit())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .minStock(product.getMinStock())
                .lowStock(product.getStockQuantity() <= product.getMinStock())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
