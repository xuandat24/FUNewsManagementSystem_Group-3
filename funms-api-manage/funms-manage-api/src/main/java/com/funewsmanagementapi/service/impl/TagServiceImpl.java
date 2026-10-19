package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.TagRequestDto;
import com.funewsmanagementapi.dto.response.NewsArticleResponseDto;
import com.funewsmanagementapi.dto.response.TagResponseDto;
import com.funewsmanagementapi.entity.NewsArticle;
import com.funewsmanagementapi.entity.Tag;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.TagRepository;
import com.funewsmanagementapi.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

        for(NewsArticle article : tag.getNewsArticles()){
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

//    @Override
//    public TagResponseDto createTag(TagRequestDto dto) {
//        return null;
//    }


}
