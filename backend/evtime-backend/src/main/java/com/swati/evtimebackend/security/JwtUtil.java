package com.swati.evtimebackend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Issues and validates JWTs. The signing secret and expiry are externalized
 * to configuration (jwt.secret / JWT_SECRET env var) instead of being
 * hardcoded, since a hardcoded secret compiled into the jar means anyone
 * with the artifact can forge tokens.
 *
 * Uses the jjwt 0.11.x API (matches the version pinned in build.gradle).
 */
@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms:3600000}")
    private long expirationMs;

    private SecretKey signingKey;

    @PostConstruct
    void init() {
        if (secret == null || secret.isBlank() || secret.length() < 32) {
            // HS256 requires a key of at least 256 bits (32 chars). Failing fast
            // here surfaces a misconfiguration at startup instead of at the
            // first login attempt in production.
            throw new IllegalStateException(
                    "jwt.secret must be set and at least 32 characters long. " +
                            "Set the JWT_SECRET environment variable."
            );
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            log.debug("Rejected invalid/expired JWT: {}", e.getMessage());
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
