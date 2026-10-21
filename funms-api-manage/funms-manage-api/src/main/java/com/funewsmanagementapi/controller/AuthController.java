package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.LoginRequestDto;
import com.funewsmanagementapi.dto.response.ApiResponseDto;
import com.funewsmanagementapi.dto.response.LoginResponseDto;
import com.funewsmanagementapi.security.RequireRole;
import com.funewsmanagementapi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@Tag(name = "1. Authentication", description = "Các API xác thực tài khoản và kiểm tra phân quyền")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống (lấy JWT Token)")
    public ApiResponseDto<LoginResponseDto> Login(@Valid @RequestBody LoginRequestDto request){
        LoginResponseDto response = authService.login(request);
        return ApiResponseDto.success("Đăng nhập thành công!", response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất tài khoản")
    public ApiResponseDto<String> logout() {
        // Đối với REST API Stateless, Client phía Frontend chỉ cần xóa Token trong localStorage
        return ApiResponseDto.success("Đăng xuất thành công!", "Đã xóa phiên đăng nhập.");
    }

    @GetMapping("/me")
    @RequireRole // Bắt buộc phải đăng nhập (Role 1 hoặc Role 2 đều được)
    @Operation(summary = "Lấy thông tin tài khoản hiện tại từ Token")
    public ApiResponseDto<LoginResponseDto> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        LoginResponseDto user = authService.getCurrentUser(authHeader);
        return ApiResponseDto.success("Lấy thông tin tài khoản thành công!", user);
    }

    @GetMapping("/admin-only-test")
    @RequireRole({1}) // CHỈ CÓ ADMIN (Role = 1) MỚI VÀO ĐƯỢC
    @Operation(summary = "API thử nghiệm quyền Admin (Role = 1)")
    public ApiResponseDto<String> testAdminPermission() {
        return ApiResponseDto.success("Xác thực quyền thành công!", "Bạn đang truy cập với vai trò Quản trị viên (ADMIN).");
    }

    @GetMapping("/staff-only-test")
    @RequireRole({2}) // CHỈ CÓ STAFF (Role = 2) MỚI VÀO ĐƯỢC
    @Operation(summary = "API thử nghiệm quyền Staff (Role = 2)")
    public ApiResponseDto<String> testStaffPermission() {
        return ApiResponseDto.success("Xác thực quyền thành công!", "Bạn đang truy cập với vai trò Nhân viên (STAFF).");
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới (Mặc định quyền Staff)")
    public ApiResponseDto<String> register(@Valid @RequestBody com.funewsmanagementapi.dto.request.RegisterRequestDto request) {
        authService.register(request);
        return ApiResponseDto.success("Đăng ký tài khoản thành công!", "Vui lòng chuyển sang trang đăng nhập.");
    }
}
