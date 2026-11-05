package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.ContributorArticleRequestDto;
import com.funewsmanagementapi.dto.response.ContributorArticleDto;
import java.util.List;

public interface ContributorArticleService {
    List<ContributorArticleDto> myArticles(Long authorId);
    ContributorArticleDto getMyArticle(Long id, Long authorId);
    ContributorArticleDto create(Long authorId, ContributorArticleRequestDto data);
    ContributorArticleDto update(Long id, Long authorId, ContributorArticleRequestDto data);
    ContributorArticleDto submit(Long id, Long authorId);
    // Minimum reviewer action needed to test feedback; full Editor workflow belongs to Actor 2.
    ContributorArticleDto requestChanges(Long id, Long editorId, String feedback);
    List<ContributorArticleDto> reviewArticles();
    List<ContributorArticleDto> pendingArticles();
    ContributorArticleDto approve(Long id, Long editorId);
    ContributorArticleDto reject(Long id, Long editorId, String feedback);
}
