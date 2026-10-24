package com.example.backend.config;

import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.entity.Supplier;
import com.example.backend.entity.User;
import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.ApplicationArguments;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Seed dữ liệu mặc định: tài khoản ADMIN + WAREHOUSE_OWNER, danh mục, NCC và sản phẩm mẫu.
 * Tắt bằng -Dapp.seed.enabled=false
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled}")
    private boolean seedEnabled;

    @Value("${app.seed.admin-email}")
    private String adminEmail;

    @Value("${app.seed.admin-password}")
    private String adminPassword;

    @Value("${app.seed.owner-email}")
    private String ownerEmail;

    @Value("${app.seed.owner-password}")
    private String ownerPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!seedEnabled) {
            log.info("[seed] Bỏ qua do app.seed.enabled=false");
            return;
        }

        seedUser(adminEmail, adminPassword, "Quản trị viên", Role.ADMIN);
        seedUser(ownerEmail, ownerPassword, "Chủ kho", Role.WAREHOUSE_OWNER);

        Long categoryId = seedCategory("Đồ gia dụng", "Các sản phẩm gia dụng thông dụng");
        seedCategory("Thực phẩm", "Nguyên liệu và thực phẩm");
        seedCategory("Văn phòng phẩm", "Dụng cụ văn phòng");

        Long supplierId1 = seedSupplier("Công ty TNHH Phát Triển", "contact@phattrien.com", "0901234567");
        Long supplierId2 = seedSupplier("Nhà cung cấp An Phú", "info@anphu.com", "0912345678");

        Long ownerId = userRepository.findByEmailIgnoreCase(ownerEmail).map(User::getId).orElse(null);

        if (ownerId != null) {
            seedProduct(ownerId, supplierId1, "SP001", "Nồi cơm điện", categoryId, "Cái", BigDecimal.valueOf(750000), 20, 5);
            seedProduct(ownerId, supplierId1, "SP002", "Tủ lạnh 250L", categoryId, "Cái", BigDecimal.valueOf(8990000), 8, 3);
            seedProduct(ownerId, supplierId1, "SP003", "Bộ nồi inox 5 món", categoryId, "Bộ", BigDecimal.valueOf(1250000), 3, 5);
            seedProduct(ownerId, supplierId2, "SP004", "Gạo tám sọ 25kg", categoryId, "Bao", BigDecimal.valueOf(320000), 50, 10);
            seedProduct(ownerId, supplierId2, "SP005", "Dầu ăn 5L", categoryId, "Can", BigDecimal.valueOf(180000), 4, 8);
        }

        log.info("[seed] Hoàn tất. Tài khoản: {} (ADMIN) / {} (WAREHOUSE_OWNER)", adminEmail, ownerEmail);
    }

    private void seedUser(String email, String password, String fullName, Role role) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }
        userRepository.save(User.builder()
                .email(email.toLowerCase())
                .fullName(fullName)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .status(UserStatus.ACTIVE)
                .build());
        log.info("[seed] Đã tạo user {} với role {}", email, role);
    }

    private Long seedCategory(String name, String description) {
        return categoryRepository.findByNameIgnoreCase(name)
                .map(Category::getId)
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name(name).description(description).build()).getId());
    }

    private Long seedSupplier(String name, String email, String phone) {
        return supplierRepository.findByNameIgnoreCase(name)
                .map(Supplier::getId)
                .orElseGet(() -> supplierRepository.save(Supplier.builder()
                        .name(name).email(email).phone(phone).active(true).build()).getId());
    }

    private void seedProduct(Long ownerId, Long supplierId, String sku, String name, Long categoryId, String unit,
                             BigDecimal price, int stock, int minStock) {
        if (productRepository.existsByOwnerIdAndSkuIgnoreCase(ownerId, sku)) {
            return;
        }
        productRepository.save(Product.builder()
                .ownerId(ownerId)
                .supplierId(supplierId)
                .sku(sku)
                .name(name)
                .categoryId(categoryId)
                .unit(unit)
                .price(price)
                .stockQuantity(stock)
                .minStock(minStock)
                .active(true)
                .build());
    }
}
