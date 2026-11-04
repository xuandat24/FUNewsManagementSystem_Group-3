package com.funewsmanagementapi.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

// Data shown in "My Articles" (status and feedback included).
public record ContributorArticleDto(
        Long id, String title, String headline, String content, String source,
        Long categoryId, String categoryName,
        String workflowStatus, String reviewFeedback,
        LocalDateTime createdDate, LocalDateTime modifiedDate, Set<Long> tagIds,
        Long authorId, String authorName
) {}
