package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<SystemAccount, Long> {

    // tìm tài khoản theo Email
    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    // tìm tài khoản theo nam (hỗ trợ đăng nhập username Admin)
    Optional<SystemAccount> findByAccountName(String accountName);

    // kiểm tra email đã tồn tại chưa(dùng cho hàm tạo tài khoản sau này)
    boolean existsByAccountEmail(String accountEmail);
}
