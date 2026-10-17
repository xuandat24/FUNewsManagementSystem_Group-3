package com.funewsmanagementapi.repository;

import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import com.funewsmanagementapi.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT new com.funewsmanagementapi.dto.response.CategoryResponseDto(c.categoryId, c.categoryName, c.categoryDescription, c.isActive, COUNT(a)) " +
            "FROM Category c LEFT JOIN c.newsArticles a " +
            "WHERE (:keyword IS NULL OR LOWER(c.categoryName) LIKE concat('%', lower(:keyword), '%') " +
            "OR :keyword IS NULL OR LOWER(c.categoryDescription) LIKE CONCAT('%', lower(:keyword), '%') ) " +
            "AND (:isActive is null or c.isActive = :isActive) " +
            "GROUP BY c.categoryId, c.categoryName, c.categoryDescription, c.isActive")
    Page<CategoryResponseDto> searchCategoriesForStaffAdmin(@Param("keyword") String keyword,
                                                                   @Param("isActive") Boolean isActive,
                                                                    Pageable pageable);
    boolean existsByCategoryNameIgnoreCase(String categoryName);
    boolean existsByCategoryNameIgnoreCaseAndCategoryIdNot(String categoryName, Long categoryId);
}
