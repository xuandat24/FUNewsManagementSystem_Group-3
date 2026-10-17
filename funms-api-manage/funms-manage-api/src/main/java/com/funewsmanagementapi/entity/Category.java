package com.funewsmanagementapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Long categoryId;

    @Column(name = "CategoryName", nullable = false, length = 255)
    private String categoryName;

    @Column(name = "CategoryDescription", columnDefinition = "NVARCHAR(MAX)")
    private String categoryDescription;

    @Builder.Default
    @Column(name = "IsActive")
    private Boolean isActive = true;

    @Builder.Default
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<NewsArticle> newsArticles = new ArrayList<>();
}
