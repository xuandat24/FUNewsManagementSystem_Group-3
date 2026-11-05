package com.funewsmanagementapi.security;

import com.funewsmanagementapi.entity.SystemAccount;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final SystemAccount systemAccount;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        String roleName = (systemAccount.getAccountRole() != null && systemAccount.getAccountRole() == 1) ? "ROLE_ADMIN" : "ROLE_STAFF";
        return Collections.singletonList(new SimpleGrantedAuthority(roleName));
    }

    @Override
    public String getPassword() {
        return systemAccount.getAccountPassword();
    }

    @Override
    public String getUsername() {
        return systemAccount.getAccountEmail();
    }

    @Override
    public boolean isAccountNonExpired() {return true;}

    @Override
    public boolean isAccountNonLocked() {return true;}

    @Override
    public boolean isCredentialsNonExpired() {return true;}

    @Override
    public boolean isEnabled() { return true; }
}
