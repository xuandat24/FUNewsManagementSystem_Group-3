package com.funewsmanagementapi.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

// Chon cac truong tra ve, khong tra thang Entity (tranh vong lap JSON).
public record NewsDetailDto(
        Long id, String title, String headline, String content, String source,
        Long categoryId, String categoryName, Boolean active,
        Long authorId, String authorName, LocalDateTime createdDate,
        LocalDateTime modifiedDate, Set<Long> tagIds
) {}
