package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.dto.response.TagResponseDto;
import com.funewsmanagementapi.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    @Query("SELECT new com.funewsmanagementapi.dto.response.TagResponseDto(t.tagId, t.tagName, t.note, COUNT(a)) " +
            "FROM Tag t LEFT JOIN t.newsArticles a " +
            "WHERE (:name is null or lower(t.tagName) like concat('%', lower(:name), '%')) " +
            "GROUP BY t.tagId, t.tagName, t.note")
    Page<TagResponseDto> searchTagsByName(@Param("keyword") String keyword, Pageable pageable);
    List<Tag> findAllByOrderByTagNameAsc();
    boolean existsByTagNameIgnoreCase(String name);

    boolean existsByTagNameIgnoreCaseAndTagIdIsNot(String tagName, Long id);
}
