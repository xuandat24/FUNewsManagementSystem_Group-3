package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.LoginRequestDto;
import com.funewsmanagementapi.dto.request.RegisterRequestDto;
import com.funewsmanagementapi.dto.response.ApiResponseDto;
import com.funewsmanagementapi.dto.response.LoginResponseDto;
import com.funewsmanagementapi.security.CustomUserDetails;
import com.funewsmanagementapi.security.JwtTokenProvider;
import com.funewsmanagementapi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@Tag(name = "Authentication")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống (lấy JWT Token)")
    public ApiResponseDto<LoginResponseDto> Login(@Valid @RequestBody LoginRequestDto request){

        // 1. Authenticate via Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier().trim(),request.getPassword().trim()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // 2. Generate JWT
        String token = jwtTokenProvider.generateToken(userDetails);

        //3. Construct Response mapping
        String roleName = userDetails.getAuthorities().iterator().next().getAuthority();

        LoginResponseDto response = LoginResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .accountId(userDetails.getSystemAccount().getAccountId())
                .accountName(userDetails.getSystemAccount().getAccountName())
                .accountEmail(userDetails.getSystemAccount().getAccountEmail())
                .accountRole(userDetails.getSystemAccount().getAccountRole())
                .roleName(roleName.replace("ROLE_", ""))
                .build();

        return ApiResponseDto.success("Đăng nhập thành công!", response);
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản (Mặc định quyền Staff)")
    public ApiResponseDto<String> register(@Valid @RequestBody RegisterRequestDto request) {
        authService.register(request);
        return ApiResponseDto.success("Đăng ký tài khoản thành công!", "Vui lòng đăng nhập.");
    }
}
