CREATE DATABASE FUNMS_Group3
-- 1. Bảng SystemAccount
CREATE TABLE SystemAccount (
    AccountID BIGINT IDENTITY(1,1) PRIMARY KEY, 
    AccountName NVARCHAR(100) NOT NULL,
    AccountEmail NVARCHAR(100) UNIQUE NOT NULL,
    AccountRole INT,
    AccountPassword NVARCHAR(255) NOT NULL
);

-- 2. Bảng Category 
CREATE TABLE Category (
    CategoryID BIGINT IDENTITY(1,1) PRIMARY KEY, -- Đã đồng bộ lên BIGINT
    CategoryName NVARCHAR(255) NOT NULL,
    CategoryDescription NVARCHAR(MAX),
    IsActive BIT DEFAULT 1
);

-- 3. Bảng Tag
CREATE TABLE Tag (
    TagID BIGINT IDENTITY(1,1) PRIMARY KEY,
    TagName NVARCHAR(50) NOT NULL,
    Note NVARCHAR(255)
);

-- 4. Bảng NewsArticle
CREATE TABLE NewsArticle (
    NewsArticleID BIGINT IDENTITY(1,1) PRIMARY KEY, 
    NewsTitle NVARCHAR(400) NOT NULL,
    Headline NVARCHAR(400) NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    NewsContent NVARCHAR(MAX),
    NewsSource NVARCHAR(255),
    CategoryID BIGINT, -- Sửa thành BIGINT để khớp với bảng Category
    NewsStatus BIT DEFAULT 1,
    CreatedByID BIGINT, -- Sửa thành BIGINT để khớp với bảng SystemAccount
    UpdatedByID BIGINT, -- Sửa thành BIGINT để khớp với bảng SystemAccount
    ModifiedDate DATETIME,
    
    -- Khóa ngoại
    CONSTRAINT FK_NewsArticle_Category FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
    CONSTRAINT FK_NewsArticle_CreatedBy FOREIGN KEY (CreatedByID) REFERENCES SystemAccount(AccountID),
    CONSTRAINT FK_NewsArticle_UpdatedBy FOREIGN KEY (UpdatedByID) REFERENCES SystemAccount(AccountID)
);

-- 5. Bảng NewsTag 
CREATE TABLE NewsTag (
    NewsArticleID BIGINT,
    TagID BIGINT,
    
    PRIMARY KEY (NewsArticleID, TagID),
    
    CONSTRAINT FK_NewsTag_Article FOREIGN KEY (NewsArticleID) REFERENCES NewsArticle(NewsArticleID) ON DELETE CASCADE,
    CONSTRAINT FK_NewsTag_Tag FOREIGN KEY (TagID) REFERENCES Tag(TagID) ON DELETE CASCADE
);