package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.AccountRequestDto;
import com.funewsmanagementapi.dto.response.AccountResponseDto;
import com.funewsmanagementapi.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/accounts")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDto> findById(@PathVariable Long id) {
        AccountResponseDto dto = accountService.findById(id);

        if (dto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<Page<AccountResponseDto>> pageAllFilter(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(accountService.findAllAccounts(keyword, role, PageRequest.of(page, size, Sort.by("accountRole").ascending().and(Sort.by("accountName").ascending()))));
    }

    @PostMapping
    public ResponseEntity<AccountResponseDto> createAccount(@Valid @RequestBody AccountRequestDto dto){
        return new ResponseEntity<>(accountService.createAccount(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponseDto> updateAccount(@PathVariable Long id, @Valid @RequestBody AccountRequestDto dto){
        return new ResponseEntity<>(accountService.updateAccount(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long id,
            @RequestAttribute("currentUserId") Long currentAdminId) {
        accountService.deleteAccount(id, currentAdminId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}