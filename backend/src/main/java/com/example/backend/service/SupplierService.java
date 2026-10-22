package com.example.backend.service;

import com.example.backend.dto.SupplierRequest;
import com.example.backend.dto.SupplierResponse;
import com.example.backend.entity.Supplier;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<SupplierResponse> findAll() {
        return supplierRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public SupplierResponse findById(Long id) {
        return supplierRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> ResourceNotFoundException.of("nhà cung cấp", id));
    }

    @Transactional
    public SupplierResponse create(SupplierRequest request) {
        if (StringUtils.hasText(request.getName()) && supplierRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BusinessException("Tên nhà cung cấp đã tồn tại");
        }
        Supplier supplier = Supplier.builder()
                .name(request.getName().trim())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .active(request.getActive() == null ? Boolean.TRUE : request.getActive())
                .build();
        return toResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public SupplierResponse update(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("nhà cung cấp", id));

        if (StringUtils.hasText(request.getName())
                && !request.getName().equalsIgnoreCase(supplier.getName())
                && supplierRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BusinessException("Tên nhà cung cấp đã tồn tại");
        }

        if (StringUtils.hasText(request.getName())) {
            supplier.setName(request.getName().trim());
        }
        if (request.getEmail() != null) {
            supplier.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            supplier.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            supplier.setAddress(request.getAddress());
        }
        if (request.getActive() != null) {
            supplier.setActive(request.getActive());
        }
        return toResponse(supplierRepository.save(supplier));
    }

    @Transactional
    public void delete(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("nhà cung cấp", id));
        supplierRepository.delete(supplier);
    }

    private SupplierResponse toResponse(Supplier supplier) {
        return SupplierResponse.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .active(supplier.getActive())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
}
