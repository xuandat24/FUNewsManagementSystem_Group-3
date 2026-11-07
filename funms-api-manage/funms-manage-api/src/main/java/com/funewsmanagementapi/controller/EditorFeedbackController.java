package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.EditorFeedbackRequestDto;
import com.funewsmanagementapi.dto.response.ContributorArticleDto;
import com.funewsmanagementapi.service.ContributorArticleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

// Review endpoints protected by Admin role from AuthInterceptor.
@RestController
@RequestMapping("/api/v1/editor/articles")
public class EditorFeedbackController {
    private final ContributorArticleService service;

    public EditorFeedbackController(ContributorArticleService service) {
        this.service = service;
    }

    @GetMapping
    public java.util.List<ContributorArticleDto> list() {
        return service.reviewArticles();
    }

    @GetMapping("/pending")
    public java.util.List<ContributorArticleDto> pending() {
        return service.pendingArticles();
    }

    @PostMapping("/{id}/approve")
    public ContributorArticleDto approve(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long editorId) {
        return service.approve(id, editorId);
    }

    @PostMapping("/{id}/reject")
    public ContributorArticleDto reject(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long editorId,
            @Valid @RequestBody EditorFeedbackRequestDto data) {
        return service.reject(id, editorId, data.feedback());
    }

    @PostMapping("/{id}/request-changes")
    public ContributorArticleDto requestChanges(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long editorId,
            @Valid @RequestBody EditorFeedbackRequestDto data) {
        return service.requestChanges(id, editorId, data.feedback());
    }
}
