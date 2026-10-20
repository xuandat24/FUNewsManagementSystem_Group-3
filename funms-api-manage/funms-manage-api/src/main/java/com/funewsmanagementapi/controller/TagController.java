package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.TagRequestDto;
import com.funewsmanagementapi.dto.response.TagResponseDto;
import com.funewsmanagementapi.service.TagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tags")
public class TagController {
    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<Page<TagResponseDto>> findAllTags(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(tagService.findAllTags(name, PageRequest.of(page, size, Sort.by("tagId").descending())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDto> findTagById(@PathVariable Long id) {
        TagResponseDto dto = tagService.findTagsById(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TagResponseDto>> getAllTagsForDropdown() {
        return ResponseEntity.ok(tagService.findAllTagsList());
    }

    @PostMapping
    public ResponseEntity<TagResponseDto> createTag(@Valid @RequestBody TagRequestDto tagRequestDto) {
        return new ResponseEntity<>(tagService.createTag(tagRequestDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDto> updateTag(@Valid @RequestBody TagRequestDto tagRequestDto, @PathVariable Long id) {
        return new ResponseEntity<>(tagService.updateTag(id, tagRequestDto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
