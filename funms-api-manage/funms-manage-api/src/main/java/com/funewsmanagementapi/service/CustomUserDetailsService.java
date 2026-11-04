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
        SystemAccount account;
        if("Admin".equalsIgnoreCase(identifier)){
            account =accountRepository.findByAccountName("FUNews Administrator")
                    .or(() -> accountRepository.findByAccountEmail("admin@funews.edu"))
                    .orElseThrow(() -> new UsernameNotFoundException("Admin account not found"));
        } else {
            account = accountRepository.findByAccountEmail(identifier)
                    .or(() -> accountRepository.findByAccountName(identifier))
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier));
        }

        return new CustomUserDetails(account);
    }
}
