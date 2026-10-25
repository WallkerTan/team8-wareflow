package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySkuIgnoreCase(String sku);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsByOwnerIdAndSkuIgnoreCase(Long ownerId, String sku);

    boolean existsByOwnerId(Long ownerId);

    Optional<Product> findByIdAndOwnerId(Long id, Long ownerId);

    List<Product> findByOwnerIdAndSupplierId(Long ownerId, Long supplierId);

    /**
     * List + filter theo ownerId, supplierId, category, keyword (sku, name) và cảnh báo tồn thấp.
     * lowStock = true -> WHERE stock_quantity <= min_stock
     */
    @Query("""
            SELECT p FROM Product p
            WHERE p.ownerId = :ownerId
              AND (:supplierId IS NULL OR p.supplierId = :supplierId)
              AND (:categoryId IS NULL OR p.categoryId = :categoryId)
              AND (:keyword IS NULL
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:lowStock = false OR p.stockQuantity <= p.minStock)
            """)
    Page<Product> search(@Param("ownerId") Long ownerId,
                         @Param("supplierId") Long supplierId,
                         @Param("categoryId") Long categoryId,
                         @Param("keyword") String keyword,
                         @Param("lowStock") boolean lowStock,
                         Pageable pageable);

    /**
     * Lấy product kèm khoá ghi (SELECT ... FOR UPDATE).
     * Dùng trong transaction confirm phiếu nhập / phiếu xuất để tránh 2 request
     * đồng thời cùng đọc một tồn kho cũ rồi cùng ghi -> âm kho (lost update).
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.ownerId = :ownerId")
    Optional<Product> findByIdForUpdateAndOwnerId(@Param("id") Long id, @Param("ownerId") Long ownerId);
}
