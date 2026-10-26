package com.example.backend.service;

import com.example.backend.dto.CreateUserRequest;
import com.example.backend.dto.PageResponse;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.dto.UpdateUserStatusRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.entity.User;
import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import com.example.backend.exception.BusinessException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapperService userMapperService;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> search(Role role, UserStatus status, String keyword, int page, int size) {
        Page<User> result = userRepository.search(
                role,
                status,
                StringUtils.hasText(keyword) ? keyword.trim() : null,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"))
        );
        return PageResponse.of(result.map(userMapperService::toResponse));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BusinessException("Email đã tồn tại trong hệ thống");
        }
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(request.getStatus() == null ? UserStatus.ACTIVE : request.getStatus())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();
        return userMapperService.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("người dùng", id));

        if (StringUtils.hasText(request.getEmail())
                && !request.getEmail().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BusinessException("Email đã tồn tại trong hệ thống");
        }

        if (StringUtils.hasText(request.getEmail())) {
            user.setEmail(request.getEmail().trim().toLowerCase());
        }
        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        return userMapperService.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateStatus(Long id, UpdateUserStatusRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("người dùng", id));

        if (Objects.equals(id, currentUser.getId()) && request.getStatus() == UserStatus.LOCKED) {
            throw new BusinessException("Không thể tự khoá tài khoản của chính mình");
        }
        if (user.getRole() == Role.ADMIN && request.getStatus() == UserStatus.LOCKED
                && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new BusinessException("Phải còn ít nhất một tài khoản ADMIN đang hoạt động");
        }

        user.setStatus(request.getStatus());
        return userMapperService.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateProfile(UserPrincipal principal, UpdateProfileRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> ResourceNotFoundException.of("người dùng", principal.getId()));

        if (StringUtils.hasText(request.getEmail())
                && !request.getEmail().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BusinessException("Email đã tồn tại trong hệ thống");
        }

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
        }
        if (StringUtils.hasText(request.getEmail())) {
            user.setEmail(request.getEmail().trim().toLowerCase());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        return userMapperService.toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(UserPrincipal principal, String oldPassword, String newPassword) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> ResourceNotFoundException.of("người dùng", principal.getId()));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new BusinessException("Mật khẩu cũ không đúng");
        }
        if (Objects.equals(oldPassword, newPassword)) {
            throw new BusinessException("Mật khẩu mới phải khác mật khẩu cũ");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
