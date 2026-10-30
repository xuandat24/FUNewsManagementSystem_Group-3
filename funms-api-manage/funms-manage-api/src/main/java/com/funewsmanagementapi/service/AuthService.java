package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.RegisterRequestDto;

public interface AuthService {
    void register(RegisterRequestDto request);
}