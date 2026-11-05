package com.funewsmanagementapi.service;

import com.funewsmanagementapi.entity.SystemAccount;
import com.funewsmanagementapi.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class LegacyPasswordMigration implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(LegacyPasswordMigration.class);
    private static final Pattern BCRYPT_HASH = Pattern.compile("\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53}");

    private final AccountRepository accounts;
    private final PasswordEncoder passwordEncoder;

    public LegacyPasswordMigration(AccountRepository accounts, PasswordEncoder passwordEncoder) {
        this.accounts = accounts;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<SystemAccount> legacyAccounts = accounts.findAll().stream()
                .filter(account -> !BCRYPT_HASH.matcher(account.getAccountPassword()).matches())
                .toList();

        for (SystemAccount account : legacyAccounts) {
            account.setAccountPassword(passwordEncoder.encode(account.getAccountPassword()));
        }
        accounts.saveAll(legacyAccounts);

        if (!legacyAccounts.isEmpty()) {
            logger.info("Migrated {} legacy account passwords to BCrypt", legacyAccounts.size());
        }
    }
}
