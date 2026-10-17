package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.CreateCategoryRequestDto;
import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import com.funewsmanagementapi.dto.response.NewsArticleResponseDto;
import com.funewsmanagementapi.entity.Category;
import com.funewsmanagementapi.entity.NewsArticle;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.CategoryRepository;
import com.funewsmanagementapi.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    @Override
    public CategoryResponseDto findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Not found category id " + id));

        List<NewsArticleResponseDto> listNewsDto = new ArrayList<>();

        for(NewsArticle article : category.getNewsArticles()) {
            NewsArticleResponseDto dto = NewsArticleResponseDto.builder()
                    .newsArticleId(article.getNewsArticleId())
                    .newsTitle(article.getNewsTitle())
                    .headline(article.getHeadline())
                    .createdDate(article.getCreatedDate())
                    .newsSource(article.getNewsSource())
                    .newsStatus(article.getNewsStatus())
                            .build();

            listNewsDto.add(dto);
        }

        return CategoryResponseDto.builder()
                .id(category.getCategoryId())
                .name(category.getCategoryName())
                .description(category.getCategoryDescription())
                .active(category.getIsActive())
                .totalArticles((long) listNewsDto.size())
                .newsArticles(listNewsDto)
                .build();
    }

    @Override
    public Page<CategoryResponseDto> findAllForStaffAdmin(String keyword, Boolean isActive, Pageable pageable) {
        return categoryRepository.searchCategoriesForStaffAdmin(keyword, isActive, pageable);
    }

    @Override
    @Transactional
    public CategoryResponseDto createCategory(CreateCategoryRequestDto dto) {
        String catName = dto.getCategoryName().trim();
        if(catName.isEmpty()) {
            throw new RuntimeException("Category name is empty or null!");
        }

        if(categoryRepository.existsByCategoryNameIgnoreCase(catName)) {
            throw new RuntimeException("Category " + catName + " already exists!");
        }

        Category category = Category.builder()
                .categoryName(dto.getCategoryName())
                .categoryDescription(dto.getCategoryDescription())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return CategoryResponseDto.builder()
                .id(savedCategory.getCategoryId())
                .name(savedCategory.getCategoryName())
                .description(savedCategory.getCategoryDescription())
                .active(savedCategory.getIsActive())
                .totalArticles(0L)
                .build();
    }
}
