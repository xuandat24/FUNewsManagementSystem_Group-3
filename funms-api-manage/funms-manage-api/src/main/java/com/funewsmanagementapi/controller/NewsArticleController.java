package com.funewsmanagementapi.controller;

import com.funewsmanagementapi.dto.request.NewsArticleRequestDto;
import com.funewsmanagementapi.dto.response.NewsDetailDto;
import com.funewsmanagementapi.entity.*;
import com.funewsmanagementapi.repository.*;
import com.funewsmanagementapi.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@CrossOrigin(origins = "http://localhost:5173") // Chi de dev, sau nay can cau hinh theo domain.
public class NewsArticleController {
    private final NewsArticleService service;
    private final CategoryRepository categories;
    private final SystemAccountRepository accounts;
    private final TagRepository tags;

    public NewsArticleController(NewsArticleService service, CategoryRepository categories,
                                 SystemAccountRepository accounts, TagRepository tags) {
        this.service = service;
        this.categories = categories;
        this.accounts = accounts;
        this.tags = tags;
    }

    @GetMapping
    public List<NewsDetailDto> staffList(@RequestParam(required = false) String keyword,
                                          @RequestParam(required = false) Long categoryId) {
        return service.list(keyword, categoryId, false);
    }

    @GetMapping("/public")
    public List<NewsDetailDto> customerList(@RequestParam(required = false) String keyword,
                                             @RequestParam(required = false) Long categoryId) {
        return service.list(keyword, categoryId, true);
    }

    @GetMapping("/public/{id}")
    public NewsDetailDto customerDetail(@PathVariable Long id) { return service.get(id, true); }

    @GetMapping("/{id}")
    public NewsDetailDto staffDetail(@PathVariable Long id) { return service.get(id, false); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NewsDetailDto create(@Valid @RequestBody NewsArticleRequestDto request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public NewsDetailDto update(@PathVariable Long id, @Valid @RequestBody NewsArticleRequestDto request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    // Du lieu cho dropdown cua form. Tra fields nho, KHONG dua password xuong frontend.
    public record Option(Long id, String name) {}

    @GetMapping("/categories")
    public List<Option> categoryOptions() {
        return categories.findAll().stream().map(c -> new Option(c.getCategoryId(), c.getCategoryName())).toList();
    }
    @GetMapping("/authors")
    public List<Option> staffOptions() {
        return accounts.findByAccountRole(2).stream().map(a -> new Option(a.getAccountId(), a.getAccountName())).toList();
    }
    @GetMapping("/tags")
    public List<Option> tagOptions() {
        return tags.findAll().stream().map(t -> new Option(t.getTagId(), t.getTagName())).toList();
    }
}
