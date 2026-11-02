package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.dto.response.NewsArticleResponseDto;
import com.funewsmanagementapi.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    List<NewsArticle> findAllByOrderByCreatedDateDesc();

    // Only articles written by the signed-in Contributor.
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Long accountId);

    boolean existsByNewsTitleIgnoreCase(String newsTitle);

    boolean existsByNewsTitleIgnoreCaseAndNewsArticleIdNot(String newsTitle, Long id);

    @Query("SELECT new com.funewsmanagementapi.dto.response.NewsArticleResponseDto(" +
            "n.newsArticleId, n.newsTitle, n.headline, n.createdDate, n.newsSource, n.newsStatus) " +
            "FROM NewsArticle n " +
            "WHERE n.workflowStatus = :workflowStatus " +
            "ORDER BY n.createdDate DESC")
    List<NewsArticleResponseDto> findArticlesByWorkflowStatus(@Param("workflowStatus") String workflowStatus);
}
