package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.CategoryRequestDto;
import com.funewsmanagementapi.dto.response.CategoryResponseDto;
import com.funewsmanagementapi.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Categories", description = "CRUD Categories")
@RequestMapping("/api/v1/categories")
public class CategoryController {
    @Autowired
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Get category by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category found"),
            @ApiResponse(responseCode = "404", description = "Category not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> findById(@PathVariable Long id) {
        CategoryResponseDto categoryResponseDto = categoryService.findById(id);
        if (categoryResponseDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(categoryResponseDto, HttpStatus.OK);
    }

    @Operation(summary = "List all categories for Staff/Admin with search & pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categories fetched successfully")
    })
    @GetMapping
    public ResponseEntity<Page<CategoryResponseDto>> findAllForStaffAdmin(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(categoryService.findAllForStaffAdmin(keyword, isActive, PageRequest.of(page, size, Sort.by("categoryId").descending())));
    }

    @Operation(summary = "List all active categories for Guest")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active categories fetched successfully")
    })
    @GetMapping("/active")
    public ResponseEntity<Page<CategoryResponseDto>> findAllActive(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(categoryService.findAllForGuest(keyword, PageRequest.of(page, size, Sort.by("categoryId").descending())));
    }

    @Operation(summary = "Get all active categories for Dropdown (No pagination)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active categories list for dropdown")
    })
    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponseDto>> getAllActiveForDropdown() {
        return ResponseEntity.ok(categoryService.findAllByIsActiveTrue());
    }

    @Operation(summary = "Create a new category")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Category created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed or duplicate category name", content = @Content)
    })
    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(@Valid @RequestBody CategoryRequestDto dto) {
        return new ResponseEntity<>(categoryService.createCategory(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update category by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Category updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed or duplicate category name", content = @Content),
            @ApiResponse(responseCode = "404", description = "Category not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequestDto dto) {
        return new ResponseEntity<>(categoryService.updateCategory(id, dto), HttpStatus.OK);
    }

    @Operation(summary = "Delete category by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Category still has news articles", content = @Content),
            @ApiResponse(responseCode = "404", description = "Category not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
