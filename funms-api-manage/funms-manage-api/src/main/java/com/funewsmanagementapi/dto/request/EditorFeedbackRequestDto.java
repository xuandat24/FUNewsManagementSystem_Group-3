package com.funewsmanagementapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EditorFeedbackRequestDto(
        @NotBlank @Size(max = 2000) String feedback
) {}
