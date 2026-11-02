package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.EditorFeedbackRequestDto;
import com.funewsmanagementapi.dto.response.ContributorArticleDto;
import com.funewsmanagementapi.security.RequireRole;
import com.funewsmanagementapi.service.ContributorArticleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

// Minimal review endpoint for the Contributor feedback loop.
// Actor 2 can extend the Editor area later with approval/publishing.
@RestController
@RequestMapping("/api/v1/editor/articles")
@RequireRole({1})
public class EditorFeedbackController {
    private final ContributorArticleService service;

    public EditorFeedbackController(ContributorArticleService service) {
        this.service = service;
    }

    @PostMapping("/{id}/request-changes")
    public ContributorArticleDto requestChanges(@PathVariable Long id,
            @RequestAttribute("currentUserId") Long editorId,
            @Valid @RequestBody EditorFeedbackRequestDto data) {
        return service.requestChanges(id, editorId, data.feedback());
    }
}
