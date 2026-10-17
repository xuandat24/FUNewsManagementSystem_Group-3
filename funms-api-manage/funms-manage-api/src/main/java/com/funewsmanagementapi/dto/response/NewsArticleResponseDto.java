package com.funewsmanagementapi.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleResponseDto {
    private Long newsArticleId;
    private String newsTitle;
    private String headline;
    private LocalDateTime createdDate;
    private String newsSource;
    private Boolean newsStatus;
}
