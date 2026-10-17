USE master;
GO

-- =========================================================================
-- PHẦN 1: KHỞI TẠO CƠ SỞ DỮ LIỆU (Xóa làm lại nếu đã tồn tại)
-- =========================================================================
IF DB_ID('FUNMS_Group3') IS NOT NULL
BEGIN
    ALTER DATABASE FUNMS_Group3 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE FUNMS_Group3;
END
GO

CREATE DATABASE FUNMS_Group3;
GO

USE FUNMS_Group3;
GO

-- =========================================================================
-- PHẦN 2: TẠO CẤU TRÚC CÁC BẢNG (TABLES)
-- =========================================================================

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
    CategoryID BIGINT IDENTITY(1,1) PRIMARY KEY,
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
    CategoryID BIGINT,
    NewsStatus BIT DEFAULT 1,
    CreatedByID BIGINT,
    UpdatedByID BIGINT,
    ModifiedDate DATETIME,
    
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
GO

-- =========================================================================
-- PHẦN 3: CHÈN DỮ LIỆU MẪU (SEED DATA) BỌC TRONG TRANSACTION
-- =========================================================================
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- 1. Chèn SystemAccount (4 tài khoản)
    INSERT INTO SystemAccount (AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES
    (N'FUNews Administrator', N'admin@funews.edu', 1, N'admin123'),
    (N'Dinh Vuong - News Editor', N'dinhvuong@funews.edu', 2, N'staff123'),
    (N'Dinh Phu - News Editor', N'dinhphu@funews.edu', 2, N'staff123'),
    (N'Xuan Dat - News Editor', N'xuandat@funews.edu', 2, N'staff123');

    -- 2. Chèn Category (15 danh mục)
    INSERT INTO Category (CategoryName, CategoryDescription, IsActive)
    VALUES
    (N'Thông báo chung', N'Tin tức, thông báo và những thông tin quan trọng dành cho toàn thể sinh viên, giảng viên và nhân viên nhà trường.', 1),
    (N'Đào tạo', N'Thông tin về chương trình học, lịch học, lịch thi, đăng ký môn học và các hoạt động giảng dạy.', 1),
    (N'Tuyển sinh', N'Thông tin tuyển sinh, phương thức xét tuyển, chỉ tiêu, hồ sơ và hướng dẫn nhập học cho thí sinh.', 1),
    (N'Học bổng và hỗ trợ tài chính', N'Thông báo về học bổng, miễn giảm học phí, trợ cấp và các chương trình hỗ trợ tài chính cho sinh viên.', 1),
    (N'Nghiên cứu khoa học', N'Tin tức về đề tài nghiên cứu, hội thảo khoa học, cuộc thi học thuật và công bố nghiên cứu của sinh viên, giảng viên.', 1),
    (N'Hợp tác quốc tế', N'Thông tin về chương trình trao đổi, hợp tác với đối tác quốc tế, học tập ở nước ngoài và cơ hội giao lưu đa văn hóa.', 1),
    (N'Sự kiện sinh viên', N'Lịch và tin tức về hội thảo, cuộc thi, chương trình giao lưu và các sự kiện dành cho sinh viên.', 1),
    (N'Hoạt động Đoàn - Hội', N'Thông tin về hoạt động tình nguyện, phong trào thanh niên, công tác Đoàn và hoạt động của các câu lạc bộ.', 1),
    (N'Cơ sở vật chất', N'Thông báo về phòng học, thư viện, phòng thực hành, khuôn viên và các dịch vụ cơ sở vật chất của trường.', 1),
    (N'Công nghệ thông tin', N'Tin tức về hệ thống học tập trực tuyến, cổng thông tin, tài khoản sinh viên và các dịch vụ công nghệ của trường.', 1),
    (N'Việc làm và thực tập', N'Cơ hội thực tập, tuyển dụng, ngày hội việc làm và hướng dẫn phát triển kỹ năng nghề nghiệp.', 1),
    (N'Đời sống sinh viên', N'Thông tin và hướng dẫn liên quan đến sinh hoạt, sức khỏe, tư vấn tâm lý và các dịch vụ hỗ trợ sinh viên.', 1),
    (N'Thành tích và giải thưởng', N'Vinh danh thành tích học tập, nghiên cứu, thể thao, văn nghệ và các giải thưởng của sinh viên, giảng viên.', 1),
    (N'Quy định và chính sách', N'Cập nhật quy chế, quy định, chính sách học vụ và các hướng dẫn chính thức áp dụng trong nhà trường.', 1),
    (N'Cựu sinh viên', N'Tin tức về mạng lưới cựu sinh viên, câu chuyện thành công, hoạt động kết nối và đóng góp cho nhà trường.', 1);

    -- 3. Chèn Tag (20 thẻ tag)
    INSERT INTO Tag (TagName, Note)
    VALUES
    (N'Tuyển sinh', N'Tin tức và hướng dẫn dành cho thí sinh quan tâm đến việc đăng ký vào trường.'),
    (N'Lịch học', N'Thông tin về thời khóa biểu, lịch học và các thay đổi liên quan.'),
    (N'Lịch thi', N'Lịch thi, phòng thi và thông báo điều chỉnh kế hoạch kiểm tra.'),
    (N'Đăng ký môn học', N'Thông tin về đăng ký học phần, thời hạn và hướng dẫn thực hiện.'),
    (N'Học bổng', N'Cơ hội học bổng, điều kiện xét và hướng dẫn nộp hồ sơ.'),
    (N'Học phí', N'Thông báo về mức học phí, thời hạn và phương thức thanh toán.'),
    (N'Thực tập', N'Cơ hội, chương trình và hướng dẫn dành cho sinh viên thực tập.'),
    (N'Việc làm', N'Tin tuyển dụng, cơ hội nghề nghiệp và thông tin từ nhà tuyển dụng.'),
    (N'Hội thảo', N'Các buổi hội thảo, tọa đàm và chia sẻ chuyên môn.'),
    (N'Nghiên cứu khoa học', N'Hoạt động, đề tài và kết quả nghiên cứu khoa học.'),
    (N'Tình nguyện', N'Chương trình tình nguyện và hoạt động phục vụ cộng đồng.'),
    (N'Câu lạc bộ', N'Tin tức và hoạt động của các câu lạc bộ sinh viên.'),
    (N'Cuộc thi', N'Cuộc thi học thuật, kỹ năng, sáng tạo và phong trào sinh viên.'),
    (N'Kỹ năng nghề nghiệp', N'Chương trình giúp sinh viên phát triển kỹ năng phục vụ công việc.'),
    (N'Trao đổi quốc tế', N'Cơ hội học tập, giao lưu và trao đổi với các đối tác quốc tế.'),
    (N'Thư viện', N'Thông tin về tài nguyên, dịch vụ và hoạt động của thư viện.'),
    (N'Công nghệ thông tin', N'Ứng dụng, hệ thống và dịch vụ công nghệ thông tin của trường.'),
    (N'Sức khỏe sinh viên', N'Thông tin về chăm sóc sức khỏe và dịch vụ hỗ trợ sinh viên.'),
    (N'Thành tích sinh viên', N'Tin tuyên dương thành tích học tập, nghiên cứu và hoạt động.'),
    (N'Cựu sinh viên', N'Hoạt động kết nối và câu chuyện từ cộng đồng cựu sinh viên.');

    -- 4. Chèn 30 bài viết vào NewsArticle
    DECLARE @NewsSeed TABLE (
        NewsTitle NVARCHAR(400),
        Headline NVARCHAR(400),
        NewsContent NVARCHAR(MAX),
        NewsSource NVARCHAR(255),
        CategoryName NVARCHAR(255),
        StaffEmail NVARCHAR(100)
    );

    INSERT INTO @NewsSeed (NewsTitle, Headline, NewsContent, NewsSource, CategoryName, StaffEmail)
    VALUES
    (N'Hướng dẫn đăng ký học phần cho học kỳ mới', N'Sinh viên cần kiểm tra điều kiện tiên quyết và thời hạn đăng ký.', N'Sinh viên xem kế hoạch đào tạo, kiểm tra các học phần tiên quyết và đăng ký trên cổng thông tin.', N'Phòng Đào tạo', N'Đào tạo', N'dinhvuong@funews.edu'),
    (N'Lịch thi cuối kỳ được cập nhật trên cổng sinh viên', N'Sinh viên kiểm tra ngày thi, ca thi và phòng thi trước mỗi buổi thi.', N'Lịch thi được đăng trên cổng sinh viên để người học chủ động ôn tập.', N'Phòng Đào tạo', N'Đào tạo', N'dinhphu@funews.edu'),
    (N'Mở đăng ký chương trình học bổng khuyến học', N'Sinh viên đủ điều kiện có thể chuẩn bị hồ sơ theo hướng dẫn xét học bổng.', N'Chương trình học bổng khuyến học hỗ trợ sinh viên có kết quả học tập tốt.', N'Phòng Công tác Sinh viên', N'Học bổng và hỗ trợ tài chính', N'xuandat@funews.edu'),
    (N'Hướng dẫn tra cứu và thanh toán học phí', N'Sinh viên tra cứu học phí và hoàn tất thanh toán qua các kênh được hướng dẫn.', N'Sinh viên có thể xem thông tin học phí trên cổng sinh viên. Lưu lại chứng từ để đối chiếu.', N'Phòng Tài chính - Kế toán', N'Thông báo chung', N'dinhvuong@funews.edu'),
    (N'Thông báo tiếp nhận hồ sơ xét tuyển', N'Thí sinh theo dõi hướng dẫn hồ sơ và các mốc tuyển sinh trên kênh chính thức.', N'Thí sinh cần chuẩn bị đầy đủ giấy tờ theo phương thức xét tuyển đã đăng ký.', N'Phòng Tuyển sinh', N'Tuyển sinh', N'dinhphu@funews.edu'),
    (N'Ngày hội tư vấn ngành học dành cho thí sinh', N'Chương trình cung cấp thông tin về ngành học, đào tạo và đời sống sinh viên.', N'Tại ngày hội, thí sinh và phụ huynh có thể trao đổi với đại diện các đơn vị đào tạo.', N'Phòng Tuyển sinh', N'Tuyển sinh', N'xuandat@funews.edu'),
    (N'Sinh viên trình bày đề tài tại hội thảo nghiên cứu', N'Hội thảo tạo cơ hội để sinh viên chia sẻ kết quả nghiên cứu và nhận góp ý.', N'Các nhóm sinh viên giới thiệu mục tiêu, phương pháp và kết quả đề tài.', N'Phòng Khoa học và Công nghệ', N'Nghiên cứu khoa học', N'dinhvuong@funews.edu'),
    (N'Tiếp nhận đề xuất đề tài nghiên cứu sinh viên', N'Sinh viên có ý tưởng nghiên cứu có thể gửi đề xuất theo hướng dẫn.', N'Đề xuất cần nêu rõ vấn đề nghiên cứu, mục tiêu, phương pháp và kế hoạch.', N'Phòng Khoa học và Công nghệ', N'Nghiên cứu khoa học', N'dinhphu@funews.edu'),
    (N'Giới thiệu chương trình trao đổi học tập quốc tế', N'Sinh viên tìm hiểu điều kiện tham gia, hồ sơ và kế hoạch học tập tại trường đối tác.', N'Chương trình trao đổi giúp sinh viên trải nghiệm môi trường học tập mới.', N'Phòng Hợp tác Quốc tế', N'Hợp tác quốc tế', N'xuandat@funews.edu'),
    (N'Tọa đàm giao lưu với sinh viên quốc tế', N'Buổi giao lưu khuyến khích sinh viên chia sẻ văn hóa và thực hành giao tiếp.', N'Người tham dự sẽ cùng trao đổi về học tập, văn hóa và trải nghiệm sinh viên.', N'Phòng Hợp tác Quốc tế', N'Sự kiện sinh viên', N'dinhvuong@funews.edu'),
    (N'Cuộc thi học thuật mở đăng ký cho sinh viên', N'Các đội thi đăng ký theo thể lệ và chuẩn bị nội dung dự thi đúng thời hạn.', N'Cuộc thi tạo cơ hội để sinh viên vận dụng kiến thức chuyên ngành.', N'Ban Tổ chức', N'Sự kiện sinh viên', N'dinhphu@funews.edu'),
    (N'Chương trình tình nguyện hỗ trợ cộng đồng', N'Sinh viên có thể đăng ký tham gia các hoạt động phục vụ cộng đồng.', N'Tình nguyện viên phối hợp cùng ban tổ chức trong các hoạt động hỗ trợ.', N'Đoàn Thanh niên', N'Hoạt động Đoàn - Hội', N'xuandat@funews.edu'),
    (N'Các câu lạc bộ giới thiệu hoạt động đầu kỳ', N'Sinh viên tìm hiểu lĩnh vực hoạt động và lịch sinh hoạt của các câu lạc bộ.', N'Các câu lạc bộ giới thiệu mục tiêu, hoạt động tiêu biểu và cách đăng ký.', N'Hội Sinh viên', N'Hoạt động Đoàn - Hội', N'dinhvuong@funews.edu'),
    (N'Thông báo lịch phục vụ của thư viện', N'Bạn đọc kiểm tra giờ mở cửa và hướng dẫn sử dụng dịch vụ thư viện.', N'Thư viện cập nhật lịch phục vụ để sinh viên chủ động sắp xếp thời gian học tập.', N'Thư viện', N'Cơ sở vật chất', N'dinhphu@funews.edu'),
    (N'Bảo trì hệ thống cổng thông tin sinh viên', N'Một số dịch vụ trực tuyến có thể tạm gián đoạn trong thời gian bảo trì.', N'Bộ phận kỹ thuật thực hiện bảo trì định kỳ nhằm cải thiện độ ổn định của hệ thống.', N'Trung tâm Công nghệ Thông tin', N'Công nghệ thông tin', N'xuandat@funews.edu'),
    (N'Hướng dẫn bảo vệ tài khoản học tập trực tuyến', N'Sinh viên không chia sẻ mật khẩu và cần cập nhật thông tin khôi phục tài khoản.', N'Để bảo vệ tài khoản, hãy dùng mật khẩu riêng và đăng xuất trên thiết bị chung.', N'Trung tâm Công nghệ Thông tin', N'Công nghệ thông tin', N'dinhvuong@funews.edu'),
    (N'Doanh nghiệp giới thiệu cơ hội thực tập chuyên ngành', N'Sinh viên tìm hiểu vị trí thực tập, yêu cầu ứng tuyển và quy trình gửi hồ sơ.', N'Buổi giới thiệu giúp sinh viên nắm rõ công việc thực tế và kỹ năng cần thiết.', N'Trung tâm Quan hệ Doanh nghiệp', N'Việc làm và thực tập', N'dinhphu@funews.edu'),
    (N'Workshop hoàn thiện hồ sơ và kỹ năng phỏng vấn', N'Sinh viên thực hành trình bày kinh nghiệm và trả lời câu hỏi phỏng vấn.', N'Workshop hướng dẫn cách xây dựng CV rõ ràng và chuẩn bị cho phỏng vấn.', N'Trung tâm Quan hệ Doanh nghiệp', N'Việc làm và thực tập', N'xuandat@funews.edu'),
    (N'Tổ chức buổi tư vấn chăm sóc sức khỏe sinh viên', N'Sinh viên tìm hiểu các nguồn hỗ trợ và cách tiếp cận dịch vụ tư vấn.', N'Buổi tư vấn cung cấp thông tin về chăm sóc sức khỏe thể chất và tinh thần.', N'Phòng Công tác Sinh viên', N'Đời sống sinh viên', N'dinhvuong@funews.edu'),
    (N'Hướng dẫn đăng ký sử dụng dịch vụ hỗ trợ sinh viên', N'Thông tin về các kênh tiếp nhận yêu cầu hỗ trợ được tổng hợp cho sinh viên.', N'Sinh viên nên mô tả rõ vấn đề và cung cấp mã sinh viên khi liên hệ.', N'Phòng Công tác Sinh viên', N'Đời sống sinh viên', N'dinhphu@funews.edu'),
    (N'Vinh danh sinh viên đạt giải tại cuộc thi học thuật', N'Nhà trường ghi nhận nỗ lực và thành tích của sinh viên tham gia cuộc thi.', N'Thành tích tại cuộc thi là kết quả của quá trình học tập và phối hợp nhóm.', N'Phòng Công tác Sinh viên', N'Thành tích và giải thưởng', N'xuandat@funews.edu'),
    (N'Sinh viên chia sẻ dự án sáng tạo tại ngày hội', N'Các nhóm giới thiệu sản phẩm và quá trình phát triển ý tưởng.', N'Ngày hội là dịp để sinh viên trình bày dự án, nhận góp ý và kết nối.', N'Ban Tổ chức', N'Thành tích và giải thưởng', N'dinhvuong@funews.edu'),
    (N'Cập nhật hướng dẫn thực hiện quy chế học vụ', N'Sinh viên nên đọc kỹ hướng dẫn để nắm rõ quy trình và trách nhiệm học tập.', N'Tài liệu tổng hợp các quy trình học vụ thường gặp và kênh liên hệ.', N'Phòng Đào tạo', N'Quy định và chính sách', N'dinhphu@funews.edu'),
    (N'Thông báo quy trình đề nghị xác nhận sinh viên', N'Sinh viên chuẩn bị thông tin cần thiết và gửi yêu cầu theo hướng dẫn.', N'Khi đề nghị xác nhận sinh viên, hãy điền chính xác thông tin cá nhân.', N'Phòng Công tác Sinh viên', N'Quy định và chính sách', N'xuandat@funews.edu'),
    (N'Cựu sinh viên chia sẻ kinh nghiệm phát triển nghề nghiệp', N'Buổi trò chuyện kết nối sinh viên với kinh nghiệm thực tế từ cựu sinh viên.', N'Khách mời chia sẻ hành trình nghề nghiệp và kỹ năng hữu ích.', N'Mạng lưới Cựu Sinh viên', N'Cựu sinh viên', N'dinhvuong@funews.edu'),
    (N'Kết nối cựu sinh viên và sinh viên theo lĩnh vực nghề nghiệp', N'Chương trình tạo cơ hội trao đổi giữa các thế hệ sinh viên.', N'Sinh viên và cựu sinh viên cùng lĩnh vực có thể chia sẻ thông tin nghề nghiệp.', N'Mạng lưới Cựu Sinh viên', N'Cựu sinh viên', N'dinhphu@funews.edu'),
    (N'Bổ sung tài liệu học tập theo đề xuất của sinh viên', N'Thư viện tiếp nhận đề xuất tài liệu phục vụ học tập và nghiên cứu.', N'Sinh viên có thể gửi đề xuất tài liệu kèm tên học phần.', N'Thư viện', N'Cơ sở vật chất', N'xuandat@funews.edu'),
    (N'Cuộc thi kỹ năng nghề nghiệp dành cho sinh viên', N'Thí sinh thử sức với các tình huống thực tế và kỹ năng làm việc.', N'Cuộc thi giúp sinh viên rèn luyện giao tiếp và giải quyết vấn đề.', N'Trung tâm Quan hệ Doanh nghiệp', N'Sự kiện sinh viên', N'dinhvuong@funews.edu'),
    (N'Hướng dẫn chuẩn bị hồ sơ xin học bổng', N'Sinh viên rà soát điều kiện và hoàn thiện hồ sơ trước khi nộp.', N'Trước khi gửi hồ sơ, sinh viên nên kiểm tra tiêu chí xét và minh chứng.', N'Phòng Công tác Sinh viên', N'Học bổng và hỗ trợ tài chính', N'dinhphu@funews.edu'),
    (N'Chương trình chia sẻ phương pháp học tập hiệu quả', N'Sinh viên trao đổi cách lập kế hoạch học tập và cân bằng thời gian.', N'Chương trình tập trung vào việc đặt mục tiêu và chia nhỏ nhiệm vụ.', N'Phòng Đào tạo', N'Đời sống sinh viên', N'xuandat@funews.edu');

    DECLARE @InsertedNews TABLE (
        NewsArticleID BIGINT,
        NewsTitle NVARCHAR(400)
    );

    INSERT INTO NewsArticle (NewsTitle, Headline, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID)
    OUTPUT inserted.NewsArticleID, inserted.NewsTitle
    INTO @InsertedNews (NewsArticleID, NewsTitle)
    SELECT 
        n.NewsTitle, n.Headline, n.NewsContent, n.NewsSource, c.CategoryID, 1, a.AccountID, a.AccountID
    FROM @NewsSeed AS n
    JOIN Category AS c ON c.CategoryName = n.CategoryName
    JOIN SystemAccount AS a ON a.AccountEmail = n.StaffEmail;

    -- 5. Gắn Tag cho bài viết vào bảng NewsTag (60 liên kết)
    DECLARE @NewsTagSeed TABLE (
        NewsTitle NVARCHAR(400),
        TagName NVARCHAR(50)
    );

    INSERT INTO @NewsTagSeed (NewsTitle, TagName)
    VALUES
    (N'Hướng dẫn đăng ký học phần cho học kỳ mới', N'Đăng ký môn học'),
    (N'Hướng dẫn đăng ký học phần cho học kỳ mới', N'Lịch học'),
    (N'Lịch thi cuối kỳ được cập nhật trên cổng sinh viên', N'Lịch thi'),
    (N'Lịch thi cuối kỳ được cập nhật trên cổng sinh viên', N'Lịch học'),
    (N'Mở đăng ký chương trình học bổng khuyến học', N'Học bổng'),
    (N'Mở đăng ký chương trình học bổng khuyến học', N'Học phí'),
    (N'Hướng dẫn tra cứu và thanh toán học phí', N'Học phí'),
    (N'Hướng dẫn tra cứu và thanh toán học phí', N'Công nghệ thông tin'),
    (N'Thông báo tiếp nhận hồ sơ xét tuyển', N'Tuyển sinh'),
    (N'Thông báo tiếp nhận hồ sơ xét tuyển', N'Kỹ năng nghề nghiệp'),
    (N'Ngày hội tư vấn ngành học dành cho thí sinh', N'Tuyển sinh'),
    (N'Ngày hội tư vấn ngành học dành cho thí sinh', N'Hội thảo'),
    (N'Sinh viên trình bày đề tài tại hội thảo nghiên cứu', N'Nghiên cứu khoa học'),
    (N'Sinh viên trình bày đề tài tại hội thảo nghiên cứu', N'Hội thảo'),
    (N'Tiếp nhận đề xuất đề tài nghiên cứu sinh viên', N'Nghiên cứu khoa học'),
    (N'Tiếp nhận đề xuất đề tài nghiên cứu sinh viên', N'Thành tích sinh viên'),
    (N'Giới thiệu chương trình trao đổi học tập quốc tế', N'Trao đổi quốc tế'),
    (N'Giới thiệu chương trình trao đổi học tập quốc tế', N'Học bổng'),
    (N'Tọa đàm giao lưu với sinh viên quốc tế', N'Trao đổi quốc tế'),
    (N'Tọa đàm giao lưu với sinh viên quốc tế', N'Hội thảo'),
    (N'Cuộc thi học thuật mở đăng ký cho sinh viên', N'Cuộc thi'),
    (N'Cuộc thi học thuật mở đăng ký cho sinh viên', N'Đăng ký môn học'),
    (N'Chương trình tình nguyện hỗ trợ cộng đồng', N'Tình nguyện'),
    (N'Chương trình tình nguyện hỗ trợ cộng đồng', N'Câu lạc bộ'),
    (N'Các câu lạc bộ giới thiệu hoạt động đầu kỳ', N'Câu lạc bộ'),
    (N'Các câu lạc bộ giới thiệu hoạt động đầu kỳ', N'Cuộc thi'),
    (N'Thông báo lịch phục vụ của thư viện', N'Thư viện'),
    (N'Thông báo lịch phục vụ của thư viện', N'Lịch học'),
    (N'Bảo trì hệ thống cổng thông tin sinh viên', N'Công nghệ thông tin'),
    (N'Bảo trì hệ thống cổng thông tin sinh viên', N'Đăng ký môn học'),
    (N'Hướng dẫn bảo vệ tài khoản học tập trực tuyến', N'Công nghệ thông tin'),
    (N'Hướng dẫn bảo vệ tài khoản học tập trực tuyến', N'Thư viện'),
    (N'Doanh nghiệp giới thiệu cơ hội thực tập chuyên ngành', N'Thực tập'),
    (N'Doanh nghiệp giới thiệu cơ hội thực tập chuyên ngành', N'Việc làm'),
    (N'Workshop hoàn thiện hồ sơ và kỹ năng phỏng vấn', N'Kỹ năng nghề nghiệp'),
    (N'Workshop hoàn thiện hồ sơ và kỹ năng phỏng vấn', N'Việc làm'),
    (N'Tổ chức buổi tư vấn chăm sóc sức khỏe sinh viên', N'Sức khỏe sinh viên'),
    (N'Tổ chức buổi tư vấn chăm sóc sức khỏe sinh viên', N'Hội thảo'),
    (N'Hướng dẫn đăng ký sử dụng dịch vụ hỗ trợ sinh viên', N'Sức khỏe sinh viên'),
    (N'Hướng dẫn đăng ký sử dụng dịch vụ hỗ trợ sinh viên', N'Công nghệ thông tin'),
    (N'Vinh danh sinh viên đạt giải tại cuộc thi học thuật', N'Thành tích sinh viên'),
    (N'Vinh danh sinh viên đạt giải tại cuộc thi học thuật', N'Cuộc thi'),
    (N'Sinh viên chia sẻ dự án sáng tạo tại ngày hội', N'Thành tích sinh viên'),
    (N'Sinh viên chia sẻ dự án sáng tạo tại ngày hội', N'Câu lạc bộ'),
    (N'Cập nhật hướng dẫn thực hiện quy chế học vụ', N'Đăng ký môn học'),
    (N'Cập nhật hướng dẫn thực hiện quy chế học vụ', N'Lịch học'),
    (N'Thông báo quy trình đề nghị xác nhận sinh viên', N'Công nghệ thông tin'),
    (N'Thông báo quy trình đề nghị xác nhận sinh viên', N'Học phí'),
    (N'Cựu sinh viên chia sẻ kinh nghiệm phát triển nghề nghiệp', N'Cựu sinh viên'),
    (N'Cựu sinh viên chia sẻ kinh nghiệm phát triển nghề nghiệp', N'Kỹ năng nghề nghiệp'),
    (N'Kết nối cựu sinh viên và sinh viên theo lĩnh vực nghề nghiệp', N'Cựu sinh viên'),
    (N'Kết nối cựu sinh viên và sinh viên theo lĩnh vực nghề nghiệp', N'Việc làm'),
    (N'Bổ sung tài liệu học tập theo đề xuất của sinh viên', N'Thư viện'),
    (N'Bổ sung tài liệu học tập theo đề xuất của sinh viên', N'Nghiên cứu khoa học'),
    (N'Cuộc thi kỹ năng nghề nghiệp dành cho sinh viên', N'Cuộc thi'),
    (N'Cuộc thi kỹ năng nghề nghiệp dành cho sinh viên', N'Kỹ năng nghề nghiệp'),
    (N'Hướng dẫn chuẩn bị hồ sơ xin học bổng', N'Học bổng'),
    (N'Hướng dẫn chuẩn bị hồ sơ xin học bổng', N'Thành tích sinh viên'),
    (N'Chương trình chia sẻ phương pháp học tập hiệu quả', N'Kỹ năng nghề nghiệp'),
    (N'Chương trình chia sẻ phương pháp học tập hiệu quả', N'Lịch học');

    INSERT INTO NewsTag (NewsArticleID, TagID)
    SELECT i.NewsArticleID, t.TagID
    FROM @NewsTagSeed AS nt
    JOIN @InsertedNews AS i ON i.NewsTitle = nt.NewsTitle
    JOIN Tag AS t ON t.TagName = nt.TagName;

    COMMIT TRANSACTION;
    PRINT N'=== ĐÃ KHỞI TẠO CƠ SỞ DỮ LIỆU VÀ CHÈN DỮ LIỆU MẪU THÀNH CÔNG 100%! ===';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO

-- =========================================================================
-- PHẦN 4: HIỂN THỊ BẢNG THỐNG KÊ ĐỂ KIỂM TRA
-- =========================================================================
SELECT 
    (SELECT COUNT(*) FROM SystemAccount) AS TotalAccounts,
    (SELECT COUNT(*) FROM Category) AS TotalCategories,
    (SELECT COUNT(*) FROM Tag) AS TotalTags,
    (SELECT COUNT(*) FROM NewsArticle) AS TotalArticles,
    (SELECT COUNT(*) FROM NewsTag) AS TotalNewsTags;
GO