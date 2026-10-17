package com.funewsmanagementapi.dto.response;

import com.funewsmanagementapi.entity.NewsArticle;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDto {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private Long totalArticles;
    private List<NewsArticleResponseDto> newsArticles;

    public CategoryResponseDto(Long id, String name, String description, Boolean active, Long totalArticles) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
        this.totalArticles = totalArticles;
    }
}
