package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    // Don gian cho bai tap: lay danh sach, loc tai Java service.
    List<NewsArticle> findAllByOrderByCreatedDateDesc();
}
