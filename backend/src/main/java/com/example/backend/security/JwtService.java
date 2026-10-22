package com.example.backend.security;

import com.example.backend.entity.User;
import com.example.backend.enums.Role;
import com.example.backend.enums.UserStatus;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService implements UserDetailsService {

    private final SecretKey secretKey;
    private final long expiration;
    private final long refreshExpiration;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expiration,
            @Value("${app.jwt.refresh-expiration}") long refreshExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
        this.refreshExpiration = refreshExpiration;
    }

    public long getExpiration() {
        return expiration;
    }

    /**
     * Tạo access token chứa userId, email, role.
     */
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("fullName", user.getFullName());
        return buildToken(claims, expiration, "access");
    }

    /**
     * Tạo refresh token.
     */
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("type", "refresh");
        return buildToken(claims, refreshExpiration, "refresh");
    }

    private String buildToken(Map<String, Object> claims, long ttl, String type) {
        Date now = new Date();
        claims.put("type", type);
        return Jwts.builder()
                .claims(claims)
                .subject(userIdOf(claims))
                .issuedAt(now)
                .expiration(new Date(now.getTime() + ttl))
                .signWith(secretKey)
                .compact();
    }

    private String userIdOf(Map<String, Object> claims) {
        Object id = claims.get("userId");
        return id == null ? null : String.valueOf(id);
    }

    /**
     * Parse và validate token. Trả về null nếu token không hợp lệ/hết hạn.
     */
    public Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public Long extractUserId(String token) {
        Claims claims = parseClaims(token);
        if (claims == null) {
            return null;
        }
        Object userId = claims.get("userId");
        return userId == null ? null : Long.valueOf(String.valueOf(userId));
    }

    public Role extractRole(String token) {
        Claims claims = parseClaims(token);
        if (claims == null) {
            return null;
        }
        Object role = claims.get("role");
        return role == null ? null : Role.valueOf(String.valueOf(role));
    }

    public boolean isValidAccessToken(String token) {
        Claims claims = parseClaims(token);
        return claims != null && "access".equals(claims.get("type"));
    }

    /**
     * Chỉ chấp nhận refresh token (type = "refresh").
     * Chặn việc dùng access token để gọi /api/auth/refresh.
     */
    public boolean isValidRefreshToken(String token) {
        Claims claims = parseClaims(token);
        return claims != null && "refresh".equals(claims.get("type"));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        throw new UsernameNotFoundException("Vui lòng dùng JwtAuthenticationFilter để xác thực");
    }
}
