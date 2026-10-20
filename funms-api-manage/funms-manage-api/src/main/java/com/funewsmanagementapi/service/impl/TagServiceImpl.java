package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.TagRequestDto;
import com.funewsmanagementapi.dto.response.NewsArticleResponseDto;
import com.funewsmanagementapi.dto.response.TagResponseDto;
import com.funewsmanagementapi.entity.NewsArticle;
import com.funewsmanagementapi.entity.Tag;
import com.funewsmanagementapi.exception.BadRequestException;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.TagRepository;
import com.funewsmanagementapi.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagServiceImpl implements TagService {
    private final TagRepository tagRepository;

    @Autowired
    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }


    @Override
    public TagResponseDto findTagsById(Long id) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Not found tag with id " + id));
        List<NewsArticleResponseDto> newsArticles = new ArrayList<>();

        for (NewsArticle article : tag.getNewsArticles()) {
            NewsArticleResponseDto dto = NewsArticleResponseDto.builder()
                    .newsArticleId(article.getNewsArticleId())
                    .newsTitle(article.getNewsTitle())
                    .headline(article.getHeadline())
                    .createdDate(article.getCreatedDate())
                    .newsSource(article.getNewsSource())
                    .newsStatus(article.getNewsStatus())
                    .build();

            newsArticles.add(dto);
        }

        newsArticles.sort((a, b) -> b.getNewsArticleId().compareTo(a.getNewsArticleId()));

        return TagResponseDto.builder()
                .id(tag.getTagId())
                .tagName(tag.getTagName())
                .note(tag.getNote())
                .totalArticles((long) newsArticles.size())
                .newsArticles(newsArticles)
                .build();
    }

    @Override
    public Page<TagResponseDto> findAllTags(String name, Pageable pageable) {
        return tagRepository.searchTagsByName(name, pageable);
    }

    @Override
    public List<TagResponseDto> findAllTagsList() {
        List<Tag> tagList = tagRepository.findAll();
        List<TagResponseDto> dtoList = new ArrayList<>();

        for (Tag t : tagList) {
            TagResponseDto dto = TagResponseDto.builder()
                    .id(t.getTagId())
                    .tagName(t.getTagName().trim())
                    .build();
            dtoList.add(dto);
        }
        return dtoList;
    }

    @Override
    @Transactional
    public TagResponseDto createTag(TagRequestDto dto) {
        String tagName = dto.getTagName().trim();

        if (tagRepository.existsByTagNameIgnoreCase(tagName)) {
            throw new BadRequestException("Tag " + tagName + " already exists");
        }

        Tag createdTag = Tag.builder()
                .tagName(tagName)
                .note(dto.getNote() != null ? dto.getNote().trim() : null)
                .build();

        tagRepository.save(createdTag);

        return TagResponseDto.builder()
                .id(createdTag.getTagId())
                .tagName(createdTag.getTagName())
                .note(createdTag.getNote())
                .totalArticles(0L)
                .build();
    }

    @Override
    @Transactional
    public TagResponseDto updateTag(Long id, TagRequestDto dto) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Not found tag with id " + id));
        String tagName = dto.getTagName().trim();
        if (tagRepository.existsByTagNameIgnoreCaseAndTagIdIsNot(tagName, id)) {
            throw new BadRequestException("Tag " + tagName + " already exists");
        }

        tag.setTagName(tagName);
        if (dto.getNote() != null) {
            tag.setNote(dto.getNote().trim());
        }

        Tag updatedTag = tagRepository.save(tag);

        long totalArticles = (updatedTag.getNewsArticles() != null) ? updatedTag.getNewsArticles().size() : 0L;

        return TagResponseDto.builder()
                .id(updatedTag.getTagId())
                .tagName(tagName)
                .note(updatedTag.getNote())
                .totalArticles(totalArticles)
                .build();
    }

    @Override
    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Not found tag with id " + id));
        if (tag.getNewsArticles() != null && !tag.getNewsArticles().isEmpty()) {
            throw new BadRequestException("Tag " + tag.getTagName() + " still has news articles! Delete all its article first!");
        }
        tagRepository.delete(tag);
    }


}
