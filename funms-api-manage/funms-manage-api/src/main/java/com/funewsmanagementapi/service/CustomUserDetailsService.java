package com.funewsmanagementapi.service;

import com.funewsmanagementapi.entity.SystemAccount;
import com.funewsmanagementapi.repository.AccountRepository;
import com.funewsmanagementapi.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String trimmed = (identifier == null) ? "" : identifier.trim();
        SystemAccount account;

        if ("Admin".equalsIgnoreCase(trimmed)) {
            account = accountRepository.findByAccountNameIgnoreCase("Admin")
                    .or(() -> accountRepository.findByAccountNameIgnoreCase("FUNews Administrator"))
                    .or(() -> accountRepository.findByAccountEmailIgnoreCase("admin@funews.edu"))
                    .orElseThrow(() -> new UsernameNotFoundException("Admin account not found"));
        } else {
            account = accountRepository.findByAccountEmailIgnoreCase(trimmed)
                    .or(() -> accountRepository.findByAccountNameIgnoreCase(trimmed))
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + trimmed));
        }

        return new CustomUserDetails(account);
    }
}
