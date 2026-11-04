package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    List<NewsArticle> findAllByOrderByCreatedDateDesc();

    // Only articles written by the signed-in Contributor.
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Long accountId);

    List<NewsArticle> findByWorkflowStatusOrderByCreatedDateDesc(String workflowStatus);

    boolean existsByNewsTitleIgnoreCase(String newsTitle);

    boolean existsByNewsTitleIgnoreCaseAndNewsArticleIdNot(String newsTitle, Long id);
}
