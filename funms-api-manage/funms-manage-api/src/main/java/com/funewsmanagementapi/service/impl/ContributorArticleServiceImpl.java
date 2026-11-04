package com.funewsmanagementapi.service.impl;

import com.funewsmanagementapi.dto.request.ContributorArticleRequestDto;
import com.funewsmanagementapi.dto.response.ContributorArticleDto;
import com.funewsmanagementapi.entity.*;
import com.funewsmanagementapi.exception.*;
import com.funewsmanagementapi.repository.*;
import com.funewsmanagementapi.service.ContributorArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@Transactional
public class ContributorArticleServiceImpl implements ContributorArticleService {
    private final NewsArticleRepository newsRepo;
    private final CategoryRepository categoryRepo;
    private final SystemAccountRepository accountRepo;
    private final TagRepository tagRepo;

    public ContributorArticleServiceImpl(NewsArticleRepository newsRepo,
            CategoryRepository categoryRepo, SystemAccountRepository accountRepo, TagRepository tagRepo) {
        this.newsRepo = newsRepo;
        this.categoryRepo = categoryRepo;
        this.accountRepo = accountRepo;
        this.tagRepo = tagRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContributorArticleDto> myArticles(Long authorId) {
        List<ContributorArticleDto> result = new ArrayList<>();
        for (NewsArticle article : newsRepo.findByCreatedBy_AccountIdOrderByCreatedDateDesc(authorId)) {
            result.add(toDto(article));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public ContributorArticleDto getMyArticle(Long id, Long authorId) {
        return toDto(ownArticle(id, authorId));
    }

    @Override
    public ContributorArticleDto create(Long authorId, ContributorArticleRequestDto data) {
        SystemAccount author = accountRepo.findById(authorId)
                .orElseThrow(() -> new RecordNotFoundException("Không tìm thấy tài khoản"));
        if (!Integer.valueOf(2).equals(author.getAccountRole()))
            throw new BadRequestException("Chỉ Contributor (Staff) được tạo bản nháp");

        if (newsRepo.existsByNewsTitleIgnoreCase(data.newsTitle().trim()))
            throw new BadRequestException("Tiêu đề bài viết đã tồn tại. Vui lòng nhập tiêu đề khác!");

        NewsArticle article = new NewsArticle();
        setData(article, data);
        article.setCreatedBy(author);
        article.setUpdatedBy(author);
        article.setWorkflowStatus("DRAFT");
        article.setNewsStatus(false);
        return toDto(newsRepo.save(article));
    }

    @Override
    public ContributorArticleDto update(Long id, Long authorId, ContributorArticleRequestDto data) {
        NewsArticle article = ownArticle(id, authorId);
        checkEditable(article);

        if (newsRepo.existsByNewsTitleIgnoreCaseAndNewsArticleIdNot(data.newsTitle().trim(), id))
            throw new BadRequestException("Tiêu đề bài viết đã tồn tại. Vui lòng nhập tiêu đề khác!");

        setData(article, data);
        article.setUpdatedBy(article.getCreatedBy());
        return toDto(newsRepo.save(article));
    }

    @Override
    public ContributorArticleDto submit(Long id, Long authorId) {
        NewsArticle article = ownArticle(id, authorId);
        checkEditable(article);

        if (article.getHeadline() == null || article.getHeadline().isBlank()
                || article.getNewsContent() == null || article.getNewsContent().isBlank()
                || article.getCategory() == null
                || !Boolean.TRUE.equals(article.getCategory().getIsActive()))
            throw new BadRequestException("Cần nhập tóm tắt, nội dung và chọn danh mục đang hoạt động trước khi gửi duyệt");

        article.setWorkflowStatus("PENDING_REVIEW");
        article.setReviewFeedback(null);
        article.setNewsStatus(false);
        return toDto(newsRepo.save(article));
    }

    @Override
    public ContributorArticleDto requestChanges(Long id, Long editorId, String feedback) {
        SystemAccount editor = requireAdmin(editorId);
        NewsArticle article = findPending(id);
        if (feedback == null || feedback.isBlank())
            throw new BadRequestException("Can nhap noi dung yeu cau chinh sua");

        article.setWorkflowStatus("CHANGES_REQUESTED");
        article.setReviewFeedback(feedback.trim());
        article.setNewsStatus(false);
        article.setUpdatedBy(editor);
        return toDto(newsRepo.save(article));
    }

    // Admin can see the queue and review history, including old published posts.
    @Override
    @Transactional(readOnly = true)
    public List<ContributorArticleDto> reviewArticles() {
        List<ContributorArticleDto> result = new ArrayList<>();
        for (NewsArticle article : newsRepo.findAllByOrderByCreatedDateDesc()) {
            result.add(toDto(article));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContributorArticleDto> pendingArticles() {
        List<ContributorArticleDto> result = new ArrayList<>();
        for (NewsArticle article : newsRepo.findByWorkflowStatusOrderByCreatedDateDesc("PENDING_REVIEW")) {
            result.add(toDto(article));
        }
        return result;
    }

    @Override
    public ContributorArticleDto approve(Long id, Long editorId) {
        SystemAccount editor = requireAdmin(editorId);
        NewsArticle article = findPending(id);
        if (article.getNewsTitle() == null || article.getNewsTitle().isBlank()
                || article.getHeadline() == null || article.getHeadline().isBlank()
                || article.getNewsContent() == null || article.getNewsContent().isBlank()
                || article.getCategory() == null
                || !Boolean.TRUE.equals(article.getCategory().getIsActive())) {
            throw new BadRequestException("Bai viet chua du thong tin hoac danh muc da bi khoa");
        }

        article.setWorkflowStatus("PUBLISHED");
        article.setNewsStatus(true);
        article.setReviewFeedback(null);
        article.setUpdatedBy(editor);
        return toDto(newsRepo.save(article));
    }

    @Override
    public ContributorArticleDto reject(Long id, Long editorId, String feedback) {
        SystemAccount editor = requireAdmin(editorId);
        NewsArticle article = findPending(id);
        if (feedback == null || feedback.isBlank())
            throw new BadRequestException("Can nhap ly do tu choi bai viet");

        article.setWorkflowStatus("REJECTED");
        article.setNewsStatus(false);
        article.setReviewFeedback(feedback.trim());
        article.setUpdatedBy(editor);
        return toDto(newsRepo.save(article));
    }

    private SystemAccount requireAdmin(Long editorId) {
        SystemAccount editor = accountRepo.findById(editorId)
                .orElseThrow(() -> new RecordNotFoundException("Khong tim thay Admin"));
        if (!Integer.valueOf(1).equals(editor.getAccountRole()))
            throw new BadRequestException("Chi Admin duoc duyet bai");
        return editor;
    }

    private NewsArticle findPending(Long id) {
        NewsArticle article = newsRepo.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Khong tim thay bai viet ID " + id));
        if (!"PENDING_REVIEW".equals(article.getWorkflowStatus()))
            throw new BadRequestException("Bai viet khong o trang thai cho duyet");
        return article;
    }

    private NewsArticle ownArticle(Long id, Long authorId) {
        NewsArticle article = newsRepo.findById(id)
                .orElseThrow(() -> new RecordNotFoundException("Không tìm thấy bài viết ID " + id));
        if (article.getCreatedBy() == null
                || !authorId.equals(article.getCreatedBy().getAccountId()))
            throw new RecordNotFoundException("Không tìm thấy bài viết của bạn");
        return article;
    }

    private void checkEditable(NewsArticle article) {
        String status = article.getWorkflowStatus();
        if (!"DRAFT".equals(status) && !"CHANGES_REQUESTED".equals(status))
            throw new BadRequestException("Bài viết đang chờ duyệt hoặc đã xuất bản, không thể chỉnh sửa");
    }

    // Drafts only need a title. Other fields can be completed before submission.
    private void setData(NewsArticle article, ContributorArticleRequestDto data) {
        Category category = null;
        if (data.categoryId() != null) {
            category = categoryRepo.findById(data.categoryId())
                    .orElseThrow(() -> new BadRequestException("Danh mục không tồn tại"));
        }

        Set<Long> ids = data.tagIds() == null ? Set.of() : data.tagIds();
        List<Tag> tags = tagRepo.findAllById(ids);
        if (tags.size() != ids.size())
            throw new BadRequestException("Có Tag không tồn tại");

        article.setNewsTitle(data.newsTitle().trim());
        article.setHeadline(data.headline() == null ? "" : data.headline().trim());
        article.setNewsContent(data.newsContent() == null ? "" : data.newsContent().trim());
        article.setNewsSource(data.newsSource() == null ? "" : data.newsSource().trim());
        article.setCategory(category);
        article.setTags(new HashSet<>(tags));
    }

    private ContributorArticleDto toDto(NewsArticle article) {
        Long categoryId = null;
        String categoryName = "";
        if (article.getCategory() != null) {
            categoryId = article.getCategory().getCategoryId();
            categoryName = article.getCategory().getCategoryName();
        }
        Set<Long> ids = new HashSet<>();
        for (Tag tag : article.getTags()) ids.add(tag.getTagId());

        return new ContributorArticleDto(
                article.getNewsArticleId(), article.getNewsTitle(),
                article.getHeadline(), article.getNewsContent(), article.getNewsSource(),
                categoryId, categoryName, article.getWorkflowStatus(),
                article.getReviewFeedback(), article.getCreatedDate(),
                article.getModifiedDate(), ids,
                article.getCreatedBy() == null ? null : article.getCreatedBy().getAccountId(),
                article.getCreatedBy() == null ? "Khong ro" : article.getCreatedBy().getAccountName());
    }
}
