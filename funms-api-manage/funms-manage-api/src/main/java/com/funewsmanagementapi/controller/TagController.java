package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.TagRequestDto;
import com.funewsmanagementapi.dto.response.TagResponseDto;
import com.funewsmanagementapi.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Tags", description = "CRUD Tags")
@RestController
@RequestMapping("/api/v1/tags")
public class TagController {
    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @Operation(summary = "List all tags with search & pagination")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tags fetched successfully")
    })
    @GetMapping
    public ResponseEntity<Page<TagResponseDto>> findAllTags(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(tagService.findAllTags(name, PageRequest.of(page, size, Sort.by("tagId").descending())));
    }

    @Operation(summary = "Get tag by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag found"),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDto> findTagById(@PathVariable Long id) {
        TagResponseDto dto = tagService.findTagsById(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @Operation(summary = "Get all tags for Dropdown (No pagination)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tags list for dropdown")
    })
    @GetMapping("/all")
    public ResponseEntity<List<TagResponseDto>> getAllTagsForDropdown() {
        return ResponseEntity.ok(tagService.findAllTagsList());
    }

    @Operation(summary = "Create a new tag")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tag created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed or duplicate tag name", content = @Content)
    })
    @PostMapping
    public ResponseEntity<TagResponseDto> createTag(@Valid @RequestBody TagRequestDto tagRequestDto) {
        return new ResponseEntity<>(tagService.createTag(tagRequestDto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update tag by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed or duplicate tag name", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDto> updateTag(@Valid @RequestBody TagRequestDto tagRequestDto, @PathVariable Long id) {
        return new ResponseEntity<>(tagService.updateTag(id, tagRequestDto), HttpStatus.OK);
    }

    @Operation(summary = "Delete tag by id")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tag deleted successfully"),
            @ApiResponse(responseCode = "400", description = "Tag still has news articles", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
