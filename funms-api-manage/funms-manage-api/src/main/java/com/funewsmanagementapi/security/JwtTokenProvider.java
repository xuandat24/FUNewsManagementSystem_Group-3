package com.funewsmanagementapi.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    //chuổi bí mật ký token tối thiểu 256 bit
    private static final String JWT_SECRET = "FUNewsManagementSystemSecretKey2026SBA301FPTUniversitySecuredKey";
    private static final long JWT_EXPIRATION = 86400000L; // 24 giờ (ms)

    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // tạo token chứa ID, email và role của tài khoản
    public String generateToken(Long accountId, String accountEmail, Integer accountRole){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .subject(String.valueOf(accountId))
                .claim("email", accountEmail)
                .claim("role", accountRole)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    // Trích xuất Claims từ Token
    public Claims getClaimsFromToken(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // kiểm tra tính hợp lêh của token.
    public boolean validateToken(String token){
        try {
            getClaimsFromToken(token);
            return true;
        }catch (JwtException | IllegalArgumentException e){
            return false;
        }
    }
}
