package com.example.backend.service;

import com.example.backend.dto.CreateShipmentRequest;
import com.example.backend.dto.PageResponse;
import com.example.backend.dto.ShipmentLogResponse;
import com.example.backend.dto.ShipmentResponse;
import com.example.backend.dto.UpdateShipmentStatusRequest;
import com.example.backend.entity.Issue;
import com.example.backend.entity.Shipment;
import com.example.backend.entity.ShipmentLog;
import com.example.backend.enums.DocumentStatus;
import com.example.backend.enums.ShipmentStatus;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.IssueRepository;
import com.example.backend.repository.ShipmentLogRepository;
import com.example.backend.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Shipment Service.
 * - Shipment tạo 1-1 từ một Issue đã CONFIRMED.
 * - Status flow: PENDING -&gt; SHIPPING -&gt; COMPLETED / CANCELLED
 * - Mỗi lần đổi status đều ghi 1 log (timeline).
 */
@Service
@RequiredArgsConstructor
public class ShipmentService {

    private static final Map<ShipmentStatus, Set<ShipmentStatus>> ALLOWED_TRANSITIONS = Map.of(
            ShipmentStatus.PENDING, EnumSet.of(ShipmentStatus.SHIPPING, ShipmentStatus.CANCELLED),
            ShipmentStatus.SHIPPING, EnumSet.of(ShipmentStatus.COMPLETED, ShipmentStatus.CANCELLED),
            ShipmentStatus.COMPLETED, EnumSet.noneOf(ShipmentStatus.class),
            ShipmentStatus.CANCELLED, EnumSet.noneOf(ShipmentStatus.class)
    );

    private final ShipmentRepository shipmentRepository;
    private final ShipmentLogRepository shipmentLogRepository;
    private final IssueRepository issueRepository;

    @Transactional(readOnly = true)
    public PageResponse<ShipmentResponse> search(Long userId, ShipmentStatus status, Long issueId, int page, int size) {
        Page<Shipment> result = shipmentRepository.search(userId, status, issueId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
        return PageResponse.of(result.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public ShipmentResponse findById(Long id, Long userId) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("giao hàng", id));
        validateShipmentOwner(shipment, userId);
        return toResponse(shipment);
    }

    @Transactional
    public ShipmentResponse create(CreateShipmentRequest request, Long userId) {
        Issue issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> ResourceNotFoundException.of("phiếu xuất", request.getIssueId()));

        if (issue.getCreatedBy() != null && !issue.getCreatedBy().equals(userId)) {
            throw new BusinessException("Bạn không thể tạo giao hàng cho phiếu xuất của kho khác");
        }
        if (issue.getStatus() != DocumentStatus.CONFIRMED) {
            throw new BusinessException("Chỉ tạo giao hàng từ phiếu xuất đã CONFIRMED");
        }
        if (shipmentRepository.findByIssueId(issue.getId()).isPresent()) {
            throw new BusinessException("Phiếu xuất này đã có giao hàng (quan hệ 1-1)");
        }

        Shipment shipment = Shipment.builder()
                .shipmentNo(generateShipmentNo())
                .issueId(issue.getId())
                .shipmentDate(request.getShipmentDate() == null ? LocalDate.now() : request.getShipmentDate())
                .carrierName(request.getCarrierName())
                .trackingNumber(request.getTrackingNumber())
                .receiverName(issue.getReceiverName())
                .receiverAddress(issue.getReceiverAddress())
                .receiverPhone(issue.getReceiverPhone())
                .status(ShipmentStatus.PENDING)
                .createdBy(userId)
                .build();
        shipment = shipmentRepository.save(shipment);

        shipmentLogRepository.save(ShipmentLog.builder()
                .shipmentId(shipment.getId())
                .fromStatus(null)
                .toStatus(ShipmentStatus.PENDING)
                .note("Tạo giao hàng từ phiếu xuất " + issue.getIssueNo())
                .changedBy(userId)
                .build());

        return toResponse(shipment);
    }

    @Transactional
    public ShipmentResponse updateStatus(Long id, UpdateShipmentStatusRequest request, Long userId) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("giao hàng", id));
        validateShipmentOwner(shipment, userId);

        ShipmentStatus target = request.getStatus();
        if (target == shipment.getStatus()) {
            throw new BusinessException("Giao hàng đang ở trạng thái " + target);
        }
        Set<ShipmentStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(shipment.getStatus(), EnumSet.noneOf(ShipmentStatus.class));
        if (!allowed.contains(target)) {
            throw new BusinessException(
                    "Không thể chuyển trạng thái từ " + shipment.getStatus() + " sang " + target);
        }

        ShipmentStatus from = shipment.getStatus();
        shipment.setStatus(target);
        if (request.getCarrierName() != null) {
            shipment.setCarrierName(request.getCarrierName());
        }
        if (request.getTrackingNumber() != null) {
            shipment.setTrackingNumber(request.getTrackingNumber());
        }
        shipment.setChangedBy(userId);
        shipmentRepository.save(shipment);

        shipmentLogRepository.save(ShipmentLog.builder()
                .shipmentId(shipment.getId())
                .fromStatus(from)
                .toStatus(target)
                .note(request.getNote())
                .changedBy(userId)
                .build());

        return toResponse(shipment);
    }

    @Transactional(readOnly = true)
    public List<ShipmentLogResponse> getLogs(Long id, Long userId) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("giao hàng", id));
        validateShipmentOwner(shipment, userId);
        return shipmentLogRepository.findByShipmentIdOrderByIdAsc(id).stream()
                .map(log -> ShipmentLogResponse.builder()
                        .id(log.getId())
                        .shipmentId(log.getShipmentId())
                        .fromStatus(log.getFromStatus())
                        .toStatus(log.getToStatus())
                        .note(log.getNote())
                        .changedBy(log.getChangedBy())
                        .createdAt(log.getCreatedAt())
                        .build())
                .toList();
    }

    private void validateShipmentOwner(Shipment shipment, Long userId) {
        Issue issue = issueRepository.findById(shipment.getIssueId()).orElse(null);
        if (issue != null && issue.getCreatedBy() != null && !issue.getCreatedBy().equals(userId)) {
            throw new BusinessException("Bạn không có quyền truy cập giao hàng của kho khác");
        }
    }



    private ShipmentResponse toResponse(Shipment shipment) {
        String issueNo = issueRepository.findById(shipment.getIssueId())
                .map(Issue::getIssueNo)
                .orElse(null);
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .shipmentNo(shipment.getShipmentNo())
                .issueId(shipment.getIssueId())
                .issueNo(issueNo)
                .shipmentDate(shipment.getShipmentDate())
                .carrierName(shipment.getCarrierName())
                .trackingNumber(shipment.getTrackingNumber())
                .receiverName(shipment.getReceiverName())
                .receiverAddress(shipment.getReceiverAddress())
                .receiverPhone(shipment.getReceiverPhone())
                .status(shipment.getStatus())
                .createdBy(shipment.getCreatedBy())
                .changedBy(shipment.getChangedBy())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .build();
    }

    private String generateShipmentNo() {
        return "SH" + System.currentTimeMillis() + String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
    }
}
