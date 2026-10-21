package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SystemAccountRepository extends JpaRepository<SystemAccount, Long> {
    List<SystemAccount> findByAccountRole(Integer role);
}
