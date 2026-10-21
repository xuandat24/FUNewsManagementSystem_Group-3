package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.CategoryRequestDto;
import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    CategoryResponseDto findById(Long id);

    Page<CategoryResponseDto> findAllForStaffAdmin(String keyword, Boolean isActive, Pageable pageable);

    Page<CategoryResponseDto> findAllForGuest(String keyword, Pageable pageable);

    List<CategoryResponseDto> findAllByIsActiveTrue();

    CategoryResponseDto createCategory(CategoryRequestDto dto);

    CategoryResponseDto updateCategory(Long id, CategoryRequestDto dto);

    void deleteCategory(Long id);
}
