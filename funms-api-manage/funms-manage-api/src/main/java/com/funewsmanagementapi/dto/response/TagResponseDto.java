package com.funewsmanagementapi.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagResponseDto {
    private Long id;
    private String tagName;
    private String note;
    private Long totalArticles;
    private List<NewsArticleResponseDto> newsArticles;

    public TagResponseDto(Long id, String tagName, String note, Long totalArticles) {
        this.id = id;
        this.tagName = tagName;
        this.note = note;
        this.totalArticles = totalArticles;
    }
}
