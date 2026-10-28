package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.LoginRequestDto;
import com.funewsmanagementapi.dto.request.RegisterRequestDto;
import com.funewsmanagementapi.dto.response.LoginResponseDto;
import com.funewsmanagementapi.entity.SystemAccount;
import com.funewsmanagementapi.exception.BadRequestException;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.AccountRepository;
import com.funewsmanagementapi.security.JwtTokenProvider;
import com.funewsmanagementapi.service.AuthService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        String identifier = request.getIdentifier().trim();
        String password = request.getPassword();

        SystemAccount account = null;

        // 1. Hỗ trợ trường hợp đặc biệt của đề bài: Admin / Admin
        if ("Admin".equalsIgnoreCase(identifier) && "Admin".equals(password)) {
            account = accountRepository.findByAccountName("FUNews Administrator")
                    .or(() -> accountRepository.findByAccountEmail("admin@funews.edu"))
                    .orElse(null);
        }

        // 2. Nếu không phải Admin/Admin, tìm theo Email hoặc Name trong Database
        if (account == null) {
            Optional<SystemAccount> accountOpt = accountRepository.findByAccountEmail(identifier)
                    .or(() -> accountRepository.findByAccountName(identifier));

            if (accountOpt.isEmpty()) {
                throw new BadRequestException("Tài khoản không tồn tại trong hệ thống!");
            }

            account = accountOpt.get();

            // Kiểm tra mật khẩu (so khớp chuỗi theo dữ liệu seed)
            if (!account.getAccountPassword().equals(password)) {
                throw new BadRequestException("Mật khẩu không chính xác!");
            }
        }

        // 3. Tạo JWT Token
        String token = jwtTokenProvider.generateToken(
                account.getAccountId(),
                account.getAccountEmail(),
                account.getAccountRole()
        );

        String roleName = (account.getAccountRole() != null && account.getAccountRole() == 1) ? "ADMIN" : "STAFF";

        return LoginResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .roleName(roleName)
                .build();
    }

    @Override
    public LoginResponseDto getCurrentUser(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn!");
        }

        Claims claims = jwtTokenProvider.getClaimsFromToken(token);
        Long accountId = Long.parseLong(claims.getSubject());

        SystemAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RecordNotFoundException("Không tìm thấy thông tin tài khoản!"));

        String roleName = (account.getAccountRole() != null && account.getAccountRole() == 1) ? "ADMIN" : "STAFF";

        return LoginResponseDto.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .roleName(roleName)
                .build();
    }

    @Override
    public void register(RegisterRequestDto request) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (accountRepository.existsByAccountEmail(request.getAccountEmail())) {
            throw new BadRequestException("Email này đã được sử dụng trong hệ thống!");
        }

        // 2. Tạo tài khoản mới (Mặc định AccountRole = 2 dành cho Staff)
        SystemAccount newAccount = SystemAccount.builder()
                .accountName(request.getAccountName().trim())
                .accountEmail(request.getAccountEmail().trim())
                .accountPassword(request.getAccountPassword().trim())
                .accountRole(2) // Gán vai trò Staff mặc định
                .build();

        // 3. Lưu vào database
        accountRepository.save(newAccount);
    }
}