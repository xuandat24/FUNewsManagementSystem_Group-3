package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.entity.SystemAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<SystemAccount, Long> {

    // tìm tài khoản theo Email
    Optional<SystemAccount> findByAccountEmail(String accountEmail);
    Optional<SystemAccount> findByAccountEmailIgnoreCase(String accountEmail);

    // tìm tài khoản theo nam (hỗ trợ đăng nhập username Admin)
    Optional<SystemAccount> findByAccountName(String accountName);
    Optional<SystemAccount> findByAccountNameIgnoreCase(String accountName);

    // kiểm tra email đã tồn tại chưa(dùng cho hàm tạo tài khoản sau này)
    boolean existsByAccountEmail(String accountEmail);

    boolean existsByAccountNameIgnoreCase(String accountName);

    boolean existsByAccountEmailIgnoreCaseAndAccountIdNot(String accountEmail, Long accountId);

    boolean existsByAccountNameIgnoreCaseAndAccountIdNot(String accountName, Long id);

    @Query("SELECT a FROM SystemAccount a WHERE " +
            "(:keyword IS NULL OR LOWER(a.accountName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            " OR LOWER(a.accountEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:role IS NULL OR a.accountRole = :role)")
    Page<SystemAccount> searchAccounts(
            @Param("keyword") String keyword,
            @Param("role") Integer role,
            Pageable pageable
    );
}
