package com.funewsmanagementapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

// Du lieu React gui len khi them/sua bai viet.
public record NewsArticleRequestDto(
        @NotBlank @Size(max = 400) String newsTitle,
        @NotBlank @Size(max = 400) String headline,
        @NotBlank String newsContent,
        @Size(max = 255) String newsSource,
        @NotNull Long categoryId,
        @NotNull Long createdById,
        Boolean newsStatus,
        Set<Long> tagIds
) {}
