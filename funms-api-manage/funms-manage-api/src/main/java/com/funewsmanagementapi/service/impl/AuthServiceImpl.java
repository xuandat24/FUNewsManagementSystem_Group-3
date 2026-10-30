package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.RegisterRequestDto;
import com.funewsmanagementapi.entity.SystemAccount;
import com.funewsmanagementapi.exception.BadRequestException;
import com.funewsmanagementapi.repository.AccountRepository;
import com.funewsmanagementapi.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Tự động tạo constructor injection
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterRequestDto request){

        // Kiểm tra xem email đã tồn tại chưa
        if(accountRepository.existsByAccountEmail(request.getAccountEmail())){
            throw new BadRequestException("Email này đã được sử dụng trong hệ thống!");
        }

        // Tạo tài khoản mới, mã hóa mật khẩu bằng BCrypt
        SystemAccount newAccount = SystemAccount.builder()
                .accountName(request.getAccountName().trim())
                .accountEmail(request.getAccountEmail().trim())
                .accountPassword(passwordEncoder.encode(request.getAccountPassword().trim()))
                .accountRole(2) // Gán quyền mặc định là Staff (2)
                .build();

        // Lưu vào DB
        accountRepository.save(newAccount);
    }

}