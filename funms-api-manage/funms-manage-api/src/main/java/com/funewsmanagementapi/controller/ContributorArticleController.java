package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.ContributorArticleRequestDto;
import com.funewsmanagementapi.dto.response.ContributorArticleDto;
import com.funewsmanagementapi.service.ContributorArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/contributor/articles")
@PreAuthorize("hasRole('STAFF')")
public class ContributorArticleController {
    private final ContributorArticleService service;

    public ContributorArticleController(ContributorArticleService service) {
        this.service = service;
    }

    @GetMapping
    public List<ContributorArticleDto> myArticles(@RequestAttribute("currentUserId") Long userId) {
        return service.myArticles(userId);
    }

    @GetMapping("/{id}")
    public ContributorArticleDto detail(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long userId) {
        return service.getMyArticle(id, userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContributorArticleDto create(@RequestAttribute("currentUserId") Long userId,
            @Valid @RequestBody ContributorArticleRequestDto data) {
        return service.create(userId, data);
    }

    @PutMapping("/{id}")
    public ContributorArticleDto update(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long userId,
            @Valid @RequestBody ContributorArticleRequestDto data) {
        return service.update(id, userId, data);
    }

    @PostMapping("/{id}/submit")
    public ContributorArticleDto submit(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long userId) {
        return service.submit(id, userId);
    }
}
