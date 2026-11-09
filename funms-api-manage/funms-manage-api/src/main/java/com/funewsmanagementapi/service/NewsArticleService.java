package com.funewsmanagementapi.service;

import com.funewsmanagementapi.dto.request.NewsArticleRequestDto;
import com.funewsmanagementapi.dto.response.NewsArticleResponseDto;
import com.funewsmanagementapi.dto.response.NewsDetailDto;
import com.funewsmanagementapi.entity.*;
import com.funewsmanagementapi.exception.BadRequestException;
import com.funewsmanagementapi.exception.RecordNotFoundException;
import com.funewsmanagementapi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsArticleService {
    private final NewsArticleRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    public NewsArticleService(NewsArticleRepository newsRepository, CategoryRepository categoryRepository,
                              SystemAccountRepository accountRepository, TagRepository tagRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    // Staff xem ca bai da an va bai dang hien; Customer chi xem bai active.
    @Transactional(readOnly = true)
    public List<NewsDetailDto> list(String keyword, Long categoryId, boolean publicOnly) {
        String search = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        return newsRepository.findAllByOrderByCreatedDateDesc().stream()
                .filter(a -> !publicOnly || isPublic(a))
                .filter(a -> categoryId == null || (a.getCategory() != null
                        && categoryId.equals(a.getCategory().getCategoryId())))
                .filter(a -> search.isEmpty() || a.getNewsTitle().toLowerCase(Locale.ROOT).contains(search)
                        || a.getHeadline().toLowerCase(Locale.ROOT).contains(search))
                .map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public NewsDetailDto get(Long id, boolean publicOnly) {
        NewsArticle article = find(id);
        if (publicOnly && !isPublic(article)) {
            throw new RecordNotFoundException("Khong tim thay bai viet");
        }
        return toDto(article);
    }

    @Transactional
    public NewsDetailDto create(NewsArticleRequestDto data) {
        NewsArticle article = new NewsArticle();
        apply(article, data, true);
        return toDto(newsRepository.save(article));
    }

    @Transactional
    public NewsDetailDto update(Long id, NewsArticleRequestDto data) {
        NewsArticle article = find(id);
        apply(article, data, false);
        return toDto(newsRepository.save(article));
    }

    @Transactional
    public void delete(Long id) {
        NewsArticle article = find(id);
        // NewsTag duoc xoa theo FK cascade cua SQL; clear de JPA quan ly bang lien ket.
        article.getTags().clear();
        newsRepository.delete(article);
    }

    // Only approved/published articles may appear to customers.
    private boolean isPublic(NewsArticle article) {
        return Boolean.TRUE.equals(article.getNewsStatus())
                && (article.getWorkflowStatus() == null
                    || "PUBLISHED".equals(article.getWorkflowStatus()))
                && article.getCategory() != null
                && Boolean.TRUE.equals(article.getCategory().getIsActive());
    }

    private NewsArticle find(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Khong tim thay bai viet ID " + id));
    }

    private void apply(NewsArticle article, NewsArticleRequestDto data, boolean creating) {
        Category category = categoryRepository.findById(data.categoryId())
                .orElseThrow(() -> new BadRequestException("Danh muc khong ton tai"));
        SystemAccount staff = accountRepository.findById(data.createdById())
                .orElseThrow(() -> new BadRequestException("Nhan vien khong ton tai"));
        if (!Integer.valueOf(2).equals(staff.getAccountRole())) {
            throw new BadRequestException("Nguoi tao/cap nhat phai co vai tro Staff");
        }
        article.setNewsTitle(data.newsTitle().trim());
        article.setHeadline(data.headline().trim());
        article.setNewsContent(data.newsContent().trim());
        article.setNewsSource(data.newsSource() == null ? "" : data.newsSource().trim());
        article.setCategory(category);
        article.setNewsStatus(data.newsStatus() == null || data.newsStatus());
        if (creating) article.setCreatedBy(staff);
        article.setUpdatedBy(staff);

        Set<Long> ids = data.tagIds() == null ? Set.of() : data.tagIds();
        List<Tag> tags = tagRepository.findAllById(ids);
        if (tags.size() != ids.size()) throw new BadRequestException("Tag khong ton tai");
        article.setTags(new HashSet<>(tags));
    }

    private NewsDetailDto toDto(NewsArticle a) {
        return new NewsDetailDto(a.getNewsArticleId(), a.getNewsTitle(), a.getHeadline(),
                a.getNewsContent(), a.getNewsSource(),
                a.getCategory() == null ? null : a.getCategory().getCategoryId(),
                a.getCategory() == null ? "Khong co" : a.getCategory().getCategoryName(),
                a.getNewsStatus(),
                a.getCreatedBy() == null ? null : a.getCreatedBy().getAccountId(),
                a.getCreatedBy() == null ? "Khong ro" : a.getCreatedBy().getAccountName(),
                a.getCreatedDate(), a.getModifiedDate(),
                a.getTags().stream().map(Tag::getTagId).collect(Collectors.toSet()));
    }

    public List<NewsArticleResponseDto> getPendingArticles() {
        return newsRepository.findArticlesByWorkflowStatus(WorkflowStatus.PENDING_REVIEW);
    }

    @Transactional
    public void approveArticle(Long id, Long editorId){
        NewsArticle article = newsRepository.findById(id).orElseThrow(() -> new RecordNotFoundException("Không tìm thấy bài viết với id " + id));

        if(!WorkflowStatus.PENDING_REVIEW.equals(article.getWorkflowStatus())){
            throw new BadRequestException("Chỉ có thể duyệt bài đang chờ phê duyệt!");
        }

        SystemAccount editor = accountRepository.findById(editorId)
                .orElseThrow(() -> new RecordNotFoundException("Không tìm thấy tài khoản Editor"));

        article.setWorkflowStatus(WorkflowStatus.PUBLISHED);
        article.setNewsStatus(true);
        article.setReviewFeedback(null);
        article.setUpdatedBy(editor);
        newsRepository.save(article);
    }
}
