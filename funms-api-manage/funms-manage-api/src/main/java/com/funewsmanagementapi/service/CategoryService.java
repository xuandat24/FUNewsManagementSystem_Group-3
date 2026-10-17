package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    CategoryResponseDto findById(Long id);
    Page<CategoryResponseDto> findAllForStaffAdmin(String keyword, Boolean isActive, Pageable pageable);
}
