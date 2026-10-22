package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.TagRequestDto;
import com.funewsmanagementapi.dto.response.TagResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TagService {
    TagResponseDto findTagsById(Long id);

    Page<TagResponseDto> findAllTags(String keyword, Pageable pageable);

    List<TagResponseDto> findAllTagsList();

    TagResponseDto createTag(TagRequestDto dto);

    TagResponseDto updateTag(Long id, TagRequestDto dto);

    void deleteTag(Long id);
}
