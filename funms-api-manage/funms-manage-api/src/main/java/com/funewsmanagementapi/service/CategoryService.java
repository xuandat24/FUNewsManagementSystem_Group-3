package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.CreateCategoryRequestDto;
import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import com.funewsmanagementapi.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    CategoryResponseDto findById(Long id);

    Page<CategoryResponseDto> findAllForStaffAdmin(String keyword, Boolean isActive, Pageable pageable);

    CategoryResponseDto createCategory(CreateCategoryRequestDto dto);
}
