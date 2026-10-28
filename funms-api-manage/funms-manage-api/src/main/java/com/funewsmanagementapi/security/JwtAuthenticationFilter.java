package com.funewsmanagementapi.security;


import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        try {
            String authHeader = request.getHeader("Authorization");
            if(authHeader!= null && authHeader.startsWith("Bearer")){
                String token = authHeader.substring(7);

                if(jwtTokenProvider.validateToken(token)){
                    Claims claims = jwtTokenProvider.getClaimsFromToken(token);
                    Long userId = Long.parseLong(claims.getSubject());
                    Integer role = claims.get("role", Integer.class);

                    //Map số 1 và số 2 thành quyền chuẩn của spring security ("ROLE_ADMIN" : "ROLE_STAFF")
                    String roleName = (role != null && role == 1) ? "ROLE_ADMIN" : "ROLE_STAFF";
                    List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(roleName));

                    // Lưu thông tin người dùng vào SecurityContext
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception ex){
            logger.error("không thể thiết lập xác thực người dùng trong Security Context");
        }
        filterChain.doFilter(request, response);
    }
}
