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
@Table(name = "SystemAccount")
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID")
    private Long accountId;

    @Column(name = "AccountName", nullable = false, length = 100)
    private String accountName;

    @Column(name = "AccountEmail", nullable = false, unique = true, length = 100)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole;

    @Column(name = "AccountPassword", nullable = false, length = 255)
    private String accountPassword;

    @Builder.Default
    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
    private List<NewsArticle> createdArticles = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "updatedBy", fetch = FetchType.LAZY)
    private List<NewsArticle> updatedArticles = new ArrayList<>();
}
