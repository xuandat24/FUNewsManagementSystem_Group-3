package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.AccountRequestDto;
import com.funewsmanagementapi.dto.response.AccountResponseDto;
import com.funewsmanagementapi.entity.SystemAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    AccountResponseDto findById(Long id);

    Page<AccountResponseDto> findAllAccounts(String keyword, Integer role, Pageable pageable);

    AccountResponseDto createAccount(AccountRequestDto dto);

    AccountResponseDto updateAccount(Long id, AccountRequestDto dto);

    void deleteAccount(Long id, Long currentAdminId);
}
