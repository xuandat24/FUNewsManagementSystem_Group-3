package com.funewsmanagementapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

// No createdById or NewsStatus: the server determines the author and workflow.
public record ContributorArticleRequestDto(
        @NotBlank @Size(max = 400) String newsTitle,
        @Size(max = 400) String headline,
        String newsContent,
        @Size(max = 255) String newsSource,
        Long categoryId,
        Set<Long> tagIds
) {}
