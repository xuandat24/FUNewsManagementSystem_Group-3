package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.CategoryRequestDto;
import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import com.funewsmanagementapi.dto.response.NewsArticleResponseDto;
import com.funewsmanagementapi.entity.Category;
import com.funewsmanagementapi.entity.NewsArticle;
import com.funewsmanagementapi.exception.BadRequestException;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.CategoryRepository;
import com.funewsmanagementapi.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public CategoryResponseDto createCategory(CategoryRequestDto dto) {
        String catName = dto.getCategoryName().trim();

        if (categoryRepository.existsByCategoryNameIgnoreCase(catName)) {
            throw new BadRequestException("Category " + catName + " already exists!");
        }

        Category category = Category.builder()
                .categoryName(catName)
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

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryRequestDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Not found category id " + id));

        String catName = dto.getCategoryName().trim();

        if (categoryRepository.existsByCategoryNameIgnoreCaseAndCategoryIdNot(catName, id)) {
            throw new BadRequestException("Category " + catName + " already exists!");
        }

        category.setCategoryName(catName);
        category.setCategoryDescription(dto.getCategoryDescription());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        Category updatedCategory = categoryRepository.save(category);

        long totalArticles = (updatedCategory.getNewsArticles() != null) ? updatedCategory.getNewsArticles().size() : 0L;

        return CategoryResponseDto.builder()
                .id(updatedCategory.getCategoryId())
                .name(updatedCategory.getCategoryName())
                .description(updatedCategory.getCategoryDescription())
                .active(updatedCategory.getIsActive())
                .totalArticles(totalArticles)
                .build();
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Not found category id " + id));
        if (category.getNewsArticles() != null && !category.getNewsArticles().isEmpty()){
            throw new BadRequestException("Category " + category.getCategoryName() + " still has news articles! Must delete all its articles first!");
        }
        categoryRepository.delete(category);
    }
}
