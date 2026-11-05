package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.AccountRequestDto;
import com.funewsmanagementapi.dto.response.AccountResponseDto;
import com.funewsmanagementapi.entity.SystemAccount;
import com.funewsmanagementapi.exception.BadRequestException;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.AccountRepository;
import com.funewsmanagementapi.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private AccountResponseDto toDto(SystemAccount account) {
        return AccountResponseDto.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponseDto findById(Long id) {
        SystemAccount account = accountRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Không tìm thấy tài khoản với id " + id));

        return toDto(account);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountResponseDto> findAllAccounts(String keyword, Integer role, Pageable pageable) {
        String search = (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();
        Page<SystemAccount> accountPage = accountRepository.searchAccounts(search, role, pageable);

        return accountPage.map(this::toDto);
    }

    @Override
    @Transactional
    public AccountResponseDto createAccount(AccountRequestDto dto) {
        String accountEmail = dto.getAccountEmail().trim();
        String accountName = dto.getAccountName().trim();

        if (accountRepository.existsByAccountEmail(accountEmail)) {
            throw new BadRequestException("Email " + accountEmail + " đã tồn tại!");
        }

        if (accountRepository.existsByAccountNameIgnoreCase(accountName)) {
            throw new BadRequestException("Tên đăng nhập " + accountName + " đã tồn tại!");
        }

        if (dto.getAccountPassword() == null || dto.getAccountPassword().trim().isEmpty()) {
            throw new BadRequestException("Mật khẩu khởi tạo không được để trống khi tạo tài khoản mới!");
        }

        SystemAccount acc = SystemAccount.builder()
                .accountName(accountName)
                .accountEmail(accountEmail)
                .accountRole(dto.getAccountRole())
                .accountPassword(passwordEncoder.encode(dto.getAccountPassword().trim()))
                .build();

        SystemAccount savedAcc = accountRepository.save(acc);

        return toDto(savedAcc);
    }

    @Override
    @Transactional
    public AccountResponseDto updateAccount(Long id, AccountRequestDto dto) {
        SystemAccount account = accountRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Không tìm thấy tài khoản với id " + id));

        String accountEmail = dto.getAccountEmail().trim();
        String accountName = dto.getAccountName().trim();

        if (accountRepository.existsByAccountEmailIgnoreCaseAndAccountIdNot(accountEmail, id)) {
            throw new BadRequestException("Email " + accountEmail + " đã tồn tại!");
        }

        if (accountRepository.existsByAccountNameIgnoreCaseAndAccountIdNot(accountName, id)) {
            throw new BadRequestException("Tên đăng nhập " + accountName + " đã tồn tại!");
        }

        account.setAccountName(accountName);
        account.setAccountEmail(accountEmail);
        account.setAccountRole(dto.getAccountRole());

        if (dto.getAccountPassword() != null && !dto.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(passwordEncoder.encode(dto.getAccountPassword().trim()));
        }

        SystemAccount savedAccount = accountRepository.save(account);
        return toDto(savedAccount);
    }

    @Override
    @Transactional
    public void deleteAccount(Long id, Long currentAdminId) {
        if (id.equals(currentAdminId)) {
            throw new BadRequestException("Bạn không thể tự xóa tài khoản của chính mình!");
        }

        SystemAccount account = accountRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Không tìm thấy tài khoản với id " + id));

        if (account.getCreatedArticles() != null && !account.getCreatedArticles().isEmpty()) {
            throw new BadRequestException("Tài khoản " + account.getAccountName() + " vẫn còn bài viết! Phải xóa các bài viết trước!");
        }

        accountRepository.delete(account);
    }
}
