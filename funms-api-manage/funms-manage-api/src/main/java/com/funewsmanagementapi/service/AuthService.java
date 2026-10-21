package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.LoginRequestDto;
import com.funewsmanagementapi.dto.response.LoginResponseDto;

public interface AuthService {
    LoginResponseDto login(LoginRequestDto request);
    LoginResponseDto getCurrentUser(String token);
}
